import { PaginationMeta } from "@/lib/types";
import { createStore } from "./createStore";

export interface OrderItem {
  id: number | string;
  product_id: number | string;
  product_name: string;
  sku_id?: number | string;
  sku_name?: string;
  quantity: number;
  unit_price: number;
  total_price: number;
}

export interface Order {
  id: number | string;
  order_number: string;
  customer_id: number | string;
  customer_name: string;
  customer_phone: string;
  customer_email?: string;
  delivery_address: string;
  coverage_area_id?: number | string;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  delivery_fee: number;
  total: number;
  payment_method: "cash" | "online" | "card";
  payment_status: "pending" | "paid" | "failed" | "refunded";
  status:
    | "pending"
    | "confirmed"
    | "processing"
    | "in-transit"
    | "delivered"
    | "cancelled";
  delivery_agent_id?: number | string;
  delivery_agent_name?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
  delivered_at?: string;
}

export interface OrderStatistics {
  total_orders: number;
  pending_orders: number;
  processing_orders: number;
  delivered_orders: number;
  cancelled_orders: number;
  total_revenue: number;
  pending_revenue: number;
}

interface OrderState {
  orders: Order[];
  statistics: OrderStatistics;
  pagination: PaginationMeta;
  isLoading: boolean;
  error: string | null;
  setItems: (orders: unknown) => void;
  addItem: (order: unknown) => void;
  updateItem: (id: number | string, order: unknown) => void;
  removeItem: (id: number | string) => void;
  getOrderById: (id: number | string) => Order | undefined;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useOrderStore = createStore<OrderState>(
  (set, get) => ({
    orders: [],
    statistics: {
      total_orders: 0,
      pending_orders: 0,
      processing_orders: 0,
      delivered_orders: 0,
      cancelled_orders: 0,
      total_revenue: 0,
      pending_revenue: 0,
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
      const orders = Array.isArray(data)
        ? data
        : (data as { data?: Order[] })?.data || [];
      set({
        orders,
        statistics:
          (data as { statistics: OrderStatistics })?.statistics ||
          get().statistics,
        isLoading: false,
        error: null,
        pagination:
          (data as { meta: PaginationMeta })?.meta || get().pagination,
      });
    },

    addItem: (data: unknown) => {
      const order = (data as { data?: Order })?.data || data;
      set((state) => ({
        orders: [order as Order, ...state.orders],
        isLoading: false,
        error: null,
      }));
    },

    updateItem: (id: number | string, data: unknown) => {
      const order = (data as { data?: Partial<Order> })?.data || data;
      set((state) => ({
        orders: state.orders.map((o) =>
          o.id === id ? { ...o, ...(order as Partial<Order>) } : o
        ),
        isLoading: false,
        error: null,
      }));
    },

    removeItem: (id: number | string) => {
      set((state) => ({
        orders: state.orders.filter((o) => o.id !== id),
        isLoading: false,
        error: null,
      }));
    },

    getOrderById: (id: number | string) => {
      return get().orders.find((o) => o.id === id);
    },

    setLoading: (loading: boolean) => {
      set({ isLoading: loading });
    },

    setError: (error: string | null) => {
      set({ error, isLoading: false });
    },
  }),
  "order-storage"
);
