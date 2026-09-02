#!/usr/bin/env ruby
# frozen_string_literal: true

# One-time setup: adds the `fti_coachUITests` XCUITest target to the Xcode
# project and registers it in the shared scheme's Test action so that
# `fastlane snapshot` can drive the app and capture App Store screenshots.
#
# Idempotent: safe to re-run (e.g. after a fresh checkout or `pod install`).
#
# Run from the repo root:  bundle exec ruby scripts/add_uitest_target.rb
# Requires the `xcodeproj` gem (installed as a CocoaPods/fastlane dependency).

require 'xcodeproj'

PROJECT_PATH = File.expand_path('../ios/fti_coach.xcodeproj', __dir__)
SCHEME_PATH = File.join(PROJECT_PATH, 'xcshareddata', 'xcschemes', 'fti_coach.xcscheme')
UITESTS_DIR = File.expand_path('../ios/fti_coachUITests', __dir__)
TARGET_NAME = 'fti_coachUITests'
APP_TARGET_NAME = 'fti_coach'
BUNDLE_ID = 'com.foxytravel.fticoach.UITests'
DEPLOYMENT_TARGET = '15.1'
SWIFT_VERSION = '5.0'

SOURCES = %w[ScreenshotsUITests.swift SnapshotHelper.swift].freeze

project = Xcodeproj::Project.open(PROJECT_PATH)

target = project.targets.find { |t| t.name == TARGET_NAME }

if target
  puts "#{TARGET_NAME} target already exists; skipping creation."
else
  puts "Adding #{TARGET_NAME} target..."

  group = project.main_group.find_subpath(TARGET_NAME, true)
  file_refs = SOURCES.map { |name| group.new_file(File.join(UITESTS_DIR, name)) }

  target = project.new_target(:ui_test_bundle, TARGET_NAME, :ios, DEPLOYMENT_TARGET)
  target.add_file_references(file_refs)

  app_target = project.targets.find { |t| t.name == APP_TARGET_NAME }
  abort "App target '#{APP_TARGET_NAME}' not found" unless app_target

  target.build_configurations.each do |config|
    settings = config.build_settings
    settings['TEST_TARGET_NAME'] = APP_TARGET_NAME
    settings['PRODUCT_BUNDLE_IDENTIFIER'] = BUNDLE_ID
    settings['GENERATE_INFOPLIST_FILE'] = 'YES'
    settings['CODE_SIGN_STYLE'] = 'Automatic'
    settings['SWIFT_VERSION'] = SWIFT_VERSION
    settings['IPHONEOS_DEPLOYMENT_TARGET'] = DEPLOYMENT_TARGET
    settings['CURRENT_PROJECT_VERSION'] = '1'
    settings['MARKETING_VERSION'] = '1.0'
    settings['LD_RUNPATH_SEARCH_PATHS'] = [
      '$(inherited)',
      '@executable_path/Frameworks',
      '@loader_path/Frameworks',
    ]
  end

  project.save
  puts "Saved #{TARGET_NAME} target."
end

# new_target auto-adds a Foundation.framework reference that hardcodes an old
# SDK path (e.g. iPhoneOS14.0.sdk) and breaks on newer Xcode versions. UI test
# bundles link XCTest automatically, so drop any such reference.
target.frameworks_build_phase.files_references.each do |ref|
  next unless ref.path&.include?('.sdk/')

  target.frameworks_build_phase.remove_file_reference(ref)
  puts "Removed stale framework reference: #{ref.path}"
  project.save
end

# Drop the now-orphaned stale file reference (only referenced by a group).
stale_refs = project.files.select { |f| f.path&.include?('.sdk/') }
stale_refs.each do |ref|
  referrers = ref.referrers.reject { |r| r.is_a?(Xcodeproj::Project::Object::PBXGroup) }
  next unless referrers.empty?

  ref.remove_from_project
  puts "Removed orphaned stale file reference: #{ref.path}"
  project.save
end

# Wire the target into the shared scheme's Test action.
scheme = Xcodeproj::XCScheme.new(SCHEME_PATH)
test_action = scheme.test_action

# The UI tests must run in Release: the RN "Bundle React Native code and
# images" phase only bundles JS for non-Debug configurations, and a Debug
# build would try to reach a Metro dev server that isn't running in CI.
test_action.build_configuration = 'Release'

testables = test_action.testables

# The RN template left a dangling reference to a unit-test target
# (fti_coachTests) that has no target in the project; drop it so
# `xcodebuild test` can resolve every testable.
testables.reject! do |t|
  t.buildable_references.first&.buildable_name == 'fti_coachTests.xctest'
end

registered = testables.any? do |t|
  t.buildable_references.first&.buildable_name == "#{TARGET_NAME}.xctest"
end

unless registered
  testables << Xcodeproj::XCScheme::TestAction::TestableReference.new(target, project)
  puts "Registered #{TARGET_NAME} in the Test action of the shared scheme."
end

test_action.testables = testables
scheme.save!
puts 'Saved shared scheme.'