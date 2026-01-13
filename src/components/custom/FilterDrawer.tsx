import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Filter, FilterX, X } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

export interface FilterOption {
  label: string;
  value: string;
}

export interface FilterConfig {
  label?: string;
  value: string; // API parameter name
  options: FilterOption[];
  placeholder?: string;
}

interface FilterDrawerProps {
  filters: FilterConfig[];
  localFilters: Record<string, string>;
  onApplyFilters: (filters: Record<string, string>) => void;
  onResetFilters: () => void;
  onRemoveFilter: (key: string) => void;
  className?: string;
}

export function FilterDrawer({
  filters,
  localFilters,
  onApplyFilters,
  onResetFilters,
  onRemoveFilter,
  className = "",
}: FilterDrawerProps) {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [tempFilters, setTempFilters] =
    useState<Record<string, string>>(localFilters);

  // Check if any filters are active
  const hasActiveFilters = Object.values(localFilters).some(
    (value) => value && value !== ""
  );

  // Get filter label by value
  const getFilterLabel = (filterValue: string, selectedValue: string) => {
    const filter = filters?.find((f) => f.value === filterValue);
    const option = filter?.options.find((opt) => opt.value === selectedValue);
    return {
      filterLabel: filter?.label || filterValue,
      optionLabel: option?.label || selectedValue,
    };
  };

  // Handle apply filters
  const handleApply = () => {
    onApplyFilters(tempFilters);
    setIsOpen(false);
  };

  // Handle reset filters
  const handleReset = () => {
    setTempFilters({});
    onResetFilters();
    setIsOpen(false);
  };

  // Sync temp filters when drawer opens
  const handleOpenChange = (open: boolean) => {
    if (open) {
      setTempFilters(localFilters);
    }
    setIsOpen(open);
  };

  return (
    <>
      <div className={`flex items-center gap-2 ${className}`}>
        {/* Filter Drawer Button */}
        <Drawer open={isOpen} onOpenChange={handleOpenChange} direction="right">
          <DrawerTrigger asChild>
            <Button variant="outline" className="gap-2 relative">
              <Filter className="h-4 w-4" />
              {t("reports.filters.filter")}
              {hasActiveFilters && (
                <Badge
                  variant="destructive"
                  className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center"
                >
                  {
                    Object.keys(localFilters).filter((key) => localFilters[key])
                      .length
                  }
                </Badge>
              )}
            </Button>
          </DrawerTrigger>
          <DrawerContent className="h-screen top-0 right-0 left-auto mt-0 w-[400px] rounded-none">
            <DrawerHeader>
              <DrawerTitle>{t("reports.filters.filterOptions")}</DrawerTitle>
              <DrawerDescription>
                {t("reports.filters.filterDescription")}
              </DrawerDescription>
            </DrawerHeader>
            <div className="p-4 space-y-4 overflow-y-auto flex-1">
              {filters.map((filter, index) => (
                <div key={index} className="space-y-2">
                  <label className="text-sm font-medium">
                    {filter.label || filter.value}
                  </label>
                  <Select
                    value={tempFilters[filter.value] || ""}
                    onValueChange={(value) => {
                      setTempFilters((prev) => ({
                        ...prev,
                        [filter.value]: value,
                      }));
                    }}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue
                        placeholder={
                          filter.placeholder || filter.label || "Select"
                        }
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
                </div>
              ))}
            </div>
            <DrawerFooter className="flex flex-row gap-2">
              <Button
                variant="outline"
                onClick={handleReset}
                className="flex-1 gap-2"
              >
                <FilterX className="h-4 w-4" />
                {t("reports.filters.resetFilters")}
              </Button>
              <Button onClick={handleApply} className="flex-1 gap-2">
                <Filter className="h-4 w-4" />
                {t("reports.filters.applyFilters")}
              </Button>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>

        {/* Reset Filters Button */}
        {hasActiveFilters && (
          <Button
            variant="outline"
            size="icon"
            onClick={handleReset}
            className="shrink-0"
            title="Reset all filters"
          >
            <FilterX className="h-4 w-4" />
          </Button>
        )}
      </div>
    </>
  );
}
