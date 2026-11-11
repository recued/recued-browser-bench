import { spawnSync } from 'node:child_process';
import { chmodSync, existsSync, mkdirSync, readFileSync, renameSync, rmSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { resolve, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { installHermes } from '../harness/hermes/setup.mjs';

const root = fileURLToPath(new URL('../', import.meta.url));
process.chdir(root);
const [nodeMajor, nodeMinor] = process.versions.node.split('.').map(Number);
if (!(nodeMajor === 24 && nodeMinor >= 16 || nodeMajor === 26 && nodeMinor >= 1 || nodeMajor > 26)) throw new Error('OpenClaw requires Node 24.16+ in the 24.x line, or Node 26.1+. This bench is qualified with Node 24.19.0.');
const runtime = join(root, '.bench');
mkdirSync(runtime, { recursive: true });
const pubkey = 'RWTil936tuWhcHNYDf4Ras3oygZ3YYRo1VNcslibSfACY9e6piKLxf8v';
const hash = p => createHash('sha256').update(readFileSync(p)).digest('hex');
function run(command, args, options = {}) {
  const result = spawnSync(command, args, { stdio: 'inherit', ...options });
  if (result.status !== 0) throw new Error(`${command} failed (${result.status ?? result.error?.code}).`);
}
function available(command) {
  return !spawnSync(command, ['--version'], { stdio: 'ignore' }).error;
}
if (!available('minisign')) throw new Error('Install minisign first: brew install minisign (macOS), apt-get install minisign (Debian/Ubuntu).');
if (!available('pdftotext')) throw new Error('Task K needs poppler: brew install poppler (macOS), apt-get install poppler-utils (Debian/Ubuntu).');
const platform = { darwin: 'macos', linux: 'linux', win32: 'windows' }[process.platform];
if (!platform || !['x64', 'arm64'].includes(process.arch)) throw new Error('No pinned Recued binary for this platform.');
const triple = `${platform}-${process.arch}`;
const manifestPath = join(root, 'versions/recued-26.11.9/manifest.json');
if (hash(manifestPath) !== 'ceb64f9133af2097273b59e555680c49c363faf2dec077b5356a7db09a43d416') throw new Error('Pinned manifest changed.');
run('minisign', ['-V', '-m', manifestPath, '-x', `${manifestPath}.minisig`, '-P', pubkey]);
const manifest = JSON.parse(readFileSync(manifestPath));
if (manifest.sequence !== 56 || manifest.channels.stable.version !== '26.11.9') throw new Error('Wrong Recued manifest.');
if (Date.parse(manifest.expires_at) <= Date.now()) throw new Error('Pinned release manifest expired.');
const install = join(runtime, 'recued');
mkdirSync(join(install, 'lib'), { recursive: true });
for (const [key, target] of [[triple, join(install, platform === 'windows' ? 'recued.exe' : 'recued')], [`lib-${triple}`, join(install, 'lib/better_sqlite3.node')]]) {
  const artifact = manifest.channels.stable.artifacts[key];
  const url = new URL(artifact.url);
  if (url.origin !== 'https://releases.recued.com' || !url.pathname.startsWith('/artifacts/56/')) throw new Error('Unexpected artifact origin.');
  if (!existsSync(target) || hash(target) !== artifact.sha256) {
    const temporary = `${target}.download`;
    try {
      run('curl', ['--fail', '--location', '--silent', '--show-error', '--retry', '3', '--connect-timeout', '30', '--max-time', '600', artifact.url, '-o', temporary]);
      if (hash(temporary) !== artifact.sha256) throw new Error(`SHA-256 mismatch: ${key}`);
      renameSync(temporary, target);
    } finally { rmSync(temporary, { force: true }); }
  }
  writeFileSync(`${target}.minisig`, artifact.sig);
  run('minisign', ['-V', '-m', target, '-x', `${target}.minisig`, '-P', pubkey]);
  chmodSync(target, 0o755);
}
run(join(install, platform === 'windows' ? 'recued.exe' : 'recued'), ['--version']);
const bridge = join(root, 'bridge/recued-bridge-0.0.8.zip');
if (hash(bridge) !== 'bde925587454959e4ca148da0445f6dcfc1d997df90c1f2a51c98608aae314ad') throw new Error('Bridge ZIP checksum mismatch.');
rmSync(join(runtime, 'bridge'), { recursive: true, force: true });
run('unzip', ['-q', bridge, '-d', join(runtime, 'bridge')]);
run(process.platform === 'win32' ? 'npm.cmd' : 'npm', ['ci', '--no-audit', '--no-fund']);
run(process.platform === 'win32' ? 'npm.cmd' : 'npm', ['ci', '--prefix', 'harness/openclaw/runtime', '--no-audit', '--no-fund', '--prefer-offline']);
const python = process.env.BENCH_PYTHON ?? ['python3.13', 'python3.12', 'python3.11', 'python3'].find(command => {
  const r = spawnSync(command, ['-c', 'import sys;sys.exit(0 if sys.version_info >= (3,11,5) else 1)'], { stdio: 'ignore' });
  return r.status === 0;
});
if (!python || spawnSync(python, ['-c', 'import sys;sys.exit(0 if sys.version_info >= (3,11,5) else 1)'], { stdio: 'ignore' }).status !== 0) throw new Error('Install Python 3.11.5+ or set BENCH_PYTHON. Earlier Python 3.11 releases have a regex bug affecting Soup Sieve.');
run(python, ['-m', 'venv', join(runtime, 'venv')]);
const venvPython = join(runtime, 'venv', process.platform === 'win32' ? 'Scripts/python.exe' : 'bin/python');
const requirements = existsSync('harness/browser-use/requirements.lock.txt') ? 'harness/browser-use/requirements.lock.txt' : 'harness/browser-use/requirements.txt';
run(venvPython, ['-I', '-m', 'pip', 'install', '--disable-pip-version-check', '-r', requirements]);
const browserEnvironment = { ...process.env, PLAYWRIGHT_BROWSERS_PATH: join(runtime, 'browsers') };
run(process.execPath, ['node_modules/playwright/cli.js', 'install', 'chromium', '--no-shell'], { env: browserEnvironment });
process.env.PLAYWRIGHT_BROWSERS_PATH = browserEnvironment.PLAYWRIGHT_BROWSERS_PATH;
// Resolve in a separate process: Playwright reads its browser path at module load.
const location = spawnSync(process.execPath, ['--input-type=module', '-e', "import {chromium} from 'playwright'; console.log(chromium.executablePath())"], { env: browserEnvironment, encoding: 'utf8' });
if (location.status !== 0) throw new Error('Cannot resolve installed Chromium.');
const hermes = installHermes(root, python);
writeFileSync(join(runtime, 'installation.json'), JSON.stringify({
  recued: '26.11.9', bridge: '0.0.8', browserUse: '0.13.14', playwrightMcp: '0.0.85', stagehand: '3.7.3', playwright: '1.61.1',
  openclaw: '2026.11.2', browserHarness: '0.1.13', openclawCli: join(root, 'harness/openclaw/runtime/node_modules/openclaw/openclaw.mjs'),
  triple, binary: join(install, platform === 'windows' ? 'recued.exe' : 'recued'), python: venvPython,
  chromium: location.stdout.trim(), browsersPath: browserEnvironment.PLAYWRIGHT_BROWSERS_PATH,
  ...hermes,
}, null, 2) + '\n');
console.log('Setup complete. Set BENCH_BASE_URL and BENCH_API_KEY, then ./run.');
