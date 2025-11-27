import { PaginationMeta } from "@/lib/types";
import { createStore } from "./createStore";

export interface DeliveryLocation {
  latitude: number;
  longitude: number;
  address: string;
  updated_at: string;
}

export interface Delivery {
  id: number | string;
  delivery_number: string;
  order_id: number | string;
  order_number: string;
  customer_id: number | string;
  customer_name: string;
  customer_phone: string;
  delivery_address: string;
  coverage_area_id?: number | string;
  driver_id?: number | string;
  driver_name?: string;
  driver_phone?: string;
  status:
    | "pending"
    | "assigned"
    | "picked-up"
    | "in-transit"
    | "delivered"
    | "failed"
    | "cancelled";
  scheduled_time: string;
  pickup_time?: string;
  delivered_time?: string;
  delivery_notes?: string;
  customer_notes?: string;
  current_location?: DeliveryLocation;
  proof_of_delivery?: string;
  failure_reason?: string;
  created_at: string;
  updated_at: string;
}

export interface DeliveryStatistics {
  total_deliveries: number;
  pending_deliveries: number;
  assigned_deliveries: number;
  in_transit_deliveries: number;
  delivered_today: number;
  failed_deliveries: number;
  cancelled_deliveries: number;
}

interface DeliveryState {
  deliveries: Delivery[];
  statistics: DeliveryStatistics;
  pagination: PaginationMeta;
  isLoading: boolean;
  error: string | null;
  setItems: (deliveries: unknown) => void;
  addItem: (delivery: unknown) => void;
  updateItem: (id: number | string, delivery: unknown) => void;
  removeItem: (id: number | string) => void;
  getDeliveryById: (id: number | string) => Delivery | undefined;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useDeliveryStore = createStore<DeliveryState>(
  (set, get) => ({
    deliveries: [],
    statistics: {
      total_deliveries: 0,
      pending_deliveries: 0,
      assigned_deliveries: 0,
      in_transit_deliveries: 0,
      delivered_today: 0,
      failed_deliveries: 0,
      cancelled_deliveries: 0,
    },
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
      const deliveries = Array.isArray(data)
        ? data
        : (data as { data?: Delivery[] })?.data || [];
      set({
        deliveries,
        statistics:
          (data as { statistics: DeliveryStatistics })?.statistics ||
          get().statistics,
        isLoading: false,
        error: null,
        pagination:
          (data as { meta: PaginationMeta })?.meta || get().pagination,
      });
    },

    addItem: (data: unknown) => {
      const delivery = (data as { data?: Delivery })?.data || data;
      set((state) => ({
        deliveries: [delivery as Delivery, ...state.deliveries],
        isLoading: false,
        error: null,
      }));
    },

    updateItem: (id: number | string, data: unknown) => {
      const delivery = (data as { data?: Partial<Delivery> })?.data || data;
      set((state) => ({
        deliveries: state.deliveries.map((d) =>
          d.id === id ? { ...d, ...(delivery as Partial<Delivery>) } : d
        ),
        isLoading: false,
        error: null,
      }));
    },

    removeItem: (id: number | string) => {
      set((state) => ({
        deliveries: state.deliveries.filter((d) => d.id !== id),
        isLoading: false,
        error: null,
      }));
    },

    getDeliveryById: (id: number | string) => {
      return get().deliveries.find((d) => d.id === id);
    },

    setLoading: (loading: boolean) => {
      set({ isLoading: loading });
    },

    setError: (error: string | null) => {
      set({ error, isLoading: false });
    },
  }),
  "delivery-storage"
);
