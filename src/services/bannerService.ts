import { createApiService, ApiService } from "./createApiService";
import { apiRoutes } from "@/api/apiRoutes";
import { useBannerStore } from "@/stores/bannerStore";
import { Banner } from "@/lib/types";
import apiClient from "@/api/apiClient";

// Create base API service with all CRUD operations
const apiService = createApiService<Banner>(
  apiRoutes.banners,
  useBannerStore.getState()
);

interface BannerService extends Omit<ApiService<Banner>, "toggleStatus"> {
  toggleStatus: (id: number | string) => Promise<unknown>;
}

const bannerService: BannerService = {
  // Inherit all basic CRUD operations
  ...apiService,

  // Toggle banner status
  toggleStatus: async (id: number | string) => {
    try {
      const response = await apiClient.patch(
        apiRoutes.banners.toggleStatus(id)
      );
      console.log("Toggle banner status response:", response.data);
      if (response && response.status === 200) {
        useBannerStore.getState().updateItem(id, response.data.data);
      }
      return response;
    } catch (error) {
      console.error("Error toggling banner status:", error);
      throw error;
    }
  },
};

export default bannerService;
