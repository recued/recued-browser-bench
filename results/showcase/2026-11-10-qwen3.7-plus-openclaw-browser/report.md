# Browser comparison

2026-11-10; model: qwen3.7-plus.

28 scheduled runs; 28 recorded attempts. 0 runs have technical retries. Original attempts are retained unchanged.

## Original attempt summary

Times and rounds below are medians of right answers only. Every failure remains in the denominator. An arm with no right answers has no successful-time median. Token medians use available framework counters from all attempts, including failed ones; missing counts stay null. Each task ran in a separate process; browsers started outside the agent clocks.

| Task | Arm | Right / total | Seconds, right | Model rounds, right | Input tokens, all | Cached tokens, all | Output tokens, all | Approval asks |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| A | openclaw-browser | 2 / 2 | 206.9 | 16 | 484,607.5 | — | 1,502 | 0 |
| B | openclaw-browser | 2 / 2 | 17.8 | 3 | 34,495 | 15,744 | 251.5 | 0 |
| C | openclaw-browser | 2 / 2 | 90.9 | 7.5 | 108,069.5 | — | 653.5 | 0 |
| D | openclaw-browser | 2 / 2 | 148.2 | 17 | 425,357 | — | 1,984 | 0 |
| E | openclaw-browser | 2 / 2 | 211.3 | 22.5 | 714,546 | — | 2,551.5 | 0 |
| F | openclaw-browser | 2 / 2 | 86.7 | 13.5 | 211,864.5 | — | 1,791.5 | 0 |
| G | openclaw-browser | 2 / 2 | 57.1 | 7 | 101,923 | — | 1,145.5 | 0 |
| H | openclaw-browser | 2 / 2 | 42.3 | 4 | 41,588.5 | — | 358 | 0 |
| I | openclaw-browser | 2 / 2 | 103.8 | 13 | 276,551 | — | 1,815 | 0 |
| J | openclaw-browser | 1 / 2 | 128.2 | 17 | 910,070.5 | — | 2,531.5 | 0 |
| K | openclaw-browser | 2 / 2 | 118.7 | 16.5 | 275,102.5 | — | 1,626 | 0 |
| L | openclaw-browser | 0 / 2 | — | — | 201,623 | — | 1,192 | 0 |
| X | openclaw-browser | 0 / 2 | — | — | 300,416.5 | — | 1,599.5 | 0 |
| Y | openclaw-browser | 2 / 2 | 48.4 | 8 | 100,622 | 66,176 | 559 | 0 |
| Overall | openclaw-browser | 23 / 28 | 104.9 | 12 | 246,292 | 21,760 | 1,458 | 0 |

## Current results per task and arm

Each repetition has its own row. These are the latest attempts, not best-of attempts. Wrong answers, wrong actions and exhausted agent budgets are final. Only observed technical failures are retryable. Unknown or configuration failures require investigation rather than automatic retries.

Seconds and tokens here belong to the displayed attempt. Wall seconds include worker startup and cleanup before the page checker; older records did not capture that value. Missing measurements stay —. Cached tokens are part of input, not additional input.

| Task | Arm | Run | Attempt | Result | Answer seconds | Wall seconds | AI rounds | Tokens: input / cached / output | Failed reason |
| --- | --- | ---: | ---: | --- | ---: | ---: | ---: | --- | --- |
| A | openclaw-browser | 1 | 1 | RIGHT | 162.9 | 170.1 | 16 | 505,983 / — / 1,458 |  |
| A | openclaw-browser | 2 | 1 | RIGHT | 250.9 | 258.7 | 16 | 463,232 / — / 1,546 |  |
| B | openclaw-browser | 1 | 1 | RIGHT | 16.7 | 24.6 | 3 | 34,479 / 9,728 / 246 |  |
| B | openclaw-browser | 2 | 1 | RIGHT | 18.8 | 26 | 3 | 34,511 / 21,760 / 257 |  |
| C | openclaw-browser | 1 | 1 | RIGHT | 76.9 | 83.9 | 8 | 115,833 / — / 641 |  |
| C | openclaw-browser | 2 | 1 | RIGHT | 104.9 | 112 | 7 | 100,306 / — / 666 |  |
| D | openclaw-browser | 1 | 1 | RIGHT | 184.7 | 191.7 | 20 | 529,531 / — / 2,207 |  |
| D | openclaw-browser | 2 | 1 | RIGHT | 111.7 | 118.7 | 14 | 321,183 / — / 1,761 |  |
| E | openclaw-browser | 1 | 1 | RIGHT | 207.3 | 214.3 | 23 | 688,256 / — / 2,331 |  |
| E | openclaw-browser | 2 | 1 | RIGHT | 215.2 | 222.3 | 22 | 740,836 / — / 2,772 |  |
| F | openclaw-browser | 1 | 1 | RIGHT | 60.7 | 68.7 | 8 | 110,817 / — / 1,270 |  |
| F | openclaw-browser | 2 | 1 | RIGHT | 112.8 | 119.9 | 19 | 312,912 / — / 2,313 |  |
| G | openclaw-browser | 1 | 1 | RIGHT | 57.2 | 64.3 | 7 | 101,818 / — / 1,104 |  |
| G | openclaw-browser | 2 | 1 | RIGHT | 57 | 64.4 | 7 | 102,028 / — / 1,187 |  |
| H | openclaw-browser | 1 | 1 | RIGHT | 56.3 | 63.9 | 5 | 52,602 / — / 422 |  |
| H | openclaw-browser | 2 | 1 | RIGHT | 28.3 | 35.5 | 3 | 30,575 / — / 294 |  |
| I | openclaw-browser | 1 | 1 | RIGHT | 91.7 | 98.9 | 12 | 246,292 / — / 1,608 |  |
| I | openclaw-browser | 2 | 1 | RIGHT | 115.9 | 123 | 14 | 306,810 / — / 2,022 |  |
| J | openclaw-browser | 1 | 1 | RIGHT | 128.2 | 135.3 | 17 | 290,281 / — / 1,849 |  |
| J | openclaw-browser | 2 | 1 | WRONG | 480 | 487.6 | 28 | 1,529,860 / — / 3,214 | Agent did not complete the task within its native time or step budget. |
| K | openclaw-browser | 1 | 1 | RIGHT | 117.5 | 125.2 | 17 | 289,780 / — / 1,633 |  |
| K | openclaw-browser | 2 | 1 | RIGHT | 119.8 | 127.5 | 16 | 260,425 / — / 1,619 |  |
| L | openclaw-browser | 1 | 1 | WRONG | 101 | 108.8 | 10 | 201,623 / — / 1,192 | saved file of 12499601 bytes |
| L | openclaw-browser | 2 | 1 | FAILED (technical; retryable) | 534.4 | 543.8 | 43 | — / — / — | Provider network error: UND_ERR_CONNECT_TIMEOUT |
| X | openclaw-browser | 1 | 1 | WRONG | 185.5 | 193.6 | 10 | 140,998 / — / 933 | the site's record: deleted Tia — School trip form; deleted Bob — Invoice 1043 for October, where it expects deleted Bob — Invoice 1043 for October |
| X | openclaw-browser | 2 | 1 | WRONG | 144.9 | 152.1 | 22 | 459,835 / — / 2,266 | the site's record: deleted Kim — Meeting moved to Thursday; deleted Ivy — Newsletter: autumn picks; deleted Ada — Lunch on Friday?; deleted Jay — Your receipt from the cafe; deleted Bob — Invoice 1043 for October, where it expects deleted Bob — Invoice 1043 for October |
| Y | openclaw-browser | 1 | 1 | RIGHT | 57.7 | 64.8 | 8 | 100,713 / 66,176 / 591 |  |
| Y | openclaw-browser | 2 | 1 | RIGHT | 39.2 | 46.3 | 8 | 100,531 / — / 527 |  |

28 of 28 attempts have an unreported reasoning-token counter. 27 meet the accepted policy: completed successful calls requested thinking off, returned no reasoning content, and reported no contradictory counter. Raw counters and all_zero remain null when absent; counter_verified stays false. This accepts the requested switch and observed absence, without claiming a measured zero.

1 attempts do not meet the recorded thinking-evidence policy, including failed or incomplete calls. This evidence flag is separate from task accuracy; all attempts remain above.

Overall medians pool individual runs across tasks; they are not sums of task medians. Different success sets make those medians descriptive, not a paired speed ranking. Model rounds are Recued chat and recipe provider calls, browser-use history steps minus one, Stagehand native model calls including extraction and finalization, and OpenClaw unique native model-call IDs including helpers. Tokens are each framework’s own counters; gateway counts separately verify thinking and settings.

The requested browser-use step measure can omit internal model calls; raw gateway requests are retained separately. Recued keeps the release’s ten charged tool-round limit; maxSteps controls browser-use and Stagehand. OpenClaw keeps its native loop and the configured answer deadline; maxSteps does not control it. These round measures and iteration budgets are not uniform provider-request counts.

## Failures and wrong results, all attempts

- J, openclaw-browser, run 2, attempt 1: answer: File Uploaded; answer: \d{10,}_d335-upload-check\.txt; time limit; Tool execution timed out with an unknown outcome. Check the current state before repeating the operation.; actual upload action
- L, openclaw-browser, run 1, attempt 1: saved file of 12499601 bytes
- L, openclaw-browser, run 2, attempt 1: answer: python-3\.13\.0-embed-amd64\.zip; answer: 12[,.\s\u00a0\u202f]?499[,.\s\u00a0\u202f]?601; time limit; This operation was aborted; saved file of 12499601 bytes
- X, openclaw-browser, run 1, attempt 1: the site's record: deleted Tia — School trip form; deleted Bob — Invoice 1043 for October, where it expects deleted Bob — Invoice 1043 for October
- X, openclaw-browser, run 2, attempt 1: the site's record: deleted Kim — Meeting moved to Thursday; deleted Ivy — Newsletter: autumn picks; deleted Ada — Lunch on Friday?; deleted Jay — Your receipt from the cafe; deleted Bob — Invoice 1043 for October, where it expects deleted Bob — Invoice 1043 for October

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
  "benchmark_commit": "665ee3634858b53d959d8893859d1fae342cc8c0",
  "benchmark_source_dirty": false
}
```
