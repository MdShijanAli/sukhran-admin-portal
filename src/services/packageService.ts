import { createApiService, ApiService } from "./createApiService";
import { apiRoutes } from "@/api/apiRoutes";
import { usePackageStore } from "@/stores/packageStore";
import { Package } from "@/lib/types";

// Create base API service with all CRUD operations
const apiService = createApiService<Package>(
  apiRoutes.packages,
  usePackageStore.getState()
);

interface PackageService extends ApiService<Package> {
  togglePackageStatus: (
    id: number | string,
    isActive: boolean
  ) => Promise<unknown>;
  toggleFeaturedStatus: (
    id: number | string,
    isFeatured: boolean
  ) => Promise<unknown>;
}

const packageService: PackageService = {
  // Inherit all basic CRUD operations
  ...apiService,

  // Add extra custom API methods here
  togglePackageStatus: async (id: number | string, isActive: boolean) => {
    try {
      const response = await apiService.updateItem(id, {
        is_active: isActive,
      });
      return response;
    } catch (error) {
      console.error("Error toggling package status:", error);
      throw error;
    }
  },

  toggleFeaturedStatus: async (id: number | string, isFeatured: boolean) => {
    try {
      const response = await apiService.updateItem(id, {
        is_featured: isFeatured,
      });
      return response;
    } catch (error) {
      console.error("Error toggling featured status:", error);
      throw error;
    }
  },
};

export default packageService;
