# Hermes Agent

The `hermes` arm uses the released v0.23.1 `AIAgent` API and its native
`browser_exec` tool with local headless Chromium. Native prompts, tool definitions,
tool dispatch, recovery and the model loop remain upstream code. The browser
driver is browser-harness 0.1.13; it does not start another browser-use model agent.

`./setup` verifies the official source archive's SHA-256, then installs its
frozen upstream `uv.lock` and supported editable package into an owned Python
3.14.6 environment. The upstream project metadata's `0.0.0` version is a
placeholder; provenance uses the actual release tag and archive checksum.
Framework sources and dependencies are installed under ignored `.bench/`.

Each task receives fresh HOME, HERMES_HOME, workspace, browser and attachment
files. Only the temporary benchmark gateway credential reaches the agent. All
primary and auxiliary requests pass through the common settings gateway. Web,
vision, memory, delegation and scheduling toolsets are disabled; generic
workspace instructions require browser navigation, allow discovered-document
extraction, and require browser downloads for requested downloads. Native
skill-learning nudges, background memory review and title generation are off.

`observe.py` is an observer-only native lifecycle plugin. It records physical
primary and auxiliary attempts, including failures and retries, without retaining
request prompts or credentials. Native canonical prompt tokens already include
cached input. Canonical cache zeros can represent omitted provider fields, so
aggregate cache availability stays unknown. Missing native usage stays unknown.
The separate gateway ledger validates counts and tokens; it never replaces them.

The answer clock starts before agent preparation, after native browser/daemon
prewarming and passive observer attachment. It ends on the final native visible
answer delta, or its final native response timestamp when buffered. Cleanup does
not extend it. The native loop uses the shared answer deadline; `--max-steps`
does not replace Hermes's own loop. Passive file observers follow native session
replacements and require actual attachment bytes/submission and browser saves.

```sh
./run --arms hermes --out results/hermes
node qualification/check-hermes-files.mjs
node qualification/check-hermes-records.mjs results/hermes/records.json
```

The five browser fixtures use the installed native tool and actual Chromium,
with no model calls: correct upload, wrong bytes, no submission, and a completed
browser download which a shell-written file alone cannot satisfy, and an upload
in a native page which loaded before the observer attached.
