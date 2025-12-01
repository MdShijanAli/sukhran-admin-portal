import { useState, useCallback, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Eye,
  Edit,
  Trash2,
  Clock,
  Truck,
  ShoppingCart,
  XCircle,
  Package,
  CheckCircle,
  Filter,
} from "lucide-react";
import {
  BaseTableList,
  Column,
  ActionItem,
  DropdownMenuActions,
} from "@/components/table";
import { formatNumberWithCommas } from "@/lib/utils";
import { Order, useOrderStore } from "@/stores/orderStore";
import orderService from "@/services/orderService";
import { toast } from "sonner";
import { DeleteModal } from "@/components/modals";
import FilterModal from "@/components/modals/FilterModal";
import FormModal from "./modal/FormModal";
import ViewModal from "./modal/ViewModal";
import UpdateOrderStatusModal from "./modal/UpdateOrderStatusModal";
import UpdateDeliveryTimeModal from "./modal/UpdateDeliveryTimeModal";
import { withPermission } from "@/hoc/withPermission";
import permissions from "@/lib/permissions";
import usePermissions from "@/hooks/use-permissions";

function Orders() {
  const { t } = useTranslation();
  const store = useOrderStore();
  const { hasPermission } = usePermissions();

  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [dialogMode, setDialogMode] = useState<"create" | "edit" | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [refreshTable, setRefreshTable] = useState<(() => void) | null>(null);
  const [showUpdateStatusModal, setShowUpdateStatusModal] = useState(false);
  const [showUpdateDeliveryTimeModal, setShowUpdateDeliveryTimeModal] =
    useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [filterData, setFilterData] = useState<Record<string, string>>({
    status: "",
    payment_status: "",
    payment_mode: "",
  });

  useEffect(() => {
    const params = new URLSearchParams();
    if (filterData.status) {
      params.append("status", filterData.status);
    }
    if (filterData.payment_status) {
      params.append("payment_status", filterData.payment_status);
    }
    if (filterData.payment_mode) {
      params.append("payment_mode", filterData.payment_mode);
    }
    const queryString = params.toString();
    const fetchLists = async () => {
      store.setLoading(true);
      try {
        await orderService.fetchLists(queryString);
      } catch (error) {
        console.error("Error fetching filtered order list:", error);
        toast.error(t("orders.messages.failedToFetchFiltered"));
      } finally {
        store.setLoading(false);
      }
    };
    if (!queryString) {
      return;
    } else {
      fetchLists();
    }
  }, [filterData.status, filterData.payment_status, filterData.payment_mode]);

  const handleApplyFilters = (filters: Record<string, string>) => {
    console.log("Applying filters:", filters);
    setFilterData(filters);
    console.log("Applied filters:", filters);
    toast.success(t("orders.messages.filtersApplied"));
  };

  const handleClearFilters = () => {
    setFilterData({
      status: "all",
      payment_status: "all",
      payment_mode: "all",
    });
    toast.info(t("orders.messages.filtersCleared"));
    setShowFilterModal(false);
  };

  // Filter configurations
  const orderFilterConfigs = [
    {
      key: "status",
      label: t("orders.filter.orderStatus"),
      options: [
        { label: t("orders.filter.allStatuses"), value: "all" },
        { label: t("orders.status.pending"), value: "pending" },
        { label: t("orders.status.approved"), value: "approved" },
        { label: t("orders.status.shipped"), value: "shipped" },
        { label: t("orders.status.delivered"), value: "delivered" },
        { label: t("orders.status.cancelled"), value: "cancelled" },
        {
          label: t("orders.status.cancelled_at_delivery"),
          value: "cancelled_at_delivery",
        },
        { label: t("orders.status.returned"), value: "returned" },
      ],
      defaultValue: "all",
    },
    {
      key: "payment_status",
      label: t("orders.filter.paymentStatus"),
      options: [
        { label: t("orders.filter.allPaymentStatuses"), value: "all" },
        { label: t("orders.paymentStatus.pending"), value: "pending" },
        { label: t("orders.paymentStatus.paid"), value: "paid" },
        { label: t("orders.paymentStatus.failed"), value: "failed" },
        { label: t("orders.paymentStatus.cancelled"), value: "cancelled" },
        { label: t("orders.paymentStatus.refunded"), value: "refunded" },
      ],
      defaultValue: "all",
    },
    {
      key: "payment_mode",
      label: t("orders.filter.paymentMode"),
      options: [
        { label: t("orders.filter.allPaymentMethods"), value: "all" },
        { label: t("orders.paymentMethod.cod"), value: "cod" },
        { label: t("orders.paymentMethod.online"), value: "online" },
      ],
      defaultValue: "all",
    },
  ];

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

  const handleUpdateDeliveryTime = (order: Order) => {
    setSelectedOrder(order);
    setShowUpdateDeliveryTimeModal(true);
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
        hasPermission(permissions.orders.edit) &&
        order.status !== "delivered" &&
        order.status !== "cancelled" &&
        order.status !== "returned",
    },
    {
      label: t("orders.actions.updateStatus"),
      icon: Edit,
      onClick: handleUpdateStatus,
      show: hasPermission(permissions.orders.edit),
    },
    {
      label: t("orders.actions.updateDeliveryTime"),
      icon: Clock,
      onClick: handleUpdateDeliveryTime,
      show:
        hasPermission(permissions.orders.edit) &&
        order.status !== "delivered" &&
        order.status !== "cancelled",
      separator: true, // Show separator after this item
    },
    {
      label: t("orders.actions.deleteOrder"),
      icon: Trash2,
      onClick: handleDelete,
      variant: "destructive",
      separator: true,
      show:
        hasPermission(permissions.orders.delete) &&
        (order.status === "pending" || order.status === "cancelled"),
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
        <div className="w-24">
          <span className="font-medium">{order.orderId}</span>
        </div>
      ),
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
        <div className="w-20">
          <Badge variant="outline">{order.itemsCount || 0}</Badge>
        </div>
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
        <Badge variant={order.status}>
          {t(`orders.status.${order.status}`)}
        </Badge>
      ),
      className: "text-center",
    },
    {
      key: "date",
      label: t("orders.columns.date"),
      render: (order) => (
        <div className="w-[100px]">
          <span className="text-sm">{order.created_at}</span>
        </div>
      ),
    },
    {
      key: "paymentStatus",
      label: t("orders.columns.paymentStatus"),
      render: (order) => (
        <div className="w-28 text-center">
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
        </div>
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
        // headerActions={[
        //   {
        //     label: t("orders.addOrder"),
        //     icon: Plus,
        //     onClick: handleCreate,
        //     variant: "default",
        //   },
        // ]}
        toolbarActions={
          <Button variant="outline" onClick={() => setShowFilterModal(true)}>
            <Filter className="mr-2 h-4 w-4" />
            {t("filter")}
          </Button>
        }
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

      <UpdateDeliveryTimeModal
        open={showUpdateDeliveryTimeModal}
        onClose={setShowUpdateDeliveryTimeModal}
        orderId={selectedOrder?.orderId || null}
        onSuccess={() => refreshTable?.()}
      />

      {/* Filter Modal */}
      <FilterModal
        open={showFilterModal}
        onClose={() => setShowFilterModal(false)}
        title={t("filter")}
        filters={orderFilterConfigs}
        currentFilters={filterData}
        onApplyFilters={handleApplyFilters}
        onClearFilters={handleClearFilters}
        submitButtonText={t("orders.filter.apply")}
        clearButtonText={t("orders.filter.clear")}
      />
    </div>
  );
}

export default withPermission(Orders, permissions.orders.view);
