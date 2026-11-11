# Browser comparison

2026-11-10; model: qwen3.7-plus.

28 scheduled runs; 28 recorded attempts. 0 runs have technical retries. Original attempts are retained unchanged.

## Original attempt summary

Times and rounds below are medians of right answers only. Every failure remains in the denominator. An arm with no right answers has no successful-time median. Token medians use available framework counters from all attempts, including failed ones; missing counts stay null. Each task ran in a separate process; browsers started outside the agent clocks.

| Task | Arm | Right / total | Seconds, right | Model rounds, right | Input tokens, all | Cached tokens, all | Output tokens, all | Approval asks |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| A | hermes | 2 / 2 | 96.6 | 10 | 129,191.5 | — | 2,606 | 0 |
| B | hermes | 1 / 2 | 18.3 | 3 | 31,942.5 | — | 312 | 0 |
| C | hermes | 1 / 2 | 76.9 | 8 | 87,934 | — | 1,161.5 | 0 |
| D | hermes | 2 / 2 | 108.5 | 14.5 | 195,695 | — | 3,438.5 | 0 |
| E | hermes | 2 / 2 | 107.4 | 13 | 169,816 | — | 2,214.5 | 0 |
| F | hermes | 2 / 2 | 165.8 | 17 | 254,496 | — | 2,116 | 0 |
| G | hermes | 2 / 2 | 44.3 | 4.5 | 51,827 | — | 1,141 | 0 |
| H | hermes | 2 / 2 | 37.2 | 3 | 33,135.5 | — | 530.5 | 0 |
| I | hermes | 1 / 2 | 64.4 | 9 | 91,337.5 | — | 1,333.5 | 0 |
| J | hermes | 2 / 2 | 195 | 29 | 480,887.5 | — | 2,143.5 | 0 |
| K | hermes | 2 / 2 | 113.7 | 20 | 274,471 | — | 1,970.5 | 0 |
| L | hermes | 2 / 2 | 89.2 | 14.5 | 174,590.5 | — | 1,397.5 | 0 |
| X | hermes | 1 / 2 | 34.7 | 7 | 161,014.5 | — | 1,303 | 0 |
| Y | hermes | 2 / 2 | 137.5 | 24 | 342,958.5 | — | 1,864 | 0 |
| Overall | hermes | 24 / 28 | 91.1 | 11.5 | 134,026.5 | — | 1,497 | 0 |

## Current results per task and arm

Each repetition has its own row. These are the latest attempts, not best-of attempts. Wrong answers, wrong actions and exhausted agent budgets are final. Only observed technical failures are retryable. Unknown or configuration failures require investigation rather than automatic retries.

Seconds and tokens here belong to the displayed attempt. Wall seconds include worker startup and cleanup before the page checker; older records did not capture that value. Missing measurements stay —. Cached tokens are part of input, not additional input.

| Task | Arm | Run | Attempt | Result | Answer seconds | Wall seconds | AI rounds | Tokens: input / cached / output | Failed reason |
| --- | --- | ---: | ---: | --- | ---: | ---: | ---: | --- | --- |
| A | hermes | 1 | 1 | RIGHT | 88.8 | 92.9 | 7 | 90,372 / — / 2,371 |  |
| A | hermes | 2 | 1 | RIGHT | 104.3 | 109 | 13 | 168,011 / — / 2,841 |  |
| B | hermes | 1 | 1 | RIGHT | 18.3 | 22.7 | 3 | 31,794 / — / 240 |  |
| B | hermes | 2 | 1 | WRONG | 20.5 | 24.7 | 3 | 32,091 / — / 384 | current top story points |
| C | hermes | 1 | 1 | WRONG | 69.1 | 73.1 | 6 | 75,220 / — / 1,286 | caption: Daguerreotype |
| C | hermes | 2 | 1 | RIGHT | 76.9 | 81 | 8 | 100,648 / — / 1,037 |  |
| D | hermes | 1 | 1 | RIGHT | 139.8 | 144.1 | 18 | 249,323 / — / 4,717 |  |
| D | hermes | 2 | 1 | RIGHT | 77.3 | 80.9 | 11 | 142,067 / — / 2,160 |  |
| E | hermes | 1 | 1 | RIGHT | 108 | 112.5 | 12 | 156,859 / — / 2,673 |  |
| E | hermes | 2 | 1 | RIGHT | 106.8 | 111.4 | 14 | 182,773 / — / 1,756 |  |
| F | hermes | 1 | 1 | RIGHT | 205.9 | 216.6 | 24 | 382,224 / — / 2,645 |  |
| F | hermes | 2 | 1 | RIGHT | 125.6 | 133.5 | 10 | 126,768 / — / 1,587 |  |
| G | hermes | 1 | 1 | RIGHT | 35.2 | 39.8 | 3 | 33,689 / — / 891 |  |
| G | hermes | 2 | 1 | RIGHT | 53.4 | 57.9 | 6 | 69,965 / — / 1,391 |  |
| H | hermes | 1 | 1 | RIGHT | 34.7 | 38.9 | 3 | 32,086 / — / 420 |  |
| H | hermes | 2 | 1 | RIGHT | 39.6 | 44.9 | 3 | 34,185 / — / 641 |  |
| I | hermes | 1 | 1 | WRONG | 47.6 | 52 | 7 | 78,597 / — / 1,023 | answer: Little Dribbling |
| I | hermes | 2 | 1 | RIGHT | 64.4 | 68.1 | 9 | 104,078 / — / 1,644 |  |
| J | hermes | 1 | 1 | RIGHT | 91.9 | 96.2 | 10 | 121,828 / — / 1,042 |  |
| J | hermes | 2 | 1 | RIGHT | 298.2 | 302.6 | 48 | 839,947 / — / 3,245 |  |
| K | hermes | 1 | 1 | RIGHT | 135.8 | 140.5 | 22 | 316,209 / — / 2,342 |  |
| K | hermes | 2 | 1 | RIGHT | 91.6 | 96.9 | 18 | 232,733 / — / 1,599 |  |
| L | hermes | 1 | 1 | RIGHT | 105.4 | 109.8 | 17 | 207,896 / — / 1,407 |  |
| L | hermes | 2 | 1 | RIGHT | 73 | 77.9 | 12 | 141,285 / — / 1,388 |  |
| X | hermes | 1 | 1 | RIGHT | 34.7 | 39.7 | 7 | 80,950 / — / 885 |  |
| X | hermes | 2 | 1 | WRONG | 89.4 | 93.9 | 19 | 241,079 / — / 1,721 | the site's record: deleted Jay — Your receipt from the cafe; deleted Bob — Invoice 1043 for October, where it expects deleted Bob — Invoice 1043 for October |
| Y | hermes | 1 | 1 | RIGHT | 90.7 | 95.2 | 13 | 154,396 / — / 936 |  |
| Y | hermes | 2 | 1 | RIGHT | 184.2 | 188.4 | 35 | 531,521 / — / 2,792 |  |

28 of 28 attempts have an unreported reasoning-token counter. 28 meet the accepted policy: completed successful calls requested thinking off, returned no reasoning content, and reported no contradictory counter. Raw counters and all_zero remain null when absent; counter_verified stays false. This accepts the requested switch and observed absence, without claiming a measured zero.

Overall medians pool individual runs across tasks; they are not sums of task medians. Different success sets make those medians descriptive, not a paired speed ranking. Model rounds are Recued chat and recipe provider calls, browser-use history steps minus one, Stagehand native model calls including extraction and finalization, and OpenClaw unique native model-call IDs including helpers. Tokens are each framework’s own counters; gateway counts separately verify thinking and settings.

The requested browser-use step measure can omit internal model calls; raw gateway requests are retained separately. Recued keeps the release’s ten charged tool-round limit; maxSteps controls browser-use and Stagehand. OpenClaw keeps its native loop and the configured answer deadline; maxSteps does not control it. These round measures and iteration budgets are not uniform provider-request counts.

## Failures and wrong results, all attempts

- B, hermes, run 2, attempt 1: current top story points
- C, hermes, run 1, attempt 1: caption: Daguerreotype
- I, hermes, run 1, attempt 1: answer: Little Dribbling
- X, hermes, run 2, attempt 1: the site's record: deleted Jay — Your receipt from the cafe; deleted Bob — Invoice 1043 for October, where it expects deleted Bob — Invoice 1043 for October

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
  "benchmark_commit": "bfb4f93770e84418513cb33cb5ea3690de596ccd",
  "benchmark_source_dirty": false
}
```
