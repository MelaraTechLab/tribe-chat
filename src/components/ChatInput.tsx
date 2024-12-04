/**
 * ChatInput Component
 *
 * This component provides an input area for sending chat messages.
 * It supports replying to messages by displaying the quoted message being replied to
 * and offers functionality to cancel the reply.
 */

import React, { useState } from "react";
import {
  View,
  TextInput,
  Button,
  Text,
  TouchableOpacity,
  FlatList,
} from "react-native";
import useChatStore from "../store/useChatStore";
import { chatStyles } from "../styles/chatScreenStyles";

/**
 * Retrieves the text of the quoted message using its UUID.
 * @param replyToMessageUuid - The UUID of the message being replied to.
 * @returns The quoted message's text or an empty string if not found.
 */
const getQuotedMessageText = (replyToMessageUuid: string): string => {
  const { messages } = useChatStore.getState(); // Access global state
  const quotedMessage = messages.find((msg) => msg.uuid === replyToMessageUuid);
  return quotedMessage?.text || "";
};

type ChatInputProps = {
  flatListRef: React.RefObject<FlatList<any>>;
};

const ChatInput: React.FC<ChatInputProps> = ({ flatListRef }) => {
  // Local state for managing input text
  const [inputText, setInputText] = useState<string>("");

  // Zustand state and actions
  const addMessage = useChatStore((state) => state.addMessage);
  const replyingTo = useChatStore((state) => state.replyingTo);
  const setReplyingTo = useChatStore((state) => state.setReplyingTo);

  /**
   * Handles sending a message.
   * Resets the input field and reply state, and scrolls to the latest message.
   */
  const handleSendMessage = () => {
    if (inputText.trim()) {
      addMessage(inputText); // Add message to global state
      setInputText(""); // Clear input field
      setReplyingTo(null); // Reset reply state

      // Smooth scroll to the latest message
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  };

  return (
    <View style={chatStyles.inputContainer}>
      {/* Quoted message display */}
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

      {/* Input field and send button */}
      <View style={chatStyles.textInputRow}>
        <TextInput
          style={chatStyles.input}
          placeholder="Type a message..."
          value={inputText}
          onChangeText={setInputText}
        />
        <Button
          title="Send"
          onPress={handleSendMessage}
          disabled={!inputText.trim()} // Disable if input is empty
        />
      </View>
    </View>
  );
};

export default ChatInput;
