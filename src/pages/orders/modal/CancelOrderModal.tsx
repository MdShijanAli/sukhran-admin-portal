import { useState } from "react";
import { useTranslation } from "react-i18next";
import { BaseModal } from "@/components/modals/BaseModal";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import orderService from "@/services/orderService";

interface CancelOrderModalProps {
  open: boolean;
  onClose: () => void;
  orderId: number;
  orderNumber?: string;
  onSuccess: () => void;
}

export default function CancelOrderModal({
  open,
  onClose,
  orderId,
  orderNumber,
  onSuccess,
}: CancelOrderModalProps) {
  const { t } = useTranslation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [reason, setReason] = useState("");
  const [error, setError] = useState("");

  const handleClose = () => {
    setReason("");
    setError("");
    onClose();
  };

  const handleSubmit = async () => {
    if (!reason.trim()) {
      setError(
        t("orders.packageOrders.modals.cancelOrder.validation.reasonRequired")
      );
      return;
    }
    if (reason.trim().length < 10) {
      setError(
        t("orders.packageOrders.modals.cancelOrder.validation.reasonMinLength")
      );
      return;
    }

    setIsSubmitting(true);
    try {
      await orderService.cancelPackageOrder(orderId, { reason: reason.trim() });
      toast.success(t("orders.packageOrders.messages.orderCancelled"));
      onSuccess();
      handleClose();
    } catch (error) {
      console.error("Error cancelling order:", error);
      toast.error(t("orders.packageOrders.messages.failedToCancel"));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <BaseModal
      open={open}
      onOpenChange={handleClose}
      title={t("orders.packageOrders.modals.cancelOrder.title")}
      onSubmit={handleSubmit}
      isSubmitting={isSubmitting}
      submitButtonText={t("confirm")}
    >
      <div className="space-y-4">
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            {t("orders.packageOrders.modals.cancelOrder.warning")}
          </AlertDescription>
        </Alert>

        <div>
          <Label htmlFor="reason">
            {t("orders.packageOrders.modals.cancelOrder.reason")} *
          </Label>
          <Textarea
            id="reason"
            value={reason}
            onChange={(e) => {
              setReason(e.target.value);
              setError("");
            }}
            placeholder={t(
              "orders.packageOrders.modals.cancelOrder.reasonPlaceholder"
            )}
            rows={4}
          />
          {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
        </div>
      </div>
    </BaseModal>
  );
}
