import { useEffect, useRef } from "react";

const useNotificationSocket = (username, onMessage) => {
  const socketRef = useRef(null);

  useEffect(() => {
    if (!username) return;

    const socket = new WebSocket(`wss://waqthecom.duckdns.org/ws/notifications/${username}/`);
    

    socket.onopen = () => {
      
    };

socket.onmessage = (event) => {
  try {
    const data = JSON.parse(event.data); // Convert string → object
   
    if (onMessage) onMessage(data.message);
  } catch (error) {
    console.error("Invalid message format:", event.data);
  }
};

    socket.onerror = (error) => {
      console.error("❌ WebSocket error:", error);
    };

    socket.onclose = (event) => {
      
    };

    socketRef.current = socket;

    return () => {
      socket.close();
    };
  }, [username]);

  return socketRef.current;
};

export default useNotificationSocket;
