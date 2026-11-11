# Browser comparison

2026-11-09; model: qwen3.7-plus.

Times and rounds below are medians of right answers only. Every failure remains in the denominator. An arm with no right answers has no successful-time median. Tokens include all attempts, including failed ones. Each task ran in a separate process; browsers started outside the agent clocks.

| Task | Arm | Right / total | Seconds, right | Model rounds, right | Input tokens, all | Cached tokens, all | Output tokens, all | Approval asks |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| E | recued-bridge | 1 / 1 | 26.4 | 2 | 63,742 | 0 | 738 | 0 |
| E | recued-playwright | 1 / 1 | 42.4 | 3 | 190,744 | 23,552 | 999 | 0 |
| E | browser-use | 1 / 1 | 49.7 | 3 | 31,332 | 10,240 | 1,621 | 0 |
| E | stagehand | 1 / 1 | 43.1 | 5 | 268,303 | 89,856 | 1,023 | 0 |
| Overall | recued-bridge | 1 / 1 | 26.4 | 2 | 63,742 | 0 | 738 | 0 |
| Overall | recued-playwright | 1 / 1 | 42.4 | 3 | 190,744 | 23,552 | 999 | 0 |
| Overall | browser-use | 1 / 1 | 49.7 | 3 | 31,332 | 10,240 | 1,621 | 0 |
| Overall | stagehand | 1 / 1 | 43.1 | 5 | 268,303 | 89,856 | 1,023 | 0 |

4 of 4 attempts lack an explicit zero reasoning-token counter. Task accuracy above is separate from that qualification gap. Requested thinking settings and the raw counter (null when absent) are kept in every record; these results do not prove the provider-reported-counter requirement.

Overall medians pool individual runs across tasks; they are not sums of task medians. Different success sets make those medians descriptive, not a paired speed ranking. Model rounds are Recued chat and recipe provider calls, browser-use history steps minus one, and Stagehand native model calls including extraction and finalization. Tokens are each framework’s own counters; gateway counts separately verify thinking and settings.

The requested browser-use step measure can omit internal model calls; raw gateway requests are retained separately. Recued keeps the release’s ten charged tool-round limit; maxSteps controls browser-use and Stagehand. These round measures and iteration budgets are not uniform provider-request counts.

## Failures

None.

## Versions

```json
{
  "recued": "26.11.9",
  "bridge": "0.0.8",
  "browserUse": "0.13.14",
  "playwrightMcp": "0.0.85",
  "stagehand": "3.7.3",
  "playwright": "1.61.1",
  "triple": "linux-arm64",
  "node": "v24.19.0",
  "platform": "linux-arm64",
  "benchmark_commit": null,
  "benchmark_source_dirty": null
}
```
