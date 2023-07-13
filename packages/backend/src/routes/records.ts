import express, { Request, Response } from "express";

const router = express.Router();

router.get("/", async (req: Request, res: Response) => {
  // Dummy records
  const records = [
    {
      id: 1,
      title: "Guiding Principles",
      summary: "",
      organization: "Index",
      link: "https://docs.indexcoop.com/our-guiding-principles",
      date: "2023-06-30T12:12:56.315Z",
      slug: "guiding-principles",
      createdAt: "2023-06-30T12:12:56.322Z",
      updatedAt: "2023-06-30T12:12:56.322Z",
      categoryId: 1,
    },
    {
      id: 2,
      title: "Principles for Operational Excellence",
      summary: "",
      organization: "Index",
      link: "https://gov.indexcoop.com/t/10-principles-for-operational-excellence-at-the-index-coop/4369",
      date: "2023-06-30T12:12:58.661Z",
      slug: "principles-for-operational-excellence",
      createdAt: "2023-06-30T12:12:58.664Z",
      updatedAt: "2023-06-30T12:12:58.664Z",
      categoryId: 1,
    },
    {
      id: 3,
      title: "Handbook",
      summary: "",
      organization: "Index",
      link: "https://docs.indexcoop.com/",
      date: "2023-06-30T12:13:01.576Z",
      slug: "handbook",
      createdAt: "2023-06-30T12:13:01.579Z",
      updatedAt: "2023-06-30T12:13:01.579Z",
      categoryId: null,
    },
  ];

  return res.status(200).json({ records: records, totalCount: records.length });
});

export default router;
