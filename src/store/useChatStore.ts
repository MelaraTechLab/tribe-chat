import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { persist, PersistStorage } from 'zustand/middleware';
import { fetchAllMessages, sendMessage, fetchParticipants } from '../api/chatApi';

/**
 * Chat Store
 * This file defines the Zustand store for managing chat data, including messages, participants,
 * and various operations such as sending, editing, and fetching data. 
 * It also persists the state using AsyncStorage for continuity across sessions.
 */

// Custom AsyncStorage wrapper for Zustand to ensure async persistence
const asyncStorage: PersistStorage<any> = {
  getItem: async (name) => {
    const value = await AsyncStorage.getItem(name);
    return value ? JSON.parse(value) : null;
  },
  setItem: async (name, value) => {
    await AsyncStorage.setItem(name, JSON.stringify(value));
  },
  removeItem: async (name) => {
    await AsyncStorage.removeItem(name);
  },
};

// Interface for a reaction
interface Reaction {
  uuid: string; // Unique identifier for the reaction
  value: string; // Emoji representing the reaction
  participantUuid: string; // UUID of the user who reacted
}

// Interface for a message object
interface Message {
  uuid: string; // Unique identifier for each message
  text: string; // Content of the message
  sentAt: number; // Timestamp of when the message was sent
  edited?: boolean; // Optional: Indicates if the message was edited
  reactions?: Reaction[]; // Optional: Array of reactions
  authorUuid?: string; // Optional: UUID of the author
  attachments?: string[]; // Optional: Attachments for the message
  replyToMessageUuid?: string;
}

// Interface for a participant object
interface Participant {
  id: string; // Participant's UUID
  name: string; // Participant's name
  bio: string; // Participant's short bio
  email: string; // Participant's email
  jobTitle: string; // Participant's job title
  avatarUrl: string; // Participant's avatar URL
  createdAt: number; // Timestamp of creation
  updatedAt: number; // Timestamp of last update
}

// Interface defining the chat store state
interface ChatState {
  messages: Message[];
  participants: Record<string, Participant>; // Map of participants by their IDs
  replyingTo: string | null; // New state for tracking replies
  setReplyingTo: (messageUuid: string | null) => void; // Action to set or clear reply
  addMessage: (text: string) => Promise<void>; // Async function to send and add a new message
  loadMessages: () => Promise<void>; // Async function to fetch and load all messages
  fetchParticipants: () => Promise<void>; // Async function to fetch and store participants
  editMessage: (id: string, newText: string) => void; // Function to edit an existing message
  refreshUsers: () => Promise<void>;
  addReactionToMessage: (messageUuid: string, emoji: string) => void;
}

// Zustand store with persistence to manage chat messages
const useChatStore = create<ChatState>()(
  persist(
    (set) => ({
      messages: [],
      participants: {},

      replyingTo: null, // State to hold the message being replied to (if any)
      setReplyingTo: (messageUuid: string | null) => {
        set({ replyingTo: messageUuid }); // Update the reply state
      },

      // Function to add a new message by sending it to the API and updating the store
      addMessage: async (text: string): Promise<void> => {
        try {
          // Send the message to the API
          const newMessageFromApi = await sendMessage(text);

          // Update the state using 'set'
          set((state) => {
            const replyingTo = state.replyingTo; // Access the current reply target

            // Create the new message with `replyToMessageUuid` if `replyingTo` exists
            const newMessage: Message = {
              uuid: newMessageFromApi.id,
              text: newMessageFromApi.text,
              sentAt: new Date(newMessageFromApi.createdAt || Date.now()).getTime(), // Convert date to timestamp
              reactions: newMessageFromApi.reactions || [], // Reactions (if any)
              authorUuid: newMessageFromApi.authorUuid, // Author
              attachments: newMessageFromApi.attachments || [], // Attachments
              replyToMessageUuid: replyingTo || undefined, // Add `replyToMessageUuid` only if it exists
            };

            return {
              messages: [...state.messages, newMessage], // Add the new message
              replyingTo: null, // Clear the reply state after sending
            };
          });
        } catch (error) {
          console.error('Error adding message:', error);
        }
      },

      // Function to load all messages from the API and update the store
      loadMessages: async (): Promise<void> => {
        try {
          const messagesFromApi = await fetchAllMessages();

          // Transform API response into the expected format
          const messages: Message[] = messagesFromApi.map((msg: any) => ({
            uuid: msg.id || msg.uuid, // Use `id` or `uuid` as the unique identifier
            text: msg.text || 'No content', // Fallback if no text is provided
            sentAt: new Date(msg.createdAt || msg.sentAt).getTime(), // Convert date to timestamp
            reactions: msg.reactions || [], // Default to empty array if no reactions
            authorUuid: msg.authorUuid, // Preserve author information
            attachments: msg.attachments || [], // Preserve attachments
          }));
          set({ messages }); // Update the store with the transformed messages
        } catch (error) {
          console.error('Error loading messages:', error);
        }
      },

      /**
     * Simulates adding or updating a reaction. 
     * This logic is temporary and assumes the backend will handle reactions properly in the future.
     */
      // Function to add or update a reaction for a message
      addReactionToMessage: (messageUuid: string, emoji: string): void => {
        set((state) => ({
          messages: state.messages.map((msg) => {
            if (msg.uuid === messageUuid) {
              // Check if the user has already reacted with the same emoji
              const existingUserReaction = msg.reactions?.find(
                (reaction) => reaction.value === emoji && reaction.participantUuid === "you"
              );
      
              if (existingUserReaction) {
                // If the user already reacted with this emoji, do nothing
                console.warn("You have already reacted with this emoji.");
                return msg; // Return the message unchanged
              }
      
              // Find the reaction for the emoji (any user)
              const existingReaction = msg.reactions?.find((reaction) => reaction.value === emoji);
      
              if (existingReaction) {
                // Increment the count of the existing reaction
                return {
                  ...msg,
                  reactions: msg.reactions?.map((reaction) =>
                    reaction.value === emoji
                      ? {
                          ...reaction,
                          count: (reaction.count || 1) + 1,
                          participantUuid: "you", // Mark the reaction as yours
                        }
                      : reaction
                  ),
                };
              } else {
                // Add a new reaction if it does not exist
                return {
                  ...msg,
                  reactions: [
                    ...(msg.reactions || []),
                    { uuid: Date.now().toString(), value: emoji, participantUuid: "you", count: 1 },
                  ],
                };
              }
            }
            return msg;
          }),
        }));
      },
      
      // Function to load participants from the API and update the store
      fetchParticipants: async (): Promise<void> => {
        try {
          const participantsFromApi = await fetchParticipants();

          // Transform the list of participants into a map
          const participants: Record<string, Participant> = participantsFromApi.reduce(
            (acc: Record<string, Participant>, participant: any) => {
              acc[participant.uuid] = {
                id: participant.uuid,
                name: participant.name,
                bio: participant.bio,
                email: participant.email,
                jobTitle: participant.jobTitle,
                avatarUrl: participant.avatarUrl,
                createdAt: participant.createdAt,
                updatedAt: participant.updatedAt,
              };
              return acc;
            },
            {}
          );

          set({ participants });
        } catch (error) {
          console.error('Error fetching participants from API:', error);
        }
      },

      refreshUsers: async (): Promise<void> => {
        try {
          const participantsFromApi = await fetchParticipants();
      
          // Transform the list into a map of participants
          const newParticipants: Record<string, Participant> = participantsFromApi.reduce(
            (acc: Record<string, Participant>, participant: any) => {
              acc[participant.uuid] = {
                id: participant.uuid,
                name: participant.name,
                bio: participant.bio,
                email: participant.email,
                jobTitle: participant.jobTitle,
                avatarUrl: participant.avatarUrl,
                createdAt: participant.createdAt,
                updatedAt: participant.updatedAt,
              };
              return acc;
            },
            {}
          );
      
          // Update the global state, merging new participants with existing ones
          set((state) => ({
            participants: {
              ...state.participants,
              ...newParticipants,
            },
          }));
        } catch (error) {
          console.error('Error refreshing participants:', error);
        }
      },
      

      // Function to edit an existing message by its ID
      editMessage: (id: string, newText: string): void => {
        set((state) => ({
          messages: state.messages.map((msg) =>
            msg.uuid === id ? { ...msg, text: newText, edited: true } : msg
          ),
        }));
      },
    }),
    {
      name: 'chat-storage', // Name for persistence storage
      storage: asyncStorage, // Use custom AsyncStorage wrapper
    }
  )
);

export default useChatStore;
