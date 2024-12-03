import React, { useEffect, useState, useRef } from "react";
import {
  Button,
  FlatList,
  Image,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import useChatStore from "../store/useChatStore";
import { addReaction } from "../api/chatApi";

// Define the Reaction type
type Reaction = {
  uuid: string; // Unique identifier for the reaction
  value: string; // Emoji representing the reaction
  participantUuid: string; // UUID of the user who reacted
};

// Define the Message type
type Message = {
  authorUuid: string | undefined; // UUID of the author (optional)
  attachments: string[] | undefined; // Attachments (optional)
  sentAt: number; // Timestamp when the message was sent
  text: string; // Message content
  uuid: string; // Unique identifier for the message
  reactions?: Reaction[]; // Optional: Array of reactions
};

export const ChatScreen = () => {
  // Zustand store hooks to manage global state
  const { messages, loadMessages, addMessage } = useChatStore();
  const [inputText, setInputText] = useState(""); // Local state for message input
  const flatListRef = useRef<FlatList>(null); // Reference for FlatList to enable scrolling

  // Estado para el modal
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedParticipant, setSelectedParticipant] =
    useState<Participant | null>(null);

  // ...

  // Función para manejar la apertura del modal
  const handleOpenModal = (participant: Participant) => {
    setSelectedParticipant(participant);
    setModalVisible(true);
  };

  // Función para cerrar el modal
  const handleCloseModal = () => {
    setModalVisible(false);
    setSelectedParticipant(null);
  };

  // Load messages from the store when the component mounts
  useEffect(() => {
    loadMessages();
  }, []);

  // Ensure participants are loaded into the store
  const ensureParticipantsLoaded = async () => {
    const participants = useChatStore.getState().participants;
    if (Object.keys(participants).length === 0) {
      await useChatStore.getState().fetchParticipants(); // Fetch participants if none are loaded
    }
  };

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

  // Handle adding a reaction to a message
  const handleAddReaction = async (messageUuid: string, reaction: string) => {
    try {
      await addReaction(messageUuid, reaction); // Call API to add reaction
    } catch (error) {
      console.error("Error adding reaction:", error);
    }
  };

  // Group messages by date for rendering
  const groupMessagesByDate = (messages: Message[]) => {
    const grouped: Array<
      | { type: "date"; date: string }
      | {
          type: "message";
          sentAt: number;
          text: string;
          uuid: string;
          reactions?: Reaction[];
          authorUuid?: string;
          attachments?: string[];
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
        authorUuid: message.authorUuid,
        attachments: message.attachments,
      });
    });

    return grouped;
  };

  const groupedMessages = groupMessagesByDate(messages as Message[]);

  // Ensure participants are loaded on mount
  useEffect(() => {
    const initializeParticipants = async () => {
      await ensureParticipantsLoaded();
    };
    initializeParticipants();
  }, []);

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={groupedMessages}
        renderItem={({ item }) => {
          if (item.type === "date") {
            return (
              <View style={styles.dateSeparator}>
                <Text style={styles.dateText}>{item.date}</Text>
              </View>
            );
          }

          const participants = useChatStore.getState().participants;
          const authorId = item.authorUuid || "Unknown Author";
          const author = participants[authorId];

          return (
            <View style={styles.messageItem}>
              <TouchableOpacity
                style={styles.authorContainer}
                onPress={() => author && handleOpenModal(author)}
              >
                {author?.avatarUrl && (
                  <Image
                    source={{ uri: author.avatarUrl }}
                    style={styles.avatar}
                  />
                )}
                <Text style={styles.authorName}>
                  {author ? author.name : "Author not found"}
                </Text>
              </TouchableOpacity>
              <Text style={styles.messageText}>{item.text}</Text>
              {/* Render reactions */}
              {item.reactions && item.reactions.length > 0 && (
                <View style={styles.reactionsContainer}>
                  {item.reactions.map(
                    (
                      reaction: Reaction,
                      index: React.Key | null | undefined
                    ) => (
                      <View key={index} style={styles.reactionItem}>
                        <Text style={styles.reactionEmoji}>
                          {reaction.value}
                        </Text>
                        <Text style={styles.reactionCount}>
                          {
                            item.reactions.filter(
                              (r: { value: string }) =>
                                r.value === reaction.value
                            ).length
                          }
                        </Text>
                      </View>
                    )
                  )}
                </View>
              )}
              <Text style={styles.timestamp}>
                {new Date(item.sentAt).toLocaleTimeString()}
              </Text>
            </View>
          );
        }}
        keyExtractor={(item, index) => {
          if (item.type === "message") {
            return item.uuid;
          } else if (item.type === "date") {
            return `date-${index}`;
          }
          return `fallback-${index}`;
        }}
        style={styles.messageList}
      />

      {/* Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={handleCloseModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {selectedParticipant && (
              <>
                {selectedParticipant.avatarUrl && (
                  <Image
                    source={{ uri: selectedParticipant.avatarUrl }}
                    style={styles.modalAvatar}
                  />
                )}
                <Text style={styles.modalName}>{selectedParticipant.name}</Text>
                <Text style={styles.modalBio}>{selectedParticipant.bio}</Text>
                <Text style={styles.modalJob}>
                  {selectedParticipant.jobTitle}
                </Text>
                <Text style={styles.modalEmail}>
                  {selectedParticipant.email}
                </Text>
              </>
            )}
            <Button title="Close" onPress={handleCloseModal} />
          </View>
        </View>
      </Modal>

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
  authorContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  authorName: {
    fontWeight: "bold",
    fontSize: 16,
  },
  modalJobTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 10,
  },
  reactionCount: {
    fontSize: 14,
    color: "#888",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Fondo semitransparente
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
    width: "80%",
  },
  modalAvatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  modalName: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  modalBio: {
    fontSize: 16,
    fontStyle: "italic",
    marginBottom: 10,
  },
  modalJob: {
    fontSize: 16,
    marginBottom: 5,
  },
  modalEmail: {
    fontSize: 14,
    color: "blue",
    textDecorationLine: "underline",
    marginBottom: 15,
  },
});

export default ChatScreen;
