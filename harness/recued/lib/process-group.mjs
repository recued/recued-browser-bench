/** Stop a process AND everything it started, then prove they are gone.
 *
 *  ⛔⛔ WHY IT EXISTS. `scripts/live-drive.mjs` spawned its server as
 *  `npx tsx …/bin.ts serve`, and its teardown sent SIGTERM to the `npx` it
 *  spawned. The server is not `npx`: it is a node process further down that
 *  chain, and the signal never reached it. Every drive left its server running,
 *  and the NEXT drive's "marker on the wire" check could be answered by the
 *  leftover instead of the server it had just booted (found 2026-09-23, after
 *  one D-282 drive left three processes behind).
 *
 *  🔑 Spawn with `detached: true`, so the child LEADS a new process group, and
 *  signal the GROUP (`-pid`): every descendant that did not leave the group gets
 *  it. Then WAIT — reading the process table with `ps`, never `kill(-pgid, 0)`.
 *  The direct child is a zombie until this process reaps it, reaping needs the
 *  event loop, and a synchronous wait is blocking that loop: signal 0 would find
 *  the zombie and report the group alive for the whole grace period. */

import { execFileSync } from 'node:child_process';
import { connect } from 'node:net';

/** PIDs in process group `pgid` that are still running. Zombies are excluded:
 *  they have exited and only await reaping. */
export const livingInGroup = (pgid) => {
  let table;
  try {
    table = execFileSync('ps', ['-A', '-o', 'pid=,pgid=,stat='], { encoding: 'utf8' });
  } catch {
    return [];
  }
  return table.split('\n')
    .map((line) => line.trim().split(/\s+/))
    .filter(([pid, group, stat]) => pid && group === String(pgid) && stat && !stat.startsWith('Z'))
    .map(([pid]) => Number(pid));
};

const sleepSync = (ms) => {
  Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, ms);
};

/** SIGTERM the whole group, wait up to `graceMs` for it to go, then SIGKILL
 *  whatever is left. SYNCHRONOUS on purpose: it runs from `process.on('exit')`,
 *  where nothing asynchronous gets to finish. Returns the PIDs that survived even
 *  SIGKILL — empty when the group is gone. */
export const stopProcessGroup = (pgid, { graceMs = 10_000, pollMs = 100 } = {}) => {
  const signal = (sig) => {
    try { process.kill(-pgid, sig); } catch { /* the whole group is already gone */ }
  };
  const waitFor = (ms) => {
    let left = livingInGroup(pgid);
    for (let waited = 0; left.length > 0 && waited < ms; waited += pollMs) {
      sleepSync(pollMs);
      left = livingInGroup(pgid);
    }
    return left;
  };
  signal('SIGTERM');
  if (waitFor(graceMs).length === 0) return [];
  signal('SIGKILL');
  return waitFor(2_000);
};

/** Running processes whose command line contains `text` (zombies excluded). */
export const processesNaming = (text) => {
  let table;
  try {
    table = execFileSync('ps', ['-A', '-o', 'pid=,pgid=,stat=,command='], { encoding: 'utf8' });
  } catch {
    return [];
  }
  return table.split('\n')
    .map((line) => line.trim().match(/^(\d+)\s+(\d+)\s+(\S+)\s+(.*)$/u))
    .filter((m) => m !== null && m[4].includes(text) && !m[3].startsWith('Z'))
    .map((m) => ({ pid: Number(m[1]), pgid: Number(m[2]) }));
};

/** Stop every process whose command line names `text` — its whole group when
 *  it leads one, which is how Playwright launches a browser — and wait until
 *  none is left. Synchronous, like {@link stopProcessGroup}.
 *
 *  ⛔ FOR THE BROWSER, BEFORE ITS PROFILE IS DELETED. A drive that fails never
 *  closes its browser context, and the exit handler that deletes the profile
 *  runs BEFORE Playwright's own, which is what kills the browser: Chromium kept
 *  writing into the profile while it was being removed, the removal lost, the
 *  error was swallowed, and the profile stayed in tmp (found 2026-09-23). That
 *  profile holds PAIRED CREDENTIALS for the throwaway server. */
export const stopProcessesNaming = (text, { graceMs = 3_000, pollMs = 100 } = {}) => {
  const signal = (sig) => {
    for (const { pid, pgid } of processesNaming(text)) {
      try { process.kill(pid === pgid ? -pid : pid, sig); } catch { /* already gone */ }
    }
  };
  const waitFor = (ms) => {
    let left = processesNaming(text);
    for (let waited = 0; left.length > 0 && waited < ms; waited += pollMs) {
      sleepSync(pollMs);
      left = processesNaming(text);
    }
    return left.map(({ pid }) => pid);
  };
  signal('SIGTERM');
  if (waitFor(graceMs).length === 0) return [];
  signal('SIGKILL');
  return waitFor(2_000);
};

/** Does anything already accept TCP connections on `port`? */
export const portInUse = (port, host = '127.0.0.1') => new Promise((done) => {
  const socket = connect({ port, host });
  socket.once('connect', () => { socket.destroy(); done(true); });
  socket.once('error', () => done(false));
});
