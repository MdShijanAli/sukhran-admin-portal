import { PaginationMeta } from "@/lib/types";
import { createStore } from "./createStore";

export interface OrderItem {
  id: number | string;
  itemType: "product" | "package";
  product: {
    id: number | string;
    name: string;
    image_url?: string;
  } | null;
  sku: {
    id: number | string;
    name: string;
    unitName?: string;
    unitSize?: number;
  } | null;
  quantity: string | number;
  unitPrice: number;
  itemCost: number;
}

export interface Customer {
  id: number | string;
  name: string;
  email: string;
  mobile: string;
}

export interface Address {
  street: string | null;
  area: string | null;
  city: string | null;
  state: string | null;
  postalCode: string | null;
  landmark: string | null;
  type: string | null;
}

export interface Receipt {
  subTotal: number;
  discount: number;
  deliveryCharge: number;
  vat: number;
  vatPercentage: number;
  grandTotal: number;
  coinsUsed: number;
  coinsUsedValue: number;
  coinsEarned: number;
  coinDiscount: number;
  couponCode: string | null;
  couponDiscount: number;
  promoDiscount: number;
  couponId: string | null;
  donationAmount: number;
  donationChannelId: string | null;
  donationChannelName: string | null;
  referralCode: string | null;
  totalSavings: number;
}

export interface DeliverySync {
  sent: boolean;
  sentAt?: string | null;
  attempts: string | number;
  lastAttemptAt?: string | null;
  failed: boolean;
  lastError?: string | null;
}

export interface Timeline {
  status: string;
  timestamp: string;
  updatedBy?: number | string;
  note?: string;
}

export interface EstimatedDelivery {
  from: string;
  to: string;
  fromFormatted?: string;
  toFormatted?: string;
  fromISO?: string;
  toISO?: string;
}

export interface Order {
  id: number | string;
  orderId: string;
  customer: Customer;
  status:
    | "pending"
    | "approved"
    | "shipped"
    | "delivered"
    | "cancelled"
    | "returned";
  paymentStatus: "pending" | "paid" | "failed";
  paymentMode: "cash" | "cod" | "online" | "card";
  address: Address;
  items: OrderItem[];
  customer_name?: string;
  customer_email?: string;
  customer_mobile?: string;
  customer_phone?: string;
  delivery_address?: string;
  subtotal?: number;
  vat?: number;
  discount?: number;
  vat_percentage?: number;
  delivery_fee?: number;
  total?: number;
  payment_method?: string;
  payment_status?: string;
  delivery_agent_name?: string;
  delivery_agent_id?: number | string;
  notes?: string | null;
  receipt: Receipt;
  estimatedDelivery?: EstimatedDelivery;
  deliverySync: DeliverySync;
  timeline: Timeline[] | null;
  customerNotes?: string | null;
  adminNotes?: string | null;
  estimatedDeliveryFrom?: string | null;
  estimatedDeliveryTo?: string | null;
  itemsCount?: number;
  grandTotal?: number;
  created_at: string;
  updated_at: string;
}

export interface OrderStatistics {
  total_orders: number;
  total_revenue: string;
  by_status: {
    pending: number;
    approved: number;
    shipped: number;
    delivered: number;
    cancelled: number;
    returned: number;
  };
  by_payment_status: {
    pending: number;
    paid: number;
    failed: number;
  };
  today: {
    orders: number;
    revenue: string;
  };
  this_month: {
    orders: number;
    revenue: string;
  };
  delivery_sync: {
    sent: number;
    pending: number;
    failed: number;
  };
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
  setPagination: (pagination: PaginationMeta) => void;
}

export const useOrderStore = createStore<OrderState>(
  (set, get) => ({
    orders: [],
    statistics: {
      total_orders: 0,
      total_revenue: "0",
      by_status: {
        pending: 0,
        approved: 0,
        shipped: 0,
        delivered: 0,
        cancelled: 0,
        returned: 0,
      },
      by_payment_status: {
        pending: 0,
        paid: 0,
        failed: 0,
      },
      today: {
        orders: 0,
        revenue: "0",
      },
      this_month: {
        orders: 0,
        revenue: "0",
      },
      delivery_sync: {
        sent: 0,
        pending: 0,
        failed: 0,
      },
    },
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
      const orders = Array.isArray(data)
        ? data
        : (data as { data?: Order[] })?.data || [];
      set({
        orders,
        statistics:
          (data as { stats: OrderStatistics })?.stats || get().statistics,
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
          o.id === id ? { ...o, ...(order as Partial<Order>) } : o,
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
  "order-storage",
);
