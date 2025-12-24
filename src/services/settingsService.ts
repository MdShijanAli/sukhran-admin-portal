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

interface LegalDocument {
  id: number;
  type: "privacy_policy" | "terms_and_conditions";
  type_label: string;
  title: string;
  content: string;
  version: string;
  is_active: boolean;
  effective_date?: string;
  created_by: {
    id: number;
    name: string;
  };
  updated_by?: {
    id: number;
    name: string;
  } | null;
  created_at: string;
  updated_at: string;
}

interface LegalDocumentResponse {
  success: boolean;
  data: LegalDocument[];
  meta?: {
    current_page: number;
    total: number;
    per_page: number;
    last_page: number;
  };
}

interface CreateLegalDocumentPayload {
  type: "privacy_policy" | "terms_and_conditions";
  title: string;
  content: string;
  version?: string;
  is_active?: boolean;
  effective_date?: string;
}

interface UpdateLegalDocumentPayload {
  title: string;
  content: string;
  version?: string;
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

  // Get legal document by type
  getLegalDocumentByType: async (
    type: "privacy_policy" | "terms_and_conditions"
  ): Promise<LegalDocumentResponse> => {
    try {
      const response = await apiClient.get<LegalDocumentResponse>(
        apiRoutes.documents.getLegalDocumentByType(type)
      );
      return response.data;
    } catch (error) {
      console.error(`Error fetching legal document ${type}:`, error);
      throw error;
    }
  },

  // Create legal document
  createLegalDocument: async (payload: CreateLegalDocumentPayload) => {
    try {
      const response = await apiClient.post(
        apiRoutes.documents.legalDocuments,
        payload
      );
      return response.data;
    } catch (error) {
      console.error("Error creating legal document:", error);
      throw error;
    }
  },

  // Update legal document
  updateLegalDocument: async (
    id: number,
    payload: UpdateLegalDocumentPayload
  ) => {
    try {
      const response = await apiClient.put(
        apiRoutes.documents.updateLegalDocument(id),
        payload
      );
      return response.data;
    } catch (error) {
      console.error("Error updating legal document:", error);
      throw error;
    }
  },
};

export default settingsService;
export type {
  LegalDocument,
  CreateLegalDocumentPayload,
  UpdateLegalDocumentPayload,
};
