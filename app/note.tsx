import React, { useRef, useState } from "react";
import {
  StyleSheet,
  TouchableOpacity,
  View,
  TextInput,
} from "react-native";
import { useRoute } from "@react-navigation/native";
import { RouteProp } from "@react-navigation/native";
import { RootStackParamList } from "../types";
import { AntDesign } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";
import { Fontisto } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { createNote, updateNote } from "@/api/notes";
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';

type NoteScreenRouteProp = RouteProp<RootStackParamList, "note">;

export default function NoteScreen() {
  const contentRef = useRef<TextInput>(null);
  const navigation = useNavigation();
  const route = useRoute<NoteScreenRouteProp>();
  const { id, title: initialTitle, content: initialContent } = route.params;

  const [title, setTitle] = useState(initialTitle);
  const [cont, setCont] = useState(initialContent);

  const goBack = async () => {
    try {
      let status = 'important'
      if (title !== "" && cont !== "") {
        const updatedNote = {
          title: title,
          content: cont,
        };

        if (id) {
          await updateNote(id, updatedNote);
        } else {
          await createNote(title, cont, status);
        }
      }
    } catch (error) {
      console.error("Error updating or creating note:", error);
    } finally {
      navigation.goBack();
    }
  };

  const handleTextChange = (text: string) => {
    setCont(text);
  };

  const handleTitleChange = (text: string) => {
    setTitle(text);
  };

  const handleCameraLaunch = async () => {
    try {
      const result = await launchCamera({
        mediaType: 'photo',
        cameraType: 'back',
      });

      if (result.assets && result.assets.length > 0) {
        const imageUri = result.assets[0].uri;
        console.log("Image captured:", imageUri);
      }
    } catch (error) {
      console.error("Error launching camera:", error);
    }
  };

  const handleImageLibraryLaunch = async () => {
    try {
      const result = await launchImageLibrary({
        mediaType: 'photo',
      });

      if (result.assets && result.assets.length > 0) {
        const imageUri = result.assets[0].uri;
        console.log("Image selected:", imageUri);
      }
    } catch (error) {
      console.error("Error launching image library:", error);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={goBack}
        style={{
          backgroundColor: "rgb(183,214,212)",
          alignSelf: "flex-start",
          marginTop: 50,
          marginLeft: 20,
          padding: 15,
          borderRadius: 50,
        }}
      >
        <AntDesign name="left" size={20} color="black" />
      </TouchableOpacity>
      <View style={{ height: "75%" }}>
        <TextInput
          multiline={true}
          placeholder="Input Title"
          value={title}
          onChangeText={handleTitleChange}
          style={{ margin: 20, fontWeight: "500", fontSize: 40 }}
        />
        <TextInput
          placeholder="Write a note... "
          multiline={true}
          value={cont}
          onChangeText={handleTextChange}
          ref={contentRef}
          style={{ margin: 20, fontSize: 15, fontWeight: '200' }}
        />
      </View>

      <View
        style={{
          backgroundColor: "rgb(183,214,212)",
          marginHorizontal: 100,
          height: 60,
          borderRadius: 30,
          justifyContent: "center",
          flexDirection: "row",
        }}
      >
        <TouchableOpacity
          onPress={handleCameraLaunch}
          style={{
            backgroundColor: "rgb(187,225,223)",
            margin: 10,
            padding: 10,
            borderRadius: 50,
          }}
        >
          <Ionicons name="camera-outline" size={20} color="black" />
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            backgroundColor: "rgb(187,225,223)",
            margin: 10,
            padding: 10,
            borderRadius: 50,
            alignContent: "center",
          }}
          onPress={() => {
            contentRef.current?.focus();
          }}
        >
          <FontAwesome name="pencil" size={20} color="black" />
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            backgroundColor: "rgb(187,225,223)",
            margin: 10,
            padding: 10,
            borderRadius: 50,
            alignContent: "center",
          }}
          onPress={handleImageLibraryLaunch}
        >
          <Fontisto name="link" size={20} color="black" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "rgb(195,237, 239)", // Example background color
  },
});
