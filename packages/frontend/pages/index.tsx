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
  const currentPage = Number(context.query.page) || 1;
  let records: Record[] = []; // Change this to your record type
  let totalCount: number = 0;

  try {
    const res = await fetch(`${process.env.BACKEND_URL}/api/records?page=${currentPage}`);
    if (!res.ok) {
      throw new Error(res.statusText);
    }

    const data = await res.json();
    records = data.records;
    totalCount = data.totalCount;
  } catch (err) {
    console.log(err);
  }

  return {
    props: { records, totalCount },
  };
};

export default Home;
