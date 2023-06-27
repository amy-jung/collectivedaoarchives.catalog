import { PrismaClient } from "@prisma/client";

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
