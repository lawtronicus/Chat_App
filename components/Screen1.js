import { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  ImageBackground,
  TouchableOpacity,
} from "react-native";

const appColors = {
  dark1: "#090C08",
  dark2: "#474056",
  lightBlue: "#8A95A5",
  lightGreen: "#B9C6AE",
};

const Screen1 = ({ navigation }) => {
  const [name, setName] = useState("");
  const [selectedColor, setSelectedColor] = useState(appColors.dark1);

  const handleColorSelect = (color) => {
    setSelectedColor(color);
  };

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require("../public/backgroundImage.png")}
        style={styles.image}
      >
        <Text style={styles.appTitle}>App Title</Text>
        <View style={styles.contentBox}>
          <TextInput
            style={styles.textInput}
            value={name}
            onChangeText={setName}
            placeholder="Your Name"
          />
          <View style={styles.selectBackground}>
            <Text style={styles.bodyText}>Choose Background Color.</Text>
            <View style={styles.selectBgColor}>
              {Object.values(appColors).map((color) => (
                <TouchableOpacity
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
          <TouchableOpacity
            style={styles.button}
            title="Go to Screen 2"
            onPress={() =>
              navigation.navigate("Screen2", {
                name: name,
                color: selectedColor,
              })
            }
          >
            <Text style={styles.buttonText}>Start Chatting</Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </View>
  );
};

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
    top: 100, // Adjust this value as needed
    left: 0,
    right: 0,
    textAlign: "center",
    fontSize: 45,
    fontWeight: 600,
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
  textInput: {
    alignSelf: "center",
    width: "88%",
    height: 60,
    fontSize: 16,
    fontWeight: 300,
    padding: 15,
    borderWidth: 1,
    marginTop: 15,
    marginBottom: 15,
    color: "#757083",
    opacity: 0.5,
  },
  selectBackground: {
    alignSelf: "center",
    width: "88%",
    marginTop: 28,
  },
  bodyText: {
    fontSize: 16,
    fontWeight: 300,
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
    fontWeight: 100,
    color: "white",
  },
});

export default Screen1;
