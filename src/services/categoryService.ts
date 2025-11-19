import { createApiService, ApiService } from "./createApiService";
import { apiRoutes } from "@/api/apiRoutes";
import { useCategoryStore, Category } from "@/stores/categoryStore";
import apiClient from "@/api/apiClient";

// Create base API service with all CRUD operations
const apiService = createApiService<Category>(
  apiRoutes.categories,
  useCategoryStore.getState()
);

interface CategoryService extends ApiService<Category> {
  toggleCategoryStatus: (
    id: number | string,
    isActive: boolean
  ) => Promise<unknown>;
  storeSubCategory: (formData: FormData) => Promise<unknown>;
  updateSubCategory: (
    id: number | string,
    formData: FormData
  ) => Promise<unknown>;
  deleteSubCategory: (id: number | string) => Promise<unknown>;
}

const categoryService: CategoryService = {
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

  storeSubCategory: async (formData: FormData) => {
    try {
      const response = await apiClient.post(
        apiRoutes.categories.createSubCategory,
        formData
      );
      console.log("Response from storing sub-category:", response);
      return response.data;
    } catch (error) {
      console.error("Error storing sub-category:", error);
      throw error;
    }
  },

  updateSubCategory: async (id: number | string, formData: FormData) => {
    try {
      const response = await apiClient.post(
        apiRoutes.categories.updateSubCategory(id),
        formData
      );
      console.log("Response from updating sub-category:", response);
      return response.data;
    } catch (error) {
      console.error("Error updating sub-category:", error);
      throw error;
    }
  },

  deleteSubCategory: async (id: number | string) => {
    try {
      const response = await apiClient.delete(
        apiRoutes.categories.deleteSubCategory(id)
      );
      console.log("Response from deleting sub-category:", response);
      return response.data;
    } catch (error) {
      console.error("Error deleting sub-category:", error);
      throw error;
    }
  },
};

export default categoryService;
