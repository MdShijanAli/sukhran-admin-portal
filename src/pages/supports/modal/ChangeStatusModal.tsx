import { useState } from "react";
import { useTranslation } from "react-i18next";
import { BaseModal } from "@/components/modals/BaseModal";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import supportService from "@/services/supportService";
import { SupportTicket } from "@/stores/supportStore";

interface ChangeStatusModalProps {
  open: boolean;
  onClose: () => void;
  ticket: SupportTicket;
  onSuccess: () => void;
}

export default function ChangeStatusModal({
  open,
  onClose,
  ticket,
  onSuccess,
}: ChangeStatusModalProps) {
  const { t } = useTranslation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newStatus, setNewStatus] = useState("");
  const [notes, setNotes] = useState("");

  const handleSubmit = async () => {
    if (!newStatus) {
      toast.error(t("support.validation.statusRequired"));
      return;
    }

    setIsSubmitting(true);
    try {
      await supportService.changeStatus(
        ticket.id,
        newStatus,
        notes || undefined
      );
      toast.success(t("support.messages.statusChanged"));
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Error changing status:", error);
      toast.error(
        error.response.data.message ||
          t("support.messages.failedToChangeStatus")
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <BaseModal
      open={open}
      onOpenChange={onClose}
      title={t("support.changeStatus.title")}
      onSubmit={handleSubmit}
      isSubmitting={isSubmitting}
      submitButtonText={t("support.changeStatus.submit")}
      size="lg"
    >
      <div className="space-y-4">
        {/* Current Status */}
        <div>
          <Label>{t("support.changeStatus.currentStatus")}</Label>
          <div className="mt-2">
            <Badge>{t(`support.tickets.status.${ticket.status}`)}</Badge>
          </div>
        </div>

        {/* New Status */}
        <div>
          <Label htmlFor="newStatus">
            {t("support.changeStatus.newStatus")} *
          </Label>
          <Select value={newStatus} onValueChange={setNewStatus}>
            <SelectTrigger id="newStatus">
              <SelectValue
                placeholder={t("support.changeStatus.statusPlaceholder")}
              />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="open">
                {t("support.tickets.status.open")}
              </SelectItem>
              <SelectItem value="in_progress">
                {t("support.tickets.status.in_progress")}
              </SelectItem>
              <SelectItem value="resolved">
                {t("support.tickets.status.resolved")}
              </SelectItem>
              <SelectItem value="closed">
                {t("support.tickets.status.closed")}
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Notes */}
        <div>
          <Label htmlFor="notes">{t("support.changeStatus.notes")}</Label>
          <Textarea
            id="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder={t("support.changeStatus.notesPlaceholder")}
            rows={4}
          />
        </div>
      </div>
    </BaseModal>
  );
}
