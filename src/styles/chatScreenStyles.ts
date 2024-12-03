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
  // Individual message container
  messageItem: {
    marginBottom: 10,
    padding: 10,
    backgroundColor: "#f1f1f1",
    borderRadius: 5,
  },
  // Text content of the message
  messageText: {
    fontSize: 16,
  },
  // Timestamp of the message
  timestamp: {
    fontSize: 12,
    color: "#888",
    marginTop: 5,
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
  // Container for reactions
  reactionsContainer: {
    flexDirection: "row",
    marginTop: 5,
  },
  // Individual reaction container
  reactionItem: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 8,
  },
  // Emoji for a reaction
  reactionEmoji: {
    fontSize: 16,
    marginRight: 4,
  },
  // Count of reactions for a specific emoji
  reactionCount: {
    fontSize: 14,
    color: "#888",
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
  // Container for the message author details
  authorContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  // Avatar of the message author
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  // Name of the message author
  authorName: {
    fontWeight: "bold",
    fontSize: 16,
  },
  // Modal container with a semi-transparent background
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
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
  // Container for attachments in a message
  attachmentsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 10,
  },
  // Style for individual attachment images
  attachmentImage: {
    width: 100,
    height: 100,
    borderRadius: 5,
    marginRight: 10,
    marginBottom: 10,
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
  replyButton: {
    marginTop: 5,
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: "#e6f7ff",
    borderRadius: 5,
  },
  replyButtonText: {
    fontSize: 12,
    color: "#007aff",
  },
  quotedMessageContainer: {
    backgroundColor: "#f0f0f0",
    borderRadius: 5,
    padding: 8,
    marginBottom: 8,
    maxWidth: "100%",
  },
  quotedMessageLabel: {
    fontWeight: "bold",
    fontSize: 12,
    color: "#555",
    marginBottom: 2,
  },
  quotedMessageText: {
    fontSize: 14,
    color: "#333",
    flexShrink: 1,
    flexWrap: "wrap",
  },
  textInputRow: {
    flexDirection: "row", 
    alignItems: "center",
  },
  addReactionButton: {
    padding: 5,
    borderRadius: 15,
    backgroundColor: '#E0E0E0',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 5,
  },
  addReactionText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "80%",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
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
    backgroundColor: "#f5f5f5", // Optional: customize the background
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  staticDateText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  editedIndicator: {
    fontSize: 12,
    color: "#888", 
  },
  groupedMessage: {
    marginTop: 2, // Reduce the margin for grouped messages
  },
  groupedMessageItem: {
    marginTop: 2, // Reduce spacing between grouped messages
  },
  
  
});
