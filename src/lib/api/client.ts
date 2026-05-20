import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import { ApiClientError, ApiResponse } from "./types";
import { getAccessToken, getRefreshToken, setTokens, clearTokens } from "../auth/token";
import {
  encryptApiBody,
  isEncryptedEnvelope,
  isPayloadEncryptionEnabled,
  unwrapApiData,
} from "./crypto";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

/** Public auth routes must not send a stale Bearer token (DRF returns 401 before AllowAny). */
function isPublicAuthRequest(url?: string): boolean {
  if (!url) return false;
  return (
    url.includes("auth/otp/send") ||
    url.includes("auth/otp/verify") ||
    url.includes("auth/firebase/verify") ||
    url.includes("auth/token/refresh")
  );
}

/** Default for most API calls; challan fetch uses a longer timeout (ChallanPay can be slow). */
export const API_TIMEOUT_MS = 30_000;
export const CHALLAN_FETCH_TIMEOUT_MS = 90_000;

export const api = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json" },
  timeout: API_TIMEOUT_MS,
});

api.interceptors.request.use(async (config: InternalAxiosRequestConfig) => {
  const token = getAccessToken();
  if (token && !isPublicAuthRequest(config.url)) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  const deviceId = typeof window !== "undefined" ? localStorage.getItem("device_id") : null;
  if (deviceId) {
    config.headers["X-Device-ID"] = deviceId;
    config.headers["X-Device-Platform"] = "web";
  }
  config.headers["X-Correlation-ID"] = crypto.randomUUID();

  const skipEncrypt = config.url?.includes("auth/token/refresh");
  if (
    !skipEncrypt &&
    isPayloadEncryptionEnabled() &&
    config.data &&
    typeof config.data === "object" &&
    !isEncryptedEnvelope(config.data)
  ) {
    try {
      config.data = await encryptApiBody(config.data as Record<string, unknown>);
      config.headers["X-Payload-Encrypted"] = "1";
    } catch {
      return Promise.reject(
        new Error(
          "Could not encrypt API request. Check NEXT_PUBLIC_API_PAYLOAD_ENCRYPTION_KEY, then hard-refresh.",
        ),
      );
    }
  }

  return config;
});

api.interceptors.response.use(async (response) => {
  if (isPayloadEncryptionEnabled() && response.data && isEncryptedEnvelope(response.data)) {
    try {
      response.data = await unwrapApiData(response.data);
    } catch {
      throw new Error(
        "Could not decrypt API response. Ensure NEXT_PUBLIC_API_PAYLOAD_ENCRYPTION_KEY matches the backend key, then hard-refresh.",
      );
    }
  }
  return response;
});

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<ApiResponse<unknown> | { encrypted: true; payload: string }>) => {
    if (isPayloadEncryptionEnabled() && error.response?.data) {
      try {
        error.response.data = await unwrapApiData(error.response.data);
      } catch {
        /* keep original for debugging */
      }
    }

    if (error.response?.status === 401 && !error.config?.url?.includes("auth/")) {
      const refresh = getRefreshToken();
      if (refresh) {
        try {
          const { data } = await axios.post<
            ApiResponse<{ access: string; refresh: string }> | { encrypted: true; payload: string }
          >(`${API_URL}/auth/token/refresh/`, { refresh });
          const body = await unwrapApiData<ApiResponse<{ access: string; refresh: string }>>(data);
          if (body.success && body.data) {
            setTokens(body.data.access, body.data.refresh);
            if (error.config) {
              error.config.headers.Authorization = `Bearer ${body.data.access}`;
              return api.request(error.config);
            }
          }
        } catch {
          clearTokens();
          if (typeof window !== "undefined") window.location.href = "/login";
        }
      }
    }
    return Promise.reject(error);
  },
);

function throwFromApiBody(body: ApiResponse<unknown>): never {
  throw new ApiClientError(
    body.error?.code || "UNKNOWN",
    body.message || "Request failed",
    body.error?.details,
  );
}

export type ApiRequestOptions = { timeout?: number };

export async function apiRequest<T>(
  method: "get" | "post",
  url: string,
  body?: unknown,
  options?: ApiRequestOptions,
): Promise<T> {
  try {
    let { data } = await api.request<ApiResponse<T>>({
      method,
      url,
      data: body,
      timeout: options?.timeout,
    });
    if (isEncryptedEnvelope(data)) {
      data = await unwrapApiData<ApiResponse<T>>(data);
    }
    if (!data.success || data.error) {
      throwFromApiBody(data);
    }
    return data.data as T;
  } catch (err: unknown) {
    if (err instanceof ApiClientError) throw err;
    if (axios.isAxiosError(err) && err.response?.data) {
      let payload = err.response.data;
      if (isPayloadEncryptionEnabled()) {
        try {
          payload = await unwrapApiData(payload);
        } catch {
          /* use raw */
        }
      }
      if (payload && typeof payload === "object" && "success" in payload) {
        throwFromApiBody(payload as ApiResponse<unknown>);
      }
    }
    throw err;
  }
}
