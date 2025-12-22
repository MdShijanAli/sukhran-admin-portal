import { createApiService, ApiService } from "./createApiService";
import { apiRoutes } from "@/api/apiRoutes";
import { useNotificationStore, Notification } from "@/stores/notificationStore";
import apiClient from "@/api/apiClient";

// Create base API service with all CRUD operations
const apiService = createApiService<Notification>(
  apiRoutes.notifications,
  useNotificationStore.getState()
);

interface SendNotificationParams {
  title: string;
  body: string;
  image?: File;
  link_type?: "none" | "product" | "package" | "url";
  package_id?: number | string;
  target_audience?: "all" | "specific";
  target_user_ids?: (number | string)[];
}

interface TestNotificationParams {
  fcm_token: string;
  title: string;
  body: string;
}

interface NotificationService extends ApiService<Notification> {
  sendNotification: (params: SendNotificationParams) => Promise<unknown>;
  testNotification: (params: TestNotificationParams) => Promise<unknown>;
}

const notificationService: NotificationService = {
  // Inherit all basic CRUD operations
  ...apiService,

  // Send notification to all or specific users
  sendNotification: async (
    params: SendNotificationParams
  ): Promise<unknown> => {
    try {
      const formData = new FormData();
      formData.append("title", params.title);
      formData.append("body", params.body);

      if (params.image) {
        formData.append("image", params.image);
      }

      if (params.link_type) {
        formData.append("link_type", params.link_type);
      }

      if (params.package_id) {
        formData.append("package_id", params.package_id.toString());
      }

      if (params.target_audience) {
        formData.append("target_audience", params.target_audience);
      }

      if (params.target_user_ids && params.target_user_ids.length > 0) {
        params.target_user_ids.forEach((id, index) => {
          formData.append(`target_user_ids[${index}]`, id.toString());
        });
      }

      const response = await apiClient.post(
        apiRoutes.notifications.send,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("Send notification response:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error sending notification:", error);
      throw error;
    }
  },

  // Test notification with FCM token
  testNotification: async (
    params: TestNotificationParams
  ): Promise<unknown> => {
    try {
      const response = await apiClient.post(
        apiRoutes.notifications.test,
        params
      );

      console.log("Test notification response:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error testing notification:", error);
      throw error;
    }
  },
};

export default notificationService;
