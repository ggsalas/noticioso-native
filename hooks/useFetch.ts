import { useState, useEffect } from "react";

type UseAsyncFnReturn = {
  data: any;
  loading: boolean;
  error: any;
};

export const useAsyncFn = (fn: any, params: any): UseAsyncFnReturn => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const runAsyncFn = async () => {
      setLoading(true);

      try {
        const data = await fn(params);
        setData(data);
        setError(null);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    runAsyncFn();
  }, [fn, params]);

  return { data, loading, error };
};
