import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { persist, PersistStorage } from 'zustand/middleware';
import { fetchAllMessages, sendMessage } from '../api/chatApi';

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

// Define the Message interface
interface Message {
  id: string;
  text: string;
  createdAt: string;
  edited?: boolean;
  reactions?: Record<string, number>;
}

// Define the ChatState interface
interface ChatState {
  messages: Message[];
  addMessage: (text: string) => Promise<void>; // Make addMessage async
  loadMessages: () => Promise<void>; // Make loadMessages async
  editMessage: (id: string, newText: string) => void; // For future editing
}

// Zustand store with persistence
const useChatStore = create<ChatState>()(
  persist(
    (set) => ({
      messages: [],

      // Add a new message by sending it to the API
      addMessage: async (text: string): Promise<void> => {
        try {
          const newMessage = await sendMessage(text); // Call API to send message
          set((state) => ({
            messages: [...state.messages, newMessage], // Add to state
          }));
        } catch (error) {
          console.error('Error adding message:', error);
        }
      },

      // Load all messages from the API
      loadMessages: async (): Promise<void> => {
        try {
          const messages = await fetchAllMessages(); // Call API to fetch messages
          set({ messages }); // Update state with fetched messages
        } catch (error) {
          console.error('Error loading messages:', error);
        }
      },

      // Edit an existing message (future functionality)
      editMessage: (id: string, newText: string): void => {
        set((state) => ({
          messages: state.messages.map((msg) =>
            msg.id === id ? { ...msg, text: newText, edited: true } : msg
          ),
        }));
      },
    }),
    {
      name: 'chat-storage',
      storage: asyncStorage, // Use custom asyncStorage wrapper
    }
  )
);

export default useChatStore;
