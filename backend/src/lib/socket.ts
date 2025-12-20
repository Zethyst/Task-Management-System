import { Server } from "socket.io";

declare module "socket.io" {
  interface Socket {
    userId: string;
  }
}

let io: Server;

export const initSocket = (server: any) => {
  io = new Server(server, {
    cors: {
      origin: process.env.FRONTEND_URL,
      credentials: true,
    },
  });

  io.use((socket, next) => {
    const userId = socket.handshake.auth.userId;
    if (!userId) return next(new Error("Unauthorized"));
    socket.userId = userId;
    next();
  });

  io.on("connection", (socket) => {
    console.log("[+] User connected:", socket.userId);
    socket.join(socket.userId);

    socket.on("disconnect", () => {
      console.log("[-] User disconnected:", socket.userId);
    });
  });

  
  return io;
};

export { io };