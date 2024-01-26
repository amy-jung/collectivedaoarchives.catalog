import { Prisma, PrismaClient } from "@prisma/client";
import express, { Request, Response } from "express";

const router = express.Router();
const prisma = new PrismaClient();

const PAGE_SIZE = 8;

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
    "title-desc": Prisma.sql`title DESC`,
    "title-asc": Prisma.sql`title ASC`,
  };

  if (!Object.keys(sortByToSql).includes(sortBy)) {
    sortBy = "rank";
  }

  let sortSql = sortByToSql[sortBy as keyof typeof sortByToSql];

  let organizations: string[] = [];
  if (req.query.organizations !== undefined && req.query.organizations !== "") {
    organizations = String(req.query.organizations)
      .split(",")
      .filter(org => org !== "")
      .map((org: string) => org.toLowerCase());
  }

  let author = "";
  if (req.query.author !== undefined) {
    author = String(req.query.author).toLowerCase();
  }

  let categoryIds: number[] = [];
  if (req.query.categoryIds !== undefined && req.query.categoryIds !== "") {
    categoryIds = String(req.query.categoryIds)
      .split(",")
      .map(id => Number(id))
      .filter(id => !isNaN(id));
  }

  let dateFrom;
  if (req.query.dateFrom !== undefined && req.query.dateFrom !== "") {
    dateFrom = new Date(req.query.dateFrom as string);
  }

  let dateTo;
  if (req.query.dateTo !== undefined && req.query.dateTo !== "") {
    dateTo = new Date(req.query.dateTo as string);
  }

  try {
    const offset = (currentPage - 1) * PAGE_SIZE;

    const searchConditions: Prisma.Sql[] = [];
    if (q) {
      searchConditions.push(Prisma.sql`"textSearch" @@ websearch_to_tsquery('english', ${q})`);
    }

    if (organizations.length > 0) {
      searchConditions.push(Prisma.sql`lower(organization) IN (${Prisma.join(organizations)})`);
    }

    if (author) {
      searchConditions.push(Prisma.sql`lower(author) = ${author}`);
    }

    if (categoryIds.length > 0) {
      searchConditions.push(Prisma.sql`"categoryId" IN (${Prisma.join(categoryIds)})`);
    }

    if (dateFrom) {
      searchConditions.push(Prisma.sql`date >= ${dateFrom}`);
    }

    if (dateTo) {
      searchConditions.push(Prisma.sql`date <= ${dateTo}`);
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
