import {
  PaginationMeta,
  Donation,
  DonationStatistics,
  CoinDonationReport,
  FulfillmentHistory,
} from "@/lib/types";
import { createStore } from "./createStore";

interface DonationState {
  donations: Donation[];
  statistics: DonationStatistics | null;
  coinReport: CoinDonationReport | null;
  fulfillmentHistory: FulfillmentHistory[];
  pagination: PaginationMeta;
  isLoading: boolean;
  error: string | null;
  setItems: (data: unknown) => void;
  setStatistics: (stats: DonationStatistics) => void;
  setCoinReport: (report: CoinDonationReport) => void;
  setFulfillmentHistory: (data: unknown) => void;
  addItem: (donation: unknown) => void;
  updateItem: (id: number | string, donation: unknown) => void;
  removeItem: (id: number | string) => void;
  getDonationById: (id: number | string) => Donation | undefined;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setPagination: (pagination: PaginationMeta) => void;
}

export const useDonationStore = createStore<DonationState>(
  (set, get) => ({
    donations: [],
    statistics: null,
    coinReport: null,
    fulfillmentHistory: [],
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
      const donations = Array.isArray(data)
        ? data
        : (data as { data?: Donation[] })?.data || [];
      const meta = (data as { meta?: PaginationMeta })?.meta;

      set({
        donations,
        pagination: meta || get().pagination,
        isLoading: false,
        error: null,
      });
    },

    setStatistics: (stats: DonationStatistics) => {
      set({ statistics: stats, isLoading: false, error: null });
    },

    setCoinReport: (report: CoinDonationReport) => {
      set({ coinReport: report, isLoading: false, error: null });
    },

    setFulfillmentHistory: (data: unknown) => {
      const history = Array.isArray(data)
        ? data
        : (data as { data?: FulfillmentHistory[] })?.data || [];
      set({ fulfillmentHistory: history, isLoading: false, error: null });
    },

    addItem: (data: unknown) => {
      const donation = (data as { data?: Donation })?.data || data;
      set((state) => ({
        donations: [donation as Donation, ...state.donations],
        isLoading: false,
        error: null,
      }));
    },

    updateItem: (id: number | string, data: unknown) => {
      const donation = (data as { data?: Partial<Donation> })?.data || data;
      set((state) => ({
        donations: state.donations.map((d) =>
          d.id === id ? { ...d, ...(donation as Partial<Donation>) } : d
        ),
        isLoading: false,
        error: null,
      }));
    },

    removeItem: (id: number | string) => {
      set((state) => ({
        donations: state.donations.filter((d) => d.id !== id),
        isLoading: false,
        error: null,
      }));
    },

    getDonationById: (id: number | string) => {
      return get().donations.find((d) => d.id === Number(id));
    },

    setLoading: (loading: boolean) => {
      set({ isLoading: loading });
    },

    setError: (error: string | null) => {
      set({ error, isLoading: false });
    },
  }),
  "donation-storage"
);
