# License scope and provenance

The benchmark harness, tasks, fixtures, reporting code and original documentation
in this repository are licensed under the [MIT License](LICENSE).

The copyright owner has also made this repository's benchmark adaptations of
Recued's browser drives, dev/headless client and browser-agent-bench available
under MIT. Their origin is retained in source comments and the benchmark notes.
This applies to these benchmark copies; it does not change the licenses of
those upstream repositories or previously distributed copies.

## Separately licensed components

- `bridge/recued-bridge-0.0.8.zip` remains **AGPL-3.0-only**. The archive and its
  embedded license are unchanged. Its corresponding source and reproducible
  build are identified in [Bridge provenance](bridge/PROVENANCE.md). A copy of
  the AGPL text is retained at [LICENSES/AGPL-3.0-only.txt](LICENSES/AGPL-3.0-only.txt).
- The Recued server downloaded by setup retains its own license. The MIT grant
  for this benchmark does not relicense the server or Browser Bridge.
- Installed frameworks and dependencies retain their own licenses and notices:
  browser-use, Stagehand, OpenClaw and Hermes are MIT; Playwright MCP is Apache-2.0.
  Refer to each installed package for its complete terms and dependency notices.
- Third-party material from public websites retained in task outputs or reports
  remains subject to its original rights. The benchmark's MIT license does not
  grant additional rights to that third-party material.

The archived benchmark results, versions and verdicts are unchanged by this
license update. Product names identify the compared projects; no endorsement
is implied.
