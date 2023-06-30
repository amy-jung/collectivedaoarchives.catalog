import Link from "next/link";
import { useRouter } from "next/router";
import { PrismaClient, Record } from "@prisma/client";
import type { GetServerSideProps, NextPage } from "next";

interface RecordsProps {
  records: Record[];
  totalCount: number;
}

const PAGE_SIZE = 10;

const Home: NextPage<RecordsProps> = ({ records, totalCount }) => {
  const router = useRouter();
  const currentPage = Number(router.query.page) || 1;

  console.log("records", records);

  // Calculate the total number of pages
  const totalPages = Math.ceil(totalCount / PAGE_SIZE);

  // Calculate the start and end indexes of the current page
  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const endIndex = startIndex + PAGE_SIZE;

  const goToPage = (page: number) => {
    router.push(`/?page=${page}`);
  };

  return (
    <div className="flex flex-col items-center p-8 md:px-24">
      <h1 className="text-4xl font-bold text-center">Collective DAO Archive Catalog</h1>
      <p className="text-center">An open source index of DAO historical events.</p>
      <h2 className="font-bold text-3xl mt-12 mb-6">
        Catalog <span>({totalCount})</span>
      </h2>
      <div className="flex flex-col gap-8 w-[600px]">
        {records?.map(record => (
          <div key={record.id}>
            <h2 className="text-xl mb-2">
              <Link href={`/records/${record.slug}`}>
                <span className="font-bold link">{record.title}</span>
              </Link>
            </h2>
            <p>
              <span className="italic">{record.organization}</span>
            </p>
          </div>
        ))}
      </div>
      <div className="flex justify-between items-center mt-8 gap-4">
        <button
          className={`btn btn-primary ${currentPage === 1 ? "cursor-not-allowed" : ""}`}
          onClick={() => {
            if (currentPage > 1) {
              goToPage(currentPage - 1);
            }
          }}
          disabled={currentPage === 1}
        >
          Previous
        </button>

        <p className="text-gray-700 flex flex-col gap-2">
          Page {currentPage} of {totalPages}
        </p>

        <button
          className={`btn btn-primary ${currentPage === totalPages ? "cursor-not-allowed" : ""}`}
          onClick={() => {
            if (currentPage < totalPages) {
              goToPage(currentPage + 1);
            }
          }}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async context => {
  const prisma = new PrismaClient();
  const currentPage = Number(context.query.page) || 1;
  let records: Record[];
  let totalCount: number;

  try {
    const offset = (currentPage - 1) * PAGE_SIZE;
    records = await prisma.record.findMany();
    [records, totalCount] = await Promise.all([
      prisma.record.findMany({ take: PAGE_SIZE, skip: offset }),
      prisma.record.count(),
    ]);
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
    props: { records: serializedRecords, totalCount },
  };
};

export default Home;
