import { useState } from "react";
import Link from "next/link";
import type { GetStaticProps, NextPage } from "next";
import { CatalogRecord, getAllRecords } from "~~/utils/records";

type CatalogProps = {
  records: CatalogRecord[];
};

const Home: NextPage<CatalogProps> = ({ records }) => {
  const [search, setSearch] = useState("");

  const filteredRecords = records.filter(record => record.title.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="flex flex-col items-center p-8 md:px-24">
      <h1 className="text-4xl font-bold text-center">Collective DAO Archive Catalog</h1>
      <p className="text-center">An open source index of DAO historical events.</p>
      <h2 className="font-bold text-3xl mt-12">Catalog</h2>
      <input
        className="mt-4 mb-8 p-2 border border-gray-300"
        type="text"
        placeholder="Search records..."
        value={search}
        onChange={e => setSearch(e.target.value)}
      />
      <div className="flex flex-col gap-8 w-[600px]">
        {search.length >= 3 && filteredRecords.length === 0 ? (
          <p>No results found</p>
        ) : (
          filteredRecords.map(record => (
            <div key={record.slug}>
              <h2 className="text-xl mb-2">
                <Link href={`/records/${record.slug}`}>
                  <span className="font-bold link">{record.title}</span>
                </Link>
              </h2>
              <p>
                {record.summary} / <span className="italic">{record.protocol}</span>
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export const getStaticProps: GetStaticProps<CatalogProps> = async () => {
  const records = getAllRecords() || [];

  return {
    props: {
      records,
    },
  };
};

export default Home;
