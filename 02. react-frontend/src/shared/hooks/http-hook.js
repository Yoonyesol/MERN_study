import { useCallback, useEffect, useRef, useState } from "react";

export const useHttpClient = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();

  const activeHttpRequests = useRef([]);

  //이 컴포넌트의 수정사항 발생시 리렌더링 방지를 위해 useCallback 사용
  const sendRequest = useCallback(
    async (url, method = "GET", body = null, headers = {}) => {
      setIsLoading(true);

      const httpAbortCtrl = new AbortController();
      activeHttpRequests.current.push(httpAbortCtrl); //데이터 변경 시 ui가 같이 업데이트되지 않게 함.

      try {
        const response = await fetch(url, {
          method,
          body,
          headers,
          signal: httpAbortCtrl.signal, //요청에 연결
        });
        const responseData = await response.json();

        if (!response.ok) {
          throw new Error(responseData.message);
        }

        return responseData;
      } catch (err) {
        setError(err.message);
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
      //연결 요청 취소(클린업 요청), 모든 AbortCtrl확인
      activeHttpRequests.current.forEach((abortCtrl) =>
        abortCtrl.abortCtrl().abort()
      );
    };
  }, []);

  return { isLoading: isLoading, error, sendRequest, clearError };
};
