import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { PackageBatchDetails, PackageOrder } from "@/lib/types";
import { Calendar, Pause, Play, X, Edit, Package } from "lucide-react";
import orderService from "@/services/orderService";
import { formatNumberWithCommas } from "@/lib/utils";
import SetDeliveryDateModal from "./SetDeliveryDateModal";
import ModifyItemsModal from "./ModifyItemsModal";
import PauseOrderModal from "./PauseOrderModal";
import ResumeOrderModal from "./ResumeOrderModal";
import CancelOrderModal from "./CancelOrderModal";

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

  return (
    <>
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{t("orders.packageOrders.batchDetails")}</DialogTitle>
          </DialogHeader>

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
            <div className="space-y-6">
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
                  <Table>
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
                              {order.is_locked && (
                                <Badge variant="outline">
                                  {t("orders.packageOrders.locked")}
                                </Badge>
                              )}
                              {order.is_paused && (
                                <Badge variant="secondary">
                                  {t("orders.packageOrders.paused")}
                                </Badge>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>{order.items_count}</TableCell>
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
                                      onClick={() =>
                                        handleSetDeliveryDate(order)
                                      }
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
                  </Table>
                </CardContent>
              </Card>
            </div>
          ) : null}
        </DialogContent>
      </Dialog>

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
