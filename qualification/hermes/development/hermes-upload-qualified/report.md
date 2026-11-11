# Browser comparison

2026-11-10; model: qwen3.7-plus.

1 scheduled runs; 1 recorded attempts. 0 runs have technical retries. Original attempts are retained unchanged.

## Original attempt summary

Times and rounds below are medians of right answers only. Every failure remains in the denominator. An arm with no right answers has no successful-time median. Token medians use available framework counters from all attempts, including failed ones; missing counts stay null. Each task ran in a separate process; browsers started outside the agent clocks.

| Task | Arm | Right / total | Seconds, right | Model rounds, right | Input tokens, all | Cached tokens, all | Output tokens, all | Approval asks |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| J | hermes | 0 / 1 | — | — | 892,007 | — | 6,558 | 0 |
| Overall | hermes | 0 / 1 | — | — | 892,007 | — | 6,558 | 0 |

## Current results per task and arm

Each repetition has its own row. These are the latest attempts, not best-of attempts. Wrong answers, wrong actions and exhausted agent budgets are final. Only observed technical failures are retryable. Unknown or configuration failures require investigation rather than automatic retries.

Seconds and tokens here belong to the displayed attempt. Wall seconds include worker startup and cleanup before the page checker; older records did not capture that value. Missing measurements stay —. Cached tokens are part of input, not additional input.

| Task | Arm | Run | Attempt | Result | Answer seconds | Wall seconds | AI rounds | Tokens: input / cached / output | Failed reason |
| --- | --- | ---: | ---: | --- | ---: | ---: | ---: | --- | --- |
| J | hermes | 1 | 1 | WRONG | 377.8 | 383.2 | 46 | 892,007 / — / 6,558 | actual upload action |

1 of 1 attempts have an unreported reasoning-token counter. 1 meet the accepted policy: completed successful calls requested thinking off, returned no reasoning content, and reported no contradictory counter. Raw counters and all_zero remain null when absent; counter_verified stays false. This accepts the requested switch and observed absence, without claiming a measured zero.

Overall medians pool individual runs across tasks; they are not sums of task medians. Different success sets make those medians descriptive, not a paired speed ranking. Model rounds are Recued chat and recipe provider calls, browser-use history steps minus one, Stagehand native model calls including extraction and finalization, and OpenClaw unique native model-call IDs including helpers. Tokens are each framework’s own counters; gateway counts separately verify thinking and settings.

The requested browser-use step measure can omit internal model calls; raw gateway requests are retained separately. Recued keeps the release’s ten charged tool-round limit; maxSteps controls browser-use and Stagehand. OpenClaw keeps its native loop and the configured answer deadline; maxSteps does not control it. These round measures and iteration budgets are not uniform provider-request counts.

## Failures and wrong results, all attempts

- J, hermes, run 1, attempt 1: actual upload action

## Versions

```json
{
  "recued": "26.11.9",
  "bridge": "0.0.8",
  "browserUse": "0.13.14",
  "playwrightMcp": "0.0.85",
  "stagehand": "3.7.3",
  "playwright": "1.61.1",
  "openclaw": "2026.11.2",
  "triple": "macos-arm64",
  "browserHarness": "0.1.13",
  "hermes": "0.23.1",
  "hermesSourceSha256": "52a8eb321f368576034f40595491abf9646b60c3861eee0cf45f610e5faa9bb6",
  "hermesPythonVersion": "3.14.6",
  "hermesBrowserHarness": "0.1.13",
  "node": "v24.19.0",
  "platform": "darwin-arm64",
  "benchmark_commit": "41042e283c6b0aba0a97f5edce63cb5f8e52453f",
  "benchmark_source_dirty": true
}
```
