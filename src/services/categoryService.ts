import { createApiService } from "./createApiService";
import { apiRoutes } from "@/api/apiRoutes";
import { useCategoryStore } from "@/stores/categoryStore";
import apiClient from "@/api/apiClient";

// Create base API service with all CRUD operations
const apiService = createApiService(
  apiRoutes.categories,
  useCategoryStore.getState()
);

const categoryService = {
  // Inherit all basic CRUD operations
  ...apiService,

  // Add extra custom API methods here
  toggleCategoryStatus: async (id: number | string, isActive: boolean) => {
    try {
      const response = await apiClient.put(apiRoutes.categories.update(id), {
        is_active: isActive,
      });
      return response.data;
    } catch (error) {
      console.error("Error toggling category status:", error);
      throw error;
    }
  },

  // Example: Get categories with products count
  fetchCategoriesWithProductCount: async () => {
    try {
      const response = await apiClient.get(
        `${apiRoutes.categories.getAll}?include=products_count`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching categories with count:", error);
      throw error;
    }
  },
};

export default categoryService;
