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

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case "paid":
        return "bg-success/10 text-success border-success/20";
      case "pending":
        return "bg-warning/10 text-warning border-warning/20";
      case "failed":
        return "bg-destructive/10 text-destructive border-destructive/20";
      case "refunded":
        return "bg-blue-500/10 text-blue-500 border-blue-500/20";
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
      size="3xl"
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
                <h3 className="text-lg font-semibold">{order.order_number}</h3>
                <p className="text-sm text-muted-foreground">
                  {formatDate(order.created_at)}
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <Badge className={getStatusColor(order.status)}>
                {t(
                  `orders.status.${
                    order.status === "in-transit" ? "inTransit" : order.status
                  }`
                )}
              </Badge>
              <Badge className={getPaymentStatusColor(order.payment_status)}>
                {t(`orders.paymentStatus.${order.payment_status}`)}
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
                <p className="font-medium">{order.customer_name}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-xs text-muted-foreground">
                    {t("phone")}
                  </Label>
                  <p className="font-medium">{order.customer_phone}</p>
                </div>
                {order.customer_email && (
                  <div>
                    <Label className="text-xs text-muted-foreground">
                      {t("email")}
                    </Label>
                    <p className="font-medium">{order.customer_email}</p>
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
                <p className="font-medium">{order.delivery_address}</p>
              </div>
              {order.delivery_agent_name && (
                <div>
                  <Label className="text-xs text-muted-foreground">
                    {t("orders.form.deliveryAgent")}
                  </Label>
                  <p className="font-medium">{order.delivery_agent_name}</p>
                </div>
              )}
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
                        <p className="font-medium">{item.product_name}</p>
                        {item.sku_name && (
                          <p className="text-xs text-muted-foreground">
                            {item.sku_name}
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
                            ৳{formatNumberWithCommas(item.unit_price)}
                          </p>
                        </div>
                        <div className="text-right">
                          <Label className="text-xs text-muted-foreground">
                            {t("orders.view.total")}
                          </Label>
                          <p className="font-semibold">
                            ৳{formatNumberWithCommas(item.total_price)}
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
                  ৳{formatNumberWithCommas(order.subtotal)}
                </span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    {t("orders.form.discount")}
                  </span>
                  <span className="font-medium text-destructive">
                    -৳{formatNumberWithCommas(order.discount)}
                  </span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-muted-foreground">
                  {t("orders.form.deliveryFee")}
                </span>
                <span className="font-medium">
                  ৳{formatNumberWithCommas(order.delivery_fee)}
                </span>
              </div>
              <div className="flex justify-between pt-3 border-t">
                <span className="text-lg font-semibold">
                  {t("orders.form.total")}
                </span>
                <span className="text-xl font-bold text-primary">
                  ৳{formatNumberWithCommas(order.total)}
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
                {t(`orders.paymentMethod.${order.payment_method}`)}
              </p>
            </div>
            <div className="p-4 border rounded-lg">
              <Label className="text-xs text-muted-foreground">
                {t("orders.form.orderStatus")}
              </Label>
              <p className="font-medium capitalize">
                {t(
                  `orders.status.${
                    order.status === "in-transit" ? "inTransit" : order.status
                  }`
                )}
              </p>
            </div>
          </div>

          {/* Order Notes */}
          {order.notes && (
            <div className="p-4 bg-muted/50 border rounded-lg">
              <Label className="text-xs text-muted-foreground">
                {t("orders.form.notes")}
              </Label>
              <p className="text-sm mt-1">{order.notes}</p>
            </div>
          )}

          {/* Order Timeline */}
          <div className="grid grid-cols-3 gap-3 text-sm">
            <div className="p-3 bg-card border rounded-lg">
              <Label className="text-xs text-muted-foreground">
                {t("orders.view.createdAt")}
              </Label>
              <p className="font-medium text-xs">
                {formatDate(order.created_at)}
              </p>
            </div>
            <div className="p-3 bg-card border rounded-lg">
              <Label className="text-xs text-muted-foreground">
                {t("orders.view.updatedAt")}
              </Label>
              <p className="font-medium text-xs">
                {formatDate(order.updated_at)}
              </p>
            </div>
            {order.delivered_at && (
              <div className="p-3 bg-card border rounded-lg">
                <Label className="text-xs text-muted-foreground">
                  {t("orders.view.deliveredAt")}
                </Label>
                <p className="font-medium text-xs">
                  {formatDate(order.delivered_at)}
                </p>
              </div>
            )}
          </div>
        </div>
      ) : null}
    </BaseModal>
  );
}
