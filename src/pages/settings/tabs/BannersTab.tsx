import { useState, useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { BaseTableList } from "@/components/table/BaseTableList";
import { Column } from "@/components/table/BaseTable";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Banner } from "@/lib/types";
import { useBannerStore } from "@/stores/bannerStore";
import bannerService from "@/services/bannerService";
import { formatDate } from "@/lib/utils";
import { ActionItem, DropdownMenuActions } from "@/components/table";
import { Eye, Edit, Trash2, Plus, Image as ImageIcon } from "lucide-react";
import getSerialNumber from "@/lib/getSerialNumber";
import { toast } from "sonner";
import FormModal from "../modal/FormModal";
import ViewModal from "../modal/ViewModal";
import DeleteModal from "@/components/modals/DeleteModal";
import usePermissions from "@/hooks/use-permissions";
import permissions from "@/lib/permissions";

function BannersTab() {
  const { t } = useTranslation();
  const store = useBannerStore();
  const { hasPermission } = usePermissions();

  const [selectedBanner, setSelectedBanner] = useState<Banner | null>(null);
  const [dialogMode, setDialogMode] = useState<"create" | "edit" | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [refreshTable, setRefreshTable] = useState<(() => void) | null>(null);
  const [togglingBannerId, setTogglingBannerId] = useState<number | null>(null);

  const handleSetRefresh = useCallback((refreshFn: () => void) => {
    setRefreshTable(() => refreshFn);
  }, []);

  const handleCreate = useCallback(() => {
    setSelectedBanner(null);
    setDialogMode("create");
  }, []);

  const handleEdit = useCallback((banner: Banner) => {
    setSelectedBanner(banner);
    setDialogMode("edit");
  }, []);

  const handleViewDetails = useCallback((banner: Banner) => {
    setSelectedBanner(banner);
    setShowDetails(true);
  }, []);

  const handleDelete = useCallback((banner: Banner) => {
    setSelectedBanner(banner);
    setShowDelete(true);
  }, []);

  const handleDeleteBanner = async () => {
    if (!selectedBanner) return;
    setIsDeleting(true);
    try {
      await bannerService.deleteItem(selectedBanner.id);
      toast.success(t("banners.messages.bannerDeleted"));
      setShowDelete(false);
      if (refreshTable) refreshTable();
    } catch (error) {
      console.error("Error deleting banner:", error);
      toast.error(t("banners.messages.failedToDelete"));
    } finally {
      setIsDeleting(false);
    }
  };

  const handleStatusToggle = useCallback(
    async (banner: Banner) => {
      setTogglingBannerId(banner.id);
      try {
        await bannerService.toggleStatus(banner.id);
        toast.success(t("banners.messages.statusToggled"));
      } catch (error) {
        console.error("Error toggling banner status:", error);
        toast.error(t("banners.messages.failedToToggle"));
      } finally {
        setTogglingBannerId(null);
      }
    },
    [t]
  );

  // Define actions for dropdown menu - memoized
  const bannerActions = useMemo(
    (): ActionItem<Banner>[] => [
      {
        label: t("banners.actions.viewDetails"),
        icon: Eye,
        onClick: handleViewDetails,
      },
      {
        label: t("banners.actions.editBanner"),
        icon: Edit,
        onClick: handleEdit,
        show: hasPermission(permissions.banners.edit),
      },
      {
        label: t("banners.actions.deleteBanner"),
        icon: Trash2,
        onClick: handleDelete,
        variant: "destructive",
        show: hasPermission(permissions.banners.delete),
      },
    ],
    [t, handleViewDetails, handleEdit, handleDelete]
  );

  // Calculate stats from store data
  const stats = {
    total_banners:
      store.pagination?.stats?.total_banners || store.banners.length || 0,
    active_banners:
      store.pagination?.stats?.active_banners ||
      store.banners.filter((b) => b.is_active).length ||
      0,
    inactive_banners:
      store.pagination?.stats?.inactive_banners ||
      store.banners.filter((b) => !b.is_active).length ||
      0,
  };

  // Define table columns - memoized
  const columns = useMemo(
    (): Column<Banner>[] => [
      {
        key: "sl",
        label: t("banners.columns.sl"),
        render: (_, index) => getSerialNumber(store, index),
        className: "text-center w-[60px]",
      },
      {
        key: "banner",
        label: t("banners.columns.banner"),
        render: (banner) => (
          <div className="flex items-center gap-3">
            <div className="relative w-24 h-16 rounded-md overflow-hidden border bg-muted">
              {banner.image_url ? (
                <img
                  src={banner.image_url}
                  alt={banner.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <ImageIcon className="h-6 w-6 text-muted-foreground" />
                </div>
              )}
            </div>
            <div>
              <p className="font-medium">{banner.title}</p>
              <p className="text-xs text-muted-foreground">
                {t(`banners.linkTypes.${banner.link_type}`)}
              </p>
            </div>
          </div>
        ),
      },
      {
        key: "linkDetails",
        label: t("banners.columns.linkDetails"),
        render: (banner) => (
          <div className="max-w-[200px]">
            {banner.link_type === "none" && (
              <span className="text-xs text-muted-foreground">
                {t("banners.linkTypes.none")}
              </span>
            )}
            {banner.link_type === "url" && banner.url && (
              <a
                href={banner.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-primary hover:underline truncate block"
              >
                {banner.url}
              </a>
            )}
            {banner.link_type === "package" && banner.package && (
              <div className="text-xs">
                <p className="font-medium">{banner.package.name}</p>
                <p className="text-muted-foreground">ID: {banner.package_id}</p>
              </div>
            )}
            {banner.link_type === "product" && banner.product && (
              <div className="text-xs">
                <p className="font-medium">{banner.product.name}</p>
                <p className="text-muted-foreground">ID: {banner.product_id}</p>
              </div>
            )}
          </div>
        ),
      },
      {
        key: "status",
        label: t("banners.columns.status"),
        render: (banner) => (
          <div className="flex items-center justify-center gap-2">
            {hasPermission(permissions.banners.edit) && (
              <Switch
                checked={banner.is_active}
                onCheckedChange={() => handleStatusToggle(banner)}
                disabled={togglingBannerId === banner.id}
              />
            )}

            <Badge variant={banner.is_active ? "default" : "secondary"}>
              {banner.is_active
                ? t("banners.status.active")
                : t("banners.status.inactive")}
            </Badge>
          </div>
        ),
        className: "text-center",
      },
      {
        key: "created_at",
        label: t("banners.columns.createdAt"),
        render: (banner) => (
          <div className="w-[100px]">{formatDate(banner.created_at)}</div>
        ),
      },
      {
        key: "actions",
        label: t("banners.columns.actions"),
        className: "text-right",
        render: (banner) => (
          <DropdownMenuActions item={banner} actions={bannerActions} />
        ),
      },
    ],
    [togglingBannerId, bannerActions, handleStatusToggle]
  );

  const summaryLists = [
    {
      title: t("banners.totalBanners"),
      value: stats.total_banners,
      icon: ImageIcon,
      color: "text-muted-foreground",
    },
    {
      title: t("banners.activeBanners"),
      value: stats.active_banners,
      icon: ImageIcon,
      color: "text-green-600",
    },
    {
      title: t("banners.inactiveBanners"),
      value: stats.inactive_banners,
      icon: ImageIcon,
      color: "text-red-600",
    },
  ];

  return (
    <div className="animate-fade-in">
      <BaseTableList<Banner>
        title={t("banners.title")}
        description={t("banners.subtitle")}
        headerActions={
          hasPermission(permissions.banners.create) && [
            {
              label: t("banners.addBanner"),
              icon: Plus,
              onClick: handleCreate,
              variant: "default",
            },
          ]
        }
        searchPlaceholder={t("banners.searchPlaceholder")}
        enableSearch={true}
        columns={columns}
        service={bannerService}
        store={store}
        emptyMessage={t("banners.noBannersFound")}
        getRowKey={(banner) => banner.id}
        onRefresh={handleSetRefresh}
        summaryLists={summaryLists}
      />

      {/* Form Modal */}
      <FormModal
        open={dialogMode !== null}
        onClose={() => setDialogMode(null)}
        editData={selectedBanner || undefined}
      />

      {/* View Modal */}
      <ViewModal
        open={showDetails}
        onClose={() => setShowDetails(false)}
        bannerId={selectedBanner?.id || null}
      />

      {/* Delete Modal */}
      <DeleteModal
        open={showDelete}
        onClose={() => setShowDelete(false)}
        title={t("banners.delete.title")}
        description={`${t("banners.delete.message")} "${
          selectedBanner?.title
        }"? ${t("banners.delete.cannotUndo")}`}
        onConfirm={handleDeleteBanner}
        isDeleting={isDeleting}
      />
    </div>
  );
}

export default BannersTab;
