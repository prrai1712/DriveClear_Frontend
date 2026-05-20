import { isAxiosError } from "axios";
import { ApiClientError, ApiResponse } from "./types";

const FIREBASE_BACKEND_HINT =
  "Add the service account JSON: Firebase Console → Project settings → Service accounts → " +
  "Generate new private key → save as DriveClear_Backend/firebase/driveclear-service-account.json, " +
  "set FIREBASE_CREDENTIALS_PATH in DriveClear_Backend/.env, restart Django.";

/** User-facing message from API or network errors. */
export function getApiErrorMessage(err: unknown): string {
  if (err instanceof ApiClientError) {
    if (err.code === "FIREBASE_NOT_CONFIGURED") {
      return `${err.message} ${FIREBASE_BACKEND_HINT}`;
    }
    return err.message;
  }

  if (isAxiosError(err)) {
    const body = err.response?.data as ApiResponse<unknown> | undefined;
    if (body?.message) {
      if (body.error?.code === "FIREBASE_NOT_CONFIGURED") {
        return `${body.message} ${FIREBASE_BACKEND_HINT}`;
      }
      return body.message;
    }
    if (err.code === "ECONNABORTED" || err.message.toLowerCase().includes("timeout")) {
      return "Request timed out. The challan service may be slow — please try again in a moment.";
    }
    if (err.message === "Network Error" && !err.response) {
      return (
        "Cannot reach the API server. This is usually a CORS issue: add your site URL to " +
        "CORS_ALLOWED_ORIGINS on Render (driveclear-api), then redeploy the backend. " +
        "API: https://driveclear-api.onrender.com/api/v1"
      );
    }
    if (err.message) return err.message;
  }

  if (err instanceof Error) return err.message;
  return "Request failed";
}
