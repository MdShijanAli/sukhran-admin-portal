import { CoverageArea, CoverageAreaPaginationMeta } from "@/lib/types";
import { createStore } from "./createStore";

interface CoverageAreaState {
  coverageAreas: CoverageArea[];
  pagination: CoverageAreaPaginationMeta;
  isLoading: boolean;
  error: string | null;
  setItems: (coverageAreas: unknown) => void;
  addItem: (coverageArea: unknown) => void;
  updateItem: (id: number | string, coverageArea: unknown) => void;
  removeItem: (id: number | string) => void;
  getCoverageAreaById: (id: number | string) => CoverageArea | undefined;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setStats: (stats: Partial<CoverageAreaPaginationMeta["stats"]>) => void;
}

export const useCoverageAreaStore = createStore<CoverageAreaState>(
  (set, get) => ({
    coverageAreas: [],
    pagination: {
      current_page: 1,
      total: 0,
      per_page: 20,
      last_page: 1,
      from: 1,
      to: 1,
      stats: {
        total_areas: 0,
        active_areas: 0,
        inactive_areas: 0,
        cities: [],
      },
    },
    isLoading: false,
    error: null,

    setItems: (data: unknown) => {
      // Handle both array and object responses
      const coverageAreas = Array.isArray(data)
        ? data
        : (data as { data?: CoverageArea[] })?.data || [];
      set({
        coverageAreas,
        isLoading: false,
        error: null,
        pagination:
          (data as { meta: CoverageAreaPaginationMeta })?.meta ||
          get().pagination,
      });
    },

    setStats: (data: CoverageArea) => {
      console.log("Updating stats with data:", data);
      set((state) => ({
        pagination: {
          ...state.pagination,
          stats: {
            ...state.pagination.stats,
            active_areas: data.is_active
              ? state.pagination.stats.active_areas + 1
              : state.pagination.stats.active_areas - 1,
            inactive_areas: data.is_active
              ? state.pagination.stats.inactive_areas - 1
              : state.pagination.stats.inactive_areas + 1,
          },
        },
      }));
    },

    addItem: (data: unknown) => {
      const coverageArea = (data as { data?: CoverageArea })?.data || data;
      set((state) => ({
        coverageAreas: [coverageArea as CoverageArea, ...state.coverageAreas],
        isLoading: false,
        error: null,
      }));
    },

    updateItem: (id: number | string, data: unknown) => {
      const coverageArea =
        (data as { data?: Partial<CoverageArea> })?.data || data;
      set((state) => ({
        coverageAreas: state.coverageAreas.map((area) =>
          area.id === id
            ? { ...area, ...(coverageArea as Partial<CoverageArea>) }
            : area
        ),
        isLoading: false,
        error: null,
      }));
    },

    removeItem: (id: number | string) => {
      set((state) => ({
        coverageAreas: state.coverageAreas.filter((area) => area.id !== id),
        isLoading: false,
        error: null,
      }));
    },

    getCoverageAreaById: (id: number | string) => {
      return get().coverageAreas.find((area) => area.id === id);
    },

    setLoading: (loading: boolean) => {
      set({ isLoading: loading });
    },

    setError: (error: string | null) => {
      set({ error, isLoading: false });
    },
  }),
  "coverage-area-storage"
);
