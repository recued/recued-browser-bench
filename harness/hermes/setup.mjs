import { spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, renameSync, rmSync } from 'node:fs';
import { join } from 'node:path';

export const HERMES_VERSION = '0.23.1';
export const HERMES_SHA256 = '52a8eb321f368576034f40595491abf9646b60c3861eee0cf45f610e5faa9bb6';
export function installHermes(root, bootstrapPython) {
  const runtime = join(root, '.bench'), tools = join(runtime, 'hermes-tools');
  const sourceRoot = join(runtime, 'hermes-source'), archive = join(sourceRoot, `v${HERMES_VERSION}.tar.gz`);
  const source = join(sourceRoot, `unpacked/hermes-agent-${HERMES_VERSION}`), venv = join(runtime, 'hermes-venv');
  const run = (command, args, options = {}) => {
    const result = spawnSync(command, args, { stdio: 'inherit', ...options });
    if (result.status !== 0) throw new Error(`Hermes setup command failed (${result.status ?? result.error?.code}).`);
  };
  const digest = path => createHash('sha256').update(readFileSync(path)).digest('hex');
  mkdirSync(sourceRoot, { recursive: true });
  if (!existsSync(archive) || digest(archive) !== HERMES_SHA256) {
    const temporary = `${archive}.download`;
    try {
      run('curl', ['--fail', '--location', '--silent', '--show-error', '--retry', '3', '--connect-timeout', '30', '--max-time', '600', `https://codeload.github.com/NousResearch/hermes-agent/tar.gz/refs/tags/v${HERMES_VERSION}`, '-o', temporary]);
      if (digest(temporary) !== HERMES_SHA256) throw new Error('Hermes source checksum mismatch.');
      renameSync(temporary, archive);
    } finally { rmSync(temporary, { force: true }); }
  }
  run(bootstrapPython, ['-I', '-m', 'venv', tools]);
  const bin = process.platform === 'win32' ? 'Scripts' : 'bin';
  const toolsPython = join(tools, bin, process.platform === 'win32' ? 'python.exe' : 'python');
  const uv = join(tools, bin, process.platform === 'win32' ? 'uv.exe' : 'uv');
  run(toolsPython, ['-I', '-m', 'pip', 'install', '--disable-pip-version-check', 'uv==0.13.7']);
  let python = [process.env.BENCH_HERMES_PYTHON, 'python3.14'].filter(Boolean).find(command => spawnSync(command, ['-I', '-c', 'import sys; sys.exit(0 if sys.version_info[:3] == (3,14,6) else 1)'], { stdio: 'ignore' }).status === 0);
  const env = { ...process.env, UV_PYTHON_INSTALL_DIR: join(runtime, 'hermes-python'), UV_PROJECT_ENVIRONMENT: venv };
  if (!python) {
    run(uv, ['python', 'install', '3.14.6', '--no-bin'], { env });
    const found = spawnSync(uv, ['python', 'find', '--managed-python', '3.14.6'], { env, encoding: 'utf8' });
    if (found.status !== 0) throw new Error('Cannot locate owned Hermes Python.');
    python = found.stdout.trim();
  }
  if (!existsSync(join(source, 'uv.lock'))) {
    mkdirSync(join(sourceRoot, 'unpacked'), { recursive: true });
    run(python, ['-I', '-c', 'import tarfile,sys; tarfile.open(sys.argv[1]).extractall(sys.argv[2], filter="data")', archive, join(sourceRoot, 'unpacked')]);
  }
  // Upstream's lock and dependency overrides are required (notably Pillow).
  run(uv, ['sync', '--project', source, '--frozen', '--no-dev', '--no-default-groups', '--no-install-project', '--python', python], { env });
  const nativePython = join(venv, bin, process.platform === 'win32' ? 'python.exe' : 'python');
  run(uv, ['pip', 'install', '--python', nativePython, '--no-deps', '--editable', source], { env });
  return { hermes: HERMES_VERSION, hermesSourceSha256: HERMES_SHA256, hermesPythonVersion: '3.14.6', hermesBrowserHarness: '0.1.13', hermesPython: nativePython, hermesSource: source };
}
