import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const isProduction = process.env.NODE_ENV === 'production';

export const baseUrl = isProduction
  ? process.env.NEXT_PUBLIC_BASE_URL
  : 'http://localhost:3000';

export const skipApiCall = process.env.NEXT_SKIP_API_CALLS;
