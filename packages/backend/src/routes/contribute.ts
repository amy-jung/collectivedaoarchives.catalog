import { Prisma, PrismaClient } from "@prisma/client";
import express, { Request, Response } from "express";

const router = express.Router();
const prisma = new PrismaClient();

type ReqBody = {
  urls: string[];
};

type ResultUrl = {
  url: string;
  success: boolean;
  error?: string;
};

router.post("/", async (req: Request, res: Response) => {
  const { urls }: ReqBody = req.body;

  if (!urls) {
    return res.status(400).json({ error: "Missing required parameter: urls" });
  }

  if (!Array.isArray(urls)) {
    return res.status(400).json({ error: "Invalid parameter: urls" });
  }

  const result: ResultUrl[] = [];

  for (const url of urls) {
    try {
      new URL(url);

      const urlData = {
        url
      } as {
        url: string;
      }

      await prisma.submit.create({
        data: urlData,
      });

      result.push({ url, success: true });
    } catch (err) {
      console.log(err);
      let error = "An error occurred while submiting link";
      if (err instanceof TypeError) {
        error = "Invalid url";
      }
      if (err instanceof Prisma.PrismaClientKnownRequestError) {
        if (err.code === 'P2002') {
          error = "Link already submitted";
        }
      }
      result.push({ url, success: false, error });
    }
  }

  return res.status(200).json({ result });
});

export default router;
