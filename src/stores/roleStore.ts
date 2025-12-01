import { PaginationMeta } from "@/lib/types";
import { createStore } from "./createStore";

export interface Permission {
  id: number;
  name: string;
  display_name: string;
  module: string;
  description: string;
  created_at?: string;
  updated_at?: string;
}

export interface statistics {
  total_roles: number;
  active_roles: number;
  inactive_roles: number;
  roles_with_users: number;
  roles_without_users: number;
}

export interface PermissionModule {
  module: string;
  permissions: Permission[];
}

export interface Role {
  id: number | string;
  name: string;
  display_name: string;
  description: string;
  isActive: boolean;
  created_at: string;
  updated_at: string;
  permissions: Permission[];
  permissions_count: number;
  users_count: number;
}

interface RoleState {
  roles: Role[];
  permissions: PermissionModule[];
  totalPermissions: number;
  statistics: statistics;
  pagination: PaginationMeta;
  isLoading: boolean;
  error: string | null;
  setItems: (roles: unknown) => void;
  setPermissions: (data: { data: PermissionModule[]; total: number }) => void;
  addItem: (role: unknown) => void;
  updateItem: (id: number | string, role: unknown) => void;
  removeItem: (id: number | string) => void;
  getRoleById: (id: number | string) => Role | undefined;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useRoleStore = createStore<RoleState>(
  (set, get) => ({
    roles: [],
    permissions: [],
    totalPermissions: 0,
    statistics: {
      total_roles: 0,
      active_roles: 0,
      inactive_roles: 0,
      roles_with_users: 0,
      roles_without_users: 0,
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
      const roles = Array.isArray(data)
        ? data
        : (data as { data?: Role[] })?.data || [];
      set({
        roles,
        statistics:
          (data as { statistics: statistics })?.statistics || get().statistics,
        isLoading: false,
        error: null,
        pagination:
          (data as { meta: PaginationMeta })?.meta || get().pagination,
      });
    },

    addItem: (data: unknown) => {
      const role = (data as { data?: Role })?.data || data;
      set((state) => ({
        roles: [role as Role, ...state.roles],
        isLoading: false,
        error: null,
      }));
    },

    setPermissions: ({
      data,
      total,
    }: {
      data: PermissionModule[];
      total: number;
    }) => {
      set({ permissions: data, totalPermissions: total });
    },

    updateItem: (id: number | string, data: unknown) => {
      const role = (data as { data?: Partial<Role> })?.data || data;
      set((state) => ({
        roles: state.roles.map((r) =>
          r.id === id ? { ...r, ...(role as Partial<Role>) } : r
        ),
        isLoading: false,
        error: null,
      }));
    },

    removeItem: (id: number | string) => {
      set((state) => ({
        roles: state.roles.filter((r) => r.id !== id),
        isLoading: false,
        error: null,
      }));
    },

    getRoleById: (id: number | string) => {
      return get().roles.find((r) => r.id === id);
    },

    setLoading: (loading: boolean) => {
      set({ isLoading: loading });
    },

    setError: (error: string | null) => {
      set({ error, isLoading: false });
    },
  }),
  "role-storage"
);
