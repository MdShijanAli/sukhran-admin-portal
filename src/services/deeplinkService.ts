import apiClient from "@/api/apiClient";
import { apiRoutes } from "@/api/apiRoutes";

export interface ShareLinkResponse {
  status: string;
  share_url: string;
  meta_title: string;
  meta_desc: string;
}

const deeplinkService = {
  generateHomeLink: async (): Promise<ShareLinkResponse> => {
    try {
      const response = await apiClient.get<ShareLinkResponse>(
        apiRoutes.deeplink.home,
      );
      return response.data;
    } catch (error) {
      console.error("Error generating home deeplink:", error);
      throw error;
    }
  },

  generateProductLink: async (
    productId: number | string,
  ): Promise<ShareLinkResponse> => {
    try {
      const response = await apiClient.get<ShareLinkResponse>(
        apiRoutes.deeplink.product(productId),
      );
      return response.data;
    } catch (error) {
      console.error("Error generating product deeplink:", error);
      throw error;
    }
  },

  generatePackageLink: async (
    packageId: number | string,
  ): Promise<ShareLinkResponse> => {
    try {
      const response = await apiClient.get<ShareLinkResponse>(
        apiRoutes.deeplink.package(packageId),
      );
      return response.data;
    } catch (error) {
      console.error("Error generating package deeplink:", error);
      throw error;
    }
  },

  generateCategoryLink: async (
    categoryId: number | string,
  ): Promise<ShareLinkResponse> => {
    try {
      const response = await apiClient.get<ShareLinkResponse>(
        apiRoutes.deeplink.category(categoryId),
      );
      return response.data;
    } catch (error) {
      console.error("Error generating category deeplink:", error);
      throw error;
    }
  },
};

export default deeplinkService;
