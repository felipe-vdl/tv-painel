import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import formidable from "formidable";
import path from "path";
import fs from "fs/promises";
import { prisma } from "@/db";
import { authOptions } from "../auth/[...nextauth]";

export const config = {
  api: {
    bodyParser: false,
  },
};

const readFile = (req: NextApiRequest, saveLocally: boolean) => {
  const options: {
    maxFileSize?: number,
    uploadDir?: string;
    filename?: (name: any, ext: any, path: any, form: any) => string;
  } = {};
  if (saveLocally) {
    options.maxFileSize = 2000 * 1024 * 1024;
    options.uploadDir = path.join(process.cwd(), "/public/videos");
    options.filename = (name, ext, path, form) => {
      return `${Date.now().toString()}_${Math.floor(Math.random() * 10001)}_${
        path.originalFilename
      }`;
    };
  }

  const form = formidable(options);
  return new Promise<{
    fields: any;
    files: any;
  }>((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) reject(err);
      resolve({ fields, files });
    });
  });
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse & { socket: { server: any } }
) {
  const session = await getServerSession(req, res, authOptions);

  if (session) {
    try {
      await fs.readdir(path.join(process.cwd() + "/public", "/videos"));
    } catch (error) {
      await fs.mkdir(path.join(process.cwd() + "/public", "/videos"));
    }

    const data = await readFile(req, true);

    const updateVideo = await prisma.video.update({
      where: {
        id: 1,
      },
      data: {
        filename: data.files.video.newFilename,
      },
    });

    const videos = await fs.readdir(path.join(process.cwd() + "/public/videos"));
    videos.filter(video => video !== updateVideo.filename).forEach(async video => {
      await fs.unlink(path.join(process.cwd() + "/public/videos/", video));
    });
    
    res?.socket?.server?.io?.emit("new-video", updateVideo.filename);

    return res.status(200).json({ message: "Vídeo atualizado com sucesso!" });
  } else {
    return res.status(401).json({ message: "Usuário não está autenticado." });
  }
}
