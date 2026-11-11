import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { parseArgs } from 'node:util';
import { createHash } from 'node:crypto';
import { retryPlan } from './outcome.mjs';

export const ARMS = ['recued-bridge', 'recued-playwright', 'browser-use', 'stagehand', 'openclaw-browser-use', 'openclaw-browser', 'hermes'];
export function configuration(argv = process.argv.slice(2), environment = process.env) {
  const { values } = parseArgs({ args: argv, options: {
    config: { type: 'string' }, model: { type: 'string' }, endpoint: { type: 'string' },
    thinking: { type: 'string' }, temperature: { type: 'string' }, 'max-output-tokens': { type: 'string' },
    arms: { type: 'string' }, tasks: { type: 'string' }, runs: { type: 'string' }, 'max-seconds': { type: 'string' },
    'max-steps': { type: 'string' }, 'min-free-memory-mib': { type: 'string' }, out: { type: 'string' },
    'recued-catalog-mode': { type: 'string' },
    'retry-failed': { type: 'string' }, 'dry-run': { type: 'boolean' }, help: { type: 'boolean' },
  } });
  const defaults = JSON.parse(readFileSync(new URL('../bench.config.example.json', import.meta.url)));
  let retry;
  if (values['retry-failed']) {
    const bytes = readFileSync(resolve(values['retry-failed']));
    const data = JSON.parse(bytes);
    if (!data.settings || !Array.isArray(data.records)) throw new Error('Retry source must contain settings and records.');
    const incompatible = ['config', 'model', 'thinking', 'temperature', 'max-output-tokens', 'arms', 'tasks', 'runs', 'max-seconds', 'max-steps', 'recued-catalog-mode'];
    if (incompatible.some(key => values[key] !== undefined)) throw new Error('Retry uses the source settings; do not override its model, tasks, arms or measurement limits.');
    retry = { data, sha256: createHash('sha256').update(bytes).digest('hex'), entries: retryPlan(data.records) };
  }
  const configPath = retry ? null : values.config ?? (existsSync('bench.config.json') ? 'bench.config.json' : null);
  const config = { ...defaults, ...(retry ? retry.data.settings : configPath ? JSON.parse(readFileSync(resolve(configPath))) : {}) };
  for (const name of ['model', 'thinking']) if (values[name]) config[name] = values[name];
  if (values['recued-catalog-mode']) config.recuedCatalogMode = values['recued-catalog-mode'];
  for (const [flag, key] of Object.entries({ runs: 'runs', temperature: 'temperature', 'max-seconds': 'maxSeconds', 'max-steps': 'maxSteps', 'min-free-memory-mib': 'minFreeMemoryMiB', 'max-output-tokens': 'maxOutputTokens' })) {
    if (values[flag] !== undefined) config[key] = Number(values[flag]);
  }
  for (const key of ['arms', 'tasks']) if (values[key]) config[key] = values[key].split(',').map(x => x.trim());
  for (const key of ['runs', 'maxSeconds', 'maxSteps', 'maxOutputTokens']) if (!Number.isInteger(config[key]) || config[key] < 1) throw new Error(`${key} must be a positive integer.`);
  if (config.openclawContextWindow !== undefined && (!Number.isInteger(config.openclawContextWindow) || config.openclawContextWindow < 1)) throw new Error('openclawContextWindow must be a positive integer.');
  if (config.hermesContextWindow !== undefined && (!Number.isInteger(config.hermesContextWindow) || config.hermesContextWindow < 1)) throw new Error('hermesContextWindow must be a positive integer.');
  if (!config.arms.length || config.arms.some(x => !ARMS.includes(x)) || new Set(config.arms).size !== config.arms.length) throw new Error('Invalid or repeated arm.');
  if (!['off', 'on', 'default'].includes(config.thinking)) throw new Error('thinking is off, on or default.');
  if (!['full', 'index', 'lean-core'].includes(config.recuedCatalogMode)) throw new Error('recuedCatalogMode is full, index or lean-core.');
  if (!Number.isFinite(config.temperature) || config.temperature < 0 || config.temperature > 2) throw new Error('Invalid temperature.');
  if (retry) for (const entry of retry.entries) {
    if (!config.tasks.includes(entry.task) || !config.arms.includes(entry.arm) || entry.run > config.runs) throw new Error('Retry source record is outside the source schedule.');
    const settings = retry.data.records[entry.retry_of].settings;
    const expected = { model: config.model, thinking: config.thinking, temperature: config.temperature, frequency_penalty: config.frequencyPenalty ?? 0, max_output_tokens: config.maxOutputTokens };
    if (!settings || Object.entries(expected).some(([key, value]) => settings[key] !== value)) throw new Error('Retry source record settings do not match the source configuration.');
  }
  const apiKey = environment[config.apiKeyEnvironment];
  const baseUrl = values.endpoint ?? environment[config.baseUrlEnvironment];
  if (!values.help && !values['dry-run'] && !(retry && !retry.entries.length) && (!apiKey || !baseUrl)) throw new Error(`Set ${config.apiKeyEnvironment} and ${config.baseUrlEnvironment}. Keys belong in the environment.`);
  if (baseUrl) {
    const url = new URL(baseUrl);
    if (!['http:', 'https:'].includes(url.protocol) || url.username || url.password || url.search || url.hash) throw new Error('Endpoint must be an HTTP(S) base URL without credentials or query.');
  }
  return { config, apiKey, baseUrl, out: values.out, help: values.help, dryRun: values['dry-run'], retry };
}

export function schedule(tasks, arms, runs) {
  return tasks.flatMap((task, index) => Array.from({ length: runs }, (_, run) => {
    const start = (index + run) % arms.length;
    return [...arms.slice(start), ...arms.slice(0, start)].map(arm => ({ task, arm, run: run + 1 }));
  }).flat());
}
