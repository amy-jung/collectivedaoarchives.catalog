import { PrismaClient } from "@prisma/client";
<<<<<<< HEAD

const prisma = new PrismaClient();

// Seed Example
async function main() {
  await prisma.subCategory.upsert({
    where: { id: 1 },
    update: {},
    create: {
      name: "Onboarding",
    },
  });

  await prisma.subCategory.upsert({
    where: { id: 2 },
    update: {},
    create: {
      name: "Grant",
    },
  });

  await prisma.category.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      name: "Organizational",
    },
  });

  await prisma.record.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      title: "Guiding Principles",
      slug: "guiding-principles",
      date: new Date("2023-06-09"),
      organization: "index",
      link: "https://docs.indexcoop.com/index-coop-community-handbook/our-guiding-principles",
      summary: "This is the summary text for the Index Coop Guiding Principles.",
      categoryId: 1,
      subcategories: {
        create: [{ subCategoryId: 1 }, { subCategoryId: 2 }],
      },
    },
  });

  await prisma.record.upsert({
    where: { id: 2 },
    update: {},
    create: {
      id: 2,
      title: "Principles for Operational Excellence",
      slug: "principles-for-operational-excellence",
      date: new Date("2023-06-10"),
      organization: "index",
      link: "https://gov.indexcoop.com/t/10-principles-for-operational-excellence-at-the-index-coop/4369",
      summary: "10 Principles for Operational Excellence at the Index Coop\n" + "category: Organizational",
      categoryId: 1,
      subcategories: {
        create: [{ subCategoryId: 1 }],
      },
    },
  });

  await prisma.record.upsert({
    where: { id: 3 },
    update: {},
    create: {
      id: 3,
      title: "Conflict Resolution Process",
      slug: "conflict-resolution-process",
      date: new Date("2023-06-11"),
      organization: "index",
      link: "https://gov.indexcoop.com/t/conflict-management-framework-and-tools/3751",
      summary: "Conflict Management - Framework and Tools",
      categoryId: 1,
      subcategories: {
        create: [{ subCategoryId: 2 }],
      },
    },
  });
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async e => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
=======
import csv from "csv-parser";
import fs from "fs";
import path from "path";

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
>>>>>>> database
