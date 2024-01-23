import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ConnectButton } from "@rainbow-me/rainbowkit";

/**
 * Site header
 */
export const Header = () => {
  const pathname = usePathname();
  const isMainPage = pathname === "/";
  const isContributePage = pathname === "/contribute";

  return (
    <div className="flex justify-between items-center px-12 py-6 bg-accent">
      <span className="font-bold sm:text-xl">
        <Link href="/" className="flex gap-6 items-center">
          <span>
            <Image src="/assets/logo.svg" alt="Logo" width={64} height={64} />
          </span>
          <span className={isMainPage ? "hidden" : "hidden sm:inline font-heading text-2xl mt-2"}>
            COLLECTIVE DAO CATALOG
          </span>
        </Link>
      </span>
      <div className="flex gap-6 sm:gap-12 items-center">
        <ul className="flex gap-6 sm:gap-12 sm:text-2xl font-bold uppercase">
          <li>
            <Link href="/search">Search</Link>
          </li>
          <li>
            <Link href="/records">Records</Link>
          </li>
          <li>
            <Link href="/contribute">Contribute</Link>
          </li>
        </ul>
        {isContributePage && (
          <div className="rainbow-kit-connect">
            <ConnectButton chainStatus="icon" label="Connect" />
          </div>
        )}
      </div>
    </div>
  );
};
