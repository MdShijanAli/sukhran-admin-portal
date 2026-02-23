import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { BaseModal } from "@/components/modals";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Loader2, Truck, MapPin, User } from "lucide-react";
import { Delivery } from "@/stores/deliveryStore";
import deliveryService from "@/services/deliveryService";
import { formatDate } from "@/lib/utils";

interface TrackingModalProps {
  open: boolean;
  onClose: (open: boolean) => void;
  deliveryId: number | string | null;
}

export default function TrackingModal({
  open,
  onClose,
  deliveryId,
}: TrackingModalProps) {
  const { t } = useTranslation();
  const [delivery, setDelivery] = useState<Delivery | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchDeliveryDetails = async () => {
      if (!deliveryId || !open) return;
      setIsLoading(true);
      try {
        const response = await deliveryService.fetchDetails(deliveryId);
        const responseData = response as unknown as Record<string, unknown>;
        const deliveryData =
          (responseData?.delivery as Delivery) ||
          (response as unknown as Delivery);
        console.log("Fetched delivery details:", deliveryData);
        setDelivery(deliveryData);
      } catch (error) {
        console.error("Error fetching delivery details:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDeliveryDetails();
  }, [deliveryId, open]);

  if (!delivery && !isLoading) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-warning/10 text-warning border-warning/20";
      case "assigned":
        return "bg-blue-500/10 text-blue-500 border-blue-500/20";
      case "picked-up":
        return "bg-indigo-500/10 text-indigo-500 border-indigo-500/20";
      case "in-transit":
        return "bg-primary/10 text-primary border-primary/20";
      case "delivered":
        return "bg-success/10 text-success border-success/20";
      case "failed":
      case "cancelled":
        return "bg-destructive/10 text-destructive border-destructive/20";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <BaseModal
      open={open}
      onOpenChange={onClose}
      title={t("delivery.view.deliveryDetails")}
      showCloseButton={true}
      closeButtonText={t("close")}
      showSubmitButton={false}
      size="2xl"
    >
      {isLoading ? (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : delivery ? (
        <div className="space-y-4">
          {/* Delivery Header */}
          <div className="flex items-center justify-between p-4 bg-card border rounded-lg">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-primary/10 rounded-lg">
                <Truck className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="text-lg ">
                  {delivery.delivery_number}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {t("delivery.columns.orderNumber")}: {delivery.order_number}
                </p>
              </div>
            </div>
            <Badge className={getStatusColor(delivery.status)}>
              {t(
                `delivery.status.${delivery.status === "in-transit"
                  ? "inTransit"
                  : delivery.status === "picked-up"
                    ? "pickedUp"
                    : delivery.status
                }`
              )}
            </Badge>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Customer Information */}
            <div className="border rounded-lg overflow-hidden">
              <div className="flex items-center gap-2 px-4 py-3 bg-muted/50 border-b">
                <User className="h-4 w-4" />
                <h4 className=" text-sm">
                  {t("delivery.view.customerInfo")}
                </h4>
              </div>
              <div className="p-4 space-y-3">
                <div>
                  <Label className="text-xs text-muted-foreground">
                    {t("name")}
                  </Label>
                  <p className="font-medium">{delivery.customer_name}</p>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">
                    {t("phone")}
                  </Label>
                  <p className="font-medium">{delivery.customer_phone}</p>
                </div>
              </div>
            </div>

            {/* Driver Information */}
            {delivery.driver_name && (
              <div className="border rounded-lg overflow-hidden">
                <div className="flex items-center gap-2 px-4 py-3 bg-muted/50 border-b">
                  <Truck className="h-4 w-4" />
                  <h4 className=" text-sm">
                    {t("delivery.view.driverInfo")}
                  </h4>
                </div>
                <div className="p-4 space-y-3">
                  <div>
                    <Label className="text-xs text-muted-foreground">
                      {t("delivery.form.driverName")}
                    </Label>
                    <p className="font-medium">{delivery.driver_name}</p>
                  </div>
                  {delivery.driver_phone && (
                    <div>
                      <Label className="text-xs text-muted-foreground">
                        {t("delivery.form.driverPhone")}
                      </Label>
                      <p className="font-medium">{delivery.driver_phone}</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Delivery Address */}
          <div className="border rounded-lg overflow-hidden">
            <div className="flex items-center gap-2 px-4 py-3 bg-muted/50 border-b">
              <MapPin className="h-4 w-4" />
              <h4 className=" text-sm">
                {t("delivery.form.deliveryAddress")}
              </h4>
            </div>
            <div className="p-4">
              <p className="text-sm">{delivery.delivery_address}</p>
            </div>
          </div>

          {/* Timeline */}
          <div className="grid grid-cols-3 gap-3">
            <div className="p-3 bg-card border rounded-lg">
              <Label className="text-xs text-muted-foreground">
                {t("delivery.view.scheduledTime")}
              </Label>
              <p className="font-medium text-xs mt-1">
                {formatDate(delivery.scheduled_time)}
              </p>
            </div>
            {delivery.pickup_time && (
              <div className="p-3 bg-card border rounded-lg">
                <Label className="text-xs text-muted-foreground">
                  {t("delivery.view.pickupTime")}
                </Label>
                <p className="font-medium text-xs mt-1">
                  {formatDate(delivery.pickup_time)}
                </p>
              </div>
            )}
            {delivery.delivered_time && (
              <div className="p-3 bg-card border rounded-lg">
                <Label className="text-xs text-muted-foreground">
                  {t("delivery.view.deliveredTime")}
                </Label>
                <p className="font-medium text-xs mt-1">
                  {formatDate(delivery.delivered_time)}
                </p>
              </div>
            )}
          </div>

          {/* Tracking Timeline */}
          <div className="border rounded-lg p-4">
            <p className="text-sm  mb-4">
              {t("delivery.view.trackingTimeline")}
            </p>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div
                  className={`h-2 w-2 rounded-full ${delivery.status === "pending" ||
                      delivery.status === "assigned" ||
                      delivery.status === "picked-up" ||
                      delivery.status === "in-transit" ||
                      delivery.status === "delivered"
                      ? "bg-primary"
                      : "bg-muted"
                    }`}
                />
                <p className="text-sm">{t("delivery.view.orderPlaced")}</p>
              </div>
              <div className="flex items-center gap-3">
                <div
                  className={`h-2 w-2 rounded-full ${delivery.status === "assigned" ||
                      delivery.status === "picked-up" ||
                      delivery.status === "in-transit" ||
                      delivery.status === "delivered"
                      ? "bg-primary"
                      : "bg-muted"
                    }`}
                />
                <p className="text-sm">{t("delivery.view.driverAssigned")}</p>
              </div>
              <div className="flex items-center gap-3">
                <div
                  className={`h-2 w-2 rounded-full ${delivery.status === "picked-up" ||
                      delivery.status === "in-transit" ||
                      delivery.status === "delivered"
                      ? "bg-primary"
                      : "bg-muted"
                    }`}
                />
                <p className="text-sm">{t("delivery.view.pickedUp")}</p>
              </div>
              <div className="flex items-center gap-3">
                <div
                  className={`h-2 w-2 rounded-full ${delivery.status === "in-transit" ||
                      delivery.status === "delivered"
                      ? "bg-primary"
                      : "bg-muted"
                    }`}
                />
                <p className="text-sm">{t("delivery.view.outForDelivery")}</p>
              </div>
              <div className="flex items-center gap-3">
                <div
                  className={`h-2 w-2 rounded-full ${delivery.status === "delivered" ? "bg-primary" : "bg-muted"
                    }`}
                />
                <p className="text-sm">{t("delivery.view.delivered")}</p>
              </div>
            </div>
          </div>

          {/* Notes */}
          {(delivery.delivery_notes || delivery.customer_notes) && (
            <div className="grid grid-cols-2 gap-4">
              {delivery.delivery_notes && (
                <div className="p-4 bg-muted/50 border rounded-lg">
                  <Label className="text-xs text-muted-foreground">
                    {t("delivery.form.deliveryNotes")}
                  </Label>
                  <p className="text-sm mt-1">{delivery.delivery_notes}</p>
                </div>
              )}
              {delivery.customer_notes && (
                <div className="p-4 bg-muted/50 border rounded-lg">
                  <Label className="text-xs text-muted-foreground">
                    {t("delivery.form.customerNotes")}
                  </Label>
                  <p className="text-sm mt-1">{delivery.customer_notes}</p>
                </div>
              )}
            </div>
          )}
        </div>
      ) : null}
    </BaseModal>
  );
}
