import apiClient from "@/api/apiClient";
import { apiRoutes } from "@/api/apiRoutes";
import { ForgotPassword, User } from "@/lib/types";
import { useAuthStore } from "@/stores/authStore";

interface LoginResponse {
  access_token: string;
  refresh_token?: string;
  user: User;
}
interface FetchProfileResponse {
  success: boolean;
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
      if (!data) return null;

      const { access_token, refresh_token, user } = data;

      // Update store (single source of truth)
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

  fetchProfile: async () => {
    try {
      const resp = await apiClient.get<FetchProfileResponse>(
        apiRoutes.profile.getProfile
      );
      const user = resp?.data;

      // Update store with fetched user data
      useAuthStore.setState({
        user: user.user,
        isAuthenticated: true,
      });

      return resp;
    } catch (err) {
      console.error("Fetch Profile error:", err);
      return err;
    }
  },

  updateLogo: async (data) => {
    try {
      const resp = await apiClient.post(apiRoutes.profile.updateProfile, data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return resp.data;
    } catch (e) {
      console.error("Update Profile error:", e);
      throw e;
    }
  },

  logout: async (): Promise<LogoutResponse> => {
    try {
      // Best-effort server logout
      const result = await apiClient.post<LogoutResponse>(
        apiRoutes.auth.logout
      );

      // Clear auth store (single source of truth)
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

  forgotPasswordOtpSent: async (mobile: string) => {
    try {
      const resp = await apiClient.post(apiRoutes.auth.forgotPassword, {
        mobile,
      });
      return resp.data;
    } catch (e) {
      console.error("Forgot Password error:", e);
      throw e;
    }
  },

  resendOtp: async (mobile: string) => {
    try {
      const resp = await apiClient.post(apiRoutes.auth.resendOtp, {
        mobile,
      });
      return resp.data;
    } catch (e) {
      console.error("Resend OTP error:", e);
      throw e;
    }
  },

  forgotPassword: async (data: ForgotPassword) => {
    try {
      const resp = await apiClient.post(apiRoutes.auth.resetPassword, data);
      return resp.data;
    } catch (e) {
      console.error("Forgot Password error:", e);
      throw e;
    }
  },
};

export default authService;
