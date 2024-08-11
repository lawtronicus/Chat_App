// import NetInfo to determine if user is online
import { useNetInfo } from "@react-native-community/netinfo";

// import logbox to disable certain warnings for testing
import { LogBox, Alert } from "react-native";

import { useEffect } from "react";

// import the screens
import Start from "./components/Start";
import Chat from "./components/Chat";

// import react Navigation
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

//initialize firebase/firestore
import { initializeApp } from "firebase/app";
import {
  getFirestore,
  disableNetwork,
  enableNetwork,
} from "firebase/firestore";

// import getsStorage for uploading images to firebase
import { getStorage } from "firebase/storage";

// Disable warning on default props for now
LogBox.ignoreLogs([
  "Warning: Avatar: Support for defaultProps will be removed from function components",
]);

const Stack = createNativeStackNavigator();

const App = () => {
  const firebaseConfig = {
    apiKey: "AIzaSyCF23qsjH0DHIl4bhl2Sx3KMHCRSDqpUGU",
    authDomain: "chat-app-30098.firebaseapp.com",
    projectId: "chat-app-30098",
    storageBucket: "chat-app-30098.appspot.com",
    messagingSenderId: "280315832915",
    appId: "1:280315832915:web:1a2b4d56926dd8e977f4a6",
    measurementId: "G-GEED4LDRZ9",
  };
  // Initialize Firebase
  const app = initializeApp(firebaseConfig);

  const db = getFirestore(app);
  const storage = getStorage(app);

  const connectionStatus = useNetInfo();

  useEffect(() => {
    const handleNetworkChange = async () => {
      if (connectionStatus.isConnected === false) {
        Alert.alert("Connection Lost!");
        await disableNetwork(db);
      } else if (connectionStatus.isConnected === true) {
        await enableNetwork(db);
      }
    };

    handleNetworkChange();

    return () => {
      // Cleanup if necessary
    };
  }, [connectionStatus.isConnected]);

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Start">
        <Stack.Screen name="Start" component={Start} />
        <Stack.Screen name="Chat">
          {(props) => (
            <Chat
              isConnected={connectionStatus.isConnected}
              db={db}
              storage={storage}
              {...props}
            />
          )}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
