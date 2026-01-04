import { createApiService, ApiService } from "./createApiService";
import { apiRoutes } from "@/api/apiRoutes";
import { useOrderStore, Order } from "@/stores/orderStore";
import { usePackageOrderStore } from "@/stores/packageOrderStore";
import apiClient from "@/api/apiClient";
import {
  SetDeliveryDatePayload,
  ModifyItemsPayload,
  PauseOrderPayload,
  ResumeOrderPayload,
  CancelOrderPayload,
} from "@/lib/types";

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
  // Package Order Methods
  fetchPackageOrders: (params?: string) => Promise<unknown>;
  fetchPackageOrderDetails: (batchId: string) => Promise<unknown>;
  setPackageOrderDeliveryDate: (
    orderId: number | string,
    data: SetDeliveryDatePayload
  ) => Promise<unknown>;
  modifyPackageOrderItems: (
    orderId: number | string,
    data: ModifyItemsPayload
  ) => Promise<unknown>;
  pausePackageOrder: (
    orderId: number | string,
    data: PauseOrderPayload
  ) => Promise<unknown>;
  resumePackageOrder: (
    orderId: number | string,
    data: ResumeOrderPayload
  ) => Promise<unknown>;
  cancelPackageOrder: (
    orderId: number | string,
    data: CancelOrderPayload
  ) => Promise<unknown>;
  markCODOrderAsPaid: (id: number | string, data: unknown) => Promise<unknown>;
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

  // Package Order Methods
  fetchPackageOrders: async (params?: string) => {
    try {
      usePackageOrderStore.getState().setLoading(true);
      const url = params
        ? `${apiRoutes.orders.getAllPackageOrders}?${params}`
        : apiRoutes.orders.getAllPackageOrders;

      const response = await apiClient.get(url);
      console.log("Package orders response:", response.data);

      if (response && response.status === 200) {
        usePackageOrderStore.getState().setItems(response.data);
        return response.data;
      }
      throw new Error("Failed to fetch package orders");
    } catch (error) {
      console.error("Error fetching package orders:", error);
      usePackageOrderStore
        .getState()
        .setError("Failed to fetch package orders");
      throw error;
    } finally {
      usePackageOrderStore.getState().setLoading(false);
    }
  },

  fetchPackageOrderDetails: async (batchId: string) => {
    try {
      const response = await apiClient.get(
        apiRoutes.orders.getSinglePackageOrder(batchId)
      );
      console.log("Package order details response:", response.data);

      if (response && response.status === 200) {
        return response.data;
      }
      throw new Error("Failed to fetch package order details");
    } catch (error) {
      console.error("Error fetching package order details:", error);
      throw error;
    }
  },

  setPackageOrderDeliveryDate: async (
    orderId: number | string,
    data: SetDeliveryDatePayload
  ) => {
    try {
      const response = await apiClient.patch(
        apiRoutes.orders.setDeliveryDate(orderId),
        data
      );
      return response.data;
    } catch (error) {
      console.error("Error setting delivery date:", error);
      throw error;
    }
  },

  modifyPackageOrderItems: async (
    orderId: number | string,
    data: ModifyItemsPayload
  ) => {
    try {
      const response = await apiClient.patch(
        apiRoutes.orders.modifyItems(orderId),
        data
      );
      return response.data;
    } catch (error) {
      console.error("Error modifying items:", error);
      throw error;
    }
  },

  pausePackageOrder: async (
    orderId: number | string,
    data: PauseOrderPayload
  ) => {
    try {
      const response = await apiClient.post(
        apiRoutes.orders.pauseOrder(orderId),
        data
      );
      return response.data;
    } catch (error) {
      console.error("Error pausing order:", error);
      throw error;
    }
  },

  resumePackageOrder: async (
    orderId: number | string,
    data: ResumeOrderPayload
  ) => {
    try {
      const response = await apiClient.post(
        apiRoutes.orders.resumeOrder(orderId),
        data
      );
      return response.data;
    } catch (error) {
      console.error("Error resuming order:", error);
      throw error;
    }
  },

  cancelPackageOrder: async (
    orderId: number | string,
    data: CancelOrderPayload
  ) => {
    try {
      const response = await apiClient.delete(
        apiRoutes.orders.cancelOrder(orderId),
        { data }
      );
      return response.data;
    } catch (error) {
      console.error("Error cancelling order:", error);
      throw error;
    }
  },

  markCODOrderAsPaid: async (id: number | string, data: unknown) => {
    try {
      const response = await apiClient.put(
        apiRoutes.orders.markCODOrderAsPaid(id),
        data
      );
      return response.data;
    } catch (error) {
      console.error("Error marking COD order as paid:", error);
      throw error;
    }
  },
};

export default orderService;
