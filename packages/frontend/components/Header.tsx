import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { BurgerIcon } from "~~/components/icons/BurgerIcon";
import { CloseIcon } from "~~/components/icons/CloseIcon";

/**
 * Site header
 */
export const Header = () => {
  const pathname = usePathname();
  const isMainPage = pathname === "/";
  const isContributePage = pathname === "/contribute";
  const drawerCheckboxRef = useRef<HTMLInputElement>(null);

  const closeDrawer = () => {
    if (drawerCheckboxRef.current) {
      drawerCheckboxRef.current.checked = false;
    }
  };

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
      <div className="hidden lg:flex gap-6 sm:gap-12 items-center">
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
      <div className="drawer drawer-end text-right lg:hidden">
        <input id="menu-drawer" type="checkbox" className="drawer-toggle" ref={drawerCheckboxRef} />
        <div className="drawer-content">
          <label htmlFor="menu-drawer" className="drawer-button flex justify-end">
            <BurgerIcon />
          </label>
        </div>
        <div className="drawer-side z-50">
          <label htmlFor="menu-drawer" aria-label="close sidebar" className="drawer-overlay"></label>
          <div className="p-4 min-w-[200px] min-h-full bg-base-100 text-base-content text-left">
            <span onClick={closeDrawer} className="flex justify-end">
              <CloseIcon />
            </span>
            <ul className="flex-col flex gap-6 sm:gap-12 sm:text-2xl font-bold uppercase pt-4">
              <li onClick={closeDrawer}>
                <Link href="/search" aria-label="close sidebar">
                  Search
                </Link>
              </li>
              <li onClick={closeDrawer}>
                <Link href="/records">Records</Link>
              </li>
              <li onClick={closeDrawer}>
                <Link href="/contribute">Contribute</Link>
              </li>
            </ul>
            {isContributePage && (
              <div className="rainbow-kit-connect mt-5">
                <ConnectButton chainStatus="icon" label="Connect" />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
