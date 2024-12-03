import React, { useEffect, useState, useRef } from "react";
import { View, FlatList } from "react-native";
import useChatStore from "../store/useChatStore";
import ChatInput from "../components/ChatInput";
import MessageList from "../components/MessageList";
import ParticipantModal from "../components/ParticipantModal";
import { chatStyles } from "../styles/chatScreenStyles";
import { Participant } from "../types/chatTypes"; // Importamos el tipo de participante

const ChatScreen: React.FC = () => {
  const { messages, loadMessages } = useChatStore(); // Cargamos mensajes del store
  const [modalVisible, setModalVisible] = useState<boolean>(false); // Estado para el modal
  const [selectedParticipant, setSelectedParticipant] =
    useState<Participant | null>(null); // Participante seleccionado
  const flatListRef = useRef<FlatList>(null); // Referencia a FlatList

  // Efecto para cargar los mensajes al montar el componente
  useEffect(() => {
    loadMessages();
  }, []);

  // Maneja la apertura del modal de participante
  const handleOpenModal = (participant: Participant) => {
    setSelectedParticipant(participant);
    setModalVisible(true);
  };

  // Maneja el cierre del modal
  const handleCloseModal = () => {
    setModalVisible(false);
    setSelectedParticipant(null);
  };

  return (
    <View style={chatStyles.container}>
      {/* Lista de mensajes */}
      <MessageList
        messages={messages}
        flatListRef={flatListRef}
        onOpenParticipantModal={handleOpenModal}
      />
      {/* Barra de entrada de chat */}
      <ChatInput flatListRef={flatListRef} />
      {/* Modal del participante */}
      <ParticipantModal
        visible={modalVisible}
        participant={selectedParticipant}
        onClose={handleCloseModal}
      />
    </View>
  );
};

export default ChatScreen;
