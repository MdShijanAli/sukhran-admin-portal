import { createApiService, ApiService } from "./createApiService";
import { apiRoutes } from "@/api/apiRoutes";
import { useCoinStore } from "@/stores/coinStore";
import apiClient from "@/api/apiClient";
import {
  CoinTransaction,
  UserCoinDetails,
  CoinStatisticsResponse,
  SendCoinPayload,
} from "@/lib/types";

// Create base API service with all CRUD operations
const apiService = createApiService<CoinTransaction>(
  apiRoutes.coins,
  useCoinStore.getState(),
);

interface CoinService extends ApiService<CoinTransaction> {
  fetchStatistics: () => Promise<CoinStatisticsResponse>;
  fetchUserCoinDetails: (
    userId: number | string,
    params?: string,
  ) => Promise<UserCoinDetails>;
  sendCoin: (payload: SendCoinPayload) => Promise<unknown>;
}

const coinService: CoinService = {
  ...apiService,

  // Fetch coin statistics
  fetchStatistics: async (): Promise<CoinStatisticsResponse> => {
    try {
      const response = await apiClient.get(apiRoutes.coins.getStatistics);
      console.log("Coin statistics response:", response.data);

      if (response && response.status === 200) {
        const data = response.data.data || response.data;
        useCoinStore.getState().setStatistics(data);
        return data;
      }
      throw new Error("Failed to fetch coin statistics");
    } catch (error) {
      console.error("Error fetching coin statistics:", error);
      useCoinStore.getState().setError("Failed to fetch coin statistics");
      throw error;
    }
  },

  // Fetch user coin details with transactions
  fetchUserCoinDetails: async (
    userId: number | string,
    params?: string,
  ): Promise<UserCoinDetails> => {
    try {
      const url = params
        ? `${apiRoutes.coins.getById(userId)}?${params}`
        : apiRoutes.coins.getById(userId);

      const response = await apiClient.get(url);
      console.log("User coin details response:", response.data);

      if (response && response.status === 200) {
        const data = response.data.data || response.data;
        useCoinStore.getState().setUserCoinDetails(data);
        return data;
      }
      throw new Error("Failed to fetch user coin details");
    } catch (error) {
      console.error("Error fetching user coin details:", error);
      useCoinStore.getState().setError("Failed to fetch user coin details");
      throw error;
    }
  },

  // Send coins to a user
  sendCoin: async (payload: SendCoinPayload): Promise<unknown> => {
    try {
      const response = await apiClient.post(apiRoutes.coins.sendCoin, payload);
      console.log("Send coin response:", response.data);

      if (response && response.status === 200) {
        // Refresh statistics after sending coins
        await coinService.fetchStatistics();
        return response.data;
      }
      throw new Error("Failed to send coins");
    } catch (error) {
      console.error("Error sending coins:", error);
      throw error;
    }
  },
};

export default coinService;
