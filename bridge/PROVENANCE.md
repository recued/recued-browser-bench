# Browser Bridge 0.0.8

`recued-bridge-0.0.8.zip` is the release package, 1,910,275 bytes. Its SHA-256 is:

```
bde925587454959e4ca148da0445f6dcfc1d997df90c1f2a51c98608aae314ad
```

The original package records source commit `ec4c8e5a15099d874dfdd096b57878cc0e44e1a6`.
The source is published in [Recued v26.11.9](https://github.com/recued/recued/tree/v26.11.9/apps/bridge).

The comparison from that original source to the release tag is **not empty**: four
store submission documentation/provenance files changed, alongside two contract
files and the approval gateway. These changes do not change the extension bundle.
On 2026-11-09 all **17 payload files** rebuilt from the public tag matched the ZIP
byte for byte, including source maps, manifest, icons and license.

To repeat the comparison:

```sh
git clone --branch v26.11.9 --depth 1 https://github.com/recued/recued.git recued-source
cd recued-source
npm ci
npm run build:bundle:prod --workspace @recued/bridge
cd ..
unzip -q bridge/recued-bridge-0.0.8.zip -d bridge-unpacked
diff -r bridge-unpacked recued-source/apps/bridge/build
```

Run these from this bench's root; choose unused checkout and extraction paths.
The public export commit is `89e77431e09e2dc45443e64c6a70576c98d62c89`.
The checked-in ZIP is unchanged. The harness changes **its temporary copy's** host
permissions to `*://*/*` and empties optional host permissions so automated pairing
does not need Chrome's site-permission dialog. It adds no debugger permission and
does not change Bridge's page scripting.
