import Link from "next/link";

export const RecordTeaser = ({ record, showHeadline = false }: { record: any; showHeadline?: boolean }) => (
  <div key={record.id} className="border-t-base-200 border-t-[10px] py-6">
    <h2 className="text-xl md:text-3xl mb-2">
      <Link href={`/records/${record.slug}`}>
        <span className="font-bold">{record.title}</span>
      </Link>
    </h2>
    <p>
      <span className="text-lg md:text-2xl">{record.organization}</span>
    </p>
    {showHeadline && (
      <p className="mt-4">
        <span className="italic break-words" dangerouslySetInnerHTML={{ __html: record.headline }}></span>
      </p>
    )}
  </div>
);
