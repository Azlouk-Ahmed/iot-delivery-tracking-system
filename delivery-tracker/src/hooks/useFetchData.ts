// hooks/useFetch.ts
import { useState, useEffect, useCallback } from 'react';
import useAxiosPrivate from './useAxiosPrivate';
import { axiosPublic } from '../api/axios';
import type { UseFetchOptions, UseFetchReturn } from '@/types/types';



const useFetch = <T = any>(url: string, options: UseFetchOptions = {}): UseFetchReturn<T> => {
    const {
        immediate = true,
        useAuth = true,
        dependencies = []
    } = options;

    const axiosPrivate = useAxiosPrivate();
    const axios = useAuth ? axiosPrivate : axiosPublic;

    const [data, setData] = useState<T | null>(null);
    const [loading, setLoading] = useState<boolean>(immediate);
    const [error, setError] = useState<string | null>(null);

    const fetchData = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await axios.get<T>(url);
            setData(response.data);
        } catch (err: any) {
            setError(err.response?.data?.message || err.message);
            console.error('Error fetching data:', err);
        } finally {
            setLoading(false);
        }
    }, [url, axios]);

    useEffect(() => {
        if (immediate && url) {
            fetchData();
        }
    }, [immediate, url, ...dependencies]);

    return { data, loading, error, refetch: fetchData };
};

export default useFetch;