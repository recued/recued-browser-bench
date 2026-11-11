import test from 'node:test';
import assert from 'node:assert/strict';
import { mergeReports } from '../scripts/merge-reports.mjs';
import { histories, retryPlan } from '../scripts/outcome.mjs';
import { resultVectors } from '../scripts/report.mjs';

const settings = { model: 'same-model', thinking: 'off', temperature: 0.2, maxOutputTokens: 4000, maxSeconds: 480, maxSteps: 30, recuedCatalogMode: 'full', tasks: ['A'], runs: 1 };
const row = { task_id: 'A', run: 1, answer: 'answer', right: true, seconds: 5, rounds: 2, tokens: { input: 100, cached: 20, output: 10 }, missing: [] };
const batch = (arm, records = [{ ...row, arm }]) => ({ data: { date: '2026-11-09', model: settings.model, settings: { ...settings, arms: [arm] }, versions: { browser: 'same', benchmark_commit: arm }, reasoning_policy: 'same-policy', records }, sha256: arm + '-hash' });

test('separate single-arm batches join without rerunning or dropping original measurements', () => {
  const inputs = [batch('first'), batch('second')], snapshot = structuredClone(inputs);
  const joined = mergeReports(inputs);
  assert.deepEqual(joined.settings.arms, ['first', 'second']);
  assert.deepEqual(joined.records, [...inputs[0].data.records, ...inputs[1].data.records]);
  assert.equal(histories(joined.records).length, 2);
  assert.deepEqual(joined.merged_sources.map(s => [s.sha256, s.record_offset, s.record_count]), [['first-hash', 0, 1], ['second-hash', 1, 1]]);
  assert.equal(joined.versions.benchmark_commit, null);
  assert.equal(joined.versions.browser, 'same');
  assert.deepEqual(inputs, snapshot);
});

test('joining rebases retry links and preserves current results and all retry costs', () => {
  const failed = { ...row, arm: 'second', right: false, error: 'model call failed', missing: ['answer unavailable'], model_calls: [{ status: 503 }], tokens: { input: 15, cached: 0, output: 1 } };
  const retry = { ...row, arm: 'second', attempt: 2, retry_of: 0 };
  const inputs = [batch('first'), batch('second', [failed, retry])];
  const joined = mergeReports(inputs);
  assert.equal(joined.records[2].retry_of, 1);
  assert.equal(inputs[1].data.records[1].retry_of, 0);
  const vectors = resultVectors(joined.records);
  assert.equal(vectors.current.length, 2);
  assert.equal(vectors.attempts.length, 3);
  assert.equal(vectors.attempts[1].tokens.input, 15);
  assert.deepEqual(retryPlan(joined.records), []);
});

test('joining rejects overlapping runs and incompatible model or measurement settings', () => {
  assert.throws(() => mergeReports([batch('first'), batch('first')]), /Duplicate/);
  for (const [key,value] of [['model','other-model'],['thinking','on'],['temperature',0.8],['maxSeconds',100],['maxSteps',10],['runs',2],['tasks',['B']]]) {
    const other = batch('second');other.data.settings[key]=value;
    assert.throws(() => mergeReports([batch('first'),other]), new RegExp(key));
  }
});

test('new OpenClaw context settings can join older arms and remain reproducible for later retries', () => {
  const older = batch('first'), added = batch('openclaw-browser-use');
  added.data.settings.openclawContextWindow = 32768;
  const joined = mergeReports([older, added]);
  assert.equal(joined.settings.openclawContextWindow, 32768);
  assert.equal(older.data.settings.openclawContextWindow, undefined);
  assert.equal(joined.merged_sources[0].metadata.settings.openclawContextWindow, undefined);
  const later = batch('openclaw-browser');
  later.data.settings.openclawContextWindow = 65536;
  assert.throws(() => mergeReports([older, added, later]), /different OpenClaw context/);
  const implicit = batch('openclaw-browser-use'), explicit = batch('openclaw-browser');
  explicit.data.settings.openclawContextWindow = 262144;
  assert.equal(mergeReports([older, implicit, explicit]).settings.openclawContextWindow, 262144);
});

test('a Hermes-only batch retains its context setting when added to an existing comparison', () => {
  const older = batch('first'), added = batch('hermes');
  added.data.settings.hermesContextWindow = 1_000_000;
  const joined = mergeReports([older, added]);
  assert.equal(joined.settings.hermesContextWindow, 1_000_000);
  assert.equal(older.data.settings.hermesContextWindow, undefined);
  assert.deepEqual(joined.merged_sources[1].metadata.settings, added.data.settings);
});
