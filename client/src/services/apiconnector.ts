import axios, {
  AxiosHeaders,
  type AxiosRequestConfig,
  type AxiosResponse,
} from "axios";

export const axiosInstance = axios.create({});

/**
 * Read the auth token written by `authSlice` into localStorage.
 * Stored shape is `JSON.stringify(token)`. Returns `null` if absent
 * or malformed.
 */
function readStoredToken(): string | null {
  const raw = localStorage.getItem("token");
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw);
    return typeof parsed === "string" && parsed.length > 0 ? parsed : null;
  } catch {
    // Tolerate a non-JSON value just in case.
    return raw || null;
  }
}

/**
 * Single source of truth for the `Authorization` header. Every request
 * — whether it goes through `apiConnector(...)` or the raw
 * `axiosInstance(...)` — is given a Bearer token from localStorage if
 * the caller hasn't already set one. Endpoints that must run
 * unauthenticated can opt out by passing `Authorization: undefined` in
 * their own headers (the interceptor then leaves it alone).
 */
axiosInstance.interceptors.request.use((config) => {
  const token = readStoredToken();
  if (!token) return config;

  // Normalize whatever the caller passed (AxiosHeaders, plain object,
  // or undefined) into an AxiosHeaders instance so we can use its API
  // without fighting the overloaded header typings.
  const headers = AxiosHeaders.from(
    config.headers as ConstructorParameters<typeof AxiosHeaders>[0]
  );
  if (!headers.has("Authorization") && !headers.has("authorization")) {
    headers.set("Authorization", `Bearer ${token}`);
  }
  config.headers = headers;
  return config;
});

export function apiConnector<TResponse = unknown>(
  method: AxiosRequestConfig["method"],
  url: string,
  bodyData?: unknown,
  headers?: AxiosRequestConfig["headers"],
  params?: AxiosRequestConfig["params"]
): Promise<AxiosResponse<TResponse>> {
  return axiosInstance({
    method,
    url,
    data: bodyData,
    headers,
    params,
  });
}
