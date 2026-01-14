import { Brand, BrandPaginationMeta } from "@/lib/types";
import { createStore } from "./createStore";

interface BrandState {
  brands: Brand[];
  pagination: BrandPaginationMeta;
  isLoading: boolean;
  error: string | null;
  setItems: (brands: unknown) => void;
  addItem: (brand: unknown) => void;
  updateItem: (id: number | string, brand: unknown) => void;
  removeItem: (id: number | string) => void;
  getBrandById: (id: number | string) => Brand | undefined;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setStats: (brand: Brand) => void;
  setPagination: (pagination: BrandPaginationMeta) => void;
}

export const useBrandStore = createStore<BrandState>(
  (set, get) => ({
    brands: [],
    pagination: {
      current_page: 1,
      total: 0,
      per_page: 15,
      last_page: 1,
      from: 1,
      to: 1,
      stats: {
        total_brands: 0,
        active_brands: 0,
        inactive_brands: 0,
      },
    },
    isLoading: false,
    error: null,

    setPagination: (pagination: BrandPaginationMeta) => {
      set({
        pagination: {
          ...get().pagination,
          ...pagination,
        },
      });
    },

    setItems: (data: unknown) => {
      const brands = Array.isArray(data)
        ? data
        : (data as { data?: Brand[] })?.data || [];
      set({
        brands,
        isLoading: false,
        error: null,
        pagination:
          (data as { meta: BrandPaginationMeta })?.meta || get().pagination,
      });
    },

    setStats: (data: Brand) => {
      console.log("Updating stats with data:", data);
      set((state) => ({
        pagination: {
          ...state.pagination,
          stats: {
            ...state.pagination.stats!,
            active_brands: data.is_active
              ? state.pagination.stats!.active_brands + 1
              : state.pagination.stats!.active_brands - 1,
            inactive_brands: data.is_active
              ? state.pagination.stats!.inactive_brands - 1
              : state.pagination.stats!.inactive_brands + 1,
          },
        },
      }));
    },

    addItem: (data: unknown) => {
      const brand = (data as { data?: Brand })?.data || data;
      set((state) => ({
        brands: [brand as Brand, ...state.brands],
        isLoading: false,
        error: null,
      }));
    },

    updateItem: (id: number | string, data: unknown) => {
      const brand = (data as { data?: Partial<Brand> })?.data || data;
      set((state) => ({
        brands: state.brands.map((item) =>
          item.id === id ? { ...item, ...(brand as Partial<Brand>) } : item
        ),
        isLoading: false,
        error: null,
      }));
    },

    removeItem: (id: number | string) => {
      set((state) => ({
        brands: state.brands.filter((item) => item.id !== id),
        isLoading: false,
        error: null,
      }));
    },

    getBrandById: (id: number | string) => {
      return get().brands.find((item) => item.id === id);
    },

    setLoading: (loading: boolean) => {
      set({ isLoading: loading });
    },

    setError: (error: string | null) => {
      set({ error, isLoading: false });
    },
  }),
  "brand-storage"
);
