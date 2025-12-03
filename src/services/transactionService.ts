import { createApiService, ApiService } from "./createApiService";
import { apiRoutes } from "@/api/apiRoutes";
import { useTransactionStore } from "@/stores/transactionStore";
import { Transaction } from "@/lib/types";
import apiClient from "@/api/apiClient";

// Create base API service with all CRUD operations
const apiService = createApiService<Transaction>(
  apiRoutes.transactions,
  useTransactionStore.getState()
);

interface TransactionService extends ApiService<Transaction> {
  getStatistics: () => Promise<unknown>;
}

const transactionService: TransactionService = {
  // Inherit all basic CRUD operations
  ...apiService,

  // Add extra custom API methods here
  getStatistics: async () => {
    try {
      const response = await apiClient.get(
        apiRoutes.transactions.getStatistics
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching transaction statistics:", error);
      throw error;
    }
  },
};

export default transactionService;
