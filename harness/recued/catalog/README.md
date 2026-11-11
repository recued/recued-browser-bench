These public install artifacts were captured from `https://recued.com` on
2026-11-09, after `catalog/26.11.9.1` was published. Browser Toolkit 4 contains
the same browser recipe implementations as the frozen 26.11.9 release; that
catalog correction advanced versions and their pack pins.

The release binary has the browser operations, but does not automatically
install this optional pack. Each Bridge run installs it with the binary's
normal `packs.installBySlug` RPC, preserving its `recued-core` publisher.
The harness checks the published bytes against `pins.json` first, then checks
every installed recipe's publisher and version. The binary lowers canonical
operation steps as part of installation; the record retains the resulting
definition hashes separately from the original catalog bytes.

Task K installs the published PDFToText Pack 5 through the same marketplace
preview and by-slug installer. Its two recipe bodies are pinned in
`pdftotext-pins.json`. A by-value copy cannot resolve those non-embedded recipe
references in a fresh release binary. The public manifest is identical to the
release-tag copy; only the supported installation path differs.

The published installer has no archive selector. If the catalog changes, this
benchmark refuses to measure rather than install different recipes. These
archived public files make that drift inspectable; rerunning after a catalog
change requires a supported archived-catalog installer or an explicitly
documented new benchmark version. They are data, not a private realm seed.
