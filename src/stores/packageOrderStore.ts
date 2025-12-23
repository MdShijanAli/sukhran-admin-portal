import { PaginationMeta, PackageOrderBatch } from "@/lib/types";
import { createStore } from "./createStore";

interface PackageOrderState {
  packageOrders: PackageOrderBatch[];
  pagination: PaginationMeta;
  isLoading: boolean;
  error: string | null;
  setItems: (data: unknown) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  getPackageOrderByBatchId: (batchId: string) => PackageOrderBatch | undefined;
}

export const usePackageOrderStore = createStore<PackageOrderState>(
  (set, get) => ({
    packageOrders: [],
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

    setItems: (data: unknown) => {
      const packageOrders = Array.isArray(data)
        ? data
        : (data as { data?: PackageOrderBatch[] })?.data || [];
      set({
        packageOrders,
        isLoading: false,
        error: null,
        pagination:
          (data as { pagination: PaginationMeta })?.pagination ||
          get().pagination,
      });
    },

    setLoading: (loading: boolean) => {
      set({ isLoading: loading });
    },

    setError: (error: string | null) => {
      set({ error, isLoading: false });
    },

    getPackageOrderByBatchId: (batchId: string) => {
      return get().packageOrders.find((po) => po.batch_id === batchId);
    },
  }),
  "package-order-storage"
);
