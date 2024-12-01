import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TextInput,
  Button,
  StyleSheet,
} from "react-native";
import useChatStore from "../store/useChatStore";

export const ChatScreen = () => {
  const { messages, loadMessages, addMessage } = useChatStore();
  const [inputText, setInputText] = useState("");

  useEffect(() => {
    loadMessages(); // Load when start
  }, []);

  const handleSendMessage = () => {
    if (inputText.trim()) {
      addMessage(inputText); // Add message to global status
      setInputText(""); // Clear Imput
    }
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={messages}
        renderItem={({ item }) => (
          <View style={styles.messageItem}>
            <Text style={styles.messageText}>{item.text}</Text>
            <Text style={styles.timestamp}>
              {new Date(item.createdAt).toLocaleTimeString()}
            </Text>
          </View>
        )}
        keyExtractor={(item, index) => item.id || index.toString()}
        style={styles.messageList}
      />

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Type a message..."
          value={inputText}
          onChangeText={setInputText}
        />
        <Button title="Send" onPress={handleSendMessage} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 10,
  },
  messageList: {
    flex: 1,
  },
  messageItem: {
    marginBottom: 10,
    padding: 10,
    backgroundColor: "#f1f1f1",
    borderRadius: 5,
  },
  messageText: {
    fontSize: 16,
  },
  timestamp: {
    fontSize: 12,
    color: "#888",
    marginTop: 5,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderTopWidth: 1,
    borderColor: "#ccc",
    padding: 10,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginRight: 10,
  },
});
