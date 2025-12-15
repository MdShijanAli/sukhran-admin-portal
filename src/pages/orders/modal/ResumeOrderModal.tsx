import { useState } from "react";
import { useTranslation } from "react-i18next";
import { BaseModal } from "@/components/modals/BaseModal";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import orderService from "@/services/orderService";

interface ResumeOrderModalProps {
  open: boolean;
  onClose: () => void;
  orderId: number;
  onSuccess: () => void;
}

export default function ResumeOrderModal({
  open,
  onClose,
  orderId,
  onSuccess,
}: ResumeOrderModalProps) {
  const { t } = useTranslation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [reason, setReason] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (!reason.trim()) {
      setError(
        t("orders.packageOrders.modals.resumeOrder.validation.reasonRequired")
      );
      return;
    }
    if (reason.trim().length < 10) {
      setError(
        t("orders.packageOrders.modals.resumeOrder.validation.reasonMinLength")
      );
      return;
    }

    setIsSubmitting(true);
    try {
      await orderService.resumePackageOrder(orderId, { reason: reason.trim() });
      toast.success(t("orders.packageOrders.messages.orderResumed"));
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Error resuming order:", error);
      toast.error(t("orders.packageOrders.messages.failedToResume"));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <BaseModal
      open={open}
      onOpenChange={onClose}
      title={t("orders.packageOrders.modals.resumeOrder.title")}
      onSubmit={handleSubmit}
      isSubmitting={isSubmitting}
      submitButtonText={t("submit")}
    >
      <div className="space-y-4">
        <div>
          <Label htmlFor="reason">
            {t("orders.packageOrders.modals.resumeOrder.reason")} *
          </Label>
          <Textarea
            id="reason"
            value={reason}
            onChange={(e) => {
              setReason(e.target.value);
              setError("");
            }}
            placeholder={t(
              "orders.packageOrders.modals.resumeOrder.reasonPlaceholder"
            )}
            rows={4}
          />
          {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
        </div>
      </div>
    </BaseModal>
  );
}
