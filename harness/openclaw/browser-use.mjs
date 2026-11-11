import { spawnSync } from 'node:child_process';
import { chmodSync, copyFileSync, existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

export function closeBrowserUseRuntime({ installation, work }) {
  const path = join(work, 'browser-use-runtime.json');
  if (!existsSync(path)) return;
  const { runtime } = JSON.parse(readFileSync(path));
  if (!/^\/tmp\/rbbu-[A-Za-z0-9]+$/.test(runtime) || !existsSync(runtime)) return;
  const environment = Object.fromEntries(['PATH', 'HOME', 'USER', 'LANG'].filter(key => process.env[key] !== undefined).map(key => [key, process.env[key]]));
  Object.assign(environment, { BH_HOME: join(work, 'browser-use'), BH_RUNTIME_DIR: runtime, BH_TMP_DIR: join(work, 'browser-use/tmp'), BH_AGENT_WORKSPACE: join(work, 'workspace'), BH_TELEMETRY: 'off' });
  // The published shutdown routine verifies its PID/start fingerprint before
  // signaling anything. The parent also calls this after a killed worker.
  spawnSync(installation.python, ['-I', '-c', 'from browser_harness.admin import restart_daemon; restart_daemon()'], { env: environment, timeout: 15_000, stdio: 'ignore' });
  rmSync(runtime, { recursive: true, force: true });
}

export function browserUseEnvironment({ installation, work, cdpPort, environment }) {
  const invoke = (code, options = {}) => spawnSync(installation.python, ['-I', '-c', code], { env: environment, encoding: 'utf8', timeout: 30_000, ...options });
  const locate = invoke("from pathlib import Path; import browser_use; print(Path(browser_use.__file__).parent / 'skills/browser-use/SKILL.md')");
  if (locate.status !== 0) throw new Error('Cannot locate the pinned browser-use skill. Run ./setup.');
  const skill = join(work, 'workspace/skills/browser-use'); mkdirSync(skill, { recursive: true });
  copyFileSync(locate.stdout.trim(), join(skill, 'SKILL.md'));
  const bin = join(work, 'bin'); mkdirSync(bin, { recursive: true });
  const cli = join(bin, 'browser-use');
  writeFileSync(cli, `#!${installation.python} -I\nfrom browser_use.cli import main\nimport sys\nsys.exit(main() or 0)\n`);
  chmodSync(cli, 0o755);
  // AF_UNIX paths on macOS are limited to 104 bytes. A short, separately owned
  // runtime prevents a deep checkout path from breaking the published daemon.
  const runtime = mkdtempSync('/tmp/rbbu-');
  writeFileSync(join(work, 'browser-use-runtime.json'), JSON.stringify({ runtime }));
  const env = { ...environment, PATH: `${bin}:${environment.PATH}`, BU_CDP_URL: `http://127.0.0.1:${cdpPort}`,
    BH_HOME: join(work, 'browser-use'), BH_RUNTIME_DIR: runtime, BH_TMP_DIR: join(work, 'browser-use/tmp'),
    BH_AGENT_WORKSPACE: join(work, 'workspace'), BH_TAB_MARKER: '0', BH_DOMAIN_SKILLS: '0', BH_TELEMETRY: 'off', BH_UPDATE_CHECK: 'off',
    ANONYMIZED_TELEMETRY: 'false', BROWSER_USE_CLOUD_SYNC: 'false', BROWSER_USE_CLOUD_HINTS: 'false' };
  const close = () => closeBrowserUseRuntime({ installation, work });
  const ready = invoke('from browser_harness.admin import ensure_daemon; ensure_daemon()', { env, timeout: 45_000 });
  if (ready.status !== 0) { close(); throw new Error('browser-use could not attach to the task-owned Chromium.'); }
  return { env, close, runtime };
}
