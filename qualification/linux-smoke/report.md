# Browser comparison

2026-11-09; model: qwen3.7-plus.

Times and rounds below are medians of right answers only. Every failure remains in the denominator. An arm with no right answers has no successful-time median. Tokens include all attempts, including failed ones. Each task ran in a separate process; browsers started outside the agent clocks.

| Task | Arm | Right / total | Seconds, right | Model rounds, right | Input tokens, all | Cached tokens, all | Output tokens, all | Approval asks |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| B | recued-bridge | 1 / 1 | 17 | 1 | 28,875 | 0 | 557 | 0 |
| B | recued-playwright | 1 / 1 | 24.2 | 3 | 87,823 | 23,552 | 557 | 0 |
| B | browser-use | 1 / 1 | 25.8 | 2 | 31,600 | 5,120 | 718 | 0 |
| B | stagehand | 0 / 1 | — | — | 58,416 | 19,456 | 426 | 0 |
| Overall | recued-bridge | 1 / 1 | 17 | 1 | 28,875 | 0 | 557 | 0 |
| Overall | recued-playwright | 1 / 1 | 24.2 | 3 | 87,823 | 23,552 | 557 | 0 |
| Overall | browser-use | 1 / 1 | 25.8 | 2 | 31,600 | 5,120 | 718 | 0 |
| Overall | stagehand | 0 / 1 | — | — | 58,416 | 19,456 | 426 | 0 |

4 of 4 attempts lack an explicit zero reasoning-token counter. Task accuracy above is separate from that qualification gap. Requested thinking settings and the raw counter (null when absent) are kept in every record; these results do not prove the provider-reported-counter requirement.

Overall medians pool individual runs across tasks; they are not sums of task medians. Different success sets make those medians descriptive, not a paired speed ranking. Model rounds are Recued chat and recipe provider calls, browser-use history steps minus one, and Stagehand native model calls including extraction and finalization. Tokens are each framework’s own counters; gateway counts separately verify thinking and settings.

## Failures

- B, stagehand, run 1: current top story points

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
