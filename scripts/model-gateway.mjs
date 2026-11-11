import { createServer } from 'node:http';
import { randomBytes } from 'node:crypto';

// All clients use this same in-memory gateway. It changes model settings only;
// prompts, tools, schemas and responses remain each framework's own. No request body,
// credential, header, model answer or tool argument is logged or persisted here.
export async function startModelGateway({ baseUrl, apiKey, config }) {
  const calls = [];
  const sockets = new Set();
  const controllers = new Set();
  const credential = randomBytes(24).toString('hex');
  const upstream = `${baseUrl.replace(/\/+$/, '').replace(/\/chat\/completions$/, '')}/chat/completions`;
  const server = createServer(async (request, response) => {
    if (request.method !== 'POST' || !request.url?.endsWith('/chat/completions') || request.headers.authorization !== `Bearer ${credential}`) {
      response.writeHead(404).end(); return;
    }
    const controller = new AbortController();
    controllers.add(controller);
    let completionSeen = false;
    // Some SDKs close their SSE reader at finish_reason, before the provider
    // closes its HTTP body. Drain that completed response for its usage packet;
    // an actual mid-generation cancellation must still abort the provider.
    response.on('close', () => { if (!response.writableEnded && !completionSeen) controller.abort(); });
    const metric = { started_at: new Date().toISOString(), seconds: null, status: null, reasoning_tokens: null, usage: null, tools: [], tool_calls: [], structured_output: false };
    calls.push(metric);
    const started = Date.now();
    let phase = 'request';
    try {
      const chunks = [];
      for await (const chunk of request) {
        chunks.push(chunk);
        if (chunks.reduce((n, x) => n + x.length, 0) > 16 * 1024 * 1024) throw new Error('Model request too large.');
      }
      const body = JSON.parse(Buffer.concat(chunks));
      const catalogNames = (body.messages ?? []).flatMap(message => [...String(typeof message.content === 'string' ? message.content : JSON.stringify(message.content)).matchAll(/"recipe_slug"\s*:\s*"([^"\\]+)"/g)].map(match => match[1]));
      metric.tools = [...new Set([...(body.tools ?? []).map(t => t.function?.name).filter(Boolean), ...catalogNames])];
      metric.structured_output = Boolean(body.response_format);
      body.model = config.model;
      body.temperature = config.temperature;
      body.frequency_penalty = config.frequencyPenalty ?? 0;
      delete body.max_completion_tokens;
      body.max_tokens = config.maxOutputTokens;
      if (config.thinking !== 'default') body.enable_thinking = config.thinking === 'on';
      metric.requested_enable_thinking = body.enable_thinking ?? null;
      metric.reasoning_content_present = false;
      if (body.stream) body.stream_options = { ...body.stream_options, include_usage: true };
      phase = 'provider';
      const result = await fetch(upstream, {
        method: 'POST', headers: { 'content-type': 'application/json', authorization: `Bearer ${apiKey}` },
        body: JSON.stringify(body), signal: AbortSignal.any([controller.signal, AbortSignal.timeout(config.maxSeconds * 1000)]),
      });
      metric.status = result.status;
      phase = 'response';
      response.writeHead(result.status, { 'content-type': result.headers.get('content-type') ?? 'application/json' });
      const observe = packet => {
        if (packet.usage) {
          metric.usage = packet.usage;
          metric.reasoning_tokens = packet.usage.completion_tokens_details?.reasoning_tokens ?? null;
        }
        for (const choice of packet.choices ?? []) {
          if (choice.finish_reason != null) completionSeen = true;
          const message = choice.message ?? choice.delta;
          if (message?.reasoning_content) metric.reasoning_content_present = true;
          for (const call of message?.tool_calls ?? []) if (call.function?.name) metric.tool_calls.push(call.function.name);
          if (typeof message?.content === 'string') {
            try {
              const output = JSON.parse(message.content);
              for (const call of output.tool_calls ?? []) if (call.tool || call.tool_name) metric.tool_calls.push(call.tool ?? call.tool_name);
            } catch { /* Other frameworks return ordinary text or another schema. */ }
          }
        }
      };
      let buffered = '';
      const decoder = new TextDecoder();
      const observeLine = line => {
        if (!line.startsWith('data:')) return;
        const data = line.slice(5).trim();
        if (data === '[DONE]') { completionSeen = true; return; }
        try { observe(JSON.parse(data)); } catch { /* SSE comments and non-JSON data have no counters. */ }
      };
      for await (const chunk of result.body) {
        buffered += decoder.decode(chunk, { stream: true });
        if (body.stream) {
          const lines = buffered.split('\n'); buffered = lines.pop();
          for (const line of lines) observeLine(line);
        }
        if (!response.destroyed) response.write(chunk);
      }
      buffered += decoder.decode();
      if (body.stream) { if (buffered) observeLine(buffered); }
      else observe(JSON.parse(buffered));
      if (!response.destroyed) response.end();
    } catch (error) {
      metric.error = controller.signal.aborted ? 'cancelled' : error.name === 'TimeoutError' ? 'provider timeout' : 'provider transport or response error';
      metric.failure_kind = controller.signal.aborted ? 'cancelled' : error.name === 'TimeoutError' ? 'provider-timeout' : phase === 'provider' ? 'provider-transport' : phase === 'request' ? 'invalid-request' : 'invalid-response';
      const code = error.cause?.code ?? error.code;
      if (typeof code === 'string' && /^(?:E[A-Z_]+|UND_ERR_[A-Z_]+)$/.test(code)) metric.error_code = code;
      if (!response.headersSent) response.writeHead(502, { 'content-type': 'application/json' }).end(JSON.stringify({ error: { message: metric.error, type: 'bench_gateway' } }));
      else response.end();
    } finally {
      metric.seconds = (Date.now() - started) / 1000;
      controllers.delete(controller);
    }
  });
  server.on('connection', socket => { sockets.add(socket); socket.on('close', () => sockets.delete(socket)); });
  await new Promise((resolve, reject) => { server.once('error', reject); server.listen(0, '127.0.0.1', resolve); });
  return {
    baseUrl: `http://127.0.0.1:${server.address().port}/v1`, credential,
    calls: () => structuredClone(calls),
    reset: () => calls.splice(0),
    close: async () => { controllers.forEach(c => c.abort()); sockets.forEach(s => s.destroy()); await new Promise(resolve => server.close(resolve)); },
  };
}
