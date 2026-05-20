export interface ApiError {
  code: string;
  details: string | Record<string, unknown>;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T | null;
  meta: Record<string, unknown>;
  error: ApiError | null;
}

export class ApiClientError extends Error {
  constructor(
    public code: string,
    message: string,
    public details?: unknown,
  ) {
    super(message);
    this.name = "ApiClientError";
  }
}
