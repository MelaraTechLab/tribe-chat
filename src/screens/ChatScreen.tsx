/**
 * ChatScreen Component
 * --------------------
 * This component serves as the main chat interface, combining:
 * - A list of messages with participant and image handling.
 * - An input bar for sending messages.
 * - A modal for viewing participant details.
 * - A modal for previewing attached images.
 */

import React, { useEffect, useState, useRef } from "react";
import { View, FlatList } from "react-native";
import useChatStore from "../store/useChatStore";
import ChatInput from "../components/ChatInput";
import MessageList from "../components/MessageList";
import ParticipantModal from "../components/ParticipantModal";
import { chatStyles } from "../styles/chatScreenStyles";
import { Attachment, Participant } from "../types/chatTypes"; // Import necessary types
import ImagePreviewModal from "../components/ImagePreviewModal";

const ChatScreen: React.FC = () => {
  const { messages, loadMessages, loadOlderMessages } = useChatStore(); // Load messages from the global store
  const [modalVisible, setModalVisible] = useState<boolean>(false); // State for participant modal visibility
  const [selectedParticipant, setSelectedParticipant] =
    useState<Participant | null>(null); // Selected participant details
  const flatListRef = useRef<FlatList>(null); // Reference to FlatList for scrolling

  // State for image preview modal
  const [imagePreviewVisible, setImagePreviewVisible] = useState(false);
  const [selectedImages, setSelectedImages] = useState<{ url: string }[]>([]); // Currently selected images
  const [selectedImageIndex, setSelectedImageIndex] = useState<number>(0); // Index of the selected image

  // Opens the image preview modal with the selected attachments and index
  const openImagePreview = (attachments: Attachment[], index: number) => {
    setSelectedImages(attachments); // Update selected images
    setSelectedImageIndex(index); // Set the initial image index
    setImagePreviewVisible(true); // Show the modal
  };

  // Closes the image preview modal
  const closeImagePreview = () => {
    setImagePreviewVisible(false);
  };

  // Load messages when the component mounts
  useEffect(() => {
    loadMessages();
  }, []);

  useEffect(() => {
    // Load all messages on app initialization
    const initializeMessages = async () => {
      await useChatStore.getState().loadAllMessages();
      await useChatStore.getState().loadMessages(); // Load latest messages after
    };

    initializeMessages();
  }, []);

  // Opens the participant modal with selected participant details
  const handleOpenModal = (participant: Participant) => {
    setSelectedParticipant(participant);
    setModalVisible(true);
  };

  // Closes the participant modal
  const handleCloseModal = () => {
    setModalVisible(false);
    setSelectedParticipant(null);
  };

  return (
    <View style={chatStyles.container}>
      {/* Render the message list */}
      <MessageList
        messages={messages}
        flatListRef={flatListRef}
        onOpenParticipantModal={handleOpenModal} // Pass function to handle participant modal
        onOpenImagePreview={openImagePreview} // Pass function to handle image preview
        loadOlderMessages={loadOlderMessages}
      />
      {/* Render the chat input bar */}
      <ChatInput flatListRef={flatListRef} />
      {/* Render the participant modal */}
      <ParticipantModal
        visible={modalVisible}
        participant={selectedParticipant}
        onClose={handleCloseModal}
      />
      {/* Render the image preview modal */}
      <ImagePreviewModal
        visible={imagePreviewVisible}
        attachments={selectedImages} // Selected images
        initialIndex={selectedImageIndex} // Initial image index
        onClose={closeImagePreview}
      />
    </View>
  );
};

export default ChatScreen;
