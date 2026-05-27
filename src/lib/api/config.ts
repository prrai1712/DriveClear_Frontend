/**
 * DriveClear API base URL.
 * Production backend: https://driveclearbackend-production.up.railway.app
 * Override with NEXT_PUBLIC_API_URL (e.g. http://localhost:8000/api/v1 for local backend).
 */
export const PRODUCTION_API_BASE_URL = "https://driveclearbackend-production.up.railway.app/api/v1";

export const API_BASE_URL = (
  process.env.NEXT_PUBLIC_API_URL || PRODUCTION_API_BASE_URL
).replace(/\/$/, "");
