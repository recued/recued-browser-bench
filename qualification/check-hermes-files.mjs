// After ./setup: node qualification/check-hermes-files.mjs [receipt.json]
// Actual Hermes browser_exec/local Chromium; no model or public site.
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { createServer } from 'node:http';
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';
import { uploadEvidence, downloadEvidence } from '../harness/openclaw/file-evidence.mjs';
import { stopProcessGroup, stopProcessesNaming } from '../harness/recued/lib/process-group.mjs';

const root = fileURLToPath(new URL('../', import.meta.url)); process.chdir(root);
const installation = JSON.parse(readFileSync('.bench/installation.json'));
const attachment = { filename: 'qualification-upload.txt', text: 'Synthetic Hermes attachment.\n' };
let submit = true, posts = [];
const site = createServer(async (request, response) => {
  if (request.url === '/download') response.writeHead(200, { 'content-type': 'application/octet-stream', 'content-disposition': 'attachment; filename="fixture.bin"' }).end(Buffer.alloc(1024, 42));
  else if (request.method === 'POST') {
    const chunks = []; for await (const chunk of request) chunks.push(chunk);
    const body = Buffer.concat(chunks);
    posts.push({ expected_name: body.includes(attachment.filename), expected_content: body.includes(attachment.text) });
    response.writeHead(200, { 'content-type': 'text/html' }).end('<p>Uploaded</p><a id="download" href="/download">Download</a>');
  } else response.writeHead(200, { 'content-type': 'text/html' }).end(`<form action="/upload" method="post" enctype="multipart/form-data"><input type="file" name="file" ${submit ? 'onchange="this.form.submit()"' : ''}></form><a id="download" href="/download">Download</a>`);
});
await new Promise(resolve => site.listen(0, '127.0.0.1', resolve));
const origin = `http://127.0.0.1:${site.address().port}`, cases = [];
try {
  for (const [name, contents, shouldSubmit, expected, preloaded] of [
    ['correct attachment and submission', attachment.text, true, true],
    ['same filename with incorrect bytes', 'Other bytes.\n', true, false],
    ['correct selection without submission', attachment.text, false, false],
    ['observer attaches after native page navigation', attachment.text, true, true, true],
  ]) {
    submit = shouldSubmit; posts = [];
    const work = mkdtempSync(join(root, '.bench/runs/hermes-file-'));
    for (const name of ['home', 'hermes', 'workspace', 'tmp', 'downloads']) mkdirSync(join(work, name));
    const file = join(work, 'workspace', attachment.filename); writeFileSync(file, contents);
    writeFileSync(join(work, 'hermes/config.yaml'), JSON.stringify({ browser: { executable_path: installation.chromium, headed: false, user_data_dir: '' } }));
    const navigation = `new_tab(${JSON.stringify(origin)})\nwait_for_load()\n`;
    const code = (preloaded ? '' : navigation) + `upload_file('input[type=file]', ${JSON.stringify(file)})\nimport time\ntime.sleep(0.5)\n` + (expected && !preloaded ? 'js("document.querySelector(\'#download\').click()")\ntime.sleep(0.5)\n' : '');
    const requestPath = join(work, 'request.json'); writeFileSync(requestPath, JSON.stringify({ work, code, ...(preloaded ? { preload: navigation } : {}) }));
    const env = { PATH: process.env.PATH, HOME: join(work, 'home'), HERMES_HOME: join(work, 'hermes'), TMPDIR: join(work, 'tmp'), BH_AGENT_WORKSPACE: join(work, 'workspace') };
    const child = spawn(installation.hermesPython, ['-I', join(root, 'qualification/hermes-browser-fixture.py'), requestPath], { env, detached: true, stdio: 'ignore' });
    let exited = false; const completion = new Promise(resolve => child.once('exit', code => { exited = true; resolve(code); }));
    const waitFor = async name => { const deadline = Date.now() + 90_000; while (!existsSync(join(work, name))) { assert.equal(exited, false, `native fixture exited before ${name}`); assert.ok(Date.now() < deadline, `native fixture timed out: ${name}`); await new Promise(resolve => setTimeout(resolve, 50)); } };
    let browser;
    try {
      await waitFor('prepared.json');
      browser = await chromium.connectOverCDP(JSON.parse(readFileSync(join(work, 'prepared.json'))).cdp_url);
      const context = browser.contexts()[0];
      const uploaded = await uploadEvidence(context, attachment, origin);
      const downloads = downloadEvidence(context, join(work, 'downloads'), [], 1024);
      writeFileSync(join(work, 'downloads/shell-written.bin'), Buffer.alloc(1024, 42));
      assert.equal(downloads.read().saved_file, false);
      writeFileSync(join(work, 'go'), '');
      await waitFor('reply.json');
      const reply = JSON.parse(readFileSync(join(work, 'reply.json')));
      const result = typeof reply.result === 'string' ? JSON.parse(reply.result) : reply.result;
      assert.equal(result.success, true, 'native browser_exec must complete');
      await downloads.settle();
      assert.equal(uploaded().uploaded, expected, JSON.stringify({ name, sessions: reply.native_sessions, upload: uploaded(), posts }));
      assert.equal(posts.length, shouldSubmit ? 1 : 0);
      if (expected) {
        assert.equal(posts[0].expected_name && posts[0].expected_content, true);
        if (!preloaded) {
          assert.equal(downloads.read().saved_file, true, 'actual native browser download must have a completed artifact');
          cases.push({ name: 'native browser download and rejection of shell-only file', pass: true, observed: downloads.read() });
        }
      }
      cases.push({ name, pass: true, expected_upload: expected, observed: uploaded(), server_posts: posts });
      writeFileSync(join(work, 'done'), ''); assert.equal(await completion, 0);
    } finally { stopProcessGroup(child.pid, { graceMs: 1000 }); stopProcessesNaming(work); await browser?.close().catch(() => {}); rmSync(work, { recursive: true, force: true }); }
  }
} finally { await new Promise(resolve => site.close(resolve)); }
const receipt = { date: new Date().toISOString(), hermes: installation.hermes, hermes_source_sha256: installation.hermesSourceSha256,
  browser_harness: installation.hermesBrowserHarness, python: installation.hermesPythonVersion, model_calls: 0, cases };
if (process.argv[2]) writeFileSync(process.argv[2], JSON.stringify(receipt, null, 2) + '\n');
console.log(JSON.stringify({ cases: cases.length, passed: cases.filter(row => row.pass).length, model_calls: 0 }));
