import React, { useEffect } from "react";
import { View, Text, FlatList, Button } from "react-native";
import useChatStore from "./src/store/useChatStore";

const App = () => {
  const { messages, loadMessages, addMessage } = useChatStore();

  useEffect(() => {
    loadMessages(); // Load when start
  }, []);

  const handleAddMessage = () => {
    addMessage("Nuevo mensaje desde la app");
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <FlatList
        data={messages}
        renderItem={({ item }) => (
          <Text style={{ padding: 5, borderBottomWidth: 1 }}>{item.text}</Text>
        )}
        keyExtractor={(item) => item.id}
        style={{ width: "100%" }}
      />
      <Button title="Add Message" onPress={handleAddMessage} />
    </View>
  );
};

export default App;
