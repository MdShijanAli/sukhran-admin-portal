import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { BaseModal } from "@/components/modals/BaseModal";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { PackageBatchDetails, PackageOrder } from "@/lib/types";
import { Calendar, Pause, Edit, Trash2, CheckCircle } from "lucide-react";
import orderService from "@/services/orderService";
import { formatNumberWithCommas } from "@/lib/utils";
import SetDeliveryDateModal from "./SetDeliveryDateModal";
import ModifyItemsModal from "./ModifyItemsModal";
import CancelOrderModal from "./CancelOrderModal";
import ResumeOrderModal from "./ResumeOrderModal";
import PauseOrderModal from "./PauseOrderModal";
import {
  ActionItem,
  BaseTable,
  Column,
  DropdownMenuActions,
} from "@/components/table";
import usePermissions from "@/hooks/use-permissions";
import permissions from "@/lib/permissions";
import StatusView from "@/components/custom/StatusView";
import { DeleteModal } from "@/components/modals";
import { toast } from "@/components/ui/sonner";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface PackageBatchDetailsModalProps {
  open: boolean;
  onClose: () => void;
  batchId: string | null;
}

export default function PackageBatchDetailsModal({
  open,
  onClose,
  batchId,
}: PackageBatchDetailsModalProps) {
  const { t } = useTranslation();
  const { hasPermission } = usePermissions();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [details, setDetails] = useState<PackageBatchDetails | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<PackageOrder | null>(null);
  const [showSetDateModal, setShowSetDateModal] = useState(false);
  const [showModifyModal, setShowModifyModal] = useState(false);
  const [showPauseModal, setShowPauseModal] = useState(false);
  const [showResumeModal, setShowResumeModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showMarkAsPaidModal, setShowMarkAsPaidModal] = useState(false);
  const [isPaiding, setIsPaiding] = useState(false);
  const [markAsPaidNote, setMarkAsPaidNote] = useState("");

  const fetchDetails = async () => {
    if (!batchId) return;

    try {
      setLoading(true);
      setError(null);
      const response = await orderService.fetchPackageOrderDetails(batchId);
      setDetails(response.data);
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      setError(error.response?.data?.message || "Failed to load details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open && batchId) {
      fetchDetails();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, batchId]);

  const handleSetDeliveryDate = (order: PackageOrder) => {
    setSelectedOrder(order);
    setShowSetDateModal(true);
  };

  const handleModifyItems = (order: PackageOrder) => {
    setSelectedOrder(order);
    setShowModifyModal(true);
  };

  const handlePause = (order: PackageOrder) => {
    setSelectedOrder(order);
    setShowPauseModal(true);
  };

  const handleResume = (order: PackageOrder) => {
    setSelectedOrder(order);
    setShowResumeModal(true);
  };

  const handleCancel = (order: PackageOrder) => {
    setSelectedOrder(order);
    setShowCancelModal(true);
  };

  const handleSuccess = () => {
    fetchDetails(); // Refresh data
  };

  const handleModalClose = () => {
    setDetails(null);
    setError(null);
    setSelectedOrder(null);
    onClose();
  };

  const handleMarkAsPaid = async (order: PackageOrder) => {
    setSelectedOrder(order);
    setShowMarkAsPaidModal(true);
  };

  const handlePackegeOrderMarkAsPaid = async (order: PackageOrder) => {
    if (!markAsPaidNote.trim()) {
      toast.error(t("orders.messages.notesRequired"));
      return;
    }

    try {
      setIsPaiding(true);
      await orderService.markPackageOrderAsPaid(order.id, {
        payment_status: "paid",
        notes: markAsPaidNote,
      });
      toast.success(t("orders.messages.markedAsPaid"));

      setMarkAsPaidNote("");
      fetchDetails(); // Refresh data
      setShowMarkAsPaidModal(false);
    }
    catch (err) {
      console.error("Failed to mark as paid:", err);
      toast.error(err.response.data.error_message || t("orders.messages.failedToMarkAsPaid"));
    }
    finally {
      setIsPaiding(false);
    }
  }

  // Define actions for dropdown menu
  const orderActions = (order: PackageOrder): ActionItem<PackageOrder>[] => [
    {
      label: t("orders.actions.edit"),
      icon: Edit,
      onClick: handleModifyItems,
      show: hasPermission(permissions.orders.manage) && order.payment_status !== 'paid',
    },
    {
      label: t("orders.actions.setDeliveryDate"),
      icon: Calendar,
      onClick: handleSetDeliveryDate,
      show: hasPermission(permissions.orders.manage) && order.payment_status !== 'paid',
    },
    {
      label: t("orders.actions.pauseOrder"),
      icon: Pause,
      onClick: handlePause,
      show: hasPermission(permissions.orders.manage) && order.payment_status !== 'paid',
      separator: true, // Show separator after this item
    },
    {
      label: t("orders.actions.deleteOrder"),
      icon: Trash2,
      onClick: handleCancel,
      show: hasPermission(permissions.orders.delete) && order.payment_status !== 'paid',
      variant: "destructive",
      separator: true,
    },
    {
      label: t("orders.actions.markAsPaid"),
      icon: CheckCircle,
      onClick: handleMarkAsPaid,
      show:
        hasPermission(permissions.orders.manage) && order.payment_status === 'pending' && order.delivery_date !== null,
    }
  ];

  const columns: Column<PackageOrder>[] = [
    {
      key: "sl",
      label: t("orders.columns.sl"),
      render: (_, index) => index + 1,
      className: "text-center w-16",
    },
    {
      key: "orderId",
      label: t("orders.columns.orderID"),
      render: (order) => (
        <span className="font-mono text-sm">{order.orderId}</span>
      ),
    },
    {
      key: "delivery_month",
      label: t("orders.packageOrders.deliveryMonth"),
      className: "text-center",
    },
    {
      key: "status",
      label: t("orders.columns.status"),
      render: (order) => (
        <div className="flex gap-1 flex-wrap">
          <StatusView
            status={order.status}
            type="order"
            label={t(`orders.status.${order.status}`)}
          />
        </div>
      ),
    },
    {
      key: "payment_status",
      label: t("orders.columns.paymentStatus"),
      render: (order) => (
        <div className="flex gap-1 flex-wrap justify-center">
          <StatusView
            status={order.payment_status}
            type="payment"
            label={t(`orders.paymentStatus.${order.payment_status}`)}
          />
        </div>
      ),
    },
    {
      key: "items_count",
      label: t("orders.packageOrders.itemsCount"),
      className: "text-center",
    },
    {
      key: "total_items_quantity",
      label: t("orders.packageOrders.quantity"),
      className: "text-center",
    },
    {
      key: "grandTotal",
      label: t("orders.columns.total"),
      render: (order) => (
        <span> ৳{formatNumberWithCommas(order.amounts.grandTotal)}</span>
      ),
      className: "text-center",
    },
    {
      key: "delivery_date",
      label: t("orders.packageOrders.deliveryDate"),
      render: (order) =>
        order.delivery_date ? (
          new Date(order.delivery_date).toLocaleDateString()
        ) : (
          <span className="text-muted-foreground">
            {t("orders.packageOrders.notSet")}
          </span>
        ),
      className: "text-center",
    },
    {
      key: "actions",
      label: t("orders.packageOrders.actions"),
      className: "text-right",
      render: (order) => (
        <DropdownMenuActions item={order} actions={orderActions(order)} />
      ),
    },
  ];

  return (
    <>
      <BaseModal
        open={open}
        showSubmitButton={false}
        onOpenChange={handleModalClose}
        title={t("orders.packageOrders.batchDetails")}
        size="6xl"
      >
        {loading && !details ? (
          <div className="space-y-4">
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-64 w-full" />
          </div>
        ) : error ? (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        ) : details ? (
          <div className="space-y-3">
            {/* Customer & Batch Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">
                  {details.customer.name}
                </CardTitle>
                <CardDescription>
                  {t("orders.packageOrders.batchId")}: {details.batch_id}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      {t("orders.packageOrders.customer")}
                    </p>
                    <p className="font-medium">{details.customer.email}</p>
                    <p className="text-sm">{details.customer.mobile}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      {t("orders.packageOrders.schedule")}
                    </p>
                    <p className="font-medium">
                      {details.schedule_months}{" "}
                      {t("orders.packageOrders.months")} (
                      {details.frequency_per_month}x{" "}
                      {t("orders.packageOrders.perMonth")})
                    </p>
                    <p className="text-sm">
                      {t("orders.packageOrders.totalOrders")}:{" "}
                      {details.total_orders}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Orders List */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">
                  {t("orders.packageOrders.ordersList")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <BaseTable
                  columns={columns}
                  data={details.orders || []}
                  isLoading={false}
                  getRowKey={(row) => row.id}
                />
              </CardContent>
            </Card>
          </div>
        ) : null}
      </BaseModal>

      {/* Action Modals */}
      {selectedOrder && (
        <>
          <SetDeliveryDateModal
            open={showSetDateModal}
            onClose={() => {
              setShowSetDateModal(false);
              setSelectedOrder(null);
            }}
            orderId={selectedOrder.id}
            onSuccess={handleSuccess}
          />
          <ModifyItemsModal
            open={showModifyModal}
            onClose={() => {
              setShowModifyModal(false);
              setSelectedOrder(null);
            }}
            orderId={selectedOrder.id}
            currentItems={selectedOrder.items}
            onSuccess={handleSuccess}
          />
          <PauseOrderModal
            open={showPauseModal}
            onClose={() => {
              setShowPauseModal(false);
              setSelectedOrder(null);
            }}
            orderId={selectedOrder.id}
            orderNumber={selectedOrder.orderId}
            onSuccess={handleSuccess}
          />
          <ResumeOrderModal
            open={showResumeModal}
            onClose={() => {
              setShowResumeModal(false);
              setSelectedOrder(null);
            }}
            orderId={selectedOrder.id}
            orderNumber={selectedOrder.orderId}
            onSuccess={handleSuccess}
          />
          <CancelOrderModal
            open={showCancelModal}
            onClose={() => {
              setShowCancelModal(false);
              setSelectedOrder(null);
            }}
            orderId={selectedOrder.id}
            orderNumber={selectedOrder.orderId}
            onSuccess={handleSuccess}
          />

          <DeleteModal
            open={showMarkAsPaidModal}
            onClose={() => {
              setShowMarkAsPaidModal(false);
              setMarkAsPaidNote("");
            }}
            title={t("orders.actions.markAsPaid")}
            description={`${t("orders.actions.markAsPaidMessage")} ${selectedOrder?.orderId
              }? ${t("orders.delete.cannotUndo")}`}
            onConfirm={() => handlePackegeOrderMarkAsPaid(selectedOrder!)}
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
        </>
      )}
    </>
  );
}
