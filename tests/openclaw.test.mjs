import test from 'node:test';
import assert from 'node:assert/strict';
import { homedir } from 'node:os';
import { join } from 'node:path';
import { nativeMeasurements, nativeActions } from '../harness/openclaw/result.mjs';
import { openclawConfig } from '../harness/openclaw/config.mjs';
import { nativeCli } from '../harness/openclaw/native-cli.mjs';

const native = { payloads: [{ text: 'The actual answer.' }], meta: { durationMs: 6000, aborted: false, agentMeta: { assistantTurns: 1, agentHarnessId: 'openclaw', terminalReceipt: { runId: 'main' } } } };
const agent = (stream, ts, data) => ({ source: 'agent', event: { runId: 'main', stream, ts, data } });
const call = (callId, usage) => [
  { source: 'diagnostic', event: { type: 'model.call.started', callId, ts: 2100 } },
  { source: 'diagnostic', event: { type: 'model.call.completed', callId, ts: 2500, usage } },
];
const usage = { input: 80, cacheRead: 20, cacheWrite: 0, output: 10, promptTokens: 100, usageReport: { state: 'available' }, cacheTelemetry: { state: 'available' } };
const timing = [agent('lifecycle', 2000, { phase: 'start', startedAt: 2000 }), agent('assistant', 3000, { text: 'The actual answer.' }), agent('lifecycle', 3300, { phase: 'end', startedAt: 1500, endedAt: 3300 })];

test('native tool results redact owned paths before truncation can expose a partial private directory', () => {
  const work = join(homedir(), 'private-bench-directory-'.repeat(8), 'task');
  const [action] = nativeActions([{ name: 'browser', phase: 'result', args: { path: work }, result: { content: [{ text: 'x'.repeat(1130) + work + '/attachment.txt' }] } }], [work]);
  assert.equal(action.args.path, '[local]');
  assert.equal(action.result.includes('private-bench-directory-'), false);
  assert.equal(action.result.includes(homedir()), false);
  assert.ok(action.result.includes('[local]'));
  assert.ok(action.result.length <= 1200);
});

test('OpenClaw counts native helper calls, deduplicates events, and includes cached input once', () => {
  const calls = [...call('main-call', usage), ...call('pdf-helper', { ...usage, input: 5, cacheRead: 10, promptTokens: 15, output: 3 })];
  const result = nativeMeasurements(native, [...timing, ...calls, calls[1]], 480);
  assert.equal(result.answer, 'The actual answer.');
  assert.equal(result.rounds, 2);
  assert.equal(result.native_summary.assistant_turns, 1);
  assert.deepEqual(result.tokens, { input: 115, output: 13, cached: 30 });
  assert.equal(result.accounting_complete, true);
});

test('OpenClaw answer timing uses native run and assistant timestamps rather than process startup or final cleanup', () => {
  const result = nativeMeasurements(native, [...timing, ...call('one', usage)], 480);
  assert.equal(result.seconds, 1.5);
  assert.equal(result.clock.source, 'native-assistant-event');
  const failure = nativeMeasurements({ payloads: [], meta: { aborted: true } }, timing.filter(row => row.event.stream !== 'assistant'), 480);
  assert.equal(failure.timed_out, true);
  assert.equal(failure.seconds, 1.8);
  assert.equal(failure.answer, '');
});

test('OpenClaw incomplete model accounting remains unknown instead of inventing zero token usage', () => {
  const pending = { source: 'diagnostic', event: { type: 'model.call.started', callId: 'pending' } };
  const result = nativeMeasurements(native, [...timing, ...call('one', usage), pending], 480);
  assert.equal(result.rounds, 2);
  assert.deepEqual(result.tokens, { input: null, output: null, cached: null });
  assert.equal(result.accounting_complete, false);
  assert.equal(nativeMeasurements(native, timing, 480).rounds, null);
});

test('a native tool timeout cannot be replaced by an earlier progress message or a final-looking payload', () => {
  const failed = agent('lifecycle', 482000, { phase: 'error', startedAt: 2000, timeoutPhase: 'tool_execution', error: 'Tool execution timed out with an unknown outcome.' });
  const result = nativeMeasurements(native, [...timing.slice(0, 2), failed, ...call('one', usage)], 480);
  assert.equal(result.timed_out, true);
  assert.equal(result.seconds, 480);
  assert.equal(result.clock.source, 'native-lifecycle-error');
  assert.match(result.error, /unknown outcome/);
});

test('OpenClaw native provider configuration preserves the shared model and routes requests through the benchmark gateway', () => {
  const config = openclawConfig({ config: { model: 'same-model', thinking: 'off', temperature: 0.2, maxOutputTokens: 4000, maxSeconds: 480 }, work: '/owned-task', gateway: { baseUrl: 'http://127.0.0.1:1234/v1', credential: 'temporary-gateway-key' }, cdpPort: 4321, gatewayPort: 4323 });
  assert.equal(config.agents.defaults.model.primary, 'bench/same-model');
  assert.equal(config.agents.defaults.thinkingDefault, 'off');
  assert.deepEqual(config.agents.defaults.models['bench/same-model'].params, { temperature: 0.2, maxTokens: 4000 });
  assert.equal(config.models.providers.bench.baseUrl, 'http://127.0.0.1:1234/v1');
  assert.equal(config.browser.profiles.bench.cdpUrl, 'http://127.0.0.1:4321');
  assert.equal(config.tools.deny.includes('web_fetch'), true);
  assert.equal(config.tools.deny.includes('web_search'), true);
  const steering = openclawConfig({ config: { model: 'same-model' }, work: '/owned-task', gateway: { baseUrl: 'http://localhost', credential: 'temporary' }, cdpPort: 4321, gatewayPort: 4323, browserUse: true });
  assert.equal(steering.browser.enabled, false);
  assert.equal(steering.plugins.entries.browser.enabled, false);
  assert.equal(steering.tools.deny.includes('browser'), true);
  assert.deepEqual(steering.tools.exec.pathPrepend, ['/owned-task/bin']);
});

test('a completed native CLI reply is retained when browser resources keep its process alive', async () => {
  const reply = { payloads: [{ text: 'Finished correctly.' }], meta: { aborted: false } };
  const result = await nativeCli({ command: process.execPath, args: ['-e', `require('node:child_process').spawn(process.execPath, ['-e', 'setInterval(() => {}, 1000)'], {stdio:'inherit'}); process.stdout.write(${JSON.stringify(JSON.stringify(reply))}); process.exit(0)`], env: {}, timeoutMs: 2000, cleanupMs: 20 });
  assert.equal(result.timedOut, false);
  assert.equal(result.cleanupForced, true);
  assert.deepEqual(result.native, reply);
});
