import Link from "next/link";
import { PrismaClient, Record } from "@prisma/client";
import type { GetServerSideProps, NextPage } from "next";

interface RecordsProps {
  records: Record[];
}

const Home: NextPage<RecordsProps> = ({ records }) => {
  return (
    <div className="flex flex-col items-center p-8 md:px-24">
      <h1 className="text-4xl font-bold text-center">Collective DAO Archive Catalog</h1>
      <p className="text-center">An open source index of DAO historical events.</p>
      <h2 className="font-bold text-3xl mt-12 mb-6">Catalog</h2>
      <div className="flex flex-col gap-8 w-[600px]">
        {records?.map(record => (
          <div key={record.id}>
            <h2 className="text-xl mb-2">
              <Link href={`/records/${record.slug}`}>
                <span className="font-bold link">{record.title}</span>
              </Link>
            </h2>
            <p>
              {record.summary} / <span className="italic">{record.organization}</span>
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async () => {
  const prisma = new PrismaClient();
  let records: Record[];

  try {
    records = await prisma.record.findMany();
  } catch (err) {
    console.log(err);
    records = [];
  } finally {
    await prisma.$disconnect();
  }

  // ToDo. Use https://github.com/blitz-js/superjson#using-with-nextjs?
  // Convert date to a serializable format
  const serializedRecords = records.map(record => ({
    ...record,
    date: record.date.toISOString(),
    createdAt: record.createdAt.toISOString(),
    updatedAt: record.updatedAt.toISOString(),
  }));

  return {
    props: { records: serializedRecords },
  };
};

export default Home;
