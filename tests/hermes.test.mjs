import test from 'node:test';
import assert from 'node:assert/strict';
import { nativeMeasurements } from '../harness/hermes/result.mjs';

const native = { result: { final_response: 'Visible answer', completed: true }, started_at: 10, ended_at: 20, counters: { session_api_calls: 1 } };
const usage = { prompt_tokens: 100, input_tokens: 80, cache_read_tokens: 20, output_tokens: 7 };
const call = (kind, id, start, overrides = {}) => [
  { kind: `pre_${kind}`, api_request_id: id, started_at: start, retry_count: 0 },
  { kind: `post_${kind}`, api_request_id: id, started_at: start, usage, ...overrides },
];

test('Hermes counts primary attempts and auxiliary calls, deduplicates hooks, and counts cached prompt input once', () => {
  const calls = [...call('api_request', 'main', 11), ...call('auxiliary_call', 'helper', 12)];
  const measured = nativeMeasurements(native, [...calls, calls[0], calls[1]], 480);
  assert.equal(measured.rounds, 2);
  assert.deepEqual(measured.tokens, { input: 200, output: 14, cached: null });
  assert.equal(measured.accounting_complete, true);
});

test('Hermes failed physical retry stays in the ledger and leaves aggregate usage unknown', () => {
  const failed = [{ kind: 'pre_api_request', api_request_id: 'same-id', started_at: 11, retry_count: 0 },
    { kind: 'api_request_error', api_request_id: 'same-id', started_at: 11, retry_count: 0, error: { type: 'ConnectionError' } }];
  const measured = nativeMeasurements(native, [...failed, ...call('api_request', 'same-id', 12)], 480);
  assert.equal(measured.rounds, 2);
  assert.equal(measured.accounting_complete, false);
  assert.deepEqual(measured.tokens, { input: null, output: null, cached: null });
  assert.equal(nativeMeasurements(native, [], 480).rounds, null);
});

test('Hermes answer clock stops on the last native visible delta and does not reuse it for a failed turn', () => {
  const events = [{ kind: 'turn_start', started_at: 10 }, { kind: 'assistant_delta', observed_at: 14, characters: 20 }];
  assert.equal(nativeMeasurements(native, events, 480).seconds, 4);
  const failed = nativeMeasurements({ ...native, result: { error: 'turn failed', interrupted: true } }, events, 480);
  assert.equal(failed.seconds, 10);
  assert.equal(failed.timed_out, true);
  assert.equal(failed.error, 'turn failed');
  const bufferedFinal = nativeMeasurements(native, [...events, ...call('api_request', 'final', 16, { ended_at: 18, assistant_tool_call_count: 0 })], 480);
  assert.equal(bufferedFinal.seconds, 8, 'an earlier progress delta cannot end the answer clock');
  const incomplete = nativeMeasurements({ ...native, result: { final_response: 'Partial answer', completed: false, turn_exit_reason: 'run_budget_exhausted' } }, events, 480);
  assert.match(incomplete.error, /agent did not finish/);
  assert.equal(incomplete.clock.source, 'native-turn-result');
});
