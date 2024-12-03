import React from "react";
import { SafeAreaView } from "react-native";
import ChatScreen from "./src/screens/ChatScreen";

const App: React.FC = () => {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ChatScreen />
    </SafeAreaView>
  );
};

export default App;
