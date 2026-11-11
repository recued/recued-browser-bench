// After ./setup: node qualification/check-openclaw-files.mjs [receipt.json]
// Real Chromium and the published browser-use CLI; no model calls or public site.
import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { spawn } from 'node:child_process';
import { EventEmitter } from 'node:events';
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { chromium } from 'playwright';
import { browserUseEnvironment } from '../harness/openclaw/browser-use.mjs';
import { uploadEvidence, downloadEvidence, nativeDownloadFiles, cleanupNativeDownloads } from '../harness/openclaw/file-evidence.mjs';

const root = fileURLToPath(new URL('../', import.meta.url));
process.chdir(root);
const installation = JSON.parse(readFileSync('.bench/installation.json'));
const attachment = { filename: 'qualification-upload.txt', text: 'Synthetic attachment for file evidence.\n' };
const environment = Object.fromEntries(['PATH', 'HOME', 'USER', 'LANG'].filter(key => process.env[key] !== undefined).map(key => [key, process.env[key]]));
async function runCli(work, environment, code) {
  const command = spawn(join(work, 'bin/browser-use'), [], { env: environment, cwd: join(work, 'workspace'), stdio: ['pipe', 'ignore', 'ignore'] });
  command.stdin.end(code);
  const timer = setTimeout(() => command.kill('SIGKILL'), 45_000);
  const status = await new Promise((resolve, reject) => { command.once('error', reject); command.once('close', resolve); }).finally(() => clearTimeout(timer));
  assert.equal(status, 0, 'published browser-use CLI must complete');
}
let autoSubmit = true, posts = [];
const server = createServer(async (request, response) => {
  if (request.url === '/download') response.writeHead(200, { 'content-type': 'application/octet-stream', 'content-disposition': 'attachment; filename="qualification-download.bin"' }).end(Buffer.alloc(1024, 42));
  else if (request.method === 'POST') {
    const chunks = []; for await (const bytes of request) chunks.push(bytes);
    const body = Buffer.concat(chunks);
    posts.push({ expected_content: body.includes(Buffer.from(attachment.text)), expected_name: body.includes(Buffer.from(attachment.filename)) });
    response.writeHead(200, { 'content-type': 'text/html' }).end('<h1>File Uploaded!</h1>');
  } else response.writeHead(200, { 'content-type': 'text/html' }).end(`<form method="post" action="/upload" enctype="multipart/form-data"><input type="file" name="file" ${autoSubmit ? 'onchange="this.form.submit()"' : ''}></form><a id="download" href="/download">Download fixture</a>`);
});
await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
const origin = `http://127.0.0.1:${server.address().port}`, cases = [];
try {
  for (const [name, text, submit, expected] of [
    ['correct attachment with immediate submission', attachment.text, true, true],
    ['same filename with wrong content', 'A different file.\n', true, false],
    ['selected attachment without submission', attachment.text, false, false],
  ]) {
    autoSubmit = submit; posts = [];
    mkdirSync('.bench/runs', { recursive: true });
    const work = mkdtempSync(join(root, '.bench/runs/file-evidence-'));
    mkdirSync(join(work, 'workspace')); const file = join(work, attachment.filename); writeFileSync(file, text);
    const portServer = createServer(); await new Promise(resolve => portServer.listen(0, '127.0.0.1', resolve));
    const cdpPort = portServer.address().port; await new Promise(resolve => portServer.close(resolve));
    const context = await chromium.launchPersistentContext(join(work, 'profile'), { executablePath: installation.chromium, headless: true, args: ['--no-sandbox', `--remote-debugging-port=${cdpPort}`] });
    let runtime;
    try {
      const evidence = await uploadEvidence(context, attachment, origin);
      const downloadDirectory = join(work, 'downloads'); mkdirSync(downloadDirectory);
      const downloaded = downloadEvidence(context, downloadDirectory, [], 1024);
      runtime = browserUseEnvironment({ installation, work, cdpPort, environment });
      const code = `new_tab(${JSON.stringify(origin + '/')})\nwait_for_load()\nupload_file('input[type=file]', ${JSON.stringify(file)})\nimport time\ntime.sleep(0.3)\n`;
      await runCli(work, runtime.env, code);
      const deadline = Date.now() + 5000;
      while ((!evidence().selections.length || submit && !posts.length) && Date.now() < deadline) await new Promise(resolve => setTimeout(resolve, 20));
      const observed = evidence();
      assert.equal(observed.uploaded, expected, name);
      assert.equal(posts.length, submit ? 1 : 0, name);
      if (expected) assert.equal(posts[0].expected_content && posts[0].expected_name, true);
      cases.push({ name, pass: true, expected_upload: expected, observed, server_posts: posts });
      if (expected) {
        writeFileSync(join(downloadDirectory, 'manually-written.bin'), Buffer.alloc(1024, 42));
        assert.equal(downloaded.read().saved_file, false);
        cases.push({ name: 'local file without a browser download', pass: true, observed: downloaded.read() });
        await runCli(work, runtime.env, `new_tab(${JSON.stringify(origin + '/')})\nwait_for_load()\njs(\"document.querySelector('#download').click()\")\nimport time\ntime.sleep(0.3)\n`);
        await downloaded.settle();
        assert.equal(downloaded.read().saved_file, true);
        cases.push({ name: 'browser download with matching saved artifact', pass: true, observed: downloaded.read() });

        // Run the pinned native save implementation against a real download.
        // Reproduce a failed secondary save while the native browser owns the
        // successfully saved UUID artifact outside the observer's directory.
        const { it: captureNativeDownload } = await import(pathToFileURL(join(dirname(installation.openclawCli), 'dist/pw-tools-core.interactions.navigation-D0d6CS7N.mjs')));
        const nativeRoot = join(work, 'native-browser-downloads'); mkdirSync(nativeRoot);
        const page = await context.newPage(); await page.goto(origin);
        const observedPage = new EventEmitter();
        const secondary = downloadEvidence({ pages: () => [observedPage], on() {} }, downloadDirectory, [], 1024);
        page.on('download', download => observedPage.emit('download', {
          suggestedFilename: () => download.suggestedFilename(),
          saveAs: async () => { throw new Error('Injected secondary-client save failure'); },
          cancel: () => download.cancel(),
        }));
        const startedAt = Date.now();
        const capture = captureNativeDownload(page, { downloadWaiterDepth: 0 }, 5000, { mode: 'explicit', outputRoot: nativeRoot });
        await page.click('#download');
        const saved = await capture.promise;
        await secondary.settle();
        await new Promise(resolve => setTimeout(resolve, 5));
        const collected = nativeDownloadFiles([{ name: 'browser', phase: 'result', result: { details: { downloads: [saved] } } }], { started_at: startedAt, ended_at: Date.now() });
        assert.equal(secondary.read().saved_file, false);
        assert.equal(collected.files.length, 1);
        assert.equal(secondary.read(collected.files).saved_file, true);
        cases.push({ name: 'native browser UUID artifact with failed secondary save', pass: true,
          native_implementation: 'OpenClaw 2026.11.2 createDownloadCaptureForPage', secondary_save_failure_injected: true, observed: secondary.read(collected.files) });
        cleanupNativeDownloads(collected.artifacts);
        assert.equal(existsSync(saved.path), false);
      }
    } finally { runtime?.close(); await context.close(); rmSync(work, { recursive: true, force: true }); }
  }
} finally { await new Promise(resolve => server.close(resolve)); }
const receipt = { date: new Date().toISOString(), browser_use: installation.browserUse, browser_harness: installation.browserHarness,
  browser: 'Chromium from Playwright 1.61.1', model_calls: 0, cases };
if (process.argv[2]) writeFileSync(process.argv[2], JSON.stringify(receipt, null, 2) + '\n');
console.log(JSON.stringify({ cases: cases.length, passed: cases.filter(row => row.pass).length, model_calls: 0 }));
