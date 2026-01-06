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
import { RefreshCw, X } from "lucide-react";
import { Skeleton } from "../ui/skeleton";
import { Pagination } from "./Pagination";

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

export interface Pagination {
  current_page: number;
  from: number;
  last_page: number;
  per_page: number;
  to: number;
  total: number;
}

export interface StoreWithData<T> {
  items?: T[];
  categories?: T[];
  orders?: T[];
  products?: T[];
  users?: T[];
  roles?: T[];
  transactions?: T[];
  coupons?: T[];
  coverageAreas?: T[];
  packageOrders?: T[];
  donations?: T[];
  channels?: T[];
  tickets?: T[];
  notifications?: T[];
  referrals?: T[];
  banners?: T[];
  brands?: T[];
  isLoading?: boolean;
  error?: string | null;
  pagination?: Pagination;
  setLoading?: (loading: boolean) => void;
  setError?: (error: string | null) => void;
  setPagination?: (pagination: Pagination) => void;
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

  // Checkbox props
  enableCheckbox?: boolean;
  checkboxCondition?: (item: T) => boolean;
  selectedRows?: (string | number)[];
  onSelectionChange?: (selectedKeys: (string | number)[]) => void;

  // Pagination
  showPagination?: boolean;

  // Service and Store for data fetching
  service: ApiService<T>;
  serviceMethod?: keyof ApiService<T>;
  store: StoreWithData<T>;

  // Refresh callback
  onRefresh?: (refreshFn: () => void) => void;

  summaryLists?: Array<{
    title: string;
    color: string;
    icon?: React.ComponentType<{ className?: string }>;
    value: string | number;
  }>;
  summaryLoading?: boolean;
  queryParams?: Record<string, string>;
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
  serviceMethod,
  store,
  emptyMessage,
  getRowKey,
  rowClassName,
  enableCheckbox = false,
  checkboxCondition,
  selectedRows,
  onSelectionChange,
  showPagination = true,
  summaryLists = [],
  summaryLoading = false,
  onRefresh,
  queryParams,
}: BaseTableListProps<T>) {
  // Local state for query params
  const [searchQuery, setSearchQuery] = useState("");
  const currentPage = store.pagination?.current_page || 1;
  const perPage = store.pagination?.per_page || 20;
  const [isFirstRender, setIsFirstRender] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [hasInitialFetch, setHasInitialFetch] = useState(false);
  const [localFilters, setLocalFilters] = useState<Record<string, string>>(
    () => {
      const initial: Record<string, string> = {};
      filters?.forEach((filter, index) => {
        initial[filter.label || `filter_${index}`] = filter.value;
      });
      return initial;
    }
  );

  // Serialize queryParams to detect changes
  const serializedQueryParams = queryParams ? JSON.stringify(queryParams) : "";

  // Get data from store
  const data = (store.items ||
    store.categories ||
    store.orders ||
    store.products ||
    store.users ||
    store.coverageAreas ||
    store.roles ||
    store.coupons ||
    store.transactions ||
    store.packageOrders ||
    store.donations ||
    store.channels ||
    store.tickets ||
    store.notifications ||
    store.referrals ||
    store.banners ||
    store.brands ||
    []) as T[];
  const isLoading = store.isLoading || false;
  const pagination = store.pagination;

  // Create stable references for store methods
  const setLoading = store.setLoading;
  const setError = store.setError;

  // Serialize filters to detect changes
  const filterValues = Object.values(localFilters).join(",");

  // Fetch data function with query params
  const fetchData = useCallback(
    async (forceFetch = false) => {
      // Check if we should skip fetching
      // Get fresh data from store at call time to avoid stale closures
      console.log("Store at fetch time:", store);
      const currentData = (store.items ||
        store.categories ||
        store.orders ||
        store.products ||
        store.users ||
        store.coverageAreas ||
        store.roles ||
        store.coupons ||
        store.transactions ||
        store.packageOrders ||
        store.donations ||
        store.channels ||
        store.tickets ||
        store.notifications ||
        store.referrals ||
        store.banners ||
        store.brands ||
        []) as T[];
      const hasData = currentData.length > 0;
      // If queryParams are provided, always fetch (don't use cache) as data might be filtered
      const shouldSkipCache =
        queryParams && Object.keys(queryParams).length > 0;
      if (
        !forceFetch &&
        !hasInitialFetch &&
        isFirstRender &&
        hasData &&
        !shouldSkipCache
      ) {
        console.log("Using cached data from store, skipping API call");
        setHasInitialFetch(true);
        return;
      }

      try {
        if (setLoading) {
          setLoading(true);
        }

        // Build query string
        const params = new URLSearchParams();

        if (queryParams) {
          Object.entries(queryParams).forEach(([key, value]) => {
            params.append(key, value);
          });
        }

        if (searchQuery) {
          params.append("search", searchQuery);
        }

        if (showPagination) {
          params.append("page", currentPage.toString());
          params.append("per_page", perPage.toString());
        }

        // Add filter params
        if (filters) {
          filters.forEach((filter, index) => {
            const filterKey = filter.label || `filter_${index}`;
            const filterValue = localFilters[filterKey];
            if (filterValue) {
              // Use filter.label as the param key (e.g., "status")
              params.append(filter.label || "filter", filterValue);
            }
          });
        }

        const queryString = params.toString();
        if (serviceMethod) {
          await serviceMethod.call(service, queryString);
        } else {
          await service.fetchLists(queryString);
        }

        if (setError) {
          setError(null);
        }

        if (!hasInitialFetch) {
          setHasInitialFetch(true);
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
    },
    [
      store,
      service,
      serviceMethod,
      setLoading,
      setError,
      searchQuery,
      currentPage,
      perPage,
      showPagination,
      filters,
      localFilters,
      hasInitialFetch,
      isFirstRender,
      serializedQueryParams,
    ]
  );

  // Fetch on mount and when dependencies change
  useEffect(() => {
    if (isFirstRender) {
      setIsFirstRender(false);
      fetchData();
    }
  }, [isFirstRender]);

  // Handle search with debounce
  useEffect(() => {
    if (isFirstRender) return; // Skip debounce on first render

    const timer = setTimeout(() => {
      if (currentPage !== 1 && store.setPagination) {
        store.setPagination({
          ...store.pagination,
          current_page: 1,
        });
      } else {
        fetchData();
      }
    }, 500);

    return () => clearTimeout(timer);
    // Only run when searchQuery changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery]);

  // Handle filter, page, perPage, and queryParams changes
  useEffect(() => {
    if (isFirstRender) return; // Skip on first render
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterValues, currentPage, perPage, serializedQueryParams]);

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
  };

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    await fetchData(true); // Force fetch, bypass cache
    setIsRefreshing(false);
  }, [fetchData]);

  // Expose refresh function to parent (run only once on mount)
  useEffect(() => {
    if (onRefresh) {
      onRefresh(handleRefresh);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // handleRefresh is stable via useCallback

  return (
    <div className="space-y-3">
      {summaryLists.length > 0 && (
        <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
          {summaryLists.map((stat) => (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold ml-3">
                  {isLoading || summaryLoading ? (
                    <Skeleton className="h-5 w-16" />
                  ) : (
                    stat.value
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <CardTitle>{title}</CardTitle>
              {description && <CardDescription>{description}</CardDescription>}
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 flex-wrap">
              {/* Toolbar: Search, Filters, and Actions */}
              {(enableSearch || filters || toolbarActions) && (
                <div className="flex flex-row items-start sm:items-center gap-2 flex-wrap w-full sm:w-auto">
                  {/* Search Input */}
                  {enableSearch && (
                    <div className="relative w-full sm:w-[250px] lg:w-[300px]">
                      <Input
                        placeholder={searchPlaceholder}
                        value={searchQuery}
                        onChange={(e) => handleSearchChange(e.target.value)}
                        className="pr-8"
                      />
                      {searchQuery.length > 0 && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setSearchQuery("")}
                          className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  )}

                  {/* Filters */}
                  {filters &&
                    filters.map((filter, index) => {
                      const filterKey = filter.label || `filter_${index}`;
                      return (
                        <Select
                          key={index}
                          value={localFilters[filterKey] || filter.value}
                          onValueChange={(value) => {
                            // Update local filter state
                            setLocalFilters((prev) => ({
                              ...prev,
                              [filterKey]: value,
                            }));
                            filter.onChange(value);
                            // Reset to page 1 when filter changes
                            if (currentPage !== 1 && store.setPagination) {
                              store.setPagination({
                                ...store.pagination,
                                current_page: 1,
                              });
                            }
                          }}
                        >
                          <SelectTrigger
                            className={
                              filter.className || "w-full sm:w-[180px]"
                            }
                          >
                            <SelectValue
                              placeholder={filter.placeholder || "Select..."}
                            />
                          </SelectTrigger>
                          <SelectContent>
                            {filter.options.map((option) => (
                              <SelectItem
                                key={option.value}
                                value={option.value}
                              >
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      );
                    })}

                  {/* Additional Toolbar Actions */}
                  {toolbarActions}
                </div>
              )}
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <Button
                  variant="default"
                  size="icon"
                  onClick={handleRefresh}
                  disabled={isRefreshing}
                  className="shrink-0"
                >
                  <RefreshCw
                    className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`}
                  />
                </Button>
                {headerActions && headerActions.length > 0 && (
                  <div className="flex items-center gap-2 flex-wrap flex-1 sm:flex-initial">
                    {headerActions.map((action, index) => {
                      const Icon = action.icon;
                      return (
                        <Button
                          key={index}
                          onClick={action.onClick}
                          variant={action.variant || "default"}
                          className="flex-1 sm:flex-initial"
                        >
                          {Icon && <Icon className="h-4 w-4 sm:mr-2" />}
                          <span className="hidden sm:inline">
                            {action.label}
                          </span>
                        </Button>
                      );
                    })}
                  </div>
                )}
                {headerSlots}
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Table */}
          <BaseTable
            columns={columns}
            data={data}
            isLoading={isLoading}
            emptyMessage={emptyMessage}
            getRowKey={getRowKey}
            rowClassName={rowClassName}
            enableCheckbox={enableCheckbox}
            checkboxCondition={checkboxCondition}
            selectedRows={selectedRows}
            onSelectionChange={onSelectionChange}
          />

          {/* Pagination */}
          {showPagination && pagination && pagination.last_page > 1 && (
            <Pagination
              currentPage={pagination.current_page}
              totalPages={pagination.last_page}
              totalItems={pagination.total}
              itemsPerPage={pagination.per_page}
              store={store}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
