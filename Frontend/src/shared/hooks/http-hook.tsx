import { useState, useCallback, useRef, useEffect } from "react";

export const useHttpClient = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<any>();
  const activeHttpRequests = useRef<any>([]);

  const sendRequest = useCallback(
    async (url: any, method = "GET", data = null, headers = {}) => {
      try {
        setIsLoading(true);
        const httpAbortCtrl = new AbortController();
        activeHttpRequests.current.push(httpAbortCtrl);

        const response = await fetch(url, {
          method,
          headers,
          body: data,
          signal: httpAbortCtrl.signal,
        });

        const responseData = await response.json();
        if (!response.ok) {
          throw new Error(responseData.message);
        }

        return responseData;
      } catch (err: any) {
        console.log(err);
        setError(err.message || "Something went wrong, Please try again!");
      }
      setIsLoading(false);
    },
    []
  );

  const clearError = () => {
    setError(null);
  };

  useEffect(() => {
    return () => {
      activeHttpRequests.current.forEach((abortCtrl: any) =>
        abortCtrl.abortCtrl()
      );
    };
  }, []);

  return { isLoading, error, sendRequest, clearError };
};
