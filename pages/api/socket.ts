import { NextApiRequest } from "next";
import { Server as ServerIO } from "socket.io";
import { Server as NetServer } from "http";
import { NextApiResponseServerIO } from "@/types/next";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponseServerIO
) {
  if (!res.socket.server.io) {
    console.log("New socket server...");
    const httpServer: NetServer = res.socket.server as any;
    const io = new ServerIO(httpServer);
    res.socket.server.io = io;

    io.on("connection", (socket) => {
      console.log(`Connected with: ${socket.id}`);
    });
  }
  res.end();
}
