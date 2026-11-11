import { spawn, spawnSync } from 'node:child_process';
import { existsSync, mkdirSync, mkdtempSync, readFileSync, renameSync, rmSync, writeFileSync } from 'node:fs';
import { freemem } from 'node:os';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { configuration, schedule } from './config.mjs';
import { startModelGateway } from './model-gateway.mjs';
import { sanitize } from './privacy.mjs';
import { taskSet } from './tasks.mjs';
import { grade, pageOracle } from './grade.mjs';
import { report, resultVectors } from './report.mjs';
import { reasoningProof, REASONING_POLICY } from './qualification.mjs';
import { outcome } from './outcome.mjs';
import { startLiveSite } from '../harness/live-site/site.mjs';
import { stopProcessGroup, stopProcessesNaming } from '../harness/recued/lib/process-group.mjs';
import { closeBrowserUseRuntime } from '../harness/openclaw/browser-use.mjs';
const root = fileURLToPath(new URL('../', import.meta.url));
process.chdir(root);
const { config, apiKey, baseUrl, out, help, dryRun, retry } = configuration();
if (help) {
  console.log('./run [--config file] [--model name] [--endpoint baseURL] [--thinking off|on|default] [--temperature number] [--max-output-tokens n] [--recued-catalog-mode full|index|lean-core] [--arms recued-bridge,recued-playwright,browser-use,stagehand,openclaw-browser-use,openclaw-browser,hermes] [--tasks A,B,...,L,X,Y] [--runs 2] [--max-seconds 480] [--max-steps 30] [--out results/my-run]\n./run --retry-failed results/my-run/records.json [--dry-run] [--out results/retry]');
  process.exit(0);
}
const entries = retry?.entries ?? schedule(config.tasks, config.arms, config.runs).map(entry => ({ ...entry, attempt: 1 }));
const definitions = taskSet('[live-site]');
if (!config.tasks.length || config.tasks.some(id => !definitions.some(task => task.id === id)) || new Set(config.tasks).size !== config.tasks.length) throw new Error('Invalid or repeated task.');
if (retry) for (const entry of entries) {
  if (definitions.find(task => task.id === entry.task)?.ask !== retry.data.records[entry.retry_of].task) throw new Error('Retry task words differ from the source; start a new comparison.');
}
if (dryRun || !entries.length) {
  console.log(`${entries.length} ${retry ? 'technical failures eligible for one additional attempt' : 'scheduled attempts'}.`);
  for (const entry of entries) console.log(`${entry.task}, ${entry.arm}, run ${entry.run}, attempt ${entry.attempt}`);
  process.exit(0);
}
if (!existsSync('.bench/installation.json')) throw new Error('Run ./setup first.');
const installation = JSON.parse(readFileSync('.bench/installation.json'));
if (config.arms.includes('hermes') && (installation.hermes !== '0.23.1' || !installation.hermesPython || !existsSync(installation.hermesPython))) throw new Error('Run ./setup to install the pinned Hermes runtime.');
if (retry && config.arms.includes('hermes')) for (const key of ['hermes', 'hermesSourceSha256', 'hermesPythonVersion', 'hermesBrowserHarness']) {
  if (retry.data.versions?.[key] !== installation[key]) throw new Error(`Retry requires the source ${key} version.`);
}
if (config.arms.some(arm => arm.startsWith('openclaw-')) && (installation.openclaw !== '2026.11.2' || !installation.openclawCli || !existsSync(installation.openclawCli))) throw new Error('Run ./setup to install the pinned OpenClaw runtime.');
if (retry && config.arms.some(arm => arm.startsWith('openclaw-')) && retry.data.versions?.openclaw !== installation.openclaw) throw new Error('Retry requires the source OpenClaw version.');
if (retry && config.arms.includes('openclaw-browser-use') && retry.data.versions?.browserHarness !== installation.browserHarness) throw new Error('Retry requires the source browser-use CLI dependency version.');
if (retry) for (const key of ['recued', 'bridge', 'browserUse', 'playwrightMcp', 'stagehand', 'playwright']) {
  if (retry.data.versions?.[key] !== installation[key]) throw new Error(`Retry requires the source ${key} version; run setup with the original pins.`);
}
process.env.PLAYWRIGHT_BROWSERS_PATH = installation.browsersPath;
const date = new Date().toISOString();
const directory = resolve(out ?? `results/${date.replaceAll(':', '-')}-${config.model.replace(/[^a-zA-Z0-9.-]/g, '-')}${retry ? '-retry' : ''}`);
if (existsSync(join(directory, 'records.json'))) throw new Error('Output already has records; choose a new --out directory.');
mkdirSync(directory, { recursive: true });
mkdirSync('.bench/runs', { recursive: true });
const site = await startLiveSite();
const gateway = await startModelGateway({ config, apiKey, baseUrl });
const tasks = taskSet(site.origin);
const versions = Object.fromEntries(Object.entries(installation).filter(([key]) => !['binary', 'python', 'chromium', 'browsersPath', 'openclawCli', 'hermesPython', 'hermesSource'].includes(key)));
versions.node = process.version;
versions.platform = `${process.platform}-${process.arch}`;
const revision = spawnSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf8' });
versions.benchmark_commit = revision.status === 0 ? revision.stdout.trim() : null;
versions.benchmark_source_dirty = revision.status === 0 ? spawnSync('git', ['diff', '--quiet', 'HEAD', '--', '.', ':(exclude)results/**']).status !== 0 : null;
const records = retry ? structuredClone(retry.data.records) : [];
const sourceRun = retry ? { sha256: retry.sha256, metadata: Object.fromEntries(Object.entries(retry.data).filter(([key]) => key !== 'records')) } : undefined;
const persist = () => {
  const metadata = { schema: 2, date: date.slice(0, 10), model: config.model, settings: config, versions, reasoning_policy: REASONING_POLICY, ...(sourceRun ? { source_run: sourceRun } : {}), records };
  writeFileSync(join(directory, 'records.json.tmp'), JSON.stringify(metadata, null, 2) + '\n');
  renameSync(join(directory, 'records.json.tmp'), join(directory, 'records.json'));
  writeFileSync(join(directory, 'report.md'), report(records, metadata));
  writeFileSync(join(directory, 'results.json'), JSON.stringify(resultVectors(records), null, 2) + '\n');
};
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
function availableMiB() {
  if (process.platform === 'linux') {
    const kB = /MemAvailable:\s+(\d+)/.exec(readFileSync('/proc/meminfo', 'utf8'))?.[1];
    return kB ? Number(kB) / 1024 : freemem() / 1024 ** 2;
  }
  if (process.platform === 'darwin') {
    const stat = spawnSync('vm_stat', [], { encoding: 'utf8' }).stdout ?? '';
    const pageSize = Number(/page size of (\d+)/.exec(stat)?.[1] ?? 16384);
    const pages = ['free', 'inactive', 'speculative', 'purgeable'].reduce((n, name) => n + Number(new RegExp(`Pages ${name}:\\s+(\\d+)`).exec(stat)?.[1] ?? 0), 0);
    if (pages) return pages * pageSize / 1024 ** 2;
  }
  return freemem() / 1024 ** 2;
}
async function memoryGate() {
  const started = Date.now();
  while (availableMiB() < config.minFreeMemoryMiB) {
    if (Date.now() - started >= config.memoryWaitSeconds * 1000) throw new Error('Memory gate: insufficient available memory.');
    console.log('Waiting for available memory before starting the next isolated task.');
    await sleep(10_000);
  }
}
let active = null; let interrupted = false;
const stop = () => { interrupted = true; if (active?.pid) { try { process.kill(-active.pid, 'SIGTERM'); } catch {} } };
process.once('SIGINT', stop); process.once('SIGTERM', stop);
try {
  for (const entry of entries) {
    if (interrupted) break;
    await memoryGate();
    const task = tasks.find(t => t.id === entry.task);
    const work = mkdtempSync(join(root, '.bench/runs/task-'));
    const requestPath = join(work, 'request.json'); const resultPath = join(work, 'result.json');
    const request = { ...entry, task, config, root, work, installation, gateway: { baseUrl: gateway.baseUrl } };
    writeFileSync(requestPath, JSON.stringify(request));
    site.reset(); gateway.reset();
    const startedAt = new Date().toISOString();
    console.log(`${startedAt.slice(11, 19)} ${entry.arm} ${task.id} run ${entry.run}, attempt ${entry.attempt}: starting`);
    let result;
    try {
      const python = entry.arm === 'browser-use';
      const environment = Object.fromEntries(['PATH', 'HOME', 'USER', 'LOGNAME', 'LANG', 'TMPDIR', 'TEMP', 'TMP', 'SYSTEMROOT', 'SSL_CERT_FILE', 'SSL_CERT_DIR', 'HTTPS_PROXY', 'HTTP_PROXY', 'ALL_PROXY', 'NO_PROXY'].filter(key => process.env[key] !== undefined).map(key => [key, process.env[key]]));
      Object.assign(environment, { BENCH_GATEWAY_KEY: gateway.credential, PLAYWRIGHT_BROWSERS_PATH: installation.browsersPath, ANONYMIZED_TELEMETRY: 'false', BROWSER_USE_CLOUD_SYNC: 'false' });
      active = spawn(python ? installation.python : process.execPath, python
        ? ['-I', join(root, 'harness/browser-use/measure.py'), requestPath, resultPath]
        : [join(root, 'scripts/worker.mjs'), requestPath, resultPath], {
        cwd: root, env: environment, detached: true, stdio: ['ignore', 'pipe', 'pipe'],
      });
      // Framework logs can contain uploaded paths and error URLs. Keep only a
      // bounded in-memory tail, sanitize it before writing a failure record.
      let tail = ''; for (const stream of [active.stdout, active.stderr]) stream.on('data', bytes => { tail = (tail + String(bytes)).slice(-4000); });
      let hardTimeout = false;
      const status = await new Promise((resolve, reject) => {
        const timer = setTimeout(() => { hardTimeout = true; stopProcessGroup(active.pid, { graceMs: 20_000 }); }, (config.maxSeconds + 240) * 1000);
        active.once('error', error => { clearTimeout(timer); reject(error); });
        active.once('close', code => { clearTimeout(timer); resolve(code); });
      });
      result = existsSync(resultPath) ? JSON.parse(readFileSync(resultPath)) : { answer: '', seconds: null, rounds: null, tokens: null, error: `worker exited (${status})`, evidence: { diagnostics: tail } };
      if (hardTimeout || interrupted) { result.timed_out = true; result.error ??= interrupted ? 'interrupted' : 'worker time limit'; }
      stopProcessGroup(active.pid, { graceMs: 1000 });
    } catch (error) { result = { answer: '', seconds: null, rounds: null, tokens: null, error: error.message }; }
    finally { active = null; stopProcessesNaming(work); if (entry.arm === 'openclaw-browser-use') closeBrowserUseRuntime({ installation, work }); }
    const events = site.events();
    const calls = gateway.calls();
    result.model_calls = calls;
    result.wall_seconds = (Date.now() - Date.parse(startedAt)) / 1000;
    result.reasoning = reasoningProof(calls, config.thinking);
    if (calls.some(c => c.status === null || c.status >= 400 || c.error)) result.error ??= 'model call failed';
    if (config.thinking === 'off' && result.reasoning.status === 'failed') result.error = 'provider returned reasoning with thinking off';
    result.qualified = result.reasoning.accepted;
    const oracle = await pageOracle(task, installation);
    const verdict = grade(task, result, oracle, events);
    const record = sanitize({ ...entry, task: task.ask, task_id: task.id, started_at: startedAt, versions, settings: { model: config.model, thinking: config.thinking, temperature: config.temperature, frequency_penalty: config.frequencyPenalty ?? 0, max_output_tokens: config.maxOutputTokens }, ...result, ...verdict, oracle, live_events: events, outcome: outcome({ ...result, ...verdict, oracle, live_events: events }) }, {
      secrets: [apiKey, gateway.credential], paths: [root, work], origins: [site.origin, gateway.baseUrl],
    });
    records.push(record); persist();
    rmSync(work, { recursive: true, force: true });
    console.log(`${entry.arm} ${task.id} #${entry.run}: ${record.right ? 'right' : 'wrong'}; ${record.seconds?.toFixed(1) ?? '—'} s; ${record.rounds ?? '—'} rounds${record.right ? '' : `; ${record.missing.join('; ').slice(0, 220)}`}`);
  }
} finally {
  if (active?.pid) stopProcessGroup(active.pid);
  await gateway.close(); await site.close();
  process.removeListener('SIGINT', stop); process.removeListener('SIGTERM', stop);
  persist();
}
if (interrupted) process.exitCode = 130;
console.log(`Saved ${records.length} records and report.`);
