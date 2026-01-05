import { useState, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { Eye, Edit, Plus, Trash2, Package } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  BaseTableList,
  Column,
  DropdownMenuActions,
  ActionItem,
} from "@/components/table";
import { useBrandStore } from "@/stores/brandStore";
import { Brand } from "@/lib/types";
import brandService from "@/services/brandService";
import FormModal from "./modal/FormModal";
import ViewModal from "./modal/ViewModal";
import { DeleteModal } from "@/components/modals";
import { toast } from "sonner";
import permissions from "@/lib/permissions";
import { withPermission } from "@/hoc/withPermission";
import usePermissions from "@/hooks/use-permissions";
import getSerialNumber from "@/lib/getSerialNumber";

const Brands = () => {
  const { t } = useTranslation();
  const store = useBrandStore();
  const { hasPermission } = usePermissions();

  const [selectedBrand, setSelectedBrand] = useState<Brand | null>(null);
  const [dialogMode, setDialogMode] = useState<"create" | "edit" | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [refreshTable, setRefreshTable] = useState<(() => void) | null>(null);
  const [togglingBrandId, setTogglingBrandId] = useState<number | null>(null);

  const handleSetRefresh = useCallback((refreshFn: () => void) => {
    setRefreshTable(() => refreshFn);
  }, []);

  const handleCreate = () => {
    setSelectedBrand(null);
    setDialogMode("create");
  };

  const handleEdit = (brand: Brand) => {
    setSelectedBrand(brand);
    setDialogMode("edit");
  };

  const handleViewDetails = (brand: Brand) => {
    setSelectedBrand(brand);
    setShowDetails(true);
  };

  const handleDelete = (brand: Brand) => {
    setSelectedBrand(brand);
    setShowDelete(true);
  };

  const handleDeleteBrand = async () => {
    if (!selectedBrand) return;
    setIsDeleting(true);
    try {
      await brandService.deleteItem(selectedBrand.id);
      toast.success(t("brands.messages.brandDeleted"));
    } catch (error) {
      console.error("Error deleting brand:", error);
      toast.error(t("brands.messages.failedToDelete"));
    } finally {
      setIsDeleting(false);
      setShowDelete(false);
    }
  };

  const handleStatusToggle = async (brand: Brand) => {
    setTogglingBrandId(brand.id);
    try {
      await brandService.toggleActiveStatus(brand);
      toast.success(
        !brand.is_active
          ? t("brands.messages.brandActivated")
          : t("brands.messages.brandDeactivated")
      );
    } catch (error) {
      console.error("Error toggling brand status:", error);
      toast.error(
        error?.response?.data?.message ||
          t("brands.messages.failedToToggleStatus")
      );
    } finally {
      setTogglingBrandId(null);
    }
  };

  // Define actions for dropdown menu
  const brandActions: ActionItem<Brand>[] = [
    {
      label: t("brands.actions.viewDetails"),
      icon: Eye,
      onClick: handleViewDetails,
    },
    {
      label: t("brands.actions.editBrand"),
      icon: Edit,
      onClick: handleEdit,
      show: hasPermission(permissions.brands.edit),
    },
    {
      label: t("brands.actions.deleteBrand"),
      icon: Trash2,
      onClick: handleDelete,
      variant: "destructive",
      show: hasPermission(permissions.brands.delete),
    },
  ];

  // Calculate stats from store data
  const stats = {
    total_brands: store.pagination?.stats?.total_brands || 0,
    active_brands: store.pagination?.stats?.active_brands || 0,
    inactive_brands: store.pagination?.stats?.inactive_brands || 0,
  };

  // Define table columns
  const columns: Column<Brand>[] = [
    {
      key: "sl",
      label: t("brands.columns.sl"),
      render: (_, index) => getSerialNumber(store, index),
      className: "text-center w-[60px]",
    },
    {
      key: "image",
      label: t("brands.columns.image"),
      render: (brand) => (
        <div className="flex items-center justify-center">
          <div className="h-12 w-12 rounded-lg overflow-hidden border bg-muted">
            {brand.image_url ? (
              <img
                src={brand.image_url}
                alt={brand.title}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="h-full w-full flex items-center justify-center">
                <Package className="h-6 w-6 text-muted-foreground" />
              </div>
            )}
          </div>
        </div>
      ),
      className: "text-center w-[100px]",
    },
    {
      key: "title",
      label: t("brands.columns.title"),
      className: "font-medium",
    },
    {
      key: "description",
      label: t("brands.columns.description"),
      render: (brand) => (
        <div className="max-w-md truncate" title={brand.description}>
          {brand.description}
        </div>
      ),
    },
    {
      key: "status",
      label: t("brands.columns.status"),
      render: (brand) => (
        <div className="flex items-center justify-center gap-2">
          <Switch
            checked={brand.is_active}
            onCheckedChange={() => handleStatusToggle(brand)}
            disabled={togglingBrandId === brand.id}
          />
          <Badge variant={brand.is_active ? "default" : "secondary"}>
            {brand.is_active
              ? t("brands.status.active")
              : t("brands.status.inactive")}
          </Badge>
        </div>
      ),
      className: "text-center",
    },
    {
      key: "actions",
      label: t("brands.columns.actions"),
      className: "text-right",
      render: (brand) => (
        <DropdownMenuActions item={brand} actions={brandActions} />
      ),
    },
  ];

  return (
    <div className="animate-fade-in">
      <BaseTableList<Brand>
        title={t("brands.title")}
        description={t("brands.description")}
        headerActions={
          hasPermission(permissions.brands.create) && [
            {
              label: t("brands.createBrand"),
              icon: Plus,
              onClick: handleCreate,
              variant: "default",
            },
          ]
        }
        searchPlaceholder={t("brands.searchPlaceholder")}
        enableSearch={true}
        columns={columns}
        service={brandService}
        store={store}
        emptyMessage={t("brands.noBrandsFound")}
        getRowKey={(brand) => brand.id}
        onRefresh={handleSetRefresh}
      />

      {/* Dialogs */}
      <FormModal
        open={dialogMode !== null}
        onClose={() => setDialogMode(null)}
        editData={selectedBrand || undefined}
      />

      <ViewModal
        open={showDetails}
        onClose={() => setShowDetails(false)}
        brandId={selectedBrand?.id || null}
      />

      <DeleteModal
        open={showDelete}
        onClose={() => setShowDelete(false)}
        title={t("brands.deleteDialog.title")}
        description={t("brands.deleteDialog.description", {
          name: selectedBrand?.title,
        })}
        onConfirm={handleDeleteBrand}
        isDeleting={isDeleting}
      />
    </div>
  );
};

export default withPermission(Brands, permissions.brands.view);
