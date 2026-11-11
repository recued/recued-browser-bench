import test from 'node:test';
import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { homedir } from 'node:os';
import { join } from 'node:path';
import { configuration, schedule } from '../scripts/config.mjs';
import { startModelGateway } from '../scripts/model-gateway.mjs';
import { sanitize } from '../scripts/privacy.mjs';
import { grade, checkedOracle } from '../scripts/grade.mjs';
import { outcome } from '../scripts/outcome.mjs';
import { report } from '../scripts/report.mjs';
import { startLiveSite } from '../harness/live-site/site.mjs';
import { reasoningProof } from '../scripts/qualification.mjs';
import { answerTiming } from '../harness/recued/clock.mjs';
import { agentAnswer } from '../harness/stagehand/result.mjs';
import { taskSet } from '../scripts/tasks.mjs';

const good = { answer: 'Bob invoice 1043 deleted.', seconds: 4, rounds: 2, tokens: { input: 10, cached: 2, output: 3 } };
test('Stagehand assessments cannot stand in for requested output data', () => {
  const assessment = { message: 'I read Menabrea and provided the requested summary successfully.' };
  assert.equal(agentAnswer(assessment), null);
  assert.equal(agentAnswer({ ...assessment, output: { answer: 'The actual requested summary.' } }), 'The actual requested summary.');
  assert.equal(agentAnswer({ ...assessment, output: { answer: '' } }), null);
});
test('Recued answer deadlines use the streamed answer even when the closing brief finishes later', () => {
  assert.deepEqual(answerTiming({ received_at: 9000 }, 1000, 10), { seconds: 8, timed_out: false });
  assert.deepEqual(answerTiming({ received_at: 12000 }, 1000, 10), { seconds: 11, timed_out: true });
  assert.deepEqual(answerTiming(undefined, 1000, 10), { seconds: null, timed_out: true });
});
test('thinking-off evidence accepts missing counters without inventing zero and rejects contradictions or incomplete calls', () => {
  const call = { status: 200, seconds: 1, requested_enable_thinking: false, reasoning_content_present: false, reasoning_tokens: null };
  const proof = reasoningProof([call], 'off');
  assert.deepEqual(proof, { checked: 0, calls: 1, all_zero: null, requested_switch_verified: true, reasoning_content_seen: false, status: 'counter-unreported', counter_verified: false, accepted: true, acceptance_basis: 'requested-off-and-no-reasoning-content' });
  const explicit = reasoningProof([{ ...call, reasoning_tokens: 0 }], 'off');
  assert.equal(explicit.accepted, true);
  assert.equal(explicit.counter_verified, true);
  assert.equal(explicit.acceptance_basis, 'explicit-zero-counter');
  for (const patch of [{ status: 500 }, { seconds: null }, { error: 'failed' }, { requested_enable_thinking: true }, { reasoning_tokens: 12 }, { reasoning_content_present: true }]) {
    assert.equal(reasoningProof([call, { ...call, ...patch }], 'off').accepted, false);
  }
  assert.equal(reasoningProof([], 'off').accepted, false);
  assert.equal(reasoningProof([{ ...call, reasoning_tokens: 12 }], 'off').status, 'failed');
});
test('a plausible answer cannot hide deleting the wrong row or another row too', () => {
  const task = { id: 'X', live_events: [{ deleted: 'Bob — Invoice 1043 for October' }], expect: [] };
  assert.equal(grade(task, good, {}, [{ deleted: 'Ada — Invoice 1042' }]).right, false);
  assert.equal(grade(task, good, {}, [...task.live_events, { deleted: 'Ada — Invoice 1042' }]).right, false);
  assert.equal(grade(task, good, {}, task.live_events).right, true);
});
test('timeouts and model failures count wrong even with a matching answer', () => {
  assert.equal(grade({ id: 'A', expect: [] }, { ...good, timed_out: true }).right, false);
  assert.equal(grade({ id: 'A', expect: [] }, { ...good, error: 'model call failed' }).right, false);
});
test('HN requires the live title and points, and a failed oracle fails closed', () => {
  const task = { id: 'B', reads_the_page_after: 'top_story', expect: [] };
  const oracle = { title: 'A real current story', points: 42 };
  assert.equal(grade(task, { ...good, answer: 'An invented story with 42 points.' }, oracle).right, false);
  assert.equal(grade(task, { ...good, answer: 'A real current story — 42 points.' }, oracle).right, true);
  assert.equal(grade(task, good, { error: 'unavailable' }).right, false);
});
test('missing live checker content is a technical failure rather than a model answer mismatch', () => {
  const task = { id: 'D', reads_the_page_after: 'see_also', expect: [] };
  const result = { ...good, task_id: 'D', answer: 'Women in STEM fields.' };
  const checked = checkedOracle(task, { title: null });
  const verdict = grade(task, result, checked);
  assert.equal(verdict.right, false);
  assert.deepEqual(verdict.missing, ['live page check unavailable']);
  assert.equal(outcome({ ...result, ...verdict, oracle: checked }).retryable, true);
  assert.equal(outcome({ ...result, ...grade(task, result, { title: null }), oracle: { title: null } }).retryable, true);
  assert.equal(grade(task, result, { title: 'Women in STEM fields' }).right, true);
  assert.equal(outcome({ ...result, ...grade(task, result, { title: 'A different title' }), oracle: { title: 'A different title' } }).retryable, false);
});
test('upload and download claims require action or saved-file evidence', () => {
  for (const id of ['J', 'L']) assert.equal(grade({ id }, good).right, false);
});
test('the PDF task requires its requested sentence rather than a paraphrase with the same keywords', () => {
  const task = taskSet('http://fixture.test').find(task => task.id === 'K');
  assert.equal(grade(task, { ...good, answer: 'A happy dog is relaxing in the grass.' }).right, false);
  assert.equal(grade(task, { ...good, answer: '“The following image shows a happy looking dog lying in some grass:”' }).right, true);
});
test('rotation gives every selected arm every task and repetition', () => {
  const arms = ['a', 'b', 'c', 'd'];
  const entries = schedule(['X', 'Y', 'A', 'B'], arms, 2);
  assert.equal(entries.length, 32);
  assert.deepEqual(entries.filter(e => e.run === 1).filter((_, i) => i % 4 === 0).map(e => e.arm), arms);
  for (const task of ['X', 'Y', 'A', 'B']) assert.deepEqual(entries.filter(e => e.task === task && e.run === 2).map(e => e.arm).sort(), [...arms].sort());
});
test('configuration overrides are shared and keys stay outside the serialized configuration', () => {
  const input = configuration(['--model', 'custom-model', '--thinking', 'on', '--arms', 'browser-use,recued-bridge', '--runs', '1'], { BENCH_API_KEY: 'secret-example', BENCH_BASE_URL: 'https://example.test/v1' });
  assert.equal(input.config.model, 'custom-model'); assert.equal(input.config.thinking, 'on');
  assert.ok(!JSON.stringify(input.config).includes('secret-example'));
  assert.throws(() => configuration(['--runs=-1'], {}), /positive/);
});
test('records redact credentials, local paths and private fixture origins', () => {
  const output = JSON.stringify(sanitize({ text: 'secret-example Bearer abcxyz /Users/someone/private/task http://127.0.0.1:1234/inbox sk-1234567890123456789', nested: ['secret-example'] }, { secrets: ['secret-example'] }));
  for (const secret of ['secret-example', 'abcxyz', '/Users/', '127.0.0.1', 'sk-1234']) assert.ok(!output.includes(secret));
});
test('echoed client addresses are private even when publicly routable; browser versions remain intact', () => {
  assert.equal(sanitize({ origin: '203.0.113.42, 2001:db8::42', version: '149.0.7827.55' }).origin, '[network-address], [network-address]');
  assert.equal(sanitize({ version: '149.0.7827.55' }).version, '149.0.7827.55');
  assert.equal(sanitize('connect ECONNREFUSED 127.0.0.1:38897; client 203.0.113.42:443'), 'connect ECONNREFUSED [network-address]:38897; client [network-address]:443');
  assert.deepEqual(sanitize({ catalog_tag: 'catalog/26.11.9.1', client: '26.11.9.1' }), { catalog_tag: 'catalog/26.11.9.1', client: '[network-address]' });
});

test('nested redaction removes owned task paths even after an earlier pass masked HOME', () => {
  const root = join(homedir(), 'unit-test-bench'), work = join(root, '.bench/runs/task-owned');
  const inner = sanitize({ command: `write ${work}/downloads/example.zip` });
  const outer = sanitize(inner, { paths: [root, work] });
  assert.deepEqual(outer, { command: 'write [local]/downloads/example.zip' });
});
test('the site exposes its oracle only to the runner', async () => {
  const site = await startLiveSite();
  try {
    assert.equal((await fetch(`${site.origin}/events`)).status, 404);
    await fetch(`${site.origin}/offer/winter-tyres`);
    assert.deepEqual(site.events(), [{ opened: 'winter-tyres' }]);
    site.reset(); assert.deepEqual(site.events(), []);
  } finally { await site.close(); }
});
test('reports retain every failure in denominators and exclude failed times from successful medians', () => {
  const text = report([{ ...good, task_id: 'X', arm: 'a', run: 1, right: true, qualified: true, reasoning: { status: 'counter-unreported', accepted: true } }, { ...good, seconds: 1, rounds: 1, task_id: 'X', arm: 'a', run: 2, right: false, qualified: false, missing: ['provider failure'] }]);
  assert.match(text, /\| X \| a \| 1 \/ 2 \| 4 \| 2 \|/);
  assert.match(text, /provider failure/);
  assert.match(text, /1 meet the accepted policy/);
  assert.match(text, /without claiming a measured zero/);
  assert.match(text, /1 attempts do not meet/);
});
test('the gateway enforces settings without changing tool schemas and observes reasoning usage', async () => {
  let received;
  const upstream = createServer(async (request, response) => {
    let data = ''; for await (const b of request) data += b;
    received = JSON.parse(data);
    assert.equal(request.headers.authorization, 'Bearer test-provider-key');
    response.writeHead(200, { 'content-type': 'application/json' }).end(JSON.stringify({ choices: [{ message: { content: 'answer' } }], usage: { prompt_tokens: 5, completion_tokens: 2, completion_tokens_details: { reasoning_tokens: 0 } } }));
  });
  await new Promise(resolve => upstream.listen(0, '127.0.0.1', resolve));
  const gateway = await startModelGateway({ baseUrl: `http://127.0.0.1:${upstream.address().port}/v1`, apiKey: 'test-provider-key', config: { model: 'same-model', temperature: 0.2, thinking: 'off', maxOutputTokens: 4000, maxSeconds: 10 } });
  try {
    const tools = [{ type: 'function', function: { name: 'browser_call', parameters: { type: 'object', properties: {} } } }];
    const result = await fetch(`${gateway.baseUrl}/chat/completions`, { method: 'POST', headers: { authorization: `Bearer ${gateway.credential}`, 'content-type': 'application/json' }, body: JSON.stringify({ model: 'other-model', enable_thinking: true, temperature: 1, tools }) });
    assert.equal(result.status, 200); await result.json();
    assert.deepEqual(received.tools, tools); assert.equal(received.model, 'same-model'); assert.equal(received.enable_thinking, false); assert.equal(received.temperature, 0.2);
    assert.equal(gateway.calls()[0].reasoning_tokens, 0);
    assert.ok(!JSON.stringify(gateway.calls()).includes('test-provider-key'));
  } finally { await gateway.close(); await new Promise(resolve => upstream.close(resolve)); }
});

test('the gateway drains terminal SSE usage when a client closes at finish_reason, but aborts partial generations', async () => {
  const timers = new Set();
  const upstream = createServer(async (request, response) => {
    let data = ''; for await (const bytes of request) data += bytes;
    const body = JSON.parse(data);
    response.writeHead(200, { 'content-type': 'text/event-stream' });
    response.write(`data: ${JSON.stringify({ choices: [{ delta: { content: 'answer' }, finish_reason: body.messages?.length ? null : 'stop' }] })}\n\n`);
    const timer = setTimeout(() => {
      timers.delete(timer);
      response.end(`data: ${JSON.stringify({ choices: [], usage: { prompt_tokens: 9, completion_tokens: 2, completion_tokens_details: { reasoning_tokens: 0 } } })}\n\ndata: [DONE]\n\n`);
    }, 80);
    timers.add(timer);
    response.on('close', () => { clearTimeout(timer); timers.delete(timer); });
  });
  await new Promise(resolve => upstream.listen(0, '127.0.0.1', resolve));
  const gateway = await startModelGateway({ baseUrl: `http://127.0.0.1:${upstream.address().port}/v1`, apiKey: 'fixture-key', config: { model: 'same-model', thinking: 'off', maxSeconds: 3 } });
  try {
    for (const messages of [[], [{ role: 'user', content: 'A partial generation.' }]]) {
      const response = await fetch(`${gateway.baseUrl}/chat/completions`, { method: 'POST', headers: { authorization: `Bearer ${gateway.credential}` }, body: JSON.stringify({ stream: true, messages }) });
      const reader = response.body.getReader(); await reader.read(); await reader.cancel();
      const deadline = Date.now() + 2000;
      while (gateway.calls().at(-1).seconds === null && Date.now() < deadline) await new Promise(resolve => setTimeout(resolve, 10));
    }
    const [completed, cancelled] = gateway.calls();
    assert.equal(completed.error, undefined);
    assert.equal(completed.usage.prompt_tokens, 9);
    assert.equal(reasoningProof([completed], 'off').accepted, true);
    assert.equal(cancelled.failure_kind, 'cancelled');
    assert.equal(cancelled.usage, null);
    assert.equal(reasoningProof([cancelled], 'off').accepted, false);
  } finally { for (const timer of timers) clearTimeout(timer); await gateway.close(); await new Promise(resolve => upstream.close(resolve)); }
});
