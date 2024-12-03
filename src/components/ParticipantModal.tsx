import React from "react";
import { Modal, View, Text, Image, Button } from "react-native";
import { chatStyles } from "../styles/chatScreenStyles";
import { Participant } from "../types/chatTypes"; // Importamos el tipo de participante

// Define las props del componente
type ParticipantModalProps = {
  visible: boolean; // Define si el modal está visible
  participant: Participant | null; // Participante seleccionado (o null si no hay)
  onClose: () => void; // Función para cerrar el modal
};

const ParticipantModal: React.FC<ParticipantModalProps> = ({
  visible,
  participant,
  onClose,
}) => {
  if (!participant) return null; // Si no hay participante, no renderizamos nada

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={chatStyles.modalContainer}>
        <View style={chatStyles.modalContent}>
          {/* Imagen del participante */}
          {participant.avatarUrl && (
            <Image
              source={{ uri: participant.avatarUrl }}
              style={chatStyles.modalAvatar}
            />
          )}

          {/* Nombre del participante */}
          <Text style={chatStyles.modalName}>{participant.name}</Text>

          {/* Bio del participante */}
          {participant.bio && (
            <Text style={chatStyles.modalBio}>{participant.bio}</Text>
          )}

          {/* Título del trabajo del participante */}
          {participant.jobTitle && (
            <Text style={chatStyles.modalJob}>{participant.jobTitle}</Text>
          )}

          {/* Email del participante */}
          {participant.email && (
            <Text style={chatStyles.modalEmail}>{participant.email}</Text>
          )}

          {/* Botón para cerrar el modal */}
          <Button title="Close" onPress={onClose} />
        </View>
      </View>
    </Modal>
  );
};

export default ParticipantModal;
