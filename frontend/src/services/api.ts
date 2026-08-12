import axios from 'axios';
import { store } from '@/utils/storage';

export const API_URL = import.meta.env.VITE_API_URL ?? '';

/**
 * Flip VITE_USE_API to "true" once the Django REST backend is running.
 * Every service below is written so only the branch inside it has to change.
 */
export const useApi = import.meta.env.VITE_USE_API === 'true' && Boolean(API_URL);

export const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000,
});

api.interceptors.request.use((config) => {
  const token = store.get<string | null>('token', null);
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (error) => Promise.reject(error),
);

/** Mimics network latency so loading and skeleton states are exercised in demo mode. */
export const resolve = <T>(data: T, ms = 320): Promise<T> =>
  new Promise((r) => setTimeout(() => r(data), ms));
