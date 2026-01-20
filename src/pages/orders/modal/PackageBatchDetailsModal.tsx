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
import { Calendar, Pause, Edit, Trash2 } from "lucide-react";
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

  // Define actions for dropdown menu
  const orderActions = (order: PackageOrder): ActionItem<PackageOrder>[] => [
    {
      label: t("orders.actions.edit"),
      icon: Edit,
      onClick: handleModifyItems,
      show: hasPermission(permissions.orders.manage),
    },
    {
      label: t("orders.actions.setDeliveryDate"),
      icon: Calendar,
      onClick: handleSetDeliveryDate,
      show: hasPermission(permissions.orders.manage),
    },
    {
      label: t("orders.actions.pauseOrder"),
      icon: Pause,
      onClick: handlePause,
      show: hasPermission(permissions.orders.manage),
      separator: true, // Show separator after this item
    },
    {
      label: t("orders.actions.deleteOrder"),
      icon: Trash2,
      onClick: handleCancel,
      show: hasPermission(permissions.orders.delete),
      variant: "destructive",
    },
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
      key: "delivery_month",
      label: t("orders.columns.status"),
      render: (order) => (
        <div className="flex gap-1 flex-wrap">
          <Badge variant={order.status as any}>
            {t(`orders.status.${order.status}`)}
          </Badge>
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
                {/* <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>
                        {t("orders.packageOrders.deliveryNumber")}
                      </TableHead>
                      <TableHead>{t("orders.columns.orderNumber")}</TableHead>
                      <TableHead>
                        {t("orders.packageOrders.deliveryMonth")}
                      </TableHead>
                      <TableHead>{t("orders.columns.status")}</TableHead>
                      <TableHead>
                        {t("orders.packageOrders.itemsCount")}
                      </TableHead>
                      <TableHead>
                        {t("orders.packageOrders.quantity")}
                      </TableHead>
                      <TableHead>{t("orders.columns.total")}</TableHead>
                      <TableHead>
                        {t("orders.packageOrders.deliveryDate")}
                      </TableHead>
                      <TableHead className="text-right">
                        {t("orders.columns.actions")}
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {details.orders.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell className="font-medium">
                          #{order.sequence}
                        </TableCell>
                        <TableCell className="font-mono text-sm">
                          {order.orderId}
                        </TableCell>
                        <TableCell>{order.delivery_month}</TableCell>
                        <TableCell>
                          <div className="flex gap-1 flex-wrap">
                            <Badge variant={order.status as any}>
                              {t(`orders.status.${order.status}`)}
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell>{order.items_count}</TableCell>
                        <TableCell>{order.total_items_quantity}</TableCell>
                        <TableCell>
                          ৳{formatNumberWithCommas(order.amounts.grandTotal)}
                        </TableCell>
                        <TableCell>
                          {order.delivery_date ? (
                            new Date(order.delivery_date).toLocaleDateString()
                          ) : (
                            <span className="text-muted-foreground">
                              {t("orders.packageOrders.notSet")}
                            </span>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1 justify-end flex-wrap">
                            {!order.is_locked &&
                              order.status !== "delivered" &&
                              order.status !== "cancelled" && (
                                <>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => handleSetDeliveryDate(order)}
                                    title={t(
                                      "orders.packageOrders.setDeliveryDate"
                                    )}
                                  >
                                    <Calendar className="h-3 w-3" />
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => handleModifyItems(order)}
                                    title={t(
                                      "orders.packageOrders.modifyItems"
                                    )}
                                  >
                                    <Edit className="h-3 w-3" />
                                  </Button>
                                  {order.is_paused ? (
                                    <Button
                                      size="sm"
                                      variant="ghost"
                                      onClick={() => handleResume(order)}
                                      title={t(
                                        "orders.packageOrders.resumeOrder"
                                      )}
                                    >
                                      <Play className="h-3 w-3" />
                                    </Button>
                                  ) : (
                                    <Button
                                      size="sm"
                                      variant="ghost"
                                      onClick={() => handlePause(order)}
                                      title={t(
                                        "orders.packageOrders.pauseOrder"
                                      )}
                                    >
                                      <Pause className="h-3 w-3" />
                                    </Button>
                                  )}
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    className="text-destructive"
                                    onClick={() => handleCancel(order)}
                                    title={t(
                                      "orders.packageOrders.cancelOrder"
                                    )}
                                  >
                                    <X className="h-3 w-3" />
                                  </Button>
                                </>
                              )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table> */}
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
        </>
      )}
    </>
  );
}
