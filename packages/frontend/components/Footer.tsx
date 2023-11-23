import Image from "next/image";
import Link from "next/link";

/**
 * Site Footer
 */
export const Footer = () => {
  return (
    <div className="flex items-center justify-between p-16 py-12 bg-secondary">
      <Link href="/about" className="font-bold sm:text-2xl">
        About
      </Link>
      <Link
        href="https://github.com/amy-jung/collectivedaoarchives.catalog"
        className="font-bold sm:text-xl"
        target="_blank"
      >
        <Image src="/assets/github.png" alt="GitHub logo" width={45} height={45} />
      </Link>
    </div>
  );
};
