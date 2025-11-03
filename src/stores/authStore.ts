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
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

export const useAuthStore = createStore<AuthState>(
  (set) => ({
    user: null,
    isAuthenticated: false,
    login: async (email: string, password: string) => {
      // Dummy authentication - In production, this would call an API
      if (email && password) {
        const mockUser: User = {
          id: "1",
          name: "Admin User",
          email: email,
          role: email.includes("cxo")
            ? "cxo"
            : email.includes("operator")
            ? "operator"
            : "admin",
        };
        set({ user: mockUser, isAuthenticated: true });
        return true;
      }
      return false;
    },
    logout: () => {
      set({ user: null, isAuthenticated: false });
    },
  }),
  "auth-storage",
  true
);
