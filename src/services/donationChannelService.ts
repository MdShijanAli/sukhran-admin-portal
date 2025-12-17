import { createApiService, ApiService } from "./createApiService";
import { apiRoutes } from "@/api/apiRoutes";
import { useDonationChannelStore } from "@/stores/donationChannelStore";
import apiClient from "@/api/apiClient";
import { DonationChannel, ReorderChannelsPayload } from "@/lib/types";

// Create base API service with all CRUD operations
const apiService = createApiService<DonationChannel>(
  apiRoutes.donationChannels,
  useDonationChannelStore.getState()
);

interface DonationChannelService extends ApiService<DonationChannel> {
  reorderChannels: (data: ReorderChannelsPayload) => Promise<unknown>;
}

const donationChannelService: DonationChannelService = {
  // Inherit all basic CRUD operations
  ...apiService,

  // Reorder donation channels
  reorderChannels: async (data: ReorderChannelsPayload) => {
    try {
      const response = await apiClient.post(
        apiRoutes.donationChannels.reorder,
        data
      );
      return response.data;
    } catch (error) {
      console.error("Error reordering channels:", error);
      throw error;
    }
  },
};

export default donationChannelService;
