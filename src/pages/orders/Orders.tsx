import { useState, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { Badge } from "@/components/ui/badge";
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
} from "lucide-react";
import {
  BaseTableList,
  Column,
  ActionItem,
  DropdownMenuActions,
} from "@/components/table";
import { formatNumberWithCommas, StatusVariant } from "@/lib/utils";
import { Order, useOrderStore } from "@/stores/orderStore";
import orderService from "@/services/orderService";
import { toast } from "sonner";
import { DeleteModal } from "@/components/modals";
import FormModal from "./modal/FormModal";
import ViewModal from "./modal/ViewModal";
import UpdateOrderStatusModal from "./modal/UpdateOrderStatusModal";
import UpdateDeliveryTimeModal from "./modal/UpdateDeliveryTimeModal";
import { withPermission } from "@/hoc/withPermission";
import permissions from "@/lib/permissions";
import usePermissions from "@/hooks/use-permissions";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import PackageOrdersTab from "./tabs/PackageOrdersTab";
import getSerialNumber from "@/lib/getSerialNumber";
import Settings from "./tabs/Settings";
import ModificaitonHistoryModal from "./modal/ModificaitonHisotryModal";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

function Orders() {
  const { t } = useTranslation();
  const store = useOrderStore();
  const { hasPermission } = usePermissions();

  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [dialogMode, setDialogMode] = useState<"create" | "edit" | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isPaiding, setIsPaiding] = useState(false);
  const [refreshTable, setRefreshTable] = useState<(() => void) | null>(null);
  const [showUpdateStatusModal, setShowUpdateStatusModal] = useState(false);
  const [showMarkAsPaidModal, setShowMarkAsPaidModal] = useState(false);
  const [showUpdateDeliveryTimeModal, setShowUpdateDeliveryTimeModal] =
    useState(false);
  const [showModificationHistoryModal, setShowModificationHistoryModal] =
    useState(false);
  const [markAsPaidNote, setMarkAsPaidNote] = useState("");

  const handleSetRefresh = useCallback((refreshFn: () => void) => {
    setRefreshTable(() => refreshFn);
  }, []);

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

  const handleViewModificationHistory = (order: Order) => {
    setSelectedOrder(order);
    setShowModificationHistoryModal(true);
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

  const handleMarkAsPaid = async (order: Order) => {
    if (!markAsPaidNote.trim()) {
      toast.error(t("orders.messages.notesRequired"));
      return;
    }

    setIsPaiding(true);
    try {
      await orderService.markCODOrderAsPaid(order.id, {
        payment_status: "paid",
        notes: markAsPaidNote,
      });
      toast.success(t("orders.messages.markedAsPaid"));
      refreshTable?.();
      setMarkAsPaidNote("");
    } catch (error) {
      console.error("Error marking order as paid:", error);
      toast.error(t("orders.messages.failedToMarkAsPaid"));
    } finally {
      setIsPaiding(false);
      setShowMarkAsPaidModal(false);
    }
  };

  const handleMarkAsPaidOrder = async (order: Order) => {
    setSelectedOrder(order);
    setShowMarkAsPaidModal(true);
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
        (order.status === "pending" || order.status === "approved" && order.paymentStatus !== "paid"),
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
        order.status !== "cancelled" && order.paymentStatus !== "paid",
      separator: true, // Show separator after this item
    },
    {
      label: t("orders.actions.modificationHistory"),
      icon: Clock,
      onClick: handleViewModificationHistory,
      show: true,
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
    {
      label: t("orders.actions.markAsPaid"),
      icon: CheckCircle,
      onClick: handleMarkAsPaidOrder,
      show:
        !import.meta.env.PROD &&
        hasPermission(permissions.orders.edit) &&
        order.paymentMode === "cod" &&
        order.paymentStatus !== "paid",
    },
  ];

  // Define table columns
  const columns: Column<Order>[] = [
    {
      key: "sl",
      label: t("orders.columns.sl"),
      render: (_, index) => getSerialNumber(store, index),
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
            order.grandTotal || order.receipt?.grandTotal || 0,
          )}
        </span>
      ),
    },
    {
      key: "payment",
      label: t("orders.columns.payment"),
      render: (order) => (
        <div className="w-[120px] text-center">
          <Badge className={StatusVariant(order.paymentMode)}>
            {t(`orders.paymentMethod.${order.paymentMode}`)}
          </Badge>
        </div>
      ),
      className: "text-center",
    },
    {
      key: "status",
      label: t("orders.columns.status"),
      render: (order) => (
        <div className="w-[150px]">
          <Badge variant={order.status}>
            {t(`orders.status.${order.status}`)}
          </Badge>
        </div>
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
        parseFloat(store.statistics.total_revenue || "0"),
      )}`,
      icon: Package,
      color: "text-blue-600",
    },
  ];

  const filterItemes = [
    {
      label: t("orders.filter.orderStatus"),
      value: "status",
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
      placeholder: t("orders.filter.selectOrderStatus"),
    },
    {
      label: t("orders.filter.paymentStatus"),
      value: "payment_status",
      options: [
        { label: t("orders.filter.allPaymentStatuses"), value: "all" },
        { label: t("orders.paymentStatus.pending"), value: "pending" },
        { label: t("orders.paymentStatus.paid"), value: "paid" },
        { label: t("orders.paymentStatus.failed"), value: "failed" },
        { label: t("orders.paymentStatus.cancelled"), value: "cancelled" },
        { label: t("orders.paymentStatus.refunded"), value: "refunded" },
      ],
      placeholder: t("orders.filter.selectPaymentStatus"),
    },
    {
      label: t("orders.filter.paymentMode"),
      value: "payment_mode",
      options: [
        { label: t("orders.filter.allPaymentMethods"), value: "all" },
        { label: t("orders.paymentMethod.cod"), value: "cod" },
        { label: t("orders.paymentMethod.online"), value: "online" },
      ],
      placeholder: t("orders.filter.selectPaymentMethod"),
    },
  ];

  console.log("Orders Page Rendered");

  return (
    <div className="animate-fade-in">
      <Tabs defaultValue="orders" className="w-full">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl ">{t("orders.title")}</h1>
            <p className="text-muted-foreground">{t("orders.subtitle")}</p>
          </div>
          <div className="flex items-center gap-3">
            <TabsList className="gap-2">
              <TabsTrigger value="orders" className="gap-2">
                <ShoppingCart className="h-4 w-4" />
                {t("orders.tabs.regularOrders")}
              </TabsTrigger>
              <TabsTrigger value="package_orders" className="gap-2">
                <Package className="h-4 w-4" />
                {t("orders.tabs.packageOrders")}
              </TabsTrigger>
              <TabsTrigger value="settings" className="gap-2">
                <Package className="h-4 w-4" />
                {t("orders.tabs.settings")}
              </TabsTrigger>
            </TabsList>
          </div>
        </div>

        <TabsContent value="orders" className="mt-0">
          <BaseTableList<Order>
            title=""
            description=""
            searchPlaceholder={t("orders.searchPlaceholder")}
            enableSearch={true}
            columns={columns}
            service={orderService}
            store={store}
            emptyMessage={t("orders.noOrdersFound")}
            getRowKey={(order) => order.id}
            onRefresh={handleSetRefresh}
            summaryLists={summaryLists}
            showDateFilter={true}
            filters={filterItemes}
          />
        </TabsContent>

        <TabsContent value="package_orders" className="mt-0">
          <PackageOrdersTab />
        </TabsContent>

        <TabsContent value="settings" className="mt-0">
          <Settings />
        </TabsContent>
      </Tabs>

      {/* Dialogs */}
      <FormModal
        open={dialogMode !== null}
        onClose={() => setDialogMode(null)}
        orderId={selectedOrder?.id || ""}
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
        description={`${t("orders.delete.message")} ${selectedOrder?.orderId
          }? ${t("orders.delete.cannotUndo")}`}
        onConfirm={handleDeleteOrder}
        isDeleting={isDeleting}
      />

      {/* Mark As Paid Modal */}
      <DeleteModal
        open={showMarkAsPaidModal}
        onClose={() => {
          setShowMarkAsPaidModal(false);
          setMarkAsPaidNote("");
        }}
        title={t("orders.actions.markAsPaid")}
        description={`${t("orders.actions.markAsPaidMessage")} ${selectedOrder?.orderId
          }? ${t("orders.delete.cannotUndo")}`}
        onConfirm={() => handleMarkAsPaid(selectedOrder!)}
        submitButtonText={t("orders.actions.receivePayment")}
        submitButtonVariant="default"
        isDeleting={isPaiding}
      >
        <div className="space-y-2 p-4 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900 rounded-lg">
          <Label htmlFor="markAsPaidNote" className="text-sm font-medium">
            {t("orders.form.notes")} <span className="text-destructive">*</span>
          </Label>
          <Textarea
            id="markAsPaidNote"
            value={markAsPaidNote}
            onChange={(e) => setMarkAsPaidNote(e.target.value)}
            placeholder={t("orders.form.notesPlaceholder")}
            rows={3}
            className="bg-white dark:bg-background"
            required
          />
          <p className="text-xs text-muted-foreground">
            {t("orders.form.notesHelperText")}
          </p>
        </div>
      </DeleteModal>

      <UpdateOrderStatusModal
        open={showUpdateStatusModal}
        onClose={setShowUpdateStatusModal}
        orderId={selectedOrder?.id ? Number(selectedOrder.id) : null}
        status={selectedOrder?.status || ""}
        onSuccess={() => refreshTable?.()}
      />

      <UpdateDeliveryTimeModal
        open={showUpdateDeliveryTimeModal}
        onClose={setShowUpdateDeliveryTimeModal}
        orderId={selectedOrder?.orderId || null}
        onSuccess={() => refreshTable?.()}
      />

      <ModificaitonHistoryModal
        open={showModificationHistoryModal}
        onClose={setShowModificationHistoryModal}
        orderId={selectedOrder?.id || null}
      />
    </div>
  );
}

export default withPermission(Orders, permissions.orders.view);
