// import AsyncStorage so previous chats can be pulled from cache if offline
import AsyncStorage from "@react-native-async-storage/async-storage";

// import image picker for uploading images
import * as ImagePicker from "expo-image-picker";

// Import location and maps to find location for sending a pen with user's location
import * as Location from "expo-location";
import MapView from "react-native-maps";

import { StyleSheet, View, KeyboardAvoidingView, Platform } from "react-native";
import { useState, useEffect } from "react";
import {
  GiftedChat,
  SystemMessage,
  Day,
  InputToolbar,
} from "react-native-gifted-chat";
import {
  collection,
  getDocs,
  addDoc,
  onSnapshot,
  query,
  orderBy,
} from "firebase/firestore";
import CustomActions from "./CustomActions";

// Define the Chat component which handles the chat screen
const Chat = ({ db, route, isConnected, storage }) => {
  // State for storing chat messages
  const [messages, setMessages] = useState([]);
  // Extract name and background color from route parameters
  const { id, name, color } = route.params;

  //  State for storing image
  const [image, setImage] = useState(null);

  // State for storing location
  const [location, setLocation] = useState(null);

  // Function to determine if a color is light or dark - credit to krabs-github for this function
  function lightOrDark(color) {
    // Check the format of the color, HEX or RGB?
    if (color.match(/^rgb/)) {
      // If HEX --> store the red, green, blue values in separate variables
      color = color.match(
        /^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+(?:\.\d+)?))?\)$/,
      );

      r = color[1];
      g = color[2];
      b = color[3];
    } else {
      // If RGB --> Convert it to HEX: http://gist.github.com/983661
      color = +(
        "0x" + color.slice(1).replace(color.length < 5 && /./g, "$&$&")
      );

      r = color >> 16;
      g = (color >> 8) & 255;
      b = color & 255;
    }

    // HSP equation from http://alienryderflex.com/hsp.html
    hsp = Math.sqrt(0.299 * (r * r) + 0.587 * (g * g) + 0.114 * (b * b));

    // Using the HSP value, determine whether the color is light or dark
    if (hsp > 127.5) {
      return "light";
    } else {
      return "dark";
    }
  }

  // Determine text color based on background color lightness
  const textColor = lightOrDark(color) === "dark" ? "white" : "black";

  //Load messages from cache if not connected
  const loadCachedMessages = async () => {
    const cachedMessages = (await AsyncStorage.getItem("messages")) || [];
    setMessages(JSON.parse(cachedMessages));
  };

  // function to select image from library
  const pickImage = async () => {
    let permissions = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissions?.granted) {
      let result = await ImagePicker.launchImageLibraryAsync();

      if (!result.canceled) setImage(result.assets[0]);
      else setImage(null);
    }
  };

  //function to allow user to take a photo
  const takePhoto = async () => {
    let permissions = await ImagePicker.requestCameraPermissionsAsync();

    if (permissions?.granted) {
      let result = await ImagePicker.launchCameraAsync();

      if (!result.canceled) setImage(result.assets[0]);
      else setImage(null);
    }
  };

  //function to get location
  const getLocation = async () => {
    let permissions = await Location.requestForegroundPermissionsAsync();

    if (permissions?.granted) {
      const location = await Location.getCurrentPositionAsync({});
      setLocation(location);
    } else {
      Alert.alert("Permissions to read location aren't granted");
    }
  };

  // declare unsubMessages outside of useEffect so that I can use unsubscribe and disable the old onSanpsho() listener before losing its reference
  let unsubMessages;

  // useEffect hook to set initial messages and navigation options
  useEffect(() => {
    if (isConnected === true) {
      // unregister current onSnapshot() listener to avoid registering multiple listeners when
      // useEffect code is re-executed.
      if (unsubMessages) unsubMessages();
      unsubMessages = null;

      const q = query(collection(db, "messages"), orderBy("createdAt", "desc"));
      unsubMessages = onSnapshot(q, (documentsSnapshot) => {
        let newMessages = [];
        documentsSnapshot.forEach((doc) => {
          newMessages.push({
            id: doc.id,
            ...doc.data(),
            createdAt: new Date(doc.data().createdAt.toMillis()),
          });
        });
        cacheMessages(newMessages);
        setMessages(newMessages);
      });
    } else loadCachedMessages();

    // Clean up code
    return () => {
      if (unsubMessages) unsubMessages();
    };
  }, [isConnected]);

  const cacheMessages = async (messagesToCache) => {
    try {
      await AsyncStorage.setItem("messages", JSON.stringify(messagesToCache));
    } catch (error) {
      console.log(error.message);
    }
  };

  // Function to handle sending new messages
  const onSend = (newMessages) => {
    addDoc(collection(db, "messages"), newMessages[0]);
  };

  // Custom render function for system messages so that they are clearly visible on any background
  const renderSystemMessage = (props) => (
    <SystemMessage {...props} textStyle={{ color: textColor }} />
  );

  // Custom render function for day label so it is clearly visible on any background
  const renderDay = (props) => (
    <Day {...props} textStyle={{ color: textColor }} />
  );

  const renderInputToolbar = (props) => {
    if (isConnected) return <InputToolbar {...props} />;
    else return null;
  };

  const renderCustomActions = (props) => {
    return <CustomActions storage={storage} userID={id} {...props} />;
  };

  const renderCustomView = (props) => {
    const { currentMessage } = props;
    if (currentMessage.location) {
      return (
        <MapView
          style={{ width: 150, height: 100, borderRadius: 13, margin: 3 }}
          region={{
            latitude: currentMessage.location.latitude,
            longitude: currentMessage.location.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
        />
      );
    }
    return null;
  };

  return (
    <View style={[styles.container, { backgroundColor: color }]}>
      <GiftedChat
        renderUsernameOnMessage={true}
        messages={messages}
        onSend={(messages) => onSend(messages)}
        renderSystemMessage={renderSystemMessage}
        renderDay={renderDay}
        renderInputToolbar={renderInputToolbar}
        renderActions={renderCustomActions}
        renderCustomView={renderCustomView}
        user={{
          _id: id,
          name: name,
        }}
      />
      {/* Keyboard avoiding view for better UX on different platforms */}
      {Platform.OS === "android" ? (
        <KeyboardAvoidingView behavior="height" />
      ) : null}
      {Platform.OS === "ios" ? (
        <KeyboardAvoidingView behavior="padding" />
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default Chat;
