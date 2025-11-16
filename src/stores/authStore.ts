import { User } from "@/lib/types";
import { createStore } from "./createStore";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  access_token?: string;
  refresh_token?: string;
  setState: (state: Partial<AuthState>) => void;
}

export const useAuthStore = createStore<AuthState>(
  (set) => ({
    user: null,
    isAuthenticated: false,
    access_token: null,
    refresh_token: null,
    setState: (state: Partial<AuthState>) => set(state),
  }),
  "auth-storage",
  true
);
