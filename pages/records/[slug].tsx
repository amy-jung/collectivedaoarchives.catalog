import { GetStaticProps } from "next";
import ReactMarkdown from "react-markdown";
import { CatalogRecord, getAllRecords, getRecordBySlug } from "~~/utils/records";

export default function Post({ catalogRecord }: { catalogRecord: CatalogRecord }) {
  return (
    <div className="mx-auto max-w-xl">
      <h1 className="font-bold text-3xl mb">{catalogRecord.title}</h1>
      <span className="mb-8 block">posted on {catalogRecord.date}</span>
      <p className="mb-2">{catalogRecord.summary}</p>
      <ul className="mb-8">
        <li>
          <span className="font-bold">Link:</span>{" "}
          <a href={catalogRecord.link} target="_blank" className="link">
            Source
          </a>
        </li>
        <li>
          <span className="font-bold">Category:</span> {catalogRecord.category}
        </li>
        <li>
          <span className="font-bold">Tags:</span> {catalogRecord.tags.join(", ")}
        </li>
      </ul>

      <ReactMarkdown>{catalogRecord.content}</ReactMarkdown>
    </div>
  );
}

export async function getStaticPaths() {
  const records = getAllRecords();

  return {
    paths: records?.map(post => {
      return {
        params: {
          slug: post.slug,
        },
      };
    }),
    fallback: false,
  };
}
export const getStaticProps: GetStaticProps<{ catalogRecord: CatalogRecord }, { slug?: string | string[] }> = async ({
  params,
}) => {
  if (!params?.slug || Array.isArray(params.slug)) {
    return {
      notFound: true,
    };
  }

  const catalogRecord = getRecordBySlug(params.slug);
  if (!catalogRecord) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      catalogRecord,
    },
  };
};
