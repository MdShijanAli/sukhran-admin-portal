import { createApiService, ApiService } from "./createApiService";
import { apiRoutes } from "@/api/apiRoutes";
import { useProductStore, Product } from "@/stores/productStore";

// Create base API service with all CRUD operations
const apiService = createApiService<Product>(
  apiRoutes.products,
  useProductStore.getState()
);

interface ProductService extends ApiService<Product> {
  toggleProductStatus: (
    id: number | string,
    isActive: boolean
  ) => Promise<unknown>;
  toggleFeaturedStatus: (
    id: number | string,
    isFeatured: boolean
  ) => Promise<unknown>;
}

const productService: ProductService = {
  // Inherit all basic CRUD operations
  ...apiService,

  // Add extra custom API methods here
  toggleProductStatus: async (id: number | string, isActive: boolean) => {
    try {
      const response = await apiService.updateItem(id, {
        is_active: isActive,
      });
      return response;
    } catch (error) {
      console.error("Error toggling product status:", error);
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

export default productService;
