export interface ApiClientOptions {
  baseUrl?: string;
  timeoutMs?: number;
  headers?: Record<string, string>;
}

export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export interface RequestOptions {
  method?: HttpMethod;
  headers?: Record<string, string>;
  body?: unknown;
  timeoutMs?: number;
}

export class ApiError extends Error {
  status?: number;
  details?: unknown;

  constructor(message: string, status?: number, details?: unknown) {
    super(message);
    this.status = status;
    this.details = details;
  }
}

export async function apiRequest<T>(
  path: string,
  options: RequestOptions = {},
  config: ApiClientOptions = {}
): Promise<T> {
  const baseUrl = (config.baseUrl ?? process.env.NEXT_PUBLIC_API_URL ?? "").replace(/\/+$/, "");
  const timeoutMs = options.timeoutMs ?? config.timeoutMs ?? Number(process.env.NEXT_PUBLIC_API_TIMEOUT_MS ?? 10000);

  const controller = new AbortController();
  const timeout = globalThis.setTimeout(() => controller.abort(), timeoutMs);

  const url = `${baseUrl}${path.startsWith("/") ? path : `/${path}`}`;

  try {
    const response = await fetch(url, {
      method: options.method ?? "GET",
      headers: {
        "Content-Type": "application/json",
        ...(config.headers ?? {}),
        ...(options.headers ?? {}),
      },
      body: options.body ? JSON.stringify(options.body) : undefined,
      signal: controller.signal,
      next: { revalidate: 0 },
    });

    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      throw new ApiError(data?.message ?? "Request failed", response.status, data);
    }
    return data as T;
  } catch (error) {
    if (error instanceof ApiError) throw error;
    if ((error as Error)?.name === "AbortError") {
      throw new ApiError("Request timeout", 408);
    }
    throw new ApiError((error as Error)?.message ?? "Network error");
  } finally {
    globalThis.clearTimeout(timeout);
  }
}
