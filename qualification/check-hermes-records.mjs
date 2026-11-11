// node qualification/check-hermes-records.mjs records.json [receipt.json]
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync } from 'node:fs';
import { histories, retryPlan } from '../scripts/outcome.mjs';

const bytes = readFileSync(process.argv[2]), data = JSON.parse(bytes);
const current = histories(data.records).map(history => history.at(-1).record);
const native = data.records.filter(record => record.arm === 'hermes');
assert.ok(native.length);
let complete = 0, incomplete = 0, primary = 0, auxiliary = 0;
for (const record of native) {
  const ledger = record.evidence.native_model_calls, gateway = record.model_calls;
  assert.equal(record.rounds, ledger.length, 'rounds must count native physical attempts');
  assert.equal(ledger.length, gateway.length, `${record.task_id}/R${record.run}: native/gateway call count`);
  assert.equal(new Set(ledger.map(call => `${call.kind}/${call.call_id}/${call.started?.started_at}`)).size, ledger.length);
  primary += ledger.filter(call => call.kind === 'primary').length;
  auxiliary += ledger.filter(call => call.kind === 'auxiliary').length;
  assert.equal(record.tokens.cached, null, 'native cache availability is unknown');
  if (record.evidence.native_accounting_complete) {
    assert.ok(gateway.every(call => call.status === 200 && !call.error && Number.isFinite(call.usage?.prompt_tokens) && Number.isFinite(call.usage?.completion_tokens)));
    assert.equal(record.tokens.input, gateway.reduce((n, call) => n + call.usage.prompt_tokens, 0));
    assert.equal(record.tokens.output, gateway.reduce((n, call) => n + call.usage.completion_tokens, 0));
    complete++;
  } else {
    assert.equal(record.tokens.input, null);
    assert.equal(record.tokens.output, null);
    incomplete++;
  }
  for (const call of ledger) assert.equal(call.started.model, data.settings.model);
  for (const call of gateway) assert.equal(call.requested_enable_thinking, data.settings.thinking === 'off' ? false : data.settings.thinking === 'on' ? true : call.requested_enable_thinking);
  if (record.right) {
    assert.equal(record.qualified, true);
    assert.equal(record.evidence.native_completed, true);
    if (record.task_id === 'J') assert.equal(record.evidence.uploaded, true);
    if (record.task_id === 'L') assert.equal(record.evidence.saved_file, true);
  }
}
const receipt = { date: new Date().toISOString(), records_sha256: createHash('sha256').update(bytes).digest('hex'),
  scheduled_hermes_runs: current.filter(record => record.arm === 'hermes').length, physical_hermes_attempts: native.length,
  correct: current.filter(record => record.arm === 'hermes' && record.right).length,
  complete_native_usage_matches_gateway: complete, incomplete_native_usage_kept_unknown: incomplete,
  native_primary_attempts: primary, native_auxiliary_attempts: auxiliary,
  remaining_technical_retries: retryPlan(data.records).filter(record => record.arm === 'hermes').length,
  measured_sources: [...new Set(native.map(record => record.versions.benchmark_commit))],
  all_measured_from_clean_source: native.every(record => record.versions.benchmark_source_dirty === false),
  versions: Object.fromEntries(Object.entries(data.versions).filter(([key]) => key.startsWith('hermes'))),
};
if (process.argv[3]) writeFileSync(process.argv[3], JSON.stringify(receipt, null, 2) + '\n');
console.log(JSON.stringify(receipt));
