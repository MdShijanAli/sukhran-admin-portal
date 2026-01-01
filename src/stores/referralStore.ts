import {
  PaginationMeta,
  Referral,
  ReferralStatistics,
  ReferralSettings,
  UserReferrals,
} from "@/lib/types";
import { createStore } from "./createStore";

interface ReferralState {
  referrals: Referral[];
  statistics: ReferralStatistics | null;
  settings: ReferralSettings | null;
  userReferrals: UserReferrals | null;
  pagination: PaginationMeta;
  isLoading: boolean;
  error: string | null;
  setItems: (data: unknown) => void;
  setStatistics: (stats: ReferralStatistics) => void;
  setSettings: (settings: ReferralSettings) => void;
  setUserReferrals: (data: UserReferrals) => void;
  addItem: (referral: unknown) => void;
  updateItem: (id: number | string, referral: unknown) => void;
  removeItem: (id: number | string) => void;
  getReferralById: (id: number | string) => Referral | undefined;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setPagination: (pagination: PaginationMeta) => void;
}

export const useReferralStore = createStore<ReferralState>(
  (set, get) => ({
    referrals: [],
    statistics: null,
    settings: null,
    userReferrals: null,
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
      const referrals = Array.isArray(data)
        ? data
        : (data as { data?: Referral[] })?.data || [];
      const meta = (data as { meta?: PaginationMeta })?.meta;

      set({
        referrals,
        pagination: meta || get().pagination,
        isLoading: false,
        error: null,
      });
    },

    setStatistics: (stats: ReferralStatistics) => {
      set({ statistics: stats, isLoading: false, error: null });
    },

    setSettings: (settings: ReferralSettings) => {
      set({ settings, isLoading: false, error: null });
    },

    setUserReferrals: (data: UserReferrals) => {
      set({ userReferrals: data, isLoading: false, error: null });
    },

    addItem: (data: unknown) => {
      const referral = (data as { data?: Referral })?.data || data;
      set((state) => ({
        referrals: [referral as Referral, ...state.referrals],
        isLoading: false,
        error: null,
      }));
    },

    updateItem: (id: number | string, data: unknown) => {
      const referral = (data as { data?: Partial<Referral> })?.data || data;
      set((state) => ({
        referrals: state.referrals.map((r) =>
          r.id === id ? { ...r, ...(referral as Partial<Referral>) } : r
        ),
        isLoading: false,
        error: null,
      }));
    },

    removeItem: (id: number | string) => {
      set((state) => ({
        referrals: state.referrals.filter((r) => r.id !== id),
        isLoading: false,
        error: null,
      }));
    },

    getReferralById: (id: number | string) => {
      return get().referrals.find((r) => r.id === Number(id));
    },

    setLoading: (loading: boolean) => {
      set({ isLoading: loading });
    },

    setError: (error: string | null) => {
      set({ error, isLoading: false });
    },
  }),
  "referral-storage"
);
