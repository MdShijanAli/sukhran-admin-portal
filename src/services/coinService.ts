import { createApiService, ApiService } from "./createApiService";
import { apiRoutes } from "@/api/apiRoutes";
import { useCoinStore } from "@/stores/coinStore";
import { useCoinUserStore } from "@/stores/coinUserStore";
import apiClient from "@/api/apiClient";
import {
  CoinTransaction,
  UserCoinDetails,
  CoinStatisticsResponse,
  SendCoinPayload,
  CoinUser,
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
  fetchAllUsersCoins: (params?: string) => Promise<unknown>;
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

  // Fetch all users' coins with optional query parameters
  fetchAllUsersCoins: async (params?: string) => {
    try {
      const url = params
        ? `${apiRoutes.coins.getAllUsersCoins}?${params}`
        : apiRoutes.coins.getAllUsersCoins;
      const response = await apiClient.get(url);
      console.log("All users' coins response:", response.data);
      if (response && response.status === 200) {
        useCoinUserStore.getState().setItems(response.data);
        return response.data;
      }
      throw new Error("Failed to fetch all users' coins");
    } catch (error) {
      console.error("Error fetching all users' coins:", error);
      useCoinUserStore.getState().setError("Failed to fetch all users' coins");
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
      useCoinStore.getState().setError("Failed to send coins");
      throw error;
    }
  },
};

export default coinService;
