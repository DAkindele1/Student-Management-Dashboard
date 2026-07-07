import { authStorage } from '../utils/auth';

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:4000/api';

type RequestOptions = RequestInit & {
  token?: string | null;
};

export async function apiRequest<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const token = options.token ?? authStorage.getToken();
  const headers = new Headers(options.headers);

  if (!(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }

  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
  });

  const text = await response.text();
  const payload = text ? (JSON.parse(text) as T) : (null as T);

  if (!response.ok) {
    const message = (payload as { message?: string } | null)?.message ?? 'Request failed';
    throw new Error(message);
  }

  return payload;
}