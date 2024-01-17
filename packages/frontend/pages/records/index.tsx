import { useRouter } from "next/router";
import type { GetServerSideProps, NextPage } from "next";
import { RecordCta } from "~~/components/RecordCta";
import { RecordTeaser } from "~~/components/RecordTeaser";

interface RecordsProps {
  // ToDo. Define types (swagger on backend?)
  records: any[];
  totalCount: number;
}

const PAGE_SIZE = 8;

const RecordsIndex: NextPage<RecordsProps> = ({ records, totalCount }) => {
  const router = useRouter();
  const currentPage = Number(router.query.page) || 1;

  // Calculate the total number of pages
  const totalPages = Math.ceil(totalCount / PAGE_SIZE);

  // Calculate the start and end indexes of the current page
  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const endIndex = startIndex + PAGE_SIZE;

  const goToPage = (page: number) => {
    router.push(`/records?page=${page}`);
  };

  return (
    <div className="flex flex-col items-center pt-8 pb-20 md:pb-44">
      <div className="container mx-auto w-[1350px] max-w-[90%] mt-14">
        <div className="grid md:grid-cols-3 gap-8">
          {records?.map(record => (
            <RecordTeaser key={record.id} record={record} />
          ))}
          <RecordCta />
        </div>
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
  // ToDo. Define types (swagger on backend?)
  let records: any[] = [];
  let totalCount: number = 0;

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/records?page=${currentPage}`);
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

export default RecordsIndex;
