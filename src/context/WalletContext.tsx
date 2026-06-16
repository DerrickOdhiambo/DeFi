import React, { useState, useEffect, createContext, useContext } from "react";

declare global {
  interface Window {
    ethereum?: {
      request: (args: {
        method: string;
        params?: unknown[];
      }) => Promise<unknown>;
      on: (event: string, handler: (...args: unknown[]) => void) => void;
      removeListener: (
        event: string,
        handler: (...args: unknown[]) => void,
      ) => void;
    };
  }
}

// metamask admin address for admin-only features
const ADMIN_ADDRESS: string = import.meta.env.VITE_ADMIN_ADDRESS ?? "";

type WalletContextType = {
  isConnected: boolean;
  address: string | null;
  isAdmin: boolean;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
};

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export function WalletProvider({ children }: { children: React.ReactNode }) {
  const [isConnected, setIsConnected] = useState(false);
  const [address, setAddress] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  const connectWallet = async () => {
    if (!window.ethereum) {
      alert(
        "MetaMask is not installed. Please install it to connect your wallet.",
      );
      return;
    }

    try {
      const accounts = (await window.ethereum.request({
        method: "eth_requestAccounts",
      })) as string[];
      if (accounts.length > 0) {
        // Set the first account as the connected address
        const connected = accounts[0];

        setAddress(connected);
        setIsConnected(true);

        // Check if the connected address is the admin for admin-only features
        setIsAdmin(
          ADMIN_ADDRESS !== "" &&
            connected.toLowerCase() === ADMIN_ADDRESS.toLowerCase(),
        );
      }
    } catch (err) {
      console.error("Wallet connection failed:", err);
    }
  };

  // Clear wallet state on disconnect
  const disconnectWallet = () => {
    setIsConnected(false);
    setAddress(null);
    setIsAdmin(false);
  };

  useEffect(() => {
    if (!window.ethereum) return;

    const handleAccountsChanged = (...args: unknown[]) => {
      const list = (args[0] ?? []) as string[];
      if (list.length === 0) {
        disconnectWallet();
      } else {
        const updated = list[0];
        setAddress(updated);
        setIsConnected(true);
        setIsAdmin(
          ADMIN_ADDRESS !== "" &&
            updated.toLowerCase() === ADMIN_ADDRESS.toLowerCase(),
        );
      }
    };

    const handleChainChanged = () => {
      // When the chain changes, we refresh the page to reset the state
      window.location.reload();
    };

    window.ethereum.on("accountsChanged", handleAccountsChanged);
    window.ethereum.on("chainChanged", handleChainChanged);

    // Cleanup listeners on unmount
    return () => {
      window.ethereum?.removeListener("accountsChanged", handleAccountsChanged);
      window.ethereum?.removeListener("chainChanged", handleChainChanged);
    };
  }, []);

  return (
    <WalletContext.Provider
      value={{
        isConnected,
        address,
        isAdmin,
        connectWallet,
        disconnectWallet,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
}

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error("useWallet must be used within a WalletProvider");
  }
  return context;
};
