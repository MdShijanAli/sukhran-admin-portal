import { useState, useCallback } from "react";
import { Eye, Edit, Plus, Trash2, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  BaseTableList,
  Column,
  DropdownMenuActions,
  ActionItem,
} from "@/components/table";
import { useCoverageAreaStore } from "@/stores/coverageAreaStore";
import { CoverageArea } from "@/lib/types";
import coverageAreaService from "@/services/coverageAreaService";
import { CoverageAreaDialog } from "./modal/CoverageAreaDialogProps";
import { CoverageAreaDetailsDialog } from "./modal/CoverageAreaDetailsDialog";
import { DeleteModal } from "@/components/modals";
import { toast } from "sonner";

const CoverageAreas = () => {
  const [selectedArea, setSelectedArea] = useState<CoverageArea | null>(null);
  const [dialogMode, setDialogMode] = useState<"create" | "edit" | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [refreshTable, setRefreshTable] = useState<(() => void) | null>(null);
  const [togglingAreaId, setTogglingAreaId] = useState<number | null>(null);

  const store = useCoverageAreaStore();

  const handleSetRefresh = useCallback((refreshFn: () => void) => {
    setRefreshTable(() => refreshFn);
  }, []);

  const handleCreate = () => {
    setSelectedArea(null);
    setDialogMode("create");
  };

  const handleEdit = (area: CoverageArea) => {
    setSelectedArea(area);
    setDialogMode("edit");
  };

  const handleViewDetails = (area: CoverageArea) => {
    setSelectedArea(area);
    setShowDetails(true);
  };

  const handleDelete = (area: CoverageArea) => {
    setSelectedArea(area);
    setShowDelete(true);
  };

  const handleDeleteArea = async () => {
    if (!selectedArea) return;
    setIsDeleting(true);
    try {
      await coverageAreaService.deleteItem(selectedArea.id);
      toast.success("Coverage area deleted successfully");
    } catch (error) {
      console.error("Error deleting coverage area:", error);
      toast.error("Failed to delete coverage area");
    } finally {
      setIsDeleting(false);
      setShowDelete(false);
    }
  };

  const handleStatusToggle = async (area: CoverageArea) => {
    setTogglingAreaId(area.id);
    try {
      await coverageAreaService.toggleActiveStatus(area.id);
      toast.success(
        `Area ${!area.is_active ? "activated" : "deactivated"} successfully`
      );
    } catch (error) {
      console.error("Error toggling area status:", error);
      toast.error(
        error?.response?.data?.message || "Failed to update area status"
      );
    } finally {
      setTogglingAreaId(null);
    }
  };

  // Define actions for dropdown menu
  const areaActions: ActionItem<CoverageArea>[] = [
    {
      label: "View Details",
      icon: Eye,
      onClick: handleViewDetails,
    },
    {
      label: "Edit Area",
      icon: Edit,
      onClick: handleEdit,
    },
    {
      label: "Delete Area",
      icon: Trash2,
      onClick: handleDelete,
      variant: "destructive",
      separator: true,
    },
  ];

  // Calculate stats from store data
  const stats = {
    total_areas: store.pagination?.stats?.total_areas || 0,
    active_areas: store.pagination?.stats?.active_areas || 0,
    inactive_areas: store.pagination?.stats?.inactive_areas || 0,
    cities: store.pagination?.stats?.cities?.length || 0,
  };

  // Define table columns
  const columns: Column<CoverageArea>[] = [
    {
      key: "sl",
      label: "Sl.",
      render: (_, index) => index + 1,
      className: "text-center w-[60px]",
    },
    {
      key: "name",
      label: "Name",
      className: "font-medium",
    },
    {
      key: "city",
      label: "City",
    },
    {
      key: "coordinates",
      label: "Coordinates",
      render: (area) => (
        <span className="text-sm text-muted-foreground">
          {parseFloat(area.latitude).toFixed(4)},{" "}
          {parseFloat(area.longitude).toFixed(4)}
        </span>
      ),
    },
    {
      key: "radius_km",
      label: "Radius (km)",
      className: "text-center",
    },
    {
      key: "status",
      label: "Status",
      render: (area) => (
        <div className="flex items-center justify-center gap-2">
          <Switch
            checked={area.is_active}
            onCheckedChange={() => handleStatusToggle(area)}
            disabled={togglingAreaId === area.id}
          />
          <Badge variant={area.is_active ? "default" : "secondary"}>
            {area.is_active ? "Active" : "Inactive"}
          </Badge>
        </div>
      ),
      className: "text-center",
    },
    {
      key: "actions",
      label: "Actions",
      className: "text-right",
      render: (area) => (
        <DropdownMenuActions item={area} actions={areaActions} />
      ),
    },
  ];

  const summaryLists = [
    {
      title: "Total Areas",
      value: stats.total_areas,
      icon: MapPin,
      color: "text-muted-foreground",
    },
    {
      title: "Active Areas",
      value: stats.active_areas,
      icon: MapPin,
      color: "text-green-600",
    },
    {
      title: "Inactive Areas",
      value: stats.inactive_areas,
      icon: MapPin,
      color: "text-red-600",
    },
    {
      title: "Cities",
      value: stats.cities,
      icon: MapPin,
      color: "text-muted-foreground",
    },
  ];

  return (
    <div className="animate-fade-in">
      <BaseTableList<CoverageArea>
        title="Coverage Areas"
        description="Manage your service coverage areas"
        headerActions={[
          {
            label: "Add Coverage Area",
            icon: Plus,
            onClick: handleCreate,
            variant: "default",
          },
        ]}
        searchPlaceholder="Search by area name or city..."
        enableSearch={true}
        columns={columns}
        service={coverageAreaService}
        store={store}
        emptyMessage="No coverage areas found"
        getRowKey={(area) => area.id}
        onRefresh={handleSetRefresh}
        summaryLists={summaryLists}
      />

      {/* Dialogs */}
      <CoverageAreaDialog
        open={dialogMode !== null}
        onClose={() => setDialogMode(null)}
        editData={selectedArea || undefined}
      />

      <CoverageAreaDetailsDialog
        open={showDetails}
        onClose={() => setShowDetails(false)}
        areaId={selectedArea?.id || null}
      />

      <DeleteModal
        open={showDelete}
        onClose={() => setShowDelete(false)}
        title="Delete Coverage Area"
        description={`Are you sure you want to delete the coverage area "${selectedArea?.name}" in ${selectedArea?.city}? This action cannot be undone.`}
        onConfirm={handleDeleteArea}
        isDeleting={isDeleting}
      />
    </div>
  );
};

export default CoverageAreas;
