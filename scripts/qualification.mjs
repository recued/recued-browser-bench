export const REASONING_POLICY = 'requested-off-and-no-reasoning-content-v1';

export function reasoningProof(calls, thinking) {
  const known = calls.filter(call => typeof call.reasoning_tokens === 'number');
  const nonzero = known.some(call => call.reasoning_tokens > 0);
  const content = calls.some(call => call.reasoning_content_present === true);
  const allZero = nonzero ? false : calls.length > 0 && known.length === calls.length ? true : null;
  const switchMatched = calls.length > 0 && calls.every(call => thinking === 'default' || call.requested_enable_thinking === (thinking === 'on'));
  const complete = calls.length > 0 && calls.every(call => call.status >= 200 && call.status < 300 && Number.isFinite(call.seconds) && !call.error);
  const countersCompatible = calls.every(call => call.reasoning_tokens == null || call.reasoning_tokens === 0);
  const counterVerified = allZero === true && countersCompatible;
  const accepted = thinking !== 'off' || (complete && switchMatched && !content && countersCompatible);
  return {
    checked: known.length, calls: calls.length, all_zero: allZero,
    requested_switch_verified: switchMatched,
    reasoning_content_seen: content,
    status: thinking !== 'off' ? 'not-required' : nonzero || content ? 'failed' : allZero === true ? 'counter-verified' : 'counter-unreported',
    counter_verified: counterVerified,
    accepted,
    acceptance_basis: thinking !== 'off' ? 'not-required' : !accepted ? 'insufficient-or-contradictory-evidence' : counterVerified ? 'explicit-zero-counter' : 'requested-off-and-no-reasoning-content',
  };
}
