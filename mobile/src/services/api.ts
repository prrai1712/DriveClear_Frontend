import axios from "axios";
import * as SecureStore from "expo-secure-store";

const API_URL = process.env.EXPO_PUBLIC_API_URL || "http://localhost:8000/api/v1";

export const api = axios.create({
  baseURL: API_URL,
  timeout: 30000,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use(async (config) => {
  const token = await SecureStore.getItemAsync("access_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  config.headers["X-Device-Platform"] = "mobile";
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
