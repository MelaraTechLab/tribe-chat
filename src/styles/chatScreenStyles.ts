/**
 * chatScreenStyles.ts
 *
 * This file contains all the styles used across the ChatScreen components,
 * including message items, modals, input containers, and other UI elements.
 * The styles are centralized here to maintain consistency and readability.
 */

import { StyleSheet } from "react-native";

export const chatStyles = StyleSheet.create({
  // Container for the entire screen
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 10,
  },
  // List of messages
  messageList: {
    flex: 1,
  },
  // Date separator in the message list
  dateSeparator: {
    marginVertical: 10,
    alignItems: "center",
  },
  // Text for the date separator
  dateText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#444",
  },
  // Container for the message input
  inputContainer: {
    // flexDirection: "row",
    alignItems: "center",
    borderTopWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 10,
    marginHorizontal: 10,
    marginBottom: 10,
    flexDirection: "column",
  },
  // Text input field for messages
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginRight: 10,
    fontSize: 16,
  },
  // Modal container with a semi-transparent background
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContainerReaction: {
    width: "80%",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
  },
  // Content inside the modal
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
    width: "80%",
  },
  // Avatar inside the modal
  modalAvatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  // Name text in the modal
  modalName: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  // Bio text in the modal
  modalBio: {
    fontSize: 16,
    fontStyle: "italic",
    marginBottom: 10,
  },
  // Job title in the modal
  modalJob: {
    fontSize: 16,
    marginBottom: 5,
  },
  // Email link in the modal
  modalEmail: {
    fontSize: 14,
    color: "blue",
    textDecorationLine: "underline",
    marginBottom: 15,
  },
  // Job title style
  modalJobTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 10,
  },
  // Container for loading state
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  // Loading text
  loadingText: {
    fontSize: 16,
    color: "#888",
  },
  // Full-size image preview
  imagePreview: {
    width: "90%",
    height: "70%",
    resizeMode: "contain",
  },
  // Details text for the image preview
  imageDetails: {
    color: "#fff",
    fontSize: 16,
    marginTop: 10,
  },
  // Container for navigation controls
  controls: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
    width: "80%",
  },
  // Style for the close button
  closeButton: {
    backgroundColor: "#FF5722",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginHorizontal: 10,
  },
  // Text inside the close button
  closeButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  // Centered button container
  centeredButtonContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
    width: "100%",
  },
  replyingToContainer: {
    marginBottom: 5,
    padding: 5,
    backgroundColor: "#e6e6e6",
    borderRadius: 5,
    alignSelf: "stretch",
  },
  replyingToLabel: {
    fontWeight: "bold",
    fontSize: 14,
    marginBottom: 2,
  },
  replyingToText: {
    fontSize: 14,
    color: "#555",
  },
  cancelReply: {
    backgroundColor: "red",
    color: "white",
    fontSize: 12,
    borderRadius: 3,
    paddingHorizontal: 8,
    paddingVertical: 4,
    alignSelf: "flex-end",
    marginTop: 5,
  },
  textInputRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
  },
  reactionsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
  },
  reactionOption: {
    padding: 10,
    margin: 5,
    backgroundColor: "#E0E0E0",
    borderRadius: 10,
  },
  staticDateHeader: {
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  staticDateText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  groupedMessage: {
    marginTop: 2,
  },
  navigationContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    backgroundColor: "#000",
  },
  navigationButton: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  messageItem: {
    padding: 10,
    marginVertical: 5,
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
    position: "relative",
  },
  groupedMessageItem: {
    marginTop: 2,
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
    color: "#333",
  },
  messageText: {
    fontSize: 14,
    color: "#000",
  },
  editedIndicator: {
    fontSize: 12,
    color: "#999",
  },
  quotedMessageContainer: {
    marginTop: 8,
    padding: 8,
    backgroundColor: "#e9e9e9",
    borderRadius: 5,
  },
  quotedMessageLabel: {
    fontWeight: "bold",
    fontSize: 12,
    color: "#555",
  },
  quotedMessageText: {
    fontSize: 12,
    color: "#333",
  },
  attachmentsContainer: {
    marginTop: 10,
    flexDirection: "row",
    flexWrap: "wrap",
  },
  attachmentImage: {
    width: 60,
    height: 60,
    margin: 5,
    borderRadius: 5,
  },
  reactionsContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },
  reactionItem: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 8,
    backgroundColor: "#f1f1f1",
    padding: 5,
    borderRadius: 5,
  },
  reactionEmoji: {
    fontSize: 18,
  },
  reactionCount: {
    fontSize: 14,
    marginLeft: 5,
    color: "#555",
  },
  addReactionButton: {
    padding: 5,
    backgroundColor: "#ddd",
    borderRadius: 5,
  },
  addReactionText: {
    fontSize: 16,
    color: "#555",
  },
  replyButton: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "#007BFF",
    padding: 5,
    borderRadius: 5,
  },
  replyButtonText: {
    color: "#fff",
    fontSize: 12,
  },
  timestamp: {
    marginTop: 8,
    fontSize: 10,
    color: "#777",
    textAlign: "right",
  },
});
