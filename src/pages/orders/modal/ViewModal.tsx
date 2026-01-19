import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { BaseModal } from "@/components/modals";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Loader2,
  Package,
  User,
  MapPin,
  CreditCard,
  Calendar,
  Truck,
  Clock,
  FileText,
} from "lucide-react";
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
          <div className="flex items-center justify-between p-3 bg-muted/30 border rounded-lg">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Package className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="text-sm font-semibold">{order.orderId}</p>
                <p className="text-xs text-muted-foreground">
                  {formatDate(order.created_at)}
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <div className="flex items-center gap-1.5">
                <span className="text-xs text-muted-foreground font-medium">
                  {t("status")}:
                </span>
                <Badge variant={order.status}>
                  {t(`orders.status.${order.status}`)}
                </Badge>
              </div>
              <Badge variant={order.paymentStatus}>
                {t(`orders.paymentStatus.${order.paymentStatus}`)}
              </Badge>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Customer Information */}
            <div className="border rounded-lg overflow-hidden">
              <div className="flex items-center gap-2 px-3 py-2 bg-muted/50 border-b">
                <User className="h-3.5 w-3.5" />
                <h4 className="font-medium text-xs">
                  {t("orders.view.customerInfo")}
                </h4>
              </div>
              <div className="p-3 space-y-2.5">
                <div>
                  <Label className="text-[10px] text-muted-foreground uppercase tracking-wide">
                    {t("name")}
                  </Label>
                  <p className="text-sm font-medium mt-0.5">
                    {order.customer.name}
                  </p>
                </div>
                <div>
                  <Label className="text-[10px] text-muted-foreground uppercase tracking-wide">
                    {t("phone")}
                  </Label>
                  <p className="text-sm font-medium mt-0.5">
                    {order.customer.mobile}
                  </p>
                </div>
                {order.customer.email && (
                  <div>
                    <Label className="text-[10px] text-muted-foreground uppercase tracking-wide">
                      {t("email")}
                    </Label>
                    <p className="text-sm font-medium mt-0.5">
                      {order.customer.email}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Delivery Information */}
            <div className="border rounded-lg overflow-hidden">
              <div className="flex items-center gap-2 px-3 py-2 bg-muted/50 border-b">
                <MapPin className="h-3.5 w-3.5" />
                <h4 className="font-medium text-xs">
                  {t("orders.view.deliveryInfo")}
                </h4>
              </div>
              <div className="p-3 space-y-2.5">
                <div>
                  <Label className="text-[10px] text-muted-foreground uppercase tracking-wide">
                    {t("orders.form.deliveryAddress")}
                  </Label>
                  <p className="text-sm font-medium mt-0.5">
                    {[
                      order.address.street,
                      order.address.area,
                      order.address.city,
                      order.address.state,
                      order.address.postalCode,
                    ]
                      .filter(Boolean)
                      .join(", ") || "N/A"}
                  </p>
                  {order.address.landmark && (
                    <p className="text-xs text-muted-foreground mt-1">
                      Landmark: {order.address.landmark}
                    </p>
                  )}
                </div>
                {order.address.type && (
                  <div>
                    <Label className="text-[10px] text-muted-foreground uppercase tracking-wide">
                      Address Type
                    </Label>
                    <p className="text-sm font-medium mt-0.5 capitalize">
                      {order.address.type}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Estimated Delivery */}
          {order.estimatedDelivery && (
            <div className="border rounded-lg overflow-hidden">
              <div className="flex items-center gap-2 px-3 py-2 bg-muted/50 border-b">
                <Calendar className="h-3.5 w-3.5" />
                <h4 className="font-medium text-xs">Estimated Delivery</h4>
              </div>
              <div className="p-3">
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <Label className="text-[10px] text-muted-foreground uppercase tracking-wide">
                      From
                    </Label>
                    <p className="text-sm font-medium mt-0.5">
                      {order.estimatedDelivery.fromFormatted ||
                        formatDate(order.estimatedDelivery.from)}
                    </p>
                  </div>
                  <div className="flex-1">
                    <Label className="text-[10px] text-muted-foreground uppercase tracking-wide">
                      To
                    </Label>
                    <p className="text-sm font-medium mt-0.5">
                      {order.estimatedDelivery.toFormatted ||
                        formatDate(order.estimatedDelivery.to)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Order Items */}
          {order.items && order.items.length > 0 && (
            <div className="border rounded-lg overflow-hidden">
              <div className="flex items-center justify-between px-3 py-2 bg-muted/50 border-b">
                <h4 className="font-medium text-xs">
                  {t("orders.view.orderItems")}
                </h4>
                <Badge variant="secondary" className="text-xs h-5">
                  {order.items.length} {t("orders.view.item")}(s)
                </Badge>
              </div>
              <div className="divide-y">
                {order.items.map((item, index) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-3 p-3 hover:bg-muted/30 transition-colors"
                  >
                    {item.product?.image_url && (
                      <img
                        src={item.product.image_url}
                        alt={item.product.name}
                        className="w-12 h-12 rounded-md object-cover border"
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {item.itemType === "product"
                          ? item.product?.name || "Product"
                          : "Package"}
                      </p>
                      {item.sku && (
                        <p className="text-xs text-muted-foreground">
                          {item.sku.name} • {item.sku.unitSize}{" "}
                          {item.sku.unitName}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-6 text-sm">
                      <div className="text-right">
                        <Label className="text-[10px] text-muted-foreground uppercase tracking-wide block">
                          {t("orders.view.quantity")}
                        </Label>
                        <p className="font-medium text-sm mt-0.5">
                          {item.quantity}
                        </p>
                      </div>
                      <div className="text-right">
                        <Label className="text-[10px] text-muted-foreground uppercase tracking-wide block">
                          {t("orders.view.price")}
                        </Label>
                        <p className="font-medium text-sm mt-0.5">
                          ৳{formatNumberWithCommas(item.unitPrice)}
                        </p>
                      </div>
                      <div className="text-right min-w-[80px]">
                        <Label className="text-[10px] text-muted-foreground uppercase tracking-wide block">
                          {t("orders.view.total")}
                        </Label>
                        <p className="font-semibold text-sm mt-0.5">
                          ৳{formatNumberWithCommas(item.itemCost)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Pricing Summary */}
          <div className="border rounded-lg overflow-hidden">
            <div className="flex items-center gap-2 px-3 py-2 bg-muted/50 border-b">
              <CreditCard className="h-3.5 w-3.5" />
              <h4 className="font-medium text-xs">
                {t("orders.view.pricingSummary")}
              </h4>
            </div>
            <div className="p-3 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">
                  {t("orders.form.subtotal")}
                </span>
                <span className="font-medium">
                  ৳{formatNumberWithCommas(order.receipt.subTotal)}
                </span>
              </div>
              {order.receipt.discount > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">
                    {t("orders.form.discount")}
                  </span>
                  <span className="font-medium text-destructive">
                    -৳{formatNumberWithCommas(order.receipt.discount)}
                  </span>
                </div>
              )}
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">
                  {t("orders.form.deliveryFee")}
                </span>
                <span className="font-medium">
                  ৳{formatNumberWithCommas(order.receipt.deliveryCharge)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">
                  VAT ({order.receipt.vatPercentage}%)
                </span>
                <span className="font-medium">
                  ৳{formatNumberWithCommas(order.receipt.vat)}
                </span>
              </div>
              <Separator className="my-2" />
              <div className="flex justify-between pt-1">
                <span className="text-sm font-semibold">
                  {t("orders.form.total")}
                </span>
                <span className="text-base font-bold text-primary">
                  ৳{formatNumberWithCommas(order.receipt.grandTotal)}
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Payment Information */}
            <div className="border rounded-lg overflow-hidden">
              <div className="flex items-center gap-2 px-3 py-2 bg-muted/50 border-b">
                <CreditCard className="h-3.5 w-3.5" />
                <h4 className="font-medium text-xs">Payment Information</h4>
              </div>
              <div className="p-3 space-y-2.5">
                <div>
                  <Label className="text-[10px] text-muted-foreground uppercase tracking-wide">
                    {t("orders.form.paymentMethod")}
                  </Label>
                  <p className="text-sm font-medium capitalize mt-0.5">
                    {t(`orders.paymentMethod.${order.paymentMode}`)}
                  </p>
                </div>
                <div className="flex justify-between items-center">
                  <Label className="text-[10px] text-muted-foreground uppercase tracking-wide">
                    Payment Status
                  </Label>
                  <Badge
                    className={`${getPaymentStatusColor(
                      order.paymentStatus,
                    )} mt-1`}
                  >
                    {t(`orders.paymentStatus.${order.paymentStatus}`)}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Delivery Sync Status */}
            {order.deliverySync && (
              <div className="border rounded-lg overflow-hidden">
                <div className="flex items-center gap-2 px-3 py-2 bg-muted/50 border-b">
                  <Truck className="h-3.5 w-3.5" />
                  <h4 className="font-medium text-xs">Delivery Sync</h4>
                </div>
                <div className="p-3 space-y-2.5">
                  <div className="flex justify-between items-center">
                    <Label className="text-[10px] text-muted-foreground uppercase tracking-wide">
                      Status
                    </Label>
                    <Badge
                      variant={
                        order.deliverySync.sent ? "default" : "secondary"
                      }
                      className="text-xs h-5"
                    >
                      {order.deliverySync.sent ? "Sent" : "Not Sent"}
                    </Badge>
                  </div>
                  <div>
                    <Label className="text-[10px] text-muted-foreground uppercase tracking-wide">
                      Attempts
                    </Label>
                    <p className="text-sm font-medium mt-0.5">
                      {order.deliverySync.attempts}
                    </p>
                  </div>
                  {order.deliverySync.failed &&
                    order.deliverySync.lastError && (
                      <div>
                        <Label className="text-[10px] text-destructive uppercase tracking-wide">
                          Last Error
                        </Label>
                        <p className="text-xs text-destructive mt-0.5">
                          {order.deliverySync.lastError}
                        </p>
                      </div>
                    )}
                </div>
              </div>
            )}
          </div>

          {/* Order Notes */}
          {(order.customerNotes || order.adminNotes) && (
            <div className="space-y-2">
              {order.customerNotes && (
                <div className="p-3 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900 rounded-lg">
                  <div className="flex items-center gap-2 mb-1.5">
                    <FileText className="h-3.5 w-3.5 text-blue-600" />
                    <Label className="text-xs font-medium text-blue-900 dark:text-blue-100">
                      Customer Notes
                    </Label>
                  </div>
                  <p className="text-sm text-blue-800 dark:text-blue-200">
                    {order.customerNotes}
                  </p>
                </div>
              )}
              {order.adminNotes && (
                <div className="p-3 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900 rounded-lg">
                  <div className="flex items-center gap-2 mb-1.5">
                    <FileText className="h-3.5 w-3.5 text-amber-600" />
                    <Label className="text-xs font-medium text-amber-900 dark:text-amber-100">
                      Admin Notes
                    </Label>
                  </div>
                  <p className="text-sm text-amber-800 dark:text-amber-200">
                    {order.adminNotes}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Order Timeline */}
          {order.timeline && order.timeline.length > 0 && (
            <div className="border rounded-lg overflow-hidden">
              <div className="flex items-center gap-2 px-3 py-2 bg-muted/50 border-b">
                <Clock className="h-3.5 w-3.5" />
                <h4 className="font-medium text-xs">
                  {t("orders.view.orderHistory")}
                </h4>
              </div>
              <div className="p-3">
                <div className="space-y-3">
                  {order.timeline.map((event, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="relative">
                        <div className="w-2 h-2 rounded-full bg-primary mt-1.5" />
                        {index !== order.timeline!.length - 1 && (
                          <div className="absolute left-1 top-3 w-px h-6 bg-border" />
                        )}
                      </div>
                      <div className="flex-1 pb-1">
                        <div className="flex items-center justify-between">
                          <Badge variant={event.status} className="text-xs h-5">
                            {t(`orders.status.${event.status}`)}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {formatDate(event.timestamp)}
                          </span>
                        </div>
                        {event.note && (
                          <p className="text-xs text-muted-foreground mt-1">
                            {event.note}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      ) : null}
    </BaseModal>
  );
}
