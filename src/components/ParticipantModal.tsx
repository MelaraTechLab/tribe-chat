/**
 * ParticipantModal.tsx
 *
 * Displays a modal with detailed information about a selected participant.
 * The modal includes their avatar, name, bio, job title, and email.
 * It can be closed using the provided `onClose` function.
 */

import React from "react";
import { Modal, View, Text, Image, Button } from "react-native";
import { chatStyles } from "../styles/chatScreenStyles";
import { Participant } from "../types/chatTypes";

type ParticipantModalProps = {
  visible: boolean; // Determines modal visibility
  participant: Participant | null; // The participant to display, null when no selection
  onClose: () => void; // Callback to close the modal
};

/**
 * Component: ParticipantModal
 * A reusable modal component to display detailed participant information.
 */
const ParticipantModal: React.FC<ParticipantModalProps> = ({
  visible,
  participant,
  onClose,
}) => {
  // Prevent rendering if no participant is passed
  if (!participant) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide" // Smooth slide-in animation for better UX
    >
      <View style={chatStyles.modalContainer}>
        <View style={chatStyles.modalContent}>
          {/* Avatar */}
          {participant.avatarUrl && (
            <Image
              source={{ uri: participant.avatarUrl }}
              style={chatStyles.modalAvatar}
              accessibilityLabel="Participant's avatar"
            />
          )}

          {/* Name */}
          <Text style={chatStyles.modalName} accessibilityRole="header">
            {participant.name}
          </Text>

          {/* Bio */}
          {participant.bio && (
            <Text
              style={chatStyles.modalBio}
              accessibilityLabel="Participant bio"
            >
              {participant.bio}
            </Text>
          )}

          {/* Job Title */}
          {participant.jobTitle && (
            <Text
              style={chatStyles.modalJob}
              accessibilityLabel="Participant job title"
            >
              {participant.jobTitle}
            </Text>
          )}

          {/* Email */}
          {participant.email && (
            <Text
              style={chatStyles.modalEmail}
              accessibilityLabel="Participant email"
            >
              {participant.email}
            </Text>
          )}

          {/* Close Button */}
          <Button
            title="Close"
            onPress={onClose}
            accessibilityLabel="Close modal button"
          />
        </View>
      </View>
    </Modal>
  );
};

export default ParticipantModal;
