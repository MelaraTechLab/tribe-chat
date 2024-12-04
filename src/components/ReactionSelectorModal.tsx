import React from "react";
import { Modal, View, Text, TouchableOpacity } from "react-native";
import { chatStyles } from "../styles/chatScreenStyles";

/**
 * Props for ReactionSelectorModal component
 * @prop {boolean} isVisible - Controls the visibility of the modal.
 * @prop {() => void} onClose - Callback to close the modal.
 * @prop {(reaction: string) => void} onSelectReaction - Callback to select a reaction.
 */
type ReactionSelectorModalProps = {
  isVisible: boolean;
  onClose: () => void;
  onSelectReaction: (reaction: string) => void;
};

// List of reactions available for selection
const REACTIONS = ["👍", "❤️", "😂", "😮", "😢", "🎉"];

/**
 * ReactionSelectorModal - A modal to select a reaction emoji.
 * @param {ReactionSelectorModalProps} props - Component props.
 * @returns {JSX.Element} - Rendered modal component.
 */
const ReactionSelectorModal: React.FC<ReactionSelectorModalProps> = ({
  isVisible,
  onClose,
  onSelectReaction,
}) => {
  // Handler for selecting a reaction
  const handleReactionSelect = (reaction: string) => {
    onSelectReaction(reaction);
    onClose();
  };

  return (
    <Modal
      visible={isVisible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose} // Adds support for back button on Android
    >
      <View style={chatStyles.modalOverlay}>
        <View style={chatStyles.modalContainer}>
          {/* Modal Header */}
          <Text style={chatStyles.modalTitle}>Select a Reaction</Text>

          {/* Reaction Options */}
          <View style={chatStyles.reactionsRow}>
            {REACTIONS.map((reaction) => (
              <TouchableOpacity
                key={reaction}
                style={chatStyles.reactionOption}
                onPress={() => handleReactionSelect(reaction)}
              >
                <Text style={chatStyles.reactionEmoji}>{reaction}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Close Button */}
          <TouchableOpacity onPress={onClose} style={chatStyles.closeButton}>
            <Text style={chatStyles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default ReactionSelectorModal;
