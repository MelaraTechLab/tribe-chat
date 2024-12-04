/**
 * @file chatTypes.ts
 * @description Contains TypeScript type definitions for core entities such as participants, messages, reactions, and attachments in the chat application.
 * These types provide a structured representation of data used throughout the application.
 */

/**
 * Represents a participant in the chat room.
 */
export type Participant = {
  uuid: string; // Unique identifier for the participant.
  name: string; // Full name of the participant.
  avatarUrl?: string; // (Optional) URL of the participant's avatar image.
  bio?: string; // (Optional) A short biography or description of the participant.
  jobTitle?: string; // (Optional) Job title or designation of the participant.
  email?: string; // (Optional) Email address of the participant.
};

/**
 * Represents a single message in the chat.
 */
export type Message = {
  uuid: string; // Unique identifier for the message.
  sentAt: number; // Timestamp indicating when the message was sent (UNIX epoch time).
  text: string; // Content of the message.
  authorUuid: string; // UUID of the participant who authored the message.
  updatedAt?: number; // (Optional) Timestamp of the last update to the message (e.g., for edits).
  reactions?: Reaction[]; // (Optional) Array of reactions associated with the message.
  attachments?: Attachment[]; // (Optional) Array of attachments included in the message.
  replyToMessageUuid?: string; // (Optional) UUID of the message being replied to, if applicable.
};

/**
 * Represents a reaction to a message, such as an emoji.
 */
export type Reaction = {
  uuid: string; // Unique identifier for the reaction.
  value: string; // The emoji or value representing the reaction (e.g., "👍").
  participantUuid: string; // UUID of the participant who added the reaction.
  count?: number; // (Optional) The number of occurrences of this reaction. Defaults to 1 if not specified.
};

/**
 * Represents an attachment included in a message, such as an image.
 */
export type Attachment = {
  uuid: string; // Unique identifier for the attachment.
  url: string; // URL pointing to the attachment's location (e.g., image URL).
  type: "image"; // Type of the attachment. Currently only "image" is supported.
  width?: number; // (Optional) Width of the attachment, if applicable (e.g., for images).
  height?: number; // (Optional) Height of the attachment, if applicable (e.g., for images).
};
