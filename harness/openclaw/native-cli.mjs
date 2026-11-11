import { spawn } from 'node:child_process';

// --json reserves stdout for the completed native reply. Some local OpenClaw
// browser resources keep the CLI alive afterward. Reap that task-owned process
// after the reply, without turning successful work into a task timeout.
export async function nativeCli({ command, args, cwd, env, timeoutMs, cleanupMs = 1500 }) {
  const grouped = process.platform !== 'win32';
  const child = spawn(command, args, { cwd, env, detached: grouped, stdio: ['ignore', 'pipe', 'pipe'] });
  let stdout = '', stderr = '', native, timedOut = false, cleanupForced = false, cleanupTimer, killTimer, exitTimer, finish;
  const kill = signal => { try { if (grouped) process.kill(-child.pid, signal); else child.kill(signal); } catch {} };
  const signal = () => kill('SIGTERM');
  process.once('SIGTERM', signal); process.once('SIGINT', signal);
  const terminate = () => {
    kill('SIGTERM');
    killTimer = setTimeout(() => { kill('SIGKILL'); finish?.(child.exitCode); }, 2000);
  };
  const deadline = setTimeout(() => { timedOut = true; terminate(); }, timeoutMs);
  child.stderr.on('data', bytes => { stderr = (stderr + String(bytes)).slice(-4000); });
  child.stdout.on('data', bytes => {
    stdout += String(bytes);
    if (native) return;
    try {
      const value = JSON.parse(stdout);
      if (!value || typeof value !== 'object' || !value.meta && !value.error) return;
      native = value;
      clearTimeout(deadline);
      cleanupTimer = setTimeout(() => { cleanupForced = true; terminate(); }, cleanupMs);
    } catch { /* Wait for the rest of the JSON envelope. */ }
  });
  try {
    const exit = await new Promise((resolve, reject) => {
      finish = resolve;
      child.once('error', reject); child.once('close', resolve);
      // A launcher can exit while a descendant still owns its stdout pipe.
      child.once('exit', code => { exitTimer = setTimeout(() => { cleanupForced = Boolean(native); kill('SIGTERM'); resolve(code); }, cleanupMs); });
    });
    return { native: native ?? { ok: false, error: { message: `OpenClaw exited (${exit}) without a JSON reply` } }, stderr, exit, timedOut, cleanupForced };
  } finally {
    clearTimeout(deadline); clearTimeout(cleanupTimer); clearTimeout(killTimer); clearTimeout(exitTimer);
    kill('SIGTERM'); child.stdout.destroy(); child.stderr.destroy();
    process.removeListener('SIGTERM', signal); process.removeListener('SIGINT', signal);
  }
}
