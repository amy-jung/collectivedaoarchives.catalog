import { PrismaClient } from "@prisma/client";
import * as csv from "csv-parser";
import * as fs from "fs";
import * as path from "path";

const prisma = new PrismaClient();

type CsvRecord = {
  id: number;
  title: string;
  protocol: string;
  link: string;
  category: string;
  // ToDo. This will be multiple
  subcategories: string;
  // ToDo. Missing fields (date, etc)
};

const generateSlug = (title: string): string => {
  return title.toLowerCase().replace(/ /g, "-");
};

async function main() {
  if (!fs.existsSync(path.join(__dirname, "records.csv"))) {
    console.error("\nrecords.csv not found, skipping migration");
    return;
  }

  const records: CsvRecord[] = [];
  fs.createReadStream(path.join(__dirname, "records.csv"))
    .pipe(csv())
    .on("data", data => records.push(data))
    .on("end", async () => {
      console.log("records.csv parsed, seeding database with", records.length, "records");
      // Dedupe and create categories and subcategories first (and remove empty subcategories)
      const categories = [
        ...new Set(records.filter(record => record.category.trim() !== "").map(record => record.category)),
      ];
      const subcategories = [
        ...new Set(records.filter(record => record.subcategories.trim() !== "").map(record => record.subcategories)),
      ];

      // Saving mapping on memory to save some queries
      const categoryMap: { [key: string]: number } = {};
      const subcategoryMap: { [key: string]: number } = {};

      console.log("Creating categories");
      for (const categoryName of categories) {
        const category = await prisma.category.upsert({
          where: { name: categoryName },
          update: {},
          create: { name: categoryName },
        });

        categoryMap[category.name] = category.id;
      }

      console.log("Creating subcategories");
      for (const subcategoryName of subcategories) {
        const subcategory = await prisma.subCategory.upsert({
          where: { name: subcategoryName },
          update: {},
          create: { name: subcategoryName },
        });

        subcategoryMap[subcategory.name] = subcategory.id;
      }

      // Then create records
      console.log("Creating Records");
      for (const record of records) {
        console.log("Creating Record", record.title);

        // Generate slug and ensure it's unique
        let slugAuto = generateSlug(record.title);
        let count = 1;
        while (await prisma.record.findFirst({ where: { slug: slugAuto } })) {
          slugAuto = `${generateSlug(record.title)}-${count}`;
          count++;
        }

        let recordData = {
          id: Number(record.id),
          title: record.title,
          slug: slugAuto,
          date: new Date(),
          organization: record.protocol,
          link: record.link,
          summary: "",
        } as {
          id: number;
          title: string;
          slug: string;
          date: Date;
          organization: string;
          link: string;
          categoryId?: number;
          summary: string;
          subcategories?: { create: { subCategoryId: number }[] };
        };

        if (categoryMap[record.category]) {
          recordData.categoryId = categoryMap[record.category];
        }

        if (subcategoryMap[record.subcategories]) {
          recordData.subcategories = {
            create: [{ subCategoryId: subcategoryMap[record.subcategories] }],
          };
        }

        await prisma.record.upsert({
          where: { id: Number(record.id) },
          update: {},
          create: recordData,
        });
      }

      await prisma.$disconnect();
    });
}

main().catch(async e => {
  console.error(e);
  await prisma.$disconnect();
  process.exit(1);
});
