import { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';

interface UseFetchResult<T> {
    data: T | null;
    loading: boolean;
    error: string | null;
    refetch: () => void;
}

export function useFetch<T>(
    fetchFn: () => Promise<{ data: T }>,
    errorMessage = 'Something went wrong',
): UseFetchResult<T> {
    const [data, setData] = useState<T | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetch = useCallback(() => {
        setLoading(true);
        setError(null);
        fetchFn()
            .then((res) => setData(res.data))
            .catch((err) => {
                const msg =
                    err.response?.data?.message || errorMessage;
                setError(msg);
                toast.error(msg);
            })
            .finally(() => setLoading(false));
    }, []);

    useEffect(() => {
        fetch();
    }, [fetch]);

    return { data, loading, error, refetch: fetch };
}