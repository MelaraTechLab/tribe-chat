/**
 * MessageList.tsx
 *
 * Component that renders a list of messages grouped by date.
 * Includes functionality to display "Today" and "Yesterday" labels
 * for messages sent on those days. Each message is rendered using the
 * `MessageItem` component.
 *
 * Props:
 * - messages: List of messages to render.
 * - flatListRef: Reference to the FlatList for scrolling or programmatic control.
 * - onOpenParticipantModal: Function to handle opening a participant modal.
 * - onOpenImagePreview: Function to handle previewing images in a modal.
 */

import React from "react";
import { FlatList, View, Text } from "react-native";
import MessageItem from "./MessageItem";
import { chatStyles } from "../styles/chatScreenStyles";
import { Message, Participant } from "../types/chatTypes";

// Define the props for the MessageList component
type MessageListProps = {
  messages: Message[]; // List of messages
  flatListRef: React.RefObject<FlatList>; // Reference to the FlatList
  onOpenParticipantModal: (participant: Participant) => void; // Function to open the participant modal
  onOpenImagePreview: (attachments: { url: string }[], index: number) => void; // Function to open image preview
};

const MessageList: React.FC<MessageListProps> = ({
  messages,
  flatListRef,
  onOpenParticipantModal,
  onOpenImagePreview,
}) => {
  // Group messages by date with "Today" and "Yesterday" labels
  const groupMessagesByDate = (messages: Message[]) => {
    const grouped: Array<
      { type: "date"; date: string } | { type: "message"; message: Message }
    > = [];
    let lastDate: string | null = null;

    messages.forEach((message) => {
      const messageDate = new Date(message.sentAt);
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(today.getDate() - 1);

      let displayDate = messageDate.toDateString();

      if (messageDate.toDateString() === today.toDateString()) {
        displayDate = "Today";
      } else if (messageDate.toDateString() === yesterday.toDateString()) {
        displayDate = "Yesterday";
      }

      if (displayDate !== lastDate) {
        grouped.push({ type: "date", date: displayDate });
        lastDate = displayDate;
      }

      grouped.push({ type: "message", message });
    });

    return grouped;
  };

  const groupedMessages = groupMessagesByDate(messages);

  return (
    <FlatList
      ref={flatListRef}
      data={groupedMessages}
      keyExtractor={(item, index) =>
        item.type === "message" ? item.message.uuid : `date-${index}`
      }
      renderItem={({ item }) =>
        item.type === "date" ? (
          <View style={chatStyles.dateSeparator}>
            <Text style={chatStyles.dateText}>{item.date}</Text>
          </View>
        ) : (
          <MessageItem
            message={item.message}
            onOpenParticipantModal={onOpenParticipantModal}
            onOpenImagePreview={onOpenImagePreview} // Pass the function to MessageItem
          />
        )
      }
      style={chatStyles.messageList}
    />
  );
};

export default MessageList;
