import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import type { GetServerSideProps, NextPage } from "next";
import { RecordCta } from "~~/components/RecordCta";
import { RecordTeaser } from "~~/components/RecordTeaser";

interface RecordsProps {
  // ToDo. Define types (swagger on backend?)
  records: any[];
  totalCount: number;
}

const Home: NextPage<RecordsProps> = ({ records, totalCount }) => {
  const [q, setQ] = useState<string>("");
  const [isSearchLoading, setIsSearchLoading] = useState(false);
  const { push } = useRouter();

  const onSearch = () => {
    setIsSearchLoading(true);
    push(`/search?q=${q}`);
  };

  return (
    <div className="pb-20 md:pb-44">
      <div className="bg-accent pb-32 pt-24 w-full">
        <div className="container mx-auto w-[896px] max-w-[90%]">
          <h1 className="font-bold text-xl sm:text-6xl sm:leading-none">COLLECTIVE DAO CATALOG</h1>
          <p className="italic text-lg sm:text-2xl">An open source index of DAO historical events.</p>
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
              className="grow p-2 px-6 border-2 border-primary outline-0"
              placeholder={`Search all ${totalCount} Records...`}
            />
            <button
              className="btn btn-primary rounded-none w-full h-auto min-h-[2.5rem] sm:min-h-[3rem] sm:w-[100px]"
              onClick={onSearch}
            >
              {!isSearchLoading ? "SEARCH" : <span className="loading loading-spinner"></span>}
            </button>
          </div>
        </div>
      </div>
      <div className="container mx-auto w-[1350px] max-w-[90%] mt-14">
        <div className="mb-12">
          <Link href="/records" className="font-bold text-2xl link-hover">
            See All Records {">"}
          </Link>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {records?.map(record => (
            <RecordTeaser key={record.id} record={record} />
          ))}
          <RecordCta />
        </div>
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

export default Home;
