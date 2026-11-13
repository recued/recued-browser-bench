# Recued vs browser-use: browser agent benchmark

Seven agent stacks, the same **Qwen3.7-plus** model, fourteen browser tasks and two
repetitions per task. This first edition measures the released **Recued 26.11.9**
with **Bridge 0.0.8**. All **196 scheduled runs / 201 physical attempts** are retained.[^evidence]

**Machine:** MacBook Air, Apple M5, **24 GB RAM**. Browsers and agent harnesses ran
locally; model inference used the remote provider. The original four arms ran on
November 9, 2026 local time; OpenClaw and Hermes joined in separate November 10 batches.[^timing]

**Token context matters.** Standalone browser-use carries its browser-focused tools
and instructions, without a general agent’s broader tool catalog. Recued, OpenClaw
and Hermes also carry general agent prompts and tool definitions. These totals measure
each stack’s actual input plus output, including cached input once; they do not subtract
catalog overhead or isolate its contribution. A small browser task can therefore have
different fixed context costs across stacks.[^catalog]

## Recued against each arm

**Recued + Bridge: 100% correct (28/28).** Time, token and native-round Δs are
**median paired percentage differences** on the same task and repetition where
both arms were correct.[^paired] **Negative means Bridge uses less; positive means
Bridge uses more.** Correctness covers all 28 runs. The tasks were developed
against Recued; two repetitions describe this setup and its observed outcomes.[^scope]

| Compared with | Other arm correct | Bridge answer time Δ | Bridge tokens Δ | Native AI rounds Δ[^rounds] | Takeaway |
| --- | ---: | ---: | ---: | ---: | --- |
| Recued + Playwright MCP | 39.3% (11/28) | -48.2% | -68.0% | -66.7% | Bridge completed more tasks under the same Recued chat budget. The frozen MCP integration has a snapshot-reference limitation.[^mcp] |
| browser-use standalone | 85.7% (24/28) | -48.5% | +64.5% | -41.7% | Bridge was usually faster; browser-use used fewer tokens in 15/24 shared successes. Its browser-focused catalog is a different token baseline.[^catalog] |
| Stagehand | 64.3% (18/28) | -39.9% | -24.1% | -75.0% | Bridge completed more tasks and was faster in all shared successes. This compares Stagehand’s native v3 agent.[^versions] |
| OpenClaw + browser-use | 82.1% (23/28) | -61.5% | -69.5% | -81.8% | Both are general agents steering a browser layer. Bridge was faster in all shared successes and used fewer tokens in 22/23. |
| OpenClaw + built-in browser | 85.7% (24/28) | -59.3% | -56.0% | -75.0% | Bridge was faster and used fewer tokens in most shared successes. Separate cohort and download conditions qualify speed comparisons.[^timing] |
| Hermes Agent | 85.7% (24/28) | -59.8% | -55.6% | -80.9% | Bridge was faster in 23/24 shared successes and used fewer tokens in 20/24. Native round definitions differ.[^rounds] |

Three strict Hacker News points checks may reflect page drift after the answer;
their original wrong verdicts and the uncertainty remain visible.[^grading]

## Full results by round

R1 and R2 are the two recorded repetitions. Each arm has **tokens, seconds, AI
rounds, correct/wrong** for every task. **★ and a highlighted background mark the
lowest displayed values among correct answers in that row; every displayed tie
gets the same marker.**
Wrong results remain visible and do not win a metric. Missing counters stay —.
AI rounds use each framework’s native definition.[^rounds]

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
      <td><mark><strong>★ 41,175</strong></mark></td>
      <td><mark><strong>★ 24.4</strong></mark></td>
      <td><mark><strong>★ 1</strong></mark></td>
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
      <td><mark><strong>★ 29,039</strong></mark></td>
      <td><mark><strong>★ 16.7</strong></mark></td>
      <td><mark><strong>★ 1</strong></mark></td>
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
      <td><mark><strong>★ 16.7</strong></mark></td>
      <td>3</td>
      <td>CORRECT</td>
      <td>32,034</td>
      <td>18.3</td>
      <td>3</td>
      <td>CORRECT</td>
    </tr>
    <tr>
      <th>C · Wikipedia image caption</th>
      <td><mark><strong>★ 62,260</strong></mark></td>
      <td><mark><strong>★ 43.4</strong></mark></td>
      <td><mark><strong>★ 2</strong></mark></td>
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
      <td><mark><strong>★ 19.2</strong></mark></td>
      <td><mark><strong>★ 2</strong></mark></td>
      <td>CORRECT</td>
      <td>215,994</td>
      <td>56.7</td>
      <td>4</td>
      <td>CORRECT</td>
      <td><mark><strong>★ 34,787</strong></mark></td>
      <td>43.9</td>
      <td><mark><strong>★ 2</strong></mark></td>
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
      <td><mark><strong>★ 30,909</strong></mark></td>
      <td><mark><strong>★ 21.8</strong></mark></td>
      <td><mark><strong>★ 1</strong></mark></td>
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
      <td><mark><strong>★ 49.1</strong></mark></td>
      <td>4</td>
      <td>CORRECT</td>
      <td>325,209</td>
      <td>189.6</td>
      <td>11</td>
      <td>WRONG</td>
      <td><mark><strong>★ 21,433</strong></mark></td>
      <td>50.8</td>
      <td><mark><strong>★ 3</strong></mark></td>
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
      <td><mark><strong>★ 3</strong></mark></td>
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
      <td><mark><strong>★ 34,580</strong></mark></td>
      <td><mark><strong>★ 35.2</strong></mark></td>
      <td><mark><strong>★ 3</strong></mark></td>
      <td>CORRECT</td>
    </tr>
    <tr>
      <th>H · Read delayed quotes</th>
      <td>53,126</td>
      <td><mark><strong>★ 29.6</strong></mark></td>
      <td><mark><strong>★ 2</strong></mark></td>
      <td>CORRECT</td>
      <td>74,316</td>
      <td>42.3</td>
      <td>3</td>
      <td>CORRECT</td>
      <td><mark><strong>★ 13,239</strong></mark></td>
      <td>40.1</td>
      <td><mark><strong>★ 2</strong></mark></td>
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
      <td><mark><strong>★ 57,506</strong></mark></td>
      <td><mark><strong>★ 33.0</strong></mark></td>
      <td><mark><strong>★ 2</strong></mark></td>
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
      <td><mark><strong>★ 2</strong></mark></td>
      <td>CORRECT</td>
      <td>314,928</td>
      <td>164.1</td>
      <td>11</td>
      <td>WRONG</td>
      <td><mark><strong>★ 13,597</strong></mark></td>
      <td><mark><strong>★ 37.0</strong></mark></td>
      <td><mark><strong>★ 2</strong></mark></td>
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
      <td><mark><strong>★ 42.5</strong></mark></td>
      <td><mark><strong>★ 3</strong></mark></td>
      <td>CORRECT</td>
      <td>336,190</td>
      <td>139.5</td>
      <td>11</td>
      <td>WRONG</td>
      <td><mark><strong>★ 23,380</strong></mark></td>
      <td>50.8</td>
      <td><mark><strong>★ 3</strong></mark></td>
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
      <td><mark><strong>★ 89,295</strong></mark></td>
      <td><mark><strong>★ 54.8</strong></mark></td>
      <td><mark><strong>★ 3</strong></mark></td>
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
      <td><mark><strong>★ 16.1</strong></mark></td>
      <td><mark><strong>★ 2</strong></mark></td>
      <td>CORRECT</td>
      <td>286,297</td>
      <td>84.3</td>
      <td>11</td>
      <td>WRONG</td>
      <td>19,189</td>
      <td>32.4</td>
      <td>2</td>
      <td>WRONG</td>
      <td><mark><strong>★ 17,813</strong></mark></td>
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
      <td><mark><strong>★ 18.3</strong></mark></td>
      <td><mark><strong>★ 2</strong></mark></td>
      <td>CORRECT</td>
      <td>283,007</td>
      <td>114.4</td>
      <td>11</td>
      <td>WRONG</td>
      <td><mark><strong>★ 18,860</strong></mark></td>
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
      <td><mark><strong>★ 41,930</strong></mark></td>
      <td><mark><strong>★ 34.7</strong></mark></td>
      <td><mark><strong>★ 1</strong></mark></td>
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
      <td><mark><strong>★ 14.5</strong></mark></td>
      <td><mark><strong>★ 1</strong></mark></td>
      <td>CORRECT</td>
      <td>88,375</td>
      <td>34.4</td>
      <td>3</td>
      <td>CORRECT</td>
      <td><mark><strong>★ 14,158</strong></mark></td>
      <td>24.5</td>
      <td><mark><strong>★ 1</strong></mark></td>
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
      <td><mark><strong>★ 44.8</strong></mark></td>
      <td><mark><strong>★ 4</strong></mark></td>
      <td>CORRECT</td>
      <td>680,338</td>
      <td>108.7</td>
      <td>11</td>
      <td>WRONG</td>
      <td><mark><strong>★ 69,484</strong></mark></td>
      <td>60.4</td>
      <td><mark><strong>★ 4</strong></mark></td>
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
      <td><mark><strong>★ 61,301</strong></mark></td>
      <td><mark><strong>★ 21.7</strong></mark></td>
      <td><mark><strong>★ 2</strong></mark></td>
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
      <td><mark><strong>★ 28.1</strong></mark></td>
      <td><mark><strong>★ 2</strong></mark></td>
      <td>CORRECT</td>
      <td>191,676</td>
      <td>39.5</td>
      <td>3</td>
      <td>CORRECT</td>
      <td><mark><strong>★ 33,462</strong></mark></td>
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
      <td><mark><strong>★ 45.7</strong></mark></td>
      <td>4</td>
      <td>CORRECT</td>
      <td>334,074</td>
      <td>280.9</td>
      <td>11</td>
      <td>WRONG</td>
      <td><mark><strong>★ 21,350</strong></mark></td>
      <td>49.1</td>
      <td><mark><strong>★ 3</strong></mark></td>
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
      <td><mark><strong>★ 48.5</strong></mark></td>
      <td><mark><strong>★ 2</strong></mark></td>
      <td>CORRECT</td>
      <td>334,059</td>
      <td>153.5</td>
      <td>11</td>
      <td>WRONG</td>
      <td>56,625</td>
      <td>99.6</td>
      <td>7</td>
      <td>CORRECT</td>
      <td><mark><strong>★ 55,847</strong></mark></td>
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
      <td><mark><strong>★ 2</strong></mark></td>
      <td>CORRECT</td>
      <td>74,410</td>
      <td>39.5</td>
      <td>3</td>
      <td>CORRECT</td>
      <td>34,807</td>
      <td>70.9</td>
      <td>5</td>
      <td>CORRECT</td>
      <td><mark><strong>★ 23,689</strong></mark></td>
      <td>45.9</td>
      <td>6</td>
      <td>CORRECT</td>
      <td>119,056</td>
      <td>61.2</td>
      <td>8</td>
      <td>CORRECT</td>
      <td>30,869</td>
      <td><mark><strong>★ 28.3</strong></mark></td>
      <td>3</td>
      <td>CORRECT</td>
      <td>34,826</td>
      <td>39.6</td>
      <td>3</td>
      <td>CORRECT</td>
    </tr>
    <tr>
      <th>I · Cheapest Travel book</th>
      <td><mark><strong>★ 57,538</strong></mark></td>
      <td><mark><strong>★ 30.6</strong></mark></td>
      <td><mark><strong>★ 2</strong></mark></td>
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
      <td><mark><strong>★ 13,719</strong></mark></td>
      <td><mark><strong>★ 35.7</strong></mark></td>
      <td><mark><strong>★ 2</strong></mark></td>
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
      <td><mark><strong>★ 40.3</strong></mark></td>
      <td>4</td>
      <td>CORRECT</td>
      <td>329,349</td>
      <td>150.3</td>
      <td>11</td>
      <td>WRONG</td>
      <td><mark><strong>★ 22,190</strong></mark></td>
      <td>40.7</td>
      <td><mark><strong>★ 3</strong></mark></td>
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
      <td><mark><strong>★ 89,089</strong></mark></td>
      <td><mark><strong>★ 48.5</strong></mark></td>
      <td><mark><strong>★ 3</strong></mark></td>
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
      <td><mark><strong>★ 79,902</strong></mark></td>
      <td><mark><strong>★ 31.5</strong></mark></td>
      <td><mark><strong>★ 3</strong></mark></td>
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
      <td><mark><strong>★ 52,453</strong></mark></td>
      <td><mark><strong>★ 18.2</strong></mark></td>
      <td><mark><strong>★ 2</strong></mark></td>
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

## Important setup notes

- Use **Node 24.16+ in the 24.x line, or Node 26.1+**; this baseline was qualified
  with Node 24.19.0. Also install Python 3.11.5+, curl, unzip, minisign and Poppler’s
  `pdftotext`. On macOS: `brew install minisign poppler`. Linux prerequisites and
  the separate Hermes Python runtime are documented in the setup footnote.[^setup]
- `./setup` installs the pinned local runtimes, verifies the signed Recued 26.11.9
  binary and SQLite sidecar, checks Bridge 0.0.8 and installs Chromium. It creates
  no Recued service or startup item. Each measured task gets an isolated browser
  and, for Recued, a disposable realm. These tasks use public sites without sign-in.[^setup]
- Set **`BENCH_API_KEY`** and **`BENCH_BASE_URL`** in the environment. The endpoint
  is your provider’s OpenAI-compatible base URL ending in `/v1`. The default model
  is Qwen3.7-plus with thinking off, temperature 0.2 and 4,000 output tokens per
  request. All selected arms receive the same requested model settings.[^thinking]
- Start with a selected arm/task. An unrestricted `./run` schedules all **196 runs**.
  Recued keeps its release’s ten charged tool-round budget; browser-use and Stagehand
  have 30 native steps; OpenClaw and Hermes retain their native loops and the shared
  480-second answer deadline. A memory gate runs before each isolated task.[^run]
- Browser Toolkit is installed from its pinned published catalog before measurement;
  it is not bundled automatically in this binary. The HTTP Toolkit is disabled for
  the two Recued arms. Task K also installs the pinned PDFToText pack.[^catalog-install]

```sh
./setup

# Set BENCH_API_KEY and BENCH_BASE_URL, then run one arm and task:
./run --tasks E --runs 1 --arms browser-use --out results/my-smoke

# Run the full comparison, or select one arm without rerunning the others:
./run --out results/my-comparison
./run --arms recued-bridge --out results/my-bridge
```

Copy `bench.config.example.json` to `bench.config.json` for shared settings;
`./run --help` lists overrides. Each run writes `records.json`, `report.md` and
`results.json`, including failure reasons and retry eligibility. Only observed
technical failures are retryable; wrong actions and budget exhaustion stay final.[^retry]

The benchmark harness is **MIT-licensed**. Bundled Bridge and downloaded Recued retain their own licenses; see [component notices](NOTICE.md). Product names identify the compared projects;
this is Recued’s independent comparison and does not imply their endorsement.[^license]

[^catalog]: browser-use still has its own browser tool schemas and agent instructions.
    The general-agent catalog distinction is part of the measured stack, not a measured
    attribution of every token difference. No catalog-normalized score or monetary cost
    comparison is claimed. See [agent configuration and measurements](docs/benchmark-notes.md#measures-and-fairness).
[^paired]: Each Δ is the median of `100 × (Bridge − other) / other` for matched
    task/repetition pairs where both arms were correct. It uses unrounded answer seconds
    and complete native input/output totals. Full tables display one-decimal seconds, so
    displayed ties can differ from unrounded comparisons. Correctness percentages use all
    28 scheduled runs per arm. Pair counts, ratios and percentage changes are retained in
    [summary data](release/summary.json).
[^scope]: Recued’s Browser Toolkit was developed and tuned against these tasks. Fresh
    Chromium profiles do not measure its ability to act in a user’s existing signed-in
    Chrome. [Full scope and controls](docs/benchmark-notes.md#measures-and-fairness).
[^rounds]: Recued counts provider calls from chat and recipe usage; browser-use uses
    history steps minus one; Stagehand counts native model invocations including extraction
    and finalization; OpenClaw counts unique native model-call IDs, including helpers;
    Hermes counts physical native API attempts. These are not uniform provider-request
    counts. [Definitions](docs/benchmark-notes.md#measures-and-fairness).
[^timing]: Cohorts ran separately. Native loops, recovery and transfer waits remain in
    answer time; browser launch is excluded. Slow OpenClaw download transfers limit causal
    speed claims. [Cohort history](docs/benchmark-notes.md#cohorts-corrections-and-evidence).
[^grading]: Success includes the requested answer and required observed action. A completed
    download can still fail its exact-byte-count answer. B/R2 for Stagehand, OpenClaw +
    browser-use and Hermes returned the right title but points differed at the later check.
    All **44 wrong repetitions** and their evidence remain in the
    [failure details](docs/benchmark-notes.md#failure-details).
[^mcp]: These rows describe Recued 26.11.9’s MCP integration. Snapshot references can
    fail across its separate MCP clients; this is not a standalone Playwright MCP verdict.
    [Integration details](docs/benchmark-notes.md#measures-and-fairness).
[^versions]: Pinned versions: browser-use 0.13.14, Playwright MCP 0.0.85, Stagehand 3.7.3,
    OpenClaw 2026.11.2, Hermes 0.23.1 and Playwright 1.61.1. Stagehand v4 removed the requested
    native `agent()` API, so this comparison uses the supported v3 native-agent line.
    [Arms and versions](docs/benchmark-notes.md#arms-and-versions).
[^setup]: [Complete installation instructions](docs/benchmark-notes.md#setup), including
    Linux packages, the signed immutable release artifacts, isolated OpenClaw dependencies
    and Hermes’s owned Python 3.14.6 / uv.lock installation. Existing Linux qualification
    covers the original four arms; Linux setup/live qualification for the added arms remains
    pending in the dated [qualification record](qualification/STATUS.md).
[^thinking]: DashScope omits the reasoning-token counter in these thinking-off responses.
    Missing remains null, not an asserted zero. The approved policy requires the off switch,
    completed successful calls, no reasoning content and no contradictory counter.
    [Policy and evidence limits](docs/benchmark-notes.md#qualification-limits).
[^catalog-install]: [Catalog verification and grants](docs/benchmark-notes.md#measures-and-fairness),
    [frozen catalog files](harness/recued/catalog/README.md) and the
    [Bridge source/ZIP provenance](bridge/PROVENANCE.md).
[^run]: [Shared run settings and outputs](docs/benchmark-notes.md#run),
    [run one arm and combine reports](docs/benchmark-notes.md#run-one-arm-and-combine-reports).
[^retry]: [Technical retry policy and commands](docs/benchmark-notes.md#retry-technical-failures).
    Five technical failures received one additional attempt; 201 physical attempts represent
    196 scheduled runs. No retryable technical failures remain in the published snapshot.
[^evidence]: [Combined raw records](results/showcase/2026-11-10-qwen3.7-plus-seven-arms/records.json),
    [report](results/showcase/2026-11-10-qwen3.7-plus-seven-arms/report.md),
    [metric vectors](results/showcase/2026-11-10-qwen3.7-plus-seven-arms/results.json),
    [preserved source batches and corrections](docs/benchmark-notes.md#cohorts-corrections-and-evidence),
    [release baseline](release/BASELINE.json).
[^license]: [Licence](LICENSE), [reuse and attribution](docs/benchmark-notes.md#reuse-and-license).
    browser-use, Stagehand, OpenClaw and Hermes are MIT; Playwright MCP is Apache-2.0.
    Third-party frameworks are installed rather than vendored. Product naming does not
    grant trademark rights or indicate affiliation.
