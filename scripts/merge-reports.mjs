import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { parseArgs } from 'node:util';
import { isDeepStrictEqual } from 'node:util';
import { pathToFileURL } from 'node:url';
import { histories, runKey } from './outcome.mjs';
import { report, resultVectors } from './report.mjs';
import { modelContextWindow } from '../harness/openclaw/config.mjs';

const shared = ['model', 'thinking', 'temperature', 'maxOutputTokens', 'maxSeconds', 'maxSteps', 'recuedCatalogMode', 'tasks', 'runs'];
export function mergeReports(inputs) {
  if (inputs.length < 2) throw new Error('Provide at least two result datasets.');
  const base = inputs[0].data;
  const records = [], sources = [], seen = new Set(), arms = [];
  const versions = {};
  let openclawContext, hermesContext;
  for (const { data, sha256 } of inputs) {
    if (!data.settings || !Array.isArray(data.records)) throw new Error('Each input needs settings and records.');
    for (const key of shared) if (!isDeepStrictEqual(data.settings[key], base.settings[key])) throw new Error(`Cannot merge different ${key} settings.`);
    if ((data.settings.frequencyPenalty ?? 0) !== (base.settings.frequencyPenalty ?? 0)) throw new Error('Cannot merge different frequencyPenalty settings.');
    if (data.reasoning_policy !== base.reasoning_policy) throw new Error('Cannot merge different thinking-evidence policies.');
    if (data.settings.arms.some(arm => arm.startsWith('openclaw-'))) {
      const context = modelContextWindow(data.settings);
      if (openclawContext !== undefined && context !== openclawContext) throw new Error('Cannot merge different OpenClaw context windows.');
      openclawContext = context;
    }
    if (data.settings.arms.includes('hermes')) {
      const context = data.settings.hermesContextWindow ?? (data.settings.model.startsWith('qwen3.7-plus') ? 1_000_000 : 262144);
      if (hermesContext !== undefined && context !== hermesContext) throw new Error('Cannot merge different Hermes context windows.');
      hermesContext = context;
    }
    const groups = histories(data.records);
    for (const history of groups) {
      const record = history[0].record, key = runKey(record);
      if (!data.settings.tasks.includes(record.task_id) || !data.settings.arms.includes(record.arm) || record.run > data.settings.runs) throw new Error('Input record is outside its declared schedule.');
      if (seen.has(key)) throw new Error(`Duplicate task/arm/run: ${record.task_id}/${record.arm}/${record.run}. Use the latest retry dataset for that batch.`);
      seen.add(key);
    }
    for (const arm of data.settings.arms) if (!arms.includes(arm)) arms.push(arm);
    const offset = records.length;
    const copied = structuredClone(data.records);
    for (const record of copied) if (record.retry_of != null) record.retry_of += offset;
    records.push(...copied);
    sources.push({ sha256, record_offset: offset, record_count: copied.length, metadata: Object.fromEntries(Object.entries(data).filter(([key]) => key !== 'records')) });
    for (const [key, value] of Object.entries(data.versions ?? {})) {
      versions[key] = key in versions && !isDeepStrictEqual(versions[key], value) ? null : value;
    }
  }
  histories(records);
  return { schema: 3, kind: 'combined', date: base.date, assembled_at: new Date().toISOString(), model: base.model,
    settings: { ...base.settings, ...(openclawContext !== undefined ? { openclawContextWindow: openclawContext } : {}), ...(hermesContext !== undefined ? { hermesContextWindow: hermesContext } : {}), arms }, versions, reasoning_policy: base.reasoning_policy, merged_sources: sources, records };
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const { values, positionals } = parseArgs({ allowPositionals: true, options: { out: { type: 'string' }, help: { type: 'boolean' } } });
  if (values.help) console.log('node scripts/merge-reports.mjs --out results/combined results/first/records.json results/second/records.json');
  else {
    if (!values.out) throw new Error('Choose --out for the combined report. Input datasets are never overwritten.');
    const directory = resolve(values.out);
    if (existsSync(join(directory, 'records.json'))) throw new Error('Output already has records; choose a new --out directory.');
    const inputs = positionals.map(path => {
      const bytes = readFileSync(path);
      return { data: JSON.parse(bytes), sha256: createHash('sha256').update(bytes).digest('hex') };
    });
    const data = mergeReports(inputs);
    mkdirSync(directory, { recursive: true });
    writeFileSync(join(directory, 'records.json'), JSON.stringify(data, null, 2) + '\n');
    writeFileSync(join(directory, 'report.md'), report(data.records, data));
    writeFileSync(join(directory, 'results.json'), JSON.stringify(resultVectors(data.records), null, 2) + '\n');
    console.log(`Combined ${inputs.length} batches: ${histories(data.records).length} scheduled runs, ${data.records.length} attempts. Inputs preserved.`);
  }
}
