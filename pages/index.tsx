import { useState, useEffect } from "react";
import { GetServerSideProps } from "next";
import { prisma } from "@/db";
import { io, Socket } from "socket.io-client";
let socket: Socket;

const VideoPage = ({ filename }: { filename: string }) => {
  const [current, setCurrent] = useState(filename);

  const socketInitializer = async () => {
    await fetch("/api/video/socket");
    socket = io();

    socket.on("connect", () => {
      console.log("Connected");
    });

    socket.on("new-video", (filename: string) => {
      console.log("NEW VIDEO", filename);
      setCurrent(filename);
    });
  };

  useEffect(() => {
    socketInitializer();
  }, []);

  useEffect(() => {
    const vidPlayer = document.querySelector("video") as HTMLVideoElement;
    vidPlayer.load();
    vidPlayer.play();
  }, [current]);

  return (
    <div className="h-screen w-full overflow-hidden">
      <video autoPlay muted loop className="cover h-full w-full object-cover">
        <source src={`/videos/${current}`} />
      </video>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps<{
  filename: string;
}> = async (context) => {
  const videos = await prisma.video.findMany();
  const video = videos[0];

  return {
    props: {
      filename: video.filename,
    },
  };
};

VideoPage.layout = "none";
export default VideoPage;
