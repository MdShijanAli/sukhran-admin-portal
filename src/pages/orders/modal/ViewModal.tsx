import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { BaseModal } from "@/components/modals";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Loader2, Package, User, MapPin, CreditCard } from "lucide-react";
import { Order } from "@/stores/orderStore";
import orderService from "@/services/orderService";
import { formatDate, formatNumberWithCommas } from "@/lib/utils";

interface ViewModalProps {
  open: boolean;
  onClose: (value: boolean) => void;
  orderId: number | string | null;
}

export default function ViewModal({ open, onClose, orderId }: ViewModalProps) {
  const { t } = useTranslation();
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      if (!orderId || !open) return;
      setIsLoading(true);
      try {
        const response = await orderService.fetchDetails(orderId);
        const responseData = response as unknown as Record<string, unknown>;
        const orderData =
          (responseData?.order as Order) || (response as unknown as Order);
        console.log("Fetched order details:", orderData);
        setOrder(orderData);
      } catch (error) {
        console.error("Error fetching order details:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchOrderDetails();
  }, [orderId, open]);

  if (!order && !isLoading) return null;

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

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case "paid":
        return "bg-success/10 text-success border-success/20";
      case "pending":
        return "bg-warning/10 text-warning border-warning/20";
      case "failed":
        return "bg-destructive/10 text-destructive border-destructive/20";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <BaseModal
      open={open}
      onOpenChange={onClose}
      title={t("orders.view.orderDetails")}
      showSubmitButton={false}
      closeButtonText={t("close")}
      size="2xl"
    >
      {isLoading ? (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : order ? (
        <div className="space-y-4">
          {/* Order Header */}
          <div className="flex items-center justify-between p-4 bg-card border rounded-lg">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-primary/10 rounded-lg">
                <Package className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">{order.orderId}</h3>
                <p className="text-sm text-muted-foreground">
                  {formatDate(order.created_at)}
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <Badge className={getStatusColor(order.status)}>
                {t(`orders.status.${order.status}`)}
              </Badge>
              <Badge className={getPaymentStatusColor(order.paymentStatus)}>
                {t(`orders.paymentStatus.${order.paymentStatus}`)}
              </Badge>
            </div>
          </div>

          {/* Customer Information */}
          <div className="border rounded-lg overflow-hidden">
            <div className="flex items-center gap-2 px-4 py-3 bg-muted/50 border-b">
              <User className="h-4 w-4" />
              <h4 className="font-semibold text-sm">
                {t("orders.view.customerInfo")}
              </h4>
            </div>
            <div className="p-4 space-y-3">
              <div>
                <Label className="text-xs text-muted-foreground">
                  {t("name")}
                </Label>
                <p className="font-medium">{order.customer.name}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-xs text-muted-foreground">
                    {t("phone")}
                  </Label>
                  <p className="font-medium">{order.customer.mobile}</p>
                </div>
                {order.customer.email && (
                  <div>
                    <Label className="text-xs text-muted-foreground">
                      {t("email")}
                    </Label>
                    <p className="font-medium">{order.customer.email}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Delivery Information */}
          <div className="border rounded-lg overflow-hidden">
            <div className="flex items-center gap-2 px-4 py-3 bg-muted/50 border-b">
              <MapPin className="h-4 w-4" />
              <h4 className="font-semibold text-sm">
                {t("orders.view.deliveryInfo")}
              </h4>
            </div>
            <div className="p-4 space-y-3">
              <div>
                <Label className="text-xs text-muted-foreground">
                  {t("orders.form.deliveryAddress")}
                </Label>
                <p className="font-medium">
                  {order.address.street || order.address.city || "N/A"}
                </p>
              </div>
            </div>
          </div>

          {/* Order Items */}
          {order.items && order.items.length > 0 && (
            <div className="border rounded-lg overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 bg-muted/50 border-b">
                <h4 className="font-semibold text-sm">
                  {t("orders.view.orderItems")}
                </h4>
                <Badge variant="secondary">
                  {order.items.length} {t("orders.view.item")}(s)
                </Badge>
              </div>
              <div className="p-4">
                <div className="space-y-3">
                  {order.items.map((item, index) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between p-3 bg-muted/30 rounded-lg"
                    >
                      <div className="flex-1">
                        <p className="font-medium">
                          {item.itemType === "product"
                            ? item.product?.name || "Product"
                            : "Package"}
                        </p>
                        {item.sku && (
                          <p className="text-xs text-muted-foreground">
                            {item.sku.name}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center gap-4 text-sm">
                        <div className="text-center">
                          <Label className="text-xs text-muted-foreground">
                            {t("orders.view.quantity")}
                          </Label>
                          <p className="font-medium">{item.quantity}</p>
                        </div>
                        <div className="text-center">
                          <Label className="text-xs text-muted-foreground">
                            {t("orders.view.price")}
                          </Label>
                          <p className="font-medium">
                            ৳{formatNumberWithCommas(item.unitPrice)}
                          </p>
                        </div>
                        <div className="text-right">
                          <Label className="text-xs text-muted-foreground">
                            {t("orders.view.total")}
                          </Label>
                          <p className="font-semibold">
                            ৳{formatNumberWithCommas(item.itemCost)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Pricing Summary */}
          <div className="border rounded-lg overflow-hidden">
            <div className="flex items-center gap-2 px-4 py-3 bg-muted/50 border-b">
              <CreditCard className="h-4 w-4" />
              <h4 className="font-semibold text-sm">
                {t("orders.view.pricingSummary")}
              </h4>
            </div>
            <div className="p-4 space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">
                  {t("orders.form.subtotal")}
                </span>
                <span className="font-medium">
                  ৳{formatNumberWithCommas(order.receipt.subTotal)}
                </span>
              </div>
              {order.receipt.discount > 0 && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    {t("orders.form.discount")}
                  </span>
                  <span className="font-medium text-destructive">
                    -৳{formatNumberWithCommas(order.receipt.discount)}
                  </span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-muted-foreground">
                  {t("orders.form.deliveryFee")}
                </span>
                <span className="font-medium">
                  ৳{formatNumberWithCommas(order.receipt.deliveryCharge)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">
                  VAT ({order.receipt.vatPercentage}%)
                </span>
                <span className="font-medium">
                  ৳{formatNumberWithCommas(order.receipt.vat)}
                </span>
              </div>
              <div className="flex justify-between pt-3 border-t">
                <span className="text-lg font-semibold">
                  {t("orders.form.total")}
                </span>
                <span className="text-xl font-bold text-primary">
                  ৳{formatNumberWithCommas(order.receipt.grandTotal)}
                </span>
              </div>
            </div>
          </div>

          {/* Payment & Status */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 border rounded-lg">
              <Label className="text-xs text-muted-foreground">
                {t("orders.form.paymentMethod")}
              </Label>
              <p className="font-medium capitalize">
                {t(`orders.paymentMethod.${order.paymentMode}`)}
              </p>
            </div>
            <div className="p-4 border rounded-lg">
              <Label className="text-xs text-muted-foreground">
                {t("orders.form.orderStatus")}
              </Label>
              <p className="font-medium capitalize">
                {t(`orders.status.${order.status}`)}
              </p>
            </div>
          </div>

          {/* Order Notes */}
          {(order.customerNotes || order.adminNotes) && (
            <div className="space-y-3">
              {order.customerNotes && (
                <div className="p-4 bg-muted/50 border rounded-lg">
                  <Label className="text-xs text-muted-foreground">
                    Customer Notes
                  </Label>
                  <p className="text-sm mt-1">{order.customerNotes}</p>
                </div>
              )}
              {order.adminNotes && (
                <div className="p-4 bg-muted/50 border rounded-lg">
                  <Label className="text-xs text-muted-foreground">
                    Admin Notes
                  </Label>
                  <p className="text-sm mt-1">{order.adminNotes}</p>
                </div>
              )}
            </div>
          )}

          {/* Order Timeline */}
          <div className="border rounded-lg p-4">
            <h4 className="font-semibold text-sm mb-3">
              {t("orders.view.orderHistory")}
            </h4>
            {order.timeline && order.timeline.length > 0 ? (
              <div className="space-y-2">
                {order.timeline.map((event, index) => (
                  <div key={index} className="flex items-center gap-3 text-sm">
                    <div className="w-2 h-2 rounded-full bg-primary" />
                    <div className="flex-1">
                      <p className="font-medium">
                        {t(`orders.status.${event.status}`)}
                      </p>
                      {event.note && (
                        <p className="text-xs text-muted-foreground">
                          {event.note}
                        </p>
                      )}
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {formatDate(event.timestamp)}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                No timeline available
              </p>
            )}
          </div>
        </div>
      ) : null}
    </BaseModal>
  );
}
