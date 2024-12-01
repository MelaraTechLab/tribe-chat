import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { persist, PersistStorage } from 'zustand/middleware';

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

interface Message {
  id: string;
  text: string;
  createdAt: string;
  edited?: boolean;
  reactions?: Record<string, number>;
}

interface ChatState {
  messages: Message[];
  addMessage: (message: Message) => void;
  editMessage: (id: string, newText: string) => void;
}

const useChatStore = create<ChatState>()(
  persist(
    (set) => ({
      messages: [],
      addMessage: (message) =>
        set((state) => ({ messages: [...state.messages, message] })),
      editMessage: (id, newText) =>
        set((state) => ({
          messages: state.messages.map((msg) =>
            msg.id === id ? { ...msg, text: newText, edited: true } : msg
          ),
        })),
    }),
    {
      name: 'chat-storage',
      storage: asyncStorage,
    }
  )
);

export default useChatStore;
