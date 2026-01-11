import { apiRoutes } from "@/api/apiRoutes";
import { createApiService } from "./createApiService";

// Generic report data type
export type ReportData = Record<string, unknown>;

// Transaction Report Service
export const transactionReportService = createApiService<ReportData[]>({
  getAll: apiRoutes.reports.transactions,
  export: apiRoutes.reports.exortTransactions,
});

export const donationReportService = createApiService<ReportData[]>({
  getAll: apiRoutes.reports.donations,
  export: apiRoutes.reports.exportDonations,
});

// Package Sales Report Service
export const packageSalesReportService = createApiService<ReportData[]>({
  getAll: apiRoutes.reports.packageSales,
  export: apiRoutes.reports.exportPackageSales,
});

// Package Orders Report Service
export const packageOrdersReportService = createApiService<ReportData[]>({
  getAll: apiRoutes.reports.packageOrders,
  export: apiRoutes.reports.exportPackageOrders,
});

// Regular Sales Report Service
export const regularSalesReportService = createApiService<ReportData[]>({
  getAll: apiRoutes.reports.regularSales,
  export: apiRoutes.reports.exportRegularSales,
});

// Regular Orders Report Service
export const regularOrdersReportService = createApiService<ReportData[]>({
  getAll: apiRoutes.reports.regularOrders,
  export: apiRoutes.reports.exportRegularOrders,
});
