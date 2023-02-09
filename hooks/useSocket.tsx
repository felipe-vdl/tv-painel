import { io, Socket } from "socket.io-client";
import { useState, useEffect } from "react";

export default function useSocket (url: string) {
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    let socketIo: Socket;

    const getSocket = async () => {
      fetch(url);
      socketIo = io();
      setSocket(socketIo);
    }

    getSocket();

    return () => {
      socketIo?.disconnect();
    };
  }, []);

  return socket;
};