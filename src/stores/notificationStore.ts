import { PaginationMeta } from "@/lib/types";
import { createStore } from "./createStore";

export interface Notification {
  id: number | string;
  title: string;
  body: string;
  image_url?: string;
  link_type: "none" | "product" | "package" | "url";
  package_id?: number | string;
  product_id?: number | string;
  url?: string;
  target_audience: "all" | "specific";
  sent_count?: number;
  success_count?: number;
  failed_count?: number;
  success_rate?: string;
  status: "sent" | "pending" | "failed";
  sent_at?: string;
  created_at: string;
  updated_at?: string;
  sent_by?: {
    id: number | string;
    name: string;
  };
}

interface NotificationState {
  notifications: Notification[];
  pagination: PaginationMeta;
  isLoading: boolean;
  error: string | null;
  setItems: (notifications: unknown) => void;
  addItem: (notification: unknown) => void;
  updateItem: (id: number | string, notification: unknown) => void;
  removeItem: (id: number | string) => void;
  getNotificationById: (id: number | string) => Notification | undefined;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useNotificationStore = createStore<NotificationState>(
  (set, get) => ({
    notifications: [],
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

    setItems: (data: unknown) => {
      // Handle both array and object responses
      const notifications = Array.isArray(data)
        ? data
        : (data as { data?: Notification[] })?.data || [];
      set({
        notifications,
        isLoading: false,
        error: null,
        pagination:
          (data as { meta: PaginationMeta })?.meta || get().pagination,
      });
    },

    addItem: (data: unknown) => {
      const notification = (data as { data?: Notification })?.data || data;
      set((state) => ({
        notifications: [notification as Notification, ...state.notifications],
        isLoading: false,
        error: null,
      }));
    },

    updateItem: (id: number | string, data: unknown) => {
      const notification =
        (data as { data?: Partial<Notification> })?.data || data;
      set((state) => ({
        notifications: state.notifications.map((n) =>
          n.id === id ? { ...n, ...(notification as Partial<Notification>) } : n
        ),
        isLoading: false,
        error: null,
      }));
      console.log("Updated notification data:", notification);
    },

    removeItem: (id: number | string) => {
      set((state) => ({
        notifications: state.notifications.filter((n) => n.id !== id),
        isLoading: false,
        error: null,
      }));
    },

    getNotificationById: (id: number | string) => {
      return get().notifications.find((n) => n.id === id);
    },

    setLoading: (loading: boolean) => {
      set({ isLoading: loading });
    },

    setError: (error: string | null) => {
      set({ error, isLoading: false });
    },
  }),
  "notification-storage"
);
