import { PaginationMeta, DonationChannel } from "@/lib/types";
import { createStore } from "./createStore";

interface DonationChannelState {
  channels: DonationChannel[];
  pagination: PaginationMeta & {
    total: number;
    active: number;
    inactive: number;
  };
  isLoading: boolean;
  error: string | null;
  setItems: (data: unknown) => void;
  addItem: (channel: unknown) => void;
  updateItem: (id: number | string, channel: unknown) => void;
  removeItem: (id: number | string) => void;
  getChannelById: (id: number | string) => DonationChannel | undefined;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setPagination: (pagination: PaginationMeta) => void;
}

export const useDonationChannelStore = createStore<DonationChannelState>(
  (set, get) => ({
    channels: [],
    pagination: {
      current_page: 1,
      total: 0,
      per_page: 20,
      last_page: 1,
      from: 1,
      to: 1,
      active: 0,
      inactive: 0,
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
      const channels = Array.isArray(data)
        ? data
        : (data as { data?: DonationChannel[] })?.data || [];
      const meta = (
        data as {
          meta?: PaginationMeta & {
            total: number;
            active: number;
            inactive: number;
          };
        }
      )?.meta;

      set({
        channels,
        pagination: meta || get().pagination,
        isLoading: false,
        error: null,
      });
    },

    addItem: (data: unknown) => {
      const channel = (data as { data?: DonationChannel })?.data || data;
      set((state) => ({
        channels: [channel as DonationChannel, ...state.channels],
        isLoading: false,
        error: null,
      }));
    },

    updateItem: (id: number | string, data: unknown) => {
      const channel =
        (data as { data?: Partial<DonationChannel> })?.data || data;
      set((state) => ({
        channels: state.channels.map((c) =>
          c.id === id ? { ...c, ...(channel as Partial<DonationChannel>) } : c
        ),
        isLoading: false,
        error: null,
      }));
    },

    removeItem: (id: number | string) => {
      set((state) => ({
        channels: state.channels.filter((c) => c.id !== id),
        isLoading: false,
        error: null,
      }));
    },

    getChannelById: (id: number | string) => {
      return get().channels.find((c) => c.id === Number(id));
    },

    setLoading: (loading: boolean) => {
      set({ isLoading: loading });
    },

    setError: (error: string | null) => {
      set({ error, isLoading: false });
    },
  }),
  "donation-channel-storage"
);
