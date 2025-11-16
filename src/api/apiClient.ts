import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import { apiRoutes } from "./apiRoutes";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "";

let isRefreshing = false;
let refreshPromise: Promise<string | null> | null = null;

const getAccessToken = () => {
  try {
    return localStorage.getItem("access_token");
  } catch (e) {
    return null;
  }
};

const setAccessToken = (token: string | null) => {
  try {
    if (token) localStorage.setItem("access_token", token);
    else localStorage.removeItem("access_token");
  } catch (e) {
    // Handle localStorage errors silently
    console.error("Failed to set access token:", e);
  }
};

const getRefreshToken = () => {
  try {
    return localStorage.getItem("refresh_token");
  } catch (e) {
    return null;
  }
};

const setRefreshToken = (token: string | null) => {
  try {
    if (token) localStorage.setItem("refresh_token", token);
    else localStorage.removeItem("refresh_token");
  } catch (e) {
    console.error("Failed to set refresh token:", e);
  }
};

const axiosInstance: AxiosInstance = axios.create({
  baseURL: API_BASE,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// Request interceptor to attach access token
axiosInstance.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    const token = getAccessToken();
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
  refreshPromise = new Promise(async (resolve) => {
    try {
      const refreshToken = getRefreshToken();
      if (!refreshToken) {
        setAccessToken(null);
        setRefreshToken(null);
        resolve(null);
        isRefreshing = false;
        refreshPromise = null;
        return;
      }

      const resp = await axios.post(apiRoutes.auth.refreshToken, {
        refreshToken,
      });

      const data = resp?.data;
      const newAccess = data?.accessToken ?? null;
      const newRefresh = data?.refreshToken ?? null;

      if (newAccess) setAccessToken(newAccess);
      if (newRefresh) setRefreshToken(newRefresh);

      resolve(newAccess);
    } catch (err) {
      setAccessToken(null);
      setRefreshToken(null);
      resolve(null);
    } finally {
      isRefreshing = false;
      refreshPromise = null;
    }
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
  get: <T = any>(url: string, config?: AxiosRequestConfig) =>
    axiosInstance.get<T>(url, config),
  post: <T = any>(url: string, data?: any, config?: AxiosRequestConfig) =>
    axiosInstance.post<T>(url, data, config),
  put: <T = any>(url: string, data?: any, config?: AxiosRequestConfig) =>
    axiosInstance.put<T>(url, data, config),
  delete: <T = any>(url: string, config?: AxiosRequestConfig) =>
    axiosInstance.delete<T>(url, config),
  setAccessToken,
  setRefreshToken,
  getAccessToken,
  getRefreshToken,
};

export default apiClient;
