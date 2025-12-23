import { useState, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { Badge } from "@/components/ui/badge";
import {
  Eye,
  Edit,
  Trash2,
  Plus,
  MapPin,
  Clock,
  Truck,
  Package,
  XCircle,
  CheckCircle,
  UserCheck,
} from "lucide-react";
import {
  BaseTableList,
  Column,
  ActionItem,
  DropdownMenuActions,
} from "@/components/table";
import { formatDate } from "@/lib/utils";
import { Delivery, useDeliveryStore } from "@/stores/deliveryStore";
import deliveryService from "@/services/deliveryService";
import { toast } from "sonner";
import { DeleteModal } from "@/components/modals";
import FormModal from "./modal/FormModal";
import TrackingModal from "./modal/TrackingModal";
import getSerialNumber from "@/lib/getSerialNumber";

export default function DeliveryPage() {
  const { t } = useTranslation();
  const [selectedDelivery, setSelectedDelivery] = useState<Delivery | null>(
    null
  );
  const [dialogMode, setDialogMode] = useState<"create" | "edit" | null>(null);
  const [showTracking, setShowTracking] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [refreshTable, setRefreshTable] = useState<(() => void) | null>(null);

  const store = useDeliveryStore();

  const handleSetRefresh = useCallback((refreshFn: () => void) => {
    setRefreshTable(() => refreshFn);
  }, []);

  const handleCreate = () => {
    setSelectedDelivery(null);
    setDialogMode("create");
  };

  const handleEdit = (delivery: Delivery) => {
    setSelectedDelivery(delivery);
    setDialogMode("edit");
  };

  const handleTrack = (delivery: Delivery) => {
    setSelectedDelivery(delivery);
    setShowTracking(true);
  };

  const handleDelete = (delivery: Delivery) => {
    setSelectedDelivery(delivery);
    setShowDelete(true);
  };

  const handleDeleteDelivery = async () => {
    if (!selectedDelivery) return;
    setIsDeleting(true);
    try {
      await deliveryService.deleteItem(selectedDelivery.id);
      toast.success(t("delivery.messages.deliveryDeleted"));
      refreshTable?.();
    } catch (error) {
      console.error("Error deleting delivery:", error);
      toast.error(t("delivery.messages.failedToDelete"));
    } finally {
      setIsDeleting(false);
      setShowDelete(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-warning/10 text-warning border-warning/20";
      case "assigned":
        return "bg-blue-500/10 text-blue-500 border-blue-500/20";
      case "picked-up":
        return "bg-indigo-500/10 text-indigo-500 border-indigo-500/20";
      case "in-transit":
        return "bg-primary/10 text-primary border-primary/20";
      case "delivered":
        return "bg-success/10 text-success border-success/20";
      case "failed":
      case "cancelled":
        return "bg-destructive/10 text-destructive border-destructive/20";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  // Define actions for dropdown menu
  const deliveryActions = (delivery: Delivery): ActionItem<Delivery>[] => [
    {
      label: t("delivery.actions.trackDelivery"),
      icon: MapPin,
      onClick: handleTrack,
    },
    {
      label: t("delivery.actions.viewDetails"),
      icon: Eye,
      onClick: handleTrack,
    },
    {
      label: t("delivery.actions.editDelivery"),
      icon: Edit,
      onClick: handleEdit,
      show: delivery.status !== "delivered" && delivery.status !== "cancelled",
    },
    {
      label: t("delivery.actions.deleteDelivery"),
      icon: Trash2,
      onClick: handleDelete,
      variant: "destructive",
      separator: true,
      show: delivery.status === "pending" || delivery.status === "cancelled",
    },
  ];

  // Define table columns
  const columns: Column<Delivery>[] = [
    {
      key: "sl",
      label: t("delivery.columns.sl"),
      render: (_, index) => getSerialNumber(store, index),
      className: "text-center",
    },
    {
      key: "delivery_number",
      label: t("delivery.columns.deliveryNumber"),
      render: (delivery) => (
        <span className="font-medium">{delivery.delivery_number}</span>
      ),
    },
    {
      key: "order_number",
      label: t("delivery.columns.orderNumber"),
    },
    {
      key: "customer",
      label: t("delivery.columns.customer"),
      render: (delivery) => (
        <div>
          <p className="font-medium">{delivery.customer_name}</p>
          <p className="text-xs text-muted-foreground">
            {delivery.customer_phone}
          </p>
        </div>
      ),
    },
    {
      key: "delivery_address",
      label: t("delivery.columns.address"),
      render: (delivery) => (
        <span className="text-sm line-clamp-1">
          {delivery.delivery_address}
        </span>
      ),
    },
    {
      key: "driver",
      label: t("delivery.columns.driver"),
      render: (delivery) =>
        delivery.driver_name ? (
          <div>
            <p className="font-medium">{delivery.driver_name}</p>
            {delivery.driver_phone && (
              <p className="text-xs text-muted-foreground">
                {delivery.driver_phone}
              </p>
            )}
          </div>
        ) : (
          <span className="text-muted-foreground">
            {t("delivery.columns.unassigned")}
          </span>
        ),
    },
    {
      key: "scheduled_time",
      label: t("delivery.columns.scheduledTime"),
      render: (delivery) => (
        <span className="text-sm">{formatDate(delivery.scheduled_time)}</span>
      ),
    },
    {
      key: "status",
      label: t("delivery.columns.status"),
      render: (delivery) => {
        const statusKey =
          delivery.status === "in-transit"
            ? "inTransit"
            : delivery.status === "picked-up"
            ? "pickedUp"
            : delivery.status;
        return (
          <Badge className={getStatusColor(delivery.status)}>
            {t(`delivery.status.${statusKey}`)}
          </Badge>
        );
      },
      className: "text-center",
    },
    {
      key: "actions",
      label: t("delivery.columns.actions"),
      className: "text-right",
      render: (delivery) => (
        <DropdownMenuActions
          item={delivery}
          actions={deliveryActions(delivery)}
        />
      ),
    },
  ];

  const summaryLists = [
    {
      title: t("delivery.totalDeliveries"),
      value: store.statistics.total_deliveries,
      icon: Package,
      color: "text-muted-foreground",
    },
    {
      title: t("delivery.pendingDeliveries"),
      value: store.statistics.pending_deliveries,
      icon: Clock,
      color: "text-warning",
    },
    {
      title: t("delivery.assignedDeliveries"),
      value: store.statistics.assigned_deliveries,
      icon: UserCheck,
      color: "text-blue-500",
    },
    {
      title: t("delivery.inTransitDeliveries"),
      value: store.statistics.in_transit_deliveries,
      icon: Truck,
      color: "text-primary",
    },
    {
      title: t("delivery.deliveredToday"),
      value: store.statistics.delivered_today,
      icon: CheckCircle,
      color: "text-success",
    },
    {
      title: t("delivery.failedDeliveries"),
      value: store.statistics.failed_deliveries,
      icon: XCircle,
      color: "text-destructive",
    },
    {
      title: t("delivery.cancelledDeliveries"),
      value: store.statistics.cancelled_deliveries,
      icon: XCircle,
      color: "text-destructive",
    },
  ];

  return (
    <div className="animate-fade-in">
      <BaseTableList<Delivery>
        title={t("delivery.title")}
        description={t("delivery.subtitle")}
        headerActions={[
          {
            label: t("delivery.addDelivery"),
            icon: Plus,
            onClick: handleCreate,
            variant: "default",
          },
        ]}
        searchPlaceholder={t("delivery.searchPlaceholder")}
        enableSearch={true}
        columns={columns}
        service={deliveryService}
        store={store}
        emptyMessage={t("delivery.noDeliveriesFound")}
        getRowKey={(delivery) => delivery.id}
        onRefresh={handleSetRefresh}
        summaryLists={summaryLists}
      />

      {/* Dialogs */}
      <FormModal
        open={dialogMode !== null}
        onClose={() => setDialogMode(null)}
        editData={selectedDelivery || undefined}
        onSuccess={() => refreshTable?.()}
      />

      <TrackingModal
        open={showTracking}
        onClose={setShowTracking}
        deliveryId={selectedDelivery?.id || null}
      />

      <DeleteModal
        open={showDelete}
        onClose={setShowDelete}
        title={t("delivery.delete.title")}
        description={`${t("delivery.delete.message")} ${
          selectedDelivery?.delivery_number
        }? ${t("delivery.delete.cannotUndo")}`}
        onConfirm={handleDeleteDelivery}
        isDeleting={isDeleting}
      />
    </div>
  );
}
