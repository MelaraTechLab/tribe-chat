import React, { useState } from "react";
import { View, TextInput, Button, StyleSheet } from "react-native";
import useChatStore from "../store/useChatStore";
import { chatStyles } from "../styles/chatScreenStyles"; // Importa los estilos globales
import { FlatList } from "react-native"; // Importa FlatList para el tipo de referencia

type ChatInputProps = {
  flatListRef: React.RefObject<FlatList>; // Tipo correcto para la referencia de FlatList
};

const ChatInput: React.FC<ChatInputProps> = ({ flatListRef }) => {
  const [inputText, setInputText] = useState<string>(""); // Estado local para el texto de entrada
  const addMessage = useChatStore((state) => state.addMessage); // Función para agregar mensajes

  // Maneja el envío del mensaje
  const handleSendMessage = () => {
    if (inputText.trim()) {
      addMessage(inputText); // Agrega el mensaje al estado global
      setInputText(""); // Limpia el campo de entrada

      // Desplázate al último mensaje
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  };

  return (
    <View style={[chatStyles.inputContainer, styles.inputContainer]}>
      <TextInput
        style={[chatStyles.input, styles.input]}
        placeholder="Type a message..."
        value={inputText}
        onChangeText={setInputText}
      />
      <Button title="Send" onPress={handleSendMessage} />
    </View>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    backgroundColor: "#f9f9f9", // Fondo claro para mayor visibilidad
    borderRadius: 10, // Bordes redondeados
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  input: {
    fontSize: 16, // Asegura que el texto sea legible
    color: "#333", // Color de texto
  },
});

export default ChatInput;
