import { CoinUser, PaginationMeta } from "@/lib/types";
import { createStore } from "./createStore";

interface CoinUserState {
  items: CoinUser[];
  pagination: PaginationMeta;
  isLoading: boolean;
  error: string | null;

  // Actions
  setItems: (users: CoinUser[] | unknown) => void;
  setPagination: (pagination: PaginationMeta) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
}

export const useCoinUserStore = createStore<CoinUserState>(
  (set, get) => ({
    items: [],
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

    setPagination: (pagination: PaginationMeta) => {
      set({
        pagination: {
          ...get().pagination,
          ...pagination,
        },
      });
    },

    setItems: (users: unknown) => {
      console.log("Setting coin users in store:", users);
      const parsedUsers = Array.isArray(users)
        ? users
        : (users as { data?: CoinUser[] })?.data || [];
      console.log("Parsed coin users:", parsedUsers);
      set({
        items: parsedUsers,
        isLoading: false,
        error: null,
        pagination:
          (users as { pagination?: PaginationMeta })?.pagination ||
          get().pagination,
      });
    },

    setLoading: (isLoading: boolean) => set({ isLoading }),

    setError: (error: string | null) => set({ error }),

    clearError: () => set({ error: null }),
  }),
  "coin-user-store",
);
