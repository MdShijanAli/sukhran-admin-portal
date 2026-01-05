import { createApiService, ApiService } from "./createApiService";
import { apiRoutes } from "@/api/apiRoutes";
import { useBrandStore } from "@/stores/brandStore";
import { Brand } from "@/lib/types";
import apiClient from "@/api/apiClient";

const apiService = createApiService<Brand>(
  apiRoutes.brands,
  useBrandStore.getState()
);

interface BrandService extends ApiService<Brand> {
  toggleActiveStatus: (brand: Brand) => Promise<unknown>;
}

const brandService: BrandService = {
  ...apiService,

  toggleActiveStatus: async (brand: Brand) => {
    try {
      const response = await apiClient.patch(
        apiRoutes.brands.toggleStatus(brand.id)
      );
      console.log("Toggle active status response:", response.data);
      if (response && response.status === 200) {
        useBrandStore.getState().updateItem(brand.id, response.data.data);
        useBrandStore.getState().setStats(response.data.data);
      }
      return response;
    } catch (error) {
      console.error("Error toggling brand status:", error);
      throw error;
    }
  },
};

export default brandService;
