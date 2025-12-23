import { useState, useCallback } from "react";
import { useTranslation } from "react-i18next";
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
import FormModal from "./modal/FormModal";
import ViewModal from "./modal/ViewModal";
import { DeleteModal } from "@/components/modals";
import { toast } from "sonner";
import permissions from "@/lib/permissions";
import { withPermission } from "@/hoc/withPermission";
import usePermissions from "@/hooks/use-permissions";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import getSerialNumber from "@/lib/getSerialNumber";

const CoverageAreas = () => {
  const { t } = useTranslation();
  const store = useCoverageAreaStore();
  const { hasPermission } = usePermissions();

  const [selectedArea, setSelectedArea] = useState<CoverageArea | null>(null);
  const [dialogMode, setDialogMode] = useState<"create" | "edit" | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [refreshTable, setRefreshTable] = useState<(() => void) | null>(null);
  const [togglingAreaId, setTogglingAreaId] = useState<number | null>(null);
  const [isBulkActionLoading, setIsBulkActionLoading] = useState(false);

  // Checkbox state
  const [selectedRowKeys, setSelectedRowKeys] = useState<(string | number)[]>(
    []
  );

  const handleSetRefresh = useCallback((refreshFn: () => void) => {
    setRefreshTable(() => refreshFn);
  }, []);

  // Handle selection change
  const handleSelectionChange = useCallback(
    (keys: (string | number)[]) => {
      setSelectedRowKeys(keys);
      console.log("Selected rows:", keys);
      // You can also get the full objects here if needed
      const selectedAreas = (store.coverageAreas || []).filter((area) =>
        keys.includes(area.id)
      );
      console.log("Selected area objects:", selectedAreas);
    },
    [store.coverageAreas]
  );

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
      toast.success(t("coverage_area.messages.areaDeleted"));
    } catch (error) {
      console.error("Error deleting coverage area:", error);
      toast.error(t("coverage_area.messages.failedToDelete"));
    } finally {
      setIsDeleting(false);
      setShowDelete(false);
    }
  };

  const handleBulkAction = async (action: string) => {
    if (selectedRowKeys.length === 0) return;

    setIsBulkActionLoading(true);
    try {
      const ids = selectedRowKeys.map((key) => Number(key));
      await coverageAreaService.bulkActions({
        ids,
        action,
      });

      if (action === "activate") {
        toast.success(
          t("coverage_area.messages.bulkActivateSuccess", {
            count: selectedRowKeys.length,
          })
        );
      } else if (action === "deactivate") {
        toast.success(
          t("coverage_area.messages.bulkDeactivateSuccess", {
            count: selectedRowKeys.length,
          })
        );
      }

      // Clear selection and refresh table
      setSelectedRowKeys([]);
      refreshTable?.();
    } catch (error) {
      console.error("Error performing bulk action:", error);
      toast.error(
        error?.response?.data?.message ||
          t("coverage_area.messages.bulkActionFailed")
      );
    } finally {
      setIsBulkActionLoading(false);
    }
  };

  const handleStatusToggle = async (area: CoverageArea) => {
    setTogglingAreaId(area.id);
    try {
      await coverageAreaService.toggleActiveStatus(area);
      toast.success(
        !area.is_active
          ? t("coverage_area.messages.areaActivated")
          : t("coverage_area.messages.areaDeactivated")
      );
    } catch (error) {
      console.error("Error toggling area status:", error);
      toast.error(
        error?.response?.data?.message ||
          t("coverage_area.messages.failedToToggleStatus")
      );
    } finally {
      setTogglingAreaId(null);
    }
  };

  // Define actions for dropdown menu
  const areaActions: ActionItem<CoverageArea>[] = [
    {
      label: t("coverage_area.actions.viewDetails"),
      icon: Eye,
      onClick: handleViewDetails,
    },
    {
      label: t("coverage_area.actions.editArea"),
      icon: Edit,
      onClick: handleEdit,
      show: hasPermission(permissions.coverageAreas.edit),
    },
    {
      label: t("coverage_area.actions.deleteArea"),
      icon: Trash2,
      onClick: handleDelete,
      variant: "destructive",
      show: hasPermission(permissions.coverageAreas.delete),
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
      label: t("coverage_area.columns.sl"),
      render: (_, index) => getSerialNumber(store, index),
      className: "text-center w-[60px]",
    },
    {
      key: "name",
      label: t("coverage_area.columns.name"),
      className: "font-medium",
    },
    {
      key: "city",
      label: t("coverage_area.columns.city"),
    },
    {
      key: "coordinates",
      label: t("coverage_area.columns.coordinates"),
      render: (area) => (
        <span className="text-sm text-muted-foreground">
          {parseFloat(area.latitude).toFixed(4)},{" "}
          {parseFloat(area.longitude).toFixed(4)}
        </span>
      ),
    },
    {
      key: "radius_km",
      label: t("coverage_area.columns.radiusKm"),
      className: "text-center",
    },
    {
      key: "status",
      label: t("coverage_area.columns.status"),
      render: (area) => (
        <div className="flex items-center justify-center gap-2">
          <Switch
            checked={area.is_active}
            onCheckedChange={() => handleStatusToggle(area)}
            disabled={togglingAreaId === area.id}
          />
          <Badge variant={area.is_active ? "default" : "secondary"}>
            {area.is_active
              ? t("coverage_area.status.active")
              : t("coverage_area.status.inactive")}
          </Badge>
        </div>
      ),
      className: "text-center",
    },
    {
      key: "actions",
      label: t("coverage_area.columns.actions"),
      className: "text-right",
      render: (area) => (
        <DropdownMenuActions item={area} actions={areaActions} />
      ),
    },
  ];

  const summaryLists = [
    {
      title: t("coverage_area.totalAreas"),
      value: stats.total_areas,
      icon: MapPin,
      color: "text-muted-foreground",
    },
    {
      title: t("coverage_area.activeAreas"),
      value: stats.active_areas,
      icon: MapPin,
      color: "text-green-600",
    },
    {
      title: t("coverage_area.inactiveAreas"),
      value: stats.inactive_areas,
      icon: MapPin,
      color: "text-red-600",
    },
    {
      title: t("coverage_area.cities"),
      value: stats.cities,
      icon: MapPin,
      color: "text-muted-foreground",
    },
  ];

  return (
    <div className="animate-fade-in">
      <BaseTableList<CoverageArea>
        title={t("coverage_area.title")}
        description={t("coverage_area.subtitle")}
        headerActions={
          hasPermission(permissions.coverageAreas.create) && [
            {
              label: t("coverage_area.addCoverageArea"),
              icon: Plus,
              onClick: handleCreate,
              variant: "default",
            },
          ]
        }
        headerSlots={
          selectedRowKeys.length > 0 &&
          hasPermission(permissions.coverageAreas.bulk_action) && (
            <Select
              onValueChange={handleBulkAction}
              disabled={isBulkActionLoading}
            >
              <SelectTrigger className="w-[120px]">
                <SelectValue
                  placeholder={t("coverage_area.bulkActions.placeholder")}
                />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="activate">
                  {t("coverage_area.bulkActions.activate")}
                </SelectItem>
                <SelectItem value="deactivate">
                  {t("coverage_area.bulkActions.deactivate")}
                </SelectItem>
                <SelectItem value="delete">
                  {t("coverage_area.bulkActions.delete")}
                </SelectItem>
              </SelectContent>
            </Select>
          )
        }
        searchPlaceholder={t("coverage_area.searchPlaceholder")}
        enableSearch={true}
        columns={columns}
        service={coverageAreaService}
        store={store}
        emptyMessage={t("coverage_area.noCoverageAreasFound")}
        getRowKey={(area) => area.id}
        onRefresh={handleSetRefresh}
        summaryLists={summaryLists}
        // Checkbox props
        enableCheckbox={false}
        selectedRows={selectedRowKeys}
        onSelectionChange={handleSelectionChange}
      />

      {/* Dialogs */}
      <FormModal
        open={dialogMode !== null}
        onClose={() => setDialogMode(null)}
        editData={selectedArea || undefined}
      />

      <ViewModal
        open={showDetails}
        onClose={() => setShowDetails(false)}
        areaId={selectedArea?.id || null}
      />

      <DeleteModal
        open={showDelete}
        onClose={() => setShowDelete(false)}
        title={t("coverage_area.delete.title")}
        description={`${t("coverage_area.delete.message")} "${
          selectedArea?.name
        }" ${t("in")} ${selectedArea?.city}? ${t(
          "coverage_area.delete.cannotUndo"
        )}`}
        onConfirm={handleDeleteArea}
        isDeleting={isDeleting}
      />
    </div>
  );
};

export default withPermission(CoverageAreas, permissions.coverageAreas.view);
