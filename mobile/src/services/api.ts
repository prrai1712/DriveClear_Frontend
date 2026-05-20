import axios from "axios";
import { getAccessToken } from "./token-storage";

const API_URL =
  process.env.EXPO_PUBLIC_API_URL || "https://driveclear-api.onrender.com/api/v1";

export const api = axios.create({
  baseURL: API_URL,
  timeout: 30000,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use(async (config) => {
  const token = await getAccessToken();
  if (token) {
    config.headers.set("Authorization", `Bearer ${token}`);
  }
  config.headers.set("X-Device-Platform", "mobile");
  return config;
});

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T | null;
  error: { code: string; details: string } | null;
}

export async function apiPost<T>(url: string, body: unknown): Promise<T> {
  const { data } = await api.post<ApiResponse<T>>(url, body);
  if (!data.success) throw new Error(data.message);
  return data.data as T;
}
