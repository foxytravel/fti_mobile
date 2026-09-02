# Releasing FTI Coach (iOS)

CI/CD is handled by GitHub Actions + fastlane:

| Workflow | Trigger | What it does |
|---|---|---|
| `iOS TestFlight` | push to `main`, or manual | Auto-bumps the build number (latest TestFlight build + 1), builds with Xcode 26, uploads to TestFlight |
| `iOS App Store Release` | manual (`workflow_dispatch`) | Bumps the marketing version (patch/minor/major or explicit), **captures the App Store screenshots** (signs in with a demo driver account and drives the app via XCUITest), builds, uploads, **submits for App Store review** (or dry-runs with `submit_for_review=false`), commits the version bump back and tags `vX.Y.Z` |

The release workflow runs as three jobs: `build` (device archive) and
`screenshots` (simulator run) execute **in parallel** because they are
independent full compiles of the same dependency graph, then `publish` joins
them, uploads both to App Store Connect and tags the release. The matching
fastlane lanes are `build_release`, `screenshots` and `publish`; the `release`
lane still runs all three in sequence for local use.

The app identity is `com.foxytravel.fticoach`, team `97H8939ZRR`, scheme `fti_coach`.

---

## One-time setup

### 1. Create an App Store Connect API key

1. Go to [App Store Connect → Users and Access → Integrations → App Store Connect API](https://appstoreconnect.apple.com/access/integrations/api) (requires the **Admin** role).
2. Under **Team Keys**, click **+** and create a key named e.g. `fti-ci` with the **App Manager** role.
3. Note the **Key ID** and the **Issuer ID** (shown at the top of the page).
4. Download the `.p8` file — it can only be downloaded **once**. Keep it safe.

### 2. Create the match certificates repository

1. Create a **private** repo `foxytravel/fti-certificates` (empty is fine).
2. Create a **deploy key** so CI can read the repo — fully contained to that
   one repository:

   ```sh
   ssh-keygen -t ed25519 -C "fti-ci certificates deploy key" -N "" -f fti_certs_deploy_key
   ```

   1. In `foxytravel/fti-certificates`: *Settings → Deploy keys → Add deploy
      key*. Paste the contents of `fti_certs_deploy_key.pub` and check
      **Allow write access** (write is needed only by the one-time seeding
      workflow below; the build workflows only ever read).
   2. Save the contents of the private key file (`fti_certs_deploy_key`) as
      the `CERTS_DEPLOY_KEY` GitHub Actions secret (step 3).
   3. Delete both key files from your machine afterwards.

   The workflows load the key into `ssh-agent`
   ([`webfactory/ssh-agent`](https://github.com/webfactory/ssh-agent)) and
   match clones `git@github.com:foxytravel/fti-certificates.git` over SSH.
3. Pick a strong passphrase — match encrypts everything in the repo with it (`MATCH_PASSWORD`).
4. Generate the distribution certificate + App Store provisioning profile by
   running the **iOS Seed Certificates** workflow (Actions tab →
   *iOS Seed Certificates* → *Run workflow*), after configuring the secrets
   in step 3.

   fastlane match can only generate certificates on macOS (it needs a
   keychain), so this runs on a macOS runner instead of your machine. It
   creates an `Apple Distribution` certificate and an App Store profile for
   `com.foxytravel.fticoach` and stores them (encrypted) in the certs repo.
   The build workflows afterwards only ever run match in `readonly` mode.
   Re-run the same workflow to repair/renew (e.g. after the yearly
   certificate expiry).

> The bundle ID `com.foxytravel.fticoach` must exist in the
> [Apple Developer portal → Identifiers](https://developer.apple.com/account/resources/identifiers/list)
> with the **Push Notifications** capability enabled, and the App Store Connect
> app record must use the same bundle ID. match will create the identifier
> automatically if it is missing, but the capability has to be enabled by hand.

### 3. Configure GitHub Actions secrets

In the repo: *Settings → Secrets and variables → Actions → New repository secret*:

| Secret | Value |
|---|---|
| `ASC_KEY_ID` | Key ID from step 1 |
| `ASC_ISSUER_ID` | Issuer ID from step 1 |
| `ASC_KEY_CONTENT` | **base64-encoded** contents of the `.p8` file: `base64 -w0 AuthKey_XXXXXX.p8` (Linux) or `base64 -i AuthKey_XXXXXX.p8` (macOS) |
| `MATCH_PASSWORD` | The match encryption passphrase from step 2 |
| `CERTS_DEPLOY_KEY` | Full contents of the deploy key's **private** key file from step 2 |
| `SCREENSHOT_EMAIL` | **Demo driver account** email used to sign in while capturing screenshots |
| `SCREENSHOT_PASSWORD` | Password for the demo driver account |
| `BACKEND_API_KEY` | The backend API key for `fticoachcharters.com`. CI writes it to the gitignored `Config.js` at build time (see *Config.js* below) |

> **`Config.js`**: the app imports `API_KEY` from a gitignored `Config.js` at
> the repo root. CI generates it from the `BACKEND_API_KEY` secret in
> `setup-ios-build` — nothing is committed. For local builds, copy the template
> and fill in the key:
>
> ```sh
> cp Config.example.js Config.js
> # then edit Config.js with the real backend API key
> ```
>
> If you rotate the backend key, update the `BACKEND_API_KEY` secret and any
> local `Config.js` copies.

> The release workflow now generates the App Store screenshots automatically.
> It signs in with the `SCREENSHOT_EMAIL` / `SCREENSHOT_PASSWORD` demo driver
> account against the live backend, so the demo driver must have **standing
> data** (at least one assigned charter) or the "Today's Charter" / charter
> detail screenshots will come out empty. See *Screenshots* below.

### 4. Screenshots (one-time project setup, already in the repo)

Screenshot capture runs on the **same UI-test target** used by fastlane
`snapshot`:

- `ios/fti_coachUITests/ScreenshotsUITests.swift` — drives the app: welcomes →
  sign in → home → today's charter → charter details → profile, and calls
  `snapshot("NN-...")` on each screen. The demo credentials are read from
  `SCREENSHOT_EMAIL` / `SCREENSHOT_PASSWORD`.
- `ios/fti_coachUITests/SnapshotHelper.swift` — fastlane's screenshot helper
  (keep it in sync: `bundle exec fastlane snapshot update`).
- `fastlane/Snapfile` — captures on the largest iPhone (6.9"), which is
  the display size App Store Connect requires. The UI tests build in
  **Release** so the JS bundle is embedded (a Debug build would wait for a
  Metro dev server that isn't running in CI).
- `scripts/add_uitest_target.rb` — one-time script that added the
  `fti_coachUITests` target to `ios/fti_coach.xcodeproj` and wired it into the
  shared scheme's Test action. It is idempotent; re-run it after a fresh
  checkout if the target ever goes missing.

Run it locally on macOS:

```sh
SCREENSHOT_EMAIL=... SCREENSHOT_PASSWORD=... bundle exec fastlane ios screenshots
```

The PNGs land in `fastlane/screenshots/en-US/`. If your Xcode's simulator is
not called `iPhone 17 Pro Max`, set `SNAPSHOT_DEVICE` to the right name. The
lane creates the simulator automatically if it is missing (fresh Xcode
installs and GitHub runners do not reliably ship every iPhone), so the name in
`SNAPSHOT_DEVICE` must match a device type Xcode knows about.

> **Credentials and the test runner.** The UI test runs inside the simulator,
> in a different process tree to fastlane, and `xcodebuild` does not forward
> the host environment into it. Since Xcode 13 it forwards only variables
> prefixed with `TEST_RUNNER_`, stripping the prefix on the way in. The
> `screenshots` lane therefore re-exports `SCREENSHOT_EMAIL` /
> `SCREENSHOT_PASSWORD` as `TEST_RUNNER_SCREENSHOT_EMAIL` /
> `TEST_RUNNER_SCREENSHOT_PASSWORD` before calling `snapshot`. Setting only the
> unprefixed variables makes the test fail its first assertion with empty
> credentials, even though fastlane itself can see them.

### 5. Replace the Firebase iOS config (required)

`ios/GoogleService-Info.plist` is still registered to the old bundle ID
(`org.reactjs.native.example.fti-coach`). Push notifications will not work
until it is replaced:

1. [Firebase console](https://console.firebase.google.com/) → project **fticoach** → *Add app* → iOS.
2. Bundle ID: `com.foxytravel.fticoach`.
3. Download the new `GoogleService-Info.plist` and replace `ios/GoogleService-Info.plist`.
4. Upload your **APNs Authentication Key** under *Project settings → Cloud Messaging → Apple app configuration* if not already present.

### 6. Commit `ios/Podfile.lock` after the first CI run

The Podfile was rewritten for React Native 0.81, so there is no lock file yet.
After the first successful CI build, download the resolved `Podfile.lock` from
a local `pod install` (or copy it from the CI logs cache) and commit it so
builds are reproducible.

---

## Day-to-day usage

### TestFlight

Push to `main` (or run the *iOS TestFlight* workflow manually). The build
number is derived from TestFlight automatically — no commits needed. The
marketing version stays whatever is in the project (currently `1.0.0`).

### App Store release (unlisted app)

1. Make sure the app record in App Store Connect has its metadata filled in
   (description, privacy policy URL, App Privacy questionnaire) — the workflow
   intentionally does not manage metadata. **Screenshots are now uploaded
   automatically** by the workflow.
2. Run the *iOS App Store Release* workflow from the Actions tab. Choose
   `patch`/`minor`/`major`, or type an explicit version.
3. The workflow signs in with the demo driver account, **captures the
   screenshots**, uploads the build, creates the App Store version, uploads the
   screenshots and submits it for review, then pushes a `vX.Y.Z` tag +
   version-bump commit to `main`.
4. To do a **dry run** (upload build + screenshots but **do not** submit for
   review), uncheck the `submit_for_review` input.
5. Review the submission status in App Store Connect.

#### Requesting unlisted distribution (one-time)

Unlisted apps are approved via a request to Apple — there is no API/fastlane
switch for it:

1. Submit the app for review first (step 2-3 above). For a brand-new app it
   must have been submitted at least once; apps already approved as public
   cannot be converted retroactively without contacting Apple.
2. Fill in the [unlisted app distribution request form](https://developer.apple.com/contact/request/unlisted-app/)
   with the App ID and a description of the app's limited audience (internal
   drivers/staff of FTI).
3. In the review notes, mention that unlisted distribution has been requested,
   and provide a demo login so the reviewers can sign in.
4. Once Apple approves the request, the app's distribution method changes to
   **Unlisted** — it is installable only via its direct App Store link, which
   you can share with drivers. Future updates keep the unlisted status; just
   run the release workflow again.

---

## Notes / gotchas

- **Xcode 26 requirement**: since April 28 2026, App Store Connect rejects
  binaries built with older SDKs. The workflows pin `macos-26` runners with
  Xcode `^26` (the newest 26.x on the image). It is deliberately *not*
  `latest-stable`: a compiler change invalidates the whole compiler cache, so
  a jump to Xcode 27 should be a deliberate commit rather than a surprise.
- **CI build caching**: the build workflows cache three things — `node_modules`
  (keyed on `package-lock.json`), the CocoaPods sandbox plus the generated
  `.xcworkspace` (keyed on `ios/Podfile`, `ios/Podfile.lock` and
  `package-lock.json`), and a `ccache` compiler cache
  shared between the TestFlight and release workflows. `npm ci` and
  `pod install` are skipped entirely on an exact cache hit. ccache is enabled
  via `USE_CCACHE=1`, which React Native reads during `pod install` to point
  the Pods targets' compiler at ccache — so **ccache must be installed before
  `pod install` runs**, and changing that step order silently disables it.
  `setup-ios-build` now verifies the compiler wrapper landed in the generated
  Pods project and fails the job if it did not.
  Check the *Report ccache statistics* step to confirm the hit rate; a run
  that recompiles everything from scratch takes ~20 min versus well under 10
  with a warm cache. If a cache ever goes bad, bump the `pods-v3-` key prefix
  or delete the entries from the Actions → Caches page. In the release
  workflow the parallel `build`/`screenshots` jobs share the CocoaPods cache
  key, so on a cold cache one of them logs "Unable to reserve cache" — that
  is expected and harmless (the content is identical).
- **Legacy RN architecture**: the app runs RN 0.81 with `newArchEnabled=false`
  / `RCT_NEW_ARCH_ENABLED=0` because several native modules
  (react-native-push-notification, react-native-blob-util, ...) predate the
  New Architecture. RN 0.81 is the **last** version that allows this — plan a
  New Architecture migration before upgrading RN further.
- **native-base was removed**: the small subset of components the app used is
  re-implemented in `Components/NativeBase.js` (native-base 2.x cannot run on
  React 19).
- **Screenshot capture**: the release lane runs fastlane `snapshot` against a
  simulator before submitting, so expect a longer CI run (+10–15 min). It uses
  the real backend and the demo driver account (`SCREENSHOT_EMAIL` /
  `SCREENSHOT_PASSWORD`) — if the demo driver has no assigned charter, the
  "Today's Charter" / charter detail shots will be empty.
- Concurrent releases are prevented via the shared `ios-release` concurrency
  group, since build numbers are derived from the latest TestFlight build.
- Android is buildable (`cd android && ./gradlew assembleRelease`) but has no
  CI pipeline; the release build falls back to the debug keystore unless
  `FTI_UPLOAD_STORE_FILE/…` gradle properties are provided.
