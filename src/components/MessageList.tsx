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

import React, { useState } from "react";
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
  loadOlderMessages: (lastMessageUuid: string) => void;
};

const MessageList: React.FC<MessageListProps> = ({
  messages,
  flatListRef,
  onOpenParticipantModal,
  onOpenImagePreview,
  loadOlderMessages,
}) => {
  const [currentDate, setCurrentDate] = useState<string>(""); // State to track the visible date

  // Group messages by date with "Today" and "Yesterday" labels and by author
  const groupMessages = (messages: Message[]) => {
    const grouped: Array<
      | { type: "date"; date: string }
      | { type: "message"; message: Message; isGrouped: boolean }
    > = [];
    let lastDate: string | null = null;
    let lastAuthorUuid: string | null = null; // Track the last author's UUID

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

      // Add date separators
      if (displayDate !== lastDate) {
        grouped.push({ type: "date", date: displayDate });
        lastDate = displayDate;
        lastAuthorUuid = null; // Reset author grouping on date change
      }

      // Check if the current message is from the same author as the previous message
      const isGrouped = message.authorUuid === lastAuthorUuid;
      grouped.push({ type: "message", message, isGrouped });

      // Update the last author UUID
      lastAuthorUuid = message.authorUuid;
    });
    return grouped;
  };

  // Function to track visible items and update the current date
  const handleViewableItemsChanged = ({
    viewableItems,
  }: {
    viewableItems: Array<{ item: { type: string; date?: string } }>;
  }) => {
    const visibleDate = viewableItems.find((item) => item.item.type === "date");
    if (visibleDate && visibleDate.item.date !== currentDate) {
      setCurrentDate(visibleDate.item.date!); // Update the visible date
    }
  };

  const groupedMessages = groupMessages(messages);
  console.log("Grouped Messages:", groupedMessages);

  return (
    <View style={{ flex: 1 }}>
      {/* Static header for the date */}
      <View style={chatStyles.staticDateHeader}>
        <Text style={chatStyles.staticDateText}>{currentDate}</Text>
      </View>

      <FlatList
        ref={flatListRef}
        data={groupedMessages}
        keyExtractor={(item, index) =>
          item.type === "message"
            ? `${item.message.uuid}-${index}`
            : `date-${index}`
        }
        renderItem={({ item }) =>
          item.type === "message" ? (
            <MessageItem
              message={item.message}
              onOpenParticipantModal={onOpenParticipantModal}
              onOpenImagePreview={onOpenImagePreview}
              isGrouped={item.isGrouped ?? false} // Ensure isGrouped is always defined
            />
          ) : (
            <View style={chatStyles.dateSeparator}>
              <Text style={chatStyles.dateText}>{item.date}</Text>
            </View>
          )
        }
        // onEndReachedThreshold={0.5} // Trigger when halfway up the list
        // onEndReached={() => {
        //   // Obtén el mensaje más antiguo directamente desde `messages`
        //   const oldestMessage = messages[messages.length - 1];
        //   if (oldestMessage) {
        //     loadOlderMessages(oldestMessage.uuid);
        //   }
        // }}
        inverted // Invert the list to show newest messages at the bottom
        onViewableItemsChanged={handleViewableItemsChanged} // Update the current date
        viewabilityConfig={{ itemVisiblePercentThreshold: 50 }}
        style={chatStyles.messageList}
      />
    </View>
  );
};

export default MessageList;
