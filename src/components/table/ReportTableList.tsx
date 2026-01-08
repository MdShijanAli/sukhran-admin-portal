import React, { useState, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Download, FileText, Search, Undo2 } from "lucide-react";
import { BaseTable, Column } from "./BaseTable";
import { DateRange } from "react-day-picker";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ApiService } from "@/services/createApiService";
import { toast } from "@/hooks/use-toast";
import { BaseDatePicker } from "../custom/BaseDatePicker";
import { useNavigate } from "react-router-dom";

export interface FilterOption {
  label: string;
  value: string;
}

export interface ReportTableListProps {
  title: string;
  description?: string;
  service: ApiService;
  filters?: {
    label?: string;
    value: string;
    options: FilterOption[];
    onChange: (value: string) => void;
    placeholder?: string;
  }[];
  reportName?: string;
}

// Helper to format column names (snake_case to Title Case)
const formatColumnName = (key: string): string => {
  return key
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

// Helper to generate columns from data
const generateColumns = <T extends Record<string, unknown>>(
  data: T[]
): Column<T>[] => {
  if (!data || data.length === 0) return [];

  const firstRow = data[0];
  const keys = Object.keys(firstRow);

  return keys.map((key) => ({
    key,
    label: formatColumnName(key),
    render: (item: T) => {
      const value = item[key];
      // Format value based on type
      if (value === null || value === undefined) return "-";
      if (typeof value === "boolean") return value ? "Yes" : "No";
      if (typeof value === "number") {
        // Check if it looks like a price
        if (
          key.toLowerCase().includes("price") ||
          key.toLowerCase().includes("amount") ||
          key.toLowerCase().includes("total") ||
          key.toLowerCase().includes("charge") ||
          key.toLowerCase().includes("vat")
        ) {
          return `৳${value.toFixed(2)}`;
        }
        return value.toString();
      }
      if (typeof value === "object") return JSON.stringify(value);
      return String(value);
    },
  }));
};

export function ReportTableList({
  title,
  description,
  service,
  filters,
  reportName,
}: ReportTableListProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  // Local state for report data
  const [reportData, setReportData] = useState<Record<string, unknown>[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [isExporting, setIsExporting] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [localFilters, setLocalFilters] = useState<Record<string, string>>({});

  // Generate columns from report data
  const columns = generateColumns(reportData);

  // Build query string
  const buildQueryString = useCallback(() => {
    const params = new URLSearchParams();

    if (searchQuery) {
      params.append("search", searchQuery);
    }

    if (dateRange?.from) {
      params.append("from_date", dateRange.from.toISOString().split("T")[0]);
    }
    if (dateRange?.to) {
      params.append("to_date", dateRange.to.toISOString().split("T")[0]);
    }

    // Add filter params
    Object.entries(localFilters).forEach(([key, value]) => {
      if (value) {
        params.append(key, value);
      }
    });

    return params.toString();
  }, [searchQuery, dateRange, localFilters]);

  // Handle generate report
  const handleGenerate = async () => {
    setIsGenerating(true);
    setIsLoading(true);
    try {
      const queryString = buildQueryString();

      // Fetch data using the service's fetchLists method
      const response = await service.fetchLists(queryString);

      // Handle response - check if data is nested or direct array
      let data: Record<string, unknown>[] = [];

      if (response && typeof response === "object") {
        if (Array.isArray(response.data)) {
          data = response.data;
        } else if (Array.isArray(response)) {
          data = response;
        }
      }

      setReportData(data);

      toast({
        title: t("reports.success"),
        description: t("reports.reportGenerated"),
      });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to fetch report data";
      toast({
        title: t("reports.error"),
        description: message,
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
      setIsLoading(false);
    }
  };

  // Handle export
  const handleExport = async () => {
    if (reportData.length === 0) {
      toast({
        title: t("reports.error"),
        description: "Please generate report first",
        variant: "destructive",
      });
      return;
    }

    setIsExporting(true);
    try {
      const queryString = buildQueryString();
      await service.exportData?.({ queryString, reportName });
      toast({
        title: t("reports.success"),
        description: t("reports.exportSuccess"),
      });
    } catch (error) {
      toast({
        title: t("reports.error"),
        description: t("reports.exportError"),
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
              {description && (
                <p className="text-sm text-muted-foreground mt-1">
                  {description}
                </p>
              )}
            </div>

            <Button
              variant="dark"
              onClick={() => navigate(-1)}
              className="gap-2"
            >
              <Undo2 className="h-4 w-4" />
              Back
            </Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Search and Filters */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:flex-wrap">
            {/* Search */}
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder={t("reports.searchPlaceholder")}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>

            {/* Date Range */}
            <BaseDatePicker
              value={dateRange}
              onChange={setDateRange}
              className="w-full sm:w-auto"
            />

            {/* Custom Filters */}
            {filters?.map((filter, index) => (
              <Select
                key={index}
                value={localFilters[filter.value] || ""}
                onValueChange={(value) => {
                  setLocalFilters((prev) => ({
                    ...prev,
                    [filter.value]: value,
                  }));
                  filter.onChange(value);
                }}
              >
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue
                    placeholder={filter.placeholder || filter.label || "Select"}
                  />
                </SelectTrigger>
                <SelectContent>
                  {filter.options.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ))}

            <Button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="gap-2"
            >
              <FileText className="h-4 w-4" />
              {isGenerating ? t("reports.generating") : t("reports.generate")}
            </Button>

            <Button
              onClick={handleExport}
              disabled={isExporting || reportData.length === 0}
              variant="outline"
              className="gap-2"
            >
              <Download className="h-4 w-4" />
              {isExporting ? t("reports.exporting") : t("reports.export")}
            </Button>
          </div>

          {/* Table with horizontal scroll */}
          <div className="overflow-x-auto border rounded-lg">
            <BaseTable
              columns={columns}
              data={reportData}
              isLoading={isLoading}
              emptyMessage={t("reports.noData")}
              getRowKey={(item, index) => `row-${index}`}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
