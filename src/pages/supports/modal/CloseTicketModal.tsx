import { useState } from "react";
import { useTranslation } from "react-i18next";
import { BaseModal } from "@/components/modals/BaseModal";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import supportService from "@/services/supportService";
import { SupportTicket } from "@/stores/supportStore";

interface CloseTicketModalProps {
  open: boolean;
  onClose: () => void;
  ticket: SupportTicket;
  onSuccess: () => void;
}

export default function CloseTicketModal({
  open,
  onClose,
  ticket,
  onSuccess,
}: CloseTicketModalProps) {
  const { t } = useTranslation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resolutionNote, setResolutionNote] = useState("");

  const handleSubmit = async () => {
    if (!resolutionNote.trim()) {
      toast.error(t("support.close.noteRequired"));
      return;
    }

    setIsSubmitting(true);
    try {
      await supportService.closeTicket(ticket.id, resolutionNote.trim());
      toast.success(t("support.messages.closed"));
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Error closing ticket:", error);
      toast.error(
        error.response.data.message || t("support.messages.failedToClose")
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <BaseModal
      open={open}
      onOpenChange={onClose}
      title={t("support.close.title")}
      onSubmit={handleSubmit}
      isSubmitting={isSubmitting}
      submitButtonText={t("support.close.submit")}
      size="lg"
    >
      <div className="space-y-4">
        <div className="p-3 bg-orange-50 dark:bg-orange-950 rounded-lg border border-orange-200 dark:border-orange-800">
          <p className="text-sm text-orange-900 dark:text-orange-100">
            <span className="">Ticket:</span> {ticket.ticketNumber}
          </p>
          <p className="text-sm text-orange-700 dark:text-orange-300 mt-1">
            <span className="">Subject:</span> {ticket.subject}
          </p>
        </div>

        <div>
          <Label htmlFor="resolutionNote">
            {t("support.close.resolutionNote")} *
          </Label>
          <Textarea
            id="resolutionNote"
            value={resolutionNote}
            onChange={(e) => setResolutionNote(e.target.value)}
            placeholder={t("support.close.resolutionNotePlaceholder")}
            rows={6}
          />
        </div>
      </div>
    </BaseModal>
  );
}
