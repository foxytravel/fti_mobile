module.exports = {
  presets: ['module:@react-native/babel-preset'],
  // react-native-reanimated (needed by @react-navigation/drawer) requires its
  // babel plugin, and it must be listed last.
  plugins: ['react-native-reanimated/plugin'],
};
