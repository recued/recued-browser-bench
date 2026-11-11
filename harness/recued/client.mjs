// Pairing, uploads and RPC framing adapted from browser-agent-bench's Recued
// harness and Recued v26.11.9's public dev/headless-client.ts (AGPL-3.0).
import WebSocket from 'ws';
import { generateMnemonic } from '@scure/bip39';
import { wordlist } from '@scure/bip39/wordlists/english';
import { randomUUID } from 'node:crypto';

export const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
export async function pairOwner(base, code) {
  const recoveryKey = generateMnemonic(wordlist, 256);
  const response = await fetch(`${base}/auth/pair`, {
    method: 'POST', headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ code, recoveryKey, clientKind: 'webclient', instanceId: `bench-${randomUUID()}`, displayName: 'Browser comparison' }),
  });
  const body = await response.json();
  const paired = body.data ?? body.body ?? body;
  if (!response.ok || !paired.token_id || !paired.bearer) throw new Error(`Fresh owner enrollment failed (HTTP ${response.status}, ${paired.error?.code ?? 'no token'}).`);
  return `${paired.token_id}.${paired.bearer}`;
}
export async function connect(base, bearer, onEvent = () => {}) {
  const socket = new WebSocket(`${base.replace(/^http/, 'ws')}/ws`, { headers: { authorization: `Bearer ${bearer}` } });
  const pending = new Map();
  let sequence = 0;
  await new Promise((resolve, reject) => {
    const timer = setTimeout(() => { socket.terminate(); reject(new Error('RPC connection timed out.')); }, 20_000);
    socket.once('open', () => { clearTimeout(timer); resolve(); });
    socket.once('error', error => { clearTimeout(timer); reject(error); });
  });
  socket.on('message', raw => {
    let message; try { message = JSON.parse(String(raw)); } catch { return; }
    if (message.type === 'server_event') { onEvent(message.event); return; }
    const p = pending.get(message.request_id);
    if (message.type !== 'rpc_result' || !p) return;
    clearTimeout(p.timer); pending.delete(message.request_id);
    if (message.error) p.reject(new Error(`${p.method}: ${message.error.code}: ${message.error.message}`));
    else p.resolve(message.result);
  });
  socket.on('close', () => { for (const p of pending.values()) { clearTimeout(p.timer); p.reject(new Error('RPC socket closed.')); } pending.clear(); });
  return {
    call(method, args = {}, timeout = 120_000) {
      return new Promise((resolve, reject) => {
        const id = `r${++sequence}`;
        const timer = setTimeout(() => { pending.delete(id); reject(new Error(`${method}: RPC timeout.`)); }, timeout);
        pending.set(id, { resolve, reject, timer, method });
        socket.send(JSON.stringify({ type: 'rpc', request_id: id, method, args }));
      });
    },
    close: () => socket.close(),
  };
}
export async function upload(client, base, bearer, file) {
  const bytes = Buffer.from(file.text);
  const created = await client.call('upload.create', { filename: file.filename, declared_size: bytes.length, mime_reported: file.mime_type });
  if (created.status !== 'created') throw new Error('Upload preparation failed.');
  const header = Buffer.from(JSON.stringify({ req_id: 'u1', upload_id: created.upload_id, offset: 0 }));
  const frame = Buffer.concat([Buffer.from([1, 1, 0, 0, 0, 0]), header, bytes]); frame.writeUInt32BE(header.length, 2);
  await new Promise((resolve, reject) => {
    const socket = new WebSocket(`${base.replace(/^http/, 'ws')}/ws/upload`, { headers: { authorization: `Bearer ${bearer}` } });
    const timer = setTimeout(() => { socket.terminate(); reject(new Error('Upload acknowledgement timed out.')); }, 20_000);
    socket.on('open', () => socket.send(frame));
    socket.on('message', raw => {
      clearTimeout(timer); socket.close();
      try { if (JSON.parse(String(raw)).ok) resolve(); else reject(new Error('Upload rejected.')); } catch { reject(new Error('Invalid upload acknowledgement.')); }
    });
    socket.on('error', error => { clearTimeout(timer); reject(error); });
  });
  const finalized = await client.call('upload.finalize', { upload_id: created.upload_id });
  if (finalized.status !== 'finalized') throw new Error('Upload finalization failed.');
  return finalized.record_id;
}
