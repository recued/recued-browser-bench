import { spawn } from 'node:child_process';
import { copyFileSync, existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { chromium } from 'playwright';
import { nativeMeasurements } from './result.mjs';
import { nativeActions } from '../openclaw/result.mjs';
import { uploadEvidence, downloadEvidence } from '../openclaw/file-evidence.mjs';
import { sanitize } from '../../scripts/privacy.mjs';
import { stopProcessGroup } from '../recued/lib/process-group.mjs';

export async function measure({ task, config, installation, root, work, gateway }) {
  const workspace = join(work, 'workspace'), home = join(work, 'home'), profile = join(work, 'hermes'), temporary = join(work, 'tmp'), downloads = join(work, 'downloads');
  for (const path of [workspace, home, profile, temporary, downloads, join(profile, 'plugins/bench-observer')]) mkdirSync(path, { recursive: true });
  let attached;
  if (task.attach) { attached = join(workspace, task.attach.filename); writeFileSync(attached, task.attach.text); }
  writeFileSync(join(workspace, 'AGENTS.md'), '# Browser task environment\n\n'
    + 'Use the native browser_exec tool for website navigation and interaction.\n'
    + 'Standalone web fetch/search tools are disabled. Do not read web page HTML with shell or script HTTP clients.\n'
    + 'Local file operations are allowed for attachments and browser downloads. After locating a PDF or document through the browser, document tools or a local download plus text extraction may read it. A requested browser download must use the browser.\n'
    + `Keep output files inside this workspace or the browser download directory: ${downloads}\n`
    + (attached ? `The user attachment is available at: ${attached}\n` : ''));
  copyFileSync(new URL('./observe.py', import.meta.url), join(profile, 'plugins/bench-observer/__init__.py'));
  writeFileSync(join(profile, 'plugins/bench-observer/plugin.yaml'), 'name: bench-observer\nversion: 1.0.0\ndescription: Passive benchmark accounting\nauthor: Recued\n');
  const modelContext = config.hermesContextWindow ?? (config.model.startsWith('qwen3.7-plus') ? 1_000_000 : 262144);
  const provider = { provider: 'custom', model: config.model, base_url: gateway.baseUrl, api_key: gateway.credential };
  writeFileSync(join(profile, 'config.yaml'), JSON.stringify({
    model: { ...provider, default: config.model, context_length: modelContext },
    browser: { executable_path: installation.chromium, headed: false, user_data_dir: '', inactivity_timeout: config.maxSeconds + 60 },
    plugins: { enabled: ['bench-observer'] },
    agent: { skills: { creation_nudge_interval: 0 } },
    auxiliary: { title_generation: { enabled: false }, ...Object.fromEntries(['compression', 'approval', 'mcp'].map(task => [task, provider])) },
    terminal: { backend: 'local', cwd: workspace },
  }));
  const eventsPath = join(work, 'events.jsonl'); writeFileSync(eventsPath, '');
  const requestPath = join(work, 'hermes-request.json');
  writeFileSync(requestPath, JSON.stringify({ task, config, work, gateway: { baseUrl: gateway.baseUrl } }));
  const environment = Object.fromEntries(['PATH', 'LANG', 'SSL_CERT_FILE', 'SSL_CERT_DIR', 'HTTPS_PROXY', 'HTTP_PROXY', 'ALL_PROXY', 'NO_PROXY'].filter(key => process.env[key] !== undefined).map(key => [key, process.env[key]]));
  Object.assign(environment, { HOME: home, HERMES_HOME: profile, TMPDIR: temporary, BH_AGENT_WORKSPACE: workspace,
    BENCH_GATEWAY_KEY: gateway.credential, OPENAI_API_KEY: gateway.credential, OPENAI_BASE_URL: gateway.baseUrl,
    BENCH_HERMES_EVENTS: eventsPath, ANONYMIZED_TELEMETRY: 'false', BROWSER_USE_CLOUD_SYNC: 'false' });
  const child = spawn(installation.hermesPython, ['-I', join(root, 'harness/hermes/run.py'), requestPath], { env: environment, cwd: workspace, detached: true, stdio: ['ignore', 'pipe', 'pipe'] });
  let tail = '', exited = false, exitCode, timedOut = false, cleanupForced = false;
  for (const stream of [child.stdout, child.stderr]) stream.on('data', data => { tail = (tail + data).slice(-8000); });
  const completion = new Promise((resolve, reject) => { child.once('error', reject); child.once('close', code => { exited = true; exitCode = code; resolve(); }); });
  const timer = setTimeout(() => { timedOut = true; stopProcessGroup(child.pid, { graceMs: 5000 }); }, (config.maxSeconds + 120) * 1000);
  const browsers = [], observations = [], connected = new Set();
  let observing = false, observerTimer, observerTask;
  try {
    const prepared = join(work, 'prepared.json'), nativePath = join(work, 'native.json'), errorPath = join(work, 'native-error.json');
    const deadline = Date.now() + 120_000;
    while (!existsSync(prepared) && !existsSync(errorPath) && !exited) {
      if (Date.now() > deadline) throw new Error('Hermes browser preparation timed out');
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    if (!existsSync(prepared)) throw new Error(existsSync(errorPath) ? JSON.parse(readFileSync(errorPath)).error : `Hermes exited (${exitCode}) before browser preparation`);
    const observeBrowsers = async endpoints => {
      if (observing) return;
      observing = true;
      try {
        for (const endpoint of endpoints) {
          if (connected.has(endpoint)) continue;
          let browser;
          try {
            browser = await chromium.connectOverCDP(endpoint, { timeout: 3000 });
            const context = browser.contexts()[0];
            const upload = task.id === 'J' ? await uploadEvidence(context, task.attach) : () => ({ uploaded: false, selections: [], submissions: [] });
            observations.push({ upload, download: downloadEvidence(context, downloads, [workspace]) });
            browsers.push(browser); connected.add(endpoint);
          } catch { await browser?.close().catch(() => {}); }
        }
      } finally { observing = false; }
    };
    await observeBrowsers([JSON.parse(readFileSync(prepared)).cdp_url]);
    if (!observations.length) throw new Error('Hermes browser observer could not attach');
    // Hermes can replace a lost browser or create a named/local-sidecar session.
    // Observe the native session registry after tools; never steer its routing.
    observerTimer = setInterval(() => {
      if (observing) return;
      try { observerTask = observeBrowsers(JSON.parse(readFileSync(join(work, 'browser-endpoints.json')))); } catch {}
    }, 100);
    writeFileSync(join(work, 'go'), '');
    let replyAt;
    while (!exited) {
      if (existsSync(nativePath) || existsSync(errorPath)) replyAt ??= Date.now();
      if (replyAt && Date.now() - replyAt > 5000) {
        cleanupForced = true;
        stopProcessGroup(child.pid, { graceMs: 1000 });
      }
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    await completion;
    const events = readFileSync(eventsPath, 'utf8').split('\n').filter(Boolean).flatMap(line => { try { return [JSON.parse(line)]; } catch { return []; } });
    const native = existsSync(nativePath) ? JSON.parse(readFileSync(nativePath)) : {};
    const measured = nativeMeasurements(native, events, config.maxSeconds);
    if (existsSync(errorPath)) measured.error ??= JSON.parse(readFileSync(errorPath)).error;
    if (timedOut) { measured.timed_out = true; measured.error ??= 'Hermes task time limit'; }
    if (exitCode !== 0 && !cleanupForced) measured.error ??= `Hermes exited (${exitCode})`;
    clearInterval(observerTimer);
    await observerTask;
    await Promise.all(observations.map(row => row.download.settle()));
    const uploads = observations.map(row => row.upload()), downloadRows = observations.map(row => row.download.read());
    const uploadObservation = { uploaded: uploads.some(row => row.uploaded), selections: uploads.flatMap(row => row.selections ?? []), submissions: uploads.flatMap(row => row.submissions ?? []) };
    const downloadObservation = { saved_file: downloadRows.some(row => row.saved_file), files: downloadRows[0]?.files ?? [], browser_downloads: downloadRows.flatMap(row => row.browser_downloads) };
    const { ledger, accounting_complete, clock, native_summary, ...result } = measured;
    return sanitize({ ...result, approvals: 0, actions: nativeActions(events.filter(event => event.kind === 'tool'), [work, root]),
      evidence: { uploaded: uploadObservation.uploaded, upload_observation: uploadObservation, ...downloadObservation, observed_browser_sessions: observations.length,
        native_completed: !measured.error && !measured.timed_out, native_clock: clock, native_model_calls: ledger,
        cleanup_after_native_reply: cleanupForced,
        native_accounting_complete: accounting_complete, native_summary, native_tools: events.find(event => event.kind === 'native_ready')?.tools,
        browser_profile: 'fresh Hermes local Chromium through default browser_exec and browser-harness',
        model_context_window: modelContext, ...(measured.error ? { diagnostics: tail } : {}) },
    }, { paths: [work, root], secrets: [gateway.credential] });
  } catch (error) {
    throw new Error(`${error.message}; ${sanitize(tail, { paths: [work, root], secrets: [gateway.credential] })}`);
  } finally { clearTimeout(timer); clearInterval(observerTimer); await observerTask; stopProcessGroup(child.pid, { graceMs: 1000 }); await Promise.all(browsers.map(browser => browser.close().catch(() => {}))); }
}
