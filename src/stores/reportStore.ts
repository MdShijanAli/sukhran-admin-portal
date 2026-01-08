import { create } from "zustand";

export interface Pagination {
  current_page: number;
  from: number;
  last_page: number;
  per_page: number;
  to: number;
  total: number;
}

interface ReportStore {
  // Generic report data
  reportData: unknown[];
  isLoading: boolean;
  error: string | null;
  pagination: Pagination | null;

  // Actions
  setReportData: (data: unknown) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setPagination: (pagination: Pagination) => void;
  clearReportData: () => void;
}

export const useReportStore = create<ReportStore>((set) => ({
  reportData: [],
  isLoading: false,
  error: null,
  pagination: null,

  setReportData: (data: unknown) => {
    // Handle both paginated and non-paginated responses
    if (data && typeof data === "object" && "data" in data) {
      const paginatedData = data as {
        data: unknown[];
        current_page: number;
        from: number;
        last_page: number;
        per_page: number;
        to: number;
        total: number;
      };
      set({
        reportData: paginatedData.data,
        pagination: {
          current_page: paginatedData.current_page,
          from: paginatedData.from,
          last_page: paginatedData.last_page,
          per_page: paginatedData.per_page,
          to: paginatedData.to,
          total: paginatedData.total,
        },
      });
    } else if (Array.isArray(data)) {
      set({ reportData: data, pagination: null });
    } else {
      set({ reportData: [], pagination: null });
    }
  },

  setLoading: (loading: boolean) => set({ isLoading: loading }),

  setError: (error: string | null) => set({ error }),

  setPagination: (pagination: Pagination) => set({ pagination }),

  clearReportData: () => set({ reportData: [], pagination: null, error: null }),
}));
