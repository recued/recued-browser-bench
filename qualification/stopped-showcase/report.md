# Interrupted development run

These are original automated verdicts from a superseded adapter. Stagehand completion assessments were mistaken for answers. This batch is not the showcase and must not be used for performance conclusions.

# Browser comparison

2026-11-09; model: qwen3.7-plus.

Times and rounds below are medians of right answers only. Every failure remains in the denominator. An arm with no right answers has no successful-time median. Tokens include all attempts, including failed ones. Each task ran in a separate process; browsers started outside the agent clocks.

| Task | Arm | Right / total | Seconds, right | Model rounds, right | Input tokens, all | Cached tokens, all | Output tokens, all | Approval asks |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| A | recued-bridge | 2 / 2 | 25 | 1 | 40,797 | 0 | 747 | 0 |
| A | recued-playwright | 2 / 2 | 142.6 | 7 | 1,504,297 | 567,552 | 2,193.5 | 0 |
| A | browser-use | 2 / 2 | 65 | 4 | 59,223.5 | 21,120 | 2,065.5 | 0 |
| A | stagehand | 2 / 2 | 54.5 | 8 | 545,653 | 179,072 | 722 | 0 |
| B | recued-bridge | 2 / 2 | 10.4 | 1 | 28,886.5 | 0 | 124 | 0 |
| B | recued-playwright | 2 / 2 | 26 | 3 | 87,831 | 23,552 | 538 | 0 |
| B | browser-use | 2 / 2 | 17.9 | 1 | 20,695 | 6,592 | 418.5 | 0 |
| B | stagehand | 2 / 2 | 29.1 | 7 | 58,479 | 19,456 | 444.5 | 0 |
| C | recued-bridge | 2 / 2 | 48.8 | 3 | 96,709 | 30,976 | 1,610 | 0 |
| C | recued-playwright | 0 / 2 | — | — | 535,712.5 | 405,248 | 2,718.5 | 0 |
| C | browser-use | 2 / 2 | 51.6 | 3 | 44,164 | 10,240 | 1,573.5 | 0 |
| C | stagehand | 2 / 2 | 65.5 | 10.5 | 353,781 | 81,856 | 771 | 0 |
| D | recued-bridge | 2 / 2 | 22.1 | 2 | 60,990 | 29,952 | 373 | 0 |
| D | recued-playwright | 2 / 2 | 68.2 | 3.5 | 202,941 | 35,328 | 767.5 | 0 |
| D | browser-use | 2 / 2 | 50.2 | 2.5 | 39,382 | 19,200 | 1,360 | 0 |
| D | stagehand | 2 / 2 | 35.5 | 4.5 | 223,859 | 46,336 | 628.5 | 0 |
| E | recued-bridge | 1 / 2 | 31.9 | 2 | 63,712 | 0 | 900 | 0 |
| E | recued-playwright | 2 / 2 | 51.3 | 3 | 190,748 | 23,552 | 1,015.5 | 0 |
| E | browser-use | 1 / 2 | 56.5 | 3 | 60,903.5 | 22,080 | 2,560.5 | 0 |
| E | stagehand | 2 / 2 | 63.8 | 5 | 267,766 | 88,448 | 784 | 0 |
| Overall | recued-bridge | 9 / 10 | 24.5 | 2 | 60,990 | 0 | 599 | 0 |
| Overall | recued-playwright | 8 / 10 | 51.3 | 3 | 202,947.5 | 35,328 | 1,015.5 | 0 |
| Overall | browser-use | 9 / 10 | 52.1 | 3 | 39,102.5 | 11,712 | 1,527.5 | 0 |
| Overall | stagehand | 10 / 10 | 54.5 | 7 | 267,723.5 | 88,448 | 715.5 | 0 |

40 of 40 attempts lack an explicit zero reasoning-token counter. Task accuracy above is separate from that qualification gap. Requested thinking settings and the raw counter (null when absent) are kept in every record; these results do not prove the provider-reported-counter requirement.

Overall medians pool individual runs across tasks; they are not sums of task medians. Different success sets make those medians descriptive, not a paired speed ranking. Model rounds are Recued chat and recipe provider calls, browser-use history steps minus one, and Stagehand native model calls including extraction and finalization. Tokens are each framework’s own counters; gateway counts separately verify thinking and settings.

## Failures

- C, recued-playwright, run 1: caption: Daguerreotype; caption: 1843
- C, recued-playwright, run 2: caption: Daguerreotype; caption: 1843
- E, browser-use, run 2: model call failed
- E, recued-bridge, run 2: answer: Menabrea|Bernoulli|Note G; time limit; worker exited (null); answer clock unavailable; model round count unavailable

## Versions

```json
{
  "recued": "26.11.9",
  "bridge": "0.0.8",
  "browserUse": "0.13.14",
  "playwrightMcp": "0.0.85",
  "stagehand": "3.7.3",
  "playwright": "1.61.1",
  "triple": "macos-arm64",
  "node": "v24.19.0",
  "platform": "darwin-arm64",
  "benchmark_commit": "e41fe585efa44dfb4d34205aa7adb8f0ed933fa9",
  "benchmark_source_dirty": false
}
```
