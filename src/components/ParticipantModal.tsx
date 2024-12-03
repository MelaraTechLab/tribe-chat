/**
 * ParticipantModal.tsx
 *
 * This component displays a modal with information about a selected participant.
 * It includes details such as their avatar, name, bio, job title, and email.
 * The modal is triggered by passing a `Participant` object and can be closed with a button.
 */

import React from "react";
import { Modal, View, Text, Image, Button } from "react-native";
import { chatStyles } from "../styles/chatScreenStyles";
import { Participant } from "../types/chatTypes"; // Import the participant type

// Define the props for the component
type ParticipantModalProps = {
  visible: boolean; // Determines if the modal is visible
  participant: Participant | null; // The selected participant (null if none)
  onClose: () => void; // Function to close the modal
};

const ParticipantModal: React.FC<ParticipantModalProps> = ({
  visible,
  participant,
  onClose,
}) => {
  // Return null if no participant is provided
  if (!participant) return null;

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={chatStyles.modalContainer}>
        <View style={chatStyles.modalContent}>
          {/* Participant's avatar */}
          {participant.avatarUrl && (
            <Image
              source={{ uri: participant.avatarUrl }}
              style={chatStyles.modalAvatar}
            />
          )}

          {/* Participant's name */}
          <Text style={chatStyles.modalName}>{participant.name}</Text>

          {/* Participant's bio */}
          {participant.bio && (
            <Text style={chatStyles.modalBio}>{participant.bio}</Text>
          )}

          {/* Participant's job title */}
          {participant.jobTitle && (
            <Text style={chatStyles.modalJob}>{participant.jobTitle}</Text>
          )}

          {/* Participant's email */}
          {participant.email && (
            <Text style={chatStyles.modalEmail}>{participant.email}</Text>
          )}

          {/* Button to close the modal */}
          <Button title="Close" onPress={onClose} />
        </View>
      </View>
    </Modal>
  );
};

export default ParticipantModal;
