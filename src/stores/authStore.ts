import { User } from "@/lib/types";
import { createStore } from "./createStore";

interface AuthState {
  user: User | null;
  permissions?: string[];
  isAuthenticated: boolean;
  access_token?: string;
  refresh_token?: string;
  setState: (state: Partial<AuthState>) => void;
}

export const useAuthStore = createStore<AuthState>(
  (set) => ({
    user: null,
    permissions: [],
    isAuthenticated: false,
    access_token: null,
    refresh_token: null,
    setState: (state: Partial<AuthState>) => {
      console.log("Users----->", state);
      set({
        ...state,
        permissions: state.user?.permissions ?? [],
      });
    },
  }),
  "auth-storage",
  true
);

// Computed selector for isAdmin
export const useIsAdmin = () => {
  const user = useAuthStore((state) => state.user);
  return user?.role?.name === "admin" || false;
};
