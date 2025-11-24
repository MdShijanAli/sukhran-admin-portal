import { PaginationMeta } from "@/lib/types";
import { createStore } from "./createStore";

export interface UserRole {
  id: number;
  name: string;
  display_name: string;
  description: string;
  created_at?: string;
  updated_at?: string;
}

export interface UserAddress {
  id: number;
  user_id: string;
  coverage_area_id: string;
  house: string;
  road: string;
  block: string;
  zip_code: string;
  category: string;
  label: string | null;
  landmark: string | null;
  is_default: boolean;
  created_at: string;
  updated_at: string;
}

export interface User {
  id: number | string;
  firstName: string;
  lastName: string;
  preferredName: string;
  gender: string | null;
  date_of_birth: string | null;
  email: string;
  mobile: string;
  displayImage: string | null;
  image_url?: string;
  is_migrated: boolean;
  isActive: boolean;
  attemptWrongPassword: number;
  isBlocked: boolean;
  blockedUntil: string | null;
  email_verified_at: string | null;
  mobile_verified_at: string | null;
  lastChangedPassword: string | null;
  businessId: string | null;
  storeId: string | null;
  role_id: string;
  referral_code: string | null;
  referred_by: string | null;
  isDeleted: boolean;
  deletedBy: string | null;
  deletion_reason?: string | null;
  deleted_at: string | null;
  created_at: string;
  updated_at: string;
  role: UserRole;
  addresses?: UserAddress[];
  family_profiles?: unknown[];
  deleted_by_user?: unknown | null;
}

export interface UserStatistics {
  total_users: number;
  active_users: number;
  inactive_users: number;
  deleted_users: number;
  verified_users: number;
  unverified_users: number;
  blocked_users: number;
}

interface UserState {
  users: User[];
  statistics: UserStatistics;
  pagination: PaginationMeta;
  isLoading: boolean;
  error: string | null;
  setItems: (users: unknown) => void;
  addItem: (user: unknown) => void;
  updateItem: (id: number | string, user: unknown) => void;
  removeItem: (id: number | string) => void;
  getUserById: (id: number | string) => User | undefined;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useUserStore = createStore<UserState>(
  (set, get) => ({
    users: [],
    statistics: {
      total_users: 0,
      active_users: 0,
      inactive_users: 0,
      deleted_users: 0,
      verified_users: 0,
      unverified_users: 0,
      blocked_users: 0,
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
      // Handle both array and object responses
      const users = Array.isArray(data)
        ? data
        : (data as { data?: User[] })?.data || [];
      set({
        users,
        statistics:
          (data as { statistics: UserStatistics })?.statistics ||
          get().statistics,
        isLoading: false,
        error: null,
        pagination:
          (data as { meta: PaginationMeta })?.meta || get().pagination,
      });
    },

    addItem: (data: unknown) => {
      const user = (data as { data?: User })?.data || data;
      set((state) => ({
        users: [user as User, ...state.users],
        isLoading: false,
        error: null,
      }));
    },

    updateItem: (id: number | string, data: unknown) => {
      const user = (data as { data?: Partial<User> })?.data || data;
      set((state) => ({
        users: state.users.map((u) =>
          u.id === id ? { ...u, ...(user as Partial<User>) } : u
        ),
        isLoading: false,
        error: null,
        statistics: {
          ...state.statistics,
          active_users:
            user.isActive && !user.isDeleted
              ? state.statistics.active_users + 1
              : state.statistics.active_users - 1,
          inactive_users:
            user.isActive && !user.isDeleted
              ? state.statistics.inactive_users - 1
              : state.statistics.inactive_users + 1,
          deleted_users: user.isDeleted
            ? state.statistics.deleted_users + 1
            : state.statistics.deleted_users,
        },
      }));
      console.log("Updated user data:", user);

      // set((state) => ({
      //   statistics: {
      //     ...state.statistics,
      //     active_users: data.isActive ? state.statistics.active_users + 1 : state.statistics.active_users - 1,
      //     inactive_users: data.isActive ? state.statistics.inactive_users - 1 : state.statistics.inactive_users + 1,
      //     deleted_users: state.users.filter((u) => u.isDeleted).length,
      //   },
      // }));
    },

    removeItem: (id: number | string) => {
      set((state) => ({
        users: state.users.filter((u) => u.id !== id),
        isLoading: false,
        error: null,
      }));
    },

    getUserById: (id: number | string) => {
      return get().users.find((u) => u.id === id);
    },

    setLoading: (loading: boolean) => {
      set({ isLoading: loading });
    },

    setError: (error: string | null) => {
      set({ error, isLoading: false });
    },
  }),
  "user-storage"
);
