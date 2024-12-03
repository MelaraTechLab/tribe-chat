/**
 * ImagePreviewModal Component
 *
 * This component displays a modal for previewing images attached to messages.
 * Features:
 * - Supports navigation between multiple images using "Next" and "Previous".
 * - Dynamically updates the displayed image based on the selected index.
 * - Includes a close button to dismiss the modal.
 */

import React, { useState, useEffect } from "react";
import { Modal, View, Image, Text, TouchableOpacity } from "react-native";
import { chatStyles } from "../styles/chatScreenStyles";

type ImagePreviewModalProps = {
  visible: boolean; // Determines whether the modal is visible
  attachments: { url: string; uuid: string; type: string }[]; // List of image attachments
  initialIndex: number; // The initial image index to display
  onClose: () => void; // Callback function to close the modal
};

const ImagePreviewModal: React.FC<ImagePreviewModalProps> = ({
  visible,
  attachments,
  initialIndex,
  onClose,
}) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  // Reset the current index to the initial index whenever the modal is opened
  useEffect(() => {
    if (visible) {
      setCurrentIndex(initialIndex);
    }
  }, [visible, initialIndex]);

  // Navigate to the next image
  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % attachments.length);
  };

  // Navigate to the previous image
  const handlePrevious = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? attachments.length - 1 : prevIndex - 1
    );
  };

  // Do not render the modal if there are no attachments
  if (!attachments.length) return null;

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={chatStyles.modalContainer}>
        {/* Display the currently selected image */}
        <Image
          source={{ uri: attachments[currentIndex]?.url }}
          style={chatStyles.imagePreview}
        />

        {/* Display image index only if there are multiple images */}
        {attachments.length > 1 && (
          <Text style={chatStyles.imageDetails}>
            Image {currentIndex + 1} of {attachments.length}
          </Text>
        )}

        {/* Close button centered below the image */}
        <View style={chatStyles.centeredButtonContainer}>
          <TouchableOpacity style={chatStyles.closeButton} onPress={onClose}>
            <Text style={chatStyles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default ImagePreviewModal;
