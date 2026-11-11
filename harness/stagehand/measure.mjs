import { Stagehand } from '@browserbasehq/stagehand';
import { mkdirSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { createServer } from 'node:net';
import { z } from 'zod';
import { agentAnswer } from './result.mjs';

function filesIn(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap(entry => {
    const path = join(directory, entry.name);
    return entry.isDirectory() ? filesIn(path) : [{ name: entry.name, size_bytes: statSync(path).size }];
  });
}
const freePort = () => new Promise((resolve, reject) => {
  const server = createServer(); server.once('error', reject);
  server.listen(0, '127.0.0.1', () => { const port = server.address().port; server.close(() => resolve(port)); });
});

export async function measure({ task, config, installation, work, gateway }) {
  const downloads = join(work, 'downloads'); mkdirSync(downloads, { recursive: true });
  mkdirSync(join(work, 'profile'), { recursive: true });
  let attached;
  if (task.attach) { attached = join(work, task.attach.filename); writeFileSync(attached, task.attach.text); }
  const port = await freePort();
  let rounds = 0; const modelCalls = [];
  const middleware = {
    wrapGenerate: async ({ doGenerate }) => {
      rounds += 1;
      const metric = { usage: null, error: false }; modelCalls.push(metric);
      try { const response = await doGenerate(); metric.usage = response.usage; return response; }
      catch (error) { metric.error = true; throw error; }
    },
  };
  const model = { modelName: `openai/${config.model}`, baseURL: gateway.baseUrl, apiKey: gateway.credential, openaiEndpointFormat: 'chat', temperature: config.temperature, middleware };
  const stagehand = new Stagehand({
    env: 'LOCAL', model, disableAPI: true, experimental: true, serverCache: false,
    verbose: 0, disablePino: true, logger: () => {}, logInferenceToFile: false,
    localBrowserLaunchOptions: {
      executablePath: installation.chromium, userDataDir: join(work, 'profile'),
      headless: true, chromiumSandbox: false, args: ['--no-sandbox'], port, viewport: { width: 1280, height: 900 },
      acceptDownloads: true, downloadsPath: downloads,
    },
  });
  let auditBrowser; let timer; let closing;
  const close = async () => { await auditBrowser?.close().catch(() => {}); await stagehand.close().catch(() => {}); };
  const onSignal = () => { closing ??= close().finally(() => process.exit(143)); };
  process.once('SIGTERM', onSignal); process.once('SIGINT', onSignal);
  const controller = new AbortController();
  let timedOut = false; let error = null; let result; let uploaded = false;
  let started; let seconds; let metrics;
  const steps = [];
  try {
    await stagehand.init();
    const page = stagehand.context.pages()[0] ?? await stagehand.context.newPage();
    // Passive upload evidence only; this observer performs no browser action.
    if (task.id === 'J') {
      const { chromium } = await import('playwright');
      auditBrowser = await chromium.connectOverCDP(`http://127.0.0.1:${port}`);
      const context = auditBrowser.contexts()[0];
      context.on('request', request => {
        if (request.method() === 'POST' && request.url().startsWith('https://practice.expandtesting.com/')
          && /multipart\/form-data/i.test(request.headers()['content-type'] ?? '')) uploaded = true;
      });
    }
    const agent = stagehand.agent({ mode: 'dom', stream: false, model, executionModel: model });
    started = Date.now();
    timer = setTimeout(() => { timedOut = true; controller.abort(); }, config.maxSeconds * 1000);
    try {
      result = await agent.execute({
        instruction: task.ask, page, maxSteps: config.maxSteps, signal: controller.signal,
        output: z.object({ answer: z.string().describe('The answer requested by the user.') }),
        excludeTools: ['screenshot'], useSearch: false,
        ...(attached ? { variables: { attached_file_path: { value: attached, description: `The attached file ${task.attach.filename}, available for upload.` } } } : {}),
        callbacks: { onStepFinish: event => {
          steps.push({ finish_reason: event.finishReason, tools: (event.toolCalls ?? []).map(call => call.toolName), usage: event.usage });
        } },
      });
    } catch (failure) { error = `${failure.name}: ${failure.message}`; }
    seconds = (Date.now() - started) / 1000;
    clearTimeout(timer); timer = null;
    metrics = await stagehand.metrics;
    if (!result?.success || !result?.completed) error ??= 'agent did not finish';
    const answer = agentAnswer(result);
    if (answer === null) error ??= 'native agent returned no requested output';
    const saved = filesIn(downloads);
    const sumUsage = key => modelCalls.length && modelCalls.every(call => typeof call.usage?.[key] === 'number')
      ? modelCalls.reduce((sum, call) => sum + call.usage[key], 0) : null;
    return {
      answer: answer ?? '', seconds, rounds, timed_out: timedOut, error,
      tokens: { input: sumUsage('inputTokens'), cached: sumUsage('cachedInputTokens'), output: sumUsage('outputTokens') },
      approvals: 0, actions: (result?.actions ?? []).map(action => ({ type: action.type, action: action.action, instruction: action.instruction })),
      evidence: { uploaded, saved_file: saved.some(file => file.size_bytes === 12499601), files: saved,
        native_agent_steps: steps, native_model_calls: modelCalls, native_metrics: metrics, native_agent_usage: result?.usage,
        native_completion_assessment: result?.message ?? '',
        native_completed: result?.completed ?? false, native_success: result?.success ?? false },
    };
  } finally {
    clearTimeout(timer);
    process.removeListener('SIGTERM', onSignal); process.removeListener('SIGINT', onSignal);
    await close();
  }
}
