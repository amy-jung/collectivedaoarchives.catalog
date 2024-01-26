import Link from "next/link";
import { GetServerSideProps, NextPage } from "next";

interface RecordProps {
  // ToDo. Define types (swagger on backend?)
  record: any;
}

const formatDate = (dateString: string) => {
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  return new Date(dateString).toLocaleDateString("en-US", options);
};

const RecordPage: NextPage<RecordProps> = ({ record }) => {
  return (
    <div className="container mx-auto w-[1150px] max-w-[90%] mt-14 pb-20 md:pb-44">
      <div className="border-b-200 border-b-[10px] mb-10">
        <h1 className="font-bold text-xl md:text-5xl mb-4 !leading-[1.1]">{record.title}</h1>
        <Link href={`/search?organizations=${record.organization}`}>
          <span className="mb-8 block text-lg md:text-2xl">{record.organization}</span>
        </Link>
      </div>

      <div className="flex flex-col md:flex-row">
        <div
          className="mb-2 md:w-3/4 md:pr-24 break-words record-view-mode-full prose"
          dangerouslySetInnerHTML={{ __html: record.content }}
        ></div>
        <div className="border-t-base-200 border-t-[10px] pt-6 mt-6 md:pt-0 md:mt-0 md:border-0 md:w-1/4 flex flex-col gap-12">
          <div>
            <span className="font-bold">Protocol:</span>
            <span className="block mt-3">
              <Link href={`/search?organizations=${record.organization}`} className="link-boxed">
                {record.organization}
              </Link>
            </span>
          </div>
          <div>
            <span className="font-bold">Source:</span>
            <a className="block link break-all" href={record.link} target="_blank">
              {record.link}
            </a>
          </div>
          <div>
            <span className="font-bold">Date:</span>
            <span className="block">{record.date ? formatDate(record.date) : "-"}</span>
          </div>
          <div>
            <span className="font-bold">Category:</span>
            <span className="block mt-3">
              {record.category ? (
                <Link href={`/search?categoryIds=${record.category.id}`} className="link-boxed">
                  {record.category.name}
                </Link>
              ) : (
                "N/A"
              )}
            </span>
          </div>
          <div>
            <span className="font-bold">Author:</span>
            <span className="block mt-3">
              <Link href={`/search?author=${record.author}`} className="link-boxed">
                {record.author}
              </Link>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

// ToDo. Maybe use ISR?
export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  if (!params?.slug || Array.isArray(params.slug)) {
    return {
      notFound: true,
    };
  }

  const { slug } = params;

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/records/${slug}`);

    if (!res.ok) {
      throw new Error("Record not found");
    }

    const record = await res.json();

    return {
      props: { record },
    };
  } catch (error) {
    console.log(error);
    return {
      notFound: true,
    };
  }
};

export default RecordPage;
