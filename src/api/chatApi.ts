const API_BASE = "http://dummy-chat-server.tribechat.pro/api";

export const fetchAllMessages = async () => {
  const response = await fetch(`${API_BASE}/messages/all`);
  if (!response.ok) {
    throw new Error("Failed to fetch messages");
  }
  return response.json();
};

export const fetchParticipants = async () => {
  try {
    const response = await fetch(`${API_BASE}/participants/all`);
    if (!response.ok) {
      throw new Error('Failed to fetch participants');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching participants:', error);
    throw error;
  }
};

export const fetchLatestMessages = async () => {
  const response = await fetch(`${API_BASE}/messages/latest`);
  if (!response.ok) {
    throw new Error("Failed to fetch latest messages");
  }
  return response.json();
};

export const sendMessage = async (text: string) => {
  const response = await fetch(`${API_BASE}/messages/new`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text }),
  });
  if (!response.ok) {
    throw new Error("Failed to send message");
  }
  return response.json();
};

// Function to add a reaction to a message
export const addReaction = async (messageUuid: string, reaction: string) => {
  const response = await fetch(`${API_BASE}/messages/${messageUuid}/reactions`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ reaction }),
  });

  if (!response.ok) {
    throw new Error("Failed to add reaction");
  }

  return response.json(); // Return the updated message
};
