export function answerTiming(streamed, started, maxSeconds) {
  const seconds = streamed ? (streamed.received_at - started) / 1000 : null;
  return { seconds, timed_out: seconds === null || seconds > maxSeconds };
}
