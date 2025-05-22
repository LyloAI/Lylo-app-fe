import { useState, useEffect } from "react";
import io from "socket.io-client";

export const useSocket = (url, token = "") => {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    let obj = {};
    if (token) {
      obj = {
        transports: ["websocket"],
      };
      const socketIO = io(url, obj);
      setSocket(socketIO);
      return () => socketIO.disconnect();
    }
  }, [token]);

  return socket;
};
