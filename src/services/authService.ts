import apiClient from "@/api/apiClient";
import { apiRoutes } from "@/api/apiRoutes";
import { User } from "@/lib/types";
import { useAuthStore } from "@/stores/authStore";

interface LoginResponse {
  access_token: string;
  refresh_token?: string;
  user: User;
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

  logout: async () => {
    try {
      // Best-effort server logout
      await apiClient.post(apiRoutes.auth.logout);
    } catch (e) {
      console.error("Logout error:", e);
      return e;
    }

    // Clear tokens and local state
    apiClient.setAccessToken(null);
    apiClient.setRefreshToken(null);
    useAuthStore.setState({ user: null, isAuthenticated: false });
  },
};

export default authService;
