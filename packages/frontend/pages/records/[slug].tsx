import { GetServerSideProps, NextPage } from "next";

interface RecordProps {
  // ToDo. Define types (swagger on backend?)
  record: any;
}

const RecordPage: NextPage<RecordProps> = ({ record }) => {
  return (
    <div className="container mx-auto w-[1150px] max-w-[90%] mt-14 pb-20 md:pb-44">
      <div className="border-b-200 border-b-[10px] mb-10">
        <h1 className="font-bold text-4xl mb-4">{record.title}</h1>
        <span className="mb-8 block">{record.organization}</span>
      </div>

      <div className="flex flex-col md:flex-row">
        <div
          className="mb-2 md:w-3/4 md:pr-24 break-words record-view-mode-full"
          dangerouslySetInnerHTML={{ __html: record.content }}
        ></div>
        <div className="border-t-base-200 border-t-[10px] pt-6 mt-6 md:pt-0 md:mt-0 md:border-0 md:w-1/4 flex flex-col gap-12">
          <div>
            <span className="font-bold">Protocol:</span>
            <span className="block">{record.organization}</span>
          </div>
          <div>
            <span className="font-bold">Source:</span>
            <a className="block link" href={record.link} target="_blank">
              {record.link}
            </a>
          </div>
          <div>
            <span className="font-bold">Date:</span>
            <span className="block">{record.date}</span>
          </div>
          <div>
            <span className="font-bold">Category:</span>
            <span className="block">{record.category?.name ?? "N/A"}</span>
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
    const res = await fetch(`${process.env.BACKEND_URL}/api/records/${slug}`);

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
