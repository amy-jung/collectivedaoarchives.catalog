import { PrismaClient } from "@prisma/client";
import csv from "csv-parser";
import * as fs from "fs";
import * as path from "path";

const prisma = new PrismaClient();

type CsvRecord = {
  origin: string;
  title: string;
  link: string;
  date: string;
  content: string;
  organization: string;
  author: string;
  category: string;
};

const generateSlug = (title: string): string => {
  return title
    .normalize('NFKD') // split accented characters into their base characters and diacritical marks
    .replace(/[\u0300-\u036f]/g, '') // remove all the accents, which happen to be all in the \u03xx UNICODE block.
    .trim() // trim leading or trailing whitespace
    .toLowerCase() // convert to lowercase
    .replace(/[^a-z0-9 -]/g, '') // remove non-alphanumeric characters
    .replace(/\s+/g, '-') // replace spaces with hyphens
    .replace(/-+/g, '-'); // remove consecutive hyphens
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
      // Dedupe and create categories first
      const categories = [
        ...new Set(
          records.filter(record => record.category && record.category.trim() !== "").map(record => record.category),
        ),
      ];

      // Saving mapping on memory to save some queries
      const categoryMap: { [key: string]: number } = {};

      console.log("Creating categories");
      for (const categoryName of categories) {
        const category = await prisma.category.upsert({
          where: { name: categoryName },
          update: {},
          create: { name: categoryName },
        });

        categoryMap[category.name] = category.id;
      }

      // Then create records
      console.log("Creating Records");
      for (const record of records) {
        console.log("Creating Record", record.title);

        let slugAuto = generateSlug(record.title);
        let count = 1;
        while (await prisma.record.findFirst({ where: { slug: slugAuto } })) {
          slugAuto = `${generateSlug(record.title)}-${count}`;
          count++;
        }

        let recordData = {
          title: record.title,
          slug: slugAuto,
          date: record.date ? new Date(record.date) : null,
          organization: record.organization,
          link: record.link,
          content: record.content,
          author: record.author,
        } as {
          title: string;
          slug: string;
          date: Date;
          organization: string;
          link: string;
          categoryId?: number;
          content: string;
          author: string;
        };

        if (categoryMap[record.category]) {
          recordData.categoryId = categoryMap[record.category];
        }

        await prisma.record.create({
          data: recordData,
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
