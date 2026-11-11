// Measurement loop reused from browser-agent-bench/harness/recued/measure.mjs.
// Each invocation owns a fresh, enrolled release-binary realm and one task.
import { startRecued } from './server.mjs';
import { sleep, upload } from './client.mjs';
import { answerTiming } from './clock.mjs';
import { installCatalogPack } from './catalog.mjs';

export async function measure(request) {
  const { task, arm, installation, work, root, config } = request;
  const server = await startRecued(request);
  const { client, events } = server;
  let closing;
  const onSignal = () => { closing ??= server.close().finally(() => process.exit(143)); };
  process.once('SIGTERM', onSignal); process.once('SIGINT', onSignal);
  try {
    let pdfToolkit;
    if (task.packs?.includes('pdftotext')) {
      pdfToolkit = await installCatalogPack(client, root, 'pdftotext');
      const ops = (await client.call('cli.reachability.universe')).tools.flatMap(t => t.operations).filter(op => pdfToolkit.catalogs.includes(op.catalog_slug));
      if (!ops.length) throw new Error('Installed PDFToText pack exposes no local CLI operations.');
      for (const op of ops) await client.call('cli.reachability.set', { ingredient_id: op.catalog_slug, operation_id: op.operation_id, allowed: true });
    }
    const { session_id } = await client.call('chat.session.create');
    await client.call('collection.contract.setRequestPass', { session_id, allow: true });
    const attachments = task.attach ? [{ file_id: await upload(client, server.base, server.bearer, task.attach), media_class: 'document' }] : undefined;
    const known = new Set((await client.call('notification.pending_asks')).asks.map(a => a.ask_id));
    const approvals = [];
    const started = Date.now();
    const sent = await client.call('chat.send', { session_id, message: task.ask, picker_state: { current: 'self' }, ...(attachments ? { attachments } : {}) });
    let quietSince = null; let turns = [];
    const terminal = new Set(['completed', 'failed', 'cancelled', 'interrupted', 'withdrawn']);
    while (true) {
      for (const ask of (await client.call('notification.pending_asks')).asks) {
        if (known.has(ask.ask_id)) continue;
        known.add(ask.ask_id);
        if (ask.options?.some(o => o.id === 'approve')) {
          approvals.push({ at_seconds: (Date.now() - started) / 1000 });
          await client.call('notification.submitAnswer', { ask_id: ask.ask_id, option_id: 'approve' });
        }
      }
      turns = (await client.call('chat.turns.list', { session_id })).turns ?? [];
      if (turns.some(t => t.turn_id === sent.turn_id) && turns.every(t => terminal.has(t.status))) {
        quietSince ??= Date.now();
        if (Date.now() - quietSince >= 2000) break;
      } else quietSince = null;
      if (Date.now() - started > config.maxSeconds * 1000) {
        const visible = events.filter(e => e.kind === 'chat.token_streamed' && e.session_id === session_id).at(-1);
        // Allow the closing brief to finish for accounting. Its latency is
        // outside the user-visible answer clock and the answer deadline.
        if (answerTiming(visible, started, config.maxSeconds).timed_out || Date.now() - started > (config.maxSeconds + 120) * 1000) break;
      }
      await sleep(500);
    }
    const messages = (await client.call('chat.session.get', { session_id })).messages ?? [];
    const answerMessage = messages.filter(m => m.role === 'assistant' && m.content?.trim()).at(-1);
    const streamed = events.filter(e => e.kind === 'chat.token_streamed' && e.session_id === session_id).at(-1);
    const timing = answerTiming(streamed, started, config.maxSeconds);
    const usage = events.filter(e => e.kind === 'chat.transparency' && e.session_id === session_id && e.event?.kind === 'recued.token_usage').map(e => e.event);
    const sum = (items, key) => items.reduce((n, item) => n + (item[key] ?? 0), 0);
    const recipeUsage = [];
    for (const run of (await client.call('execution.list', { since: started, limit: 200 })).runs ?? []) {
      const entry = (await client.call('execution.get', { run_id: run.run_id })).run?.audit?.total_usage;
      if (entry) recipeUsage.push(entry);
    }
    const toolCalls = messages.flatMap(m => m.tool_calls ?? []);
    const toolRows = messages.filter(m => m.role === 'tool').map(m => String(m.content));
    const failures = server.log().split('\n').filter(line => /\[chat\] model call failed/.test(line));
    const error = failures.length ? 'model call failed' : turns.some(t => t.status === 'failed') ? 'chat turn failed' : !streamed ? 'no streamed answer event' : !usage.length ? 'no token usage event' : null;
    return {
      answer: events.filter(e => e.kind === 'chat.token_streamed' && e.session_id === session_id).map(e => e.delta ?? '').join(''), ...timing,
      stored_seconds: answerMessage?.ts ? (answerMessage.ts - started) / 1000 : null,
      answer_streamed: Boolean(streamed), error,
      rounds: usage.length ? sum([...usage, ...recipeUsage], 'provider_calls') : null,
      tokens: usage.length ? { input: sum([...usage, ...recipeUsage], 'input_tokens'), cached: sum([...usage, ...recipeUsage], 'cache_read_input_tokens'), output: sum([...usage, ...recipeUsage], 'output_tokens') } : null,
      chat_tokens: usage.length ? { input: sum(usage, 'input_tokens'), cached: sum(usage, 'cache_read_input_tokens'), output: sum(usage, 'output_tokens') } : null,
      recipe_tokens: { input: sum(recipeUsage, 'input_tokens'), cached: sum(recipeUsage, 'cache_read_input_tokens'), output: sum(recipeUsage, 'output_tokens'), calls: sum(recipeUsage, 'provider_calls') },
      approvals: approvals.length,
      actions: toolCalls.map(c => ({ tool: c.tool_name, status: c.status, ...(config.debug ? { args: c.args } : {}), ...(c.detail ? { detail: String(c.detail).slice(0, 700) } : {}), ...(c.reason ? { reason: c.reason } : {}) })),
      evidence: {
        ...(server.toolkit ? { browser_toolkit: server.toolkit } : {}),
        ...(pdfToolkit ? { pdf_toolkit: pdfToolkit } : {}),
        uploaded: toolCalls.some(c => c.status !== 'error' && (/file_upload/.test(c.tool_name) || JSON.stringify(c.args).includes('"do":"upload"'))),
        saved_file: task.id === 'L' && toolRows.some(row => /"size_bytes"\s*:\s*12499601/.test(row)),
        model_call_failures: failures,
        turn_statuses: turns.map(turn => turn.status),
        pending_asks: (await client.call('notification.pending_asks')).asks.map(ask => ({ kind: ask.kind, options: ask.options?.map(option => option.id) })),
        tool_errors: toolRows.filter(row => /"error"|operation_not_granted|unavailable|failed/i.test(row)).map(row => row.slice(0, 1000)),
        ...(server.mcp ? { mcp_tools: server.mcp.preview.rows.map(r => r.tool), mcp_pack: server.mcp.preview.pack_slug } : {}),
      },
    };
  } finally {
    process.removeListener('SIGTERM', onSignal); process.removeListener('SIGINT', onSignal);
    await server.close();
  }
}
