import { useState } from "react";
import { useRouter } from "next/router";
import type { GetServerSideProps, NextPage } from "next";
import { RecordTeaser } from "~~/components/RecordTeaser";

interface RecordsProps {
  // ToDo. Define types (swagger on backend?)
  records: any[];
  totalCount: number;
}

const PAGE_SIZE = 9;

const Search: NextPage<RecordsProps> = ({ records, totalCount }) => {
  const router = useRouter();
  const currentPage = Number(router.query.page) || 1;
  const [q, setQ] = useState<string>((router.query.q || "") as string);
  const [organization, setOrganization] = useState<string>((router.query.organization || "") as string);
  const [author, setAuthor] = useState<string>((router.query.author || "") as string);
  const [categoryId, setCategoryId] = useState<string>((router.query.categoryId || "") as string);
  const [sortBy, setSortBy] = useState<string>((router.query.sortBy || "") as string);

  const onSearch = () => {
    router.push(`/search?q=${q}`);
  };

  // Calculate the total number of pages
  const totalPages = Math.ceil(totalCount / PAGE_SIZE);

  const goToPage = (page: number) => {
    const queryParams = new URLSearchParams();

    if (q) queryParams.append("q", q);
    if (organization) queryParams.append("organization", organization);
    if (author) queryParams.append("author", author);
    if (categoryId) queryParams.append("categoryId", categoryId);
    if (sortBy) queryParams.append("sortBy", sortBy);

    queryParams.append("page", page.toString());
    router.push(`/search?${queryParams.toString()}`);
  };

  return (
    <div className="flex flex-col items-center p-8 md:px-24 pb-20 md:pb-44 w-full">
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
          placeholder={`Search...`}
        />
        <button className="btn btn-primary rounded-none" onClick={onSearch}>
          SEARCH
        </button>
      </div>

      <div className="container mx-auto w-[1350px] max-w-[100%]  mt-14">
        <div className="grid md:grid-cols-3 gap-8">
          {records?.map(record => (
            <RecordTeaser key={record.id} record={record} showHeadline={true} />
          ))}
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
  const q = context.query.q || "";
  const organization = context.query.organization || "";
  const author = context.query.author || "";
  const categoryId = context.query.categoryId || "";
  const sortBy = context.query.sortBy || "";
  // ToDo. Define types (swagger on backend?)
  let records: any[] = [];
  let totalCount: number = 0;

  try {
    const res = await fetch(
      `${process.env.BACKEND_URL}/api/search?q=${q}&page=${currentPage}&organization=${organization}&author=${author}&categoryId=${categoryId}&sortBy=${sortBy}`,
    );
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

export default Search;
