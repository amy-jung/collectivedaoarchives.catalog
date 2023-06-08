import { ConnectButton } from "@rainbow-me/rainbowkit";

/**
 * Site header
 */
export const Header = () => {
  return (
    <div className="flex justify-end p-4">
      <ConnectButton chainStatus="icon" />
    </div>
  );
};
