import React from "react";
import { Modal, View, Text, TouchableOpacity } from "react-native";
import { chatStyles } from "../styles/chatScreenStyles";

type ReactionSelectorModalProps = {
  isVisible: boolean;
  onClose: () => void;
  onSelectReaction: (reaction: string) => void;
};

const ReactionSelectorModal: React.FC<ReactionSelectorModalProps> = ({
  isVisible,
  onClose,
  onSelectReaction,
}) => {
  const reactions = ["👍", "❤️", "😂", "😮", "😢", "🎉"]; // Example reactions

  return (
    <Modal visible={isVisible} transparent={true} animationType="slide">
      <View style={chatStyles.modalOverlay}>
        <View style={chatStyles.modalContainer}>
          <Text style={chatStyles.modalTitle}>Select a Reaction</Text>
          <View style={chatStyles.reactionsRow}>
            {reactions.map((reaction) => (
              <TouchableOpacity
                key={reaction}
                style={chatStyles.reactionOption}
                onPress={() => {
                  onSelectReaction(reaction);
                  onClose();
                }}
              >
                <Text style={chatStyles.reactionEmoji}>{reaction}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <TouchableOpacity onPress={onClose} style={chatStyles.closeButton}>
            <Text style={chatStyles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default ReactionSelectorModal;
