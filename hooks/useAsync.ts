'use client';

import useSWR from 'swr';
import requests from '@/services/http';

type UrlInput = string | (() => string);

interface UseAsyncOptions {
  onSuccess?: (data: any) => void;
  onError?: (error: string) => void;
}

// Fetcher function for SWR
const fetcher = async (url: string) => {
  const response = await requests.get(url);
  return response.data;
};

export function useAsync<T = any>(
  urlInput: UrlInput,
  options?: UseAsyncOptions
) {
  // Get the actual URL
  const url = typeof urlInput === 'function' ? urlInput() : urlInput;

  const { data, error, isLoading, mutate } = useSWR<T>(url, fetcher, {
    onSuccess: options?.onSuccess,
    onError: (error) => {
      const errorMessage =
        error?.response?.data?.message || error?.message || 'An error occurred';
      options?.onError?.(errorMessage);
    }
  });

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
