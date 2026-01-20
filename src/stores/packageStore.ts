import { PaginationMeta } from "@/lib/types";
import { createStore } from "./createStore";
import { Package } from "@/lib/types";

interface PackageState {
  packages: Package[];
  pagination: PaginationMeta;
  isLoading: boolean;
  error: string | null;
  setItems: (packages: unknown) => void;
  addItem: (pkg: unknown) => void;
  updateItem: (id: number | string, pkg: unknown) => void;
  removeItem: (id: number | string) => void;
  getPackageById: (id: number | string) => Package | undefined;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setPagination: (pagination: PaginationMeta) => void;
}

export const usePackageStore = createStore<PackageState>(
  (set, get) => ({
    packages: [],
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

    setPagination: (pagination: PaginationMeta) => {
      set({
        pagination: {
          ...get().pagination,
          ...pagination,
        },
      });
    },

    setItems: (data: unknown) => {
      // Handle both array and object responses
      const packages = Array.isArray(data)
        ? data
        : (data as { data?: Package[] })?.data || [];
      set({
        packages,
        isLoading: false,
        error: null,
        pagination:
          (data as { meta: PaginationMeta })?.meta || get().pagination,
      });
    },

    addItem: (data: unknown) => {
      const pkg = (data as { data?: Package })?.data || data;
      set((state) => ({
        packages: [pkg as Package, ...state.packages],
        isLoading: false,
        error: null,
      }));
    },

    updateItem: (id: number | string, data: unknown) => {
      console.log("Updating package with ID:", id, "and data:", data);
      const pkg = (data as { data?: Partial<Package> })?.data || data;
      console.log("Parsed package data:", pkg);
      set((state) => ({
        packages: state.packages.map((p) => {
          console.log("Checking package with ID:", p.id);
          console.log("Comparing with ID:", id);
          // Convert both to numbers for comparison
          if (Number(p.id) === Number(id)) {
            console.log("Found matching package:", p);
            return { ...p, ...(pkg as Partial<Package>) };
          }
          return p;
        }),
        isLoading: false,
        error: null,
      }));
    },

    removeItem: (id: number | string) => {
      set((state) => ({
        packages: state.packages.filter((p) => p.id !== id),
        isLoading: false,
        error: null,
      }));
    },

    getPackageById: (id: number | string) => {
      return get().packages.find((p) => p.id === id);
    },

    setLoading: (loading: boolean) => {
      set({ isLoading: loading });
    },

    setError: (error: string | null) => {
      set({ error, isLoading: false });
    },
  }),
  "package-storage",
);
