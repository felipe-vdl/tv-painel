import { Server as ServerIO } from "socket.io";
import { Server as NetServer } from "http";
import { prisma } from "@/db";

export default function handler(req, res) {
  if (res.socket.server.io) {
    console.log("Socket already running");
  } else {
    const httpServer: NetServer = res.socket.server as any;
    const io = new ServerIO(httpServer, { path: "/api/video/socket" });
    res.socket.server.io = io;

    io.on("connection", (socket) => {
      console.log(`Connected with: ${socket.id}`);

      socket.on("changed-video", async () => {
        const video = await prisma.video.findFirst({ where: { id: 1 } });
        socket.emit("new-video", video.filename);
      });
    });
  }
  res.end();
}
