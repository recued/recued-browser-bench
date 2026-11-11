import { sanitize } from '../../scripts/privacy.mjs';

export function nativeActions(tools, paths = []) {
  // Redact complete paths before bounding a result. Cutting first can leave a
  // private directory prefix that no longer matches the full owned path.
  return sanitize(tools, { paths }).map(tool => ({ tool: tool.name ?? tool.toolName, phase: tool.phase,
    ...(tool.args ? { args: tool.args } : {}), ...(tool.isError ? { error: true } : {}),
    ...(tool.result ? { result: JSON.stringify(tool.result).slice(0, 1200) } : {}) }));
}

export function nativeMeasurements(native, events, maxSeconds) {
  const meta = native?.meta ?? {}, agent = meta.agentMeta ?? {};
  const runId = agent.terminalReceipt?.runId ?? events.find(row => row.source === 'agent' && row.event.stream === 'lifecycle' && row.event.data?.phase === 'start')?.event.runId;
  const own = events.filter(row => row.source === 'agent' && row.event.runId === runId);
  const starts = own.map(row => row.event.data?.startedAt).filter(Number.isFinite);
  const started = starts.length ? Math.min(...starts) : null;
  const answer = (native?.payloads ?? []).filter(payload => typeof payload.text === 'string').map(payload => payload.text).join('\n\n');
  const lastAnswer = own.filter(row => row.event.stream === 'assistant' && typeof row.event.data?.text === 'string' && row.event.data.text.trim()).at(-1);
  const terminal = own.filter(row => row.event.stream === 'lifecycle' && ['end', 'error'].includes(row.event.data?.phase)).at(-1);
  const terminalError = terminal?.event.data?.phase === 'error' ? terminal.event.data : null;
  const nativeError = native?.error ?? meta.error;
  const ended = terminalError ? terminal.event.ts : lastAnswer?.event.ts ?? terminal?.event.ts;
  const seconds = started !== null && Number.isFinite(ended) && ended >= started ? (ended - started) / 1000 : Number.isFinite(meta.durationMs) ? meta.durationMs / 1000 : null;
  const calls = new Map();
  for (const row of events.filter(row => row.source === 'diagnostic' && row.event.type?.startsWith('model.call.'))) {
    const event = row.event;
    if (!event.callId) continue;
    const entry = calls.get(event.callId) ?? { call_id: event.callId };
    if (event.type === 'model.call.started') entry.started = event;
    else entry.terminal = event;
    calls.set(event.callId, entry);
  }
  const ledger = [...calls.values()];
  const complete = ledger.length > 0 && ledger.every(call => call.started && call.terminal?.type === 'model.call.completed' && call.terminal.usage?.usageReport?.state !== 'unavailable');
  const prompt = usage => usage?.promptTokens ?? usage?.contextUsage?.promptTokens ?? (Number.isFinite(usage?.input) && Number.isFinite(usage?.cacheRead) && Number.isFinite(usage?.cacheWrite) ? usage.input + usage.cacheRead + usage.cacheWrite : null);
  const sum = read => complete && ledger.every(call => Number.isFinite(read(call.terminal.usage))) ? ledger.reduce((total, call) => total + read(call.terminal.usage), 0) : null;
  const tokens = { input: sum(prompt), output: sum(usage => usage?.output), cached: sum(usage => usage?.cacheTelemetry?.state === 'unavailable' ? null : usage?.cacheRead) };
  const failedCall = ledger.some(call => call.terminal?.type === 'model.call.error');
  const timedOut = meta.aborted === true || terminal?.event.data?.aborted === true || Boolean(terminalError?.timeoutPhase) || seconds !== null && seconds > maxSeconds;
  let error = terminalError?.error ?? (nativeError ? typeof nativeError === 'string' ? nativeError : nativeError.message ?? 'OpenClaw run failed' : native?.ok === false ? 'OpenClaw run failed' : failedCall ? 'OpenClaw model call failed' : null);
  if (!answer.trim()) error ??= 'native agent returned no requested output';
  return {
    answer, seconds, rounds: ledger.length || null, tokens, timed_out: timedOut, error,
    clock: { source: terminalError ? 'native-lifecycle-error' : lastAnswer ? 'native-assistant-event' : terminal ? 'native-lifecycle-end' : 'native-duration', started_at: started, ended_at: ended ?? null },
    ledger, accounting_complete: complete,
    native_summary: { assistant_turns: agent.assistantTurns ?? null, usage: agent.usage ?? null, duration_ms: meta.durationMs ?? null, harness: agent.agentHarnessId ?? null, request_shaping: meta.requestShaping ?? null, aborted: meta.aborted ?? false },
  };
}
