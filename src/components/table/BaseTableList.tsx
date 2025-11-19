import React, { ReactNode, useEffect, useState, useCallback } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BaseTable, Column } from "./BaseTable";
import { ApiService } from "@/services/createApiService";
import { RefreshCcw, RefreshCw } from "lucide-react";

export interface FilterOption {
  label: string;
  value: string;
}

export interface ActionButton {
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
  onClick: () => void;
  variant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link";
}

export interface StoreWithData<T> {
  items?: T[];
  categories?: T[];
  orders?: T[];
  products?: T[];
  users?: T[];
  isLoading?: boolean;
  error?: string | null;
  setLoading?: (loading: boolean) => void;
  setError?: (error: string | null) => void;
}

export interface BaseTableListProps<T> {
  // Card Header
  title: string;
  description?: string;
  headerActions?: ActionButton[];
  headerSlots?: ReactNode;

  // Search
  searchPlaceholder?: string;
  enableSearch?: boolean;

  // Filters
  filters?: {
    label?: string;
    value: string;
    options: FilterOption[];
    onChange: (value: string) => void;
    placeholder?: string;
    className?: string;
  }[];

  // Additional toolbar elements
  toolbarActions?: ReactNode;

  // Table props
  columns: Column<T>[];
  emptyMessage?: string;
  getRowKey: (item: T) => string | number;
  rowClassName?: (item: T) => string;

  // Pagination
  showPagination?: boolean;

  // Service and Store for data fetching
  service: ApiService<T>;
  store: StoreWithData<T>;

  summaryLists?: Array<{
    title: string;
    color: string;
    icon?: React.ComponentType<{ className?: string }>;
    value: string | number;
  }>;
}

export function BaseTableList<T>({
  title,
  description,
  headerActions,
  headerSlots,
  searchPlaceholder = "Search...",
  enableSearch = true,
  filters,
  toolbarActions,
  columns,
  service,
  store,
  emptyMessage,
  getRowKey,
  rowClassName,
  showPagination = false,
  summaryLists = [],
}: BaseTableListProps<T>) {
  // Local state for query params
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage] = useState(10);

  // Get data from store
  const data = (store.items ||
    store.categories ||
    store.orders ||
    store.products ||
    store.users ||
    []) as T[];
  const isLoading = store.isLoading || false;

  // Create stable references for store methods
  const setLoading = store.setLoading;
  const setError = store.setError;

  // Serialize filters to detect changes
  const filterValues = filters?.map((f) => f.value).join(",") || "";

  // Fetch data function with query params
  const fetchData = useCallback(async () => {
    try {
      if (setLoading) {
        setLoading(true);
      }

      // Build query string
      const params = new URLSearchParams();

      if (searchQuery) {
        params.append("search", searchQuery);
      }

      if (showPagination) {
        params.append("page", currentPage.toString());
        params.append("per_page", perPage.toString());
      }

      // Add filter params
      if (filters) {
        filters.forEach((filter) => {
          if (filter.value) {
            params.append(filter.label || "filter", filter.value);
          }
        });
      }

      const queryString = params.toString();
      await service.fetchLists(queryString);

      if (setError) {
        setError(null);
      }
    } catch (error) {
      console.error("Failed to fetch data:", error);
      if (setError) {
        setError(
          error instanceof Error ? error.message : "Failed to fetch data"
        );
      }
    } finally {
      if (setLoading) {
        setLoading(false);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    service,
    setLoading,
    setError,
    searchQuery,
    currentPage,
    perPage,
    showPagination,
    filterValues,
  ]);

  // Fetch on mount and when dependencies change
  // useEffect(() => {
  //   fetchData();
  // }, [fetchData]);

  // Handle search with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      if (currentPage !== 1) {
        setCurrentPage(1);
      } else {
        fetchData();
      }
    }, 500);

    return () => clearTimeout(timer);
    // Only run when searchQuery changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery]);

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleRefresh = () => {
    fetchData();
  };

  return (
    <div className="space-y-3">
      {summaryLists.length > 0 && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {summaryLists.map((stat) => (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>{title}</CardTitle>
              {description && <CardDescription>{description}</CardDescription>}
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="default"
                onClick={handleRefresh}
                disabled={isLoading}
              >
                <RefreshCw
                  className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`}
                />
              </Button>
              {headerActions && headerActions.length > 0 && (
                <div className="flex items-center gap-2">
                  {headerActions.map((action, index) => {
                    const Icon = action.icon;
                    return (
                      <Button
                        key={index}
                        onClick={action.onClick}
                        variant={action.variant || "default"}
                      >
                        {Icon && <Icon className="h-4 w-4 mr-2" />}
                        {action.label}
                      </Button>
                    );
                  })}
                </div>
              )}
            </div>
            {headerSlots}
          </div>
        </CardHeader>
        <CardContent>
          {/* Toolbar: Search, Filters, and Actions */}
          {(enableSearch || filters || toolbarActions) && (
            <div className="flex items-center gap-4 mb-4 flex-wrap">
              {/* Search Input */}
              {enableSearch && (
                <Input
                  placeholder={searchPlaceholder}
                  value={searchQuery}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  className="max-w-sm"
                />
              )}

              {/* Filters */}
              {filters &&
                filters.map((filter, index) => (
                  <Select
                    key={index}
                    value={filter.value}
                    onValueChange={(value) => {
                      filter.onChange(value);
                      // Trigger refetch when filter changes
                      if (currentPage !== 1) {
                        setCurrentPage(1);
                      } else {
                        fetchData();
                      }
                    }}
                  >
                    <SelectTrigger className={filter.className || "w-[180px]"}>
                      <SelectValue
                        placeholder={filter.placeholder || "Select..."}
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

              {/* Additional Toolbar Actions */}
              {toolbarActions}
            </div>
          )}

          {/* Table */}
          <BaseTable
            columns={columns}
            data={data}
            isLoading={isLoading}
            emptyMessage={emptyMessage}
            getRowKey={getRowKey}
            rowClassName={rowClassName}
          />

          {/* Pagination */}
          {showPagination && (
            <div className="flex items-center justify-between mt-4">
              <div className="text-sm text-muted-foreground">
                Page {currentPage}
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage <= 1 || isLoading}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={isLoading}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
