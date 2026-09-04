# App Store screenshots: debug and validation plan

Goal: make the `screenshots` job of `.github/workflows/ios-appstore-release.yml`
reliably produce the App Store screenshots on the 6.9" iPhone 17 Pro Max
(1320x2868) and have `publish` upload them, so release metadata is automated.

This document is written so that another model (or engineer) can execute it
without re-deriving the analysis. Work through the phases in order; each phase
ends with a concrete pass/fail check. Record results in the "Run log" section
at the bottom as you go.

Constraints agreed with the repository owner:

- 6.9" (iPhone 17 Pro Max) is the correct and only required size. App Store
  Connect uses 6.9" shots for the 6.5" slot; fastlane 2.238 maps 1320x2868 to
  `APP_IPHONE_67` (`vendor/bundle/ruby/3.3.0/gems/fastlane-2.238.0/deliver/lib/deliver/app_screenshot.rb:58`).
  Do not attempt a true 6.5" capture.
- GitHub Actions is the only test bed. There is no Mac for local reproduction.
- Changing app JS/native code is permitted, as long as the changes are minimal
  and defensive.
- `gh` must be installed and authenticated to fetch run logs and artifacts.

---

## 1. Findings so far

### 1.1 Evidence from the logs that were available

Only three `screenshot-test-log` artifacts (from `~/Downloads`) were analysed;
no `simulator-crash-reports` artifact was available because that upload step
was only added in commit `36fc176`. Runs were mapped to commits by timestamp.

| Run | Commit under test | What the log shows |
|---|---|---|
| A: 2026-09-02 19:57Z | before `a684ddd` | UITest target had an empty `PRODUCT_NAME` (`-Runner.app/PlugIns/.xctest`); no test ran. Fixed since by `scripts/add_uitest_target.rb`. |
| B: 2026-09-03 16:23Z | `61e45de` | Launch to automation session 15 s. No SpringBoard alert appeared within the 3 s poll. `welcome-login-button` found at t=26 s, `01-Welcome` captured, tapped at t=30 s, then `login-email` never appeared in 30 s. The app pid (90670) is identical at t=27 s and t=61 s: the app did NOT crash or relaunch in that window. |
| C: 2026-09-03 16:57Z | `7b6a342` | Launch to automation session took 90 s. Alerts appeared and were GRANTED (location, then notifications). Button found; the AX snapshot took 8 s; then `XCUIScreen.main.screenshot()` failed with "Timed out while requesting screenshot". Consistent with a starved runner or a hung app, not a confirmed crash. |
| D+: runs after `45ed45c` up to HEAD `9a5662c` | unknown | Not available locally. These runs (with permissions denied) and their `simulator-crash-reports` artifacts are what would confirm or refute the crash theory. Phase 0 fetches them. |

Conclusion: the "app is crashing" theory is unconfirmed. Run B directly
contradicts it for the welcome -> login step. Commits `ca117b0` and `30b6384`
assumed a relaunch without pid evidence.

### 1.2 Ranked hypotheses

- H1: The welcome tap never navigates (Run B).
  - H1a: permission alerts are requested from JS (`App.js:22` notifications,
    `App.js:26` location via `react-native-get-location`) only after the Hermes
    bundle loads. `dismissSystemAlertsIfPresent()` (`ios/fti_coachUITests/ScreenshotsUITests.swift:71-91`)
    runs in `setUpWithError` and returns as soon as no alert is seen for 5 s, so
    on a slow start the alerts can surface later, sit over the button, or be
    auto-handled by XCTest's default interruption handling mid-tap.
  - H1b: the SignIn screen renders but the element the test waits for is not in
    the accessibility tree. HEAD waits for `staticTexts["LOG IN"]`
    (`SignInScreen.js:137`) and `textFields.firstMatch`; this is unverified.
- H2: Login can never complete on a CI simulator. `Screens/Auth/SignInScreen.js:43`
  does `const token = await messaging().getToken()` OUTSIDE the `try` that
  starts at line 57. RNFB rejects `getToken` when the app is not registered for
  remote notifications or has no APNS token
  (`node_modules/@react-native-firebase/messaging/ios/RNFBMessaging/RNFBMessagingModule.m:125-143`),
  which is the normal state on a simulator. The rejection is unhandled,
  `loading` stays `true`, the login button shows a spinner forever, and the
  test times out waiting for "Charter" (`ScreenshotsUITests.swift:166`). This
  blocks screenshots 03-10 regardless of H1.
- H3: Release-fatal render crash after login. `Screens/NonAuth/DrawerProfile.js:37,46`
  read `user.data.name` / `user.data.email`; initial `user` is `{}`
  (`Redux/UserDetails.js:8`) and `Navigation/DrawerStack.js:73-77` still
  renders the drawer when `get_profile` fails. An uncaught JS exception in a
  Release build is `RCTFatal` (`node_modules/react-native/React/CoreModules/RCTExceptionsManager.mm:75-83`).
- H4: Native crash on permission GRANT (the original theory).
  `node_modules/react-native-get-location/ios/ReactNativeGetLocationLibrary/LocationModule.m:192,210`
  call `mReject(...)` with no nil check (lines 126 and 133 do check). If the
  authorization callback fires twice, a nil block is invoked -> EXC_BAD_ACCESS.
  Only reachable when alerts are granted; HEAD denies them. Confirm or refute
  with an `.ips` file.
- H5: Runner starvation / slow cold start (Run C). The simulator Release build
  is universal (`ONLY_ACTIVE_ARCH = YES` is set only in Debug,
  `ios/fti_coach.xcodeproj/project.pbxproj:568`), and nothing pre-boots the
  simulator before `app.launch()`, so the first launch pays the boot cost.
- Minor, non-blocking: `Screens/NonAuth/HomeScreen.js:56` uses `Platform`
  without importing it (ReferenceError inside an async function; unhandled
  rejection, not fatal). `API/API.js` has a trailing slash so URLs are
  `https://fticoachcharters.com//api/...` (works, but noisy).

### 1.3 Confirmed non-issues (do not spend time here)

- Device/size: `fastlane/Snapfile` targets iPhone 17 Pro Max; correct.
- `TEST_RUNNER_*` forwarding of credentials and `SIMULATOR_HOST_HOME` /
  `SIMULATOR_DEVICE_NAME` (`fastlane/Fastfile` screenshots lane); correct.
- `SnapshotHelper.swift` guards fail loudly if those are missing; correct.
- Shared scheme Test action is Release and the UITest target is a testable
  (`ios/fti_coach.xcodeproj/xcshareddata/xcschemes/fti_coach.xcscheme:25-42`).
- The JS bundle is embedded in Release (`react-native-xcode.sh` only skips on
  Debug simulator builds); `AppDelegate.swift:100-106` loads `main.jsbundle`.
- Pods / ccache caching in `.github/actions/setup-ios-build/action.yml` is
  sound. Do not touch it while debugging screenshots.

---

## 2. Phase 0: obtain the missing evidence (about 30 minutes)

1. Install and authenticate `gh` (`gh auth login`, needs `repo` and `actions`
   scopes for `foxytravel/fti_mobile`).
2. List recent runs:

   ```sh
   gh run list --workflow ios-appstore-release.yml --limit 10 --json databaseId,headSha,conclusion,createdAt
   ```

3. For every run whose `headSha` is at or after `45ed45c`:

   ```sh
   gh run view <id> --log-failed > /tmp/opencode/run-<id>-failed.log
   gh run download <id> -D /tmp/opencode/run-<id> -n screenshot-test-log -n simulator-crash-reports -n screenshots
   ```

   (`-n` for an artifact that does not exist fails; drop that name and retry.)
4. In each `fti_coach-fti_coach.log`, extract the block from
   `Test Suite 'All tests' started` to `Test session results`. Record:
   - seconds between `Launch com.foxytravel.fticoach` and
     `Setting up automation session`;
   - which SpringBoard alert buttons, if any, were tapped;
   - the failing assertion (`ScreenshotsUITests.swift:<line>: error: ...`);
   - whether the pid in `Requesting snapshot of accessibility hierarchy for
     app with pid N` changes during the run. A changing pid is a real
     relaunch; a constant pid rules out a crash for that window.
5. If any `.ips` file exists, read `procName`, `exception`, and the top frames
   of the crashed thread:
   - frames in `LocationModule` / `CLLocationManager` -> H4;
   - `RCTFatal`, `RCTExceptionsManager`, `hermes::vm` -> a JS fatal (H3 class);
     the JS message is in the `.ips` `exception.message` or in the app console;
   - no `.ips` and constant pid -> not a crash; move on to H1/H2/H5.
6. Write a one-paragraph verdict per run into the Run log below BEFORE
   changing anything.

Pass condition: each post-`45ed45c` run has a verdict naming the hypothesis it
supports.

---

## 3. Phase 1: build a cheap, diagnosable harness (no app changes yet)

Rationale: every iteration of the release workflow also runs a 60-90 minute
signed device build and cannot be re-run without bumping the version.
Debugging needs a screenshots-only loop with rich artifacts.

### 3.1 New workflow `.github/workflows/ios-screenshots-debug.yml`

- `on: workflow_dispatch`, single job on `macos-26`, `timeout-minutes: 90`.
- Steps: `actions/checkout@v7` -> `./.github/actions/setup-ios-build` with
  `ccache-key-prefix: ccache-ios-simulator` (shares the release job's cache)
  and `backend-api-key: ${{ secrets.BACKEND_API_KEY }}` ->
  `bundle exec fastlane ios screenshots` with `SCREENSHOT_EMAIL` /
  `SCREENSHOT_PASSWORD` and `continue-on-error: true` -> a step that prints
  `uname -m`, `xcrun simctl list devices --json`, and
  `ls -la fastlane/screenshots/en-US` -> `actions/upload-artifact@v7` with
  `if: always()` for each of:
  - `fastlane/screenshots` (PNGs and `screenshots.html`)
  - `~/Library/Logs/snapshot/*.log`
  - `~/Library/Logs/DiagnosticReports/*.ips`
  - the `.xcresult` (see 3.2)
  - `~/Library/Logs/snapshot/simulator-app.log` (see 3.3)
- Final step: fail the job if the fastlane step failed, so the run status is
  still meaningful.
- Optional input `only_first_screens: boolean` that sets
  `TEST_RUNNER_SCREENSHOT_STOP_AFTER=02` and makes the test return after
  `02-SignIn` (guard in Swift). Useful for isolating H1 from H2/H3.

### 3.2 Keep the `.xcresult`

The xcresult bundle contains XCTest's automatic per-step screenshots, the
accessibility hierarchy at the moment of failure, and any app crash log. It is
the single most useful artifact and is currently discarded (it lives in a
`snapshot_derived*` temp dir).

- `fastlane/Snapfile`: add `derived_data_path("ios/build/snapshot-derived")`
  and `result_bundle(true)`.
- Upload `ios/build/snapshot-derived/Logs/Test/*.xcresult` and
  `fastlane/screenshots/**/*.xcresult` (snapshot may put it in either place
  depending on `result_bundle`).
- Add `ios/build/snapshot-derived` to `.gitignore` if not already covered by
  `ios/build`.
- To inspect: `xcrun xcresulttool get --path X.xcresult --format json` and
  `xcrun xcresulttool export --path X.xcresult --output-path out --type directory`
  (needs a Mac; if none is available, `unzip`ing the artifact and opening
  `Data/` PNG attachments still works on Linux).

### 3.3 Capture the app console

A Release JS fatal, the RNFB `getToken` rejection message, and the
`NSLog("[locationManager ...]")` lines from `LocationModule.m` are only
visible in the simulator's unified log.

In `fastlane/Fastfile`, screenshots lane, after `ensure_screenshot_device`:

```ruby
udid = `xcrun simctl list devices available -j`  # parse JSON, find device by name
sh("xcrun", "simctl", "boot", udid) rescue nil    # already booted is fine
sh("xcrun", "simctl", "bootstatus", udid, "-b")
log_path = File.expand_path("~/Library/Logs/snapshot/simulator-app.log")
FileUtils.mkdir_p(File.dirname(log_path))
log_pid = Process.spawn(
  "xcrun", "simctl", "spawn", udid, "log", "stream", "--style", "compact",
  "--predicate", 'process == "fti_coach" OR process == "SpringBoard" OR eventMessage CONTAINS "fticoach"',
  out: log_path, err: log_path,
)
begin
  snapshot
ensure
  Process.kill("TERM", log_pid) rescue nil
end
```

Pre-booting also removes the first-boot cost from `app.launch()` (H5).

### 3.4 Test-side diagnostics in `ios/fti_coachUITests/ScreenshotsUITests.swift`

- Add `private func step(_ name: String, timeout: TimeInterval, _ condition: () -> Bool)`
  that polls `condition`, and on failure attaches `app.debugDescription`,
  `XCUIScreen.main.screenshot()`, and `app.state.rawValue` as `XCTAttachment`s
  (lifetime `.keepAlways`), `NSLog`s a short summary (this lands in
  `~/Library/Logs/snapshot/*.log`), then `XCTFail`s.
- After every step assert `app.state == .runningForeground`. `.notRunning`
  here is the definitive crash signal; `.runningBackground` means an alert or
  another app is in front.
- Replace bare `XCTAssertTrue(...)` calls with the helper.
- Honour `SCREENSHOT_STOP_AFTER` (see 3.1).

### 3.5 Baseline run

Run `ios-screenshots-debug` once on HEAD with nothing else changed. Expected
cost 25-35 minutes with warm caches. Read the xcresult, the snapshot log and
`simulator-app.log`, and record in the Run log which of H1-H5 is live.

Pass condition: the run produces all artifacts (even though the test fails)
and the failure can be attributed to a single hypothesis.

---

## 4. Phase 2: fix in order of certainty, one change per run

For each step: make the change, run `ios-screenshots-debug`, read the
artifacts, record the result. Do not stack unverified changes.

### 2a. Remove the permission-alert race (H1a, and avoids H4)

Preferred: suppress the permission prompts at source during screenshot runs.

- `ios/fti_coach/AppDelegate.swift`: `setupSnapshot(app)` passes
  `-FASTLANE_SNAPSHOT YES` as a launch argument, which UIKit mirrors into
  `UserDefaults`. Read
  `UserDefaults.standard.bool(forKey: "FASTLANE_SNAPSHOT")` and pass
  `initialProperties: ["isScreenshotRun": true]` to
  `startReactNative(withModuleName:in:initialProperties:launchOptions:)`
  (`node_modules/react-native/Libraries/AppDelegate/RCTReactNativeFactory.h:101`).
- `App.js:20-28`: when `props.isScreenshotRun` is true, skip
  `PushNotificationIOS.requestPermissions()` and `getLocationdata()`.
- Fallback if the native flag is not wanted: in the lane run
  `xcrun simctl privacy <udid> grant location com.foxytravel.fticoach` before
  `snapshot` (verify it applies pre-install), and in `setUpWithError`
  register `addUIInterruptionMonitor(withDescription:)` that taps
  "Don't Allow" / "Not Now" / "Allow" for anything left, then keep the
  explicit alert poll immediately before the first tap (an interruption
  monitor only fires when a query is blocked, so a stray `tap()` is needed
  to trigger it).
- Validation: the snapshot log shows zero SpringBoard alert taps;
  `01-Welcome` and `02-SignIn` are captured; `app.state` remains
  `.runningForeground`.

### 2b. Make login survive the simulator (H2)

`Screens/Auth/SignInScreen.js:41-49`:

```js
let token = '';
try {
  token = await messaging().getToken();
} catch (e) {
  console.warn('FCM token unavailable, logging in without one', e?.message);
}
```

If the backend rejects an empty `fcm_token` (check `res.data.Message` in
`simulator-app.log`), use a fixed placeholder such as `'screenshot-runner'`.

Validation: `03-Home` captured; the "Charter" header exists.

### 2c. Null-safety on the home path (H3 and minor)

- `Screens/NonAuth/DrawerProfile.js:37,46`: `user?.data?.name ?? 'N/A'` and
  `user?.data?.email ?? 'N/A'`.
- `Screens/NonAuth/HomeScreen.js`: add `Platform` to the `react-native`
  import used at line 56.
- Validation: `04`-`10` captured; `app.state` stays `.runningForeground`
  throughout; no `TypeError` in `simulator-app.log`.

### 2d. Reduce cold-start fragility (H5)

- `fastlane/Snapfile` `xcargs`: add `ONLY_ACTIVE_ARCH=YES` (halves the
  simulator compile and the binary size).
- Keep the pre-boot from 3.3.
- Keep `number_of_retries(0)`.
- Optional: set `SNAPSHOT_SIMULATOR_WAIT_FOR_BOOT_TIMEOUT` if
  `override_status_bar` is ever enabled.
- Validation: "Launch -> Setting up automation session" is 30 s or less in
  two consecutive runs.

### 2e. Only if Phase 0/1 shows a genuine native crash in `LocationModule`

Guard `mReject` at `LocationModule.m:192` and `:210` (`if (mReject != nil)`)
via `patch-package` (add `"postinstall": "patch-package"` to `package.json`
and commit `patches/react-native-get-location+5.0.0.patch`), or replace the
library with `@react-native-community/geolocation`. Step 2a already avoids
this code path during screenshots; 2e is belt-and-braces for real users.

---

## 5. Phase 3: end-to-end validation

1. `ios-screenshots-debug` green twice in a row with at least 9 PNGs
   (`MIN_SCREENSHOT_COUNT` in `fastlane/Fastfile`), each 1320x2868
   (`file fastlane/screenshots/en-US/*.png`). Open them: no alerts, no
   spinners, real data on Home and Today's Charter (the demo driver must have
   an assigned charter; see `RELEASING.md`).
2. Port the artifact uploads proven in the debug workflow (xcresult,
   `simulator-app.log`) into the `screenshots` job of
   `ios-appstore-release.yml`.
3. Run `iOS App Store Release` with `submit_for_review=false` (dry run).
   Confirm: `screenshots` job passes, `publish` uploads, and in App Store
   Connect the new version shows the screenshots under "iPhone 6.9" Display".
   No commit or tag is pushed unless `publish` succeeds, so a failure here is
   safe to retry.
4. Run for real with `submit_for_review=true`.
5. Update `RELEASING.md` "Screenshots" section: how to run the debug
   workflow, where each artifact is and what it tells you, the
   `isScreenshotRun` flag, and a note that `ios/.xcode.env.local` (gitignored,
   local only) pins Node 16 and will break a local Mac build.

---

## 6. Decision tree for a failed debug run

- `app.state == .notRunning`, pid changes, or an `.ips` is present -> a real
  crash. Read the `.ips`: `LocationModule` frames -> 2a/2e; `RCTFatal` ->
  find the JS stack in `simulator-app.log` and fix that component.
- Fails at "login screen never appeared", app still running, SpringBoard
  alert visible in the failure screenshot -> 2a not effective; check the
  interruption monitor and the `isScreenshotRun` plumbing.
- Fails at "login screen never appeared", no alert visible, welcome still on
  screen -> the tap is being dropped; capture `app.debugDescription`, confirm
  the button is `isHittable`, and try `welcomeButton.coordinate(withNormalizedOffset: CGVector(dx: 0.5, dy: 0.5)).tap()`.
- Fails at "login screen never appeared" but the failure screenshot shows the
  SignIn screen -> H1b; the element query is wrong, fix the selector from the
  attached `debugDescription`.
- `02-SignIn` OK, "Charter" never appears, spinner in the failure
  screenshot -> H2; look for `messaging/unregistered` or the backend
  `Message` in `simulator-app.log`.
- "Charter" OK, a drawer screen fails -> H3 class; look for `TypeError` in
  `simulator-app.log`.
- Launch over 60 s, or "Timed out while requesting screenshot" -> H5; check
  `ONLY_ACTIVE_ARCH`, the pre-boot, and `uname -m` (an x86_64 runner is much
  slower; `macos-26` should be arm64).
- Test passes but fewer than 9 PNGs -> a `snapshot()` call was skipped
  (e.g. the `View Charter Detail` branch); check the demo account has data.

---

## 7. Files to touch

- New: `.github/workflows/ios-screenshots-debug.yml`
- `fastlane/Fastfile` (screenshots lane: pre-boot, log stream, cleanup)
- `fastlane/Snapfile` (`derived_data_path`, `result_bundle`, `ONLY_ACTIVE_ARCH=YES`)
- `ios/fti_coachUITests/ScreenshotsUITests.swift` (diagnostics helper,
  `app.state` asserts, interruption monitor, `SCREENSHOT_STOP_AFTER`)
- `ios/fti_coach/AppDelegate.swift` (`isScreenshotRun` initial property)
- `App.js`, `Screens/Auth/SignInScreen.js`, `Screens/NonAuth/DrawerProfile.js`,
  `Screens/NonAuth/HomeScreen.js`
- `.github/workflows/ios-appstore-release.yml` (extra artifact uploads, after
  they are proven in the debug workflow)
- `RELEASING.md`
- Optional: `patches/react-native-get-location+5.0.0.patch`, `package.json`

---

## 8. Run log

Fill in as you go. One entry per CI run.

| Date | Workflow / run id | Commit | Change under test | Launch time | Failure point | Hypothesis supported | Notes |
|---|---|---|---|---|---|---|---|
| 2026-09-02 19:57Z | ios-appstore-release (artifact A) | pre-`a684ddd` | n/a | n/a | test target misconfigured | none | fixed by `add_uitest_target.rb` |
| 2026-09-03 16:23Z | ios-appstore-release (artifact B) | `61e45de` | n/a | 15 s | `login-email` not found after tap | H1 | pid constant, no crash |
| 2026-09-03 16:57Z | ios-appstore-release (artifact C) | `7b6a342` | n/a | 90 s | screenshot request timed out | H5 (alerts granted) | possibly H4; no `.ips` available |
| 2026-09-03 17:08Z | ios-appstore-release (run 33782741580) | `45ed45c` | n/a | n/a | n/a | n/a | baseline commit for Phase 0 analysis |
| 2026-09-03 17:53Z | ios-appstore-release (run 33787249898) | `ca117b0` | retry welcome->login navigation across a presumed relaunch | 13.2 s | retry-loop `welcome-login-button` re-wait, after two `login-email` waits failed | H1b; no relaunch/crash | Single launch; app PID 63632 constant. PID 60338 was SpringBoard, not an app relaunch. Welcome disappeared after retry tap, but `login-email` never appeared. No `.ips`. |
| 2026-09-03 18:34Z | ios-appstore-release (run 33791327297) | `36fc176` | upload simulator crash reports | 16.9 s | retry-loop `welcome-login-button` re-wait after failed `login-email` waits | H1b; no relaunch/crash | Single launch; app PID 58154 constant. PID 54772 was SpringBoard. No app `.ips`. |
| 2026-09-03 19:47Z | ios-appstore-release (run 33798534752) | `30b6384` | longer settle + more tap retries | 13.0 s | retry-loop `welcome-login-button` re-wait after failed `login-email` waits | H1b; no relaunch/crash | Single launch; app PID 66915 constant. PID 61266 was SpringBoard. Navigation proceeded, but `login-email` was not exposed. No `.ips`. |
| 2026-09-03 20:33Z | ios-appstore-release (run 33802997305) | `b424829` | detect sign-in via LOG IN title | 123.8 s | `login-email` not found after LOG IN appeared | H1b+H5 | Single launch; app PID 61985 constant. PID 57230 was SpringBoard. LOG IN appeared, but `login-email` did not. No `.ips`. |
| 2026-09-03 21:16Z | ios-appstore-release (run 33807052977) | `9a5662c` | find email/password by type | 16.4 s | `app.textFields.firstMatch` failed | **H1b** | Single launch; app PID 66010 constant. PID 60829 was SpringBoard. LOG IN appeared, but no `.textField` existed. No `.ips`. |
| 2026-09-04 01:59Z | ios-screenshots-debug (run 33827814872) | `7f91d9b` | baseline of new debug harness | 28.3 s | email field not found via `app.textFields.firstMatch` | H1b; H1a still live | Tapped two SpringBoard alerts; 01-Welcome captured; app PID 61707 constant. No app `.ips`. |
| 2026-09-04 02:39Z | ios-screenshots-debug (run 33830333190) | `7f91d9b` | duplicate baseline dispatch | 16.2 s | email field not found via `app.textFields.firstMatch` | H1b | Same result as 33827814872; app PID 65151 constant. No app `.ips`. |
| 2026-09-04 02:39Z | ios-screenshots-debug (run 33830358174) | `9fd50a7` | permission suppression + debug harness instrumentation | n/a | Swift compile errors in `XCTAttachment` initializers | none | Build-only failure; test never ran. Fixed by `23e6164`. |
| 2026-09-04 03:02Z | ios-screenshots-debug (run 33831734983) | `23e6164` | fix `XCTAttachment(data:)` initialization | 14.6 s | `otherElements["login-email"]` not found | H1a fixed; H1b | Zero alerts; 01-Welcome captured; app PID 40637 constant. No app `.ips`. |
| 2026-09-04 03:49Z | ios-screenshots-debug (run 33834592445) | `75e0e45` | accessible View wrapper around `CustomTextInput` | 48.6 s | wrapper found, but `typeText` reported no keyboard focus | H1b | `login-email` was a non-focusable `Other`; app PID 43065 constant. No app `.ips`. |
| 2026-09-04 04:15Z | ios-screenshots-debug (run 33836166236) | `2910c45` | remove `accessible` from input wrapper | n/a | `xcodebuild -showBuildSettings` timed out | none | Test never built; `derived_data_path` was implicated and removed next. |
| 2026-09-04 04:32Z | ios-screenshots-debug (run 33837219773) | `6a3e1d4` | remove `derived_data_path` and `result_bundle` | 47.5 s | `byID("login-email")` not found | H1b | Zero alerts; 01-Welcome captured; app PID 40029 constant. No app `.ips`. |
| 2026-09-04 04:59Z | ios-screenshots-debug (run 33838836936) | `5f60c3c` | remove View wrapper from `CustomTextInput` | n/a | Metro syntax error in `CustomTextInput.js` | none | Bundle-only failure; test never ran. Fixed by `fad5e6f`. |
| 2026-09-04 05:27Z | ios-screenshots-debug (run 33840579414) | `fad5e6f` | wrap `CustomTextInput` siblings in a Fragment | n/a | `xcodebuild -showBuildSettings` timed out | none | Test never built; led to the 60-second timeout in `db6e876`. |
| 2026-09-04 11:49Z | ios-screenshots-debug (run 33869757659) | `db6e876` | increase show-build-settings timeout to 60 s | 10.4 s | `byID("login-email")` not found | H1b | Tooling fix effective; zero alerts; app PID 38216 constant. No app `.ips`. |
| 2026-09-04 12:23Z | ios-screenshots-debug (run 33872534494) | `9d8aaec` | add H1b accessibility diagnostics | 24.2 s | email field not found after diagnostic probes | H1b | `byLabel=false`, `byTextField=false`, `byAnyTextField=false`; no text field anywhere on SignIn. App PID 39903 constant. |
| 2026-09-04 13:08Z | ios-screenshots-debug (run 33876433381) | `61f9cf0` | expand AX-tree diagnostics | n/a | Swift compile errors in diagnostic helper | none | Build-only failure; fixed by `9cb13ba`. |
| 2026-09-04 13:39Z | ios-screenshots-debug (run 33879251169) | `9cb13ba` | compile-safe AX element-pattern dump | 22.9 s | email field not found after full pattern dump | **H1b (definitive)** | AX exposed hittable `Other` elements labeled Email and Password, both with no identifier; no text/secure fields or placeholders. App PID 46825 constant. |
| 2026-09-04 14:22Z | ios-screenshots-debug (run 33883387440) | `61f201a` | pass `accessible=true` and label to `FloatingLabelInput` | 104.8 s | `byID("login-email")` not found | H1b+H5 | Only doubled labels to `Email Email` / `Password Password`; still `Other` with no identifier. App PID 45116 constant. |
| 2026-09-04 15:26Z | ios-screenshots-debug (run 33889481215) | `d8d043a` | tap Email/Password labels, then call `app.typeText` | 11.8 s | email `typeText`: no descendant had keyboard focus | H1b | Label existed and was hittable, but no accessible field gained focus. App PID 42669 constant. No app `.ips`. |
| 2026-09-04 16:13Z | ios-screenshots-debug (run 33893933016) | `b852bb9` | wait for keyboard after tapping label | 26.0 s | email `typeText`: no descendant had keyboard focus | H1b | Keyboard appeared, proving native focus, but no AX element reported focus. App PID 43834 constant. |
| 2026-09-04 17:00Z | ios-screenshots-debug (run 33898252859) | `183037f` | coordinate-tap label + focus settle delay | 11.5 s | email `typeText`: no descendant had keyboard focus | H1b | Keyboard appeared; coordinate tap and delay did not expose a focused AX element. App PID 44406 constant. |
| 2026-09-04 17:38Z | ios-screenshots-debug (run 33901656491) | `d16b41e` | retry `.textField` lookup after native focus | 25.6 s | fallback email `typeText`: no descendant had keyboard focus | H1b | Keyboard appeared, but no `.textField` appeared after focus. App PID 41409 constant. No app `.ips`. |
| 2026-09-04 19:29Z | ios-screenshots-debug (run 33911411329) | `95b2684` | disable accessibility on FloatingLabelInput's touchable ancestor | 31.8 s | `Charter` did not appear within 60 s after login tap | H1b fixed; H2 now live | XCTest found and typed into both fields, then captured 01-Welcome and 02-SignIn. App PID 51628 remained constant; the only `.ips` was for the unrelated runner `conftest` process. |

PID attribution correction: XCTest logs the PID of the application targeted by
each query. The lower PID in the earlier rows belongs to SpringBoard alert
queries; the other PID belongs to FTI Coach. Across every inspected run, the
app PID stayed constant, each log contained one app launch, and no app `.ips`
was produced. There is no positive crash or relaunch evidence. The consistent
failure is H1b: `FloatingLabelInput` collapses its inner `TextInput` out of the
accessibility tree.
