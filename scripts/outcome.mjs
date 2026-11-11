// Retry only observed technical failures. A failed check or exhausted agent
// budget is a result, not evidence that the infrastructure should be retried.
const networkError = /\b(?:ECONNRESET|ECONNREFUSED|ETIMEDOUT|EAI_AGAIN|ENETUNREACH|EPIPE|UND_ERR_(?:CONNECT_TIMEOUT|HEADERS_TIMEOUT|BODY_TIMEOUT|SOCKET))\b/;
export function outcome(record) {
  if (record.right) return { status: 'right', kind: null, retryable: false, reason: '' };
  const missing = record.missing ?? [];
  const result = (status, kind, retryable, reason) => ({ status, kind, retryable, reason });
  const wrong = reason => result('wrong', 'answer-or-capability', false, reason);
  const actionFailure = missing.find(reason => reason.startsWith("the site's record:"));
  if (actionFailure && record.live_events?.length) return result('wrong', 'wrong-action', false, actionFailure);
  // A recovered provider error must not turn a conclusive wrong method into
  // retries until it succeeds. A normal final reply, a complete shell-written
  // ZIP, and no verified browser save establish this independently of transport.
  const evidence = record.evidence;
  const shellDownload = record.task_id === 'L' && !record.timed_out && record.answer?.trim()
    && !missing.some(reason => reason.startsWith('answer:'))
    && evidence?.native_clock?.source === 'native-assistant-event' && evidence.native_summary?.aborted === false
    && evidence.saved_file === false
    && evidence.files?.some(file => file.name === 'python-3.13.0-embed-amd64.zip' && file.size_bytes === 12499601)
    && record.actions?.some(action => ['exec', 'terminal'].includes(action.tool) && action.phase === 'start'
      && /\b(?:curl|wget)\b/.test(action.args?.command ?? '') && action.args.command.includes('python-3.13.0-embed-amd64.zip'));
  if (shellDownload) return result('wrong', 'wrong-action', false, 'Completed the ZIP with a shell client while the required browser download remained incomplete.');
  const calls = record.model_calls ?? [];
  const permanent = calls.find(call => call.status >= 400 && call.status < 500 && ![408, 429].includes(call.status));
  if (permanent) return result('failed', 'configuration-or-request', false, `Provider HTTP ${permanent.status}; fix the request or configuration before running again.`);
  const completed = record.evidence?.native_completed === true || record.evidence?.turn_statuses?.includes('completed');
  const answerFailure = missing.find(reason => reason.startsWith('answer:') || /^(caption:|current top story|last See also)/.test(reason));
  if (completed && record.answer?.trim() && answerFailure) return wrong(answerFailure);
  const transient = calls.find(call => [408, 429, 500, 502, 503, 504].includes(call.status)
    || (networkError.test(call.error_code ?? '') && !['cancelled', 'invalid-request'].includes(call.failure_kind) && call.error !== 'cancelled')
    || (call.status === null && (call.failure_kind ? ['provider-transport', 'provider-timeout'].includes(call.failure_kind) : ['provider timeout', 'provider transport or response error'].includes(call.error))));
  if (transient) return result('failed', 'technical', true, transient.status >= 400 ? `Provider HTTP ${transient.status}` : transient.error_code ? `Provider network error: ${transient.error_code}` : transient.error ?? 'Provider transport failed');
  if (networkError.test(record.error ?? '')) return result('failed', 'technical', true, record.error);
  if ((record.oracle?.error || missing.includes('live page check unavailable')) && !answerFailure) return result('failed', 'technical', true, 'Live page checker unavailable');
  if (/unsupported (?:browser|tool)|(?:browser|tool|operation).*(?:not supported|unavailable)/i.test(record.error ?? '')) return wrong(record.error);
  if (record.timed_out || /agent did not finish|native agent returned no requested output/i.test(record.error ?? '')) return wrong('Agent did not complete the task within its native time or step budget.');
  if (record.error) return result('failed', 'unclassified', false, record.error);
  return wrong(missing.join('; ') || 'Task checks failed.');
}

export const runKey = record => JSON.stringify([record.task_id, record.arm, record.run]);

export function histories(records) {
  const groups = new Map();
  records.forEach((record, index) => {
    if (!record.task_id || !record.arm || !Number.isInteger(record.run) || record.run < 1) throw new Error('Invalid task/arm/run in source records.');
    const key = runKey(record);
    const history = groups.get(key) ?? [];
    if (history.length) {
      const previous = history.at(-1);
      if (record.retry_of !== previous.index || record.attempt !== history.length + 1 || !outcome(previous.record).retryable) throw new Error('Invalid retry lineage: only the latest technical failure may be retried.');
    } else if (record.retry_of != null || (record.attempt != null && record.attempt !== 1)) throw new Error('Retry has no original attempt.');
    history.push({ record, index }); groups.set(key, history);
  });
  return [...groups.values()];
}

export function retryPlan(records) {
  return histories(records).flatMap(history => {
    const { record, index } = history.at(-1);
    return outcome(record).retryable ? [{ task: record.task_id, arm: record.arm, run: record.run, attempt: history.length + 1, retry_of: index }] : [];
  });
}
