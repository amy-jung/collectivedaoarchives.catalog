import { PrismaClient } from "@prisma/client";
import express, { Request, Response } from "express";

const router = express.Router();
const prisma = new PrismaClient();

const PAGE_SIZE = 10;

router.get("/", async (req: Request, res: Response) => {
  const currentPage = Number(req.query.page) || 1;
  const q = String(req.query.q);
  let records: any[]; // Change this to your record type
  let totalCount: string = "0";

  try {
    const offset = (currentPage - 1) * PAGE_SIZE;

    records = await prisma.$queryRaw`
      SELECT ts_headline('english', CONCAT(title, content, organization, author), websearch_to_tsquery('english', ${q}), 'MaxFragments=2') as headline, id, title, content, organization, link, date, slug, "createdAt", "updatedAt", date, "categoryId", author FROM "Record"
      WHERE
        "textSearch" @@ websearch_to_tsquery('english', ${q})
      ORDER BY ts_rank("textSearch", websearch_to_tsquery('english', ${q})) DESC
      LIMIT ${PAGE_SIZE}
      OFFSET ${offset};
    ` as any;

    const queryCount = await prisma.$queryRaw`
      SELECT count(id) as count FROM "Record"
      WHERE
        "textSearch" @@ websearch_to_tsquery('english', ${q})
      ;
    ` as any;

    totalCount = queryCount[0].count.toString();

    // Convert date to a serializable format
    const serializedRecords = records.map(record => ({
      ...record,
      date: record.date.toISOString(),
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
