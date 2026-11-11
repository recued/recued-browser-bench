import { createHash, randomUUID } from 'node:crypto';
import { existsSync, lstatSync, readFileSync, readdirSync, statSync, unlinkSync } from 'node:fs';
import { basename, join } from 'node:path';

const filesIn = directory => !existsSync(directory) ? [] : readdirSync(directory, { withFileTypes: true }).flatMap(entry => {
  const path = join(directory, entry.name);
  return entry.isDirectory() ? filesIn(path) : [{ name: entry.name, size_bytes: statSync(path).size }];
});

// The native browser can save outside the task's TMPDIR. Read only paths from
// its structured tool result, never paths claimed in assistant text or shell
// output. A download event is still required by downloadEvidence below.
export function nativeDownloadFiles(tools, clock) {
  const files = [], artifacts = [], seen = new Set();
  if (!Number.isFinite(clock?.started_at) || !Number.isFinite(clock?.ended_at)) return { files, artifacts };
  for (const tool of tools) {
    if (tool.name !== 'browser' || tool.phase !== 'result' || tool.isError) continue;
    const claims = tool.result?.details?.downloads;
    if (!Array.isArray(claims)) continue;
    for (const download of claims) {
      if (!download || typeof download.path !== 'string' || typeof download.suggestedFilename !== 'string' || seen.has(download.path)) continue;
      seen.add(download.path);
      try {
        const stat = lstatSync(download.path);
        if (!stat.isFile() || typeof process.getuid === 'function' && stat.uid !== process.getuid()
          || stat.mtimeMs < clock.started_at || stat.mtimeMs > clock.ended_at) continue;
        const name = download.suggestedFilename.replace(/[^A-Za-z0-9._-]/g, '_');
        if (!name) continue;
        files.push({ name, size_bytes: stat.size, sha256: createHash('sha256').update(readFileSync(download.path)).digest('hex'), source: 'native-browser-tool' });
        // OpenClaw generates UUID-prefixed artifacts in its shared download
        // root. Only those exact, fresh files belong to this task's cleanup.
        if (/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}-/i.test(basename(download.path))) {
          artifacts.push({ path: download.path, dev: stat.dev, ino: stat.ino, size: stat.size, mtimeMs: stat.mtimeMs });
        }
      } catch { /* A missing or unfinished artifact is not a successful save. */ }
    }
  }
  return { files, artifacts };
}

export function cleanupNativeDownloads(artifacts) {
  for (const artifact of artifacts) try {
    const stat = lstatSync(artifact.path);
    if (stat.isFile() && ['dev', 'ino', 'size', 'mtimeMs'].every(key => stat[key] === artifact[key])) unlinkSync(artifact.path);
  } catch { /* Preserve anything whose ownership can no longer be established. */ }
}

export function downloadEvidence(context, directory, otherDirectories = [], expectedBytes = 12499601) {
  const downloads = [], saves = [];
  const observe = page => page.on('download', download => {
    const row = { name: download.suggestedFilename().replace(/[^A-Za-z0-9._-]/g, '_'), pending: true };
    downloads.push({ row, download });
    saves.push(download.saveAs(join(directory, row.name)).then(() => { row.saved = true; }, () => { row.saved = false; }).finally(() => { row.pending = false; }));
  });
  context.pages().forEach(observe); context.on('page', observe);
  return {
    async settle() {
      let timer;
      try { await Promise.race([Promise.allSettled(saves), new Promise(resolve => { timer = setTimeout(resolve, 2000); })]); }
      finally { clearTimeout(timer); }
      // A stalled download must not hold the harness open past the completed
      // or failed native turn. Cancellation is cleanup after that turn ends.
      for (const { row, download } of downloads) if (row.pending) void download.cancel().catch(() => {});
    },
    read(nativeFiles = []) {
      const localFiles = filesIn(directory);
      const files = [...localFiles, ...otherDirectories.flatMap(filesIn), ...nativeFiles].filter(file => !['AGENTS.md', 'SKILL.md'].includes(file.name));
      const matches = (list, row) => list.some(file => file.name === row.name && file.size_bytes === expectedBytes);
      return { files, browser_downloads: downloads.map(({ row }) => ({ ...row, ...(matches(nativeFiles, row) ? { native_saved: true } : {}) })),
        saved_file: downloads.some(({ row }) => row.saved && matches(localFiles, row) || matches(nativeFiles, row)) };
    },
  };
}

// Chromium can omit multipart file bytes from Network.getRequestPostData.
// Passively observe the file selected in the page, then require a multipart
// request to the upload site. The observer never selects or submits anything.
export async function uploadEvidence(context, attachment, origin = 'https://practice.expandtesting.com') {
  const selections = [], submissions = [];
  const binding = `__uploadObserver_${randomUUID().replaceAll('-', '')}`;
  await context.exposeBinding(binding, ({ frame }, file) => {
    if (!frame.url().startsWith(origin + '/')) return;
    const matches = file.name === attachment.filename && file.text === attachment.text;
    selections.push({ name: file.name, size_bytes: file.size, matches_attachment: matches, selected_at: file.selected_at });
  });
  const install = ({ binding }) => {
    if (globalThis[binding + '_installed']) return;
    globalThis[binding + '_installed'] = true;
    document.addEventListener('change', async event => {
      if (!(event.target instanceof HTMLInputElement) || event.target.type !== 'file') return;
      const selectedAt = Date.now();
      for (const file of event.target.files ?? []) {
        await globalThis[binding]({ name: file.name, size: file.size, selected_at: selectedAt, text: await file.text() });
      }
    }, true);
  };
  await context.addInitScript(install, { binding });
  // Native agents may create a named browser and navigate before an observer
  // discovers it. Init scripts cover future documents; install the same passive
  // listener in existing documents as well.
  await Promise.all(context.pages().flatMap(page => page.frames()).map(frame => frame.evaluate(install, { binding }).catch(() => {})));
  context.on('request', request => {
    if (request.method() !== 'POST' || !request.url().startsWith(origin + '/') || !/multipart\/form-data/i.test(request.headers()['content-type'] ?? '')) return;
    const body = request.postData() ?? '';
    const names = [...body.matchAll(/filename="([^"]*)"/g)].map(match => match[1]);
    submissions.push({ started_at: Date.now(), file_names: names, filename_compatible: !names.length || names.includes(attachment.filename) });
  });
  return () => ({ uploaded: submissions.some(request => {
    const selection = selections.filter(file => file.selected_at <= request.started_at).sort((a, b) => a.selected_at - b.selected_at).at(-1);
    return selection?.matches_attachment && request.filename_compatible;
  }), selections, submissions });
}
