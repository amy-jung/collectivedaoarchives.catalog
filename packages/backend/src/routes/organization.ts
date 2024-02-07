import { PrismaClient } from "@prisma/client";
import express, { Request, Response } from "express";

const router = express.Router();
const prisma = new PrismaClient();

router.get("/", async (req: Request, res: Response) => {
  let organizations: any[];

  try {
    organizations = await prisma.record.findMany({ select: { organization: true }, distinct: ["organization"] });

    return res.status(200).json(organizations.map(org => org.organization));
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "An error occurred while fetching organizations" });
  }
});

export default router;
