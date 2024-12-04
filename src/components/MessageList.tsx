/**
 * MessageList.tsx
 *
 * Component responsible for rendering a scrollable list of chat messages grouped by date
 * and participant. It also includes features to dynamically display "Today" and "Yesterday"
 * labels for recent messages.
 *
 * Features:
 * - Groups consecutive messages by the same author.
 * - Displays date separators with "Today" and "Yesterday" labels when applicable.
 * - Handles scrolling and dynamically updates the visible date.
 * - Renders messages using the `MessageItem` component.
 *
 * Props:
 * - messages: Array of chat messages to render.
 * - flatListRef: Reference to the FlatList for scrolling and programmatic control.
 * - onOpenParticipantModal: Callback for opening a modal with participant details.
 * - onOpenImagePreview: Callback for previewing attached images in a modal.
 * - loadOlderMessages: Callback to load older messages when reaching the list's top.
 */

import React, { useState } from "react";
import { FlatList, View, Text } from "react-native";
import MessageItem from "./MessageItem";
import { chatStyles } from "../styles/chatScreenStyles";
import { Message, Participant } from "../types/chatTypes";

// Define a union type for grouped messages
type GroupedMessage =
  | { type: "date"; date: string }
  | { type: "message"; message: Message; isGrouped: boolean };

// Define props for the MessageList component
type MessageListProps = {
  messages: Message[]; // List of chat messages
  flatListRef: React.RefObject<FlatList>; // Reference to the FlatList for external control
  onOpenParticipantModal: (participant: Participant) => void; // Handler for participant modals
  onOpenImagePreview: (attachments: { url: string }[], index: number) => void; // Handler for image preview modals
  loadOlderMessages: (lastMessageUuid: string) => void; // Function to fetch older messages
};

const MessageList: React.FC<MessageListProps> = ({
  messages,
  flatListRef,
  onOpenParticipantModal,
  onOpenImagePreview,
  loadOlderMessages,
}) => {
  const [currentDate, setCurrentDate] = useState<string>(""); // State for the currently visible date

  /**
   * Groups messages by date and participant.
   * Consecutive messages from the same author are marked for grouping.
   */
  const groupMessages = (messages: Message[]): GroupedMessage[] => {
    const grouped: GroupedMessage[] = [];
    let lastDate: string | null = null;
    let lastAuthorUuid: string | null = null;

    messages.forEach((message, index) => {
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

      // Add a new date separator if the message's date differs from the last one
      if (displayDate !== lastDate) {
        grouped.push({ type: "date", date: displayDate });
        lastDate = displayDate;
        lastAuthorUuid = null; // Reset grouping when the date changes
      }

      // Mark messages as grouped if they're from the same author as the last message
      const isGrouped = message.authorUuid === lastAuthorUuid;

      grouped.push({
        type: "message",
        message,
        isGrouped: index !== 0 && isGrouped, // Ensure first message always shows metadata
      });

      // Update the last author's UUID
      lastAuthorUuid = message.authorUuid;
    });

    return grouped;
  };

  /**
   * Updates the currently visible date based on the list's visible items.
   */
  const handleViewableItemsChanged = ({
    viewableItems,
  }: {
    viewableItems: Array<{ item: GroupedMessage }>;
  }) => {
    const visibleDate = viewableItems.find(
      (item) => item.item.type === "date" // Check explicitly for "date" type
    );

    if (
      visibleDate &&
      visibleDate.item.type === "date" &&
      visibleDate.item.date !== currentDate
    ) {
      setCurrentDate(visibleDate.item.date); // Access 'date' safely after type check
    }
  };

  const groupedMessages = groupMessages(messages);

  return (
    <View style={{ flex: 1 }}>
      {/* Sticky header displaying the current visible date */}
      <View style={chatStyles.staticDateHeader}>
        <Text style={chatStyles.staticDateText}>{currentDate}</Text>
      </View>

      <FlatList<GroupedMessage>
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
              isGrouped={item.isGrouped} // Always defined
            />
          ) : (
            <View style={chatStyles.dateSeparator}>
              <Text style={chatStyles.dateText}>{item.date}</Text>
            </View>
          )
        }
        inverted // Shows newest messages at the bottom
        maintainVisibleContentPosition={{
          minIndexForVisible: 0, // Keep the bottom-most message visible
        }}
        onViewableItemsChanged={handleViewableItemsChanged}
        viewabilityConfig={{ itemVisiblePercentThreshold: 50 }}
        style={chatStyles.messageList}
      />
    </View>
  );
};

export default MessageList;
