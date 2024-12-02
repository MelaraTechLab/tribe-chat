import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { persist, PersistStorage } from 'zustand/middleware';
import { fetchAllMessages, sendMessage } from '../api/chatApi';

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
}

// Interface defining the chat store state
interface ChatState {
  messages: Message[];
  addMessage: (text: string) => Promise<void>; // Async function to send and add a new message
  loadMessages: () => Promise<void>; // Async function to fetch and load all messages
  editMessage: (id: string, newText: string) => void; // Function to edit an existing message
}

// Zustand store with persistence to manage chat messages
const useChatStore = create<ChatState>()(
  persist(
    (set) => ({
      messages: [],

      // Function to add a new message by sending it to the API and updating the store
      addMessage: async (text: string): Promise<void> => {
        try {
          const newMessageFromApi = await sendMessage(text);
      
          // Transform API response into the expected message format
          const newMessage: Message = {
            uuid: newMessageFromApi.id,
            text: newMessageFromApi.text,
            sentAt: new Date(newMessageFromApi.createdAt || Date.now()).getTime(), // Ensure sentAt is a timestamp
            reactions: newMessageFromApi.reactions || [], // Default to empty array if no reactions
            authorUuid: newMessageFromApi.authorUuid, // Preserve author information
            attachments: newMessageFromApi.attachments || [], // Preserve attachments
          };
      
          set((state) => ({
            messages: [...state.messages, newMessage], // Add the new message to the current state
          }));
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
            text: msg.text || "No content", // Fallback if no text is provided
            sentAt: new Date(msg.createdAt || msg.sentAt).getTime(), // Convert date to timestamp
            reactions: msg.reactions || [], // Default to empty array if no reactions
            authorUuid: msg.authorUuid, // Preserve author information
            attachments: msg.attachments || [], // Preserve attachments
          }));
          set({ messages }); // Update the store with the transformed messages
        } catch (error) {
          // console.error("Error loading messages:", error);
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
