import { PrismaClient, Record } from "@prisma/client";
import { GetServerSideProps, NextPage } from "next";

interface RecordProps {
  // ToDo. Fix.
  record: Record & { date: string; category: { name: string } }; // To avoid date serialization issue
}

const RecordPage: NextPage<RecordProps> = ({ record }) => {
  return (
    <div className="mx-auto max-w-xl">
      <h1 className="font-bold text-3xl mb">{record.title}</h1>
      <span className="mb-8 block">posted on {record.date}</span>
      <p className="mb-2">{record.summary}</p>
      <ul className="mb-8">
        <li>
          <span className="font-bold">Protocol:</span> {record.organization}
        </li>
        <li>
          <span className="font-bold">Link:</span>{" "}
          <a href={record.link} target="_blank" className="link">
            Source
          </a>
        </li>
        <li>
          <span className="font-bold">Category:</span> {record.category.name}
        </li>
      </ul>
    </div>
  );
};

// ToDo. Slug instead of ID.
// ToDo. Instead of using Prisma directly, use a service layer.
// ToDo. Maybe use ISR?
export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  if (!params?.id || Array.isArray(params.id)) {
    return {
      notFound: true,
    };
  }

  const { id } = params;
  const prisma = new PrismaClient();
  let record: Record | null;

  try {
    record = await prisma.record.findUnique({
      where: { id: Number(id) },
      include: { category: true },
    });
  } catch (err) {
    console.log(err);
    return {
      notFound: true,
    };
  } finally {
    await prisma.$disconnect();
  }

  if (!record) {
    return {
      notFound: true,
    };
  }

  // ToDo. Use https://github.com/blitz-js/superjson#using-with-nextjs?
  // Convert date to a serializable format
  const serializedRecord = {
    ...record,
    date: record.date.toISOString(),
    createdAt: record.createdAt.toISOString(),
    updatedAt: record.updatedAt.toISOString(),
  };

  return {
    props: { record: serializedRecord },
  };
};

export default RecordPage;
