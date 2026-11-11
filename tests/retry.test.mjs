import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, writeFileSync, rmSync, readFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { outcome, retryPlan } from '../scripts/outcome.mjs';
import { configuration } from '../scripts/config.mjs';
import { report, resultVectors } from '../scripts/report.mjs';
import { startModelGateway } from '../scripts/model-gateway.mjs';

const base = { task_id: 'Y', arm: 'recued-bridge', run: 2, right: false, answer: '', seconds: null, rounds: null, tokens: null, missing: ['answer: WT-4417'], live_events: [] };
const transport = { ...base, error: 'model call failed', model_calls: [{ status: null, error: 'provider transport or response error', seconds: 5 }] };

test('only explicit transient failures retry; wrong actions, wrong answers and native limits are final', () => {
  assert.equal(outcome(transport).retryable, true);
  assert.equal(outcome({ ...transport, evidence: { turn_statuses: ['completed'] } }).retryable, true);
  assert.equal(outcome({ ...transport, model_calls: [{ ...transport.model_calls[0], failure_kind: 'invalid-request' }] }).retryable, false);
  assert.equal(outcome({ ...transport, model_calls: [{ status: 200, failure_kind: 'invalid-response', error_code: 'ECONNRESET', error: 'provider transport or response error' }] }).retryable, true);
  assert.equal(outcome({ ...base, timed_out: true, model_calls: [{ status: null, failure_kind: 'cancelled', error_code: 'ECONNRESET', error: 'cancelled' }] }).retryable, false);
  for (const status of [408, 429, 500, 502, 503, 504]) assert.equal(outcome({ ...base, model_calls: [{ status }] }).retryable, true);
  for (const status of [400, 401, 403, 404, 413, 422]) assert.equal(outcome({ ...base, model_calls: [{ status }] }).retryable, false);
  assert.equal(outcome({ ...base, timed_out: true, model_calls: [{ status: null, error: 'cancelled' }] }).status, 'wrong');
  assert.equal(outcome({ ...base, error: 'agent did not finish' }).retryable, false);
  assert.equal(outcome({ ...base, error: 'Unexpected SDK setup error' }).retryable, false);
  const badAction = { ...transport, missing: ["the site's record: opened summer-sale, where it expects opened winter-tyres"], live_events: [{ opened: 'summer-sale' }] };
  assert.equal(outcome(badAction).status, 'wrong');
  assert.equal(outcome(badAction).retryable, false);
  assert.equal(outcome({ ...transport, answer: 'Wrong answer', evidence: { native_completed: true } }).retryable, false);
  assert.equal(outcome({ ...transport, right: true }).retryable, false);
});

test('a completed shell ZIP workaround is a final wrong method even when an earlier provider call failed', () => {
  const record = { ...transport, task_id: 'L', arm: 'openclaw-browser', answer: 'Downloaded the requested ZIP and its exact byte count.', timed_out: false,
    missing: ['model call failed', 'saved file of 12499601 bytes'],
    evidence: { saved_file: false, native_clock: { source: 'native-assistant-event' }, native_summary: { aborted: false },
      files: [{ name: 'python-3.13.0-embed-amd64.zip', size_bytes: 12499601 }] },
    actions: [{ tool: 'exec', phase: 'start', args: { command: 'curl -L -o downloads/python-3.13.0-embed-amd64.zip https://www.python.org/ftp/python/3.13.0/python-3.13.0-embed-amd64.zip' } }] };
  assert.equal(outcome(record).kind, 'wrong-action');
  assert.equal(outcome(record).retryable, false);
  assert.equal(outcome({ ...record, arm: 'hermes', actions: record.actions.map(action => ({ ...action, tool: 'terminal' })) }).retryable, false);
  assert.equal(outcome({ ...record, timed_out: true, evidence: { ...record.evidence, files: [{ name: 'python-3.13.0-embed-amd64.zip', size_bytes: 2000 }] } }).retryable, true, 'an incomplete attempt still retains its observed transport failure');
  assert.equal(outcome({ ...record, evidence: { ...record.evidence, saved_file: true } }).retryable, true, 'a verified browser save does not establish a wrong method');
  assert.equal(outcome({ ...record, actions: [] }).retryable, true, 'do not infer a shell download from a filename alone');
});

test('malformed gateway requests are identified separately from retryable provider transport failures', async () => {
  const gateway = await startModelGateway({ baseUrl: 'https://example.test/v1', apiKey: 'test-only-key', config: { maxSeconds: 1 } });
  try {
    const response = await fetch(`${gateway.baseUrl}/chat/completions`, { method: 'POST', headers: { authorization: `Bearer ${gateway.credential}` }, body: '{malformed' });
    await response.text();
    const calls = gateway.calls();
    assert.equal(calls[0].failure_kind, 'invalid-request');
    assert.equal(outcome({ ...base, error: 'model call failed', model_calls: calls }).retryable, false);
  } finally { await gateway.close(); }
});

test('retry planning follows the latest attempt and cannot retry until a wrong result becomes right', () => {
  const wrong = { ...base, arm: 'browser-use', missing: ['wrong answer'] };
  const source = [transport, wrong, { ...base, arm: 'stagehand', right: true }];
  const snapshot = structuredClone(source);
  assert.deepEqual(retryPlan(source), [{ task: 'Y', arm: 'recued-bridge', run: 2, attempt: 2, retry_of: 0 }]);
  const failedRetry = { ...base, attempt: 2, retry_of: 0, answer: 'Wrong answer', model_calls: [{ status: 200 }], missing: ['wrong answer'] };
  assert.deepEqual(retryPlan([...source, failedRetry]), []);
  const anotherTransport = { ...transport, attempt: 2, retry_of: 0 };
  assert.deepEqual(retryPlan([...source, anotherTransport]), [{ task: 'Y', arm: 'recued-bridge', run: 2, attempt: 3, retry_of: 3 }]);
  assert.throws(() => retryPlan([...source, { ...failedRetry, arm: 'browser-use', retry_of: 1 }]), /Invalid retry lineage/);
  assert.deepEqual(source, snapshot);
});

test('retry configuration inherits frozen settings, previews without credentials, and rejects mismatched settings', () => {
  const work = mkdtempSync(join(tmpdir(), 'browser-retry-config-'));
  try {
    const path = join(work, 'records.json');
    const settings = { ...JSON.parse(readFileSync(new URL('../bench.config.example.json', import.meta.url))), model: 'frozen-model', temperature: 0.1 };
    const record = { ...transport, settings: { model: settings.model, thinking: 'off', temperature: 0.1, frequency_penalty: 0, max_output_tokens: 4000 } };
    writeFileSync(path, JSON.stringify({ settings, records: [record] }));
    const parsed = configuration(['--retry-failed', path, '--dry-run'], {});
    assert.equal(parsed.config.model, 'frozen-model');
    assert.equal(parsed.config.temperature, 0.1);
    assert.equal(parsed.retry.entries.length, 1);
    assert.throws(() => configuration(['--retry-failed', path, '--model', 'different'], {}), /source settings/);
    writeFileSync(path, JSON.stringify({ settings, records: [{ ...record, settings: { ...record.settings, model: 'different' } }] }));
    assert.throws(() => configuration(['--retry-failed', path, '--dry-run'], {}), /do not match/);
    writeFileSync(path, JSON.stringify({ settings, records: [{ ...base, right: true }] }));
    assert.equal(configuration(['--retry-failed', path], {}).retry.entries.length, 0);
  } finally { rmSync(work, { recursive: true, force: true }); }
});

test('reports and metric vectors retain initial failures and retry cost without inflating scheduled denominators', () => {
  const first = { ...transport, seconds: 5, rounds: 1, tokens: { input: 10, cached: 2, output: 3 } };
  const wrong = { ...base, arm: 'browser-use', answer: 'Wrong', seconds: 8, rounds: 2, tokens: { input: 20, cached: 0, output: 4 } };
  const recovered = { ...base, attempt: 2, retry_of: 0, right: true, seconds: 4, rounds: 3, tokens: { input: 30, cached: 5, output: 6 }, missing: [] };
  const records = [first, wrong, recovered];
  const text = report(records);
  assert.match(text, /2 scheduled runs; 3 recorded attempts/);
  assert.match(text, /\| recued-bridge \| 0 \/ 1 \| 1 \/ 1 \| 4 \| 3 \|/);
  assert.match(text, /FAILED \(technical; retryable\)/);
  assert.match(text, /Retry history and costs/);
  const vectors = resultVectors(records);
  assert.equal(vectors.current.length, 2);
  assert.equal(vectors.attempts.length, 3);
  assert.deepEqual(vectors.current[0], { task: 'Y', arm: 'recued-bridge', run: 2, attempt: 2, right: true, status: 'right', failure_kind: null, retryable: false, tokens: recovered.tokens, seconds: 4, rounds: 3, failed_reason: null, wall_seconds: null });
  assert.equal(vectors.attempts[0].tokens.input, 10);
  assert.equal(vectors.current[1].failed_reason, 'answer: WT-4417');
  assert.equal(resultVectors([transport]).current[0].rounds, null);
});
