import Link from "next/link";

export const RecordCta = () => (
  <Link href="/contribute">
    <div className="border-base-200 border-[10px] border-dashed p-6 h-full">
      <h2 className="text-xl md:text-3xl mb-2">
        <span className="font-bold">Got something to add?</span>
      </h2>
      <p className="mt-4">
        <span className="italic break-words">Submit a record</span>
      </p>
    </div>
  </Link>
);
