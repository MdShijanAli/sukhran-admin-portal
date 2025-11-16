import authService from "@/services/authService";
import { createStore } from "./createStore";

export interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "cxo" | "operator";
  avatar?: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  setState: (state: Partial<AuthState>) => void;
}

export const useAuthStore = createStore<AuthState>(
  (set) => ({
    user: null,
    isAuthenticated: false,
    setState: (state: Partial<AuthState>) => set(state),
  }),
  "auth-storage",
  true
);
