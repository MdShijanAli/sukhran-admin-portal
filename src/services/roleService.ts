import { createApiService, ApiService } from "./createApiService";
import { apiRoutes } from "@/api/apiRoutes";
import { useRoleStore, Role, PermissionModule } from "@/stores/roleStore";
import apiClient from "@/api/apiClient";

// Create base API service with all CRUD operations
const apiService = createApiService<Role>(
  apiRoutes.roles,
  useRoleStore.getState()
);

interface RoleService extends ApiService<Role> {
  toggleRoleStatus: (id: number | string) => Promise<unknown>;
  getAllPermissions: () => Promise<unknown>;
}

const roleService: RoleService = {
  // Inherit all basic CRUD operations
  ...apiService,

  // Add extra custom API methods here
  toggleRoleStatus: async (id: number | string): Promise<Role> => {
    try {
      const response = await apiClient.patch(
        apiRoutes.roles.toggleRoleStatus(id)
      );
      console.log("Toggle role status response:", response.data);
      if (response && response.status === 200) {
        const responseData = response.data as { role: Role };
        useRoleStore.getState().updateItem(id, responseData.role);
        return responseData.role;
      }
      return response.data as Role;
    } catch (error) {
      console.error("Error toggling role status:", error);
      throw error;
    }
  },

  getAllPermissions: async () => {
    try {
      const response = await apiClient.get(apiRoutes.permissions.getAll);
      console.log("Get all permissions response:", response.data);
      if (response && response.status === 200) {
        const responseData = response.data as {
          data: PermissionModule[];
          total: number;
        };
        useRoleStore.getState().setPermissions({
          data: responseData.data,
          total: responseData.total,
        });
      }
      return response.data;
    } catch (error) {
      console.error("Error fetching permissions:", error);
      throw error;
    }
  },
};

export default roleService;
