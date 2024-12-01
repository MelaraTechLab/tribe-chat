const API_BASE = "http://dummy-chat-server.tribechat.pro/api";

export const fetchMessages = async () => {
  const response = await fetch(`${API_BASE}/messages/all`);
  if (!response.ok) throw new Error("Failed to fetch messages");
  return response.json();
};

export const sendMessage = async (text: string) => {
  const response = await fetch(`${API_BASE}/messages/new`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text }),
  });
  if (!response.ok) throw new Error("Failed to send message");
  return response.json();
};
