import { PrismaClient } from "@prisma/client";
import express, { Request, Response } from "express";

const router = express.Router();
const prisma = new PrismaClient();

const PAGE_SIZE = 8;

router.get("/", async (req: Request, res: Response) => {
  let records: any[]; // Change this to your record type
  let totalCount: number = 0;

  try {
    [records, totalCount] = await Promise.all([
      prisma.record.findMany({ take: PAGE_SIZE, orderBy: [{ date: "desc" }], where: { date: { not: null } } }),
      prisma.record.count(),
    ]);

    // Convert date to a serializable format
    const serializedRecords = records.map(record => ({
      ...record,
      date: record.date?.toISOString(),
      createdAt: record.createdAt.toISOString(),
      updatedAt: record.updatedAt.toISOString(),
    }));

    return res.status(200).json({ records: serializedRecords, totalCount });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "An error occurred while fetching records" });
  }
});

export default router;
