import create from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { persist } from 'zustand/middleware';

interface ChatState {
  messages: any[];
  addMessage: (message: any) => void;
}

const useChatStore = create<ChatState>()(
  persist(
    (set) => ({
      messages: [],
      addMessage: (message) =>
        set((state) => ({ messages: [...state.messages, message] })),
    }),
    { name: 'chat-storage', getStorage: () => AsyncStorage }
  )
);

export default useChatStore;
