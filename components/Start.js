import { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  ImageBackground,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import { getAuth, signInAnonymously } from "firebase/auth";

// Define a set of colors used as background in the Chat.js screen
const appColors = {
  dark1: "#090C08",
  dark2: "#474056",
  lightBlue: "#8A95A5",
  lightGreen: "#B9C6AE",
};

// Define the Start component which is the entry screen of the app

const Start = ({ navigation }) => {
  //sign in user anonymously
  const auth = getAuth();
  const signInUser = () => {
    signInAnonymously(auth)
      .then((result) => {
        navigation.navigate("Chat", {
          id: result.user.uid,
          name: name,
          color: selectedColor,
        });
        Alert.alert("Signed in Successfully!");
      })
      .catch((error) => {
        Alert.alert("Unable to sign in, try later again.");
      });
  };
  // State for storing the user's name
  const [name, setName] = useState("");
  // State for storing the selected background color
  const [selectedColor, setSelectedColor] = useState(appColors.dark1);

  // Function to handle the selection of background color
  const handleColorSelect = (color) => {
    setSelectedColor(color);
  };

  return (
    <View style={styles.container}>
      {/* Background image */}

      <ImageBackground
        source={require("../public/backgroundImage.png")}
        style={styles.image}
      >
        {/* App title */}

        <Text style={styles.appTitle}>Let's Chat!</Text>
        {/* White box containing the input, background color circles, and start chatting button */}

        <View style={styles.contentBox}>
          <View style={styles.inputWrapper}>
            <Image source={require("../public/icon.png")} style={styles.icon} />
            <TextInput
              style={styles.textInput}
              value={name}
              onChangeText={setName}
              placeholder="Your Name"
              placeholderTextColor="#757083"
            />
          </View>
          {/* Background color selection section */}
          <View style={styles.selectBackground}>
            <Text style={styles.bodyText}>Choose Background Color.</Text>
            <View style={styles.selectBgColor}>
              {/* Color options */}
              {Object.values(appColors).map((color) => (
                <TouchableOpacity
                  accessible={true}
                  accessibilityLabel="Color option"
                  accessibilityHint="Let's you choose the background color for the chat screen."
                  accessibilityRole="button"
                  key={color}
                  onPress={() => handleColorSelect(color)}
                >
                  <View
                    style={[
                      styles.colorOptionWrapper,
                      selectedColor === color && styles.selectedColorOption,
                    ]}
                  >
                    <View
                      style={[
                        styles.backgroundColorOption,
                        { backgroundColor: color },
                      ]}
                    />
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>
          {/* Button to navigate to the chat screen */}
          <TouchableOpacity
            accessible={true}
            accessibilityLabel="Navigation button"
            accessibilityHint="Takes you to the chatting screen."
            accessibilityRole="button"
            style={styles.button}
            title="Start chatting"
            onPress={signInUser}
          >
            <Text style={styles.buttonText}>Start Chatting</Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
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

// Styles for the component
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  image: {
    flex: 1,
    justifyContent: "center",
  },
  appTitle: {
    position: "absolute",
    top: 100,
    left: 0,
    right: 0,
    textAlign: "center",
    fontSize: 45,
    fontWeight: "600",
    fontWeight: "bold",
    color: "white",
  },
  contentBox: {
    position: "absolute",
    bottom: 15,
    width: "88%",
    height: "44%",
    backgroundColor: "white",
    alignSelf: "center",
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#757083",
    borderRadius: 5,
    margin: 20,
  },
  icon: {
    width: 24,
    height: 24,
    marginLeft: 12,
  },
  textInput: {
    alignSelf: "center",
    width: "88%",
    height: 60,
    fontSize: 16,
    fontWeight: "300",
    padding: 15,
    borderWidth: 0,
    color: "#757083",
    opacity: 0.5,
  },
  selectBackground: {
    alignSelf: "center",
    width: "88%",
    marginTop: 12,
  },
  bodyText: {
    fontSize: 16,
    fontWeight: "300",
    color: "#757083",
  },
  selectBgColor: {
    flexDirection: "row",
  },
  colorOptionWrapper: {
    backgroundColor: "white",
    borderRadius: 50,
    margin: 4,
  },
  backgroundColorOption: {
    width: 50,
    height: 50,
    borderRadius: 25,
    margin: 4,
  },
  selectedColorOption: {
    borderColor: "#757083",
    borderWidth: 3,
  },
  button: {
    position: "absolute",
    height: 60,
    bottom: 18,
    alignSelf: "center",
    alignItems: "center",
    backgroundColor: "#757083",
    padding: 10,
    width: "88%",
    justifyContent: "center",
  },
  buttonText: {
    alignSelf: "center",
    fontSize: 16,
    fontWeight: "100",
    color: "white",
  },
});

export default Start;
