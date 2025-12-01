import apiClient from "@/api/apiClient";
import { apiRoutes } from "@/api/apiRoutes";

interface SubscriptionSettingResponse {
  success: boolean;
  data: Array<{
    id: number;
    key: string;
    value: string[] | Record<string, string> | number;
    description: string;
    created_at: string;
    updated_at: string;
  }>;
}

interface Setting {
  key: string;
  value: string | number | boolean;
  type: "string" | "float" | "boolean" | "integer";
  description: string;
}

interface SettingsGroup {
  group: string;
  settings: Setting[];
}

interface GeneralSettingsResponse {
  success: boolean;
  data: SettingsGroup[];
}

const settingsService = {
  // Get subscription settings
  getSubscriptionSettings: async (): Promise<SubscriptionSettingResponse> => {
    try {
      const response = await apiClient.get<SubscriptionSettingResponse>(
        apiRoutes.settings.subscriptionSettings
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching subscription settings:", error);
      throw error;
    }
  },

  // Update delivery frequencies
  updateDeliveryFrequencies: async (frequencies: string[]) => {
    try {
      const response = await apiClient.put(
        apiRoutes.settings.updateDeliveryFrequencies,
        { value: frequencies }
      );
      return response.data;
    } catch (error) {
      console.error("Error updating delivery frequencies:", error);
      throw error;
    }
  },

  // Update preferred delivery dates
  updatePreferredDeliveryDates: async (dates: Record<string, string>) => {
    try {
      const response = await apiClient.put(
        apiRoutes.settings.updatePreferredDeliveryDates,
        { value: dates }
      );
      return response.data;
    } catch (error) {
      console.error("Error updating preferred delivery dates:", error);
      throw error;
    }
  },

  // Get general settings
  getGeneralSettings: async (): Promise<GeneralSettingsResponse> => {
    try {
      const response = await apiClient.get<GeneralSettingsResponse>(
        apiRoutes.settings.generalSettings
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching general settings:", error);
      throw error;
    }
  },

  // Update individual setting
  updateSetting: async (key: string, value: string | number | boolean) => {
    try {
      const response = await apiClient.put(
        apiRoutes.settings.updateSetting(key),
        { value: String(value) }
      );
      return response.data;
    } catch (error) {
      console.error(`Error updating setting ${key}:`, error);
      throw error;
    }
  },
};

export default settingsService;
