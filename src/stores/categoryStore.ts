import { PaginationMeta } from "@/lib/types";
import { createStore } from "./createStore";

export interface Category {
  id: number | string;
  name: string;
  slug?: string;
  description?: string;
  imgUrl?: string;
  displayOrder?: number;
  isActive?: boolean;
  businessId?: string;
  sub_categories_count?: number | string;
  products_count?: number | string;
  image_url?: string;
  created_at?: string;
  updated_at?: string;
  subCategories?: SubCategory[];
}

export interface SubCategory {
  id?: number;
  name: string;
  description: string;
  displayOrder: number;
  isActive: boolean;
}

interface CategoryState {
  categories: Category[];
  pagination: PaginationMeta;
  isLoading: boolean;
  error: string | null;
  setItems: (categories: unknown) => void;
  addItem: (category: unknown) => void;
  updateItem: (id: number | string, category: unknown) => void;
  removeItem: (id: number | string) => void;
  getCategoryById: (id: number | string) => Category | undefined;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setPagination: (pagination: PaginationMeta) => void;
}

export const useCategoryStore = createStore<CategoryState>(
  (set, get) => ({
    categories: [],
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
      const categories = Array.isArray(data)
        ? data
        : (data as { data?: Category[] })?.data || [];
      set({
        categories,
        isLoading: false,
        error: null,
        pagination:
          (data as { meta: PaginationMeta })?.meta || get().pagination,
      });
    },

    addItem: (data: unknown) => {
      const category = (data as { data?: Category })?.data || data;
      set((state) => ({
        categories: [category as Category, ...state.categories],
        isLoading: false,
        error: null,
      }));
    },

    updateItem: (id: number | string, data: unknown) => {
      const category = (data as { data?: Partial<Category> })?.data || data;
      set((state) => ({
        categories: state.categories.map((cat) =>
          cat.id === id ? { ...cat, ...(category as Partial<Category>) } : cat
        ),
        isLoading: false,
        error: null,
      }));
    },

    removeItem: (id: number | string) => {
      set((state) => ({
        categories: state.categories.filter((cat) => cat.id !== id),
        isLoading: false,
        error: null,
      }));
    },

    getCategoryById: (id: number | string) => {
      return get().categories.find((cat) => cat.id === id);
    },

    setLoading: (loading: boolean) => {
      set({ isLoading: loading });
    },

    setError: (error: string | null) => {
      set({ error, isLoading: false });
    },
  }),
  "category-storage"
);
