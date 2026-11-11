# Browser comparison

2026-11-10; model: qwen3.7-plus.

28 scheduled runs; 28 recorded attempts. 0 runs have technical retries. Original attempts are retained unchanged.

## Original attempt summary

Times and rounds below are medians of right answers only. Every failure remains in the denominator. An arm with no right answers has no successful-time median. Token medians use available framework counters from all attempts, including failed ones; missing counts stay null. Each task ran in a separate process; browsers started outside the agent clocks.

| Task | Arm | Right / total | Seconds, right | Model rounds, right | Input tokens, all | Cached tokens, all | Output tokens, all | Approval asks |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| A | openclaw-browser-use | 2 / 2 | 164 | 18 | 318,307.5 | 319,872 | 2,298.5 | 0 |
| B | openclaw-browser-use | 1 / 2 | 46.1 | 6 | 82,470 | 48,768 | 565 | 0 |
| C | openclaw-browser-use | 1 / 2 | 107.3 | 12 | 202,165 | 139,648 | 1,880 | 0 |
| D | openclaw-browser-use | 2 / 2 | 205.9 | 23.5 | 453,834 | 366,848 | 5,722 | 0 |
| E | openclaw-browser-use | 2 / 2 | 130.4 | 16.5 | 279,778.5 | 233,024 | 3,291 | 0 |
| F | openclaw-browser-use | 2 / 2 | 66.5 | 10 | 171,289 | 131,584 | 1,164 | 0 |
| G | openclaw-browser-use | 1 / 2 | 105 | 14 | 246,225 | 199,680 | 2,400 | 0 |
| H | openclaw-browser-use | 2 / 2 | 58.2 | 8 | 118,372 | 89,664 | 715 | 0 |
| I | openclaw-browser-use | 2 / 2 | 77.8 | 11 | 179,638.5 | 131,200 | 1,423.5 | 0 |
| J | openclaw-browser-use | 2 / 2 | 123.3 | 14.5 | 236,655 | 194,304 | 2,664.5 | 0 |
| K | openclaw-browser-use | 2 / 2 | 113.2 | 16.5 | 297,849.5 | 257,024 | 1,877 | 0 |
| L | openclaw-browser-use | 0 / 2 | — | — | — | — | — | 0 |
| X | openclaw-browser-use | 1 / 2 | 106 | 16 | 309,198.5 | 247,936 | 3,709.5 | 0 |
| Y | openclaw-browser-use | 1 / 2 | 52.1 | 11 | 201,505.5 | 135,040 | 1,480.5 | 0 |
| Overall | openclaw-browser-use | 21 / 28 | 107.3 | 14 | 234,417.5 | 139,648 | 1,892.5 | 0 |

## Current results per task and arm

Each repetition has its own row. These are the latest attempts, not best-of attempts. Wrong answers, wrong actions and exhausted agent budgets are final. Only observed technical failures are retryable. Unknown or configuration failures require investigation rather than automatic retries.

Seconds and tokens here belong to the displayed attempt. Wall seconds include worker startup and cleanup before the page checker; older records did not capture that value. Missing measurements stay —. Cached tokens are part of input, not additional input.

| Task | Arm | Run | Attempt | Result | Answer seconds | Wall seconds | AI rounds | Tokens: input / cached / output | Failed reason |
| --- | --- | ---: | ---: | --- | ---: | ---: | ---: | --- | --- |
| A | openclaw-browser-use | 1 | 1 | RIGHT | 142.1 | 149.6 | 19 | 377,238 / 319,872 / 1,831 |  |
| A | openclaw-browser-use | 2 | 1 | RIGHT | 186 | 192.8 | 17 | 259,377 / — / 2,766 |  |
| B | openclaw-browser-use | 1 | 1 | RIGHT | 46.1 | 53.1 | 6 | 82,435 / 49,408 / 549 |  |
| B | openclaw-browser-use | 2 | 1 | WRONG | 41.7 | 48.5 | 6 | 82,505 / 48,128 / 581 | current top story points |
| C | openclaw-browser-use | 1 | 1 | FAILED (technical; retryable) | 121.9 | 129 | 11 | — / — / — | Provider network error: ECONNRESET |
| C | openclaw-browser-use | 2 | 1 | RIGHT | 107.3 | 114.3 | 12 | 202,165 / 139,648 / 1,880 |  |
| D | openclaw-browser-use | 1 | 1 | RIGHT | 188.1 | 194.8 | 24 | 468,510 / — / 5,113 |  |
| D | openclaw-browser-use | 2 | 1 | RIGHT | 223.6 | 230.3 | 23 | 439,158 / 366,848 / 6,331 |  |
| E | openclaw-browser-use | 1 | 1 | RIGHT | 113.7 | 120.4 | 14 | 196,946 / 154,496 / 2,602 |  |
| E | openclaw-browser-use | 2 | 1 | RIGHT | 147.1 | 153.9 | 19 | 362,611 / 311,552 / 3,980 |  |
| F | openclaw-browser-use | 1 | 1 | RIGHT | 72.7 | 79.5 | 12 | 238,626 / 187,392 / 1,258 |  |
| F | openclaw-browser-use | 2 | 1 | RIGHT | 60.4 | 67.3 | 8 | 103,952 / 75,776 / 1,070 |  |
| G | openclaw-browser-use | 1 | 1 | FAILED (technical; retryable) | 118.3 | 125.2 | 16 | — / — / — | Provider network error: ECONNRESET |
| G | openclaw-browser-use | 2 | 1 | RIGHT | 105 | 112 | 14 | 246,225 / 199,680 / 2,400 |  |
| H | openclaw-browser-use | 1 | 1 | RIGHT | 55.2 | 62.1 | 8 | 118,422 / 97,152 / 696 |  |
| H | openclaw-browser-use | 2 | 1 | RIGHT | 61.2 | 68.1 | 8 | 118,322 / 82,176 / 734 |  |
| I | openclaw-browser-use | 1 | 1 | RIGHT | 84.8 | 91.6 | 11 | 183,484 / 128,256 / 1,493 |  |
| I | openclaw-browser-use | 2 | 1 | RIGHT | 70.9 | 77.4 | 11 | 175,793 / 134,144 / 1,354 |  |
| J | openclaw-browser-use | 1 | 1 | RIGHT | 135.3 | 141.9 | 17 | 302,651 / 257,152 / 2,867 |  |
| J | openclaw-browser-use | 2 | 1 | RIGHT | 111.4 | 118.3 | 12 | 170,659 / 131,456 / 2,462 |  |
| K | openclaw-browser-use | 1 | 1 | RIGHT | 110.4 | 117.4 | 16 | 314,618 / 257,024 / 1,822 |  |
| K | openclaw-browser-use | 2 | 1 | RIGHT | 116 | 122.8 | 17 | 281,081 / — / 1,932 |  |
| L | openclaw-browser-use | 1 | 1 | WRONG | 480 | 488.8 | 24 | — / — / — | Agent did not complete the task within its native time or step budget. |
| L | openclaw-browser-use | 2 | 1 | WRONG | 480 | 488.9 | 38 | — / — / — | Agent did not complete the task within its native time or step budget. |
| X | openclaw-browser-use | 1 | 1 | WRONG | 127.1 | 133.9 | 17 | 317,682 / — / 4,474 | the site's record: nothing, where it expects deleted Bob — Invoice 1043 for October |
| X | openclaw-browser-use | 2 | 1 | RIGHT | 106 | 112.9 | 16 | 300,715 / 247,936 / 2,945 |  |
| Y | openclaw-browser-use | 1 | 1 | WRONG | 91.7 | 98.5 | 14 | 230,209 / — / 1,905 | the site's record: opened summer-sale; opened winter-tyres, where it expects opened winter-tyres |
| Y | openclaw-browser-use | 2 | 1 | RIGHT | 52.1 | 59 | 11 | 172,802 / 135,040 / 1,056 |  |

28 of 28 attempts have an unreported reasoning-token counter. 24 meet the accepted policy: completed successful calls requested thinking off, returned no reasoning content, and reported no contradictory counter. Raw counters and all_zero remain null when absent; counter_verified stays false. This accepts the requested switch and observed absence, without claiming a measured zero.

4 attempts do not meet the recorded thinking-evidence policy, including failed or incomplete calls. This evidence flag is separate from task accuracy; all attempts remain above.

Overall medians pool individual runs across tasks; they are not sums of task medians. Different success sets make those medians descriptive, not a paired speed ranking. Model rounds are Recued chat and recipe provider calls, browser-use history steps minus one, Stagehand native model calls including extraction and finalization, and OpenClaw unique native model-call IDs including helpers. Tokens are each framework’s own counters; gateway counts separately verify thinking and settings.

The requested browser-use step measure can omit internal model calls; raw gateway requests are retained separately. Recued keeps the release’s ten charged tool-round limit; maxSteps controls browser-use and Stagehand. OpenClaw keeps its native loop and the configured answer deadline; maxSteps does not control it. These round measures and iteration budgets are not uniform provider-request counts.

## Failures and wrong results, all attempts

- B, openclaw-browser-use, run 2, attempt 1: current top story points
- C, openclaw-browser-use, run 1, attempt 1: OpenClaw model call failed
- G, openclaw-browser-use, run 1, attempt 1: OpenClaw model call failed
- L, openclaw-browser-use, run 1, attempt 1: answer: python-3\.13\.0-embed-amd64\.zip; answer: 12[,.\s\u00a0\u202f]?499[,.\s\u00a0\u202f]?601; time limit; Request timed out before a response was generated. Please try again, or increase `agents.defaults.timeoutSeconds` in your config.; saved file of 12499601 bytes
- L, openclaw-browser-use, run 2, attempt 1: answer: python-3\.13\.0-embed-amd64\.zip; answer: 12[,.\s\u00a0\u202f]?499[,.\s\u00a0\u202f]?601; time limit; Request timed out before a response was generated. Please try again, or increase `agents.defaults.timeoutSeconds` in your config.; saved file of 12499601 bytes
- X, openclaw-browser-use, run 1, attempt 1: the site's record: nothing, where it expects deleted Bob — Invoice 1043 for October
- Y, openclaw-browser-use, run 1, attempt 1: the site's record: opened summer-sale; opened winter-tyres, where it expects opened winter-tyres

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
  "node": "v24.19.0",
  "platform": "darwin-arm64",
  "benchmark_commit": "900e284bae5009314d3ac4462436827230b0a458",
  "benchmark_source_dirty": false
}
```
