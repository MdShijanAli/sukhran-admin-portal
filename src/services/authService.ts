import apiClient from "@/api/apiClient";
import { apiRoutes } from "@/api/apiRoutes";
import { User } from "@/lib/types";
import { useAuthStore } from "@/stores/authStore";

interface LoginResponse {
  access_token: string;
  refresh_token?: string;
  user: User;
}
interface LogoutResponse {
  success: boolean;
  message: string;
}

const authService = {
  login: async (email: string, password: string): Promise<User | null> => {
    try {
      const resp = await apiClient.post<LoginResponse>(apiRoutes.auth.login, {
        email_or_mobile: email,
        password,
      });
      const data = resp?.data;
      console.log("Login response data:", data);
      if (!data) return null;

      const { access_token, refresh_token, user } = data;

      if (access_token) apiClient.setAccessToken(access_token);
      if (refresh_token) apiClient.setRefreshToken(refresh_token);

      // Update store
      useAuthStore.setState({
        user,
        isAuthenticated: true,
        access_token,
        refresh_token,
      });

      return user;
    } catch (err) {
      console.error("Login error:", err);
      // Propagate error to caller
      return err;
    }
  },

  logout: async (): Promise<LogoutResponse> => {
    try {
      // Best-effort server logout
      const result = await apiClient.post<LogoutResponse>(
        apiRoutes.auth.logout
      );
      console.log("Logout response:", result);
      apiClient.setAccessToken(null);
      apiClient.setRefreshToken(null);
      useAuthStore.setState({
        user: null,
        isAuthenticated: false,
        access_token: null,
        refresh_token: null,
      });
      return result.data;
    } catch (e) {
      console.error("Logout error:", e);
      // Rethrow so callers can handle the failure consistently
      throw e;
    }
  },

  forgotPassword: async (mobile: string) => {
    try {
      const resp = await apiClient.post(apiRoutes.auth.forgotPassword, {
        mobile,
      });
      console.log("Forgot Password response:", resp.data);
      return resp.data;
    } catch (e) {
      console.error("Forgot Password error:", e);
      throw e;
    }
  },
};

export default authService;
