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

interface FilterData {
  filterStatus: string;
  filterSubscription: string;
}

interface FilterModalProps {
  open: boolean;
  onClose: () => void;
  currentFilters: FilterData;
  onApplyFilters: (filters: FilterData) => void;
  onClearFilters: () => void;
}

export default function FilterModal({
  open,
  onClose,
  currentFilters,
  onApplyFilters,
  onClearFilters,
}: FilterModalProps) {
  const [filterData, setFilterData] = useState<FilterData>({
    filterStatus: "all",
    filterSubscription: "all",
  });

  const handleApply = () => {
    onApplyFilters(filterData);
    onClose();
  };

  const handleClear = () => {
    setFilterData({
      filterStatus: "all",
      filterSubscription: "all",
    });
    onClearFilters();
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
      title="Filter Users"
      onSubmit={handleApply}
      submitButtonText="Apply Filters"
      closeButtonText="Clear Filters"
      closeButtonVariant="outline"
      onClose={handleClear}
      size="md"
    >
      <div className="space-y-4">
        <div className="space-y-2">
          <Label>Account Status</Label>
          <Select
            value={filterData.filterStatus}
            onValueChange={(value) =>
              setFilterData({ ...filterData, filterStatus: value })
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
              <SelectItem value="suspended">Suspended</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Subscription Status</Label>
          <Select
            value={filterData.filterSubscription}
            onValueChange={(value) =>
              setFilterData({ ...filterData, filterSubscription: value })
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Subscriptions</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="expired">Expired</SelectItem>
              <SelectItem value="none">None</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </BaseModal>
  );
}
