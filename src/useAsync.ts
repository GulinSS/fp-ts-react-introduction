import { useEffect, useState } from 'react'

export type UseAsyncResult<T> = {
  readonly loading: boolean
  readonly error?: Error
  readonly res?: T
}

// See https://dev.to/lukasmoellerch/a-hook-to-use-promise-results-2hfd
export const useAsync = <T>(fn: () => Promise<T>, deps: any[]): UseAsyncResult<T> => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | undefined>();
  const [res, setRes] = useState<T | undefined>();
  useEffect(() => {
    let cancel = false;

    setLoading(true);
    setError(void 0);
    fn().then(res => {
      if (cancel) return;
      setLoading(false);
      setRes(res)
    }, error => {
      if (cancel) return;
      setLoading(false);
      setError(error);
    })

    return () => {
      cancel = true;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)
  return {loading, error, res};
}
