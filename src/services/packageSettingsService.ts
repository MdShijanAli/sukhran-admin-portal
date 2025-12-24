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
  enablePackageSettings: (id: number, enabled: boolean) => Promise<unknown>;
}

const packageSettingsService: PackageSettingsService = {
  fetchSettings: async () => {
    try {
      usePackageSettingsStore.getState().setLoading(true);
      const response = await apiClient.get(apiRoutes.packages.packageSettings);
      usePackageSettingsStore.getState().setSettings(response.data);
      return response.data;
    } catch (error) {
      usePackageSettingsStore
        .getState()
        .setError("Failed to fetch package settings");
      throw error;
    } finally {
      usePackageSettingsStore.getState().setLoading(false);
    }
  },

  updateSetting: async (id: number | string, value: string) => {
    try {
      usePackageSettingsStore.getState().setLoading(true);
      const response = await apiClient.put(
        apiRoutes.packages.updatePackageSettings,
        { value }
      );
      usePackageSettingsStore.getState().updateSetting(id, value);
      return response.data;
    } catch (error) {
      usePackageSettingsStore.getState().setError("Failed to update setting");
      throw error;
    } finally {
      usePackageSettingsStore.getState().setLoading(false);
    }
  },

  enablePackageSettings: async (id: number, enabled: boolean) => {
    try {
      usePackageSettingsStore.getState().setLoading(true);
      const response = await apiClient.put(
        apiRoutes.packages.enablePackageSettings,
        { value: enabled.toString() }
      );
      if (response.status === 200) {
        usePackageSettingsStore
          .getState()
          .updateSetting(id, enabled.toString());
      }
      return response.data;
    } catch (error) {
      usePackageSettingsStore
        .getState()
        .setError("Failed to update enabled setting");
      throw error;
    } finally {
      usePackageSettingsStore.getState().setLoading(false);
    }
  },

  fetchScheduleOptions: async () => {
    try {
      usePackageSettingsStore.getState().setLoading(true);
      const response = await apiClient.get(apiRoutes.packages.packageSchedule);
      usePackageSettingsStore.getState().setScheduleOptions(response.data);
      return response.data;
    } catch (error) {
      usePackageSettingsStore
        .getState()
        .setError("Failed to fetch schedule options");
      throw error;
    } finally {
      usePackageSettingsStore.getState().setLoading(false);
    }
  },

  setupSchedule: async (options: ScheduleOptionFormData[]) => {
    try {
      usePackageSettingsStore.getState().setLoading(true);
      const response = await apiClient.post(apiRoutes.packages.setupSchedule, {
        options,
      });
      // Refetch to get updated data
      await packageSettingsService.fetchScheduleOptions();
      return response.data;
    } catch (error) {
      usePackageSettingsStore.getState().setError("Failed to setup schedule");
      throw error;
    } finally {
      usePackageSettingsStore.getState().setLoading(false);
    }
  },

  modifySchedule: async (
    options: Partial<ScheduleOptionFormData & { id: number }>[]
  ) => {
    try {
      usePackageSettingsStore.getState().setLoading(true);
      const response = await apiClient.put(apiRoutes.packages.setupSchedule, {
        options,
      });
      // Refetch to get updated data
      await packageSettingsService.fetchScheduleOptions();
      return response.data;
    } catch (error) {
      usePackageSettingsStore.getState().setError("Failed to modify schedule");
      throw error;
    } finally {
      usePackageSettingsStore.getState().setLoading(false);
    }
  },

  deleteScheduleOptions: async (ids: number[]) => {
    console.log("Deleting schedule options with IDs:", ids);
    try {
      usePackageSettingsStore.getState().setLoading(true);
      const response = await apiClient.delete(
        apiRoutes.packages.setupSchedule,
        {
          data: {
            ids: ids,
          },
        }
      );
      // Remove from usePackageSettingsStore.getState()
      ids.forEach((id) => {
        const options = usePackageSettingsStore.getState().scheduleOptions;
        if (options) {
          Object.keys(options).forEach((key) => {
            const optionType = key as
              | "schedule_months"
              | "frequency_per_month"
              | "delivery_time";
            usePackageSettingsStore
              .getState()
              .removeScheduleOption(optionType, id);
          });
        }
      });
      return response.data;
    } catch (error) {
      usePackageSettingsStore
        .getState()
        .setError("Failed to delete schedule options");
      throw error;
    } finally {
      usePackageSettingsStore.getState().setLoading(false);
    }
  },

  bulkToggleSchedule: async (ids: number[], isActive: boolean) => {
    try {
      usePackageSettingsStore.getState().setLoading(true);
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
      usePackageSettingsStore
        .getState()
        .setError("Failed to toggle schedule status");
      throw error;
    } finally {
      usePackageSettingsStore.getState().setLoading(false);
    }
  },
};

export default packageSettingsService;
