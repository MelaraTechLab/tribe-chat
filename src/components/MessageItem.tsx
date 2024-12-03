/**
 * MessageItem Component
 * ---------------------
 * This component is responsible for rendering individual chat messages.
 * It displays the author's details, message content, any attached images,
 * reactions, and a timestamp.
 *
 * Props:
 * - message: The message object containing the text, attachments, and reactions.
 * - onOpenParticipantModal: Function to open a modal with participant details.
 * - onOpenImagePreview: Function to open the image preview modal with attachments.
 */

import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { chatStyles } from "../styles/chatScreenStyles";
import useChatStore from "../store/useChatStore";
import { Attachment, Message, Participant, Reaction } from "../types/chatTypes";

type MessageItemProps = {
  message: Message;
  onOpenParticipantModal: (participant: Participant) => void;
  onOpenImagePreview: (attachments: Attachment[], index: number) => void;
};

const MessageItem: React.FC<MessageItemProps> = ({
  message,
  onOpenParticipantModal,
  onOpenImagePreview,
}) => {
  const participants = useChatStore((state) => state.participants);
  const author = participants[message.authorUuid] || { name: "Unknown" };

  /**
   * Counts the occurrences of a specific reaction.
   * @param reactionValue - The emoji or reaction value.
   * @returns Number of occurrences for the specified reaction.
   */
  const countReactions = (reactionValue: string) => {
    return (
      message.reactions?.filter(
        (reaction: Reaction) => reaction.value === reactionValue
      ).length || 0
    );
  };

  return (
    <View style={chatStyles.messageItem}>
      {/* Author information */}
      <TouchableOpacity
        style={chatStyles.authorContainer}
        onPress={() => onOpenParticipantModal(author)}
      >
        {author.avatarUrl && (
          <Image source={{ uri: author.avatarUrl }} style={chatStyles.avatar} />
        )}
        <Text style={chatStyles.authorName}>{author.name}</Text>
      </TouchableOpacity>

      {/* Message content */}
      <Text style={chatStyles.messageText}>{message.text}</Text>

      {/* Attachments */}
      {message.attachments?.length > 0 && (
        <View style={chatStyles.attachmentsContainer}>
          {message.attachments.map((attachment, index) =>
            attachment.type === "image" ? (
              <TouchableOpacity
                key={attachment.uuid}
                onPress={() =>
                  onOpenImagePreview(message.attachments || [], index)
                }
              >
                <Image
                  source={{ uri: attachment.url }}
                  style={chatStyles.attachmentImage}
                />
              </TouchableOpacity>
            ) : null
          )}
        </View>
      )}

      {/* Reactions */}
      {message.reactions && message.reactions.length > 0 && (
        <View style={chatStyles.reactionsContainer}>
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
