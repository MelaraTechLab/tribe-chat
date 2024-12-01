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

// Interface for a message object
interface Message {
  uuid: string; // Unique identifier for each message
  text: string; // Content of the message
  sentAt: number; // Timestamp of when the message was sent
  edited?: boolean; // Optional: Indicates if the message was edited
  reactions?: Record<string, number>; // Optional: Reactions to the message (e.g., like count)
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
            uuid: newMessageFromApi.id, // Map `id` to `uuid`
            text: newMessageFromApi.text,
            sentAt: new Date(newMessageFromApi.createdAt).getTime(), // Convert date to timestamp
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
          }));

          set({ messages }); // Update the store with the transformed messages
        } catch (error) {
          console.error("Error loading messages:", error);
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
