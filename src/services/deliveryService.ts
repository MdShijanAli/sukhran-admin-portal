import { createApiService, ApiService } from "./createApiService";
import { apiRoutes } from "@/api/apiRoutes";
import { useDeliveryStore, Delivery } from "@/stores/deliveryStore";
import apiClient from "@/api/apiClient";

// Create base API service with all CRUD operations
const apiService = createApiService<Delivery>(
  apiRoutes.delivery,
  useDeliveryStore.getState()
);

interface DeliveryService extends ApiService<Delivery> {
  toggleDeliveryStatus: (id: number | string) => Promise<unknown>;
  getDeliveryStatistics: () => Promise<unknown>;
  assignDriver: (id: number | string, driverId: string) => Promise<unknown>;
  updateLocation: (
    id: number | string,
    location: { latitude: number; longitude: number }
  ) => Promise<unknown>;
}

const deliveryService: DeliveryService = {
  // Inherit all basic CRUD operations
  ...apiService,

  // Add extra custom API methods here
  toggleDeliveryStatus: async (id: number | string): Promise<Delivery> => {
    try {
      const response = await apiClient.patch(
        apiRoutes.delivery.toggleDeliveryStatus(id)
      );
      console.log("Toggle delivery status response:", response.data);
      if (response && response.status === 200) {
        useDeliveryStore.getState().updateItem(id, response.data.delivery);
      }
      return response.data.delivery;
    } catch (error) {
      console.error("Error toggling delivery status:", error);
      throw error;
    }
  },

  getDeliveryStatistics: async () => {
    try {
      const response = await apiClient.get(apiRoutes.delivery.getStatistics);
      return response.data;
    } catch (error) {
      console.error("Error fetching delivery statistics:", error);
      throw error;
    }
  },

  assignDriver: async (id: number | string, driverId: string) => {
    try {
      const response = await apiClient.post(
        apiRoutes.delivery.assignDriver(id),
        { driver_id: driverId }
      );
      if (response && response.status === 200) {
        useDeliveryStore.getState().updateItem(id, response.data.delivery);
      }
      return response.data;
    } catch (error) {
      console.error("Error assigning driver:", error);
      throw error;
    }
  },

  updateLocation: async (
    id: number | string,
    location: { latitude: number; longitude: number }
  ) => {
    try {
      const response = await apiClient.post(
        apiRoutes.delivery.updateLocation(id),
        location
      );
      if (response && response.status === 200) {
        useDeliveryStore.getState().updateItem(id, response.data.delivery);
      }
      return response.data;
    } catch (error) {
      console.error("Error updating location:", error);
      throw error;
    }
  },
};

export default deliveryService;
