import React from 'react';
import { View, Text, Button } from 'react-native';
import useChatStore from './src/store/useChatStore';

const App = () => {
  const { messages, addMessage } = useChatStore();

  const handleAddMessage = () => {
    const newMessage = {
      id: Date.now().toString(),
      text: 'Hello, Zustand!',
      createdAt: new Date().toISOString(),
    };
    addMessage(newMessage);
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Button title="Add Message" onPress={handleAddMessage} />
      {messages.map((msg) => (
        <Text key={msg.id}>{msg.text}</Text>
      ))}
    </View>
  );
};

export default App;
