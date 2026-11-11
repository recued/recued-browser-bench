import test from 'node:test';
import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import { EventEmitter } from 'node:events';
import { existsSync, mkdirSync, mkdtempSync, rmSync, symlinkSync, utimesSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { downloadEvidence, nativeDownloadFiles, cleanupNativeDownloads } from '../harness/openclaw/file-evidence.mjs';

const toolResult = (path, name) => ({ name: 'browser', phase: 'result', result: { details: { downloads: [{ path, suggestedFilename: name }] } } });
const contextWith = page => ({ pages: () => [page], on() {} });
const download = name => ({ suggestedFilename: () => name, saveAs: async () => { throw new Error('The native browser saved the artifact through another CDP client.'); }, cancel: async () => {} });

test('a native browser download saved outside the watched directory is verified and only its owned artifact is cleaned up', async () => {
  const root = mkdtempSync(join(tmpdir(), 'openclaw-download-test-'));
  try {
    const watched = join(root, 'watched'), native = join(root, 'native'); mkdirSync(watched); mkdirSync(native);
    const name = 'archive.zip', path = join(native, `${randomUUID()}-${name}`), unrelated = join(native, 'unrelated.txt');
    const clock = { started_at: Date.now() - 1000, ended_at: Date.now() + 1000 };
    writeFileSync(path, Buffer.alloc(1024, 42)); writeFileSync(unrelated, 'preserve');
    const page = new EventEmitter(), observer = downloadEvidence(contextWith(page), watched, [], 1024);
    page.emit('download', download(name)); await observer.settle();
    const collected = nativeDownloadFiles([toolResult(path, name)], clock);
    assert.equal(collected.files[0].size_bytes, 1024);
    assert.match(collected.files[0].sha256, /^[a-f0-9]{64}$/);
    assert.equal(observer.read().saved_file, false);
    assert.equal(observer.read(collected.files).saved_file, true);
    assert.equal(observer.read(collected.files).browser_downloads[0].native_saved, true);
    cleanupNativeDownloads(collected.artifacts);
    assert.equal(existsSync(path), false);
    assert.equal(existsSync(unrelated), true);
  } finally { rmSync(root, { recursive: true, force: true }); }
});

test('an incomplete browser event, shell claim, stale file or symlink cannot substitute for a completed browser download', async () => {
  const root = mkdtempSync(join(tmpdir(), 'openclaw-download-test-'));
  try {
    const watched = join(root, 'watched'); mkdirSync(watched);
    const name = 'archive.zip', path = join(root, `${randomUUID()}-${name}`);
    const clock = { started_at: Date.now() - 1000, ended_at: Date.now() + 1000 };
    writeFileSync(path, Buffer.alloc(1024));
    const collected = nativeDownloadFiles([toolResult(path, name)], clock);
    const page = new EventEmitter(), observer = downloadEvidence(contextWith(page), watched, [], 1024);
    assert.equal(observer.read(collected.files).saved_file, false, 'a saved file without a download event cannot win');
    page.emit('download', download(name)); await observer.settle();
    writeFileSync(join(watched, name), Buffer.alloc(1024));
    assert.equal(observer.read().saved_file, false, 'a matching manual file cannot complete a failed browser save');
    assert.equal(nativeDownloadFiles([{ ...toolResult(path, name), name: 'exec' }], clock).files.length, 0);
    const link = join(root, `${randomUUID()}-${name}`); symlinkSync(path, link);
    assert.equal(nativeDownloadFiles([toolResult(link, name)], clock).files.length, 0);
    utimesSync(path, new Date(0), new Date(0));
    assert.equal(nativeDownloadFiles([toolResult(path, name)], clock).files.length, 0);
    cleanupNativeDownloads(collected.artifacts);
    assert.equal(existsSync(path), true, 'an artifact changed after collection must be preserved');
  } finally { rmSync(root, { recursive: true, force: true }); }
});
