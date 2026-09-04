import XCTest

/// UI tests that drive the app through its key screens and capture screenshots
/// for the App Store listing. Run via `fastlane ios screenshots`
/// (fastlane snapshot). The demo driver account is supplied through the
/// SCREENSHOT_EMAIL / SCREENSHOT_PASSWORD environment variables.
@MainActor
final class ScreenshotsUITests: XCTestCase {

    private var app: XCUIApplication!

    override func setUpWithError() throws {
        continueAfterFailure = false
        app = XCUIApplication()
        // setupSnapshot must run *before* launch: it works by appending launch
        // arguments (locale, and the flag that puts the app in snapshot mode),
        // which have no effect on an already-running process.
        setupSnapshot(app)
        app.launch()
        dismissSystemAlertsIfPresent()
    }

    override func tearDownWithError() throws {
        app = nil
    }

    /// Reads a value injected by CI.
    ///
    /// `xcodebuild` does not forward the host's environment into the test
    /// runner; variables have to be prefixed with `TEST_RUNNER_`, which it
    /// strips on the way in. The unprefixed name is therefore what normally
    /// arrives here, but the prefixed one is accepted as a fallback so a
    /// misconfigured runner degrades to a clear assertion rather than a
    /// confusing empty-credentials failure.
    private static func injectedValue(_ name: String) -> String {
        let environment = ProcessInfo.processInfo.environment
        return environment[name] ?? environment["TEST_RUNNER_\(name)"] ?? ""
    }

    /// Returns true when the test should stop after the given screen prefix
    /// (e.g. "02" stops after 02-SignIn). Empty/missing means run all.
    private func shouldStop(after prefix: String) -> Bool {
        let stopAfter = Self.injectedValue("SCREENSHOT_STOP_AFTER")
        return !stopAfter.isEmpty && stopAfter == prefix
    }

    /// Element matched by its accessibility identifier (testID).
    private func byID(_ identifier: String) -> XCUIElement {
        app.descendants(matching: .any).matching(identifier: identifier).firstMatch
    }

    /// Waits until the element exists and is hittable.
    @discardableResult
    private func waitForHittable(
        _ element: XCUIElement,
        timeout: TimeInterval = 15
    ) -> Bool {
        let deadline = Date().addingTimeInterval(timeout)
        while Date() < deadline {
            if element.exists && element.isHittable {
                return true
            }
            usleep(200_000)
        }
        return element.exists && element.isHittable
    }

    /// Attaches diagnostic info and fails the test with a clear message.
    private func failWithDiagnostics(_ message: String, file: StaticString = #file, line: UInt = #line) {
        if let data = app.debugDescription.data(using: .utf8) {
            let attachment = XCTAttachment(data: data, uniformTypeIdentifier: "public.plain-text")
            attachment.name = "app-debugDescription"
            attachment.lifetime = .keepAlways
            add(attachment)
        }

        // Log the full debugDescription to the test log (may be truncated in CI)
        NSLog("[ScreenshotsUITests] FULL app.debugDescription:\n\(app.debugDescription)")

        let stateText = "app.state = \(app.state.rawValue)"
        if let stateData = stateText.data(using: .utf8) {
            let stateAttachment = XCTAttachment(data: stateData, uniformTypeIdentifier: "public.plain-text")
            stateAttachment.name = "app-state"
            stateAttachment.lifetime = .keepAlways
            add(stateAttachment)
        }

        let screenshot = XCUIScreen.main.screenshot()
        let screenshotAttachment = XCTAttachment(screenshot: screenshot)
        screenshotAttachment.name = "failure-screenshot"
        screenshotAttachment.lifetime = .keepAlways
        add(screenshotAttachment)

        NSLog("[ScreenshotsUITests] FAIL: \(message) | app.state=\(app.state.rawValue)")
        XCTFail(message, file: file, line: line)
    }

    /// Asserts the app is in the foreground; if not, it has crashed or an alert
    /// is covering it.
    private func assertAppRunning(file: StaticString = #file, line: UInt = #line) {
        guard app.state != .runningForeground else { return }
        failWithDiagnostics(
            "app is not in foreground (state=\(app.state.rawValue)); possible crash or overlay",
            file: file, line: line,
        )
    }

    /// Dismisses the iOS permission alerts (notifications, location, ...) that
    /// the Springboard shows shortly after launch.
    ///
    /// Permissions are deliberately DENIED, not granted: the app requests
    /// location (react-native-get-location) and notification permissions
    /// during startup, and granting them on a first cold launch has been seen
    /// to crash the Release build right after the permission callback fires.
    /// Denying is safe — the app handles both denials gracefully (location has
    /// a .catch, notifications are optional) — and it keeps the app in the
    /// stable welcome state needed for screenshots.
    private func dismissSystemAlertsIfPresent() {
        let springboard = XCUIApplication(bundleIdentifier: "com.apple.springboard")
        let preferred = [
            "Don't Allow",
            "Not Now",
            "Cancel",
            "OK",
        ]
        for _ in 0..<16 {
            let alert = springboard.alerts.firstMatch
            guard alert.waitForExistence(timeout: 5) else { return }
            if let button = preferred
                .compactMap({ alert.buttons[$0].exists ? alert.buttons[$0] : nil })
                .first {
                button.tap()
            } else if alert.buttons.firstMatch.exists {
                alert.buttons.firstMatch.tap()
            }
            usleep(500_000)
        }
    }

    func testCaptureScreenshots() {
        let email = Self.injectedValue("SCREENSHOT_EMAIL")
        let password = Self.injectedValue("SCREENSHOT_PASSWORD")
        XCTAssertFalse(
            email.isEmpty || password.isEmpty,
            """
            SCREENSHOT_EMAIL and SCREENSHOT_PASSWORD are empty inside the test \
            runner. fastlane must export them as TEST_RUNNER_SCREENSHOT_EMAIL \
            and TEST_RUNNER_SCREENSHOT_PASSWORD before invoking xcodebuild; \
            see the screenshots lane in fastlane/Fastfile.
            """
        )

        // 1. Welcome screen. The app is a Release/Hermes build, so on a cold
        // simulator the JS bundle can take a while to evaluate; wait for the
        // button to be hittable (not just present) before tapping, otherwise
        // the tap can land before the touch handlers are attached and be
        // silently dropped. The startup permission alerts are denied (see
        // dismissSystemAlertsIfPresent) so the app stays stable; a short
        // settle delay gives the first frame a moment to settle before the
        // screenshot is requested.
        let welcomeButton = byID("welcome-login-button")
        XCTAssertTrue(waitForHittable(welcomeButton, timeout: 60))
        assertAppRunning()
        app.wait(for: .runningForeground, timeout: 10)
        // Hermes keeps binding the huge Release bundle well after the first
        // frame appears; without this the synthesized tap is delivered before
        // the RNTouchable handler is live and is silently dropped.
        sleep(10)
        snapshot("01-Welcome")
        if shouldStop(after: "01") { return }

        // 2. Sign in screen. The app can take a long time on a cold start before
        // the touch pipeline accepts taps; a tap landing during that window is
        // dropped. Retry the tap until the login screen actually appears,
        // re-waiting for the button each time and giving the app a longer
        // settle between attempts. Navigation is detected via the "LOG IN"
        // header text (a plain Text, always exposed) rather than login-email,
        // whose testID may not propagate through the FloatingLabelInput wrapper.
        let loginTitle = app.staticTexts["LOG IN"]
        var navigated = false
        for _ in 0..<4 {
            if loginTitle.waitForExistence(timeout: 8) {
                navigated = true
                break
            }
            XCTAssertTrue(waitForHittable(welcomeButton, timeout: 30))
            welcomeButton.tap()
            sleep(5)
        }
        XCTAssertTrue(navigated || loginTitle.waitForExistence(timeout: 30),
                      "login screen never appeared after tapping welcome-login-button")

        // FloatingLabelInput's TouchableWithoutFeedback must not collapse its
        // accessible descendants. The package patch leaves the inner native
        // TextInput exposed with the testID supplied by CustomTextInput.
        let emailField = byID("login-email")
        let emailFound = emailField.waitForExistence(timeout: 15)
        if !emailFound {
            NSLog("DIAGNOSTIC: email field not found by testID 'login-email'")
            NSLog("DIAGNOSTIC: app.debugDescription follows:")
            NSLog(app.debugDescription)

            let byLabel = app.otherElements["login-email"].firstMatch
            let byTextField = app.textFields.matching(identifier: "login-email").firstMatch
            let byAnyTextField = app.textFields.firstMatch
            NSLog("DIAGNOSTIC: byLabel exists=\(byLabel.exists), byTextField exists=\(byTextField.exists), byAnyTextField exists=\(byAnyTextField.exists)")

            failWithDiagnostics("email field not found on the sign-in screen")
            return
        }
        emailField.tap()
        emailField.typeText(email)

        let passwordField = byID("login-password")
        XCTAssertTrue(passwordField.waitForExistence(timeout: 10))
        passwordField.tap()
        passwordField.typeText(password)

        // Dismiss the keyboard by tapping the screen title, then log in.
        app.staticTexts["LOG IN"].firstMatch.tap()
        XCTAssertTrue(byID("login-button").waitForExistence(timeout: 15))
        snapshot("02-SignIn")
        byID("login-button").tap()
        if shouldStop(after: "02") { return }

        // 3. Home / dashboard. The header only appears once the profile and job
        //    data have loaded, so this doubles as a "logged in" signal.
        XCTAssertTrue(app.staticTexts["Charter"].firstMatch.waitForExistence(timeout: 60))
        assertAppRunning()
        snapshot("03-Home")

        // 4. Today's Charter list
        goToDrawerScreen(itemID: "drawer-item-Today's Charter", waitForTitle: "Today's Charter")
        snapshot("04-TodaysCharter")

        // 5. Charter details (first job card) — skipped when there is no job.
        let charterDetail = app.buttons["View Charter Detail"].firstMatch
        if charterDetail.waitForExistence(timeout: 10) {
            if !charterDetail.isHittable {
                app.swipeUp()
            }
            charterDetail.tap()
            XCTAssertTrue(app.staticTexts["Charter Details"].firstMatch.waitForExistence(timeout: 45))
            snapshot("05-CharterDetails")
            byID("header-back").tap()
        }

        // 6. Upcoming Charter
        goToDrawerScreen(itemID: "drawer-item-Upcoming Charter", waitForTitle: "Upcoming Charter")
        snapshot("06-UpcomingCharter")

        // 7. Charter History
        goToDrawerScreen(itemID: "drawer-item-Charter History", waitForTitle: "Charter History")
        snapshot("07-CharterHistory")

        // 8. Notifications
        goToDrawerScreen(itemID: "drawer-item-Notification", waitForTitle: "Notifications")
        snapshot("08-Notifications")

        // 9. Change Password
        goToDrawerScreen(itemID: "drawer-item-Change Password", waitForTitle: "Change Password")
        snapshot("09-ChangePassword")

        // 10. Profile
        goToDrawerScreen(itemID: "drawer-profile", waitForTitle: "Profile")
        snapshot("10-Profile")
    }

    /// Opens the navigation drawer from the current screen.
    private func openDrawer() {
        XCTAssertTrue(waitForHittable(byID("drawer-toggle"), timeout: 30))
        byID("drawer-toggle").tap()
    }

    /// Opens the drawer, taps a drawer item and waits for the target screen's
    /// header title to appear.
    private func goToDrawerScreen(
        itemID: String,
        waitForTitle title: String,
        timeout: TimeInterval = 45
    ) {
        openDrawer()
        XCTAssertTrue(waitForHittable(byID(itemID)))
        byID(itemID).tap()
        XCTAssertTrue(app.staticTexts[title].firstMatch.waitForExistence(timeout: timeout))
    }
}
