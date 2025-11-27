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
  getOrdersStatistics: () => Promise<unknown>;
  updateOrderStatus: (
    id: number | string,
    status: string,
    note?: string
  ) => Promise<unknown>;
  addItemToOrder: (
    id: number | string,
    data: {
      itemType: "product" | "package";
      productId?: number | string;
      skuId?: number | string;
      quantity: number;
      reason: string;
    }
  ) => Promise<unknown>;
  removeItemFromOrder: (
    orderId: number | string,
    itemId: number | string,
    reason: string
  ) => Promise<unknown>;
  updateItemQuantity: (
    orderId: number | string,
    itemId: number | string,
    quantity: number,
    reason: string
  ) => Promise<unknown>;
  updateDeliveryTime: (
    id: number | string,
    data: {
      estimatedDeliveryFrom: string;
      estimatedDeliveryTo: string;
      reason: string;
    }
  ) => Promise<unknown>;
  getModificationHistory: (id: number | string) => Promise<unknown>;
}

const orderService: OrderService = {
  // Inherit all basic CRUD operations
  ...apiService,

  // Add extra custom API methods here
  getOrdersStatistics: async () => {
    try {
      const response = await apiClient.get(apiRoutes.orders.getStatistics);
      return response.data;
    } catch (error) {
      console.error("Error fetching orders statistics:", error);
      throw error;
    }
  },

  updateOrderStatus: async (
    id: number | string,
    status: string,
    note?: string
  ) => {
    try {
      const response = await apiClient.put(apiRoutes.orders.updateStatus(id), {
        status,
        note,
      });
      return response.data;
    } catch (error) {
      console.error("Error updating order status:", error);
      throw error;
    }
  },

  addItemToOrder: async (
    id: number | string,
    data: {
      itemType: "product" | "package";
      productId?: number | string;
      skuId?: number | string;
      quantity: number;
      reason: string;
    }
  ) => {
    try {
      const response = await apiClient.post(apiRoutes.orders.addItem(id), data);
      if (response && response.status === 200) {
        useOrderStore.getState().updateItem(id, response.data.order);
      }
      return response.data;
    } catch (error) {
      console.error("Error adding item to order:", error);
      throw error;
    }
  },

  removeItemFromOrder: async (
    orderId: number | string,
    itemId: number | string,
    reason: string
  ) => {
    try {
      const response = await apiClient.delete(
        apiRoutes.orders.removeItem(orderId, itemId),
        {
          data: { reason },
        }
      );
      if (response && response.status === 200) {
        useOrderStore.getState().updateItem(orderId, response.data.order);
      }
      return response.data;
    } catch (error) {
      console.error("Error removing item from order:", error);
      throw error;
    }
  },

  updateItemQuantity: async (
    orderId: number | string,
    itemId: number | string,
    quantity: number,
    reason: string
  ) => {
    try {
      const response = await apiClient.patch(
        apiRoutes.orders.updateItemQuantity(orderId, itemId),
        {
          quantity,
          reason,
        }
      );
      if (response && response.status === 200) {
        useOrderStore.getState().updateItem(orderId, response.data.order);
      }
      return response.data;
    } catch (error) {
      console.error("Error updating item quantity:", error);
      throw error;
    }
  },

  updateDeliveryTime: async (
    id: number | string,
    data: {
      estimatedDeliveryFrom: string;
      estimatedDeliveryTo: string;
      reason: string;
    }
  ) => {
    try {
      const response = await apiClient.put(
        apiRoutes.orders.updateDeliveryTime(id),
        data
      );
      if (response && response.status === 200) {
        useOrderStore.getState().updateItem(id, response.data.order);
      }
      return response.data;
    } catch (error) {
      console.error("Error updating delivery time:", error);
      throw error;
    }
  },

  getModificationHistory: async (id: number | string) => {
    try {
      const response = await apiClient.get(
        apiRoutes.orders.getModifications(id)
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching modification history:", error);
      throw error;
    }
  },
};

export default orderService;
