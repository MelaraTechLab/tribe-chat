import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { chatStyles } from "../styles/chatScreenStyles";
import useChatStore from "../store/useChatStore";
import { Message, Participant, Reaction } from "../types/chatTypes"; // Asegúrate de importar los tipos correctos

// Define las props del componente
type MessageItemProps = {
  message: Message; // Tipo del mensaje
  onOpenParticipantModal: (participant: Participant) => void; // Función para abrir el modal
};

const MessageItem: React.FC<MessageItemProps> = ({
  message,
  onOpenParticipantModal,
}) => {
  const participants = useChatStore((state) => state.participants); // Obtiene los participantes del store
  const author = participants[message.authorUuid] || { name: "Unknown" }; // Obtiene el autor del mensaje

  // Función para contar reacciones únicas
  const countReactions = (reactionValue: string) => {
    return (
      message.reactions?.filter(
        (reaction: Reaction) => reaction.value === reactionValue
      ).length || 0
    );
  };

  return (
    <View style={chatStyles.messageItem}>
      {/* Información del autor */}
      <TouchableOpacity
        style={chatStyles.authorContainer}
        onPress={() => onOpenParticipantModal(author)} // Abre el modal con el participante
      >
        {author.avatarUrl && (
          <Image source={{ uri: author.avatarUrl }} style={chatStyles.avatar} />
        )}
        <Text style={chatStyles.authorName}>{author.name}</Text>
      </TouchableOpacity>

      {/* Contenido del mensaje */}
      <Text style={chatStyles.messageText}>{message.text}</Text>

      {/* Reacciones */}
      {message.reactions && message.reactions.length > 0 && (
        <View style={chatStyles.reactionsContainer}>
          {/* Agrupa las reacciones por valor */}
          {Array.from(
            new Set(message.reactions.map((reaction) => reaction.value))
          ).map((reactionValue, index) => (
            <View key={index} style={chatStyles.reactionItem}>
              <Text style={chatStyles.reactionEmoji}>{reactionValue}</Text>
              <Text style={chatStyles.reactionCount}>
                {countReactions(reactionValue)}
              </Text>
            </View>
          ))}
        </View>
      )}

      {/* Timestamp */}
      <Text style={chatStyles.timestamp}>
        {new Date(message.sentAt).toLocaleTimeString()}
      </Text>
    </View>
  );
};

export default MessageItem;
