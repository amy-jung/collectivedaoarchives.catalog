import Link from "next/link";

export const EmptyResults = () => (
  <div className="container mx-auto w-[1350px] max-w-[90%] mt-14 mb-20">
    <p className="font-bold text-xl md:text-4xl mb-12 md:mb-24">Oops! That doesn’t exist or isn’t archived yet.</p>
    <p className="font-bold text-xl md:text-4xl bg-accent p-1 inline-block mb-2">Got something to add?</p>
    <p className="text-lg">
      Submit a{" "}
      <Link href="/contribute" className="link">
        record
      </Link>
    </p>
    <p className="font-bold text-xl md:text-4xl bg-accent p-1 inline-block mb-2 mt-16">Need other ideas?</p>
    <p className="text-lg">
      Try sorting through our{" "}
      <Link href="/search" className="link">
        categories
      </Link>
    </p>
  </div>
);
