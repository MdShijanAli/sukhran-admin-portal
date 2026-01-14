import { useState } from "react";
import { useTranslation } from "react-i18next";
import { BaseModal } from "@/components/modals/BaseModal";
import { Label } from "@/components/ui/label";
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

interface ChangePriorityModalProps {
  open: boolean;
  onClose: () => void;
  ticket: SupportTicket;
  onSuccess: () => void;
}

export default function ChangePriorityModal({
  open,
  onClose,
  ticket,
  onSuccess,
}: ChangePriorityModalProps) {
  const { t } = useTranslation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newPriority, setNewPriority] = useState("");

  const handleSubmit = async () => {
    if (!newPriority) {
      toast.error(t("support.validation.priorityChangeRequired"));
      return;
    }

    setIsSubmitting(true);
    try {
      await supportService.changePriority(ticket.id, newPriority);
      toast.success(t("support.messages.priorityChanged"));
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Error changing priority:", error);
      toast.error(
        error.response.data.message ||
          t("support.messages.failedToChangePriority")
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <BaseModal
      open={open}
      onOpenChange={onClose}
      title={t("support.changePriority.title")}
      onSubmit={handleSubmit}
      isSubmitting={isSubmitting}
      submitButtonText={t("support.changePriority.submit")}
      size="md"
    >
      <div className="space-y-4">
        {/* Current Priority */}
        <div>
          <Label>{t("support.changePriority.currentPriority")}</Label>
          <div className="mt-2">
            <Badge>{t(`support.tickets.priority.${ticket.priority}`)}</Badge>
          </div>
        </div>

        {/* New Priority */}
        <div>
          <Label htmlFor="newPriority">
            {t("support.changePriority.newPriority")} *
          </Label>
          <Select value={newPriority} onValueChange={setNewPriority}>
            <SelectTrigger id="newPriority">
              <SelectValue
                placeholder={t("support.changePriority.priorityPlaceholder")}
              />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="urgent">
                {t("support.tickets.priority.urgent")}
              </SelectItem>
              <SelectItem value="high">
                {t("support.tickets.priority.high")}
              </SelectItem>
              <SelectItem value="medium">
                {t("support.tickets.priority.medium")}
              </SelectItem>
              <SelectItem value="low">
                {t("support.tickets.priority.low")}
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </BaseModal>
  );
}
