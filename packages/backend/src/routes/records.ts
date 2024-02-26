import { PrismaClient } from "@prisma/client";
import express, { Request, Response } from "express";

const router = express.Router();
const prisma = new PrismaClient();

const PAGE_SIZE = 8;

router.get("/", async (req: Request, res: Response) => {
  const currentPage = Number(req.query.page) || 1;
  let records: any[]; // Change this to your record type
  let totalCount: number = 0;

  try {
    const offset = (currentPage - 1) * PAGE_SIZE;
    [records, totalCount] = await Promise.all([
      prisma.record.findMany({ take: PAGE_SIZE, skip: offset, orderBy: [{ date: "desc" }], where: { date: { not: null } } }),
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

router.get("/:slug", async (req: Request, res: Response) => {
  const { slug } = req.params;

  try {
    const record = await prisma.record.findUnique({
      where: { slug },
      include: {
        category: true,
      },
    });

    if (!record) {
      return res.status(404).json({ error: "Record not found" });
    }

    // Convert date to a serializable format
    const serializedRecord = {
      ...record,
      date: record?.date?.toISOString(),
      createdAt: record.createdAt.toISOString(),
      updatedAt: record.updatedAt.toISOString(),
    };

    return res.status(200).json(serializedRecord);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "An error occurred while fetching the record" });
  }
});

export default router;
