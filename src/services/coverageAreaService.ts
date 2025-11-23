import { createApiService, ApiService } from "./createApiService";
import { apiRoutes } from "@/api/apiRoutes";
import { useCoverageAreaStore } from "@/stores/coverageAreaStore";
import { CoverageArea } from "@/lib/types";
import apiClient from "@/api/apiClient";

// Create base API service with all CRUD operations
const apiService = createApiService<CoverageArea>(
  apiRoutes.coverageAreas,
  useCoverageAreaStore.getState()
);

interface CoverageAreaService extends ApiService<CoverageArea> {
  toggleActiveStatus: (area: CoverageArea) => Promise<unknown>;
  updateCoverageArea: (id: number | string, data: unknown) => Promise<unknown>;
}

const coverageAreaService: CoverageAreaService = {
  // Inherit all basic CRUD operations
  ...apiService,

  // Add extra custom API methods here
  toggleActiveStatus: async (area: CoverageArea) => {
    try {
      const response = await apiClient.patch(
        apiRoutes.coverageAreas.toggleCoverageAreaStatus(area.id)
      );
      console.log("Toggle active status response:", response.data);
      if (response && response.status === 200) {
        useCoverageAreaStore.getState().updateItem(area.id, response.data.data);
        useCoverageAreaStore.getState().setStats(response.data.data);
      }
      return response;
    } catch (error) {
      console.error("Error toggling coverage area status:", error);
      throw error;
    }
  },
  updateCoverageArea: async (id: number | string, data: unknown) => {
    try {
      const response = await apiClient.put(
        apiRoutes.coverageAreas.update(id),
        data
      );
      console.log("Update coverage area response:", response.data);
      if (response && response.status === 200) {
        useCoverageAreaStore.getState().updateItem(id, response.data.data);
      }
      return response;
    } catch (error) {
      console.error("Error updating coverage area:", error);
      throw error;
    }
  },
};

export default coverageAreaService;
