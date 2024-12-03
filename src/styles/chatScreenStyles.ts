import { StyleSheet } from "react-native";

export const chatStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 10,
  },
  messageList: {
    flex: 1,
  },
  messageItem: {
    marginBottom: 10,
    padding: 10,
    backgroundColor: "#f1f1f1",
    borderRadius: 5,
  },
  messageText: {
    fontSize: 16,
  },
  timestamp: {
    fontSize: 12,
    color: "#888",
    marginTop: 5,
  },
  dateSeparator: {
    marginVertical: 10,
    alignItems: "center",
  },
  dateText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#444",
  },
  reactionsContainer: {
    flexDirection: "row",
    marginTop: 5,
  },
  reactionItem: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 8,
  },
  reactionEmoji: {
    fontSize: 16,
    marginRight: 4,
  },
  reactionCount: {
    fontSize: 14,
    color: "#888",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderTopWidth: 1,
    borderColor: "#ccc",
    padding: 10,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginRight: 10,
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
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Fondo semitransparente
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
    width: "80%",
  },
  modalAvatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  modalName: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  modalBio: {
    fontSize: 16,
    fontStyle: "italic",
    marginBottom: 10,
  },
  modalJob: {
    fontSize: 16,
    marginBottom: 5,
  },
  modalEmail: {
    fontSize: 14,
    color: "blue",
    textDecorationLine: "underline",
    marginBottom: 15,
  },
  modalJobTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    fontSize: 16,
    color: "#888",
  },
});
