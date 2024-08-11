# Navigator Chat App

This is a mobile chat application built using React Native and Expo. The app allows users to communicate via text messages, share images, and share their current location. It supports offline message caching and synchronization with Firebase Firestore.

## Features

- User authentication via anonymous login.
- Real-time messaging with Firebase Firestore.
- Image sharing using the device's camera or gallery.
- Location sharing with an integrated map view.
- Customizable chat backgrounds.
- Offline message caching and synchronization.

## Technology Stack

- **React Native**
- **Expo**
- **Firebase** (Authentication, Firestore, Storage)
- **React Navigation**

## Prerequisites

Before you begin, ensure you have met the following requirements:

- [Node.js](https://nodejs.org/) installed on your machine.
- [Expo CLI](https://docs.expo.dev/get-started/installation/) installed globally on your machine.
- [Git](https://git-scm.com/) installed on your machine.
- A Firebase project set up with Firestore and Storage enabled.

## Installation

Follow these steps to set up and run the app locally.

### Clone the Repository

1. Open your terminal or command prompt.
2. Clone the repository using the following command:

   ```bash
   git clone https://github.com/yourusername/navigator.git
   ```

3. Navigate into the project directory:

   ```bash
   cd navigator
   ```

### Install Dependencies

1. Install the required npm packages:

   ```bash
   npm install
   ```

2. Install the Expo CLI globally if you haven't already:

   ```bash
   npm install -g expo-cli
   ```

### Configure Firebase

1. Create a Firebase project at [Firebase Console](https://console.firebase.google.com/).
2. Set up Firestore and Storage in your Firebase project.
3. Copy your Firebase configuration settings from the Firebase console.
4. Replace the Firebase configuration object in `App.js` with your own:

   ```javascript
   const firebaseConfig = {
     apiKey: "YOUR_API_KEY",
     authDomain: "YOUR_AUTH_DOMAIN",
     projectId: "YOUR_PROJECT_ID",
     storageBucket: "YOUR_STORAGE_BUCKET",
     messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
     appId: "YOUR_APP_ID",
     measurementId: "YOUR_MEASUREMENT_ID",
   };
   ```

### Running the App

1. Start the Expo development server:

   ```bash
   expo start
   ```

2. Use the Expo Go app on your iOS or Android device to scan the QR code generated in your terminal or browser.

3. The app should now load on your device.

## Usage

- **Start Screen**: Enter your name, select a background color, and tap "Start Chatting" to proceed to the chat screen.
- **Chat Screen**: Send text messages, share images, and send your location using the custom action button.

## Project Structure

- `App.js`: Main application file, initializes Firebase and navigation.
- `Start.js`: Entry screen where users enter their name and choose a background color.
- `Chat.js`: Main chat screen that handles messaging functionality.
- `CustomActions.js`: Custom component for additional chat actions like image and location sharing.

## Dependencies

The app uses the following major dependencies:

- `react-native`: Version 0.74.3
- `expo`: Version ~51.0.21
- `firebase`: Version ^10.3.1
- `@react-navigation/native`: Version ^6.1.18
- `react-native-gifted-chat`: Version ^2.4.0
- `expo-image-picker`: Version ~15.0.7
- `expo-location`: Version ~17.0.1
- `react-native-maps`: Version 1.14.0

For a full list of dependencies, see the [package.json](package.json) file.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgements

- [React Native Gifted Chat](https://github.com/FaridSafi/react-native-gifted-chat) for the chat interface.
- [Expo](https://expo.dev/) for providing the development tools.
