import { io } from "socket.io-client";

let socket: ReturnType<typeof io> | null = null;

export const initSocket = (userId: string) => {
  if (socket) return socket;

  socket = io(import.meta.env.VITE_BACKEND_URL, {
    auth: {
      userId, // In production: send JWT token instead
    },
    withCredentials: true,
  });

  return socket;
};

export const getSocket = () => socket;