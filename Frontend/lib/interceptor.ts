/**
 * lib/interceptor.ts
 * Generic HTTP CRUD Interceptor
 * Standardized fetch client for handling base URLs, headers, and error normalization.
 */

import type { ApiErrorResponse } from '@/types';

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status: number = 500,
    public readonly data: ApiErrorResponse | null = null
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

const FASTAPI_BASE_URL =
  process.env.NEXT_PUBLIC_FASTAPI_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  'http://localhost:8000';

async function httpFetch<T>(endpoint: string, options: RequestInit & { baseUrl?: string } = {}): Promise<T> {
  const { baseUrl = FASTAPI_BASE_URL, headers: customHeaders, body, ...rest } = options;
  const url = endpoint.startsWith('http')
    ? endpoint
    : `${baseUrl}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

  const headers = new Headers(customHeaders || {});
  let requestBody: BodyInit | null = null;

  if (body) {
    if (body instanceof FormData) {
      requestBody = body; // Browser sets boundary header automatically
    } else if (typeof body === 'string') {
      requestBody = body;
      if (!headers.has('Content-Type')) headers.set('Content-Type', 'application/json');
    } else {
      requestBody = JSON.stringify(body);
      if (!headers.has('Content-Type')) headers.set('Content-Type', 'application/json');
    }
  }

  if (!headers.has('Accept')) headers.set('Accept', 'application/json');

  const res = await fetch(url, { ...rest, headers, body: requestBody });

  if (!res.ok) {
    let errMsg = `HTTP Error ${res.status}: ${res.statusText}`;
    let errData: ApiErrorResponse | null = null;
    try {
      errData = await res.json();
      if (errData) {
        errMsg = typeof errData.detail === 'string'
          ? errData.detail
          : Array.isArray(errData.detail)
          ? errData.detail.map((d) => d.msg).join(', ')
          : errData.error || errData.message || errMsg;
      }
    } catch { /* text fallback */ }
    throw new ApiError(errMsg, res.status, errData);
  }

  if (res.status === 204) return null as T;
  const contentType = res.headers.get('content-type');
  if (contentType?.includes('application/json')) return res.json();
  return res.text() as unknown as T;
}

export const apiClient = {
  get: <T>(url: string, opts?: RequestInit) => httpFetch<T>(url, { ...opts, method: 'GET' }),
  post: <T>(url: string, data?: unknown, opts?: RequestInit) => httpFetch<T>(url, { ...opts, method: 'POST', body: data as BodyInit }),
  postForm: <T>(url: string, formData: FormData, opts?: RequestInit & { baseUrl?: string }) => httpFetch<T>(url, { ...opts, method: 'POST', body: formData }),
  put: <T>(url: string, data?: unknown, opts?: RequestInit) => httpFetch<T>(url, { ...opts, method: 'PUT', body: data as BodyInit }),
  delete: <T>(url: string, opts?: RequestInit) => httpFetch<T>(url, { ...opts, method: 'DELETE' }),
};
