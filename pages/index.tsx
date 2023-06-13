import Link from "next/link";
import type { GetStaticProps, NextPage } from "next";
import { CatalogRecord, getAllRecords } from "~~/utils/records";

type CatalogProps = {
  records: CatalogRecord[];
};

const Home: NextPage<CatalogProps> = ({ records }) => {
  return (
    <div className="flex min-h-screen flex-col items-center p-8 md:p-24">
      <h1 className="text-3xl font-bold text-center">Collective DAO Archive Catalog</h1>
      <p className="text-center">An open source index of DAO historical events.</p>
      <h2 className="font-bold text-3xl mt-8 my-4">Catalog</h2>
      <div className="flex flex-col gap-8">
        {records.map(record => (
          <div key={record.slug}>
            <h2 className="text-xl mb-2">
              <Link href={`/records/${record.slug}`}>
                <span className="font-bold link">{record.title}</span>
              </Link>
            </h2>
            <p>{record.summary}</p>
          </div>
        ))}
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
