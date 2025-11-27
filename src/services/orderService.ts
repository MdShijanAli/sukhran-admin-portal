import { createApiService, ApiService } from "./createApiService";
import { apiRoutes } from "@/api/apiRoutes";
import { useOrderStore, Order } from "@/stores/orderStore";
import apiClient from "@/api/apiClient";

// Create base API service with all CRUD operations
const apiService = createApiService<Order>(
  apiRoutes.orders,
  useOrderStore.getState()
);

interface OrderService extends ApiService<Order> {
  toggleOrderStatus: (id: number | string) => Promise<unknown>;
  getOrdersStatistics: () => Promise<unknown>;
  assignDeliveryAgent: (
    id: number | string,
    agentId: string
  ) => Promise<unknown>;
}

const orderService: OrderService = {
  // Inherit all basic CRUD operations
  ...apiService,

  // Add extra custom API methods here
  toggleOrderStatus: async (id: number | string): Promise<Order> => {
    try {
      const response = await apiClient.patch(
        apiRoutes.orders.toggleOrderStatus(id)
      );
      console.log("Toggle order status response:", response.data);
      if (response && response.status === 200) {
        useOrderStore.getState().updateItem(id, response.data.order);
      }
      return response.data.order;
    } catch (error) {
      console.error("Error toggling order status:", error);
      throw error;
    }
  },

  getOrdersStatistics: async () => {
    try {
      const response = await apiClient.get(apiRoutes.orders.getStatistics);
      return response.data;
    } catch (error) {
      console.error("Error fetching orders statistics:", error);
      throw error;
    }
  },

  assignDeliveryAgent: async (id: number | string, agentId: string) => {
    try {
      const response = await apiClient.post(apiRoutes.orders.assignAgent(id), {
        agent_id: agentId,
      });
      if (response && response.status === 200) {
        useOrderStore.getState().updateItem(id, response.data.order);
      }
      return response.data;
    } catch (error) {
      console.error("Error assigning delivery agent:", error);
      throw error;
    }
  },
};

export default orderService;
