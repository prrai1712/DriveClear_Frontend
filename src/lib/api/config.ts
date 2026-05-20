/**
 * DriveClear API base URL.
 * Production backend: https://driveclear-api.onrender.com
 * Override with NEXT_PUBLIC_API_URL (e.g. http://localhost:8000/api/v1 for local backend).
 */
export const RENDER_API_BASE_URL = "https://driveclear-api.onrender.com/api/v1";

export const API_BASE_URL = (
  process.env.NEXT_PUBLIC_API_URL || RENDER_API_BASE_URL
).replace(/\/$/, "");
