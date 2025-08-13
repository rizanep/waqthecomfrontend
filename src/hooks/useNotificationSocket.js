import { useEffect, useRef } from "react";

const useNotificationSocket = (username, onMessage) => {
  const socketRef = useRef(null);

  useEffect(() => {
    if (!username) return;

    const socket = new WebSocket(`ws://localhost:8000/ws/notifications/${username}/`);

    socket.onopen = () => {
      console.log("✅ WebSocket connected");
    };

socket.onmessage = (event) => {
  try {
    const data = JSON.parse(event.data); // Convert string → object
    console.log("📩 New message:", data.message);
    if (onMessage) onMessage(data.message);
  } catch (error) {
    console.error("Invalid message format:", event.data);
  }
};

    socket.onerror = (error) => {
      console.error("❌ WebSocket error:", error);
    };

    socket.onclose = (event) => {
      console.warn("🔌 WebSocket closed:", event);
    };

    socketRef.current = socket;

    return () => {
      socket.close();
    };
  }, [username]);

  return socketRef.current;
};

export default useNotificationSocket;
