import React, { useEffect, useState, useRef } from "react";
import {
  Button,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import useChatStore from "../store/useChatStore";

// Define the Message type
type Reaction = {
  uuid: string; // Unique identifier for the reaction
  value: string; // Emoji representing the reaction
  participantUuid: string; // UUID of the user who reacted
};

type Message = {
  sentAt: number; // Timestamp indicating when the message was sent
  text: string; // Message content
  uuid: string; // Unique identifier for the message
  reactions?: Reaction[]; // Optional: Array of reactions
};

export const ChatScreen = () => {
  const { messages, loadMessages, addMessage } = useChatStore();
  const [inputText, setInputText] = useState("");
  const flatListRef = useRef<FlatList>(null); // Reference for the FlatList

  // Load messages from the store when the component mounts
  useEffect(() => {
    loadMessages();
  }, []);

  // Handle sending a new message
  const handleSendMessage = () => {
    if (inputText.trim()) {
      addMessage(inputText); // Add the new message to the global state
      setInputText(""); // Clear the input field

      // Scroll to the last message after adding a new one
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100); // Timeout to ensure state updates before scrolling
    }
  };

  // Group messages by date
  const groupMessagesByDate = (messages: Message[]) => {
    const grouped: Array<
      | { type: "date"; date: string }
      | {
          type: "message";
          sentAt: number;
          text: string;
          uuid: string;
          reactions?: Reaction[];
        }
    > = [];
    let lastDate: string | null = null;

    messages.forEach((message) => {
      const messageDate = new Date(message.sentAt);
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(today.getDate() - 1);

      let displayDate = messageDate.toDateString();

      if (messageDate.toDateString() === today.toDateString()) {
        displayDate = "Today";
      } else if (messageDate.toDateString() === yesterday.toDateString()) {
        displayDate = "Yesterday";
      }

      if (displayDate !== lastDate) {
        grouped.push({ type: "date", date: displayDate });
        lastDate = displayDate;
      }

      grouped.push({
        type: "message",
        uuid: message.uuid,
        text: message.text,
        sentAt: message.sentAt,
        reactions: message.reactions,
      });
    });

    return grouped;
  };

  // Group messages for rendering
  const groupedMessages = groupMessagesByDate(messages);

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef} // Attach the ref to FlatList
        data={groupedMessages}
        renderItem={({ item }) => {
          if (item.type === "date") {
            // Render a date separator
            return (
              <View style={styles.dateSeparator}>
                <Text style={styles.dateText}>{item.date}</Text>
              </View>
            );
          }
          // Render an individual message with reactions
          return (
            <View style={styles.messageItem}>
              <Text style={styles.messageText}>{item.text}</Text>
              <Text style={styles.timestamp}>
                {new Date(item.sentAt).toLocaleTimeString()}
              </Text>

              {/* Render reactions */}
              {item.reactions && item.reactions.length > 0 && (
                <View style={styles.reactionsContainer}>
                  {item.reactions &&
                    item.reactions.map((reaction: Reaction) => (
                      <View key={reaction.uuid} style={styles.reactionItem}>
                        <Text style={styles.reactionEmoji}>
                          {reaction.value}
                        </Text>
                        <Text style={styles.reactionCount}>
                          {/* Display count or default to "1" if only one participant */}
                          {reaction.participantUuid ? "1" : ""}
                        </Text>
                      </View>
                    ))}
                </View>
              )}
            </View>
          );
        }}
        keyExtractor={(item, index) => {
          if (item.type === "message") {
            return item.uuid; // Unique key for messages
          } else if (item.type === "date") {
            return `date-${index}`; // Unique key for dates
          }
          return `fallback-${index}`; // Fallback key
        }}
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
  dateSeparator: {
    marginVertical: 10,
    alignItems: "center",
  },
  dateText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#444",
  },
  reactionsContainer: {
    flexDirection: "row",
    marginTop: 5,
  },
  reactionItem: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 8,
  },
  reactionEmoji: {
    fontSize: 16,
    marginRight: 4,
  },
  reactionCount: {
    fontSize: 12,
    color: "#888",
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

export default ChatScreen;
