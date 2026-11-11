// Medians and per-task grouping adapted from browser-agent-bench/scripts/analyze.mjs.
import { readFileSync, writeFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';
import { dirname, join } from 'node:path';
import { histories, outcome } from './outcome.mjs';
export const median = values => {
  const a = values.filter(x => typeof x === 'number' && Number.isFinite(x)).sort((a, b) => a - b);
  return a.length ? (a[Math.floor((a.length - 1) / 2)] + a[Math.floor(a.length / 2)]) / 2 : null;
};
const number = x => typeof x !== 'number' || !Number.isFinite(x) ? '—' : Number(x.toFixed(1)).toLocaleString('en-US');
const cell = value => String(value ?? '').replaceAll('|', '\\|').replace(/[\r\n]+/g, ' ');
export function resultVectors(records) {
  const vector = (record, attempt) => {
    const verdict = outcome(record);
    return { task: record.task_id, arm: record.arm, run: record.run, attempt, right: record.right,
      status: verdict.status, failure_kind: verdict.kind, retryable: verdict.retryable,
      tokens: record.tokens ?? null, seconds: record.seconds ?? null, rounds: record.rounds ?? null,
      failed_reason: verdict.reason || null, wall_seconds: record.wall_seconds ?? null };
  };
  const groups = histories(records);
  return { schema: 1, current: groups.map(history => vector(history.at(-1).record, history.length)),
    attempts: groups.flatMap(history => history.map(({ record }, index) => vector(record, index + 1))) };
}
export function report(records, { arms, model, date, versions, source_run, merged_sources } = {}) {
  arms ??= [...new Set(records.map(r => r.arm))];
  const groups = histories(records);
  const original = groups.map(history => history[0].record);
  const latest = groups.map(history => history.at(-1).record);
  const retried = groups.filter(history => history.length > 1);
  const rows = ['# Browser comparison', '', `${date ?? records[0]?.started_at?.slice(0, 10) ?? ''}; model: ${model ?? records[0]?.settings?.model ?? 'unknown'}.`, '',
    ...(merged_sources ? [`Combined from ${merged_sources.length} separate batch invocations. Each batch retains its date, settings, versions and SHA-256 below and in merged_sources. The added arm was not interleaved with the original batch.`, ''] : []),
    `${groups.length} scheduled runs; ${records.length} recorded attempts. ${retried.length} runs have technical retries. Original attempts are retained unchanged.`, '',
    '## Original attempt summary', '',
    'Times and rounds below are medians of right answers only. Every failure remains in the denominator. An arm with no right answers has no successful-time median. Token medians use available framework counters from all attempts, including failed ones; missing counts stay null. Each task ran in a separate process; browsers started outside the agent clocks.', '',
    '| Task | Arm | Right / total | Seconds, right | Model rounds, right | Input tokens, all | Cached tokens, all | Output tokens, all | Approval asks |',
    '| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |'];
  const append = (label, list, arm) => {
    const selected = list.filter(r => r.arm === arm);
    if (!selected.length) return;
    const right = selected.filter(r => r.right);
    rows.push(`| ${label} | ${arm} | ${right.length} / ${selected.length} | ${number(median(right.map(r => r.seconds)))} | ${number(median(right.map(r => r.rounds)))} | ${number(median(selected.map(r => r.tokens?.input)))} | ${number(median(selected.map(r => r.tokens?.cached)))} | ${number(median(selected.map(r => r.tokens?.output)))} | ${selected.reduce((n, r) => n + (r.approvals ?? 0), 0)} |`);
  };
  for (const task of [...new Set(original.map(r => r.task_id))]) for (const arm of arms) append(task, original.filter(r => r.task_id === task), arm);
  for (const arm of arms) append('Overall', original, arm);
  if (retried.length) {
    rows.push('', '## Current summary after technical retries', '', '| Arm | Original right / total | Current right / total | Seconds, current right | Rounds, current right |', '| --- | ---: | ---: | ---: | ---: |');
    for (const arm of arms) {
      const before = original.filter(r => r.arm === arm), current = latest.filter(r => r.arm === arm), right = current.filter(r => r.right);
      rows.push(`| ${cell(arm)} | ${before.filter(r => r.right).length} / ${before.length} | ${right.length} / ${current.length} | ${number(median(right.map(r => r.seconds)))} | ${number(median(right.map(r => r.rounds)))} |`);
    }
  }
  const table = () => rows.push('', '| Task | Arm | Run | Attempt | Result | Answer seconds | Wall seconds | AI rounds | Tokens: input / cached / output | Failed reason |', '| --- | --- | ---: | ---: | --- | ---: | ---: | ---: | --- | --- |');
  const attemptRow = (record, attempt) => {
    const verdict = outcome(record);
    const label = verdict.status === 'right' ? 'RIGHT' : verdict.status === 'wrong' ? 'WRONG' : `FAILED (${verdict.retryable ? 'technical; retryable' : verdict.kind + '; no retry'})`;
    rows.push(`| ${cell(record.task_id)} | ${cell(record.arm)} | ${record.run} | ${attempt} | ${label} | ${number(record.seconds)} | ${number(record.wall_seconds)} | ${number(record.rounds)} | ${number(record.tokens?.input)} / ${number(record.tokens?.cached)} / ${number(record.tokens?.output)} | ${cell(verdict.reason).slice(0, 450)} |`);
  };
  rows.push('', '## Current results per task and arm', '', 'Each repetition has its own row. These are the latest attempts, not best-of attempts. Wrong answers, wrong actions and exhausted agent budgets are final. Only observed technical failures are retryable. Unknown or configuration failures require investigation rather than automatic retries.', '', 'Seconds and tokens here belong to the displayed attempt. Wall seconds include worker startup and cleanup before the page checker; older records did not capture that value. Missing measurements stay —. Cached tokens are part of input, not additional input.');
  table();
  const taskOrder = [...new Set(original.map(r => r.task_id))];
  const sorted = [...groups].sort((a, b) => taskOrder.indexOf(a[0].record.task_id) - taskOrder.indexOf(b[0].record.task_id) || arms.indexOf(a[0].record.arm) - arms.indexOf(b[0].record.arm) || a[0].record.run - b[0].record.run);
  for (const history of sorted) attemptRow(history.at(-1).record, history.length);
  if (retried.length) {
    rows.push('', '## Retry history and costs', '', 'All attempts of each retried run are shown, including original technical failures and their consumed tokens and time. Current-result metrics do not include earlier-attempt cost. A retry that produces a wrong answer or action ends that run.');
    table();
    for (const history of sorted.filter(history => history.length > 1)) history.forEach(({ record }, index) => attemptRow(record, index + 1));
  }
  const unreported = records.filter(record => record.reasoning?.status === 'counter-unreported');
  if (unreported.length) rows.push('', `${unreported.length} of ${records.length} attempts have an unreported reasoning-token counter. ${unreported.filter(record => record.reasoning.accepted === true).length} meet the accepted policy: completed successful calls requested thinking off, returned no reasoning content, and reported no contradictory counter. Raw counters and all_zero remain null when absent; counter_verified stays false. This accepts the requested switch and observed absence, without claiming a measured zero.`);
  const unqualified = records.filter(record => record.qualified === false);
  if (unqualified.length) rows.push('', `${unqualified.length} attempts do not meet the recorded thinking-evidence policy, including failed or incomplete calls. This evidence flag is separate from task accuracy; all attempts remain above.`);
  rows.push('', 'Overall medians pool individual runs across tasks; they are not sums of task medians. Different success sets make those medians descriptive, not a paired speed ranking. Model rounds are Recued chat and recipe provider calls, browser-use history steps minus one, Stagehand native model calls including extraction and finalization, and OpenClaw unique native model-call IDs including helpers. Tokens are each framework’s own counters; gateway counts separately verify thinking and settings.', '', 'The requested browser-use step measure can omit internal model calls; raw gateway requests are retained separately. Recued keeps the release’s ten charged tool-round limit; maxSteps controls browser-use and Stagehand. OpenClaw keeps its native loop and the configured answer deadline; maxSteps does not control it. These round measures and iteration budgets are not uniform provider-request counts.', '', '## Failures and wrong results, all attempts', '');
  for (const history of groups) history.forEach(({ record }, index) => { if (!record.right) rows.push(`- ${record.task_id}, ${record.arm}, run ${record.run}, attempt ${index + 1}: ${(record.missing ?? [record.error ?? 'failed']).join('; ').replaceAll('\n', ' ').slice(0, 700)}`); });
  if (records.every(r => r.right)) rows.push('None.');
  if (versions) rows.push('', '## Versions', '', '```json', JSON.stringify(versions, null, 2), '```');
  if (source_run) rows.push('', '## Retry provenance', '', `Source dataset SHA-256: ${source_run.sha256}. Source records are copied unchanged; new attempts record their own versions and retry_of index. The versions above describe this retry invocation. Original versions and processing receipts remain in source_run.metadata in records.json.`);
  if (merged_sources) {
    rows.push('', '## Combined batch provenance', '', '| Batch | Date | Arms | Attempts | Source SHA-256 |', '| --- | --- | --- | ---: | --- |');
    merged_sources.forEach((source, index) => rows.push(`| ${index + 1} | ${cell(source.metadata.date)} | ${cell(source.metadata.settings.arms.join(', '))} | ${source.record_count} | ${source.sha256} |`));
    rows.push('', 'All source measurements are retained. Retry indices are rebased into the combined array; original indices can be recovered from each source record_offset. Detailed source metadata and earlier processing receipts remain in records.json.');
  }
  return rows.join('\n') + '\n';
}
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  if (!process.argv[2]) throw new Error('Usage: node scripts/report.mjs results/<run>/records.json [report.md]');
  const data = JSON.parse(readFileSync(process.argv[2]));
  const output = report(data.records ?? data, data);
  if (process.argv[3]) {
    writeFileSync(process.argv[3], output);
    writeFileSync(join(dirname(process.argv[3]), 'results.json'), JSON.stringify(resultVectors(data.records ?? data), null, 2) + '\n');
  } else process.stdout.write(output);
}
