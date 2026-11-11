import { randomUUID } from 'node:crypto';
import { createServer } from 'node:net';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';
import { openclawConfig, workspaceInstructions } from './config.mjs';
import { nativeMeasurements, nativeActions } from './result.mjs';
import { nativeCli } from './native-cli.mjs';
import { browserUseEnvironment } from './browser-use.mjs';
import { sanitize } from '../../scripts/privacy.mjs';
import { uploadEvidence, downloadEvidence, nativeDownloadFiles, cleanupNativeDownloads } from './file-evidence.mjs';

const freePort = () => new Promise((resolve, reject) => {
  const server = createServer(); server.once('error', reject);
  server.listen(0, '127.0.0.1', () => { const port = server.address().port; server.close(() => resolve(port)); });
});

export async function measure({ arm, task, config, installation, root, work, gateway }) {
  const browserUse = arm === 'openclaw-browser-use';
  const workspace = join(work, 'workspace'), temporary = join(work, 'tmp'), downloads = join(work, 'downloads');
  for (const path of [workspace, temporary, downloads, join(work, 'home'), join(work, 'state'), join(work, 'profile')]) mkdirSync(path, { recursive: true });
  let attached;
  if (task.attach) {
    const directory = join(temporary, 'openclaw/uploads'); mkdirSync(directory, { recursive: true });
    attached = join(directory, task.attach.filename); writeFileSync(attached, task.attach.text);
  }
  writeFileSync(join(workspace, 'AGENTS.md'), workspaceInstructions(attached, browserUse, downloads));
  const cdpPort = await freePort(), gatewayPort = await freePort();
  const configuration = openclawConfig({ config, work, gateway, cdpPort, gatewayPort, browserUse });
  const configPath = join(work, 'openclaw.json'); writeFileSync(configPath, JSON.stringify(configuration, null, 2));
  const eventsPath = join(work, 'openclaw-events.jsonl'); writeFileSync(eventsPath, '');
  const messagePath = join(work, 'message.txt'); writeFileSync(messagePath, task.ask);
  const context = await chromium.launchPersistentContext(join(work, 'profile'), {
    executablePath: installation.chromium, headless: true, args: ['--no-sandbox', `--remote-debugging-port=${cdpPort}`],
    acceptDownloads: true, downloadsPath: downloads, viewport: { width: 1280, height: 900 },
  });
  let browserUseRuntime;
  let nativeArtifacts = [];
  const uploadObservation = task.id === 'J' ? await uploadEvidence(context, task.attach) : () => ({ uploaded: false });
  const downloadObservation = downloadEvidence(context, downloads, [join(temporary, 'openclaw/downloads'), workspace]);
  const environment = Object.fromEntries(['PATH', 'HOME', 'USER', 'LOGNAME', 'LANG', 'SSL_CERT_FILE', 'SSL_CERT_DIR', 'HTTPS_PROXY', 'HTTP_PROXY', 'ALL_PROXY', 'NO_PROXY'].filter(key => process.env[key] !== undefined).map(key => [key, process.env[key]]));
  Object.assign(environment, {
    OPENCLAW_HOME: join(work, 'home'), OPENCLAW_STATE_DIR: join(work, 'state'), OPENCLAW_CONFIG_PATH: configPath,
    TMPDIR: temporary, BENCH_OPENCLAW_CLI: installation.openclawCli, BENCH_OPENCLAW_EVENTS: eventsPath,
  });
  const observer = fileURLToPath(new URL('./observe.mjs', import.meta.url));
  try {
    if (browserUse) browserUseRuntime = browserUseEnvironment({ installation, work, cdpPort, environment });
    const { native, exit, stderr, timedOut, cleanupForced } = await nativeCli({ command: process.execPath,
      args: ['--import', observer, installation.openclawCli, 'agent', '--local', '--json', '--agent', 'bench', '--session-id', randomUUID(), '--message-file', messagePath,
        ...(config.thinking !== 'default' ? ['--thinking', config.thinking === 'on' ? 'medium' : 'off'] : []), '--timeout', String(config.maxSeconds)],
      cwd: workspace, env: browserUseRuntime?.env ?? environment, timeoutMs: (config.maxSeconds + 60) * 1000 });
    const events = readFileSync(eventsPath, 'utf8').split('\n').filter(Boolean).map(line => { try { return JSON.parse(line); } catch { return null; } }).filter(Boolean);
    const measured = nativeMeasurements(native, events, config.maxSeconds);
    if (timedOut) { measured.timed_out = true; measured.error ??= 'agent did not finish'; }
    if (exit !== 0 && !cleanupForced) measured.error ??= `OpenClaw exited (${exit})`;
    const tools = events.filter(row => row.source === 'agent' && row.event.stream === 'tool').map(row => row.event.data);
    const nativeDownloads = nativeDownloadFiles(tools, measured.clock);
    nativeArtifacts = nativeDownloads.artifacts;
    await downloadObservation.settle();
    const privatePaths = [work, root, browserUseRuntime?.runtime, ...nativeArtifacts.map(artifact => artifact.path)].filter(Boolean);
    const actions = nativeActions(tools, privatePaths);
    const { clock, ledger, accounting_complete, native_summary, ...result } = measured;
    return sanitize({
      ...result, approvals: 0, actions,
      evidence: {
        uploaded: uploadObservation().uploaded, upload_observation: uploadObservation(),
        ...downloadObservation.read(nativeDownloads.files),
        native_completed: !measured.timed_out && !measured.error,
        native_clock: clock, native_model_calls: ledger, native_accounting_complete: accounting_complete,
        native_summary, native_system_prompt_report: native.meta?.systemPromptReport,
        ...(measured.error ? { diagnostics: stderr } : {}),
        browser_profile: browserUse ? 'fresh runner-owned Chromium attached through published browser-use CLI and skill' : 'fresh runner-owned Chromium attached through native OpenClaw CDP profile',
        cleanup_after_native_reply: cleanupForced,
        native_cost_prices_configured: false,
        non_browser_http_tools: 'web fetch/search disabled; workspace forbids shell HTML fetches and permits discovered-document extraction',
        model_context_window: configuration.models.providers.bench.models[0].contextWindow,
      },
    }, { paths: privatePaths });
  } finally {
    browserUseRuntime?.close();
    cleanupNativeDownloads(nativeArtifacts);
    let closingTimer;
    try { await Promise.race([context.close().catch(() => {}), new Promise(resolve => { closingTimer = setTimeout(resolve, 15_000); })]); }
    finally { clearTimeout(closingTimer); }
  }
}
