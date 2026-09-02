const API_BASE = '/api';
const DEFAULT_TIMEOUT_MS = 30_000;

class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
    this.name = 'ApiError';
  }
}

const pendingRequests = new Map<string, Promise<any>>();
let refreshPromise: Promise<string | null> | null = null;

async function attemptTokenRefresh(): Promise<string | null> {
  if (!refreshPromise) {
    refreshPromise = (async () => {
      const refreshToken = localStorage.getItem('kt_refresh_token');
      if (!refreshToken) return null;
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), DEFAULT_TIMEOUT_MS);
        const res = await fetch(`${API_BASE}/auth/refresh-token`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ refreshToken }),
          signal: controller.signal,
        });
        clearTimeout(timeoutId);
        if (!res.ok) return null;
        const data = await res.json();
        if (data.success && data.accessToken) {
          localStorage.setItem('kt_session_token', data.accessToken);
          try {
            const { useAuthStore } = await import('../stores/authStore');
            useAuthStore.getState().setToken(data.accessToken);
          } catch { /* non-critical */ }
          return data.accessToken;
        }
        return null;
      } catch {
        return null;
      } finally {
        refreshPromise = null;
      }
    })();
  }
  return refreshPromise;
}

function handleSessionExpired(): never {
  localStorage.removeItem('kt_session_token');
  localStorage.removeItem('kt_refresh_token');
  localStorage.removeItem('kt_logged_in_user');
  if (typeof window !== 'undefined' && window.location.pathname !== '/' && window.location.pathname !== '/login') {
    window.location.href = '/';
  }
  throw new ApiError('Session expired', 401);
}

async function request<T>(endpoint: string, options?: RequestInit, isRetry = false): Promise<T> {
  const method = options?.method || 'GET';
  const cacheKey = method === 'GET' ? `${method}:${endpoint}` : null;

  // Deduplicate concurrent GET requests
  if (cacheKey && pendingRequests.has(cacheKey) && !isRetry) {
    return pendingRequests.get(cacheKey)!;
  }

  const promise = (async () => {
    const token = localStorage.getItem('kt_session_token');
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), DEFAULT_TIMEOUT_MS);

    try {
      const response = await fetch(`${API_BASE}${endpoint}`, {
        ...options,
        headers: { ...headers, ...(options?.headers as Record<string, string> || {}) },
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      if (response.status === 401) {
        const isAuthEndpoint = endpoint.includes('/auth/login') || endpoint.includes('/auth/refresh-token') || endpoint.includes('/auth/signup');
        if (!isRetry && !isAuthEndpoint) {
          const newToken = await attemptTokenRefresh();
          if (newToken) {
            return request<T>(endpoint, options, true);
          }
        }
        handleSessionExpired();
      }

      if (!response.ok) {
        const err = await response.json().catch(() => ({ error: 'Request failed' }));
        throw new ApiError(err.error || 'Request failed', response.status);
      }

      return response.json();
    } catch (err: any) {
      clearTimeout(timeoutId);
      if (err.name === 'AbortError') {
        throw new ApiError('Request timed out', 408);
      }
      throw err;
    }
  })();

  if (cacheKey && !isRetry) {
    pendingRequests.set(cacheKey, promise);
    promise.finally(() => pendingRequests.delete(cacheKey));
  }

  return promise;
}

export const api = {
  get: <T>(url: string) => request<T>(url),
  post: <T>(url: string, body: unknown) =>
    request<T>(url, { method: 'POST', body: JSON.stringify(body) }),
  put: <T>(url: string, body: unknown) =>
    request<T>(url, { method: 'PUT', body: JSON.stringify(body) }),
  del: <T>(url: string) =>
    request<T>(url, { method: 'DELETE' }),
};

export { ApiError };
