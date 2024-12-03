/**
 * ChatInput Component
 *
 * This component provides a text input and a send button for sending messages in the chat.
 * It also handles replying to messages by displaying the original message being replied to
 * and allowing the user to cancel the reply.
 */

import React, { useState } from "react";
import { View, TextInput, Button, Text, TouchableOpacity } from "react-native";
import useChatStore from "../store/useChatStore";
import { chatStyles } from "../styles/chatScreenStyles";
import { FlatList } from "react-native";

/**
 * Get the text of the quoted message based on its UUID.
 * @param replyToMessageUuid - The UUID of the message being replied to.
 * @returns The text of the quoted message or an empty string if not found.
 */
const getQuotedMessageText = (replyToMessageUuid: string): string => {
  const messages = useChatStore.getState().messages;
  const quotedMessage = messages.find((msg) => msg.uuid === replyToMessageUuid);
  return quotedMessage?.text || "";
};

type ChatInputProps = {
  flatListRef: React.RefObject<FlatList>;
};

const ChatInput: React.FC<ChatInputProps> = ({ flatListRef }) => {
  const [inputText, setInputText] = useState<string>(""); // Local state for the input text
  const addMessage = useChatStore((state) => state.addMessage); // Function to add a new message to the global state
  const replyingTo = useChatStore((state) => state.replyingTo); // Message being replied to
  const setReplyingTo = useChatStore((state) => state.setReplyingTo); // Action to clear reply state

  /**
   * Handles sending a message.
   * Clears the input field, clears replyingTo, and scrolls to the latest message.
   */
  const handleSendMessage = () => {
    if (inputText.trim()) {
      addMessage(inputText); // Add the message to the global state
      setInputText(""); // Clear the input field
      setReplyingTo(null); // Clear the reply state after sending

      // Scroll to the last message
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  };

  return (
    <View style={chatStyles.inputContainer}>
      {/* Display the message being replied to, if any */}
      {replyingTo && (
        <View style={chatStyles.replyingToContainer}>
          <Text style={chatStyles.replyingToLabel}>Replying to:</Text>
          <Text style={chatStyles.replyingToText}>
            {getQuotedMessageText(replyingTo)}
          </Text>
          <TouchableOpacity onPress={() => setReplyingTo(null)}>
            <Text style={chatStyles.cancelReply}>Cancel</Text>
          </TouchableOpacity>
        </View>
      )}
      {/* Text input and send button */}
      <View style={chatStyles.textInputRow}>
        <TextInput
          style={chatStyles.input}
          placeholder="Type a message..."
          value={inputText}
          onChangeText={setInputText}
        />
        <Button title="Send" onPress={handleSendMessage} />
      </View>
    </View>
  );
};

export default ChatInput;
