import { NextApiRequest, NextApiResponse } from "next";
import path from "path";
import fs from "fs/promises";
import { prisma } from "@/db";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const videoFile = req.query.slug as string;

  const videoCheck = await prisma.video.findFirst({
    where: { id: 1 },
  });

  if (videoCheck.filename === videoFile) {
    try {
      await fs.readdir(path.join(process.cwd() + '/public/videos'));
    } catch (error) {
      await fs.mkdir(path.join(process.cwd(), '/public'));
      await fs.mkdir(path.join(process.cwd() + '/public', '/videos'));
    }

    try {
      const video = await fs.readFile(path.join(process.cwd() + "/public/videos/" + videoCheck.filename));
      res.writeHead(200, {"Content-Type": "video/mp4"});
      res.end(video);
      
    } catch (error) {
      return res.status(404).json("O vídeo não foi encontrado no diretório.")
    }

  } else {
    return res.status(404).json("O vídeo não existe.");
  }

}