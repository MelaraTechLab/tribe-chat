const API_BASE = "http://dummy-chat-server.tribechat.pro/api";

// Helper function to perform API requests with error handling
const apiRequest = async (url: string, options?: RequestInit) => {
  try {
    const response = await fetch(url, options);
    if (!response.ok) {
      throw new Error(`API Error: ${response.status} - ${response.statusText}`);
    }
    return response.json();
  } catch (error) {
    console.error(`Request to ${url} failed:`, error);
    throw error;
  }
};

// Fetch all messages
export const fetchAllMessages = async () => {
  return apiRequest(`${API_BASE}/messages/all`);
};

// Fetch all participants
export const fetchParticipants = async () => {
  return apiRequest(`${API_BASE}/participants/all`);
};

// Fetch the latest messages (limit: 25)
export const fetchLatestMessages = async () => {
  return apiRequest(`${API_BASE}/messages/latest`);
};

// Send a new message
export const sendMessage = async (text: string) => {
  return apiRequest(`${API_BASE}/messages/new`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text }),
  });
};

// Add a reaction to a specific message
export const addReaction = async (messageUuid: string, reaction: string) => {
  return apiRequest(`${API_BASE}/messages/${messageUuid}/reactions`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ reaction }),
  });
};

// Fetch older messages relative to a specific message
export const fetchOlderMessages = async (refMessageUuid: string) => {
  return apiRequest(`${API_BASE}/messages/older/${refMessageUuid}`);
};

// Fetch messages updated after a specific timestamp
export const fetchUpdatedMessages = async (sinceTimestamp: number) => {
  return apiRequest(`${API_BASE}/messages/updates/${sinceTimestamp}`);
};

// Fetch participants updated after a specific timestamp
export const fetchUpdatedParticipants = async (sinceTimestamp: number) => {
  return apiRequest(`${API_BASE}/participants/updates/${sinceTimestamp}`);
};

// Fetch session information (session UUID and API version)
export const fetchSessionInfo = async () => {
  return apiRequest(`${API_BASE}/info`);
};
