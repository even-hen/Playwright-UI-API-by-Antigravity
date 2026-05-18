import { APIRequestContext, APIResponse, expect } from '@playwright/test';
import { z } from 'zod';

/**
 * Validates an API response body against a Zod schema.
 * Asserts the response is OK before parsing.
 */
export async function validateResponse<T>(
  response: APIResponse,
  schema: z.ZodSchema<T>,
): Promise<T> {
  expect(response.ok(), `API responded with status ${response.status()}`).toBeTruthy();
  const body = await response.json();
  return schema.parse(body);
}

/**
 * Creates a Bearer authorization header object.
 */
export function authHeaders(token: string): Record<string, string> {
  return { Authorization: `Bearer ${token}` };
}

/**
 * A simple wrapper to make a POST request with JSON body and optional auth.
 */
export async function postJson(
  request: APIRequestContext,
  url: string,
  data: unknown,
  token?: string,
): Promise<APIResponse> {
  return request.post(url, {
    headers: {
      'Content-Type': 'application/json',
      ...(token ? authHeaders(token) : {}),
    },
    data,
  });
}

/**
 * A simple wrapper to make a GET request with optional auth.
 */
export async function getJson(
  request: APIRequestContext,
  url: string,
  token?: string,
): Promise<APIResponse> {
  return request.get(url, {
    headers: {
      ...(token ? authHeaders(token) : {}),
    },
  });
}

/**
 * A simple wrapper to make a DELETE request with optional auth.
 */
export async function deleteJson(
  request: APIRequestContext,
  url: string,
  token?: string,
): Promise<APIResponse> {
  return request.delete(url, {
    headers: {
      ...(token ? authHeaders(token) : {}),
    },
  });
}

/**
 * A simple wrapper to make a PUT request with JSON body and optional auth.
 */
export async function putJson(
  request: APIRequestContext,
  url: string,
  data: unknown,
  token?: string,
): Promise<APIResponse> {
  return request.put(url, {
    headers: {
      'Content-Type': 'application/json',
      ...(token ? authHeaders(token) : {}),
    },
    data,
  });
}

/**
 * A simple wrapper to make a PATCH request with JSON body and optional auth.
 */
export async function patchJson(
  request: APIRequestContext,
  url: string,
  data: unknown,
  token?: string,
): Promise<APIResponse> {
  return request.patch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...(token ? authHeaders(token) : {}),
    },
    data,
  });
}
