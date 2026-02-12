import type { ApiEnvelope } from '../types';

export async function getApi<T>(url: string): Promise<ApiEnvelope<T>> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }
  return response.json() as Promise<ApiEnvelope<T>>;
}
