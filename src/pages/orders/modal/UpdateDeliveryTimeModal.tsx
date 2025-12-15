import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { BaseModal } from "@/components/modals";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import orderService from "@/services/orderService";

interface UpdateDeliveryTimeModalProps {
  open: boolean;
  onClose: (value: boolean) => void;
  orderId: number | string | null;
  onSuccess?: () => void;
}

export default function UpdateDeliveryTimeModal({
  open,
  onClose,
  orderId,
  onSuccess,
}: UpdateDeliveryTimeModalProps) {
  const { t } = useTranslation();
  const [estimatedDeliveryFrom, setEstimatedDeliveryFrom] =
    useState<string>("");
  const [estimatedDeliveryTo, setEstimatedDeliveryTo] = useState<string>("");
  const [reason, setReason] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reset form when modal opens/closes
  useEffect(() => {
    if (!open) {
      setEstimatedDeliveryFrom("");
      setEstimatedDeliveryTo("");
      setReason("");
    }
  }, [open]);

  const handleSubmit = async () => {
    if (!orderId) return;

    // Validate required fields
    if (!estimatedDeliveryFrom || !estimatedDeliveryTo) {
      toast.error(t("orders.messages.fillRequiredFields"));
      return;
    }

    // Validate date range
    if (new Date(estimatedDeliveryFrom) > new Date(estimatedDeliveryTo)) {
      toast.error(t("orders.messages.invalidDateRange"));
      return;
    }

    setIsSubmitting(true);
    try {
      await orderService.updateDeliveryTime(orderId, {
        estimatedDeliveryFrom,
        estimatedDeliveryTo,
        reason: reason || undefined,
      });
      toast.success(t("orders.messages.deliveryTimeUpdated"));
      onSuccess?.();
      onClose(false);
    } catch (error) {
      console.error("Error updating delivery time:", error);
      toast.error(t("orders.messages.failedToUpdateDeliveryTime"));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <BaseModal
      open={open}
      onOpenChange={() => onClose(false)}
      title={t("orders.updateDeliveryTime.title")}
      onSubmit={handleSubmit}
      isSubmitting={isSubmitting}
      submitButtonText={t("update")}
      size="md"
    >
      <div className="grid grid-cols-2 gap-4">
        {/* Estimated Delivery From */}
        <div className="space-y-2">
          <Label htmlFor="estimatedDeliveryFrom">
            {t("orders.updateDeliveryTime.deliveryFrom")}{" "}
            <span className="text-red-500">*</span>
          </Label>
          <Input
            id="estimatedDeliveryFrom"
            type="date"
            value={estimatedDeliveryFrom}
            onChange={(e) => setEstimatedDeliveryFrom(e.target.value)}
            min={new Date().toISOString().split("T")[0]}
          />
        </div>

        {/* Estimated Delivery To */}
        <div className="space-y-2">
          <Label htmlFor="estimatedDeliveryTo">
            {t("orders.updateDeliveryTime.deliveryTo")}{" "}
            <span className="text-red-500">*</span>
          </Label>
          <Input
            id="estimatedDeliveryTo"
            type="date"
            value={estimatedDeliveryTo}
            onChange={(e) => setEstimatedDeliveryTo(e.target.value)}
            min={
              estimatedDeliveryFrom || new Date().toISOString().split("T")[0]
            }
          />
        </div>

        {/* Reason Textarea */}
        <div className="space-y-2 col-span-2">
          <Label htmlFor="reason">
            {t("orders.updateDeliveryTime.reason")}
          </Label>
          <Textarea
            id="reason"
            placeholder={t("orders.updateDeliveryTime.reasonPlaceholder")}
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            rows={4}
          />
        </div>
      </div>
    </BaseModal>
  );
}
