export function nativeMeasurements(native, events, maxSeconds) {
  const ledger = [];
  const calls = new Map();
  for (const event of events) {
    if (!['pre_api_request', 'post_api_request', 'api_request_error', 'pre_auxiliary_call', 'post_auxiliary_call'].includes(event.kind)) continue;
    if (!event.api_request_id) continue;
    const kind = event.kind.includes('auxiliary') ? 'auxiliary' : 'primary';
    // Successful primary hooks omit retry_count. Match the most recent start
    // for this request; retries are separate physical model calls.
    const key = `${kind}/${event.api_request_id}/${event.started_at ?? event.retry_count ?? 0}`;
    let call = calls.get(key);
    if (!call && !event.kind.startsWith('pre_')) call = [...ledger].reverse().find(call => call.kind === kind && call.call_id === event.api_request_id && !call.terminal);
    if (!call) { call = { kind, call_id: event.api_request_id, retry: event.retry_count ?? 0 }; ledger.push(call); calls.set(key, call); }
    if (event.kind.startsWith('pre_')) call.started = event;
    else call.terminal = event;
  }
  const complete = ledger.length > 0 && ledger.every(call => call.started && call.terminal && !call.terminal.error && call.terminal.usage && Number.isFinite(call.terminal.usage.prompt_tokens) && Number.isFinite(call.terminal.usage.output_tokens));
  const sum = key => complete ? ledger.reduce((n, call) => n + call.terminal.usage[key], 0) : null;
  const result = native?.result ?? {};
  const answer = typeof result.final_response === 'string' ? result.final_response : '';
  const start = events.find(event => event.kind === 'turn_start')?.started_at ?? native?.started_at;
  const lastDelta = events.filter(event => event.kind === 'assistant_delta' && event.characters > 0).at(-1);
  const error = result.error || (result.interrupted ? 'Hermes turn interrupted' : null)
    || (result.failed || result.completed === false || result.partial ? `agent did not finish: ${result.turn_exit_reason ?? 'native incomplete turn'}` : null)
    || (!answer.trim() ? 'native agent returned no requested output' : null);
  const finalCall = [...ledger].reverse().find(call => call.kind === 'primary')?.terminal;
  const finalDelta = !error && lastDelta && (!finalCall || lastDelta.observed_at >= finalCall.started_at) ? lastDelta : null;
  const finalResponseAt = !error && finalCall?.assistant_tool_call_count === 0 ? finalCall.ended_at : null;
  const end = finalDelta?.observed_at ?? finalResponseAt ?? native?.ended_at;
  const seconds = Number.isFinite(start) && Number.isFinite(end) && end >= start ? end - start : null;
  return { answer, seconds, rounds: ledger.length || null,
    tokens: { input: sum('prompt_tokens'), output: sum('output_tokens'), cached: null },
    timed_out: result.interrupted === true || seconds !== null && seconds > maxSeconds, error,
    ledger, accounting_complete: complete,
    clock: { source: finalDelta || finalResponseAt ? 'native-assistant-event' : 'native-turn-result', started_at: Number.isFinite(start) ? start * 1000 : null, ended_at: Number.isFinite(end) ? end * 1000 : null },
    native_summary: { counters: native?.counters ?? {}, completed: result.completed ?? null, aborted: result.interrupted ?? false,
      turn_exit_reason: result.turn_exit_reason ?? null, failed: result.failed ?? null, partial: result.partial ?? null,
      api_calls: result.api_calls ?? null, cache_availability: 'native canonical usage does not distinguish missing cache detail from zero' },
  };
}
