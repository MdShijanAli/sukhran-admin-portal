import apiClient from "@/api/apiClient";
import { apiRoutes } from "@/api/apiRoutes";

const dashboardService = {
  getStatistics: async (period: string = "today") => {
    try {
      const response = await apiClient.get(
        `${apiRoutes.dashboard.statistics}?period=${period}`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching dashboard statistics:", error);
      throw error;
    }
  },
};

export default dashboardService;
