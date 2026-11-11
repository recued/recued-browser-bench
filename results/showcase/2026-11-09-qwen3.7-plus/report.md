# Browser comparison

2026-11-09; model: qwen3.7-plus.

112 scheduled runs; 112 recorded attempts. 0 runs have technical retries. Original attempts are retained unchanged.

## Original attempt summary

Times and rounds below are medians of right answers only. Every failure remains in the denominator. An arm with no right answers has no successful-time median. Token medians use available framework counters from all attempts, including failed ones; missing counts stay null. Each task ran in a separate process; browsers started outside the agent clocks.

| Task | Arm | Right / total | Seconds, right | Model rounds, right | Input tokens, all | Cached tokens, all | Output tokens, all | Approval asks |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| A | recued-bridge | 2 / 2 | 29.5 | 1 | 40,789.5 | 0 | 763 | 0 |
| A | recued-playwright | 1 / 2 | 164.2 | 8 | 909,485 | 409,792 | 2,857.5 | 0 |
| A | browser-use | 2 / 2 | 100.9 | 3 | 46,051 | 12,800 | 1,591 | 0 |
| A | stagehand | 2 / 2 | 85.9 | 8 | 545,695 | 179,072 | 793 | 0 |
| B | recued-bridge | 2 / 2 | 15.6 | 1 | 28,876 | 0 | 145 | 0 |
| B | recued-playwright | 2 / 2 | 32.9 | 3 | 87,815.5 | 23,552 | 521.5 | 0 |
| B | browser-use | 2 / 2 | 30.4 | 1.5 | 27,576.5 | 9,152 | 579 | 0 |
| B | stagehand | 1 / 2 | 36.4 | 4 | 32,343.5 | 5,632 | 419.5 | 0 |
| C | recued-bridge | 2 / 2 | 44.1 | 3 | 92,620 | 41,664 | 1,278.5 | 0 |
| C | recued-playwright | 0 / 2 | — | — | 619,338 | 466,368 | 2,605.5 | 0 |
| C | browser-use | 2 / 2 | 61.2 | 4 | 68,102 | 15,360 | 1,633 | 0 |
| C | stagehand | 2 / 2 | 62.8 | 9 | 263,153.5 | 38,720 | 728.5 | 0 |
| D | recued-bridge | 2 / 2 | 20.4 | 2 | 60,996.5 | 29,952 | 339.5 | 0 |
| D | recued-playwright | 2 / 2 | 47.8 | 3.5 | 202,940 | 42,944 | 740 | 0 |
| D | browser-use | 2 / 2 | 62.1 | 4 | 53,633.5 | 21,760 | 1,695 | 0 |
| D | stagehand | 2 / 2 | 34.5 | 4 | 179,221 | 2,816 | 539 | 0 |
| E | recued-bridge | 2 / 2 | 25 | 1.5 | 47,014 | 0 | 652.5 | 0 |
| E | recued-playwright | 2 / 2 | 40.8 | 3 | 191,338.5 | 23,552 | 932.5 | 0 |
| E | browser-use | 2 / 2 | 99.6 | 6 | 82,018 | 24,320 | 3,869 | 0 |
| E | stagehand | 2 / 2 | 44.1 | 5 | 268,901 | 89,856 | 960 | 0 |
| F | recued-bridge | 2 / 2 | 47.4 | 4 | 107,563.5 | 76,544 | 1,602.5 | 0 |
| F | recued-playwright | 0 / 2 | — | — | 320,979 | 244,096 | 8,662.5 | 0 |
| F | browser-use | 2 / 2 | 50 | 3 | 19,660 | 7,680 | 1,731.5 | 0 |
| F | stagehand | 2 / 2 | 115.5 | 20.5 | 69,433 | 36,608 | 1,994 | 0 |
| G | recued-bridge | 2 / 2 | 52.2 | 2.5 | 69,019 | 37,632 | 2,089 | 0 |
| G | recued-playwright | 0 / 2 | — | — | 324,187 | 244,160 | 5,982 | 0 |
| G | browser-use | 2 / 2 | 124.5 | 8 | 64,921.5 | 42,624 | 5,119.5 | 0 |
| G | stagehand | 2 / 2 | 87.2 | 16.5 | 93,354 | 51,584 | 1,993.5 | 0 |
| H | recued-bridge | 2 / 2 | 30.7 | 2 | 52,502.5 | 25,344 | 612 | 0 |
| H | recued-playwright | 2 / 2 | 40.9 | 3 | 73,702.5 | 47,104 | 660.5 | 0 |
| H | browser-use | 2 / 2 | 55.5 | 3.5 | 22,714 | 13,376 | 1,309 | 0 |
| H | stagehand | 2 / 2 | 44.5 | 5.5 | 20,165 | 10,752 | 562.5 | 0 |
| I | recued-bridge | 2 / 2 | 31.8 | 2 | 56,565 | 27,008 | 957 | 0 |
| I | recued-playwright | 2 / 2 | 65.4 | 6.5 | 204,663 | 133,248 | 1,846.5 | 0 |
| I | browser-use | 2 / 2 | 166.4 | 7 | 102,978 | 68,480 | 6,814 | 0 |
| I | stagehand | 2 / 2 | 73 | 8 | 57,065 | 25,728 | 1,279 | 0 |
| J | recued-bridge | 2 / 2 | 56.7 | 2.5 | 67,685.5 | 38,528 | 1,442.5 | 2 |
| J | recued-playwright | 0 / 2 | — | — | 300,016 | 244,480 | 7,357 | 0 |
| J | browser-use | 2 / 2 | 36.4 | 2 | 12,778 | 5,120 | 880 | 0 |
| J | stagehand | 0 / 2 | — | — | 328,889 | 219,392 | 7,215.5 | 0 |
| K | recued-bridge | 2 / 2 | 41.4 | 3.5 | 99,564.5 | 49,152 | 816 | 0 |
| K | recued-playwright | 0 / 2 | — | — | 327,486 | 255,040 | 5,283.5 | 0 |
| K | browser-use | 2 / 2 | 45.8 | 3 | 21,544.5 | 10,240 | 1,240.5 | 0 |
| K | stagehand | 0 / 2 | — | — | 218,067 | 161,792 | 2,492 | 0 |
| L | recued-bridge | 2 / 2 | 51.6 | 3 | 88,000 | 21,824 | 1,192 | 0 |
| L | recued-playwright | 0 / 2 | — | — | 501,601 | 385,664 | 7,367.5 | 0 |
| L | browser-use | 0 / 2 | — | — | 342,493 | 193,600 | 19,289 | 0 |
| L | stagehand | 0 / 2 | — | — | 315,354.5 | 199,744 | 4,728.5 | 0 |
| X | recued-bridge | 2 / 2 | 23.8 | 2.5 | 65,802.5 | 37,632 | 448 | 0 |
| X | recued-playwright | 0 / 2 | — | — | 283,736 | 234,944 | 2,656.5 | 0 |
| X | browser-use | 0 / 2 | — | — | 112,964.5 | 87,808 | 6,726.5 | 0 |
| X | stagehand | 1 / 2 | 23.6 | 6 | 46,492.5 | 27,392 | 1,065 | 0 |
| Y | recued-bridge | 1 / 2 | 18.3 | 2 | 52,228 | 25,344 | 368 | 0 |
| Y | recued-playwright | 0 / 2 | — | — | 280,140 | 244,736 | 2,867 | 0 |
| Y | browser-use | 2 / 2 | 107.9 | 9.5 | 62,529.5 | 50,112 | 3,056.5 | 0 |
| Y | stagehand | 0 / 2 | — | — | 27,393 | 18,176 | 563 | 0 |
| Overall | recued-bridge | 27 / 28 | 33 | 2 | 60,980 | 25,344 | 911 | 2 |
| Overall | recued-playwright | 11 / 28 | 42.1 | 3 | 283,797 | 240,896 | 2,767 | 0 |
| Overall | browser-use | 24 / 28 | 55.6 | 3 | 43,706 | 15,360 | 1,648.5 | 0 |
| Overall | stagehand | 18 / 28 | 56.7 | 8 | 132,357 | 37,248 | 840 | 0 |

## Current results per task and arm

Each repetition has its own row. These are the latest attempts, not best-of attempts. Wrong answers, wrong actions and exhausted agent budgets are final. Only observed technical failures are retryable. Unknown or configuration failures require investigation rather than automatic retries.

Seconds and tokens here belong to the displayed attempt. Wall seconds include worker startup and cleanup before the page checker; older records did not capture that value. Missing measurements stay —. Cached tokens are part of input, not additional input.

| Task | Arm | Run | Attempt | Result | Answer seconds | Wall seconds | AI rounds | Tokens: input / cached / output | Failed reason |
| --- | --- | ---: | ---: | --- | ---: | ---: | ---: | --- | --- |
| A | recued-bridge | 1 | 1 | RIGHT | 24.4 | — | 1 | 40,789 / 0 / 386 |  |
| A | recued-bridge | 2 | 1 | RIGHT | 34.7 | — | 1 | 40,790 / 0 / 1,140 |  |
| A | recued-playwright | 1 | 1 | WRONG | 115 | — | 11 | 280,539 / 243,712 / 2,940 | answer: 1991 |
| A | recued-playwright | 2 | 1 | RIGHT | 164.2 | — | 8 | 1,538,431 / 575,872 / 2,775 |  |
| A | browser-use | 1 | 1 | RIGHT | 125.1 | — | 3 | 46,037 / 10,240 / 1,562 |  |
| A | browser-use | 2 | 1 | RIGHT | 76.8 | — | 3 | 46,065 / 15,360 / 1,620 |  |
| A | stagehand | 1 | 1 | RIGHT | 93.3 | — | 8 | 545,828 / 179,072 / 773 |  |
| A | stagehand | 2 | 1 | RIGHT | 78.6 | — | 8 | 545,562 / 179,072 / 813 |  |
| B | recued-bridge | 1 | 1 | RIGHT | 16.7 | — | 1 | 28,866 / 0 / 173 |  |
| B | recued-bridge | 2 | 1 | RIGHT | 14.5 | — | 1 | 28,886 / 0 / 117 |  |
| B | recued-playwright | 1 | 1 | RIGHT | 31.5 | — | 3 | 87,804 / 23,552 / 495 |  |
| B | recued-playwright | 2 | 1 | RIGHT | 34.4 | — | 3 | 87,827 / 23,552 / 548 |  |
| B | browser-use | 1 | 1 | RIGHT | 36.3 | — | 2 | 41,375 / 18,304 / 778 |  |
| B | browser-use | 2 | 1 | RIGHT | 24.5 | — | 1 | 13,778 / 0 / 380 |  |
| B | stagehand | 1 | 1 | RIGHT | 36.4 | — | 4 | 32,349 / 5,632 / 428 |  |
| B | stagehand | 2 | 1 | WRONG | 40.3 | — | 4 | 32,338 / 5,632 / 411 | current top story points |
| C | recued-bridge | 1 | 1 | RIGHT | 43.4 | — | 2 | 61,087 / 24,704 / 1,173 |  |
| C | recued-bridge | 2 | 1 | RIGHT | 44.8 | — | 4 | 124,153 / 58,624 / 1,384 |  |
| C | recued-playwright | 1 | 1 | WRONG | 107.9 | — | 11 | 560,782 / 419,584 / 2,767 | caption: Daguerreotype |
| C | recued-playwright | 2 | 1 | WRONG | 108.7 | — | 11 | 677,894 / 513,152 / 2,444 | caption: Daguerreotype |
| C | browser-use | 1 | 1 | RIGHT | 61.9 | — | 4 | 68,397 / 15,360 / 1,589 |  |
| C | browser-use | 2 | 1 | RIGHT | 60.4 | — | 4 | 67,807 / 15,360 / 1,677 |  |
| C | stagehand | 1 | 1 | RIGHT | 63.8 | — | 9 | 266,557 / 40,192 / 754 |  |
| C | stagehand | 2 | 1 | RIGHT | 61.8 | — | 9 | 259,750 / 37,248 / 703 |  |
| D | recued-bridge | 1 | 1 | RIGHT | 19.2 | — | 2 | 61,013 / 29,952 / 358 |  |
| D | recued-bridge | 2 | 1 | RIGHT | 21.7 | — | 2 | 60,980 / 29,952 / 321 |  |
| D | recued-playwright | 1 | 1 | RIGHT | 56.7 | — | 4 | 215,147 / 47,104 / 847 |  |
| D | recued-playwright | 2 | 1 | RIGHT | 38.8 | — | 3 | 190,733 / 38,784 / 633 |  |
| D | browser-use | 1 | 1 | RIGHT | 43.9 | — | 2 | 33,681 / 16,640 / 1,106 |  |
| D | browser-use | 2 | 1 | RIGHT | 80.3 | — | 6 | 73,586 / 26,880 / 2,284 |  |
| D | stagehand | 1 | 1 | RIGHT | 35.4 | — | 4 | 179,222 / 2,816 / 537 |  |
| D | stagehand | 2 | 1 | RIGHT | 33.6 | — | 4 | 179,220 / 2,816 / 541 |  |
| E | recued-bridge | 1 | 1 | RIGHT | 21.8 | — | 1 | 30,272 / 0 / 637 |  |
| E | recued-bridge | 2 | 1 | RIGHT | 28.1 | — | 2 | 63,756 / 0 / 668 |  |
| E | recued-playwright | 1 | 1 | RIGHT | 42.1 | — | 3 | 191,929 / 23,552 / 937 |  |
| E | recued-playwright | 2 | 1 | RIGHT | 39.5 | — | 3 | 190,748 / 23,552 / 928 |  |
| E | browser-use | 1 | 1 | RIGHT | 154.3 | — | 9 | 131,927 / 38,400 / 6,385 |  |
| E | browser-use | 2 | 1 | RIGHT | 44.9 | — | 3 | 32,109 / 10,240 / 1,353 |  |
| E | stagehand | 1 | 1 | RIGHT | 51.7 | — | 5 | 268,850 / 89,856 / 1,080 |  |
| E | stagehand | 2 | 1 | RIGHT | 36.5 | — | 5 | 268,952 / 89,856 / 840 |  |
| F | recued-bridge | 1 | 1 | RIGHT | 49.1 | — | 4 | 107,647 / 76,544 / 1,580 |  |
| F | recued-bridge | 2 | 1 | RIGHT | 45.7 | — | 4 | 107,480 / 76,544 / 1,625 |  |
| F | recued-playwright | 1 | 1 | WRONG | 189.6 | — | 11 | 318,068 / 241,408 / 7,141 | answer: custname\W+Ada Test |
| F | recued-playwright | 2 | 1 | WRONG | 280.9 | — | 11 | 323,890 / 246,784 / 10,184 | answer: custname\W+Ada Test |
| F | browser-use | 1 | 1 | RIGHT | 50.8 | — | 3 | 19,667 / 10,240 / 1,766 |  |
| F | browser-use | 2 | 1 | RIGHT | 49.1 | — | 3 | 19,653 / 5,120 / 1,697 |  |
| F | stagehand | 1 | 1 | RIGHT | 84.6 | — | 18 | 65,090 / 33,664 / 1,792 |  |
| F | stagehand | 2 | 1 | RIGHT | 146.5 | — | 23 | 73,776 / 39,552 / 2,196 |  |
| G | recued-bridge | 1 | 1 | RIGHT | 56 | — | 3 | 82,946 / 50,560 / 2,273 |  |
| G | recued-bridge | 2 | 1 | RIGHT | 48.5 | — | 2 | 55,092 / 24,704 / 1,905 |  |
| G | recued-playwright | 1 | 1 | WRONG | 162.8 | — | 11 | 319,824 / 240,896 / 6,455 | answer: \b(6\|six)\b |
| G | recued-playwright | 2 | 1 | WRONG | 153.5 | — | 11 | 328,550 / 247,424 / 5,509 | answer: \b(6\|six)\b |
| G | browser-use | 1 | 1 | RIGHT | 149.4 | — | 9 | 77,196 / 52,608 / 6,261 |  |
| G | browser-use | 2 | 1 | RIGHT | 99.6 | — | 7 | 52,647 / 32,640 / 3,978 |  |
| G | stagehand | 1 | 1 | RIGHT | 108.5 | — | 22 | 132,357 / 74,240 / 2,491 |  |
| G | stagehand | 2 | 1 | RIGHT | 66 | — | 11 | 54,351 / 28,928 / 1,496 |  |
| H | recued-bridge | 1 | 1 | RIGHT | 29.6 | — | 2 | 52,561 / 25,344 / 565 |  |
| H | recued-bridge | 2 | 1 | RIGHT | 31.8 | — | 2 | 52,444 / 25,344 / 659 |  |
| H | recued-playwright | 1 | 1 | RIGHT | 42.3 | — | 3 | 73,701 / 47,104 / 615 |  |
| H | recued-playwright | 2 | 1 | RIGHT | 39.5 | — | 3 | 73,704 / 47,104 / 706 |  |
| H | browser-use | 1 | 1 | RIGHT | 40.1 | — | 2 | 12,449 / 5,120 / 790 |  |
| H | browser-use | 2 | 1 | RIGHT | 70.9 | — | 5 | 32,979 / 21,632 / 1,828 |  |
| H | stagehand | 1 | 1 | RIGHT | 43.1 | — | 5 | 17,309 / 8,448 / 457 |  |
| H | stagehand | 2 | 1 | RIGHT | 45.9 | — | 6 | 23,021 / 13,056 / 668 |  |
| I | recued-bridge | 1 | 1 | RIGHT | 33 | — | 2 | 56,567 / 27,008 / 939 |  |
| I | recued-bridge | 2 | 1 | RIGHT | 30.6 | — | 2 | 56,563 / 27,008 / 975 |  |
| I | recued-playwright | 1 | 1 | RIGHT | 69.2 | — | 7 | 217,357 / 145,024 / 1,959 |  |
| I | recued-playwright | 2 | 1 | RIGHT | 61.7 | — | 6 | 191,969 / 121,472 / 1,734 |  |
| I | browser-use | 1 | 1 | RIGHT | 176.6 | — | 7 | 102,969 / 65,920 / 7,000 |  |
| I | browser-use | 2 | 1 | RIGHT | 156.1 | — | 7 | 102,987 / 71,040 / 6,628 |  |
| I | stagehand | 1 | 1 | RIGHT | 96.8 | — | 8 | 56,978 / 25,728 / 1,312 |  |
| I | stagehand | 2 | 1 | RIGHT | 49.2 | — | 8 | 57,152 / 25,728 / 1,246 |  |
| J | recued-bridge | 1 | 1 | RIGHT | 52.4 | — | 2 | 53,544 / 25,856 / 1,085 |  |
| J | recued-bridge | 2 | 1 | RIGHT | 61 | — | 3 | 81,827 / 51,200 / 1,800 |  |
| J | recued-playwright | 1 | 1 | WRONG | 164.1 | — | 11 | 308,954 / 232,960 / 5,974 | answer: File Uploaded |
| J | recued-playwright | 2 | 1 | WRONG | 192.4 | — | 11 | 291,078 / 256,000 / 8,740 | answer: File Uploaded |
| J | browser-use | 1 | 1 | RIGHT | 37 | — | 2 | 12,744 / 5,120 / 853 |  |
| J | browser-use | 2 | 1 | RIGHT | 35.7 | — | 2 | 12,812 / 5,120 / 907 |  |
| J | stagehand | 1 | 1 | WRONG | 374.7 | — | 79 | 357,335 / 244,864 / 8,068 | Agent did not complete the task within its native time or step budget. |
| J | stagehand | 2 | 1 | WRONG | 273.4 | — | 62 | 300,443 / 193,920 / 6,363 | Agent did not complete the task within its native time or step budget. |
| K | recued-bridge | 1 | 1 | RIGHT | 42.5 | — | 3 | 84,804 / 54,016 / 721 |  |
| K | recued-bridge | 2 | 1 | RIGHT | 40.3 | — | 4 | 114,325 / 44,288 / 911 |  |
| K | recued-playwright | 1 | 1 | WRONG | 139.5 | — | 11 | 330,955 / 240,256 / 5,235 | answer: The\s+following\s+image\s+shows\s+a\s+happy\s+looking\s+dog\s+lying\s+in\s+some\s+grass |
| K | recued-playwright | 2 | 1 | WRONG | 150.3 | — | 11 | 324,017 / 269,824 / 5,332 | answer: The\s+following\s+image\s+shows\s+a\s+happy\s+looking\s+dog\s+lying\s+in\s+some\s+grass |
| K | browser-use | 1 | 1 | RIGHT | 50.8 | — | 3 | 22,151 / 10,240 / 1,229 |  |
| K | browser-use | 2 | 1 | RIGHT | 40.7 | — | 3 | 20,938 / 10,240 / 1,252 |  |
| K | stagehand | 1 | 1 | WRONG | 480 | — | 33 | — / — / — | Agent did not complete the task within its native time or step budget. |
| K | stagehand | 2 | 1 | WRONG | 151.6 | — | 38 | 218,067 / 161,792 / 2,492 | Agent did not complete the task within its native time or step budget. |
| L | recued-bridge | 1 | 1 | RIGHT | 54.8 | — | 3 | 87,982 / 18,944 / 1,313 |  |
| L | recued-bridge | 2 | 1 | RIGHT | 48.5 | — | 3 | 88,018 / 24,704 / 1,071 |  |
| L | recued-playwright | 1 | 1 | WRONG | 157.4 | — | 11 | 517,402 / 390,912 / 5,871 | answer: python-3\.13\.0-embed-amd64\.zip |
| L | recued-playwright | 2 | 1 | WRONG | 199.1 | — | 11 | 485,800 / 380,416 / 8,864 | answer: python-3\.13\.0-embed-amd64\.zip |
| L | browser-use | 1 | 1 | WRONG | 434.7 | — | 27 | 323,668 / 192,256 / 17,383 | answer: 12[,.\s\u00a0\u202f]?499[,.\s\u00a0\u202f]?601 |
| L | browser-use | 2 | 1 | WRONG | 471.6 | — | 27 | 361,318 / 194,944 / 21,195 | answer: 12[,.\s\u00a0\u202f]?499[,.\s\u00a0\u202f]?601 |
| L | stagehand | 1 | 1 | WRONG | 214.6 | — | 40 | 331,600 / 209,792 / 6,009 | Agent did not complete the task within its native time or step budget. |
| L | stagehand | 2 | 1 | WRONG | 171.8 | — | 35 | 299,109 / 189,696 / 3,448 | Agent did not complete the task within its native time or step budget. |
| X | recued-bridge | 1 | 1 | RIGHT | 16.1 | — | 2 | 52,248 / 24,704 / 351 |  |
| X | recued-bridge | 2 | 1 | RIGHT | 31.5 | — | 3 | 79,357 / 50,560 / 545 |  |
| X | recued-playwright | 1 | 1 | WRONG | 84.3 | — | 11 | 283,675 / 223,360 / 2,622 | answer: Bob |
| X | recued-playwright | 2 | 1 | WRONG | 84.7 | — | 11 | 283,797 / 246,528 / 2,691 | answer: Bob |
| X | browser-use | 1 | 1 | WRONG | 32.4 | — | 2 | 18,044 / 10,880 / 1,145 | the site's record: deleted Ivy — Newsletter: autumn picks, where it expects deleted Bob — Invoice 1043 for October |
| X | browser-use | 2 | 1 | WRONG | 475.2 | — | 27 | 207,885 / 164,736 / 12,308 | the site's record: deleted Jay — Your receipt from the cafe; deleted Ivy — Newsletter: autumn picks; deleted Ada — Lunch on Friday?; deleted Kim — Meeting moved to Thursday; deleted Lou — Password changed; deleted Ned — Library books due; deleted Quin — Parking permit; deleted Bob — Invoice 1043 for October, where it expects deleted Bob — Invoice 1043 for October |
| X | stagehand | 1 | 1 | RIGHT | 23.6 | — | 6 | 17,286 / 9,088 / 527 |  |
| X | stagehand | 2 | 1 | WRONG | 146 | — | 19 | 75,699 / 45,696 / 1,603 | the site's record: deleted Ada — Lunch on Friday?; deleted Jay — Your receipt from the cafe; deleted Bob — Invoice 1043 for October, where it expects deleted Bob — Invoice 1043 for October |
| Y | recued-bridge | 1 | 1 | RIGHT | 18.3 | — | 2 | 52,228 / 25,344 / 368 |  |
| Y | recued-bridge | 2 | 1 | FAILED (technical; retryable) | — | — | — | — / — / — | provider transport or response error |
| Y | recued-playwright | 1 | 1 | WRONG | 114.4 | — | 11 | 280,140 / 244,736 / 2,867 | answer: WT-4417 |
| Y | recued-playwright | 2 | 1 | FAILED (technical; retryable) | — | — | — | — / — / — | provider transport or response error |
| Y | browser-use | 1 | 1 | RIGHT | 33.8 | — | 3 | 17,941 / 10,240 / 919 |  |
| Y | browser-use | 2 | 1 | RIGHT | 181.9 | — | 16 | 107,118 / 89,984 / 5,194 |  |
| Y | stagehand | 1 | 1 | WRONG | 26.6 | — | 7 | 18,991 / 11,264 / 416 | the site's record: opened summer-sale, where it expects opened winter-tyres |
| Y | stagehand | 2 | 1 | WRONG | 42.9 | — | 12 | 35,795 / 25,088 / 710 | the site's record: opened summer-sale; opened winter-tyres, where it expects opened winter-tyres |

112 of 112 attempts have an unreported reasoning-token counter. 108 meet the accepted policy: completed successful calls requested thinking off, returned no reasoning content, and reported no contradictory counter. Raw counters and all_zero remain null when absent; counter_verified stays false. This accepts the requested switch and observed absence, without claiming a measured zero.

4 attempts do not meet the recorded thinking-evidence policy, including failed or incomplete calls. This evidence flag is separate from task accuracy; all attempts remain above.

Overall medians pool individual runs across tasks; they are not sums of task medians. Different success sets make those medians descriptive, not a paired speed ranking. Model rounds are Recued chat and recipe provider calls, browser-use history steps minus one, and Stagehand native model calls including extraction and finalization. Tokens are each framework’s own counters; gateway counts separately verify thinking and settings.

The requested browser-use step measure can omit internal model calls; raw gateway requests are retained separately. Recued keeps the release’s ten charged tool-round limit; maxSteps controls browser-use and Stagehand. These round measures and iteration budgets are not uniform provider-request counts.

## Failures and wrong results, all attempts

- A, recued-playwright, run 1, attempt 1: answer: 1991; answer: Guido; answer: 2012; answer: Hoare; answer: 2009; answer: Pike|Griesemer|Thompson
- B, stagehand, run 2, attempt 1: current top story points
- C, recued-playwright, run 1, attempt 1: caption: Daguerreotype; caption: 1843
- C, recued-playwright, run 2, attempt 1: caption: Daguerreotype; caption: 1843
- F, recued-playwright, run 1, attempt 1: answer: custname\W+Ada Test; answer: custtel\W+555-0100; answer: custemail\W+ada@example\.com; answer: size\W+large; answer: topping\W+(bacon\W+mushroom|mushroom\W+bacon); answer: delivery\W+19:30; answer: comments\W+Ring twice
- F, recued-playwright, run 2, attempt 1: answer: custname\W+Ada Test; answer: custtel\W+555-0100; answer: custemail\W+ada@example\.com; answer: size\W+large; answer: topping\W+(bacon\W+mushroom|mushroom\W+bacon); answer: delivery\W+19:30; answer: comments\W+Ring twice
- G, recued-playwright, run 1, attempt 1: answer: \b(6|six)\b; answer: Neruda
- G, recued-playwright, run 2, attempt 1: answer: \b(6|six)\b; answer: Gide; answer: Monroe; answer: Marley; answer: Wiesel; answer: Nietzsche; answer: Neruda
- J, recued-playwright, run 1, attempt 1: answer: File Uploaded; answer: \d{10,}_d335-upload-check\.txt; actual upload action
- J, stagehand, run 1, attempt 1: answer: File Uploaded; answer: \d{10,}_d335-upload-check\.txt; agent did not finish; actual upload action
- J, stagehand, run 2, attempt 1: answer: File Uploaded; answer: \d{10,}_d335-upload-check\.txt; agent did not finish; actual upload action
- J, recued-playwright, run 2, attempt 1: answer: File Uploaded; answer: \d{10,}_d335-upload-check\.txt; actual upload action
- K, stagehand, run 1, attempt 1: answer: The\s+following\s+image\s+shows\s+a\s+happy\s+looking\s+dog\s+lying\s+in\s+some\s+grass; time limit; AgentAbortError: Agent execution was aborted: AbortError: This operation was aborted
- K, recued-playwright, run 1, attempt 1: answer: The\s+following\s+image\s+shows\s+a\s+happy\s+looking\s+dog\s+lying\s+in\s+some\s+grass
- K, stagehand, run 2, attempt 1: answer: The\s+following\s+image\s+shows\s+a\s+happy\s+looking\s+dog\s+lying\s+in\s+some\s+grass; agent did not finish
- K, recued-playwright, run 2, attempt 1: answer: The\s+following\s+image\s+shows\s+a\s+happy\s+looking\s+dog\s+lying\s+in\s+some\s+grass
- L, stagehand, run 1, attempt 1: answer: 12[,.\s\u00a0\u202f]?499[,.\s\u00a0\u202f]?601; agent did not finish
- L, recued-playwright, run 1, attempt 1: answer: python-3\.13\.0-embed-amd64\.zip; answer: 12[,.\s\u00a0\u202f]?499[,.\s\u00a0\u202f]?601; saved file of 12499601 bytes
- L, browser-use, run 1, attempt 1: answer: 12[,.\s\u00a0\u202f]?499[,.\s\u00a0\u202f]?601
- L, recued-playwright, run 2, attempt 1: answer: python-3\.13\.0-embed-amd64\.zip; answer: 12[,.\s\u00a0\u202f]?499[,.\s\u00a0\u202f]?601; saved file of 12499601 bytes
- L, browser-use, run 2, attempt 1: answer: 12[,.\s\u00a0\u202f]?499[,.\s\u00a0\u202f]?601
- L, stagehand, run 2, attempt 1: answer: 12[,.\s\u00a0\u202f]?499[,.\s\u00a0\u202f]?601; agent did not finish
- X, recued-playwright, run 1, attempt 1: answer: Bob; answer: 1043|invoice; the site's record: nothing, where it expects deleted Bob — Invoice 1043 for October
- X, browser-use, run 1, attempt 1: the site's record: deleted Ivy — Newsletter: autumn picks, where it expects deleted Bob — Invoice 1043 for October
- X, recued-playwright, run 2, attempt 1: answer: Bob; answer: 1043|invoice; the site's record: nothing, where it expects deleted Bob — Invoice 1043 for October
- X, browser-use, run 2, attempt 1: answer: Bob; answer: 1043|invoice; time limit; agent did not finish; the site's record: deleted Jay — Your receipt from the cafe; deleted Ivy — Newsletter: autumn picks; deleted Ada — Lunch on Friday?; deleted Kim — Meeting moved to Thursday; deleted Lou — Password changed; deleted Ned — Library books due; deleted Quin — Parking permit; deleted Bob — Invoice 1043 for October, where it expects deleted Bob — Invoice 1043 for October
- X, stagehand, run 2, attempt 1: the site's record: deleted Ada — Lunch on Friday?; deleted Jay — Your receipt from the cafe; deleted Bob — Invoice 1043 for October, where it expects deleted Bob — Invoice 1043 for October
- Y, recued-playwright, run 1, attempt 1: answer: WT-4417; the site's record: nothing, where it expects opened winter-tyres
- Y, stagehand, run 1, attempt 1: answer: WT-4417; the site's record: opened summer-sale, where it expects opened winter-tyres
- Y, stagehand, run 2, attempt 1: the site's record: opened summer-sale; opened winter-tyres, where it expects opened winter-tyres
- Y, recued-bridge, run 2, attempt 1: answer: WT-4417; time limit; model call failed; answer clock unavailable; model round count unavailable; the site's record: nothing, where it expects opened winter-tyres
- Y, recued-playwright, run 2, attempt 1: answer: WT-4417; time limit; model call failed; answer clock unavailable; model round count unavailable; the site's record: nothing, where it expects opened winter-tyres

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
  "benchmark_commit": "e0d69483de4912d20cac3265f396ec52b6100c14",
  "benchmark_source_dirty": false
}
```
