import apiClient from "@/api/apiClient";
import { apiRoutes } from "@/api/apiRoutes";
import { useAuthStore, User } from "@/stores/authStore";

interface LoginResponse {
  accessToken: string;
  refreshToken?: string;
  user: User;
}

const authService = {
  login: async (email: string, password: string): Promise<User | null> => {
    try {
      const resp = await apiClient.post<LoginResponse>(apiRoutes.auth.login, {
        email,
        password,
      });
      const data = resp?.data;
      if (!data) return null;

      const { accessToken, refreshToken, user } = data;

      if (accessToken) apiClient.setAccessToken(accessToken);
      if (refreshToken) apiClient.setRefreshToken(refreshToken);

      // Update store
      useAuthStore.setState({ user, isAuthenticated: true });

      return user;
    } catch (err) {
      // Propagate error to caller
      return null;
    }
  },

  logout: async () => {
    try {
      // Best-effort server logout
      await apiClient.post(apiRoutes.auth.logout);
    } catch (e) {
      // ignore
    }

    // Clear tokens and local state
    apiClient.setAccessToken(null);
    apiClient.setRefreshToken(null);
    useAuthStore.setState({ user: null, isAuthenticated: false });
  },
};

export default authService;
