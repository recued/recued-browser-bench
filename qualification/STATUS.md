# Qualification

## Seven-arm report and Hermes, 2026-11-10

Hermes v0.23.1 completed its own 28-run macOS arm64 batch from clean source
`bfb4f93770e84418513cb33cb5ea3690de596ccd`: **24 correct / 4 wrong** after the
[evidence-only D/R1 checker correction](hermes/oracle-repair.json). The
[raw batch](hermes/raw-showcase/records.json) is retained. Its native browser
output contained the complete See also list; the independent D/R2 checker from
the same batch matched its final entry. A later checker-only recheck returned
Wikimedia HTTP 429. No model was rerun and no measurement was changed. Missing
checker fields and HTTP errors now become technical failures, covered by a
regression test.

The four final wrong results are B/R2's live points mismatch, C/R1's alt-text
substitution for the caption, I/R1's truncated book title, and X/R2's extra deletion
of Jay's receipt. None is eligible for a model retry. Both uploads, both PDF reads,
both browser ZIP downloads and both intended offer opens passed.

The [cohort receipt](hermes/cohort-receipt.json) checks all 361 native calls and all
28 native token totals against the separate gateway ledger. Thinking-off evidence
uses the existing approved missing-counter policy. All measurements came from
clean source. The [seven-arm dataset](../results/showcase/2026-11-10-qwen3.7-plus-seven-arms/records.json)
retains **196 scheduled runs / 201 physical attempts**, every source's complete
metadata and retry history. The other six arms were not rerun; all 27 earlier
showcase files remain byte-identical.

All **41 unit tests**, [five Hermes native browser file checks](hermes/file-evidence.json)
and [six shared file regression checks](hermes/shared-file-regression.json) pass.
The four [development attempts](hermes/development-receipt.json), including two
invalid upload verdicts from collector bugs, are retained separately and excluded
from the showcase. Hermes's locked runtime uses Python 3.14.6, upstream uv.lock,
uv 0.13.7 and browser-harness 0.1.13. Linux setup/live qualification for the added
arms remains pending. The repository stays local with no remote or push.

## Six-arm report and built-in browser, 2026-11-10

OpenClaw's built-in browser completed a separate 28-run macOS arm64 batch from
clean source `665ee3634858b53d959d8893859d1fae342cc8c0`. Its final score is
**24 correct / 4 wrong**, including one technical retry measured from clean source
`75915eaa3c8846b0e83c1fa2bbc0876880cef3ce`. No existing arm was rerun.
The [six-arm report](../results/showcase/2026-11-10-qwen3.7-plus-six-arms/report.md)
contains **168 scheduled runs and 173 physical attempts**. All earlier measurements
and verdicts are unchanged. Twelve of 15 earlier showcase files remain byte-identical;
three raw record files receive additional path-only redactions and a processing
receipt link. Source hashes, complete metadata, retry links and every attempt are retained.

The initial L/R1 false failure was a passive collector bug: the native browser
saved a complete 12,499,601-byte artifact outside the task workspace. Its native
tool metadata, actual file, checksum, in-turn stat result and separate browser
download event were verified. The corrected dataset changes only its file
evidence and verdict, with no AI rerun or measurement changes. The original
dataset and a [correction receipt](openclaw/native-download-repair.json) retain
the proof. Future runs collect these native artifacts and clean up only verified
task-owned UUID files.

L/R2's first attempt recorded a provider connection timeout. Its retry recorded
a reset but continued to a final answer after downloading the ZIP with a shell
client while the browser download remained incomplete. This is a final wrong
method, with the provider error and unknown native token totals retained. J/R2
exhausted its native budget without an upload. Both X runs deleted unrelated
items before Bob's invoice. These are final wrong results. No retryable technical
failures remain.

All **36 unit tests** and **six browser file-evidence checks** pass. The additional
fixture check uses OpenClaw's actual native download-capture implementation with
Chromium and an injected secondary-observer save failure; it makes no model calls.
Complete native token totals match separate gateway evidence for all 27 complete
physical attempts. The two incomplete attempts keep null aggregate tokens.
See the [native cohort receipt](openclaw/native-cohort-receipt.json),
[file checks](openclaw/native-file-evidence.json), and
[owned-file observations](openclaw/native-download-observations.json).

The [final privacy audit](openclaw/truncated-path-redaction.json) found terminal
directory fragments that the earlier partial-prefix check missed. Four older
record artifacts were redacted, preserving every record after path normalization.
Future native audit results sanitize complete paths before truncating their text;
a regression test covers this failure.

Current scores are 28/28 Bridge, 11/28 MCP, 24/28 browser-use, 18/28 Stagehand,
23/28 OpenClaw + browser-use, and 24/28 OpenClaw + built-in browser. The two
OpenClaw arms ran in separate later batches; timings retain native recovery and
transfer waits. Their Linux setup qualification remains pending. The repository
is local, with no remote or push.

## Earlier fifth-arm batch, 2026-11-10

OpenClaw 2026.11.2 steering browser-use 0.13.14's published CLI completed its
28 scheduled runs on macOS arm64 from clean source
`900e284bae5009314d3ac4462436827230b0a458`. Its initial 21 correct results became
**23 correct / 5 wrong** after retrying only C/R1 and G/R1, which recorded
provider `ECONNRESET` failures. Both retries passed. All 30 attempts remain in the
[new-arm report](../results/showcase/2026-11-10-qwen3.7-plus-openclaw-browser-use-technical-retry/report.md).
No technical retries remain. Wrong actions and native budget failures are final.

The [combined report](../results/showcase/2026-11-10-qwen3.7-plus-five-arms/report.md)
contains **140 scheduled runs and 144 physical attempts**. It reuses the original
four-arm results without rerunning them. All six existing showcase files remain
byte-identical; source hashes, metadata and rebased retry links are retained.
Current scores are 28/28 Bridge, 11/28 MCP, 24/28 browser-use, 18/28 Stagehand,
and 23/28 OpenClaw + browser-use. The new arm was a later separate cohort.

All **32 unit tests** and **five real-browser file-evidence checks** pass. Complete
OpenClaw native counters match the separate gateway totals; incomplete counters
stay null. The [cohort receipt](openclaw/cohort-receipt.json),
[privacy-processing receipt](openclaw/privacy-receipt.json), and
[file-evidence receipt](openclaw/file-evidence.json) preserve the checks.
Additional path redaction changed no measurements or verdicts.

Both download repetitions reached their 480-second native limit while transfers
were still partial. Those recorded slow transfers limit what these failures say
about model capability. B/R2 failed the live points check, possibly from page drift.
X/R1 claimed deletion with no fixture deletion recorded; Y/R1 opened an extra offer.
Linux setup qualification for the added arm remains pending on dependency downloads;
no Linux model task was run. The built-in browser was reserved for the later
batch and is not included in that five-arm dataset.

## Original showcase, 2026-11-09

The full owner showcase is complete: **112 attempts**, with every task, arm and
repetition retained in the rotating schedule. Measurement ran from clean source
`e0d69483de4912d20cac3265f396ec52b6100c14`. See the
[full report](../results/showcase/2026-11-09-qwen3.7-plus/report.md),
[raw records](../results/showcase/2026-11-09-qwen3.7-plus/records.json) and
[completion receipt](showcase-receipt.json).

| Arm | Right / total |
| --- | ---: |
| Recued + Bridge | 27 / 28 |
| Recued + Playwright MCP | 11 / 28 |
| browser-use | 24 / 28 |
| Stagehand | 18 / 28 |

The final Bridge and MCP attempts failed before an upstream HTTP response was
received. Their null answer clocks and round counts are preserved. The original
batch had no retries or substitutions. Wrong and extra actions on X/Y fail against the fixture's
private record, including attempts that eventually performed the requested action.

## Technical-retry follow-up

The owner subsequently requested retries for technical failures and per-attempt
metric vectors. The [follow-up report](../results/showcase/2026-11-09-qwen3.7-plus-technical-retry/report.md)
contains all 112 original records unchanged plus two linked attempts measured from
clean source `08d2f9ebd314fa578733b6d57bab33f788071963`.
Bridge recovered in 18.194 answer seconds and two AI rounds. MCP returned a wrong
result in 94.839 seconds and 11 rounds and will not be retried. Current results
are 28/28 Bridge, 11/28 MCP, 24/28 browser-use and 18/28 Stagehand. Original
scores remain in both reports.

All 20 focused tests pass. Live verification confirmed source-record equality,
114 physical attempts for 112 scheduled runs, the two intended retry links,
report and metric-vector reproduction, and zero remaining retryable attempts.
The [retry receipt](retry-receipt.json) records hashes, versions and the two
attempts' tokens, seconds, rounds and outcomes. The machine-readable vectors also
include `failed_reason`; missing counters stay null. Native limits and wrong
answers/actions do not trigger retries.

## Setup and native execution evidence

- Setup verified Recued 26.11.9 and its SQLite sidecar on macOS arm64 and Linux
  arm64: pinned public key, signed manifest, artifact signatures and SHA-256 values.
  It installed into the repository's ignored runtime directory, with no service
  or startup item.
- Browser Bridge 0.0.8's ZIP checksum matched. All 17 payload files rebuilt from
  public `v26.11.9` source matched byte for byte; see
  [the reproduction record](../bridge/PROVENANCE.md).
- The [initial Linux smoke](linux-smoke/receipt.json) established setup and live
  calls in every arm. Stagehand failed the Hacker News points check; this preceded
  the output-field correction described below.
- The [Linux output check](linux-output/receipt.json) reran setup from a clean
  clone, passed 14 focused tests and returned actual three-sentence task-E
  answers in all four arms. Stagehand uses its native output schema and
  `result.output.answer`; its completion assessment is kept separately.
- The [Linux PDF check](linux-pdf/receipt.json) reran setup and passed all 15
  focused tests, then completed task K through the pinned catalog installer and
  native `document.read` with the `pdftotext` converter. Browser Toolkit and
  PDFToText recipes come from verified released catalog content.
- The final 15 focused tests pass on macOS, including the approved thinking
  policy's missing-counter, contradiction and incomplete-call cases. Other checks
  cover wrong/extra actions, failure denominators, rotation, configuration, privacy,
  private fixture records, shared model settings, live page checks, streamed-answer
  deadlines and Stagehand's requested output.
- The actual released MCP path was traced: owner enrollment, stdio probe,
  generated pack, reviewed operations, grants and a model-issued browser call.
  Separate clients share one fresh Chromium through the supported CDP endpoint.
- Native Stagehand 3.7.3 LOCAL tool calls and structured extraction worked with
  Qwen through the custom OpenAI-compatible endpoint. Its supported model
  middleware counts extraction and forced-finalization calls that step callbacks
  or aggregate metrics alone omit.

## Accepted thinking evidence

DashScope omits `completion_tokens_details.reasoning_tokens` on the tested
thinking-off responses. Every raw counter and `all_zero` remains `null`;
`counter_verified` is `false`. The owner approved accepting completed successful
calls that requested `enable_thinking:false`, returned no reasoning content and
reported no contradictory counter. In the original showcase that policy accepts **108 attempts**; four
with failed or incomplete calls remain unqualified. Task accuracy is separate.

The classification was applied after measurement. The completion receipt records
the original and final dataset hashes and the unchanged measurement fingerprint.
All original reasoning-evidence fields were checked for equality. Verdicts,
answers, clocks, rounds, tokens, raw model calls, settings and source provenance
did not change. The runner applies the same policy to future runs.

## Scope and retained development evidence

The first showcase batch was stopped after finding that Stagehand's `message`
was an assessment rather than requested answer data. Its 40 attempts and original
verdicts remain in [stopped-showcase](stopped-showcase/README.md), explicitly
invalid for comparison and excluded from the complete showcase. Form and PDF
checks remain in [form-and-pdf](form-and-pdf/README.md).

Stagehand's supported v3 native-agent line and released catalog installation are
owner-approved choices. Chromium 149 from Playwright 1.61.1 is shared across arms
after newer Chromium stalled browser-use before navigation. Python 3.11.5+ is
required; Debian 12's stock 3.11.2 failed Soup Sieve 4.0.1, so the isolated
qualification image uses Debian 13.

The frozen Recued release's snapshot references fail across separate MCP client
sessions. This is a limitation of that Recued/MCP integration. It does not establish
standalone Playwright MCP's ability to use its own references. Recued retains its
ten charged tool rounds; browser-use and Stagehand use native step budgets.
Round measures differ, and Recued's toolkit was developed against these tasks.

All four arms appear in the README with the owner's approval. The repository stays
local, with no remote or push; its GitHub name will be decided later.
