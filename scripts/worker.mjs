import { readFileSync, writeFileSync } from 'node:fs';
const request = JSON.parse(readFileSync(process.argv[2]));
request.gateway.credential = process.env.BENCH_GATEWAY_KEY;
try {
  const { measure } = await import(request.arm.startsWith('recued-') ? '../harness/recued/measure.mjs' : request.arm.startsWith('openclaw-') ? '../harness/openclaw/measure.mjs' : request.arm === 'hermes' ? '../harness/hermes/measure.mjs' : '../harness/stagehand/measure.mjs');
  writeFileSync(process.argv[3], JSON.stringify(await measure(request)));
} catch (error) {
  writeFileSync(process.argv[3], JSON.stringify({ answer: '', seconds: null, rounds: null, tokens: null, timed_out: false, error: `${error.name}: ${error.message}` }));
}
// Each worker owns one task. The parent reaps the owned process group and any
// browser left after a framework's failed initialization before the next task.
process.exit(0);
