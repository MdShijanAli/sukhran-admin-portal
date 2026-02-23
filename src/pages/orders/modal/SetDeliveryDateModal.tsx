import { useState } from "react";
import { useTranslation } from "react-i18next";
import { BaseModal } from "@/components/modals/BaseModal";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import orderService from "@/services/orderService";

interface SetDeliveryDateModalProps {
  open: boolean;
  onClose: () => void;
  orderId: number;
  onSuccess: () => void;
}

export default function SetDeliveryDateModal({
  open,
  onClose,
  orderId,
  onSuccess,
}: SetDeliveryDateModalProps) {
  const { t } = useTranslation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deliveryDate, setDeliveryDate] = useState(new Date().toISOString().split("T")[0]);

  const handleSubmit = async () => {
    if (!deliveryDate) {
      toast.error(t("orders.messages.fillRequiredFields"));
      return;
    }

    setIsSubmitting(true);
    try {
      await orderService.setPackageOrderDeliveryDate(orderId, {
        delivery_date: deliveryDate,
      });
      toast.success(t("orders.packageOrders.messages.deliveryDateSet"));
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Error setting delivery date:", error);
      toast.error(
        error.response.data.error_message ||
        t("orders.packageOrders.messages.failedToSetDate")
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <BaseModal
      open={open}
      onOpenChange={onClose}
      title={t("orders.packageOrders.modals.setDeliveryDate.title")}
      onSubmit={handleSubmit}
      isSubmitting={isSubmitting}
      submitButtonText={t("save")}
    >
      <div className="space-y-4">
        <div>
          <Label htmlFor="delivery_date">
            {t("orders.packageOrders.modals.setDeliveryDate.deliveryDate")} *
          </Label>
          <Input
            id="delivery_date"
            type="date"
            value={deliveryDate}
            onChange={(e) => setDeliveryDate(e.target.value)}
            min={new Date().toISOString().split("T")[0]}
          />
        </div>
      </div>
    </BaseModal>
  );
}
