import React from "react";
import { FlatList, View, Text } from "react-native";
import MessageItem from "./MessageItem";
import { chatStyles } from "../styles/chatScreenStyles";
import { Message, Participant } from "../types/chatTypes";

// Define las props del componente
type MessageListProps = {
  messages: Message[]; // Lista de mensajes
  flatListRef: React.RefObject<FlatList>; // Referencia a FlatList
  onOpenParticipantModal: (participant: Participant) => void; // Función para abrir el modal de participante
};

const MessageList: React.FC<MessageListProps> = ({
  messages,
  flatListRef,
  onOpenParticipantModal,
}) => {
  // Agrupa mensajes por fecha con etiquetas "Today" y "Yesterday"
  const groupMessagesByDate = (messages: Message[]) => {
    const grouped: Array<
      { type: "date"; date: string } | { type: "message"; [key: string]: any }
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

      grouped.push({ type: "message", ...message });
    });

    return grouped;
  };

  const groupedMessages = groupMessagesByDate(messages);

  return (
    <FlatList
      ref={flatListRef}
      data={groupedMessages}
      keyExtractor={(item, index) =>
        item.type === "message" ? item.uuid : `date-${index}`
      }
      renderItem={({ item }) =>
        item.type === "date" ? (
          <View style={chatStyles.dateSeparator}>
            <Text style={chatStyles.dateText}>{item.date}</Text>
          </View>
        ) : (
          <MessageItem
            message={item}
            onOpenParticipantModal={onOpenParticipantModal}
          />
        )
      }
      style={chatStyles.messageList}
    />
  );
};

export default MessageList;
