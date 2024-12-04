/**
 * ChatScreen Component
 * --------------------
 * Main chat interface including:
 * - Message list with participant and image handling.
 * - Input bar for sending messages.
 * - Modals for participant details and image previews.
 */

import React, { useEffect, useState, useRef, useCallback } from "react";
import { View, FlatList } from "react-native";
import useChatStore from "../store/useChatStore";
import ChatInput from "../components/ChatInput";
import MessageList from "../components/MessageList";
import ParticipantModal from "../components/ParticipantModal";
import { chatStyles } from "../styles/chatScreenStyles";
import { Attachment, Participant } from "../types/chatTypes";
import ImagePreviewModal from "../components/ImagePreviewModal";

const ChatScreen: React.FC = () => {
  // Global state for messages and functions
  const { messages, loadMessages, loadOlderMessages } = useChatStore();

  // State management for modals
  const [isParticipantModalVisible, setParticipantModalVisible] =
    useState(false);
  const [selectedParticipant, setSelectedParticipant] =
    useState<Participant | null>(null);

  const [isImagePreviewVisible, setImagePreviewVisible] = useState(false);
  const [selectedImages, setSelectedImages] = useState<Attachment[]>([]);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number>(0);

  // Reference for FlatList to enable scrolling
  const flatListRef = useRef<FlatList>(null);

  // Function to open the image preview modal
  const handleOpenImagePreview = useCallback(
    (attachments: { url: string }[], index: number) => {
      const validAttachments: Attachment[] = attachments.map(
        (attachment, idx) => ({
          uuid: `temp-uuid-${idx}`,
          url: attachment.url,
          type: "image",
        })
      );
      setSelectedImages(validAttachments);
      setSelectedImageIndex(index);
      setImagePreviewVisible(true);
    },
    []
  );

  // Function to close the image preview modal
  const handleCloseImagePreview = useCallback(() => {
    setImagePreviewVisible(false);
  }, []);

  // Function to open the participant details modal
  const handleOpenParticipantModal = useCallback((participant: Participant) => {
    setSelectedParticipant(participant);
    setParticipantModalVisible(true);
  }, []);

  // Function to close the participant modal
  const handleCloseParticipantModal = useCallback(() => {
    setParticipantModalVisible(false);
    setSelectedParticipant(null);
  }, []);

  // Initial message loading on component mount
  useEffect(() => {
    const initializeChat = async () => {
      try {
        await useChatStore.getState().loadMessages(); // Load the latest messages
      } catch (error) {
        console.error("Failed to initialize chat:", error);
      }
    };

    initializeChat();
  }, []);

  return (
    <View style={chatStyles.container}>
      {/* Message list component */}
      <MessageList
        messages={messages.map((msg) => ({
          ...msg,
          updatedAt: msg.updatedAt || Date.now(),
          reactions: msg.reactions || [],
          attachments: msg.attachments || [],
        }))}
        flatListRef={flatListRef}
        onOpenParticipantModal={handleOpenParticipantModal}
        onOpenImagePreview={handleOpenImagePreview}
        loadOlderMessages={loadOlderMessages}
      />
      {/* Input bar for sending messages */}
      <ChatInput flatListRef={flatListRef} />
      {/* Participant details modal */}
      <ParticipantModal
        visible={isParticipantModalVisible}
        participant={selectedParticipant}
        onClose={handleCloseParticipantModal}
      />
      {/* Image preview modal */}
      <ImagePreviewModal
        visible={isImagePreviewVisible}
        attachments={selectedImages.map((img) => ({
          ...img,
          type: img.type || "image",
          uuid: img.uuid || "",
        }))}
        initialIndex={selectedImageIndex}
        onClose={handleCloseImagePreview}
      />
    </View>
  );
};

export default ChatScreen;
