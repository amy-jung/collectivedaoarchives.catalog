import Link from "next/link";
import { usePathname } from "next/navigation";
import { ConnectButton } from "@rainbow-me/rainbowkit";

/**
 * Site header
 */
export const Header = () => {
  const pathname = usePathname();
  const isMainPage = pathname === "/";

  return (
    <div className="flex justify-between items-center p-4 bg-secondary">
      {/* hide this span if we are in the NextJS main page */}
      <span className="font-bold text-xl">
        <Link href="/" className={isMainPage ? "hidden" : ""}>
          DAO COLLECTIVE CATALOG
        </Link>
      </span>
      <div className="flex gap-12 items-center">
        <ul className="flex gap-12 text-xl font-bold">
          <li>
            <Link href="/records">Records</Link>
          </li>
          <li>
            <Link href="/contribute">Contribute</Link>
          </li>
        </ul>
        <ConnectButton chainStatus="icon" />
      </div>
    </div>
  );
};
