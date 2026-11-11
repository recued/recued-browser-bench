# Recued Bridge and browser agents

A public showcase of seconds and AI rounds to a right answer on fourteen browser
tasks. Tokens are recorded as a secondary measure. This is an informal comparison,
with no declared or sealed rounds.

The owner’s runs used **qwen3.7-plus**, thinking off, temperature 0.2, frequency
penalty 0 and a 4,000-token output limit, with two repetitions per task. The
original four arms ran on 2026-11-09 local time (November 9–10 UTC).
**The two OpenClaw arms and Hermes were added in separate batches on November 10**,
reusing the existing results. Timing comparisons describe separate batches; some
OpenClaw download attempts were observed to transfer slowly.

The answer limit was 480 seconds. browser-use and Stagehand had 30 native steps;
Recued kept its release’s ten charged tool rounds. OpenClaw and Hermes kept their
native loops and the shared answer deadline.

Five attempts with provider transport failures received a retry **before generating
these tables**. Bridge recovered on Y/R2; MCP’s Y/R2 retry exhausted its tool budget
and remains wrong. OpenClaw + browser-use’s C/R1 and G/R1 retries both passed.
The built-in browser’s L/R2 retry completed the ZIP through a shell client while
its browser download remained incomplete, so it remains wrong. Its additional
provider reset and unknown native token totals are retained.
There are **zero remaining retryable technical failures**. These tables use the
latest attempt for each of **196 scheduled runs**. All **201 physical attempts**
remain in the [combined report](results/showcase/2026-11-10-qwen3.7-plus-seven-arms/report.md),
[records](results/showcase/2026-11-10-qwen3.7-plus-seven-arms/records.json) and
[metric vectors](results/showcase/2026-11-10-qwen3.7-plus-seven-arms/results.json).
Each source batch retains its own dates, versions, hashes and retry history.

The built-in browser’s L/R1 saved artifact was verified after the collector
incorrectly marked it missing. Its corrected evidence and verdict required no AI
rerun; all measurements are unchanged. The [correction receipt](qualification/openclaw/native-download-repair.json)
preserves that proof and the original record.

Hermes’s D/R1 checker returned no title. Its saved in-turn browser output contained
the correct five-item list, independently matched by the same batch’s D/R2 checker.
The current checker recheck received Wikimedia HTTP 429. An
[evidence correction](qualification/hermes/oracle-repair.json) repairs only D/R1’s
checker evidence and verdict, retaining the [raw 28-attempt batch](qualification/hermes/raw-showcase/records.json).
No model rerun or measurement change was needed. Future runs identify missing
checker content or HTTP errors as technical failures, rather than answer mismatches.

**Recued + Bridge: 28 correct / 0 wrong**; **Recued + Playwright MCP: 11 correct / 17 wrong**; **browser-use: 24 correct / 4 wrong**; **Stagehand: 18 correct / 10 wrong**; **OpenClaw + browser-use: 23 correct / 5 wrong**; **OpenClaw + built-in browser: 24 correct / 4 wrong**; **Hermes Agent: 24 correct / 4 wrong**.

## Per-task results

R1 and R2 have separate tables, each with one row per task and four columns per
arm. Every value belongs to that repetition’s latest attempt, including wrong
results. **Bold numeric values are the lowest displayed values among correct
answers in that row; all ties are highlighted.** Wrong results remain visible
and are excluded from best-value highlighting.

Tokens are native **input + output**; cached input is already included and is not
added again. Seconds are answer-clock seconds, excluding browser launch. AI rounds
are steps or calls spent, **not counts of correct answers**; their definitions
differ by framework, as described below. Missing measurements appear as — and
cannot win. Earlier retry costs remain in the full report’s retry history.

### R1

<table>
  <thead>
    <tr>
      <th rowspan="2">Task</th>
      <th colspan="4">Recued + Bridge</th>
      <th colspan="4">Recued + Playwright MCP</th>
      <th colspan="4">browser-use</th>
      <th colspan="4">Stagehand</th>
      <th colspan="4">OpenClaw + browser-use</th>
      <th colspan="4">OpenClaw + built-in browser</th>
      <th colspan="4">Hermes Agent</th>
    </tr>
    <tr>
      <th>Tokens</th>
      <th>Seconds</th>
      <th>AI rounds</th>
      <th>Correct / wrong</th>
      <th>Tokens</th>
      <th>Seconds</th>
      <th>AI rounds</th>
      <th>Correct / wrong</th>
      <th>Tokens</th>
      <th>Seconds</th>
      <th>AI rounds</th>
      <th>Correct / wrong</th>
      <th>Tokens</th>
      <th>Seconds</th>
      <th>AI rounds</th>
      <th>Correct / wrong</th>
      <th>Tokens</th>
      <th>Seconds</th>
      <th>AI rounds</th>
      <th>Correct / wrong</th>
      <th>Tokens</th>
      <th>Seconds</th>
      <th>AI rounds</th>
      <th>Correct / wrong</th>
      <th>Tokens</th>
      <th>Seconds</th>
      <th>AI rounds</th>
      <th>Correct / wrong</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>A · Compare programming languages</th>
      <td><strong>41,175</strong></td>
      <td><strong>24.4</strong></td>
      <td><strong>1</strong></td>
      <td>CORRECT</td>
      <td>283,479</td>
      <td>115.0</td>
      <td>11</td>
      <td>WRONG</td>
      <td>47,599</td>
      <td>125.1</td>
      <td>3</td>
      <td>CORRECT</td>
      <td>546,601</td>
      <td>93.3</td>
      <td>8</td>
      <td>CORRECT</td>
      <td>379,069</td>
      <td>142.1</td>
      <td>19</td>
      <td>CORRECT</td>
      <td>507,441</td>
      <td>162.9</td>
      <td>16</td>
      <td>CORRECT</td>
      <td>92,743</td>
      <td>88.8</td>
      <td>7</td>
      <td>CORRECT</td>
    </tr>
    <tr>
      <th>B · Hacker News top story</th>
      <td><strong>29,039</strong></td>
      <td><strong>16.7</strong></td>
      <td><strong>1</strong></td>
      <td>CORRECT</td>
      <td>88,299</td>
      <td>31.5</td>
      <td>3</td>
      <td>CORRECT</td>
      <td>42,153</td>
      <td>36.3</td>
      <td>2</td>
      <td>CORRECT</td>
      <td>32,777</td>
      <td>36.4</td>
      <td>4</td>
      <td>CORRECT</td>
      <td>82,984</td>
      <td>46.1</td>
      <td>6</td>
      <td>CORRECT</td>
      <td>34,725</td>
      <td><strong>16.7</strong></td>
      <td>3</td>
      <td>CORRECT</td>
      <td>32,034</td>
      <td>18.3</td>
      <td>3</td>
      <td>CORRECT</td>
    </tr>
    <tr>
      <th>C · Wikipedia image caption</th>
      <td><strong>62,260</strong></td>
      <td><strong>43.4</strong></td>
      <td><strong>2</strong></td>
      <td>CORRECT</td>
      <td>563,549</td>
      <td>107.9</td>
      <td>11</td>
      <td>WRONG</td>
      <td>69,986</td>
      <td>61.9</td>
      <td>4</td>
      <td>CORRECT</td>
      <td>267,311</td>
      <td>63.8</td>
      <td>9</td>
      <td>CORRECT</td>
      <td>203,982</td>
      <td>121.7</td>
      <td>13</td>
      <td>CORRECT</td>
      <td>116,474</td>
      <td>76.9</td>
      <td>8</td>
      <td>CORRECT</td>
      <td>76,506</td>
      <td>69.1</td>
      <td>6</td>
      <td>WRONG</td>
    </tr>
    <tr>
      <th>D · Last See also entry</th>
      <td>61,371</td>
      <td><strong>19.2</strong></td>
      <td><strong>2</strong></td>
      <td>CORRECT</td>
      <td>215,994</td>
      <td>56.7</td>
      <td>4</td>
      <td>CORRECT</td>
      <td><strong>34,787</strong></td>
      <td>43.9</td>
      <td><strong>2</strong></td>
      <td>CORRECT</td>
      <td>179,759</td>
      <td>35.4</td>
      <td>4</td>
      <td>CORRECT</td>
      <td>473,623</td>
      <td>188.1</td>
      <td>24</td>
      <td>CORRECT</td>
      <td>531,738</td>
      <td>184.7</td>
      <td>20</td>
      <td>CORRECT</td>
      <td>254,040</td>
      <td>139.8</td>
      <td>18</td>
      <td>CORRECT</td>
    </tr>
    <tr>
      <th>E · Three-sentence work summary</th>
      <td><strong>30,909</strong></td>
      <td><strong>21.8</strong></td>
      <td><strong>1</strong></td>
      <td>CORRECT</td>
      <td>192,866</td>
      <td>42.1</td>
      <td>3</td>
      <td>CORRECT</td>
      <td>138,312</td>
      <td>154.3</td>
      <td>9</td>
      <td>CORRECT</td>
      <td>269,930</td>
      <td>51.7</td>
      <td>5</td>
      <td>CORRECT</td>
      <td>199,548</td>
      <td>113.7</td>
      <td>14</td>
      <td>CORRECT</td>
      <td>690,587</td>
      <td>207.3</td>
      <td>23</td>
      <td>CORRECT</td>
      <td>159,532</td>
      <td>108.0</td>
      <td>12</td>
      <td>CORRECT</td>
    </tr>
    <tr>
      <th>F · Submit pizza form</th>
      <td>109,227</td>
      <td><strong>49.1</strong></td>
      <td>4</td>
      <td>CORRECT</td>
      <td>325,209</td>
      <td>189.6</td>
      <td>11</td>
      <td>WRONG</td>
      <td><strong>21,433</strong></td>
      <td>50.8</td>
      <td><strong>3</strong></td>
      <td>CORRECT</td>
      <td>66,882</td>
      <td>84.6</td>
      <td>18</td>
      <td>CORRECT</td>
      <td>239,884</td>
      <td>72.7</td>
      <td>12</td>
      <td>CORRECT</td>
      <td>112,087</td>
      <td>60.7</td>
      <td>8</td>
      <td>CORRECT</td>
      <td>384,869</td>
      <td>205.9</td>
      <td>24</td>
      <td>CORRECT</td>
    </tr>
    <tr>
      <th>G · Count quotes across pages</th>
      <td>85,219</td>
      <td>56.0</td>
      <td><strong>3</strong></td>
      <td>CORRECT</td>
      <td>326,279</td>
      <td>162.8</td>
      <td>11</td>
      <td>WRONG</td>
      <td>83,457</td>
      <td>149.4</td>
      <td>9</td>
      <td>CORRECT</td>
      <td>134,848</td>
      <td>108.5</td>
      <td>22</td>
      <td>CORRECT</td>
      <td>205,914</td>
      <td>93.5</td>
      <td>12</td>
      <td>CORRECT</td>
      <td>102,922</td>
      <td>57.2</td>
      <td>7</td>
      <td>CORRECT</td>
      <td><strong>34,580</strong></td>
      <td><strong>35.2</strong></td>
      <td><strong>3</strong></td>
      <td>CORRECT</td>
    </tr>
    <tr>
      <th>H · Read delayed quotes</th>
      <td>53,126</td>
      <td><strong>29.6</strong></td>
      <td><strong>2</strong></td>
      <td>CORRECT</td>
      <td>74,316</td>
      <td>42.3</td>
      <td>3</td>
      <td>CORRECT</td>
      <td><strong>13,239</strong></td>
      <td>40.1</td>
      <td><strong>2</strong></td>
      <td>CORRECT</td>
      <td>17,766</td>
      <td>43.1</td>
      <td>5</td>
      <td>CORRECT</td>
      <td>119,118</td>
      <td>55.2</td>
      <td>8</td>
      <td>CORRECT</td>
      <td>53,024</td>
      <td>56.3</td>
      <td>5</td>
      <td>CORRECT</td>
      <td>32,506</td>
      <td>34.7</td>
      <td>3</td>
      <td>CORRECT</td>
    </tr>
    <tr>
      <th>I · Cheapest Travel book</th>
      <td><strong>57,506</strong></td>
      <td><strong>33.0</strong></td>
      <td><strong>2</strong></td>
      <td>CORRECT</td>
      <td>219,316</td>
      <td>69.2</td>
      <td>7</td>
      <td>CORRECT</td>
      <td>109,969</td>
      <td>176.6</td>
      <td>7</td>
      <td>CORRECT</td>
      <td>58,290</td>
      <td>96.8</td>
      <td>8</td>
      <td>CORRECT</td>
      <td>184,977</td>
      <td>84.8</td>
      <td>11</td>
      <td>CORRECT</td>
      <td>247,900</td>
      <td>91.7</td>
      <td>12</td>
      <td>CORRECT</td>
      <td>79,620</td>
      <td>47.6</td>
      <td>7</td>
      <td>WRONG</td>
    </tr>
    <tr>
      <th>J · Upload attached file</th>
      <td>54,629</td>
      <td>52.4</td>
      <td><strong>2</strong></td>
      <td>CORRECT</td>
      <td>314,928</td>
      <td>164.1</td>
      <td>11</td>
      <td>WRONG</td>
      <td><strong>13,597</strong></td>
      <td><strong>37.0</strong></td>
      <td><strong>2</strong></td>
      <td>CORRECT</td>
      <td>365,403</td>
      <td>374.7</td>
      <td>79</td>
      <td>WRONG</td>
      <td>305,518</td>
      <td>135.3</td>
      <td>17</td>
      <td>CORRECT</td>
      <td>292,130</td>
      <td>128.2</td>
      <td>17</td>
      <td>CORRECT</td>
      <td>122,870</td>
      <td>91.9</td>
      <td>10</td>
      <td>CORRECT</td>
    </tr>
    <tr>
      <th>K · Read linked PDF</th>
      <td>85,525</td>
      <td><strong>42.5</strong></td>
      <td><strong>3</strong></td>
      <td>CORRECT</td>
      <td>336,190</td>
      <td>139.5</td>
      <td>11</td>
      <td>WRONG</td>
      <td><strong>23,380</strong></td>
      <td>50.8</td>
      <td><strong>3</strong></td>
      <td>CORRECT</td>
      <td>—</td>
      <td>480.0</td>
      <td>33</td>
      <td>WRONG</td>
      <td>316,440</td>
      <td>110.4</td>
      <td>16</td>
      <td>CORRECT</td>
      <td>291,413</td>
      <td>117.5</td>
      <td>17</td>
      <td>CORRECT</td>
      <td>318,551</td>
      <td>135.8</td>
      <td>22</td>
      <td>CORRECT</td>
    </tr>
    <tr>
      <th>L · Download file and exact bytes</th>
      <td><strong>89,295</strong></td>
      <td><strong>54.8</strong></td>
      <td><strong>3</strong></td>
      <td>CORRECT</td>
      <td>523,273</td>
      <td>157.4</td>
      <td>11</td>
      <td>WRONG</td>
      <td>341,051</td>
      <td>434.7</td>
      <td>27</td>
      <td>WRONG</td>
      <td>337,609</td>
      <td>214.6</td>
      <td>40</td>
      <td>WRONG</td>
      <td>—</td>
      <td>480.0</td>
      <td>24</td>
      <td>WRONG</td>
      <td>202,815</td>
      <td>101.0</td>
      <td>10</td>
      <td>CORRECT</td>
      <td>209,303</td>
      <td>105.4</td>
      <td>17</td>
      <td>CORRECT</td>
    </tr>
    <tr>
      <th>X · Delete Bob’s invoice in a changing inbox</th>
      <td>52,599</td>
      <td><strong>16.1</strong></td>
      <td><strong>2</strong></td>
      <td>CORRECT</td>
      <td>286,297</td>
      <td>84.3</td>
      <td>11</td>
      <td>WRONG</td>
      <td>19,189</td>
      <td>32.4</td>
      <td>2</td>
      <td>WRONG</td>
      <td><strong>17,813</strong></td>
      <td>23.6</td>
      <td>6</td>
      <td>CORRECT</td>
      <td>322,156</td>
      <td>127.1</td>
      <td>17</td>
      <td>WRONG</td>
      <td>141,931</td>
      <td>185.5</td>
      <td>10</td>
      <td>WRONG</td>
      <td>81,835</td>
      <td>34.7</td>
      <td>7</td>
      <td>CORRECT</td>
    </tr>
    <tr>
      <th>Y · Open Winter tyres in a rotating banner</th>
      <td>52,596</td>
      <td><strong>18.3</strong></td>
      <td><strong>2</strong></td>
      <td>CORRECT</td>
      <td>283,007</td>
      <td>114.4</td>
      <td>11</td>
      <td>WRONG</td>
      <td><strong>18,860</strong></td>
      <td>33.8</td>
      <td>3</td>
      <td>CORRECT</td>
      <td>19,407</td>
      <td>26.6</td>
      <td>7</td>
      <td>WRONG</td>
      <td>232,114</td>
      <td>91.7</td>
      <td>14</td>
      <td>WRONG</td>
      <td>101,304</td>
      <td>57.7</td>
      <td>8</td>
      <td>CORRECT</td>
      <td>155,332</td>
      <td>90.7</td>
      <td>13</td>
      <td>CORRECT</td>
    </tr>
  </tbody>
</table>

### R2

<table>
  <thead>
    <tr>
      <th rowspan="2">Task</th>
      <th colspan="4">Recued + Bridge</th>
      <th colspan="4">Recued + Playwright MCP</th>
      <th colspan="4">browser-use</th>
      <th colspan="4">Stagehand</th>
      <th colspan="4">OpenClaw + browser-use</th>
      <th colspan="4">OpenClaw + built-in browser</th>
      <th colspan="4">Hermes Agent</th>
    </tr>
    <tr>
      <th>Tokens</th>
      <th>Seconds</th>
      <th>AI rounds</th>
      <th>Correct / wrong</th>
      <th>Tokens</th>
      <th>Seconds</th>
      <th>AI rounds</th>
      <th>Correct / wrong</th>
      <th>Tokens</th>
      <th>Seconds</th>
      <th>AI rounds</th>
      <th>Correct / wrong</th>
      <th>Tokens</th>
      <th>Seconds</th>
      <th>AI rounds</th>
      <th>Correct / wrong</th>
      <th>Tokens</th>
      <th>Seconds</th>
      <th>AI rounds</th>
      <th>Correct / wrong</th>
      <th>Tokens</th>
      <th>Seconds</th>
      <th>AI rounds</th>
      <th>Correct / wrong</th>
      <th>Tokens</th>
      <th>Seconds</th>
      <th>AI rounds</th>
      <th>Correct / wrong</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>A · Compare programming languages</th>
      <td><strong>41,930</strong></td>
      <td><strong>34.7</strong></td>
      <td><strong>1</strong></td>
      <td>CORRECT</td>
      <td>1,541,206</td>
      <td>164.2</td>
      <td>8</td>
      <td>CORRECT</td>
      <td>47,685</td>
      <td>76.8</td>
      <td>3</td>
      <td>CORRECT</td>
      <td>546,375</td>
      <td>78.6</td>
      <td>8</td>
      <td>CORRECT</td>
      <td>262,143</td>
      <td>186.0</td>
      <td>17</td>
      <td>CORRECT</td>
      <td>464,778</td>
      <td>250.9</td>
      <td>16</td>
      <td>CORRECT</td>
      <td>170,852</td>
      <td>104.3</td>
      <td>13</td>
      <td>CORRECT</td>
    </tr>
    <tr>
      <th>B · Hacker News top story</th>
      <td>29,003</td>
      <td><strong>14.5</strong></td>
      <td><strong>1</strong></td>
      <td>CORRECT</td>
      <td>88,375</td>
      <td>34.4</td>
      <td>3</td>
      <td>CORRECT</td>
      <td><strong>14,158</strong></td>
      <td>24.5</td>
      <td><strong>1</strong></td>
      <td>CORRECT</td>
      <td>32,749</td>
      <td>40.3</td>
      <td>4</td>
      <td>WRONG</td>
      <td>83,086</td>
      <td>41.7</td>
      <td>6</td>
      <td>WRONG</td>
      <td>34,768</td>
      <td>18.8</td>
      <td>3</td>
      <td>CORRECT</td>
      <td>32,475</td>
      <td>20.5</td>
      <td>3</td>
      <td>WRONG</td>
    </tr>
    <tr>
      <th>C · Wikipedia image caption</th>
      <td>125,537</td>
      <td><strong>44.8</strong></td>
      <td><strong>4</strong></td>
      <td>CORRECT</td>
      <td>680,338</td>
      <td>108.7</td>
      <td>11</td>
      <td>WRONG</td>
      <td><strong>69,484</strong></td>
      <td>60.4</td>
      <td><strong>4</strong></td>
      <td>CORRECT</td>
      <td>260,453</td>
      <td>61.8</td>
      <td>9</td>
      <td>CORRECT</td>
      <td>204,045</td>
      <td>107.3</td>
      <td>12</td>
      <td>CORRECT</td>
      <td>100,972</td>
      <td>104.9</td>
      <td>7</td>
      <td>CORRECT</td>
      <td>101,685</td>
      <td>76.9</td>
      <td>8</td>
      <td>CORRECT</td>
    </tr>
    <tr>
      <th>D · Last See also entry</th>
      <td><strong>61,301</strong></td>
      <td><strong>21.7</strong></td>
      <td><strong>2</strong></td>
      <td>CORRECT</td>
      <td>191,366</td>
      <td>38.8</td>
      <td>3</td>
      <td>CORRECT</td>
      <td>75,870</td>
      <td>80.3</td>
      <td>6</td>
      <td>CORRECT</td>
      <td>179,761</td>
      <td>33.6</td>
      <td>4</td>
      <td>CORRECT</td>
      <td>445,489</td>
      <td>223.6</td>
      <td>23</td>
      <td>CORRECT</td>
      <td>322,944</td>
      <td>111.7</td>
      <td>14</td>
      <td>CORRECT</td>
      <td>144,227</td>
      <td>77.3</td>
      <td>11</td>
      <td>CORRECT</td>
    </tr>
    <tr>
      <th>E · Three-sentence work summary</th>
      <td>64,424</td>
      <td><strong>28.1</strong></td>
      <td><strong>2</strong></td>
      <td>CORRECT</td>
      <td>191,676</td>
      <td>39.5</td>
      <td>3</td>
      <td>CORRECT</td>
      <td><strong>33,462</strong></td>
      <td>44.9</td>
      <td>3</td>
      <td>CORRECT</td>
      <td>269,792</td>
      <td>36.5</td>
      <td>5</td>
      <td>CORRECT</td>
      <td>366,591</td>
      <td>147.1</td>
      <td>19</td>
      <td>CORRECT</td>
      <td>743,608</td>
      <td>215.2</td>
      <td>22</td>
      <td>CORRECT</td>
      <td>184,529</td>
      <td>106.8</td>
      <td>14</td>
      <td>CORRECT</td>
    </tr>
    <tr>
      <th>F · Submit pizza form</th>
      <td>109,105</td>
      <td><strong>45.7</strong></td>
      <td>4</td>
      <td>CORRECT</td>
      <td>334,074</td>
      <td>280.9</td>
      <td>11</td>
      <td>WRONG</td>
      <td><strong>21,350</strong></td>
      <td>49.1</td>
      <td><strong>3</strong></td>
      <td>CORRECT</td>
      <td>75,972</td>
      <td>146.5</td>
      <td>23</td>
      <td>CORRECT</td>
      <td>105,022</td>
      <td>60.4</td>
      <td>8</td>
      <td>CORRECT</td>
      <td>315,225</td>
      <td>112.8</td>
      <td>19</td>
      <td>CORRECT</td>
      <td>128,355</td>
      <td>125.6</td>
      <td>10</td>
      <td>CORRECT</td>
    </tr>
    <tr>
      <th>G · Count quotes across pages</th>
      <td>56,997</td>
      <td><strong>48.5</strong></td>
      <td><strong>2</strong></td>
      <td>CORRECT</td>
      <td>334,059</td>
      <td>153.5</td>
      <td>11</td>
      <td>WRONG</td>
      <td>56,625</td>
      <td>99.6</td>
      <td>7</td>
      <td>CORRECT</td>
      <td><strong>55,847</strong></td>
      <td>66.0</td>
      <td>11</td>
      <td>CORRECT</td>
      <td>248,625</td>
      <td>105.0</td>
      <td>14</td>
      <td>CORRECT</td>
      <td>103,215</td>
      <td>57.0</td>
      <td>7</td>
      <td>CORRECT</td>
      <td>71,356</td>
      <td>53.4</td>
      <td>6</td>
      <td>CORRECT</td>
    </tr>
    <tr>
      <th>H · Read delayed quotes</th>
      <td>53,103</td>
      <td>31.8</td>
      <td><strong>2</strong></td>
      <td>CORRECT</td>
      <td>74,410</td>
      <td>39.5</td>
      <td>3</td>
      <td>CORRECT</td>
      <td>34,807</td>
      <td>70.9</td>
      <td>5</td>
      <td>CORRECT</td>
      <td><strong>23,689</strong></td>
      <td>45.9</td>
      <td>6</td>
      <td>CORRECT</td>
      <td>119,056</td>
      <td>61.2</td>
      <td>8</td>
      <td>CORRECT</td>
      <td>30,869</td>
      <td><strong>28.3</strong></td>
      <td>3</td>
      <td>CORRECT</td>
      <td>34,826</td>
      <td>39.6</td>
      <td>3</td>
      <td>CORRECT</td>
    </tr>
    <tr>
      <th>I · Cheapest Travel book</th>
      <td><strong>57,538</strong></td>
      <td><strong>30.6</strong></td>
      <td><strong>2</strong></td>
      <td>CORRECT</td>
      <td>193,703</td>
      <td>61.7</td>
      <td>6</td>
      <td>CORRECT</td>
      <td>109,615</td>
      <td>156.1</td>
      <td>7</td>
      <td>CORRECT</td>
      <td>58,398</td>
      <td>49.2</td>
      <td>8</td>
      <td>CORRECT</td>
      <td>177,147</td>
      <td>70.9</td>
      <td>11</td>
      <td>CORRECT</td>
      <td>308,832</td>
      <td>115.9</td>
      <td>14</td>
      <td>CORRECT</td>
      <td>105,722</td>
      <td>64.4</td>
      <td>9</td>
      <td>CORRECT</td>
    </tr>
    <tr>
      <th>J · Upload attached file</th>
      <td>83,627</td>
      <td>61.0</td>
      <td>3</td>
      <td>CORRECT</td>
      <td>299,818</td>
      <td>192.4</td>
      <td>11</td>
      <td>WRONG</td>
      <td><strong>13,719</strong></td>
      <td><strong>35.7</strong></td>
      <td><strong>2</strong></td>
      <td>CORRECT</td>
      <td>306,806</td>
      <td>273.4</td>
      <td>62</td>
      <td>WRONG</td>
      <td>173,121</td>
      <td>111.4</td>
      <td>12</td>
      <td>CORRECT</td>
      <td>1,533,074</td>
      <td>480.0</td>
      <td>28</td>
      <td>WRONG</td>
      <td>843,192</td>
      <td>298.2</td>
      <td>48</td>
      <td>CORRECT</td>
    </tr>
    <tr>
      <th>K · Read linked PDF</th>
      <td>115,236</td>
      <td><strong>40.3</strong></td>
      <td>4</td>
      <td>CORRECT</td>
      <td>329,349</td>
      <td>150.3</td>
      <td>11</td>
      <td>WRONG</td>
      <td><strong>22,190</strong></td>
      <td>40.7</td>
      <td><strong>3</strong></td>
      <td>CORRECT</td>
      <td>220,559</td>
      <td>151.6</td>
      <td>38</td>
      <td>WRONG</td>
      <td>283,013</td>
      <td>116.0</td>
      <td>17</td>
      <td>CORRECT</td>
      <td>262,044</td>
      <td>119.8</td>
      <td>16</td>
      <td>CORRECT</td>
      <td>234,332</td>
      <td>91.6</td>
      <td>18</td>
      <td>CORRECT</td>
    </tr>
    <tr>
      <th>L · Download file and exact bytes</th>
      <td><strong>89,089</strong></td>
      <td><strong>48.5</strong></td>
      <td><strong>3</strong></td>
      <td>CORRECT</td>
      <td>494,664</td>
      <td>199.1</td>
      <td>11</td>
      <td>WRONG</td>
      <td>382,513</td>
      <td>471.6</td>
      <td>27</td>
      <td>WRONG</td>
      <td>302,557</td>
      <td>171.8</td>
      <td>35</td>
      <td>WRONG</td>
      <td>—</td>
      <td>480.0</td>
      <td>38</td>
      <td>WRONG</td>
      <td>—</td>
      <td>348.3</td>
      <td>40</td>
      <td>WRONG</td>
      <td>142,673</td>
      <td>73.0</td>
      <td>12</td>
      <td>CORRECT</td>
    </tr>
    <tr>
      <th>X · Delete Bob’s invoice in a changing inbox</th>
      <td><strong>79,902</strong></td>
      <td><strong>31.5</strong></td>
      <td><strong>3</strong></td>
      <td>CORRECT</td>
      <td>286,488</td>
      <td>84.7</td>
      <td>11</td>
      <td>WRONG</td>
      <td>220,193</td>
      <td>475.2</td>
      <td>27</td>
      <td>WRONG</td>
      <td>77,302</td>
      <td>146.0</td>
      <td>19</td>
      <td>WRONG</td>
      <td>303,660</td>
      <td>106.0</td>
      <td>16</td>
      <td>CORRECT</td>
      <td>462,101</td>
      <td>144.9</td>
      <td>22</td>
      <td>WRONG</td>
      <td>242,800</td>
      <td>89.4</td>
      <td>19</td>
      <td>WRONG</td>
    </tr>
    <tr>
      <th>Y · Open Winter tyres in a rotating banner</th>
      <td><strong>52,453</strong></td>
      <td><strong>18.2</strong></td>
      <td><strong>2</strong></td>
      <td>CORRECT</td>
      <td>283,851</td>
      <td>94.8</td>
      <td>11</td>
      <td>WRONG</td>
      <td>112,312</td>
      <td>181.9</td>
      <td>16</td>
      <td>CORRECT</td>
      <td>36,505</td>
      <td>42.9</td>
      <td>12</td>
      <td>WRONG</td>
      <td>173,858</td>
      <td>52.1</td>
      <td>11</td>
      <td>CORRECT</td>
      <td>101,058</td>
      <td>39.2</td>
      <td>8</td>
      <td>CORRECT</td>
      <td>534,313</td>
      <td>184.2</td>
      <td>35</td>
      <td>CORRECT</td>
    </tr>
  </tbody>
</table>

## Failure details

The following table covers all **44 current wrong repetitions**, grouped by task
and arm. A correct code or completion claim does not override a wrong or extra
action in the fixture’s private record. Time and step budget exhaustion remain
final results; they are not treated as transient provider failures.

| Task | Arm | Wrong repetitions | Failure type | Detailed reason and evidence | Retry decision |
| --- | --- | --- | --- | --- | --- |
| A | Recued + Playwright MCP | R1 | Native tool budget | R1 exhausted the release’s ten charged tool rounds without completing the table of language years and designers. R2 was correct. | Final wrong result; no technical retry. |
| B | Stagehand | R2 | Live-page points mismatch | R2 returned the correct title and 338 points; the checker read 340 points afterward. This failed live-page check may reflect page drift between the answer and verification. R1 was correct. | Final wrong result; no technical retry. |
| B | OpenClaw + browser-use | R2 | Live-page points mismatch | R2 returned the correct top-story title and 238 points; the checker read 242 points afterward. This failed live-page check may reflect page drift between the answer and verification. R1 was correct. | Final wrong result; no technical retry. |
| B | Hermes Agent | R2 | Live-page points mismatch | R2 returned the correct top-story title, AlphaProof Code, with 165 points; the checker read 170 points afterward. The failed live-page check may reflect page drift between answer and verification. R1 was correct. | Final checker mismatch; no provider failure or technical retry. |
| C | Recued + Playwright MCP | R1, R2 | Native tool budget | Both runs exhausted the tool budget without returning the caption. The live checker read “Daguerreotype of Lovelace (c. 1843)”; the required caption text and year were absent. | Final wrong result; no technical retry. |
| C | Hermes Agent | R1 | Alt text substituted for caption | R1 quoted the image alt text, Augusta Ada King, Countess of Lovelace, daguerrotype portrait circa 1843, and called it the caption. The visible caption was Daguerreotype of Lovelace (c. 1843). The spelling and source differ; the literal caption check failed. R2 was correct. | Final answer mismatch; no technical retry. |
| F | Recued + Playwright MCP | R1, R2 | Native tool budget | Both runs exhausted the tool budget without returning the submitted form’s named fields and values: customer, phone, email, size, toppings, delivery time and instructions. | Final wrong result; no technical retry. |
| G | Recued + Playwright MCP | R1, R2 | Native tool budget | R1 reported five love-tagged quotes from the first two pages, then exhausted the budget before finishing page three; six were required, including Neruda. R2 exhausted the budget without a final count or author list. | Final wrong result; no technical retry. |
| I | Hermes Agent | R1 | Truncated book title | R1 identified the correct cheapest price, £23.21, but returned the listing text The Road to Little ... instead of the complete title containing Little Dribbling. Its browser extraction used link textContent rather than the full title. R2 returned the required title and price. | Final answer mismatch; no technical retry. |
| J | Recued + Playwright MCP | R1, R2 | Native tool budget | Both runs exhausted the tool budget. No successful upload action was recorded, and neither answer supplied the upload-success heading and uploaded filename. | Final wrong result; no technical retry. |
| J | Stagehand | R1, R2 | Upload incomplete | Both runs recorded no successful upload and ended with “agent did not finish”. The agent reported unsupported file-input actions; it could not return the required success heading and uploaded filename. This describes the native agent in these runs. | Final wrong result; no technical retry. |
| J | OpenClaw + built-in browser | R2 | Native time budget / upload not completed | R2 reached the 480-second native deadline after 28 calls. It tried several upload argument forms and element references, copied the attachment into an inbound-media directory, and encountered repeated browser upload waits/timeouts. The checker observed no selected attachment and no multipart submission. It also attempted to construct a file from test content, rather than the supplied attachment; that did not produce a confirmed upload. R1 selected the exact attachment and submitted it successfully. | Native time budget exhausted; final wrong result. |
| K | Recued + Playwright MCP | R1, R2 | Native tool budget | Both runs exhausted the tool budget without quoting the required sentence above the PDF image: “The following image shows a happy looking dog lying in some grass:”. | Final wrong result; no technical retry. |
| K | Stagehand | R1, R2 | Time budget / PDF read incomplete | R1 reached the time limit and was aborted without an answer. R2 reached the PDF but the agent reported that it could not extract text through the embedded viewer; it did not quote the required sentence and did not finish. | Final wrong result; no technical retry. |
| L | Recued + Playwright MCP | R1, R2 | Native tool budget | Both runs exhausted the tool budget. Neither produced evidence of the required 12,499,601-byte saved file or a final filename and exact-byte-count answer. | Final wrong result; no technical retry. |
| L | browser-use | R1, R2 | Exact byte count unavailable | Both runs saved the correct 12,499,601-byte file but could not report that exact size. Browser-context attempts to use file-system operations failed; the answers gave 11.9 MB or explicitly said the exact count was unavailable. The download itself succeeded. | Final wrong result; no technical retry. |
| L | Stagehand | R1, R2 | Exact byte count unavailable | Both runs saved the expected file, but the agent said it could not determine the exact byte count through its available browser tools. Both ended with “agent did not finish” and omitted 12,499,601 from the answer. | Final wrong result; no technical retry. |
| L | OpenClaw + browser-use | R1, R2 | Time budget / incomplete browser download | Both runs reached the 480-second native limit without a completed ZIP or the requested final filename and exact-byte-count answer. R1 started two downloads; both remained partial at 3,947,481 bytes each. R2's partial file reached 5,732,231 bytes, below the required 12,499,601. The model repeatedly waited for progress. Transfers were observably slow, so this result does not isolate model capability. | Native time budget exhausted; final wrong results. Slow-transfer evidence retained. |
| L | OpenClaw + built-in browser | R2 (attempt 2) | Wrong download method / incomplete browser download | R2’s retry returned the requested filename and exact byte count, but completed the ZIP with curl while its browser download remained pending. The full shell-written file does not satisfy the required browser download. This attempt also recorded a provider ECONNRESET; the raw reset remains, and incomplete native token totals stay unknown. The initial R2 provider connection-timeout attempt is retained in retry history. R1’s actual native browser artifact was verified and its collector false failure corrected. | Final wrong method; no further retry. Provider evidence remains visible. |
| X | Recued + Playwright MCP | R1, R2 | Native tool budget | Both runs exhausted the tool budget. The fixture recorded no deletion; it required deletion of Bob’s Invoice 1043 only. R1’s answer described element references changing between snapshots and clicks. | Final wrong result; no technical retry. |
| X | browser-use | R1, R2 | Wrong and extra deletions | R1 claimed Bob’s email was deleted, but the fixture recorded deletion of Ivy’s newsletter. R2 eventually deleted Bob, but also deleted mail from Jay, Ivy, Ada, Kim, Lou, Ned and Quin, then hit its time limit. Those extra actions fail the task. | Final wrong result; no technical retry. |
| X | Stagehand | R2 | Extra deletions | R2 deleted Ada’s and Jay’s mail before deleting Bob’s invoice, then claimed completion. The task permits only the target deletion, so that run is wrong. R1 was correct. | Final wrong result; no technical retry. |
| X | OpenClaw + browser-use | R1 | False completion / no deletion recorded | R1 attempted clicks using accessibility nodes and coordinates, then inferred success when Bob’s item disappeared from a later accessibility snapshot. It claimed deletion, but the fixture recorded no deletion. R2 matched Bob and invoice 1043 in the rendered DOM and recorded only the intended deletion. | Final wrong result; no technical retry. |
| X | OpenClaw + built-in browser | R1, R2 | Wrong and extra deletions | R1 deleted Tia’s School trip form before Bob’s Invoice 1043 for October. R2 deleted Kim’s meeting notice, Ivy’s newsletter, Ada’s lunch message and Jay’s receipt before deleting Bob’s invoice. Both eventually reached the requested invoice, but the fixture recorded the unrelated deletions as well. | Final wrong actions; no technical retry. |
| X | Hermes Agent | R2 | Wrong and extra deletion | R2 deleted Jay’s receipt from the cafe before deleting Bob’s Invoice 1043 for October. The fixture recorded both deletions. Reaching Bob’s invoice afterward does not undo the extra deletion. R1 recorded only the requested deletion. | Final wrong action; no technical retry. |
| Y | Recued + Playwright MCP | R1, R2 (attempt 2) | Native tool budget | R1 and the R2 retry exhausted the tool budget. The fixture recorded no opened offer, and neither answer returned WT-4417. R2’s original provider transport failure was retried first; this final retry is a wrong result. | Technical retry completed; final wrong result. |
| Y | Stagehand | R1, R2 | Wrong and extra offer opens | R1 opened Summer sale and returned SS-2981 instead of WT-4417. R2 opened Summer sale before Winter tyres; it returned the right code but the extra opened offer makes that run wrong. | Final wrong result; no technical retry. |
| Y | OpenClaw + browser-use | R1 | Wrong and extra offer opens | R1 opened Summer sale before Winter tyres. It eventually returned WT-4417, but the extra offer open fails the task. R2 opened only Winter tyres and returned the correct code. | Final wrong result; no technical retry. |

Recued’s Browser Toolkit was developed against these tasks, so these results do
not establish performance on unseen tasks. Round definitions and native budgets
differ between frameworks; they are described below. The MCP rows describe the
frozen Recued/MCP integration, including its known cross-session snapshot-reference
limitation, rather than standalone Playwright MCP capability.

The [original 112-attempt report](results/showcase/2026-11-09-qwen3.7-plus/report.md)
retains the original scores, and the original records are preserved. The
[retry receipt](qualification/retry-receipt.json) records the two additional
attempts. The original four harnesses completed live tasks from a clean clone in an isolated
Linux container. The added OpenClaw and Hermes arms are qualified on macOS arm64; their Linux
setup and live qualification remain pending. See
[qualification evidence](qualification/STATUS.md).
The stopped development batch is retained separately and excluded here. The
repository remains local; the GitHub name will be chosen later. Nothing is pushed.

## Setup

Use Node 24.16+ in the 24.x line, or Node 26.1+ (qualified locally with 24.19.0), Python 3.11.5+, curl, unzip,
minisign and Poppler's `pdftotext`. On macOS, `brew install minisign poppler`; on
Debian/Ubuntu, install `minisign poppler-utils python3-venv unzip curl` and the
[Playwright system dependencies](https://playwright.dev/docs/browsers#install-system-dependencies).

```sh
./setup
```

Setup downloads Recued 26.11.9 and its SQLite sidecar into `.bench/`, verifies the
pinned signed manifest with `minisign -V`, checks both artifact SHA-256 values, and
verifies both artifact signatures. The public key is the release installer's key.
The public manifest and signature are checked in to keep this release selectable
after the live feed advances; the binaries remain at their immutable sequence-56
artifact URLs. No Recued service, startup item or system-wide installation is made.

Setup verifies and unpacks the checked-in Bridge ZIP, creates a local Python
virtualenv, installs the pinned Python/npm packages, and downloads Chromium into
`.bench/browsers/`. `BENCH_PYTHON` can select a Python executable.
Debian 12's stock Python 3.11.2 is too old; the Docker example uses Debian 13.
OpenClaw 2026.11.2 has its own locked npm runtime under
`harness/openclaw/runtime/`, keeping its dependencies separate from the other arms.
Hermes uses a separate Python 3.14.6 environment in `.bench/hermes-venv/`.
Setup verifies the v0.23.1 source archive, installs its upstream frozen `uv.lock`
with uv 0.13.7 and performs its supported editable installation. Its dependencies
require Python 3.14; setup downloads an owned Python if that exact version is
unavailable. `BENCH_HERMES_PYTHON` can select an existing 3.14.6 executable.

Set `BENCH_API_KEY` and `BENCH_BASE_URL` in your environment. The endpoint is an
OpenAI-compatible base URL ending in `/v1`, such as the appropriate DashScope
compatible-mode endpoint for your region. Credentials are never configuration-file
fields and the runner never saves the provider key.

## Run

```sh
./run
./run --tasks X,Y --runs 1 --arms recued-bridge,browser-use
./run --model your-model --endpoint https://your-provider.example/v1 --thinking off
```

Copy `bench.config.example.json` to `bench.config.json` to change the shared model,
settings, environment-variable names, arms, tasks, repetitions and limits. Runtime
flags override the configuration for every selected arm. `./run --help` lists flags.

By default each task runs twice in each configured arm, back to back. The first arm rotates
with each task and repeat. Every invocation of a harness handles one task in a new
process; a memory gate runs before it. A fresh Recued realm and browser profile are
created for each Recued run, enrolled through the released HTTP pairing flow and
removed afterward. No existing realm, recovery key, identity or browser profile is
copied. Uploads use a synthetic file shipped with task J.

Each output directory contains `records.json`, `report.md` and `results.json`. The report includes
per-task and overall right/total counts, successful-answer median seconds and rounds,
original-attempt median tokens, and approval counts. Failed attempts stay in the
original summary and retain their reasons. Successful-time medians describe the successes each arm
achieved; different success sets do not establish a paired speed ranking. You can
regenerate a report with:

```sh
npm run report -- results/your-run/records.json results/your-run/report.md
```

The report also shows every task, arm and repetition with its current outcome,
tokens, answer seconds, AI rounds and failed reason. `results.json` exports the
same metric vectors in `current` and every physical attempt in `attempts`:
`{tokens, seconds, rounds, failed_reason}`, with task, arm, run, attempt, status
and retry eligibility. Missing counters and clocks stay `null`. Cached tokens
are included in input tokens. New attempts additionally record `wall_seconds`,
including startup and cleanup before the out-of-band page checker.

## Run one arm and combine reports

An arm can run independently. This example adds Hermes to the existing six-arm
results:

```sh
./run --arms hermes --out results/hermes
npm run report:merge -- --out results/combined \
  results/showcase/2026-11-10-qwen3.7-plus-six-arms/records.json \
  results/hermes/records.json
```

For OpenClaw, select `--arms openclaw-browser-use` or `--arms openclaw-browser`.
The example configuration enables all seven arms; `--arms` selects a subset.
If a batch needs technical retries, merge its latest retry dataset.

Merging is offline and needs no model credentials. It requires matching model,
thinking, sampling, output limits, task list, repetitions and measurement budgets.
Inputs are never rewritten. The combined output retains every attempt, retry
link and cost, plus each source dataset's hash and full metadata. Duplicate
task/arm/repetition pairs across inputs are rejected; use each batch's latest
retry dataset. Batches run later retain their own dates and versions and are
identified as separate invocations rather than an interleaved comparison.
OpenClaw's effective context-window setting is checked between OpenClaw batches
and carried into the combined configuration; older arms need no extra setting.

## Retry technical failures

Preview the eligible attempts without credentials or starting a browser:

```sh
./run --retry-failed results/showcase/2026-11-09-qwen3.7-plus/records.json --dry-run
./run --retry-failed results/showcase/2026-11-09-qwen3.7-plus/records.json --out results/retry
```

Each invocation makes **one additional attempt** for each latest retryable failure,
using the source model settings, task words, budgets and framework versions. Keep
the same provider endpoint. Local configuration and measurement overrides are
rejected for retries. Every retry starts a fresh process, realm and browser.
The new output copies every source record unchanged, then appends linked attempts;
the input file is never rewritten. To retry another technical failure, use the
new output's `records.json` as the next input.

Retryable failures include recorded provider transport errors/timeouts,
HTTP 408/429/500/502/503/504, explicit network failures and an unavailable page
checker. Wrong answers, wrong or extra actions, native time/step budget exhaustion,
and unsupported browser operations remain **WRONG**. Authentication, malformed
requests and unclassified errors require investigation and are not automatically
retried. A retry that returns a wrong result stops; the script never retries it
until it happens to become right.
An explicit wrong action remains final when a provider error also occurred.
For example, claiming a completed ZIP from a shell client while the required
browser download is incomplete is a wrong method; the provider error is still
retained in the record.

The report keeps original scores, current scores and retry history separate.
The current per-run row shows the latest attempt's tokens, seconds, AI rounds and
failed reason. Retry history retains every earlier attempt and its consumed
resources. Retrying does not add a new scheduled run to the accuracy denominator.

## Arms and versions

| Arm | What answers | Browser |
| --- | --- | --- |
| Recued + Bridge | Released Recued 26.11.9 chat and Browser Toolkit | Fresh Chromium with Bridge 0.0.8 |
| Recued + Playwright MCP | The same Recued release and model, with a generated MCP pack | Fresh Chromium without Bridge |
| browser-use | Native browser-use 0.13.14 agent | Fresh Chromium |
| Stagehand | Native Stagehand 3.7.3 DOM agent | Local Chromium |
| OpenClaw + browser-use | OpenClaw 2026.11.2 embedded agent using browser-use 0.13.14's published CLI and skill | Fresh Chromium through browser-harness 0.1.13 |
| OpenClaw + built-in browser | The same OpenClaw agent with its native browser tool | Fresh Chromium through its native CDP profile |
| Hermes Agent | Native Hermes v0.23.1 AIAgent | Fresh local Chromium through its default browser_exec and browser-harness 0.1.13 |

The latest versions checked against the primary package registries on 2026-11-09
were browser-use **0.13.14**, Playwright MCP **0.0.85**, and Stagehand **4.4.0**.
Stagehand 4 removed the native `agent()` API requested here, so this benchmark
pins **3.7.3**, the newest supported `v3-latest` native-agent release.
Their resolved npm/Python dependencies are pinned in the lockfiles. Frameworks are
installed, not vendored. The harness and fixtures are AGPL-3.0; browser-use,
Stagehand, OpenClaw and Hermes are MIT, and Playwright MCP is Apache-2.0.

OpenClaw 2026.11.2 was checked against npm on 2026-11-10. Its
[native browser](https://docs.openclaw.ai/tools/browser) and
[browser-use's external-agent CLI](https://browser-use.com/coding-agents) are
distinct integrations. The CLI controls the browser directly; this arm does not
delegate to another browser-use model loop or to Browser Use Cloud.

Hermes [v0.23.1](https://github.com/NousResearch/hermes-agent/releases/tag/v0.23.1)
was checked on 2026-11-10. Its [default browser](https://hermes-agent.nousresearch.com/docs/user-guide/features/browser)
executes Python with pre-imported browser helpers, using the same browser-harness
engine as Browser Use CLI. This arm runs Hermes's native agent loop directly;
there is no second browser-use model agent. The source archive checksum and
Python runtime version are retained with every batch.

Chromium is pinned through Playwright **1.61.1** for all arms: browser-use stalled
before navigation with Chromium from Playwright 1.65.0, while the same standalone
navigation completed with 1.61.1. Playwright MCP keeps its own pinned SDK dependency.
The Bridge's [source and ZIP reproduction check](bridge/PROVENANCE.md) is separate
from that runtime browser choice.

## Measures and fairness

- All arms use the same model and requested settings, resolved once. An in-memory
  gateway enforces the model, temperature, frequency penalty, output limit and
  Qwen `enable_thinking` setting without changing prompts, tools or schemas. Recued
  also receives `RECUED_LLM_THINKING=off` for the default configuration.
- Every arm gets the same task words and addresses, with no task page open initially.
- Recued browser actions are allowed ahead for the conversation. Any remaining
  approval asks are answered immediately and counted. MCP tool permissions use the
  released owner's enrollment and grant APIs.
- Both Recued arms use the full catalog, configurable together with
  `--recued-catalog-mode`. The MCP arm's normal owner prompt adds the connector name:
  "Your browser tools use the enrolled Playwright MCP connection named playwright.
  Pass connection: playwright when calling those browser tools." Task words stay
  unchanged. The MCP stdio clients connect to one fresh runner-owned Chromium over
  its loopback CDP endpoint, keeping pages alive across Recued tool executions.
  This does not add a debugger permission to Browser Bridge.
  Snapshot references still fail across separate MCP client sessions in the
  frozen Recued release. Read-only browser calls work; ref-based clicks can fail.
  This is a limitation of this Recued/MCP integration, not standalone Playwright MCP.
- The released binary does not auto-install Browser Toolkit. The Bridge arm
  installs the pinned, published Browser Toolkit 4 through its normal owner RPC,
  retaining the `recued-core` publisher. The harness verifies the public pack and
  all 15 recipe files, then checks the installed versions and records their hashes.
  It refuses later catalog drift; see [catalog pins](harness/recued/catalog/README.md).
  Task K also installs the pinned PDFToText Pack 5 and its two recipes through
  that native installer in both Recued arms, enabling its local CLI operations.
- The HTTP Toolkit's `read-web-address`, `get-web-address` and `download-web-file`
  grants are revoked for both Recued arms. Browser-layer capabilities remain available.
- Tasks use public sites without sign-in. These fresh profiles do not measure the
  Bridge's ability to act in the user's existing signed-in Chrome.
- Recued's Browser Toolkit was developed and tuned against these tasks. These results
  do not establish performance on tasks it has not seen.
- browser-use runs with Python `-I`, vision and the judge disabled, telemetry and
  cloud sync off. Its blank browser starts before the clock, which ends at the
  last native step timestamp. Automatic initial navigation is included: its
  synthetic step-zero timestamp alone would incorrectly exclude that time. Rounds
  are history steps minus one; both raw steps and framework token usage are retained.
  This prescribed step measure can differ from raw provider requests when native
  extraction makes additional calls; gateway request counts remain separate evidence.
- Recued's answer clock uses `chat.token_streamed`; it never falls back to the stored
  message, whose closing brief can arrive later. Chat and recipe token usage come from
  the release's events and execution audit. Model failures and timeouts count wrong.
- Stagehand uses its native DOM agent locally, with experimental callbacks and
  abort support, screenshots and web search disabled. Its clock covers the agent
  call after initialization. A supported model middleware counts every native
  model invocation, including extraction and forced finalization. Tokens are
  summed from those native SDK usage records; Stagehand's aggregate metrics and
  agent-step callbacks are also retained. The aggregate metrics omit forced
  finalization, so step counts and aggregate tokens alone would undercount.
  Requested answers come from its native `execute({ output: schema })` result's
  `output.answer`; its `message` is an assessment of actions taken and is retained
  separately. No external agent loop or task-specific output instructions are added.
- The frozen Recued chat keeps its built-in budget of ten charged tool rounds,
  shared by both Recued arms. `--max-steps` controls browser-use and Stagehand;
  native discovery/recovery and initial calls can make provider counts differ
  from those iteration budgets.
- OpenClaw uses its published embedded agent and full native tool profile, with a
  fresh workspace and state for every attempt. In the browser-use arm, its native
  browser is disabled and the unmodified published browser-use skill and CLI are
  installed in that workspace. The alternative arm enables its native browser.
  Web fetch/search, messaging and subagent tools are disabled. Workspace instructions
  require browser navigation and forbid shell/script HTML fetches. Document
  extraction, including downloading a PDF located through the browser for local
  text extraction, remains available, as in Recued's document tools. Requested
  browser downloads require an observed browser download and the saved file.
  Upload evidence checks the page's selected file contents and a multipart request,
  since Chromium can omit file bytes from network-event bodies.
  Autonomous skill learning is off
  to prevent work after the answer or knowledge transfer between attempts.
  Native lifecycle timestamps run from agent preparation to the final assistant
  output, excluding Chromium and browser-use daemon startup. AI rounds count unique
  native model-call IDs, including helpers, and tokens sum their native usage.
  Cached input is counted once. The native ledger and separate gateway evidence
  are retained. Incomplete native accounting stays unknown. OpenClaw keeps its
  native loop with the same 480-second answer limit; `--max-steps` does not change
  it. Task-owned CLI resources still alive after its complete JSON reply are
  terminated during cleanup, without changing the answer clock. Native monetary
  cost placeholders are unpriced and are not used as spending measurements.
  The default Qwen model is registered with its documented
  [1,000,000-token context window](https://www.alibabacloud.com/help/en/model-studio/qwen3-7-plus).
  For another model, set `openclawContextWindow` in the configuration to its
  supported window; the fallback for unrecognized models is 262,144.
- Hermes uses its supported `AIAgent` API, native prompts and default CLI tools,
  with a fresh home, workspace and local browser for each attempt. Web fetch/search,
  vision, delegation, memory and scheduling toolsets are disabled. The same browser
  navigation and document-extraction rules used for OpenClaw apply. Skill-learning
  nudges, background memory review and title generation are off. No task-specific
  strategy is added. A passive plugin observes primary and auxiliary API attempts,
  including native retries. AI rounds count those physical attempts; tokens use
  their native canonical prompt and output counts, counting cached input once.
  Native canonical cache zeros cannot establish that a provider reported the
  counter, so the aggregate cached field stays unknown; the native ledger and
  independent gateway details retain the available evidence. The clock covers
  agent preparation through the final visible answer, excluding native browser
  and daemon startup and cleanup. Hermes retains its native loop with the shared
  answer deadline. The Qwen context window is 1,000,000; `hermesContextWindow`
  selects another model's window, with 262,144 as the unrecognized-model fallback.
- X and Y use one runner-owned changing site. Its private closure records deletions
  and opened offers; there is no HTTP read endpoint for that record. A plausible
  answer with a wrong or extra action fails. The record resets before each run.
- HN, the Wikipedia caption and the last See also entry are read after the answer by
  the same out-of-band checker for every arm. HN requires the current title and points;
  page changes can cause a false negative. Wikipedia search results are never an oracle.
- E retains the inherited name-based summary check; a faithful summary can omit those
  names and fail. Other answer-pattern checks do not replace a human semantic review.
  J also requires an upload action, and L a saved file of the exact expected size.
  K requires the complete requested PDF sentence, ignoring case and whitespace;
  the inherited two-keyword check would accept a paraphrase.

## Qualification limits

1. Stagehand uses the supported v3 native-agent line, rather than an external agent
   built around v4. See the
   [upstream templates' v4 note](https://github.com/browserbase/templates#model-gateway).
2. Browser Toolkit is installed from the released catalog before measuring; it
   is not claimed to be auto-installed in a fresh binary realm.
3. DashScope returns no `completion_tokens_details.reasoning_tokens` field for the
   tested thinking-off responses. The gateway records `null`, not an invented zero.
   The owner approved accepting completed successful calls that requested
   `enable_thinking:false`, returned no reasoning content, and reported no
   contradictory counter. In the original showcase the policy accepts 108 attempts; four with failed or
   incomplete calls remain unqualified. Every raw counter and `all_zero` stays
   `null`, and `counter_verified` stays `false`. `qualified` records this evidence
   policy separately from task accuracy. It does not claim a measured zero.
   The [provider API documentation](https://www.alibabacloud.com/help/en/model-studio/qwen-api-via-openai-chat-completions)
   makes token details optional and allows their absence when thinking is disabled.

The thinking-evidence classification was applied consistently after measurement,
following that approval. The [receipt](qualification/showcase-receipt.json) records
the original and final dataset hashes and a shared fingerprint of the unchanged
measurement fields. Answers, verdicts, clocks, rounds, tokens, raw calls, settings
and measured-source provenance were preserved. Future runs apply the same policy.

The [clean-clone Linux record](qualification/linux-output/receipt.json) describes
setup and all four native arms returning actual task-E answers. The
[Linux PDF check](qualification/linux-pdf/receipt.json) reran setup and all 15
focused tests before validating the catalog installer and PDF extraction.

OpenClaw's [development qualification](qualification/openclaw/development-receipt.json)
retains all five preliminary attempts, including checker and cleanup failures,
separately from showcase results. Its
[file-evidence checks](qualification/openclaw/file-evidence.json) exercise the
published browser-use CLI against a local fixture: correct and incorrect
attachments, submission, and an actual browser download. The expanded
[native file checks](qualification/openclaw/native-file-evidence.json) also run
OpenClaw's actual download-capture code against Chromium, including a successful
native save with an injected secondary-observer save failure. All six checks
pass without model calls. `node qualification/check-openclaw-files.mjs` reruns them.
Passive model accounting uses the published agent-event API and a diagnostic
observer pinned to the exact OpenClaw package version; it does not replace the
agent, prompts, tools or model responses.

The [OpenClaw cohort receipt](qualification/openclaw/cohort-receipt.json) records
the 28 scheduled runs, both successful technical retries, complete native usage
checks, and the unchanged hashes of all six original showcase files. The
[privacy receipt](qualification/openclaw/privacy-receipt.json) maps additional
path redactions to published hashes and verifies that measurements and verdicts
were preserved. The two download timeouts include
[observed partial-transfer sizes](qualification/openclaw/download-observations.json).
These slow transfers and the separate batch dates limit speed comparisons.

The [built-in-browser receipt](qualification/openclaw/native-cohort-receipt.json)
records its separate 28-run batch and one technical retry. The
[collector correction](qualification/openclaw/native-download-repair.json)
retains original and corrected evidence, artifact checksums, unchanged measurement
fingerprints and the final wrong-method classification. The built-in arm's
wrong results are one upload budget failure, two runs with extra deletions, and
the shell ZIP workaround. Earlier measurements and verdicts are unchanged.
The [final privacy audit](qualification/openclaw/truncated-path-redaction.json)
redacts truncated directory prefixes in three earlier showcase record files and
one development file. Twelve of the 15 earlier showcase files remain byte-identical;
the receipt verifies every record after the declared path-only changes.
The [final checks](qualification/openclaw/native-final-checks.json) record table,
source, CLI, privacy and cleanup verification.

Hermes’s [cohort receipt](qualification/hermes/cohort-receipt.json) records its
28 attempts and 361 native model calls from clean source, with native usage
matching the independent gateway for every attempt. Its
[five native file checks](qualification/hermes/file-evidence.json) include uploads
into pages loaded before observer attachment; the
[six shared file regression checks](qualification/hermes/shared-file-regression.json)
also pass without model calls. Run `node qualification/check-hermes-files.mjs`
and `node qualification/check-hermes-records.mjs results/hermes/records.json` to
repeat these checks. The [development receipt](qualification/hermes/development-receipt.json)
retains all four preliminary attempts separately, including the two invalid upload
verdicts that exposed the collector bugs. They are excluded from the showcase.
The [report checks](qualification/hermes/report-receipt.json) pass all **41 unit tests**,
and all **27 earlier showcase files** remain byte-identical.


## Reuse and license

The Recued and browser-use harnesses, tasks A–L and report calculations were adapted
from the existing browser-agent-bench without changing that repository. X/Y's fixture
comes from Recued's live-site drive. See [LICENSE](LICENSE) for AGPL-3.0 and
[Bridge provenance](bridge/PROVENANCE.md) for the checked-in extension.
