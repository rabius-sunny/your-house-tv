'use client';

import requests from '@/services/http';
import useSWR from 'swr';

type UrlInput = string | (() => string);

// Fetcher function for SWR
const fetcher = async (url: string) => {
  const response = await requests.get(url);
  return response.data;
};

export function useAsync<T = any>(urlInput: UrlInput) {
  // Get the actual URL
  const url = typeof urlInput === 'function' ? urlInput() : urlInput;

  const { data, error, isLoading, mutate } = useSWR<T>(url, fetcher);

  return {
    data: data || null,
    error: error
      ? error?.response?.data?.message || error?.message || 'An error occurred'
      : null,
    loading: isLoading,
    mutate,
    refetch: () => mutate(),
    reset: () => mutate(undefined, false)
  };
}
