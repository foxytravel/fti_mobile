# Releasing FTI Coach (iOS)

CI/CD is handled by GitHub Actions + fastlane:

| Workflow | Trigger | What it does |
|---|---|---|
| `iOS TestFlight` | push to `main`, or manual | Auto-bumps the build number (latest TestFlight build + 1), builds with Xcode 26, uploads to TestFlight |
| `iOS App Store Release` | manual (`workflow_dispatch`) | Bumps the marketing version (patch/minor/major or explicit), builds, uploads, **submits for App Store review**, commits the version bump back and tags `vX.Y.Z` |

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

### 4. Replace the Firebase iOS config (required)

`ios/GoogleService-Info.plist` is still registered to the old bundle ID
(`org.reactjs.native.example.fti-coach`). Push notifications will not work
until it is replaced:

1. [Firebase console](https://console.firebase.google.com/) → project **fticoach** → *Add app* → iOS.
2. Bundle ID: `com.foxytravel.fticoach`.
3. Download the new `GoogleService-Info.plist` and replace `ios/GoogleService-Info.plist`.
4. Upload your **APNs Authentication Key** under *Project settings → Cloud Messaging → Apple app configuration* if not already present.

### 5. Commit `ios/Podfile.lock` after the first CI run

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
   (description, screenshots, privacy policy URL, App Privacy questionnaire) —
   the workflow intentionally does not manage metadata.
2. Run the *iOS App Store Release* workflow from the Actions tab. Choose
   `patch`/`minor`/`major`, or type an explicit version.
3. The workflow uploads the build, creates the App Store version, submits it
   for review, and pushes a `vX.Y.Z` tag + version-bump commit to `main`.
4. Review the submission status in App Store Connect.

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
  `latest-stable` Xcode.
- **Legacy RN architecture**: the app runs RN 0.81 with `newArchEnabled=false`
  / `RCT_NEW_ARCH_ENABLED=0` because several native modules
  (react-native-push-notification, react-native-blob-util, ...) predate the
  New Architecture. RN 0.81 is the **last** version that allows this — plan a
  New Architecture migration before upgrading RN further.
- **native-base was removed**: the small subset of components the app used is
  re-implemented in `Components/NativeBase.js` (native-base 2.x cannot run on
  React 19).
- Concurrent releases are prevented via the shared `ios-release` concurrency
  group, since build numbers are derived from the latest TestFlight build.
- Android is buildable (`cd android && ./gradlew assembleRelease`) but has no
  CI pipeline; the release build falls back to the debug keystore unless
  `FTI_UPLOAD_STORE_FILE/…` gradle properties are provided.
