import apiClient from "@/api/apiClient";
import { apiRoutes } from "@/api/apiRoutes";
import { usePackageSettingsStore } from "@/stores/packageSettingsStore";
import { ScheduleOptionFormData } from "@/lib/types";

interface PackageSettingsService {
  fetchSettings: () => Promise<unknown>;
  updateSetting: (id: number | string, value: string) => Promise<unknown>;
  fetchScheduleOptions: () => Promise<unknown>;
  setupSchedule: (options: ScheduleOptionFormData[]) => Promise<unknown>;
  modifySchedule: (
    options: Partial<ScheduleOptionFormData & { id: number }>[]
  ) => Promise<unknown>;
  deleteScheduleOptions: (ids: number[]) => Promise<unknown>;
  bulkToggleSchedule: (ids: number[], isActive: boolean) => Promise<unknown>;
  enablePackageSettings: (enabled: boolean) => Promise<unknown>;
}

const packageSettingsService: PackageSettingsService = {
  fetchSettings: async () => {
    const store = usePackageSettingsStore.getState();
    try {
      store.setLoading(true);
      const response = await apiClient.get(apiRoutes.packages.packageSettings);
      store.setSettings(response.data);
      return response.data;
    } catch (error) {
      store.setError("Failed to fetch package settings");
      throw error;
    }
  },

  updateSetting: async (id: number | string, value: string) => {
    const store = usePackageSettingsStore.getState();
    try {
      store.setLoading(true);
      const response = await apiClient.put(
        apiRoutes.packages.updatePackageSettings,
        { value }
      );
      store.updateSetting(id, value);
      return response.data;
    } catch (error) {
      store.setError("Failed to update setting");
      throw error;
    }
  },

  enablePackageSettings: async (enabled: boolean) => {
    const store = usePackageSettingsStore.getState();
    try {
      store.setLoading(true);
      const response = await apiClient.put(
        apiRoutes.packages.enablePackageSettings,
        { enabled }
      );
      return response.data;
    } catch (error) {
      store.setError("Failed to update enabled setting");
      throw error;
    }
  },

  fetchScheduleOptions: async () => {
    const store = usePackageSettingsStore.getState();
    try {
      store.setLoading(true);
      const response = await apiClient.get(apiRoutes.packages.packageSchedule);
      store.setScheduleOptions(response.data);
      return response.data;
    } catch (error) {
      store.setError("Failed to fetch schedule options");
      throw error;
    }
  },

  setupSchedule: async (options: ScheduleOptionFormData[]) => {
    const store = usePackageSettingsStore.getState();
    try {
      store.setLoading(true);
      const response = await apiClient.post(apiRoutes.packages.setupSchedule, {
        options,
      });
      // Refetch to get updated data
      await packageSettingsService.fetchScheduleOptions();
      return response.data;
    } catch (error) {
      store.setError("Failed to setup schedule");
      throw error;
    }
  },

  modifySchedule: async (
    options: Partial<ScheduleOptionFormData & { id: number }>[]
  ) => {
    const store = usePackageSettingsStore.getState();
    try {
      store.setLoading(true);
      const response = await apiClient.post(apiRoutes.packages.setupSchedule, {
        options,
      });
      // Refetch to get updated data
      await packageSettingsService.fetchScheduleOptions();
      return response.data;
    } catch (error) {
      store.setError("Failed to modify schedule");
      throw error;
    }
  },

  deleteScheduleOptions: async (ids: number[]) => {
    const store = usePackageSettingsStore.getState();
    try {
      store.setLoading(true);
      const response = await apiClient.post(apiRoutes.packages.setupSchedule, {
        ids,
      });
      // Remove from store
      ids.forEach((id) => {
        const options = store.scheduleOptions;
        if (options) {
          Object.keys(options).forEach((key) => {
            const optionType = key as
              | "schedule_months"
              | "frequency_per_month"
              | "delivery_time";
            store.removeScheduleOption(optionType, id);
          });
        }
      });
      return response.data;
    } catch (error) {
      store.setError("Failed to delete schedule options");
      throw error;
    }
  },

  bulkToggleSchedule: async (ids: number[], isActive: boolean) => {
    const store = usePackageSettingsStore.getState();
    try {
      store.setLoading(true);
      const response = await apiClient.patch(
        apiRoutes.packages.packageScheduleBulkToggle,
        {
          ids,
          isActive,
        }
      );
      // Refetch to get updated data
      await packageSettingsService.fetchScheduleOptions();
      return response.data;
    } catch (error) {
      store.setError("Failed to toggle schedule status");
      throw error;
    }
  },
};

export default packageSettingsService;
