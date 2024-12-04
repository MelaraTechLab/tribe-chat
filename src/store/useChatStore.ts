import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { persist, PersistStorage } from "zustand/middleware";
import {
  fetchAllMessages,
  sendMessage,
  fetchParticipants,
  fetchLatestMessages,
  fetchOlderMessages,
} from "../api/chatApi";

/**
 * Zustand Chat Store
 * Manages the chat data, including messages, participants, and their interactions.
 * Supports operations such as sending, editing, fetching, and persisting state with AsyncStorage.
 */

// Custom AsyncStorage wrapper for Zustand
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

// Interfaces
interface Reaction {
  uuid: string;
  value: string;
  participantUuid: string;
}

interface Message {
  updatedAt: unknown;
  uuid: string;
  text: string;
  sentAt: number;
  edited?: boolean;
  reactions?: Reaction[];
  authorUuid?: string;
  attachments?: string[];
  replyToMessageUuid?: string;
}

interface Participant {
  id: string;
  name: string;
  bio: string;
  email: string;
  jobTitle: string;
  avatarUrl: string;
  createdAt: number;
  updatedAt: number;
}

interface ChatState {
  messages: Message[];
  participants: Record<string, Participant>;
  replyingTo: string | null;
  setReplyingTo: (messageUuid: string | null) => void;
  addMessage: (text: string) => Promise<void>;
  loadMessages: () => Promise<void>;
  loadOlderMessages: (refMessageUuid: string) => Promise<void>;
  fetchParticipants: () => Promise<void>;
  editMessage: (id: string, newText: string) => void;
  refreshUsers: () => Promise<void>;
  addReactionToMessage: (messageUuid: string, emoji: string) => void;
}

// Zustand store
const useChatStore = create<ChatState>()(
  persist(
    (set) => ({
      // Initial state
      messages: [],
      participants: {},
      replyingTo: null,

      // Set the reply-to state
      setReplyingTo: (messageUuid: string | null) => {
        set({ replyingTo: messageUuid });
      },

      // Add a new message to the store and scroll to the latest message
      addMessage: async (text: string): Promise<void> => {
        try {
          const newMessageFromApi = await sendMessage(text);

          set((state) => {
            const newMessage: Message = {
              uuid: newMessageFromApi.id,
              text: newMessageFromApi.text,
              sentAt: new Date(
                newMessageFromApi.createdAt || Date.now()
              ).getTime(),
              reactions: newMessageFromApi.reactions || [],
              authorUuid: "you", // Ensure the current user is the author
              attachments: newMessageFromApi.attachments || [],
              replyToMessageUuid: state.replyingTo || undefined,
              updatedAt: newMessageFromApi.updatedAt || Date.now(),
            };

            // Add the new message at the beginning to match the expected order
            const updatedMessages = [newMessage, ...state.messages];

            return {
              messages: updatedMessages, // Update state with the new message
              replyingTo: null,
            };
          });
        } catch (error) {
          console.error("Error adding message:", error);
        }
      },

      // Load all messages
      loadMessages: async (): Promise<void> => {
        try {
          const allMessagesFromApi = await fetchAllMessages();
          // const latestMessagesFromApi = await fetchLatestMessages();
          const messages: Message[] = allMessagesFromApi.map((msg: any) => ({
            uuid: msg.id || msg.uuid,
            text: msg.text || "No content",
            sentAt: new Date(msg.createdAt || msg.sentAt).getTime(),
            reactions: msg.reactions || [],
            authorUuid: msg.authorUuid,
            attachments: msg.attachments || [],
            updatedAt: msg.updatedAt || Date.now(),
          }));
          set({ messages: messages.reverse() });
        } catch (error) {
          console.error("Error loading all messages:", error);
        }
      },

      // Load older messages
      loadOlderMessages: async (refMessageUuid: string): Promise<void> => {
        try {
          const olderMessagesFromApi = await fetchOlderMessages(refMessageUuid);
          const olderMessages: Message[] = olderMessagesFromApi.map(
            (msg: any) => ({
              uuid: msg.id || msg.uuid,
              text: msg.text || "No content",
              sentAt: new Date(msg.createdAt || msg.sentAt).getTime(),
              reactions: msg.reactions || [],
              authorUuid: msg.authorUuid,
              attachments: msg.attachments || [],
              updatedAt: msg.updatedAt || Date.now(),
            })
          );
          set((state) => {
            const existingUuids = new Set(
              state.messages.map((msg) => msg.uuid)
            );
            const filteredMessages = olderMessages.filter(
              (msg) => !existingUuids.has(msg.uuid)
            );
            return {
              messages: [...filteredMessages.reverse(), ...state.messages].sort(
                (a, b) => a.sentAt - b.sentAt
              ),
            };
          });
        } catch (error) {
          console.error("Error loading older messages:", error);
        }
      },

      // Add or update a reaction
      addReactionToMessage: (messageUuid: string, emoji: string): void => {
        set((state) => ({
          messages: state.messages.map((msg) => {
            if (msg.uuid === messageUuid) {
              const existingReaction = msg.reactions?.find(
                (reaction) =>
                  reaction.value === emoji && reaction.participantUuid === "you"
              );
              if (existingReaction) return msg;
              return {
                ...msg,
                reactions: [
                  ...(msg.reactions || []),
                  {
                    uuid: Date.now().toString(),
                    value: emoji,
                    participantUuid: "you",
                  },
                ],
              };
            }
            return msg;
          }),
        }));
      },

      // Fetch and store participants
      fetchParticipants: async (): Promise<void> => {
        try {
          const participantsFromApi = await fetchParticipants();
          const participants = participantsFromApi.reduce(
            (acc: Record<string, Participant>, participant: any) => ({
              ...acc,
              [participant.uuid]: {
                id: participant.uuid,
                name: participant.name,
                bio: participant.bio,
                email: participant.email,
                jobTitle: participant.jobTitle,
                avatarUrl: participant.avatarUrl,
                createdAt: participant.createdAt,
                updatedAt: participant.updatedAt,
              },
            }),
            {}
          );
          set({ participants });
        } catch (error) {
          console.error("Error fetching participants:", error);
        }
      },

      // Refresh participants
      refreshUsers: async (): Promise<void> => {
        try {
          const participantsFromApi = await fetchParticipants();
          const newParticipants = participantsFromApi.reduce(
            (acc: Record<string, Participant>, participant: any) => ({
              ...acc,
              [participant.uuid]: {
                id: participant.uuid,
                name: participant.name,
                bio: participant.bio,
                email: participant.email,
                jobTitle: participant.jobTitle,
                avatarUrl: participant.avatarUrl,
                createdAt: participant.createdAt,
                updatedAt: participant.updatedAt,
              },
            }),
            {}
          );
          set((state) => ({
            participants: { ...state.participants, ...newParticipants },
          }));
        } catch (error) {
          console.error("Error refreshing participants:", error);
        }
      },

      // Edit a message
      editMessage: (id: string, newText: string): void => {
        set((state) => ({
          messages: state.messages.map((msg) =>
            msg.uuid === id ? { ...msg, text: newText, edited: true } : msg
          ),
        }));
      },
    }),
    {
      name: "chat-storage",
      storage: asyncStorage,
    }
  )
);

export default useChatStore;
