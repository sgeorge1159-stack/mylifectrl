# Android Trusted Web Activity (TWA)

This directory is the Bubblewrap workspace placeholder. Run these commands from this directory after installing Node.js and Java 17:

```bash
npm install -g @bubblewrap/cli
bubblewrap init --manifest=https://mylifectrl.com/manifest.json
# accept the generated application ID and signing configuration
bubblewrap build
```

Bubblewrap generates an Android project and signed/unsigned APK/AAB under `./app/build/outputs/`. For Play submission, use the AAB and keep the upload keystore backed up. Set `host` to `mylifectrl.com` and ensure `startUrl` is `/` in `twa-manifest.json`.

## Digital Asset Links

After creating the release keystore, publish `assetlinks.json` at:

`https://mylifectrl.com/.well-known/assetlinks.json`

Use the package name and SHA-256 certificate fingerprint printed by `bubblewrap fingerprint`. Without this file Android opens the URL in a browser fallback instead of verified fullscreen TWA.
