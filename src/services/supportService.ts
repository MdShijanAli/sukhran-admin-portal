import { createApiService, ApiService } from "./createApiService";
import { apiRoutes } from "@/api/apiRoutes";
import { useSupportStore, SupportTicket } from "@/stores/supportStore";
import apiClient from "@/api/apiClient";

// Create base API service with all CRUD operations
const apiService = createApiService<SupportTicket>(
  apiRoutes.supports,
  useSupportStore.getState(),
);

interface SupportService extends ApiService<SupportTicket> {
  getStatistics: () => Promise<unknown>;
  getCustomerList: (query: string) => Promise<unknown>;
  getOrdersList: (query: string) => Promise<unknown>;
  changeStatus: (
    id: number | string,
    status: string,
    notes?: string,
  ) => Promise<unknown>;
  changePriority: (id: number | string, priority: string) => Promise<unknown>;
  resolveTicket: (
    id: number | string,
    resolutionNote: string,
  ) => Promise<unknown>;
  closeTicket: (
    id: number | string,
    resolutionNote: string,
  ) => Promise<unknown>;
  bulkAction: (action: string, ticketIds: number[]) => Promise<unknown>;
}

const supportService: SupportService = {
  // Inherit all basic CRUD operations
  ...apiService,

  // Get support statistics
  getStatistics: async () => {
    try {
      const response = await apiClient.get(apiRoutes.supports.statistics);
      if (response && response.status === 200) {
        useSupportStore.getState().setStatistics(response.data.data);
      }
      return response.data;
    } catch (error) {
      console.error("Error fetching support statistics:", error);
      throw error;
    }
  },

  // Get users list for ticket creation
  getCustomerList: async (query: string) => {
    try {
      const response = await apiClient.get(
        `${apiRoutes.users.getAll}?role_id=1${query ? query : ""}`,
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching users list:", error);
      throw error;
    }
  },

  // Get orders list for ticket creation
  getOrdersList: async (query: string) => {
    const queryString = query ? `?q=${query}` : "";
    try {
      const response = await apiClient.get(
        `${apiRoutes.supports.orderLists}${queryString}`,
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching orders list:", error);
      throw error;
    }
  },

  // Change ticket status
  changeStatus: async (id: number | string, status: string, notes?: string) => {
    try {
      const payload: any = { status };
      if (notes) {
        payload.notes = notes;
      }
      const response = await apiClient.patch(
        apiRoutes.supports.changeStatus(id),
        payload,
      );
      return response.data;
    } catch (error) {
      console.error("Error changing ticket status:", error);
      throw error;
    }
  },

  // Change ticket priority
  changePriority: async (id: number | string, priority: string) => {
    try {
      const response = await apiClient.patch(
        apiRoutes.supports.changePriority(id),
        { priority },
      );
      return response.data;
    } catch (error) {
      console.error("Error changing ticket priority:", error);
      throw error;
    }
  },

  // Resolve ticket
  resolveTicket: async (id: number | string, resolutionNote: string) => {
    try {
      const response = await apiClient.post(
        apiRoutes.supports.reslvedTicket(id),
        { resolution_note: resolutionNote },
      );
      return response.data;
    } catch (error) {
      console.error("Error resolving ticket:", error);
      throw error;
    }
  },

  // Close ticket
  closeTicket: async (id: number | string, resolutionNote: string) => {
    try {
      const response = await apiClient.post(
        apiRoutes.supports.closeTicket(id),
        {
          resolution_note: resolutionNote,
        },
      );
      return response.data;
    } catch (error) {
      console.error("Error closing ticket:", error);
      throw error;
    }
  },

  // Bulk actions
  bulkAction: async (action: string, ticketIds: number[]) => {
    try {
      const response = await apiClient.post(apiRoutes.supports.bulkActions, {
        action,
        ticket_ids: ticketIds,
      });
      return response.data;
    } catch (error) {
      console.error("Error performing bulk action:", error);
      throw error;
    }
  },
};

export default supportService;
