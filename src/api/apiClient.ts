import axios, {
  AxiosInstance,
  InternalAxiosRequestConfig,
  AxiosResponse,
  AxiosRequestConfig,
} from "axios";
import { apiRoutes } from "./apiRoutes";
import { useAuthStore } from "@/stores/authStore";
import { toast } from "sonner";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "";

let isRefreshing = false;
let refreshPromise: Promise<string | null> | null = null;

const axiosInstance: AxiosInstance = axios.create({
  baseURL: API_BASE,
  withCredentials: true,
});

// Request interceptor to attach access token
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = useAuthStore.getState().access_token;
    if (token && config && config.headers) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Helper to refresh token once and queue requests
async function refreshAccessToken(): Promise<string | null> {
  if (isRefreshing && refreshPromise) return refreshPromise;
  isRefreshing = true;
  refreshPromise = new Promise((resolve) => {
    (async () => {
      try {
        const refreshToken = useAuthStore.getState().refresh_token;
        if (!refreshToken) {
          useAuthStore.getState().setState({
            user: null,
            isAuthenticated: false,
            access_token: null,
            refresh_token: null,
          });
          resolve(null);
          isRefreshing = false;
          refreshPromise = null;
          return;
        }

        const resp = await axios.post(apiRoutes.auth.refreshToken, {
          refresh_token: refreshToken,
        });

        const data = resp?.data;
        console.log("Response data from refresh token:", data);
        const newAccess = data?.access_token ?? null;
        const newRefresh = data?.refresh_token ?? null;

        if (newAccess || newRefresh) {
          useAuthStore.getState().setState({
            access_token: newAccess,
            refresh_token: newRefresh,
          });
        }

        resolve(newAccess);
      } catch (err) {
        useAuthStore.getState().setState({
          user: null,
          isAuthenticated: false,
          access_token: null,
          refresh_token: null,
        });
        resolve(null);
      } finally {
        isRefreshing = false;
        refreshPromise = null;
      }
    })();
  });

  return refreshPromise;
}

// Response interceptor to handle 401 and try refresh
axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error) => {
    const originalRequest = error?.config;
    if (!originalRequest) return Promise.reject(error);

    // If unauthorized, try to refresh token once
    console.log("Response error status:", error);
    console.log("Response error status:", error);
    toast.error(
      error?.response?.data?.error_message ||
        error?.response?.data?.message ||
        error.message ||
        "An error occurred."
    );
    if (error?.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const newAccess = await refreshAccessToken();
      if (newAccess) {
        originalRequest.headers["Authorization"] = `Bearer ${newAccess}`;
        return axiosInstance(originalRequest);
      }
      // No token -> reject with original error
    }

    return Promise.reject(error);
  }
);

// Simple helpers
const apiClient = {
  instance: axiosInstance,
  get: <T = unknown>(url: string, config?: AxiosRequestConfig) =>
    axiosInstance.get<T>(url, config),
  post: <T = unknown>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig
  ) => axiosInstance.post<T>(url, data, config),
  put: <T = unknown>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig
  ) => axiosInstance.put<T>(url, data, config),
  delete: <T = unknown>(url: string, config?: AxiosRequestConfig) =>
    axiosInstance.delete<T>(url, config),
};

export default apiClient;
