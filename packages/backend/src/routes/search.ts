import { Prisma, PrismaClient } from "@prisma/client";
import express, { Request, Response } from "express";

const router = express.Router();
const prisma = new PrismaClient();

const PAGE_SIZE = 9;

router.get("/", async (req: Request, res: Response) => {
  const currentPage = Number(req.query.page) || 1;
  let records: any[]; // Change this to your record type
  let totalCount: string = "0";

  let q = "";
  if (req.query.q !== undefined) {
    q = String(req.query.q);
  }

  let sortBy = "rank";
  if (req.query.sortBy !== undefined) {
    sortBy = String(req.query.sortBy);
  }

  const sortByToSql = {
    "date-desc": Prisma.sql`CASE WHEN date IS NULL THEN 1 ELSE 0 END, "date" DESC`,
    "date-asc": Prisma.sql`CASE WHEN date IS NULL THEN 1 ELSE 0 END, "date" ASC`,
    rank: Prisma.sql`ts_rank("textSearch", websearch_to_tsquery('english', ${q})) DESC`,
    "author-desc": Prisma.sql`CASE WHEN NULLIF(author, '') IS NULL THEN 1 ELSE 0 END, LOWER("author") DESC`,
    "author-asc": Prisma.sql`CASE WHEN NULLIF(author, '') IS NULL THEN 1 ELSE 0 END, LOWER("author") ASC`,
    "organization-desc": Prisma.sql`CASE WHEN NULLIF(organization, '') IS NULL THEN 1 ELSE 0 END, LOWER("organization") DESC`,
    "organization-asc": Prisma.sql`CASE WHEN NULLIF(organization, '') IS NULL THEN 1 ELSE 0 END, LOWER("organization") ASC`,
  };

  if (!Object.keys(sortByToSql).includes(sortBy)) {
    sortBy = "rank";
  }

  let sortSql = sortByToSql[sortBy as keyof typeof sortByToSql];

  let organization = "";
  if (req.query.organization !== undefined) {
    organization = String(req.query.organization).toLowerCase();
  }

  let author = "";
  if (req.query.author !== undefined) {
    author = String(req.query.author).toLowerCase();
  }

  let categoryId;
  if (req.query.categoryId !== undefined) {
    categoryId = Number(req.query.categoryId);
  }

  try {
    const offset = (currentPage - 1) * PAGE_SIZE;

    const searchConditions: Prisma.Sql[] = [];
    if (q) {
      searchConditions.push(Prisma.sql`"textSearch" @@ websearch_to_tsquery('english', ${q})`);
    }
    if (organization) {
      searchConditions.push(Prisma.sql`lower(organization) = ${organization}`);
    }
    if (author) {
      searchConditions.push(Prisma.sql`lower(author) = ${author}`);
    }
    if (categoryId) {
      searchConditions.push(Prisma.sql`"categoryId" = ${categoryId}`);
    }

    const where = searchConditions.length ? Prisma.sql`where ${Prisma.join(searchConditions, " and ")}` : Prisma.empty;

    records = (await prisma.$queryRaw`
      SELECT ts_headline('english', CONCAT(title, content, organization, author), websearch_to_tsquery('english', ${q}), 'MaxFragments=2') as headline, id, title, content, organization, link, date, slug, "createdAt", "updatedAt", date, "categoryId", author FROM "Record"
      ${where}
      ORDER BY ${sortSql}
      LIMIT ${PAGE_SIZE}
      OFFSET ${offset};
    `) as any;

    const queryCount = (await prisma.$queryRaw`
      SELECT count(id) as count FROM "Record"
      ${where}
      ;
    `) as any;

    totalCount = queryCount[0].count.toString();

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
