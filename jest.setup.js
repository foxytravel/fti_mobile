/**
 * Jest setup: mock native modules that have no JS-only implementation.
 * @format
 */

/* eslint-env jest */

import 'react-native-gesture-handler/jestSetup';
import mockAsyncStorage from '@react-native-async-storage/async-storage/jest/async-storage-mock';

jest.mock('@react-native-async-storage/async-storage', () => mockAsyncStorage);

jest.mock('react-native-reanimated', () =>
  require('react-native-reanimated/mock'),
);

jest.mock('@react-native-firebase/messaging', () => {
  const messaging = () => ({
    onMessage: jest.fn(() => jest.fn()),
    getToken: jest.fn(() => Promise.resolve('mock-token')),
    setBackgroundMessageHandler: jest.fn(),
    getInitialNotification: jest.fn(() => Promise.resolve(null)),
    onNotificationOpenedApp: jest.fn(() => jest.fn()),
  });
  return {__esModule: true, default: messaging};
});

jest.mock('react-native-push-notification', () => ({
  configure: jest.fn(),
  createChannel: jest.fn(),
  localNotification: jest.fn(),
}));

jest.mock('@react-native-community/push-notification-ios', () => ({
  requestPermissions: jest.fn(() => Promise.resolve()),
  addNotificationRequest: jest.fn(),
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
}));

jest.mock('react-native-get-location', () => ({
  getCurrentPosition: jest.fn(() => Promise.resolve({latitude: 0, longitude: 0})),
}));

jest.mock('react-native-simple-toast', () => ({
  show: jest.fn(),
  SHORT: 0,
  LONG: 1,
}));

jest.mock('react-native-device-info', () => ({
  isTablet: jest.fn(() => false),
}));

jest.mock('react-native-permissions', () =>
  require('react-native-permissions/mock'),
);

jest.mock('@react-native-community/geolocation', () => ({
  requestAuthorization: jest.fn(),
  getCurrentPosition: jest.fn(),
}));

jest.mock('react-native-android-location-enabler', () => ({
  promptForEnableLocationIfNeeded: jest.fn(() => Promise.resolve('enabled')),
  isLocationEnabled: jest.fn(() => Promise.resolve(true)),
}));

jest.mock('react-native-blob-util', () => ({
  __esModule: true,
  default: {
    config: jest.fn(() => ({fetch: jest.fn(() => Promise.resolve())})),
    fs: {unlink: jest.fn()},
  },
}));

jest.mock('react-native-file-viewer', () => ({
  open: jest.fn(() => Promise.resolve()),
}));

jest.mock('react-native-image-crop-picker', () => ({
  openPicker: jest.fn(() => Promise.resolve([])),
  openCamera: jest.fn(() => Promise.resolve({})),
}));

jest.mock('react-native-document-picker', () => ({
  __esModule: true,
  default: {pick: jest.fn(() => Promise.resolve([]))},
  types: {pdf: 'pdf', docx: 'docx', xls: 'xls', xlsx: 'xlsx'},
  isCancel: jest.fn(() => false),
}));
