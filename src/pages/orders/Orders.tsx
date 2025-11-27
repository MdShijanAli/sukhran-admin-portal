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
  RefreshCcw,
  XCircle,
  Package,
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

export default function Orders() {
  const { t } = useTranslation();
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [dialogMode, setDialogMode] = useState<"create" | "edit" | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [refreshTable, setRefreshTable] = useState<(() => void) | null>(null);

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
      case "confirmed":
        return "bg-blue-500/10 text-blue-500 border-blue-500/20";
      case "processing":
        return "bg-primary/10 text-primary border-primary/20";
      case "in-transit":
        return "bg-indigo-500/10 text-indigo-500 border-indigo-500/20";
      case "delivered":
        return "bg-success/10 text-success border-success/20";
      case "cancelled":
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
      show: order.status !== "delivered" && order.status !== "cancelled",
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
      render: (order) => (
        <span className="font-medium">{order.order_number}</span>
      ),
    },
    {
      key: "customer",
      label: t("orders.columns.customer"),
      render: (order) => (
        <div>
          <p className="font-medium">{order.customer_name}</p>
          <p className="text-xs text-muted-foreground">
            {order.customer_phone}
          </p>
        </div>
      ),
    },
    {
      key: "items",
      label: t("orders.columns.items"),
      render: (order) => (
        <Badge variant="outline">
          {order.items?.length || 0} {t("orders.view.item")}(s)
        </Badge>
      ),
    },
    {
      key: "total",
      label: t("orders.columns.total"),
      render: (order) => (
        <span className="font-medium">
          ৳{formatNumberWithCommas(order.total)}
        </span>
      ),
    },
    {
      key: "payment",
      label: t("orders.columns.payment"),
      render: (order) => (
        <Badge variant="outline">
          {t(`orders.paymentMethod.${order.payment_method}`)}
        </Badge>
      ),
    },
    {
      key: "status",
      label: t("orders.columns.status"),
      render: (order) => (
        <Badge className={getStatusColor(order.status)}>
          {t(
            `orders.status.${
              order.status === "in-transit" ? "inTransit" : order.status
            }`
          )}
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
      key: "agent",
      label: t("orders.columns.agent"),
      render: (order) => (
        <>
          {order.delivery_agent_name || (
            <span className="text-muted-foreground">
              {t("orders.columns.unassigned")}
            </span>
          )}
        </>
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
      value: store.statistics.pending_orders,
      icon: Clock,
      color: "text-warning",
    },
    {
      title: t("orders.processingOrders"),
      value: store.statistics.processing_orders,
      icon: RefreshCcw,
      color: "text-primary",
    },
    {
      title: t("orders.deliveredOrders"),
      value: store.statistics.delivered_orders,
      icon: Truck,
      color: "text-success",
    },
    {
      title: t("orders.cancelledOrders"),
      value: store.statistics.cancelled_orders,
      icon: XCircle,
      color: "text-destructive",
    },
    {
      title: t("orders.totalRevenue"),
      value: `৳${formatNumberWithCommas(store.statistics.total_revenue)}`,
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
    </div>
  );
}
