import {
  CoinTransaction,
  CoinStatisticsResponse,
  UserCoinDetails,
  PaginationMeta,
} from "@/lib/types";
import { createStore } from "./createStore";

interface CoinState {
  transactions: CoinTransaction[];
  statistics: CoinStatisticsResponse | null;
  userCoinDetails: UserCoinDetails | null;
  pagination: PaginationMeta;
  isLoading: boolean;
  error: string | null;

  // Actions
  setTransactions: (transactions: CoinTransaction[]) => void;
  setStatistics: (statistics: CoinStatisticsResponse) => void;
  setUserCoinDetails: (details: UserCoinDetails) => void;
  setPagination: (pagination: PaginationMeta) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
}

export const useCoinStore = createStore<CoinState>(
  (set) => ({
    transactions: [],
    statistics: null,
    userCoinDetails: null,
    pagination: {
      current_page: 1,
      total: 0,
      per_page: 20,
      last_page: 1,
      from: 0,
      to: 0,
    },
    isLoading: false,
    error: null,

    setTransactions: (transactions) => set({ transactions }),

    setStatistics: (statistics) => set({ statistics }),

    setUserCoinDetails: (details) => set({ userCoinDetails: details }),

    setPagination: (pagination) => set({ pagination }),

    setLoading: (isLoading) => set({ isLoading }),

    setError: (error) => set({ error }),

    clearError: () => set({ error: null }),
  }),
  {
    name: "coin-store",
  }
);
