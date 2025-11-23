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
  toggleUserStatus: (
    id: number | string,
    isActive: boolean
  ) => Promise<unknown>;
}

const userService: UserService = {
  // Inherit all basic CRUD operations
  ...apiService,

  // Add extra custom API methods here
  toggleUserStatus: async (id: number | string, isActive: boolean) => {
    try {
      const response = await apiClient.put(
        apiRoutes.users.toggleUserStatus(id),
        {
          is_active: isActive,
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error toggling user status:", error);
      throw error;
    }
  },
};

export default userService;
