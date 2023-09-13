import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import type { GetServerSideProps, NextPage } from "next";

interface RecordsProps {
  // ToDo. Define types (swagger on backend?)
  records: any[];
  totalCount: number;
}

const Home: NextPage<RecordsProps> = ({ records, totalCount }) => {
  const [q, setQ] = useState<string>("");
  const { push } = useRouter();

  const onSearch = () => {
    push(`/search?q=${q}`);
  };

  return (
    <>
      <div className="bg-secondary pb-32 pt-24">
        <div className="container mx-auto w-[896px] max-w-[90%]">
          <h1 className="font-bold text-xl sm:text-5xl mb-2">DAO COLLECTIVE CATALOG</h1>
          <p className="italic text-lg sm:text-xl">An open source index of DAO historical events.</p>
          <div className="flex flex-col sm:flex-row w-full mt-12">
            <input
              type="text"
              value={q}
              onChange={value => setQ(value.target.value)}
              onKeyDown={event => {
                if (event.key === "Enter") {
                  onSearch();
                }
              }}
              className="grow p-2 px-6 border-2 border-primary"
              placeholder={`Search all ${totalCount} Records...`}
            />
            <button
              className="btn btn-primary rounded-none"
              onClick={onSearch}
            >SEARCH</button>
          </div>
        </div>
      </div>
      <div className="container mx-auto w-[1150px] max-w-[90%] mt-14">
        <div className="grid md:grid-cols-3 gap-8">
          {records?.slice(0, 6).map(record => (
            <div key={record.id} className="border-t-base-200 border-t-[10px] py-6">
              <h2 className="text-xl mb-2">
                <Link href={`/records/${record.slug}`}>
                  <span className="font-bold">{record.title}</span>
                </Link>
              </h2>
              <p>
                <span className="italic">{record.organization}</span>
              </p>
            </div>
          ))}
        </div>
      </div>
    </>
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
