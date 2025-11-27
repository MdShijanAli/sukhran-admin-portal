import { useState, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { Badge } from "@/components/ui/badge";
import {
  Eye,
  Edit,
  Trash2,
  Plus,
  Clock,
  Truck,
  ShoppingCart,
  XCircle,
  Package,
  CheckCircle,
} from "lucide-react";
import {
  BaseTableList,
  Column,
  ActionItem,
  DropdownMenuActions,
} from "@/components/table";
import { formatDate, formatNumberWithCommas } from "@/lib/utils";
import { Order, useOrderStore } from "@/stores/orderStore";
import orderService from "@/services/orderService";
import { toast } from "sonner";
import { DeleteModal } from "@/components/modals";
import FormModal from "./modal/FormModal";
import ViewModal from "./modal/ViewModal";
import UpdateOrderStatusModal from "./modal/UpdateOrderStatusModal";

export default function Orders() {
  const { t } = useTranslation();
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [dialogMode, setDialogMode] = useState<"create" | "edit" | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [refreshTable, setRefreshTable] = useState<(() => void) | null>(null);
  const [showUpdateStatusModal, setShowUpdateStatusModal] = useState(false);

  const store = useOrderStore();

  const handleSetRefresh = useCallback((refreshFn: () => void) => {
    setRefreshTable(() => refreshFn);
  }, []);

  const handleCreate = () => {
    setSelectedOrder(null);
    setDialogMode("create");
  };

  const handleEdit = (order: Order) => {
    setSelectedOrder(order);
    setDialogMode("edit");
  };

  const handleViewDetails = (order: Order) => {
    setSelectedOrder(order);
    setShowDetails(true);
  };

  const handleDelete = (order: Order) => {
    setSelectedOrder(order);
    setShowDelete(true);
  };

  const handleUpdateStatus = (order: Order) => {
    setSelectedOrder(order);
    setShowUpdateStatusModal(true);
  };

  const handleDeleteOrder = async () => {
    if (!selectedOrder) return;
    setIsDeleting(true);
    try {
      await orderService.deleteItem(selectedOrder.id);
      toast.success(t("orders.messages.orderDeleted"));
      refreshTable?.();
    } catch (error) {
      console.error("Error deleting order:", error);
      toast.error(t("orders.messages.failedToDelete"));
    } finally {
      setIsDeleting(false);
      setShowDelete(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-warning/10 text-warning border-warning/20";
      case "approved":
        return "bg-blue-500/10 text-blue-500 border-blue-500/20";
      case "shipped":
        return "bg-primary/10 text-primary border-primary/20";
      case "delivered":
        return "bg-success/10 text-success border-success/20";
      case "cancelled":
      case "returned":
        return "bg-destructive/10 text-destructive border-destructive/20";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  // Define actions for dropdown menu
  const orderActions = (order: Order): ActionItem<Order>[] => [
    {
      label: t("orders.actions.viewDetails"),
      icon: Eye,
      onClick: handleViewDetails,
    },
    {
      label: t("orders.actions.editOrder"),
      icon: Edit,
      onClick: handleEdit,
      show:
        order.status !== "delivered" &&
        order.status !== "cancelled" &&
        order.status !== "returned",
    },
    {
      label: t("orders.actions.updateStatus"),
      icon: Edit,
      onClick: handleUpdateStatus,
    },
    {
      label: t("orders.actions.deleteOrder"),
      icon: Trash2,
      onClick: handleDelete,
      variant: "destructive",
      separator: true,
      show: order.status === "pending" || order.status === "cancelled",
    },
  ];

  // Define table columns
  const columns: Column<Order>[] = [
    {
      key: "sl",
      label: t("orders.columns.sl"),
      render: (_, index) => index + 1,
      className: "text-center",
    },
    {
      key: "order_number",
      label: t("orders.columns.orderNumber"),
      render: (order) => <span className="font-medium">{order.orderId}</span>,
    },
    {
      key: "customer",
      label: t("orders.columns.customer"),
      render: (order) => (
        <div>
          <p className="font-medium">{order.customer.name}</p>
          <p className="text-xs text-muted-foreground">
            {order.customer.mobile}
          </p>
        </div>
      ),
    },
    {
      key: "items",
      label: t("orders.columns.items"),
      render: (order) => (
        <Badge variant="outline">
          {order.itemsCount || order.items?.length || 0} {t("orders.view.item")}
          (s)
        </Badge>
      ),
    },
    {
      key: "total",
      label: t("orders.columns.total"),
      render: (order) => (
        <span className="font-medium">
          ৳
          {formatNumberWithCommas(
            order.grandTotal || order.receipt?.grandTotal || 0
          )}
        </span>
      ),
    },
    {
      key: "payment",
      label: t("orders.columns.payment"),
      render: (order) => (
        <Badge variant="outline">
          {t(`orders.paymentMethod.${order.paymentMode}`)}
        </Badge>
      ),
    },
    {
      key: "status",
      label: t("orders.columns.status"),
      render: (order) => (
        <Badge className={getStatusColor(order.status)}>
          {t(`orders.status.${order.status}`)}
        </Badge>
      ),
      className: "text-center",
    },
    {
      key: "date",
      label: t("orders.columns.date"),
      render: (order) => (
        <span className="text-sm">{formatDate(order.created_at)}</span>
      ),
    },
    {
      key: "paymentStatus",
      label: t("orders.columns.paymentStatus"),
      render: (order) => (
        <Badge
          variant="outline"
          className={
            order.paymentStatus === "paid"
              ? "border-success/20 text-success"
              : order.paymentStatus === "failed"
              ? "border-destructive/20 text-destructive"
              : "border-warning/20 text-warning"
          }
        >
          {t(`orders.paymentStatus.${order.paymentStatus}`)}
        </Badge>
      ),
    },
    {
      key: "actions",
      label: t("orders.columns.actions"),
      className: "text-right",
      render: (order) => (
        <DropdownMenuActions item={order} actions={orderActions(order)} />
      ),
    },
  ];

  const summaryLists = [
    {
      title: t("orders.totalOrders"),
      value: store.statistics.total_orders,
      icon: ShoppingCart,
      color: "text-muted-foreground",
    },
    {
      title: t("orders.pendingOrders"),
      value: store.statistics.by_status.pending,
      icon: Clock,
      color: "text-warning",
    },
    {
      title: t("orders.approvedOrders"),
      value: store.statistics.by_status.approved,
      icon: CheckCircle,
      color: "text-blue-500",
    },
    {
      title: t("orders.shippedOrders"),
      value: store.statistics.by_status.shipped,
      icon: Truck,
      color: "text-primary",
    },
    {
      title: t("orders.deliveredOrders"),
      value: store.statistics.by_status.delivered,
      icon: Package,
      color: "text-success",
    },
    {
      title: t("orders.cancelledOrders"),
      value: store.statistics.by_status.cancelled,
      icon: XCircle,
      color: "text-destructive",
    },
    {
      title: t("orders.totalRevenue"),
      value: `৳${formatNumberWithCommas(
        parseFloat(store.statistics.total_revenue || "0")
      )}`,
      icon: Package,
      color: "text-blue-600",
    },
  ];

  return (
    <div className="animate-fade-in">
      <BaseTableList<Order>
        title={t("orders.title")}
        description={t("orders.subtitle")}
        headerActions={[
          {
            label: t("orders.addOrder"),
            icon: Plus,
            onClick: handleCreate,
            variant: "default",
          },
        ]}
        searchPlaceholder={t("orders.searchPlaceholder")}
        enableSearch={true}
        columns={columns}
        service={orderService}
        store={store}
        emptyMessage={t("orders.noOrdersFound")}
        getRowKey={(order) => order.id}
        onRefresh={handleSetRefresh}
        summaryLists={summaryLists}
      />

      {/* Dialogs */}
      <FormModal
        open={dialogMode !== null}
        onClose={() => setDialogMode(null)}
        editData={selectedOrder || undefined}
        onSuccess={() => refreshTable?.()}
      />

      <ViewModal
        open={showDetails}
        onClose={setShowDetails}
        orderId={selectedOrder?.id || null}
      />

      <DeleteModal
        open={showDelete}
        onClose={setShowDelete}
        title={t("orders.delete.title")}
        description={`${t("orders.delete.message")} ${
          selectedOrder?.order_number
        }? ${t("orders.delete.cannotUndo")}`}
        onConfirm={handleDeleteOrder}
        isDeleting={isDeleting}
      />

      <UpdateOrderStatusModal
        open={showUpdateStatusModal}
        onClose={setShowUpdateStatusModal}
        orderId={selectedOrder?.id || null}
        status={selectedOrder?.status || ""}
        onSuccess={() => refreshTable?.()}
      />
    </div>
  );
}
