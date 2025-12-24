import { PaginationMeta } from "@/lib/types";
import { createStore } from "./createStore";

export interface SupportTicket {
  id: number;
  ticketNumber: string;
  customer: {
    id: number;
    name: string;
    email: string;
    mobile: string;
  };
  order: {
    id: number;
    orderNumber: string;
  } | null;
  category: string;
  subject: string;
  status: string;
  priority: string;
  createdByAdmin: boolean;
  created_at: string;
  updated_at: string;
}

export interface SupportStatistics {
  today: {
    new_tickets: number;
    resolved: number;
    in_progress: number;
  };
  current_status: {
    open: number;
    in_progress: number;
    resolved: number;
    closed: number;
    total_active: number;
  };
  by_category: {
    delivery: number;
    payment: number;
    product: number;
    account: number;
    order: number;
    return: number;
    other: number;
  };
  by_priority: {
    urgent: number;
    high: number;
    medium: number;
    low: number;
  };
  recent_tickets: Array<{
    id: number;
    ticketNumber: string;
    customer: string;
    category: string;
    subject: string;
    status: string;
    priority: string;
    created_at: string;
  }>;
  metrics: {
    avg_resolution_time_hours: number;
  };
}

interface SupportState {
  tickets: SupportTicket[];
  statistics: SupportStatistics | null;
  pagination: PaginationMeta;
  isLoading: boolean;
  error: string | null;
  setItems: (data: unknown) => void;
  setStatistics: (stats: SupportStatistics) => void;
  addItem: (ticket: unknown) => void;
  updateItem: (id: number | string, ticket: unknown) => void;
  removeItem: (id: number | string) => void;
  getTicketById: (id: number | string) => SupportTicket | undefined;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setPagination: (pagination: PaginationMeta) => void;
}

export const useSupportStore = createStore<SupportState>(
  (set, get) => ({
    tickets: [],
    statistics: null,
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
      const tickets = Array.isArray(data)
        ? data
        : (data as { data?: SupportTicket[] })?.data || [];
      const meta = (data as { meta?: PaginationMeta })?.meta;

      set({
        tickets,
        pagination: meta || get().pagination,
        isLoading: false,
        error: null,
      });
    },

    setStatistics: (stats: SupportStatistics) => {
      set({ statistics: stats, isLoading: false, error: null });
    },

    addItem: (data: unknown) => {
      const ticket = (data as { data?: SupportTicket })?.data || data;
      set((state) => ({
        tickets: [ticket as SupportTicket, ...state.tickets],
        isLoading: false,
        error: null,
      }));
    },

    updateItem: (id: number | string, data: unknown) => {
      const ticket = (data as { data?: Partial<SupportTicket> })?.data || data;
      set((state) => ({
        tickets: state.tickets.map((t) =>
          t.id === id ? { ...t, ...(ticket as Partial<SupportTicket>) } : t
        ),
        isLoading: false,
        error: null,
      }));
    },

    removeItem: (id: number | string) => {
      set((state) => ({
        tickets: state.tickets.filter((t) => t.id !== id),
        isLoading: false,
        error: null,
      }));
    },

    getTicketById: (id: number | string) => {
      return get().tickets.find((t) => t.id === Number(id));
    },

    setLoading: (loading: boolean) => {
      set({ isLoading: loading });
    },

    setError: (error: string | null) => {
      set({ error, isLoading: false });
    },
  }),
  "support-storage"
);
