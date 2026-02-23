import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { BaseModal } from "@/components/modals";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import orderService from "@/services/orderService";

interface UpdateOrderStatusModalProps {
  open: boolean;
  onClose: (value: boolean) => void;
  orderId: number | null;
  status: string;
  onSuccess?: () => void;
}

export default function UpdateOrderStatusModal({
  open,
  onClose,
  orderId,
  status: initialStatus,
  onSuccess,
}: UpdateOrderStatusModalProps) {
  const { t } = useTranslation();
  const [status, setStatus] = useState<string>(initialStatus);
  const [note, setNote] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const statusOptions = [
    "pending",
    "confirmed",
    "approved",
    "shipped",
    "delivered",
    "cancelled",
    "cancelled_at_delivery",
    "returned",
  ];

  // Reset form when modal opens/closes
  useEffect(() => {
    if (!open) {
      setStatus("");
      setNote("");
    }
    setStatus(initialStatus);
  }, [open, initialStatus]);

  const handleSubmit = async () => {
    if (!orderId) return;

    // Validate required fields
    if (!status) {
      toast.error(t("orders.messages.selectStatus"));
      return;
    }

    setIsSubmitting(true);
    try {
      await orderService.updateOrderStatus(orderId, status, note || undefined);
      toast.success(t("orders.messages.statusUpdated"));
      onSuccess?.();
      onClose(false);
    } catch (error) {
      console.error("Error updating order status:", error);
      toast.error(t("orders.messages.failedToUpdateStatus"));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <BaseModal
      open={open}
      onOpenChange={() => onClose(false)}
      title={t("orders.updateStatus.title")}
      onSubmit={handleSubmit}
      isSubmitting={isSubmitting}
      submitButtonText={t("update")}
      size="md"
    >
      <div className="grid gap-4">
        {/* Status Select */}
        <div className="space-y-2">
          <Label htmlFor="status">
            {t("orders.updateStatus.status")}{" "}
            <span className="text-red-500">*</span>
          </Label>
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger id="status">
              <SelectValue
                placeholder={t("orders.updateStatus.selectStatus")}
              />
            </SelectTrigger>
            <SelectContent>
              {statusOptions.map((statusOption) => (
                <SelectItem key={statusOption} value={statusOption}>
                  {t(`orders.status.${statusOption}`)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Note Textarea */}
        <div className="space-y-2">
          <Label htmlFor="note">{t("orders.updateStatus.note")}</Label>
          <Textarea
            id="note"
            placeholder={t("orders.updateStatus.notePlaceholder")}
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={4}
          />
        </div>
      </div>
    </BaseModal>
  );
}
