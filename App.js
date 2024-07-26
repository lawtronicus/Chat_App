import { LogBox } from "react-native";

// import the screens
import Start from "./components/Start";
import Chat from "./components/Chat";

// import react Navigation
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

// Create the navigator

// Disable warning on default props for now
LogBox.ignoreLogs([
  "Warning: Avatar: Support for defaultProps will be removed from function components",
]);

const Stack = createNativeStackNavigator();

//initialize firebase/firestore
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

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

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Chart">
        <Stack.Screen name="Start" component={Start} />
        <Stack.Screen name="Chat">
          {(props) => <Chat db={db} {...props} />}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
