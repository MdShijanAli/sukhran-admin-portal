import { useState, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { Coupon } from "@/lib/types";
import { useCouponStore } from "@/stores/couponStore";
import couponService from "@/services/couponService";
// import BaseTableList from "@/components/table/BaseTableList";
import { Column } from "@/components/table/BaseTable";
import {
  ActionItem,
  DropdownMenuActions,
} from "@/components/table/DropdownMenuActions";
// import SummaryList from "@/components/shared/SummaryList";
import FormModal from "./modal/FormModal";
import ViewModal from "./modal/ViewModal";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Ticket,
  Edit,
  Trash2,
  Eye,
  TrendingUp,
  Users,
  Plus,
  Copy,
} from "lucide-react";
import { DeleteModal } from "@/components/modals";
import { BaseTableList } from "@/components/table";
import permissions from "@/lib/permissions";
import usePermissions from "@/hooks/use-permissions";
import { withPermission } from "@/hoc/withPermission";
import { formatDDMMYYY } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import getSerialNumber from "@/lib/getSerialNumber";

const Coupons = () => {
  const { t } = useTranslation();
  const store = useCouponStore();
  const { hasPermission } = usePermissions();

  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);
  const [dialogMode, setDialogMode] = useState<"create" | "edit" | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [refreshTable, setRefreshTable] = useState<(() => void) | null>(null);
  const [togglingCouponId, setTogglingCouponId] = useState<number | null>(null);

  const handleSetRefresh = useCallback((refreshFn: () => void) => {
    setRefreshTable(() => refreshFn);
  }, []);

  const handleCreate = () => {
    setSelectedCoupon(null);
    setDialogMode("create");
  };

  const handleEdit = (coupon: Coupon) => {
    setSelectedCoupon(coupon);
    setDialogMode("edit");
  };

  const handleViewDetails = (coupon: Coupon) => {
    setSelectedCoupon(coupon);
    setShowDetails(true);
  };

  const handleDelete = (coupon: Coupon) => {
    setSelectedCoupon(coupon);
    setShowDelete(true);
  };

  const handleDeleteCoupon = async () => {
    if (!selectedCoupon) return;
    setIsDeleting(true);
    try {
      await couponService.deleteItem(selectedCoupon.id);
      toast.success(t("coupon.messages.couponDeleted"));
      setShowDelete(false);
      if (refreshTable) refreshTable();
    } catch (error) {
      console.error("Error deleting coupon:", error);
      toast.error(t("coupon.messages.failedToDelete"));
    } finally {
      setIsDeleting(false);
    }
  };

  const handleStatusToggle = async (coupon: Coupon) => {
    setTogglingCouponId(coupon.id);
    try {
      await couponService.toggleStatus(coupon);
      toast.success(t("coupon.messages.statusUpdated"));
      // if (refreshTable) refreshTable();
    } catch (error) {
      console.error("Error toggling coupon status:", error);
      toast.error(t("coupon.messages.failedToToggle"));
    } finally {
      setTogglingCouponId(null);
    }
  };

  const getStatusBadge = (coupon: Coupon) => {
    if (!coupon.isActive) {
      return <Badge variant="secondary">{t("coupon.status.inactive")}</Badge>;
    }
    if (coupon.validity.is_expired) {
      return <Badge variant="destructive">{t("coupon.status.expired")}</Badge>;
    }
    if (coupon.validity.is_upcoming) {
      return <Badge variant="outline">{t("coupon.status.upcoming")}</Badge>;
    }
    if (coupon.validity.is_valid_now) {
      return <Badge variant="default">{t("coupon.status.active")}</Badge>;
    }
    return null;
  };

  const getUsagePercentage = (coupon: Coupon) => {
    const total = Number(coupon.usage.limit_total);
    const used = Number(coupon.usage.count);
    return total > 0 ? ((used / total) * 100).toFixed(0) : "0";
  };

  // Define actions for dropdown menu
  const couponActions: ActionItem<Coupon>[] = [
    {
      label: t("coupon.actions.viewDetails"),
      icon: Eye,
      onClick: handleViewDetails,
    },
    {
      label: t("coupon.actions.editCoupon"),
      icon: Edit,
      onClick: handleEdit,
      show: hasPermission(permissions.coupons.edit),
    },
    {
      label: t("coupon.actions.deleteCoupon"),
      icon: Trash2,
      onClick: handleDelete,
      variant: "destructive",
      show: hasPermission(permissions.coupons.delete),
    },
  ];

  // Calculate stats from store data
  const stats = store.pagination.statistics || {
    total_coupons: 0,
    active_coupons: 0,
    inactive_coupons: 0,
    expired_coupons: 0,
    valid_now: 0,
    upcoming: 0,
    usage: {
      total_usage: 0,
      total_discount_given: 0,
    },
    most_used_coupon: null,
    highest_discount_coupon: null,
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast.success(t("coupon.messages.codeCopied"));
  };

  // Define table columns
  const columns: Column<Coupon>[] = [
    {
      key: "sl",
      label: t("coupon.columns.sl"),
      render: (_, index) => getSerialNumber(store, index),
      className: "text-center w-[60px]",
    },
    {
      key: "code",
      label: t("coupon.columns.code"),
      render: (coupon) => (
        <div className="flex items-center gap-2 w-[150px]">
          <Ticket className="h-4 w-4 text-primary" />
          <span className="font-mono ">{coupon.code}</span>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleCopyCode(coupon.code)}
          >
            <Copy className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
    {
      key: "name",
      label: t("coupon.columns.name"),
      render: (coupon) => (
        <div className="text-sm font-medium w-[100px]">{coupon.name}</div>
      ),
    },
    {
      key: "discount",
      label: t("coupon.columns.discount"),
      render: (coupon) => (
        <div className="flex items-center gap-2 w-[100px]">
          <span className=" text-primary">
            {coupon.discount.formatted}
          </span>
        </div>
      ),
    },
    {
      key: "min_order",
      label: t("coupon.columns.minOrder"),
      render: (coupon) => (
        <div className="w-[70px]">
          <span className="text-sm ">
            ৳{coupon.min_order_amount.toFixed(2)}
          </span>
        </div>
      ),
    },
    {
      key: "validity",
      label: t("coupon.columns.validity"),
      render: (coupon) => (
        <div className="w-[90px]">
          <div className="text-xs text-muted-foreground">
            {formatDDMMYYY(coupon.validity.from)} {" to "}
            {formatDDMMYYY(coupon.validity.to)}
          </div>
        </div>
      ),
    },
    {
      key: "usage",
      label: t("coupon.columns.usage"),
      render: (coupon) => (
        <div className="space-y-1">
          <div className="flex items-center justify-between text-xs">
            <span>
              {Number(coupon.usage.count)} / {Number(coupon.usage.limit_total)}
            </span>
            <span className="text-muted-foreground">
              {getUsagePercentage(coupon)}%
            </span>
          </div>
          <div className="w-full bg-secondary rounded-full h-1.5">
            <div
              className="bg-primary h-1.5 rounded-full transition-all"
              style={{ width: `${getUsagePercentage(coupon)}%` }}
            />
          </div>
        </div>
      ),
      className: "min-w-[120px]",
    },
    {
      key: "status",
      label: t("coupon.columns.status"),
      render: (coupon) => (
        <div className="flex items-center justify-center gap-2">
          {!coupon.validity.is_expired && (
            <Switch
              checked={coupon.isActive}
              onCheckedChange={() => handleStatusToggle(coupon)}
              disabled={togglingCouponId === coupon.id}
            />
          )}

          {getStatusBadge(coupon)}
        </div>
      ),
      className: "text-center",
    },
    {
      key: "actions",
      label: t("coupon.columns.actions"),
      className: "text-right",
      render: (coupon) => (
        <DropdownMenuActions item={coupon} actions={couponActions} />
      ),
    },
  ];

  const summaryLists = [
    {
      title: t("coupon.totalCoupons"),
      value: stats.total_coupons,
      icon: Ticket,
      color: "text-muted-foreground",
    },
    {
      title: t("coupon.activeCoupons"),
      value: stats.valid_now,
      icon: Ticket,
      color: "text-green-600",
    },
    {
      title: t("coupon.expiredCoupons"),
      value: stats.expired_coupons,
      icon: Ticket,
      color: "text-red-600",
    },
    {
      title: t("coupon.totalUsage"),
      value: stats.usage.total_usage,
      icon: Users,
      color: "text-blue-600",
    },
    {
      title: t("coupon.totalDiscount"),
      value: `৳${stats.usage.total_discount_given.toFixed(2)}`,
      icon: TrendingUp,
      color: "text-primary",
    },
  ];

  return (
    <div className="animate-fade-in">
      <BaseTableList<Coupon>
        title={t("coupon.title")}
        description={t("coupon.subtitle")}
        headerActions={
          hasPermission(permissions.coupons.create) && [
            {
              label: t("coupon.createButton"),
              icon: Plus,
              onClick: handleCreate,
              variant: "default",
            },
          ]
        }
        searchPlaceholder={t("coupon.searchPlaceholder")}
        enableSearch={true}
        columns={columns}
        service={couponService}
        store={store}
        emptyMessage={t("coupon.emptyState")}
        getRowKey={(coupon) => coupon.id}
        onRefresh={handleSetRefresh}
        summaryLists={summaryLists}
      />

      {/* Modals */}
      <FormModal
        open={dialogMode !== null}
        onClose={() => {
          setDialogMode(null);
        }}
        editData={
          dialogMode === "edit" ? selectedCoupon || undefined : undefined
        }
        onRefresh={() => {
          if (refreshTable) refreshTable();
        }}
      />

      <ViewModal
        open={showDetails}
        onClose={() => setShowDetails(false)}
        couponId={selectedCoupon?.id || null}
      />

      <DeleteModal
        open={showDelete}
        onClose={() => setShowDelete(false)}
        title={t("coupon.delete.title")}
        description={t("coupon.delete.description", {
          code: selectedCoupon?.code,
        })}
        onConfirm={handleDeleteCoupon}
        isDeleting={isDeleting}
      />
    </div>
  );
};

export default withPermission(Coupons, permissions.coupons.view);
