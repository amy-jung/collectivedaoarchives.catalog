import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import type { GetServerSideProps, NextPage } from "next";
import Datepicker from "react-tailwindcss-datepicker";
import Select from "react-tailwindcss-select";
import { EmptyResults } from "~~/components/EmptyResults";
import { RecordCta } from "~~/components/RecordCta";
import { RecordTeaser } from "~~/components/RecordTeaser";

interface RecordsProps {
  // ToDo. Define types (swagger on backend?)
  records: any[];
  totalCount: number;
  categories: any[];
  organizationsData: any[];
  sortByOptions: any[];
}

const PAGE_SIZE = 8;

const Search: NextPage<RecordsProps> = ({ records, totalCount, categories, organizationsData, sortByOptions }) => {
  const router = useRouter();
  const currentPage = Number(router.query.page) || 1;

  const [q, setQ] = useState<string>((router.query.q || "") as string);
  const [organizations, setOrganizations] = useState<string>((router.query.organizations || "") as string);
  const [author, setAuthor] = useState<string>((router.query.author || "") as string);
  const [categoryIds, setCategoryIds] = useState<string>((router.query.categoryIds || "") as string);
  const [dateFrom, setDateFrom] = useState<string>((router.query.dateFrom || "") as string);
  const [dateTo, setDateTo] = useState<string>((router.query.dateTo || "") as string);
  const [sortBy, setSortBy] = useState<string>((router.query.sortBy || "") as string);
  const [isSearchLoading, setIsSearchLoading] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<any[]>([]);
  const [selectedOrganizations, setSelectedOrganizations] = useState<any[]>([]);

  const emptyResults = Number(totalCount) === 0;

  useEffect(() => {
    const filteredCategories = categories
      .filter(category => categoryIds.split(",").includes(category.id.toString()))
      .map(category => {
        return { value: category.id, label: category.name };
      });
    setSelectedCategories(filteredCategories);
  }, [categoryIds]);

  const handleChangeCategories = (value: any) => {
    if (!value) {
      setCategoryIds("");
      return;
    }
    setCategoryIds(value.map((category: any) => category.value).join(","));
  };

  useEffect(() => {
    const filteredOrganizations = organizationsData
      .filter(organization => organizations.split(",").includes(organization))
      .map(organization => {
        return { value: organization, label: organization };
      });
    setSelectedOrganizations(filteredOrganizations);
  }, [organizations]);

  const handleChangeOrganizations = (value: any) => {
    setSelectedOrganizations(value);
    if (!value) {
      setOrganizations("");
      return;
    }
    setOrganizations(value.map((org: any) => org.value).join(","));
  };

  const handleChangeDates = (value: any) => {
    setDateFrom(value.startDate);
    setDateTo(value.endDate);
  };

  const handleChangeSortBy = (value: any) => {
    setSortBy(value.target.value);
  };

  const onSearch = async () => {
    setIsSearchLoading(true);
    let url = `/search?q=${q}`;
    if (categoryIds) {
      url += `&categoryIds=${categoryIds}`;
    }
    if (organizations) {
      url += `&organizations=${organizations}`;
    }
    if (dateFrom) {
      url += `&dateFrom=${dateFrom}`;
    }
    if (dateTo) {
      url += `&dateTo=${dateTo}`;
    }
    if (sortBy) {
      url += `&sortBy=${sortBy}`;
    }
    await router.push(url);
    setIsSearchLoading(false);
  };

  // Calculate the total number of pages
  const totalPages = Math.ceil(totalCount / PAGE_SIZE);

  const goToPage = (page: number) => {
    const queryParams = new URLSearchParams();

    if (q) queryParams.append("q", q);
    if (organizations) queryParams.append("organizations", organizations);
    if (author) queryParams.append("author", author);
    if (categoryIds) queryParams.append("categoryIds", categoryIds);
    if (dateFrom) queryParams.append("dateFrom", dateFrom);
    if (dateTo) queryParams.append("dateTo", dateTo);
    if (sortBy) queryParams.append("sortBy", sortBy);
    queryParams.append("page", page.toString());

    router.push(`/search?${queryParams.toString()}`);
  };

  const SearchForm = (
    <div className="flex flex-col items-center p-8 md:px-24 pb-20 w-full bg-accent">
      <div className="flex flex-col sm:flex-row w-full max-w-[1350px] mt-12">
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
          placeholder={`Search...`}
        />
        <button
          className="btn btn-primary rounded-none w-full h-auto min-h-[2.5rem] sm:min-h-[3rem] sm:w-[100px]"
          onClick={onSearch}
        >
          {!isSearchLoading ? "SEARCH" : <span className="loading loading-spinner"></span>}
        </button>
      </div>
      <div className="flex flex-col xl:flex-row w-full max-w-[1350px] mt-12 justify-between gap-2">
        <div className="flex flex-col md:flex-row">
          <div className="flex flex-col sm:flex-row grow xl:min-w-[250px] cursor-pointer border-2 border-black bg-primary">
            <Select
              value={selectedCategories?.length > 0 ? selectedCategories : null}
              placeholder="Categories"
              primaryColor="#1E1E1E"
              isMultiple={true}
              classNames={{
                menu: "absolute z-10 w-full bg-white shadow-lg border rounded py-1 mt-1.5 text-sm text-gray-700 bg-[#EEEEEE]",
                menuButton: () => "flex bg-primary text-white py-1",
                listItem: () =>
                  "block transition duration-200 px-2 py-2 cursor-pointer select-none truncate rounded text-gray-500 hover:bg-base-100",
                tagItemIcon: "w-3 h-3 mt-0.5 fill-primary",
              }}
              onChange={handleChangeCategories}
              options={categories.map(category => {
                return { value: category.id, label: category.name };
              })}
            />
          </div>
          <div className="flex flex-col sm:flex-row grow xl:min-w-[250px] cursor-pointer border-2 border-black bg-primary">
            <Select
              value={selectedOrganizations?.length > 0 ? selectedOrganizations : null}
              placeholder="Organizations"
              isMultiple={true}
              classNames={{
                menu: "absolute z-10 w-full bg-white shadow-lg border rounded py-1 mt-1.5 text-sm text-gray-700 bg-[#EEEEEE]",
                menuButton: () => "flex bg-primary text-white py-1",
                listItem: () =>
                  "block transition duration-200 px-2 py-2 cursor-pointer select-none truncate rounded text-gray-500 hover:bg-base-100",
                tagItemIcon: "w-3 h-3 mt-0.5 fill-primary",
              }}
              primaryColor="#1E1E1E"
              onChange={handleChangeOrganizations}
              options={organizationsData.map(org => {
                return { value: org, label: org };
              })}
            />
          </div>
          <div className="flex flex-col sm:flex-row grow xl:min-w-[450px] border-2 border-black bg-primary">
            <Datepicker
              value={{ startDate: dateFrom, endDate: dateTo }}
              onChange={handleChangeDates}
              placeholder="Date"
              classNames={{
                input: () =>
                  "outline-none relative cursor-pointer transition-all duration-300 py-[12px] pl-4 pr-14 w-full placeholder-white bg-primary text-white",
              }}
            />
          </div>
        </div>
        <div className="flex flex-col md:flex-row">
          <select
            className="select select-bordered select-primary border-2 border-black rounded-none focus:outline-0"
            onChange={handleChangeSortBy}
          >
            {sortByOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );

  const SearchResult = (
    <div className="container mx-auto w-[1350px] max-w-[90%] mt-14 mb-24">
      <div className="grid md:grid-cols-3 gap-8">
        {records?.map(record => (
          <RecordTeaser key={record.id} record={record} showHeadline={true} />
        ))}
        <RecordCta />
      </div>
      <div className="flex justify-between items-center mt-8 gap-4">
        <button
          className={`btn btn-primary rounded-none ${currentPage === 1 ? "cursor-not-allowed" : ""}`}
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
          className={`btn btn-primary rounded-none ${currentPage === totalPages ? "cursor-not-allowed" : ""}`}
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

  return (
    <div>
      {emptyResults && (
        <div className="hidden sm:block absolute w-[300px] h-[330px] right-0 bottom-0 bg-[url('/assets/filler_logo.png')] bg-no-repeat bg-right-bottom bg-[length:300px]" />
      )}
      {SearchForm}
      {emptyResults ? <EmptyResults /> : SearchResult}
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async context => {
  const currentPage = Number(context.query.page) || 1;
  const q = context.query.q || "";
  const organizations = context.query.organizations || "";
  const author = context.query.author || "";
  const categoryIds = context.query.categoryIds || "";
  const dateFrom = context.query.dateFrom || "";
  const dateTo = context.query.dateTo || "";
  const sortBy = context.query.sortBy || "";
  // ToDo. Define types (swagger on backend?)
  let records: any[] = [];
  let totalCount: number = 0;
  let categories: any[] = [];
  let organizationsData: any[] = [];

  const sortByOptions = [
    { value: "rank", label: "Ranking desc" },
    { value: "title-asc", label: "Title (A-Z)" },
    { value: "title-desc", label: "Title (Z-A)" },
    { value: "author-asc", label: "Author (A-Z)" },
    { value: "author-desc", label: "Author (Z-A)" },
    { value: "date-desc", label: "Most Recent" },
  ];

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/search?q=${q}&page=${currentPage}&organizations=${organizations}&author=${author}&categoryIds=${categoryIds}&dateFrom=${dateFrom}&dateTo=${dateTo}&sortBy=${sortBy}`,
    );
    if (!res.ok) {
      throw new Error(res.statusText);
    }

    const data = await res.json();
    records = data.records;
    totalCount = data.totalCount;

    const resCategories = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/categories`);
    if (!resCategories.ok) {
      throw new Error(res.statusText);
    }

    categories = await resCategories.json();

    const resOrganizations = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/organizations`);
    if (!resOrganizations.ok) {
      throw new Error(res.statusText);
    }

    organizationsData = await resOrganizations.json();
  } catch (err) {
    console.log(err);
  }

  return {
    props: { records, totalCount, categories, organizationsData, sortByOptions },
  };
};

export default Search;
