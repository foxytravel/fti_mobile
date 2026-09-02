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

    /// Taps the iOS permission alerts (notifications, location, ...) that the
    /// Springboard shows shortly after launch.
    private func dismissSystemAlertsIfPresent() {
        let springboard = XCUIApplication(bundleIdentifier: "com.apple.springboard")
        let preferred = [
            "Allow While Using App",
            "Allow Once",
            "Allow",
            "OK",
            "Not Now",
            "Don't Allow",
        ]
        for _ in 0..<8 {
            let alert = springboard.alerts.firstMatch
            guard alert.waitForExistence(timeout: 3) else { return }
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

        // 1. Welcome screen
        XCTAssertTrue(byID("welcome-login-button").waitForExistence(timeout: 20))
        snapshot("01-Welcome")

        // 2. Sign in screen
        byID("welcome-login-button").tap()
        XCTAssertTrue(byID("login-email").waitForExistence(timeout: 10))

        let emailField = app.textFields["login-email"]
        emailField.tap()
        emailField.typeText(email)

        let passwordField = app.secureTextFields["login-password"]
        passwordField.tap()
        passwordField.typeText(password)

        // Dismiss the keyboard by tapping the screen title, then log in.
        app.staticTexts["LOG IN"].firstMatch.tap()
        XCTAssertTrue(byID("login-button").waitForExistence(timeout: 5))
        snapshot("02-SignIn")
        byID("login-button").tap()

        // 3. Home / dashboard. The header only appears once the profile and job
        //    data have loaded, so this doubles as a "logged in" signal.
        XCTAssertTrue(app.staticTexts["Charter"].firstMatch.waitForExistence(timeout: 45))
        snapshot("03-Home")

        // 4. Today's Charter list
        goToDrawerScreen(itemID: "drawer-item-Today's Charter", waitForTitle: "Today's Charter")
        snapshot("04-TodaysCharter")

        // 5. Charter details (first job card) — skipped when there is no job.
        let charterDetail = app.buttons["View Charter Detail"].firstMatch
        if charterDetail.waitForExistence(timeout: 5) {
            if !charterDetail.isHittable {
                app.swipeUp()
            }
            charterDetail.tap()
            XCTAssertTrue(app.staticTexts["Charter Details"].firstMatch.waitForExistence(timeout: 30))
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
        XCTAssertTrue(waitForHittable(byID("drawer-toggle")))
        byID("drawer-toggle").tap()
    }

    /// Opens the drawer, taps a drawer item and waits for the target screen's
    /// header title to appear.
    private func goToDrawerScreen(
        itemID: String,
        waitForTitle title: String,
        timeout: TimeInterval = 30
    ) {
        openDrawer()
        XCTAssertTrue(waitForHittable(byID(itemID)))
        byID(itemID).tap()
        XCTAssertTrue(app.staticTexts[title].firstMatch.waitForExistence(timeout: timeout))
    }
}