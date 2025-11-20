import { PaginationMeta } from "@/lib/types";
import { createStore } from "./createStore";

export interface ProductSku {
  id?: number | string;
  name: string;
  unitName: string;
  unitSize: string;
  currentPrice: number;
  stockQuantity: number;
  originalPrice?: number;
  weight?: number;
  color?: string;
  length?: number;
  width?: number;
  height?: number;
  imgUrl?: string;
  image_url?: string;
}

export interface Product {
  id: number | string;
  categoryId: number | string;
  slug: string;
  name: string;
  subCategoryId?: number | string;
  productType: "normal" | "subscription" | "bundle";
  description?: string;
  isActive?: boolean;
  isFeatured?: boolean;
  imgUrl?: string;
  image_url?: string;
  skus?: ProductSku[];
  created_at?: string;
  updated_at?: string;
  category?: {
    id: number;
    name: string;
  };
  subCategory?: {
    id: number;
    name: string;
  };
}

interface ProductState {
  products: Product[];
  pagination: PaginationMeta;
  isLoading: boolean;
  error: string | null;
  setItems: (products: unknown) => void;
  addItem: (product: unknown) => void;
  updateItem: (id: number | string, product: unknown) => void;
  removeItem: (id: number | string) => void;
  getProductById: (id: number | string) => Product | undefined;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useProductStore = createStore<ProductState>(
  (set, get) => ({
    products: [],
    pagination: {
      current_page: 1,
      total: 0,
      per_page: 10,
      last_page: 1,
      from: 1,
      to: 1,
    },
    isLoading: false,
    error: null,

    setItems: (data: unknown) => {
      // Handle both array and object responses
      const products = Array.isArray(data)
        ? data
        : (data as { data?: Product[] })?.data || [];
      set({
        products,
        isLoading: false,
        error: null,
        pagination:
          (data as { meta: PaginationMeta })?.meta || get().pagination,
      });
    },

    addItem: (data: unknown) => {
      const product = (data as { data?: Product })?.data || data;
      set((state) => ({
        products: [product as Product, ...state.products],
        isLoading: false,
        error: null,
      }));
    },

    updateItem: (id: number | string, data: unknown) => {
      const product = (data as { data?: Partial<Product> })?.data || data;
      set((state) => ({
        products: state.products.map((prod) =>
          prod.id === id ? { ...prod, ...(product as Partial<Product>) } : prod
        ),
        isLoading: false,
        error: null,
      }));
    },

    removeItem: (id: number | string) => {
      set((state) => ({
        products: state.products.filter((prod) => prod.id !== id),
        isLoading: false,
        error: null,
      }));
    },

    getProductById: (id: number | string) => {
      return get().products.find((prod) => prod.id === id);
    },

    setLoading: (loading: boolean) => {
      set({ isLoading: loading });
    },

    setError: (error: string | null) => {
      set({ error, isLoading: false });
    },
  }),
  "product-storage"
);
