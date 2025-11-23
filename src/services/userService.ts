import { createApiService, ApiService } from "./createApiService";
import { apiRoutes } from "@/api/apiRoutes";
import { useUserStore, User } from "@/stores/userStore";
import apiClient from "@/api/apiClient";

// Create base API service with all CRUD operations
const apiService = createApiService<User>(
  apiRoutes.users,
  useUserStore.getState()
);

interface UserService extends ApiService<User> {
  toggleUserStatus: (id: number | string) => Promise<unknown>;
  getUsersStatistics: () => Promise<unknown>;
  resetUserPassword: (id: number | string) => Promise<unknown>;
}

const userService: UserService = {
  // Inherit all basic CRUD operations
  ...apiService,

  // Add extra custom API methods here
  toggleUserStatus: async (id: number | string) => {
    try {
      const response = await apiClient.patch(
        apiRoutes.users.toggleUserStatus(id)
      );
      console.log("Toggle active status response:", response.data);
      if (response && response.status === 200) {
        useUserStore.getState().updateItem(id, response.data.user);
      }
      return response.data;
    } catch (error) {
      console.error("Error toggling user status:", error);
      throw error;
    }
  },

  getUsersStatistics: async () => {
    try {
      const response = await apiClient.get(apiRoutes.users.getUsersStatistics);
      return response.data;
    } catch (error) {
      console.error("Error fetching users statistics:", error);
      throw error;
    }
  },

  resetUserPassword: async (id: number | string) => {
    try {
      const response = await apiClient.post(
        apiRoutes.users.resetUserPassword(id)
      );
      return response.data;
    } catch (error) {
      console.error("Error resetting user password:", error);
      throw error;
    }
  },
};

export default userService;
