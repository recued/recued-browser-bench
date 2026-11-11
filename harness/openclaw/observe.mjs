// Passive observers for the exact published runtime; never replace its agent,
// tools, model, prompts or responses. The diagnostic module is version-pinned.
import { appendFileSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { pathToFileURL } from 'node:url';
const packageRoot = dirname(process.env.BENCH_OPENCLAW_CLI);
const version = JSON.parse(readFileSync(join(packageRoot, 'package.json'))).version;
if (version !== '2026.11.2') throw new Error('OpenClaw observer requires the pinned 2026.11.2 distribution.');
const write = value => appendFileSync(process.env.BENCH_OPENCLAW_EVENTS, JSON.stringify({ received_at: Date.now(), ...value }) + '\n');
const { onAgentEvent } = await import(pathToFileURL(join(packageRoot, 'dist/plugin-sdk/agent-harness-runtime.js')));
const diagnostics = await import(pathToFileURL(join(packageRoot, 'dist/diagnostic-events-C91J-XX8.mjs')));
diagnostics.b(true);
diagnostics.g((event) => {
  if (event.type?.startsWith('model.call.') || event.type === 'model.usage' || event.type === 'harness.run.completed' || event.type === 'harness.run.error') write({ source: 'diagnostic', event });
});
onAgentEvent(event => {
  if (['lifecycle', 'assistant', 'tool', 'error'].includes(event.stream)) write({ source: 'agent', event });
});
write({ source: 'observer', version });
