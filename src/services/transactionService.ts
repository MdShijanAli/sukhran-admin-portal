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
  refundTransaction: (
    id: number | string,
    data: { amount: number; reason: string } | FormData
  ) => Promise<unknown>;
  refundCODTransaction: (
    id: number | string,
    data:
      | {
          refund_amount: number;
          refund_reason: string;
          refund_notes: string;
          refund_proof: string;
        }
      | FormData
  ) => Promise<unknown>;
}

const transactionService: TransactionService = {
  // Inherit all basic CRUD operations
  ...apiService,

  refundTransaction: async (
    id: number | string,
    data: { amount: number; reason: string } | FormData
  ) => {
    try {
      const isFormData = data instanceof FormData;
      const response = await apiClient.post(
        apiRoutes.transactions.refundTransaction(id),
        data,
        isFormData
          ? {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            }
          : undefined
      );
      if (response && response.status === 200) {
        const responseData = response.data as { transaction: Transaction };
        useTransactionStore.getState().updateItem(id, responseData.transaction);
        return responseData.transaction;
      }
      return response.data;
    } catch (error) {
      console.error("Error processing refund:", error);
      throw error;
    }
  },

  refundCODTransaction: async (
    id: number | string,
    data:
      | {
          refund_amount: number;
          refund_reason: string;
          refund_notes: string;
          refund_proof: string;
        }
      | FormData
  ) => {
    try {
      const isFormData = data instanceof FormData;
      const response = await apiClient.post(
        apiRoutes.transactions.refundCODTransaction(id),
        data,
        isFormData
          ? {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            }
          : undefined
      );
      if (response && response.status === 200) {
        const responseData = response.data as { transaction: Transaction };
        useTransactionStore.getState().updateItem(id, responseData.transaction);
        return responseData.transaction;
      }
      return response.data;
    } catch (error) {
      console.error("Error processing refund:", error);
      throw error;
    }
  },
};

export default transactionService;
