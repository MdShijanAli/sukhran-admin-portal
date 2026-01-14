import { Coupon, CouponPaginationMeta, PaginationMeta } from "@/lib/types";
import { createStore } from "./createStore";

interface CouponState {
  coupons: Coupon[];
  pagination: CouponPaginationMeta;
  isLoading: boolean;
  error: string | null;
  setItems: (coupons: unknown) => void;
  addItem: (coupon: unknown) => void;
  updateItem: (id: number | string, coupon: unknown) => void;
  removeItem: (id: number | string) => void;
  getCouponById: (id: number | string) => Coupon | undefined;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setPagination: (pagination: CouponPaginationMeta) => void;
}

export const useCouponStore = createStore<CouponState>(
  (set, get) => ({
    coupons: [],
    pagination: {
      current_page: 1,
      total: 0,
      per_page: 20,
      last_page: 1,
      statistics: {
        total_coupons: 0,
        active_coupons: 0,
        inactive_coupons: 0,
        expired_coupons: 0,
        valid_now: 0,
        upcoming: 0,
        usage: {
          total_usage: 0,
          total_discount_given: 0,
        },
        most_used_coupon: null,
        highest_discount_coupon: null,
      },
    },
    isLoading: false,
    error: null,

    setPagination: (pagination: CouponPaginationMeta) => {
      set({
        pagination: {
          ...get().pagination,
          ...pagination,
        },
      });
    },

    setItems: (data: unknown) => {
      const responseData = data as {
        data?: Coupon[];
        pagination?: CouponPaginationMeta;
        statistics?: CouponPaginationMeta["statistics"];
      };

      const coupons = Array.isArray(data) ? data : responseData?.data || [];

      set({
        coupons,
        isLoading: false,
        error: null,
        pagination: {
          ...get().pagination,
          ...(responseData?.pagination || {}),
          statistics: responseData?.statistics || get().pagination.statistics,
        },
      });
    },

    addItem: (data: unknown) => {
      const coupon = (data as { data?: Coupon })?.data || data;
      set((state) => ({
        coupons: [coupon as Coupon, ...state.coupons],
        isLoading: false,
        error: null,
      }));
    },

    updateItem: (id: number | string, data: unknown) => {
      const coupon = (data as { data?: Partial<Coupon> })?.data || data;
      set((state) => ({
        coupons: state.coupons.map((c) =>
          c.id === id ? { ...c, ...(coupon as Partial<Coupon>) } : c
        ),
        isLoading: false,
        error: null,
      }));
    },

    removeItem: (id: number | string) => {
      set((state) => ({
        coupons: state.coupons.filter((c) => c.id !== id),
        isLoading: false,
        error: null,
      }));
    },

    getCouponById: (id: number | string) => {
      return get().coupons.find((c) => c.id === id);
    },

    setLoading: (loading: boolean) => {
      set({ isLoading: loading });
    },

    setError: (error: string | null) => {
      set({ error, isLoading: false });
    },
  }),
  "coupon-storage"
);
