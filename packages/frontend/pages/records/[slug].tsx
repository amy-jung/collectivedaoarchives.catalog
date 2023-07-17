import { GetServerSideProps, NextPage } from "next";

interface RecordProps {
  // ToDo. Define types (swagger on backend?)
  record: any;
}

const RecordPage: NextPage<RecordProps> = ({ record }) => {
  console.log("record", record);
  // Get an array of subcategory names
  const subCategoryNames = record.subcategories?.map(subCategoryOnRecord => subCategoryOnRecord.subCategory.name);

  return (
    <div className="mx-auto max-w-xl">
      <h1 className="font-bold text-3xl mb">{record.title}</h1>
      <span className="mb-8 block">posted on {record.date}</span>
      <p className="mb-2">{record.summary}</p>
      <ul className="mb-8">
        <li>
          <span className="font-bold">Protocol:</span> {record.organization}
        </li>
        <li>
          <span className="font-bold">Link:</span>{" "}
          <a href={record.link} target="_blank" className="link">
            Source
          </a>
        </li>
        <li>
          <span className="font-bold">Category:</span> {record.category?.name}
        </li>
        <li>
          <span className="font-bold">Subcategories:</span> {subCategoryNames?.join(", ")}
        </li>
      </ul>
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
