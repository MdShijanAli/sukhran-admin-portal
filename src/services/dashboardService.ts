import apiClient from "@/api/apiClient";
import { apiRoutes } from "@/api/apiRoutes";

const dashboardService = {
  getStatistics: async (queryString?: string) => {
    try {
      const response = await apiClient.get(
        `${apiRoutes.dashboard.statistics}${
          queryString ? `?${queryString}` : ""
        }`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching dashboard statistics:", error);
      throw error;
    }
  },
};

export default dashboardService;
