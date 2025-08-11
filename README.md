
## TVMAZE APP

## An EXPO EAS React Native mobile app using EXPO ROUTER

## 🚀 Start Development Server

To start the local server, follow these steps.

- `$ npm install` or `$ yarn install` - This will install all the required dependencies.

- `$ npm start` or `$ yarn start` - This will start the app, select a platform once complete.

## Pin Number

Once the app is installed, access the app using the following PIN code: 6669

## Testing

Note: Unit Tests have being added using Jest and React Testing Library. However, due to an incompatibility issue with the latest React.js Version 19.1.1 (Which is used in this project) and the Jest / React testing libraries at their most updated version, both React and React-Dom should be changed to version 19.0.0 in the package.json, and all libraries should be installed for the tests to be run. Install all deps using this command:
  npx expo install jest jest-expo jest-environment-jsdom @testing-library/react-native @testing-library/jest-native @types/jest

Once this is done, you can run the tests using: 
  npm run jest
