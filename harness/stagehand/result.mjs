// Stagehand's message is its final assessment of the work. Requested data is
// a separate native result field, populated by execute({ output: schema }).
export function agentAnswer(result) {
  const value = result?.output?.answer;
  return typeof value === 'string' && value.trim() ? value.trim() : null;
}
