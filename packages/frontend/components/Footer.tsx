import Link from "next/link";

/**
 * Site Footer
 */
export const Footer = () => {
  return (
    <div className="flex items-center p-4 py-5 bg-secondary mt-20">
      <Link href="/about" className="font-bold sm:text-xl">
        About
      </Link>
    </div>
  );
};
