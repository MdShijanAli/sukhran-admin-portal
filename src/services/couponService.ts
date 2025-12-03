import { createApiService, ApiService } from "./createApiService";
import { apiRoutes } from "@/api/apiRoutes";
import { useCouponStore } from "@/stores/couponStore";
import { Coupon } from "@/lib/types";
import apiClient from "@/api/apiClient";

// Create base API service with all CRUD operations
const apiService = createApiService<Coupon>(
  apiRoutes.coupons,
  useCouponStore.getState()
);

interface CouponService extends ApiService<Coupon> {
  toggleStatus: (coupon: Coupon) => Promise<unknown>;
  updateCoupon: (id: number | string, data: unknown) => Promise<unknown>;
}

const couponService: CouponService = {
  // Inherit all basic CRUD operations
  ...apiService,

  // Add custom API methods
  toggleStatus: async (coupon: Coupon) => {
    try {
      const response = await apiClient.patch(
        apiRoutes.coupons.toggleStatus(coupon.id)
      );
      console.log("Toggle status response:", response.data);
      if (response && response.status === 200) {
        useCouponStore.getState().updateItem(coupon.id, response.data.data);
      }
      return response;
    } catch (error) {
      console.error("Error toggling coupon status:", error);
      throw error;
    }
  },

  updateCoupon: async (id: number | string, data: unknown) => {
    try {
      const response = await apiClient.put(apiRoutes.coupons.update(id), data);
      console.log("Update coupon response:", response.data);
      if (response && response.status === 200) {
        useCouponStore.getState().updateItem(id, response.data.data);
      }
      return response;
    } catch (error) {
      console.error("Error updating coupon:", error);
      throw error;
    }
  },
};

export default couponService;
