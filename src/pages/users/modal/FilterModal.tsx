import { useEffect, useState } from "react";
import { BaseModal } from "@/components/modals";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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

interface FilterModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  filters: FilterConfig[];
  currentFilters: Record<string, string>;
  onApplyFilters: (filters: Record<string, string>) => void;
  onClearFilters: () => void;
  submitButtonText?: string;
  clearButtonText?: string;
}

export default function FilterModal({
  open,
  onClose,
  title = "Apply Filters",
  filters,
  currentFilters,
  onApplyFilters,
  onClearFilters,
  submitButtonText = "Apply Filters",
  clearButtonText = "Clear Filters",
}: FilterModalProps) {
  const [filterData, setFilterData] = useState<Record<string, string>>({});

  const handleApply = () => {
    onApplyFilters(filterData);
    onClose();
  };

  const handleClear = () => {
    const clearedFilters: Record<string, string> = {};
    filters.forEach((filter) => {
      clearedFilters[filter.key] = filter.defaultValue || "all";
    });
    setFilterData(clearedFilters);
    onClearFilters();
  };

  const handleFilterChange = (key: string, value: string) => {
    setFilterData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  useEffect(() => {
    if (open) {
      setFilterData(currentFilters);
    }
  }, [open, currentFilters]);

  return (
    <BaseModal
      open={open}
      onOpenChange={onClose}
      title={title}
      onSubmit={handleApply}
      submitButtonText={submitButtonText}
      closeButtonText={clearButtonText}
      closeButtonVariant="outline"
      onClose={handleClear}
      size="md"
    >
      <div className="space-y-4">
        {filters.map((filter) => (
          <div key={filter.key} className="space-y-2">
            <Label>{filter.label}</Label>
            <Select
              value={filterData[filter.key] || filter.defaultValue || "all"}
              onValueChange={(value) => handleFilterChange(filter.key, value)}
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
