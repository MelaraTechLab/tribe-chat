/**
 * @file chatTypes.ts
 * @description Defines TypeScript types for participants, messages, reactions, and attachments used in the chat application.
 */

/**
 * Type representing a participant in the chat.
 */
export type Participant = {
  uuid: string; // Unique identifier for the participant
  name: string; // Participant's name
  avatarUrl?: string; // Optional: URL for the participant's avatar
  bio?: string; // Optional: Participant's biography
  jobTitle?: string; // Optional: Job title of the participant
  email?: string; // Optional: Participant's email address
};

/**
 * Type representing a message in the chat.
 */
export type Message = {
  uuid: string; // Unique identifier for the message
  sentAt: number; // Timestamp of when the message was sent
  text: string; // Message content
  authorUuid: string; // UUID of the message's author
  reactions?: Reaction[]; // Optional: Array of reactions to the message
  attachments?: Attachment[]; // Optional: Array of attachments (e.g., images)
};

/**
 * Type representing a reaction to a message.
 */
export type Reaction = {
  uuid: string; // Unique identifier for the reaction
  value: string; // Emoji or value representing the reaction
  participantUuid: string; // UUID of the participant who reacted
};

/**
 * Type representing an attachment in a message.
 */
export type Attachment = {
  uuid: string; // Unique identifier for the attachment
  url: string; // URL of the attachment (e.g., image URL)
  type: string; // Type of the attachment (e.g., "image")
  width?: number; // Optional: Width of the attachment
  height?: number; // Optional: Height of the attachment
};
