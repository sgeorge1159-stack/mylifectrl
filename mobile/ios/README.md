# iOS Capacitor shell

The native Xcode project is generated locally (rather than committed) so the web app remains the single maintained codebase. On macOS with Xcode and Node.js installed:

```bash
npm install
npm install @capacitor/core @capacitor/cli @capacitor/ios
npx cap init MyCTRL com.mylifectrl.app --web-dir=client/dist
npx cap add ios
```

Configure the generated `ios/App/App/Info.plist` with the production URL behavior, app display name `MyCTRL`, and the supplied 180px icon. For a remote WKWebView shell, set the Capacitor server URL in `capacitor.config.ts`:

```ts
server: { url: 'https://mylifectrl.com', cleartext: false }
```

Then open and archive:

```bash
npx cap sync ios
npx cap open ios
# In Xcode: select a Team, set Bundle Identifier, signing, capabilities, and version.
# Product > Archive, validate, then Distribute App > App Store Connect.
```

Apple review requires meaningful native utility and a working privacy policy URL; verify authentication, uploads, external links, and offline fallback on a physical device before submission.
