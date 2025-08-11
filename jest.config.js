module.exports = {
  // Use the React Native preset instead of the Expo one.
  // This preset includes all the necessary configurations for a standard React Native project.
  preset: 'react-native',

  // Specifies which files Jest should treat as test files.
  // This remains the same as it's a standard Jest configuration option.
  testMatch: ['**/*.test.{js,jsx,ts,tsx}'],

  // Prevents Jest from transforming files in node_modules, except for a few
  // specific modules that need to be transpiled for testing.
  // This pattern is more generic and doesn't include Expo-specific modules.
  transformIgnorePatterns: [
    'node_modules/(?!(@react-native|react-native|react-native-vector-icons)/)',
  ],
};