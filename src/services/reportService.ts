import { apiRoutes } from "@/api/apiRoutes";
import { createApiService } from "./createApiService";
import { useReportStore } from "@/stores/reportStore";

// Generic report data type
export type ReportData = Record<string, unknown>;

// Transaction Report Service
export const transactionReportService = createApiService<ReportData[]>(
  {
    getAll: apiRoutes.reports.transactions,
    export: apiRoutes.reports.exortTransactions,
  },
  useReportStore.getState()
);

// Package Sales Report Service
export const packageSalesReportService = createApiService<ReportData[]>(
  {
    getAll: apiRoutes.reports.packageSales,
    export: apiRoutes.reports.exportPackageSales,
  },
  useReportStore.getState()
);

// Package Orders Report Service
export const packageOrdersReportService = createApiService<ReportData[]>(
  {
    getAll: apiRoutes.reports.packageOrders,
    export: apiRoutes.reports.exportPackageOrders,
  },
  useReportStore.getState()
);

// Regular Sales Report Service
export const regularSalesReportService = createApiService<ReportData[]>(
  {
    getAll: apiRoutes.reports.regularSales,
    export: apiRoutes.reports.exportRegularSales,
  },
  useReportStore.getState()
);

// Regular Orders Report Service
export const regularOrdersReportService = createApiService<ReportData[]>(
  {
    getAll: apiRoutes.reports.regularOrders,
    export: apiRoutes.reports.exportRegularOrders,
  },
  useReportStore.getState()
);
