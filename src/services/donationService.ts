import { createApiService, ApiService } from "./createApiService";
import { apiRoutes } from "@/api/apiRoutes";
import { useDonationStore } from "@/stores/donationStore";
import apiClient from "@/api/apiClient";
import { Donation, FulfillCoinPayload } from "@/lib/types";

// Create base API service with all CRUD operations
const apiService = createApiService<Donation>(
  apiRoutes.donations,
  useDonationStore.getState()
);

interface DonationService extends ApiService<Donation> {
  getStatistics: () => Promise<unknown>;
  getCoinDonationReport: (params?: string) => Promise<unknown>;
  fulfillCoinDonation: (
    channelId: number | string,
    data: FulfillCoinPayload
  ) => Promise<unknown>;
  getFulfillmentHistory: (
    channelId: number | string,
    params?: string
  ) => Promise<unknown>;
}

const donationService: DonationService = {
  // Inherit all basic CRUD operations
  ...apiService,

  // Get donation statistics
  getStatistics: async () => {
    try {
      const response = await apiClient.get(apiRoutes.donations.statics);
      if (response && response.status === 200) {
        useDonationStore.getState().setStatistics(response.data.data);
      }
      return response.data;
    } catch (error) {
      console.error("Error fetching donation statistics:", error);
      throw error;
    }
  },

  // Get coin donation report
  getCoinDonationReport: async (params?: string) => {
    try {
      const url = params
        ? `${apiRoutes.donations.coinDonationReport}?${params}`
        : apiRoutes.donations.coinDonationReport;

      const response = await apiClient.get(url);
      if (response && response.status === 200) {
        useDonationStore.getState().setCoinReport(response.data.data);
      }
      return response.data;
    } catch (error) {
      console.error("Error fetching coin donation report:", error);
      throw error;
    }
  },

  // Fulfill coin donation
  fulfillCoinDonation: async (
    channelId: number | string,
    data: FulfillCoinPayload
  ) => {
    try {
      const formData = new FormData();
      formData.append("amount", data.amount.toString());
      formData.append("notes", data.notes);
      formData.append("proof_document", data.proof_document);

      const response = await apiClient.post(
        apiRoutes.donations.fulfilCoinDonation(channelId),
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error fulfilling coin donation:", error);
      throw error;
    }
  },

  // Get fulfillment history
  getFulfillmentHistory: async (
    channelId: number | string,
    params?: string
  ) => {
    try {
      const url = params
        ? `${apiRoutes.donations.getFulfillmentHistory(channelId)}?${params}`
        : apiRoutes.donations.getFulfillmentHistory(channelId);

      const response = await apiClient.get(url);
      if (response && response.status === 200) {
        useDonationStore.getState().setFulfillmentHistory(response.data);
      }
      return response.data;
    } catch (error) {
      console.error("Error fetching fulfillment history:", error);
      throw error;
    }
  },
};

export default donationService;
