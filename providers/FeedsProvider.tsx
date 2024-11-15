import { ReactNode, createContext, useContext, useState } from "react";
import { useAsyncFn } from "../hooks/useFetch";
import { getFeeds, importFeeds, saveFeeds } from "@/domain/getFeeds";
import { Feed } from "@/types";

type FeedsProviderProps = { children: ReactNode };

type FeedsContextType = {
  loading?: boolean;
  error?: string | null;
  feeds?: Feed[] | null;
  getFeeds: () => void;
  importFeeds: (feeds: string) => Promise<boolean | undefined>;
  updateFeeds: (feeds: Feed[]) => Promise<boolean | undefined>;
};

const FeedsContext = createContext<FeedsContextType>({
  getFeeds: () => null,
  importFeeds: async ([]) => true,
  updateFeeds: async ([]) => true,
});

export function FeedsProvider({ children }: FeedsProviderProps) {
  const {
    data,
    loading,
    error,
    runFn: refetchFeeds,
  } = useAsyncFn<Feed[] | undefined>(getFeeds);
  const [actionError, setActionError] = useState<string | null>(null);

  const handleImportFeeds = async (feeds: string) => {
    try {
      const success = await importFeeds(feeds);
      setActionError(null);

      if (success) {
        refetchFeeds();
        return true;
      }
    } catch (e) {
      setActionError(`Cannot import feeds ${(e as Error).message}`);
    }
  };

  const handleUpdateFeeds = async (feeds: Feed[]) => {
    try {
      const success = await saveFeeds(feeds);
      setActionError(null);

      if (success) {
        await refetchFeeds();
        return true;
      }
    } catch (e) {
      setActionError(`Cannot save feeds ${(e as Error).message}`);
    }
  };

  return (
    <FeedsContext.Provider
      value={{
        feeds: data,
        loading,
        error: error || actionError,
        getFeeds: refetchFeeds,
        importFeeds: handleImportFeeds,
        updateFeeds: handleUpdateFeeds,
      }}
    >
      {children}
    </FeedsContext.Provider>
  );
}

export function useFeedsContext() {
  return useContext(FeedsContext);
}
