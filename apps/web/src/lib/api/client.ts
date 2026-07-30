import { useAuthStore } from "@/stores/authStore";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

type ApiErrorDetails = Record<string, string[]>;

export class ApiError extends Error {
  status: number;
  code: string;
  details?: ApiErrorDetails;

  constructor(
    status: number,
    code: string,
    message: string,
    details?: ApiErrorDetails,
  ) {
    super(message);
    this.status = status;
    this.code = code;
    this.details = details;
    Object.setPrototypeOf(this, ApiError.prototype);
  }
}

interface RequestOptions extends RequestInit {
  params?: Record<string, string>;
}
interface BackendErrorBody {
  success: boolean;
  code: string;
  message: string;
  details?: ApiErrorDetails;
}

let refreshPromise: Promise<boolean> | null = null;

async function refreshAccessToken(): Promise<boolean> {
  if (!refreshPromise) {
    refreshPromise = (async () => {
      const { refreshToken, user, setAuth, clearAuth } =
        useAuthStore.getState();
      if (!refreshToken) return false;

      try {
        const response = await fetch(`${BASE_URL}/api/auth/refresh`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ refreshToken }),
        });

        if (!response.ok) {
          clearAuth();
          return false;
        }
        const data = await response.json();
        setAuth({
          accessToken: data.accessToken,
          refreshToken: data.refreshToken,
          user: user!,
        });
        return true;
      } catch {
        clearAuth();
        return false;
      } finally {
        refreshPromise = null;
      }
    })();
  }
  return refreshPromise;
}

async function parseErrorBody(response: Response): Promise<BackendErrorBody> {
  try {
    const body = await response.json();
    return {
      success: false,
      code: body.code ?? "UNKNOWN_ERROR",
      message: body.message ?? response.statusText,
      details: body.details,
    };
  } catch {
    return {
      success: false,
      code: "UNKNOWN_ERROR",
      message: response.statusText,
    };
  }
}

async function request<T>(
  path: string,
  options: RequestOptions = {},
  isRetry = false,
): Promise<T> {
  const { params, headers, ...rest } = options;

  const url = new URL(`${BASE_URL}${path}`);

  if (params) {
    Object.entries(params).forEach(([key, value]) =>
      url.searchParams.set(key, value),
    );
  }

  const isFormData = rest.body instanceof FormData;
  const token = useAuthStore.getState().accessToken;

  const response = await fetch(url.toString(), {
    ...rest,
    headers: {
      ...(isFormData ? {} : { "Content-Type": "application/json" }),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
  });

  const bypassRefreshPaths = ["/api/auth/login", "/api/auth/refresh"];

  if (
    response.status === 401 &&
    !isRetry &&
    !bypassRefreshPaths.includes(path)
  ) {
    const refreshed = await refreshAccessToken();
    if (refreshed) {
      return request<T>(path, options, true);
    }

    useAuthStore.getState().clearAuth();
    throw new ApiError(401, "SESION_EXPIRED", "Session expired");
  }

  if (!response.ok) {
    const body = await parseErrorBody(response);
    throw new ApiError(response.status, body.code, body.message, body.details);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json();
}

export const apiClient = {
  post: <T>(path: string, body?: unknown, options?: RequestOptions) =>
    request<T>(path, {
      ...options,
      method: "POST",
      body: body ? JSON.stringify(body) : undefined,
    }),
  get: <T>(path: string, options?: RequestOptions) =>
    request<T>(path, { ...options, method: "GET" }),
  patch: <T>(path: string, body?: unknown, options?: RequestOptions) =>
    request<T>(path, {
      ...options,
      method: "PATCH",
      body: body ? JSON.stringify(body) : undefined,
    }),
  delete: <T>(path: string, options?: RequestOptions) =>
    request<T>(path, { ...options, method: "DELETE" }),
  postForm: <T>(path: string, formData: FormData, options?: RequestOptions) =>
    request<T>(path, {
      ...options,
      method: "POST",
      body: formData,
    }),
};
