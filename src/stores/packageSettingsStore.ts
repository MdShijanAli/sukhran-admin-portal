import { createStore } from "./createStore";
import {
  PackageSetting,
  PackageScheduleOptions,
  ScheduleOption,
} from "@/lib/types";

interface PackageSettingsState {
  settings: PackageSetting[];
  scheduleOptions: PackageScheduleOptions | null;
  isLoading: boolean;
  error: string | null;
  setSettings: (settings: unknown) => void;
  updateSetting: (id: number | string, value: string) => void;
  setScheduleOptions: (options: unknown) => void;
  updateScheduleOption: (
    optionType: "schedule_months" | "frequency_per_month" | "delivery_time",
    id: number,
    updates: Partial<ScheduleOption>
  ) => void;
  removeScheduleOption: (
    optionType: "schedule_months" | "frequency_per_month" | "delivery_time",
    id: number
  ) => void;
  addScheduleOption: (
    optionType: "schedule_months" | "frequency_per_month" | "delivery_time",
    option: ScheduleOption
  ) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const usePackageSettingsStore = createStore<PackageSettingsState>(
  (set, get) => ({
    settings: [],
    scheduleOptions: null,
    isLoading: false,
    error: null,

    setSettings: (data: unknown) => {
      const settings = Array.isArray(data)
        ? data
        : (data as { data?: PackageSetting[] })?.data || [];
      set({
        settings,
        isLoading: false,
        error: null,
      });
    },

    updateSetting: (id: number | string, value: string) => {
      set((state) => ({
        settings: state.settings.map((s) =>
          s.id === id ? { ...s, value } : s
        ),
        isLoading: false,
        error: null,
      }));
    },

    setScheduleOptions: (data: unknown) => {
      const scheduleOptions =
        (data as { data?: PackageScheduleOptions })?.data || null;
      set({
        scheduleOptions,
        isLoading: false,
        error: null,
      });
    },

    updateScheduleOption: (optionType, id, updates) => {
      set((state) => {
        if (!state.scheduleOptions) return state;
        return {
          scheduleOptions: {
            ...state.scheduleOptions,
            [optionType]: state.scheduleOptions[optionType].map((opt) =>
              opt.id === id ? { ...opt, ...updates } : opt
            ),
          },
          isLoading: false,
          error: null,
        };
      });
    },

    removeScheduleOption: (optionType, id) => {
      set((state) => {
        if (!state.scheduleOptions) return state;
        return {
          scheduleOptions: {
            ...state.scheduleOptions,
            [optionType]: state.scheduleOptions[optionType].filter(
              (opt) => opt.id !== id
            ),
          },
          isLoading: false,
          error: null,
        };
      });
    },

    addScheduleOption: (optionType, option) => {
      set((state) => {
        if (!state.scheduleOptions) return state;
        return {
          scheduleOptions: {
            ...state.scheduleOptions,
            [optionType]: [...state.scheduleOptions[optionType], option],
          },
          isLoading: false,
          error: null,
        };
      });
    },

    setLoading: (loading: boolean) => {
      set({ isLoading: loading });
    },

    setError: (error: string | null) => {
      set({ error, isLoading: false });
    },
  }),
  "package-settings-storage"
);
