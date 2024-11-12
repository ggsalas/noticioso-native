import { ReactNode, createContext, useContext, useState } from "react";
import { useAsyncFn } from "../hooks/useFetch";
import { getFeeds, importFeeds } from "@/domain/getFeeds";
import { Feed } from "@/types";

type FeedsProviderProps = { children: ReactNode };

type FeedsContextType = {
  loading?: boolean;
  error?: string | null;
  feeds?: Feed[] | null;
  getFeeds: () => void;
  importFeeds: (feeds: string) => Promise<boolean | undefined>;
};

const FeedsContext = createContext<FeedsContextType>({
  getFeeds: () => null,
  importFeeds: async ([]) => true,
});

export function FeedsProvider({ children }: FeedsProviderProps) {
  const { data, loading, error, runFn } = useAsyncFn<Feed[] | undefined>(
    getFeeds
  );
  const [actionError, setActionError] = useState<string | null>(null);

  const handleImportFeeds = async (feeds: string) => {
    try {
      const success = await importFeeds(feeds);
      setActionError(null);

      if (success) {
        runFn();
        console.log("return true");
        return true;
      }
    } catch (e) {
      setActionError(`Cannot import feeds ${(e as Error).message}`);
    }
  };

  return (
    <FeedsContext.Provider
      value={{
        feeds: data,
        loading,
        error: error || actionError,
        getFeeds: runFn,
        importFeeds: handleImportFeeds,
      }}
    >
      {children}
    </FeedsContext.Provider>
  );
}

export function useFeedsContext() {
  return useContext(FeedsContext);
}
