import { createApiService, ApiService } from "./createApiService";
import { apiRoutes } from "@/api/apiRoutes";
import { useReferralStore } from "@/stores/referralStore";
import apiClient from "@/api/apiClient";
import { Referral, ReferralSettings } from "@/lib/types";

// Create base API service with all CRUD operations
const apiService = createApiService<Referral>(
  apiRoutes.referrals,
  useReferralStore.getState()
);

interface ReferralService extends ApiService<Referral> {
  getStatistics: () => Promise<unknown>;
  getSettings: () => Promise<unknown>;
  updateSettings: (data: Partial<ReferralSettings>) => Promise<unknown>;
  getUserReferrals: (
    userId: number | string,
    params?: string
  ) => Promise<unknown>;
}

const referralService: ReferralService = {
  // Inherit all basic CRUD operations
  ...apiService,

  // Get referral statistics
  getStatistics: async () => {
    try {
      const response = await apiClient.get(apiRoutes.referrals.statistics);
      if (response && response.status === 200) {
        useReferralStore.getState().setStatistics(response.data.data);
      }
      return response.data;
    } catch (error) {
      console.error("Error fetching referral statistics:", error);
      throw error;
    }
  },

  // Get referral settings
  getSettings: async () => {
    try {
      const response = await apiClient.get(apiRoutes.referrals.settings);
      if (response && response.status === 200) {
        useReferralStore.getState().setSettings(response.data.data);
      }
      return response.data;
    } catch (error) {
      console.error("Error fetching referral settings:", error);
      throw error;
    }
  },

  // Update referral settings
  updateSettings: async (data: Partial<ReferralSettings>) => {
    try {
      const response = await apiClient.put(
        apiRoutes.referrals.updateSettings,
        data
      );
      if (response && response.status === 200) {
        useReferralStore.getState().setSettings(response.data.data);
      }
      return response.data;
    } catch (error) {
      console.error("Error updating referral settings:", error);
      throw error;
    }
  },

  // Get user referrals
  getUserReferrals: async (userId: number | string, params?: string) => {
    try {
      const url = params
        ? `${apiRoutes.referrals.usersReferrals(userId)}?${params}`
        : apiRoutes.referrals.usersReferrals(userId);

      const response = await apiClient.get(url);
      if (response && response.status === 200) {
        useReferralStore.getState().setUserReferrals(response.data);
      }
      return response.data;
    } catch (error) {
      console.error("Error fetching user referrals:", error);
      throw error;
    }
  },
};

export default referralService;
