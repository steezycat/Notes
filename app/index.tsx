import React, { useEffect, useState, useCallback } from "react";
import {
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  RefreshControl,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { deleteNote, getNotes } from "../api/notes";
import { useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "../types";
import { StackNavigationProp } from "@react-navigation/stack";

interface Note {
  id: number;
  title: string;
  content: string;
}

type IndexScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "index"
>;

export default function Index() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const navigation = useNavigation<IndexScreenNavigationProp>();

  useEffect(() => {
    fetchNotes(); // Fetch notes on component mount
  }, []);

  const fetchNotes = async () => {
    try {
      const notesData = await getNotes();
      console.log(JSON.stringify(notesData, undefined, 4))
      setNotes(notesData);
    } catch (error) {
      console.error("Error fetching notes:", error);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteNote(id);
      setNotes((prevNotes) => prevNotes.filter((note) => note.id !== id));
    } catch (error) {
      console.error("Error deleting note:", error);
    }
  };

  const handleOpen = (
    id: number | undefined,
    title: string,
    content: string
  ) => {
    navigation.navigate("note", { id, title, content });
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchNotes().then(() => setRefreshing(false));
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image
          source={require("../assets/images/dp.webp")}
          style={styles.image}
        />
        <Text style={styles.greetings}>Hi, Ericka</Text>
      </View>

      <View style={styles.title}>
        <Text style={styles.titleText}>My Notes</Text>
      </View>

      <View style={styles.optionsScroll}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <TouchableOpacity style={styles.optionContainer}>
            <Text style={styles.options}>All</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.optionContainer}>
            <Text style={styles.options}>Important</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.optionContainer}>
            <Text style={styles.options}>Bookmarked</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.optionContainer}>
            <Text style={styles.options}>Favorites</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => handleOpen(undefined, "", "")}
      >
        <Ionicons name="add" size={30} color="rgb(100,100,100)" />
      </TouchableOpacity>

      <FlatList
        data={notes}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => handleOpen(item.id, item.title, item.content)}
            style={styles.noteItem}
          >
            <View style={styles.noteContent}>
              <Text style={styles.noteTitle}>{item.title}</Text>
              <Text style={styles.noteText}>{item.content}</Text>
            </View>
            <TouchableOpacity onPress={() => handleDelete(item.id)}>
              <Ionicons name="trash-outline" size={24} color="rgb(200,200,200)" />
            </TouchableOpacity>
          </TouchableOpacity>
        )}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["white"]}
          />
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 50,
    marginRight: 10,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 20,
    marginHorizontal: 20,
    marginTop: 40,
  },
  greetings: {
    color: "rgb(200,200,200)",
    fontWeight: "bold",
    fontSize: 20,
  },
  title: {
    marginHorizontal: 20,
    marginBottom: 20,
  },
  titleText: {
    color: "rgb(200,200,200)",
    fontSize: 50,
  },
  options: {
    color: "rgb(100,100,100)",
  },
  optionContainer: {
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgb(100,100,100)",
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginRight: 20,
    height: 40,
  },
  optionsScroll: {
    paddingLeft: 20,
    marginTop: 10,
    height: 40,
    marginBottom: 15,
  },
  addButton: {
    backgroundColor: "black",
    borderRadius: 50,
    borderWidth: 1,
    borderColor: "rgb(100,100,100)",
    height: 60, // Increased height for better touchability
    justifyContent: "center",
    alignItems: "center", // Center items horizontally and vertically
    position: "absolute",
    width: 60, // Increased width for better touchability
    bottom: 40, // Position at the bottom of the screen
    alignSelf: "center", // Center horizontally
    zIndex: 10, // Ensure it's on top of other elements
  },
  noteItem: {
    backgroundColor: "black",
    marginHorizontal: 20,
    marginVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "rgb(200,200,200)",
    padding: 20,
    height: 100,
    flexDirection: "row",
    alignItems: "center",
  },
  noteContent: {
    flex: 1,
  },
  noteTitle: {
    color: "rgb(200,200,200)",
    fontWeight: "bold",
    fontSize: 20,
    marginBottom: 5,
  },
  noteText: {
    color: "rgb(200,200,200)",
    fontSize: 15,
    fontWeight: '300'
  },
  listContent: {
    paddingBottom: 20,
  },
});
