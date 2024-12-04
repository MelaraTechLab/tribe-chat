/**
 * MessageItem Component
 * ---------------------
 * This component is responsible for rendering individual chat messages.
 * It handles:
 * - Displaying the author's avatar, name, and message content.
 * - Showing edited indicators for updated messages.
 * - Rendering image attachments and allowing image previews.
 * - Grouping consecutive messages.
 * - Displaying reactions and adding new ones.
 * - Quoted messages for replies.
 * - Timestamp and reply actions.
 */

import React, { useEffect, useState } from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { chatStyles } from "../styles/chatScreenStyles";
import useChatStore from "../store/useChatStore";
import { Attachment, Message, Participant, Reaction } from "../types/chatTypes";
import ReactionSelectorModal from "./ReactionSelectorModal";

type MessageItemProps = {
  message: Message;
  onOpenParticipantModal: (participant: Participant) => void;
  onOpenImagePreview: (attachments: Attachment[], index: number) => void;
  isGrouped: boolean;
};

const MessageItem: React.FC<MessageItemProps> = ({
  message,
  onOpenParticipantModal,
  onOpenImagePreview,
  isGrouped = false,
}) => {
  const participants = useChatStore((state) => state.participants);
  const refreshUsers = useChatStore((state) => state.refreshUsers);
  const addReaction = useChatStore((state) => state.addReactionToMessage);
  const setReplyingTo = useChatStore((state) => state.setReplyingTo);
  const messages = useChatStore((state) => state.messages);

  const defaultAuthor: Participant = {
    uuid: "unknown",
    name: "Unknown",
    avatarUrl: "",
    bio: "",
    jobTitle: "",
    email: "",
  };
  const author = participants[message.authorUuid] || defaultAuthor;
  const adjustedAuthor: Participant = {
    ...author,
    uuid: author.id,
  };
  const [isModalVisible, setModalVisible] = useState(false);
  const [isUnknown, setIsUnknown] = useState(false);

  // Check for unknown participants and refresh the list if necessary
  useEffect(() => {
    if (message.authorUuid && !participants[message.authorUuid]) {
      setIsUnknown(true);
      refreshUsers();
    }
  }, [message.authorUuid, participants, refreshUsers]);

  /**
   * Helper function to count occurrences of a specific reaction.
   * @param reactionValue - The emoji or reaction value.
   * @returns Total count of the specified reaction.
   */
  const countReactions = (reactionValue: string): number => {
    return (
      message.reactions
        ?.filter((reaction: Reaction) => reaction.value === reactionValue)
        .reduce((acc, reaction) => acc + (reaction.count ?? 1), 0) || 0
    );
  };

  return (
    <View
      style={[
        chatStyles.messageItem,
        isGrouped && chatStyles.groupedMessageItem,
      ]}
    >
      {/* Author's information (only if not grouped) */}
      {!isGrouped && (
        <TouchableOpacity
          style={chatStyles.authorContainer}
          onPress={() => onOpenParticipantModal(author)}
        >
          {author.avatarUrl && (
            <Image
              source={{ uri: author.avatarUrl }}
              style={chatStyles.avatar}
            />
          )}
          <Text style={chatStyles.authorName}>{author.name}</Text>
        </TouchableOpacity>
      )}

      {/* Botón de Reply (superior derecha) */}
      <TouchableOpacity
        style={chatStyles.replyButton}
        onPress={() => setReplyingTo(message.uuid)}
      >
        <Text style={chatStyles.replyButtonText}>Reply</Text>
      </TouchableOpacity>

      {/* Message content */}
      <Text style={chatStyles.messageText}>
        {message.text}
        {message.updatedAt && message.sentAt !== message.updatedAt && (
          <Text style={chatStyles.editedIndicator}> (edited)</Text>
        )}
      </Text>

      {/* Quoted message */}
      {message.replyToMessageUuid && (
        <View style={chatStyles.quotedMessageContainer}>
          <Text style={chatStyles.quotedMessageLabel}>Replying to:</Text>
          <Text style={chatStyles.quotedMessageText}>
            {messages.find((msg) => msg.uuid === message.replyToMessageUuid)
              ?.text || "Original message not found"}
          </Text>
        </View>
      )}

      {/* Image attachments */}
      {Array.isArray(message.attachments) && message.attachments.length > 0 && (
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
      {Array.isArray(message.reactions) && message.reactions.length > 0 && (
        <View style={chatStyles.reactionsContainer}>
          {Array.from(
            new Set(message.reactions.map((reaction) => reaction.value))
          ).map((reactionValue, index) => (
            <TouchableOpacity
              key={index}
              style={chatStyles.reactionItem}
              onPress={() => addReaction(message.uuid, reactionValue)}
            >
              <Text style={chatStyles.reactionEmoji}>{reactionValue}</Text>
              <Text style={chatStyles.reactionCount}>
                {countReactions(reactionValue)}
              </Text>
            </TouchableOpacity>
          ))}

          {/* Add reaction button */}
          <TouchableOpacity
            style={chatStyles.addReactionButton}
            onPress={() => setModalVisible(true)}
          >
            <Text style={chatStyles.addReactionText}>+</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Reaction Selector Modal */}
      <ReactionSelectorModal
        isVisible={isModalVisible}
        onClose={() => setModalVisible(false)}
        onSelectReaction={(reaction) => {
          setModalVisible(false);
          addReaction(message.uuid, reaction);
        }}
      />

      {/* Timestamp */}
      <Text style={chatStyles.timestamp}>
        {new Date(message.sentAt).toLocaleTimeString()}
      </Text>
    </View>
  );
};

export default MessageItem;
