import { spawn, spawnSync } from 'node:child_process';
import { cpSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { createServer } from 'node:net';
import { randomBytes } from 'node:crypto';
import { pairOwner, connect, sleep } from './client.mjs';
import { stopProcessGroup } from './lib/process-group.mjs';
import { installBrowserToolkit } from './catalog.mjs';

export async function startRecued({ installation, work, gateway, config, arm, root }) {
  const port = await new Promise((resolve, reject) => {
    const listener = createServer(); listener.once('error', reject);
    listener.listen(0, '127.0.0.1', () => { const port = listener.address().port; listener.close(() => resolve(port)); });
  });
  const base = `http://127.0.0.1:${port}`;
  const db = join(work, 'realm.db');
  const configPath = join(work, 'config.toml'); writeFileSync(configPath, '');
  const environment = {
    ...process.env, RECUED_IDENTITY_PASSPHRASE: randomBytes(32).toString('hex'),
    RECUED_SELF_UPDATE: 'notify',
    RECUED_LLM_PROVIDER: 'openai-compatible', RECUED_LLM_MODEL: config.model,
    RECUED_LLM_API_KEY: gateway.credential, RECUED_LLM_BASE_URL: gateway.baseUrl.replace(/\/v1$/, ''),
    ...(config.thinking !== 'default' ? { RECUED_LLM_THINKING: config.thinking } : {}),
  };
  let log = '';
  const child = spawn(installation.binary, ['serve', '--db', db, '--config', configPath, '--port', String(port)], {
    cwd: root, env: environment, stdio: ['ignore', 'pipe', 'pipe'], detached: true,
  });
  child.stdout.on('data', data => { log = (log + String(data)).slice(-2_000_000); });
  child.stderr.on('data', data => { log = (log + String(data)).slice(-2_000_000); });
  let client; let context;
  const close = async () => {
    client?.close(); await context?.close().catch(() => {});
    stopProcessGroup(child.pid, { graceMs: 10_000 });
  };
  try {
    let code;
    for (let i = 0; i < 240; i++) {
      if (child.exitCode !== null || child.signalCode !== null) throw new Error(`Released server exited during startup: ${log.split('\n').filter(x => !/pair|recovery|token|bearer/i.test(x)).slice(-8).join('\n')}`);
      const matches = [...log.matchAll(/Pairing code:\s+([A-Z0-9]{6,12})\b/g)]; code = matches.at(-1)?.[1];
      if (code && await fetch(`${base}/health`).then(r => r.ok).catch(() => false)) break;
      await sleep(500);
    }
    if (!code) throw new Error('Fresh server did not become ready.');
    const bearer = await pairOwner(base, code);
    const events = [];
    client = await connect(base, bearer, event => events.push({ ...event, received_at: Date.now() }));
    await client.call('events.subscribe', { kinds: ['chat.transparency', 'chat.token_streamed'] });
    if (config.recuedCatalogMode) await client.call('server.setChatCatalogMode', { source_id: 'slot_1', mode: config.recuedCatalogMode });
    for (const slug of ['read-web-address', 'get-web-address', 'download-web-file']) for (const publisher of ['recued-core', 'kitchen']) {
      await client.call('contract.grant.write', { contract_id: 'user_self', entry_key: `recipe.${publisher}/${slug}`, granted: false });
    }
    let mcp; let toolkit;
    if (arm === 'recued-bridge') {
      toolkit = await installBrowserToolkit(client, root);
      const ext = join(work, 'extension'); cpSync(join(root, '.bench/bridge'), ext, { recursive: true });
      const manifestPath = join(ext, 'manifest.json');
      const manifest = JSON.parse(readFileSync(manifestPath));
      writeFileSync(manifestPath, JSON.stringify({ ...manifest, host_permissions: ['*://*/*'], optional_host_permissions: [] }));
      const { chromium } = await import('playwright');
      context = await chromium.launchPersistentContext(join(work, 'profile'), {
        executablePath: installation.chromium, headless: true, viewport: { width: 1280, height: 900 },
        args: [`--disable-extensions-except=${ext}`, `--load-extension=${ext}`, '--no-sandbox'],
      });
      const worker = context.serviceWorkers()[0] ?? await context.waitForEvent('serviceworker', { timeout: 30_000 });
      const panel = await context.newPage();
      await panel.goto(`chrome-extension://${new URL(worker.url()).host}/side-panel/index.html`);
      const minted = spawnSync(installation.binary, ['pair', 'generate', '--db', db], { cwd: root, env: environment, encoding: 'utf8', timeout: 30_000 });
      const bridgeCode = [...`${minted.stdout}${minted.stderr}`.matchAll(/Pairing code:\s+([A-Z0-9]{6,12})\b/g)].at(-1)?.[1];
      if (minted.status !== 0 || !bridgeCode) throw new Error('Could not mint a new code for the isolated Bridge.');
      await panel.fill('#bridge-pair-code-input-server-url', base);
      await panel.fill('#bridge-pair-code-input-code', bridgeCode);
      await panel.click('#bridge-pair-code-input-submit');
      await panel.waitForSelector('[data-recued-side-panel-section]', { timeout: 45_000 });
      let connected = false;
      for (let i = 0; i < 60; i++) {
        connected = (await client.call('pair.list')).devices?.some(d => d.kind === 'bridge' && d.revoked_at === null && d.connected);
        if (connected) break; await sleep(500);
      }
      if (!connected) throw new Error('Bridge did not connect.');
      for (const page of context.pages()) if (page !== panel) await page.close();
      await sleep(1500);
    } else {
      mkdirSync(join(work, 'downloads'), { recursive: true });
      // Recued creates an executor per tool run. Keep this run's browser alive
      // across those stdio clients using MCP's supported CDP connection. The
      // profile is fresh, has no extension, and is owned and closed by this run.
      const { chromium } = await import('playwright');
      const profile = join(work, 'profile');
      context = await chromium.launchPersistentContext(profile, {
        executablePath: installation.chromium, headless: true, viewport: { width: 1280, height: 900 },
        args: ['--remote-debugging-port=0', '--no-sandbox'],
      });
      const cdpPort = readFileSync(join(profile, 'DevToolsActivePort'), 'utf8').split('\n')[0];
      await client.call('collection.connection.enroll', {
        name: 'playwright', kind: 'mcp', subtype: 'stdio', display_name: 'Playwright MCP', auth: { type: 'none' },
        config: { transport: 'stdio', command: 'npx', args: ['--no-install', '@playwright/mcp@0.0.85', '--headless', '--cdp-endpoint', `http://127.0.0.1:${cdpPort}`, '--output-dir', join(work, 'downloads')],
          env: { PLAYWRIGHT_BROWSERS_PATH: installation.browsersPath } },
      });
      const probe = await client.call('collection.connection.probe', { name: 'playwright', kind: 'mcp' });
      const preview = await client.call('collection.connection.mcpPackPreview', { name: 'playwright', kind: 'mcp' });
      mcp = { probe: probe.health, preview };
      await client.call('collection.connection.mcpPackCommit', {
        name: 'playwright', kind: 'mcp', reviewed_ops: preview.rows.map(row => row.op), install_scope: { access: 'all' },
      });
      // The generated pack is inert by default. This is the owner grant from
      // Recued's published mcp-two-roads-drive, not a store edit or a bypass.
      for (const row of preview.rows) await client.call('contract.grant.write', {
        contract_id: 'user_self', entry_key: `recued-local.${preview.pack_slug}.${row.op}`, granted: true,
      });
      // Normal owner prompt configuration supplies the connector selector, not
      // task-specific instructions. The generated operation schema exposes it
      // as `connection`, but its hashed tool name does not name the account.
      const prompt = (await client.call('server.getLlmPrompts')).prompts.find(p => p.surface === 'chat');
      await client.call('server.setLlmPrompt', {
        surface: 'chat', role: prompt.role,
        role_instructions: `${prompt.role_instructions}\nYour browser tools use the enrolled Playwright MCP connection named playwright. Pass connection: playwright when calling those browser tools.`,
      });
    }
    return { client, bearer, base, events, mcp, toolkit, close, log: () => log, context };
  } catch (error) { await close(); throw error; }
}
