import { PrismaClient } from "@prisma/client";
import express, { Request, Response } from "express";

const router = express.Router();
const prisma = new PrismaClient();

router.get("/", async (req: Request, res: Response) => {
  let categories: any[];

  try {
    categories = await prisma.category.findMany({});

    return res.status(200).json(categories);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "An error occurred while fetching categories" });
  }
});

export default router;
