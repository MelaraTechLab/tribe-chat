/**
 * ImagePreviewModal Component
 *
 * This component displays a modal for previewing images attached to messages.
 *
 * Features:
 * - Navigation between images using "Next" and "Previous".
 * - Displays the current image index when there are multiple images.
 * - Includes a close button to dismiss the modal.
 *
 * Props:
 * - `visible`: Controls the modal's visibility.
 * - `attachments`: Array of image objects with `url`, `uuid`, and `type`.
 * - `initialIndex`: Index of the image to display initially.
 * - `onClose`: Callback to handle modal close action.
 */

import React, { useState, useEffect } from "react";
import { Modal, View, Image, Text, TouchableOpacity } from "react-native";
import { chatStyles } from "../styles/chatScreenStyles";

type ImagePreviewModalProps = {
  visible: boolean;
  attachments: { url: string; uuid: string; type: string }[];
  initialIndex: number;
  onClose: () => void;
};

const ImagePreviewModal: React.FC<ImagePreviewModalProps> = ({
  visible,
  attachments = [],
  initialIndex = 0,
  onClose,
}) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  useEffect(() => {
    if (visible) {
      setCurrentIndex(initialIndex);
    }
  }, [visible, initialIndex]);

  /**
   * Handles circular navigation between images.
   * @param delta - The direction of navigation (-1 for previous, +1 for next).
   */
  const navigateImage = (delta: number) => {
    setCurrentIndex(
      (prevIndex) =>
        (prevIndex + delta + attachments.length) % attachments.length
    );
  };

  // Return null if there are no valid attachments
  if (!attachments.length) return null;

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={chatStyles.modalContainer}>
        {/* Current Image Preview */}
        <Image
          source={{ uri: attachments[currentIndex]?.url }}
          style={chatStyles.imagePreview}
        />

        {/* Image index and navigation (if multiple images exist) */}
        {attachments.length > 1 && (
          <View style={chatStyles.navigationContainer}>
            <TouchableOpacity onPress={() => navigateImage(-1)}>
              <Text style={chatStyles.navigationButton}>Previous</Text>
            </TouchableOpacity>

            <Text style={chatStyles.imageDetails}>
              Image {currentIndex + 1} of {attachments.length}
            </Text>

            <TouchableOpacity onPress={() => navigateImage(1)}>
              <Text style={chatStyles.navigationButton}>Next</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Close Button */}
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
