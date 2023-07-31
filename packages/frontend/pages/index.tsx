import Link from "next/link";
import { useRouter } from "next/router";
import type { GetServerSideProps, NextPage } from "next";

interface RecordsProps {
  // ToDo. Define types (swagger on backend?)
  records: any[];
  totalCount: number;
}

const PAGE_SIZE = 10;

const Home: NextPage<RecordsProps> = ({ records, totalCount }) => {
  return (
    <div className="">
      <div className="bg-secondary pb-32 pt-24">
        <div className="container mx-auto max-w-4xl">
          <h1 className="font-bold text-5xl mb-2">DAO COLLECTIVE CATALOG</h1>
          <p className="italic text-xl">An open source index of DAO historical events.</p>
          <div className="flex w-full mt-12">
            <input
              type="text"
              className="grow p-2 px-6 border-2 border-primary"
              placeholder={`(WIP :D) Search all ${totalCount} Records...`}
            />
            <button className="btn btn-primary rounded-none">SEARCH</button>
          </div>
        </div>
      </div>
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
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async context => {
  const currentPage = Number(context.query.page) || 1;
  // ToDo. Define types (swagger on backend?)
  let records: any[] = [];
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
