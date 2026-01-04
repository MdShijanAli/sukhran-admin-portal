import { Transaction, TransactionPaginationMeta } from "@/lib/types";
import { createStore } from "./createStore";

export interface TransactionStats {
  total_transactions: number;
  total_amount: string;
  successful: number;
  failed: number;
  refunded: number;
  by_gateway: {
    sslcommerz: number;
    cod: number;
  };
  today: {
    transactions: number;
    amount: number;
  };
  this_month: {
    transactions: number;
    amount: string;
  };
}

interface TransactionState {
  transactions: Transaction[];
  stats: TransactionStats;
  pagination: TransactionPaginationMeta;
  isLoading: boolean;
  error: string | null;
  setItems: (transactions: unknown) => void;
  updateItem: (id: number | string, data: unknown) => void;
  getTransactionById: (id: number | string) => Transaction | undefined;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setPagination: (pagination: TransactionPaginationMeta) => void;
}

export const useTransactionStore = createStore<TransactionState>(
  (set, get) => ({
    transactions: [],
    stats: {
      total_transactions: 0,
      total_amount: "0",
      successful: 0,
      failed: 0,
      refunded: 0,
      by_gateway: {
        sslcommerz: 0,
        cod: 0,
      },
      today: {
        transactions: 0,
        amount: 0,
      },
      this_month: {
        transactions: 0,
        amount: "0",
      },
    },
    pagination: {
      current_page: 1,
      total: 0,
      per_page: 20,
      last_page: 1,
      from: 1,
      to: 1,
    },
    isLoading: false,
    error: null,

    setPagination: (pagination: TransactionPaginationMeta) => {
      set({
        pagination: {
          ...get().pagination,
          ...pagination,
        },
      });
    },

    setItems: (data: unknown) => {
      const transactions = Array.isArray(data)
        ? data
        : (data as { data?: Transaction[] })?.data || [];

      set({
        transactions,
        stats: (data as { stats: TransactionStats })?.stats || get().stats,
        isLoading: false,
        error: null,
        pagination:
          (data as { meta: TransactionPaginationMeta })?.meta ||
          get().pagination,
      });
    },

    updateItem: (id: number | string, data: unknown) => {
      const transaction =
        (data as { data?: Partial<Transaction> })?.data || data;
      set((state) => ({
        transactions: state.transactions.map((r) =>
          r.id === id ? { ...r, ...(transaction as Partial<Transaction>) } : r
        ),
        isLoading: false,
        error: null,
      }));
    },

    getTransactionById: (id: number | string) => {
      return get().transactions.find((t) => t.id === id);
    },

    setLoading: (loading: boolean) => {
      set({ isLoading: loading });
    },

    setError: (error: string | null) => {
      set({ error, isLoading: false });
    },
  }),
  "transaction-storage"
);
