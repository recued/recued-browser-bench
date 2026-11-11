import { join } from 'node:path';

export const OPENCLAW_VERSION = '2026.11.2';
export const modelContextWindow = config => config.openclawContextWindow ?? (config.model.startsWith('qwen3.7-plus') ? 1_000_000 : 262144);
export function openclawConfig({ config, work, gateway, cdpPort, gatewayPort, browserUse = false }) {
  const model = `bench/${config.model}`;
  return {
    env: { shellEnv: { enabled: false } },
    update: { checkOnStart: false },
    diagnostics: { enabled: true },
    skills: { workshop: { autonomous: { mode: 'off' } } },
    agents: {
      defaults: {
        workspace: join(work, 'workspace'), skipBootstrap: true, thinkingDefault: config.thinking === 'on' ? 'medium' : 'off',
        timeoutSeconds: config.maxSeconds, maxConcurrent: 1,
        model: { primary: model, fallbacks: [] },
        models: { [model]: { params: { temperature: config.temperature, maxTokens: config.maxOutputTokens } } },
      },
      entries: { bench: { workspace: join(work, 'workspace'), agentDir: join(work, 'state/agents/bench/agent') } },
    },
    models: {
      mode: 'replace',
      providers: {
        bench: {
          baseUrl: gateway.baseUrl, apiKey: gateway.credential, api: 'openai-completions',
          models: [{ id: config.model, name: config.model, reasoning: config.thinking === 'on', input: ['text'], contextWindow: modelContextWindow(config), maxTokens: config.maxOutputTokens }],
        },
      },
    },
    gateway: { mode: 'local', port: gatewayPort, auth: { mode: 'token', token: gateway.credential } },
    browser: {
      enabled: !browserUse, defaultProfile: 'bench', headless: true, attachOnly: true,
      profiles: { bench: { cdpUrl: `http://127.0.0.1:${cdpPort}` } },
      ssrfPolicy: { allowedHostnames: ['127.0.0.1', 'localhost'], allowRfc2544BenchmarkRange: true },
    },
    plugins: { entries: { browser: { enabled: !browserUse } }, slots: { memory: 'none' } },
    tools: {
      profile: 'full',
      deny: ['web_fetch', 'web_search', 'sessions_spawn', 'subagents', 'sessions_send', 'sessions_yield', 'group:messaging', 'cron', 'gateway', ...(browserUse ? ['browser'] : [])],
      exec: { security: 'full', ask: 'off', ...(browserUse ? { pathPrepend: [join(work, 'bin')] } : {}) },
    },
  };
}

export function workspaceInstructions(attached, browserUse = false, downloads) {
  return '# Browser task environment\n\n'
    + (browserUse ? 'Use the installed browser-use CLI and its browser-use skill for website navigation and interaction. Its CDP endpoint is already configured for this task.\n' : 'Use the built-in browser tool for website navigation and interaction.\n')
    + 'Standalone web fetch/search tools are disabled. Do not read web page HTML with shell or script HTTP clients.\n'
    + 'Local file operations are allowed for attachments and browser downloads. After locating a PDF or document through the browser, document tools or a local download plus text extraction may read it. A requested browser download must use the browser.\n'
    + 'Keep output files inside this workspace or the provided browser download directory.\n'
    + (downloads ? `Browser download directory: ${downloads}\n` : '')
    + (attached ? `\nThe user attachment is available at: ${attached}\n` : '');
}
