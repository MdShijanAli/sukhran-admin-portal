import { Banner, BannerPaginationMeta } from "@/lib/types";
import { createStore } from "./createStore";

interface BannerState {
  banners: Banner[];
  pagination: BannerPaginationMeta;
  isLoading: boolean;
  error: string | null;
  setItems: (banners: unknown) => void;
  addItem: (banner: unknown) => void;
  updateItem: (id: number | string, banner: unknown) => void;
  removeItem: (id: number | string) => void;
  getBannerById: (id: number | string) => Banner | undefined;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setStats: (stats: Partial<BannerPaginationMeta["stats"]>) => void;
  setPagination: (pagination: BannerPaginationMeta) => void;
}

export const useBannerStore = createStore<BannerState>(
  (set, get) => ({
    banners: [],
    pagination: {
      current_page: 1,
      total: 0,
      per_page: 20,
      last_page: 1,
      from: 1,
      to: 1,
      stats: {
        total_banners: 0,
        active_banners: 0,
        inactive_banners: 0,
      },
    },
    isLoading: false,
    error: null,

    setPagination: (pagination: BannerPaginationMeta) => {
      set({
        pagination: {
          ...get().pagination,
          ...pagination,
        },
      });
    },

    setItems: (data: unknown) => {
      // Handle both array and object responses
      const banners = Array.isArray(data)
        ? data
        : (data as { data?: Banner[] })?.data || [];
      set({
        banners,
        isLoading: false,
        error: null,
        pagination:
          (data as { meta: BannerPaginationMeta })?.meta || get().pagination,
      });
    },

    setStats: (stats: Partial<BannerPaginationMeta["stats"]>) => {
      set((state) => ({
        pagination: {
          ...state.pagination,
          stats: {
            ...state.pagination.stats,
            ...stats,
          },
        },
      }));
    },

    addItem: (data: unknown) => {
      const banner = (data as { data?: Banner })?.data || data;
      set((state) => ({
        banners: [banner as Banner, ...state.banners],
        isLoading: false,
        error: null,
        pagination: {
          ...state.pagination,
          total: state.pagination.total + 1,
          stats: {
            ...state.pagination.stats,
            total_banners: (state.pagination.stats?.total_banners || 0) + 1,
            active_banners: (banner as Banner).is_active
              ? (state.pagination.stats?.active_banners || 0) + 1
              : state.pagination.stats?.active_banners || 0,
            inactive_banners: !(banner as Banner).is_active
              ? (state.pagination.stats?.inactive_banners || 0) + 1
              : state.pagination.stats?.inactive_banners || 0,
          },
        },
      }));
    },

    updateItem: (id: number | string, data: unknown) => {
      const banner = (data as { data?: Partial<Banner> })?.data || data;
      set((state) => {
        const oldBanner = state.banners.find((b) => b.id === id);
        const newBanner = {
          ...oldBanner,
          ...(banner as Partial<Banner>),
        } as Banner;

        // Calculate stats change
        let activeChange = 0;
        let inactiveChange = 0;

        if (oldBanner && oldBanner.is_active !== newBanner.is_active) {
          if (newBanner.is_active) {
            activeChange = 1;
            inactiveChange = -1;
          } else {
            activeChange = -1;
            inactiveChange = 1;
          }
        }

        return {
          banners: state.banners.map((b) => (b.id === id ? newBanner : b)),
          isLoading: false,
          error: null,
          pagination: {
            ...state.pagination,
            stats: {
              ...state.pagination.stats,
              active_banners:
                (state.pagination.stats?.active_banners || 0) + activeChange,
              inactive_banners:
                (state.pagination.stats?.inactive_banners || 0) +
                inactiveChange,
            },
          },
        };
      });
    },

    removeItem: (id: number | string) => {
      set((state) => {
        const banner = state.banners.find((b) => b.id === id);
        return {
          banners: state.banners.filter((b) => b.id !== id),
          isLoading: false,
          error: null,
          pagination: {
            ...state.pagination,
            total: state.pagination.total - 1,
            stats: {
              ...state.pagination.stats,
              total_banners: (state.pagination.stats?.total_banners || 0) - 1,
              active_banners: banner?.is_active
                ? (state.pagination.stats?.active_banners || 0) - 1
                : state.pagination.stats?.active_banners || 0,
              inactive_banners: !banner?.is_active
                ? (state.pagination.stats?.inactive_banners || 0) - 1
                : state.pagination.stats?.inactive_banners || 0,
            },
          },
        };
      });
    },

    getBannerById: (id: number | string) => {
      return get().banners.find((banner) => banner.id === id);
    },

    setLoading: (loading: boolean) => {
      set({ isLoading: loading });
    },

    setError: (error: string | null) => {
      set({ error, isLoading: false });
    },
  }),
  "banner-storage"
);
