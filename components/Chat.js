import {
  StyleSheet,
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
  Image,
} from "react-native";
import { useState, useEffect } from "react";
import {
  Bubble,
  GiftedChat,
  SystemMessage,
  Day,
} from "react-native-gifted-chat";
import {
  collection,
  getDocs,
  addDoc,
  onSnapshot,
  query,
  orderBy,
} from "firebase/firestore";
import avatarImage from "../assets/images/avatar.jpeg";

// Define the Chat component which handles the chat screen
const Chat = ({ db, route, navigation }) => {
  // State for storing chat messages
  const [messages, setMessages] = useState([]);
  // Extract name and background color from route parameters
  const { id, name, color } = route.params;

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

  // useEffect hook to set initial messages and navigation options
  useEffect(() => {
    const q = query(collection(db, "messages"), orderBy("createdAt", "desc"));
    const unsubMessages = onSnapshot(q, (documentsSnapshot) => {
      let newMessages = [];
      documentsSnapshot.forEach((doc) => {
        newMessages.push({
          id: doc.id,
          ...doc.data(),
          createdAt: new Date(doc.data().createdAt.toMillis()),
        });
      });
      setMessages(newMessages);
    });

    // Clean up code
    return () => {
      if (unsubMessages) unsubMessages();
    };
  }, []);

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

  // Custom render function for avatar
  const renderAvatar = (props) => (
    <Image
      source={avatarImage}
      style={{
        width: 50,
        height: 50,
        borderRadius: 25,
      }}
    />
  );

  return (
    <View style={[styles.container, { backgroundColor: color }]}>
      <GiftedChat
        messages={messages}
        onSend={(messages) => onSend(messages)}
        user={{
          _id: id,
          name: name,
        }}
        renderSystemMessage={renderSystemMessage}
        renderDay={renderDay}
        renderAvatar={renderAvatar}
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
