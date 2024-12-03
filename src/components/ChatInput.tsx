/**
 * ChatInput Component
 *
 * This component provides a text input and a send button for sending messages in the chat.
 * It interacts with the global state to add new messages and scrolls to the latest message
 * after a message is sent.
 */

import React, { useState } from "react";
import { View, TextInput, Button, StyleSheet } from "react-native";
import useChatStore from "../store/useChatStore";
import { chatStyles } from "../styles/chatScreenStyles"; // Global styles
import { FlatList } from "react-native"; // Reference type for FlatList

type ChatInputProps = {
  flatListRef: React.RefObject<FlatList>; // Reference to the FlatList for scrolling
};

const ChatInput: React.FC<ChatInputProps> = ({ flatListRef }) => {
  const [inputText, setInputText] = useState<string>(""); // Local state for the input text
  const addMessage = useChatStore((state) => state.addMessage); // Function to add a new message to the global state

  /**
   * Handles sending a message.
   * Clears the input field and scrolls to the latest message.
   */
  const handleSendMessage = () => {
    if (inputText.trim()) {
      addMessage(inputText); // Add the message to the global state
      setInputText(""); // Clear the input field

      // Scroll to the last message
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  };

  return (
    <View style={[chatStyles.inputContainer, styles.inputContainer]}>
      <TextInput
        style={[chatStyles.input, styles.input]}
        placeholder="Type a message..."
        value={inputText}
        onChangeText={setInputText}
      />
      <Button title="Send" onPress={handleSendMessage} />
    </View>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    backgroundColor: "#f9f9f9", // Light background for better visibility
    borderRadius: 10, // Rounded corners
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  input: {
    fontSize: 16, // Ensure the text is legible
    color: "#333", // Text color
  },
});

export default ChatInput;
