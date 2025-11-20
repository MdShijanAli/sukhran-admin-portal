import { createApiService, ApiService } from "./createApiService";
import { apiRoutes } from "@/api/apiRoutes";
import { useCoverageAreaStore } from "@/stores/coverageAreaStore";
import { CoverageArea } from "@/lib/types";

// Create base API service with all CRUD operations
const apiService = createApiService<CoverageArea>(
  apiRoutes.coverageAreas,
  useCoverageAreaStore.getState()
);

interface CoverageAreaService extends ApiService<CoverageArea> {
  toggleActiveStatus: (
    id: number | string,
    isActive: boolean
  ) => Promise<unknown>;
}

const coverageAreaService: CoverageAreaService = {
  // Inherit all basic CRUD operations
  ...apiService,

  // Add extra custom API methods here
  toggleActiveStatus: async (id: number | string, isActive: boolean) => {
    try {
      const response = await apiService.updateItem(id, {
        is_active: isActive,
      });
      return response;
    } catch (error) {
      console.error("Error toggling coverage area status:", error);
      throw error;
    }
  },
};

export default coverageAreaService;
