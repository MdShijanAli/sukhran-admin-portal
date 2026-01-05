import { useEffect, useState } from "react";
import { BaseModal } from "@/components/modals";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ApiService } from "@/services/createApiService";
import { StoreWithData } from "../table/BaseTableList";
import { toast } from "@/components/ui/sonner";

export interface FilterOption {
  label: string;
  value: string;
}

export interface FilterConfig {
  key: string;
  label: string;
  options: FilterOption[];
  defaultValue?: string;
}

interface FilterModalProps<T = unknown> {
  open: boolean;
  onClose: () => void;
  title?: string;
  filters: FilterConfig[];
  currentFilters?: Record<string, string>;
  // Optional callbacks for custom handling (backward compatibility)
  onApplyFilters?: (filters: Record<string, string>) => void;
  onClearFilters?: () => void;
  submitButtonText?: string;
  clearButtonText?: string;
  // Service integration (like BaseTableList)
  service?: ApiService<T>;
  serviceMethod?: keyof ApiService<T>;
  store?: StoreWithData<T>;
  // Additional query params to include with filters
  additionalParams?: Record<string, string>;
  // Callback to get active filters for display
  onFiltersChange?: (
    filters: Record<string, string>,
    activeCount: number
  ) => void;
}

export default function FilterModal<T = unknown>({
  open,
  onClose,
  title = "Apply Filters",
  filters,
  currentFilters = {},
  onApplyFilters,
  onClearFilters,
  submitButtonText = "Apply Filters",
  clearButtonText = "Clear Filters",
  service,
  serviceMethod,
  store,
  additionalParams = {},
  onFiltersChange,
}: FilterModalProps<T>) {
  const [filterData, setFilterData] = useState<Record<string, string>>({});
  const [isApplying, setIsApplying] = useState(false);

  // Calculate active filters count (excluding "all" and empty values)
  const activeFiltersCount = Object.entries(filterData).filter(
    ([_, value]) => value && value !== "all" && value !== ""
  ).length;

  // Internal method to fetch data with filters
  const fetchWithFilters = async (filters: Record<string, string>) => {
    if (!service || !store) {
      console.warn(
        "FilterModal: service and store required for automatic fetching"
      );
      return;
    }

    try {
      if (store.setLoading) {
        store.setLoading(true);
      }

      // Build query string from filters
      const params = new URLSearchParams();

      console.log("FilterModal: Filter data:", filters);

      // Add filter params (skip empty and "all" values)
      Object.entries(filters).forEach(([key, value]) => {
        if (value && value !== "all" && value !== "") {
          console.log(`FilterModal: Adding param ${key}=${value}`);
          params.append(key, value);
        } else {
          console.log(`FilterModal: Skipping ${key}=${value}`);
        }
      });

      // Add additional params
      Object.entries(additionalParams).forEach(([key, value]) => {
        if (value) {
          console.log(`FilterModal: Adding additional param ${key}=${value}`);
          params.append(key, value);
        }
      });

      const queryString = params.toString();
      console.log("FilterModal: Final query string:", queryString);

      // Call service method
      if (serviceMethod && typeof service[serviceMethod] === "function") {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        await (service[serviceMethod] as any)(queryString);
      } else if (typeof service.fetchLists === "function") {
        await service.fetchLists(queryString);
      } else {
        console.error("FilterModal: No valid service method found");
      }

      if (store.setError) {
        store.setError(null);
      }
    } catch (error) {
      console.error("FilterModal: Failed to fetch filtered data:", error);
      toast.error("Failed to apply filters");
      if (store.setError) {
        store.setError(
          error instanceof Error ? error.message : "Failed to fetch data"
        );
      }
    } finally {
      if (store.setLoading) {
        store.setLoading(false);
      }
    }
  };

  const handleApply = async () => {
    setIsApplying(true);

    try {
      // Call optional callback for custom handling (before fetch to persist state)
      if (onApplyFilters) {
        onApplyFilters(filterData);
      }

      // Notify parent about filter changes
      if (onFiltersChange) {
        onFiltersChange(filterData, activeFiltersCount);
      }

      // If service is provided, fetch data automatically
      if (service && store) {
        await fetchWithFilters(filterData);
        toast.success("Filters applied successfully");
      }

      onClose();
    } finally {
      setIsApplying(false);
    }
  };

  const handleClear = async () => {
    const clearedFilters: Record<string, string> = {};
    filters.forEach((filter) => {
      clearedFilters[filter.key] = filter.defaultValue || "all";
    });
    setFilterData(clearedFilters);

    // Call optional callback to persist cleared state
    if (onApplyFilters) {
      onApplyFilters(clearedFilters);
    }
    if (onClearFilters) {
      onClearFilters();
    }

    // Notify parent about cleared filters
    if (onFiltersChange) {
      onFiltersChange(clearedFilters, 0);
    }

    // If service is provided, fetch data with cleared filters
    if (service && store) {
      await fetchWithFilters(clearedFilters);
      toast.info("Filters cleared");
      onClose();
    }
  };

  const handleFilterChange = (key: string, value: string) => {
    console.log(`FilterModal: Changing ${key} to ${value}`);
    setFilterData((prev) => {
      const newData = { ...prev, [key]: value };
      console.log("FilterModal: New filterData:", newData);
      return newData;
    });
  };

  // Initialize filter data when modal opens (only once per open)
  useEffect(() => {
    if (open) {
      // Use currentFilters if provided, otherwise use default values
      const initialFilters: Record<string, string> = {};
      filters.forEach((filter) => {
        initialFilters[filter.key] =
          currentFilters[filter.key] || filter.defaultValue || "all";
      });
      console.log("FilterModal: Initializing with:", initialFilters);
      setFilterData(initialFilters);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  return (
    <BaseModal
      open={open}
      onOpenChange={onClose}
      title={
        activeFiltersCount > 0
          ? `${title} (${activeFiltersCount} active)`
          : title
      }
      onSubmit={handleApply}
      submitButtonText={submitButtonText}
      closeButtonText={clearButtonText}
      closeButtonVariant="outline"
      onClose={handleClear}
      size="md"
      isSubmitting={isApplying}
    >
      <div className="space-y-4">
        {filters.map((filter) => (
          <div key={filter.key} className="space-y-2">
            <Label>{filter.label}</Label>
            <Select
              value={filterData[filter.key] || filter.defaultValue || "all"}
              onValueChange={(value) => handleFilterChange(filter.key, value)}
              disabled={isApplying || store?.isLoading}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {filter.options.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        ))}
      </div>
    </BaseModal>
  );
}
