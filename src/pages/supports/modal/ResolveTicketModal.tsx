import { useState } from "react";
import { useTranslation } from "react-i18next";
import { BaseModal } from "@/components/modals/BaseModal";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import supportService from "@/services/supportService";
import { SupportTicket } from "@/stores/supportStore";

interface ResolveTicketModalProps {
  open: boolean;
  onClose: () => void;
  ticket: SupportTicket;
  onSuccess: () => void;
}

export default function ResolveTicketModal({
  open,
  onClose,
  ticket,
  onSuccess,
}: ResolveTicketModalProps) {
  const { t } = useTranslation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resolutionNote, setResolutionNote] = useState("");

  const handleSubmit = async () => {
    if (!resolutionNote.trim()) {
      toast.error(t("support.resolve.noteRequired"));
      return;
    }

    setIsSubmitting(true);
    try {
      await supportService.resolveTicket(ticket.id, resolutionNote.trim());
      toast.success(t("support.messages.resolved"));
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Error resolving ticket:", error);
      toast.error(t("support.messages.failedToResolve"));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <BaseModal
      open={open}
      onOpenChange={onClose}
      title={t("support.resolve.title")}
      onSubmit={handleSubmit}
      isSubmitting={isSubmitting}
      submitButtonText={t("support.resolve.submit")}
      size="lg"
    >
      <div className="space-y-4">
        <div className="p-3 bg-blue-50 dark:bg-blue-950 rounded-lg border border-blue-200 dark:border-blue-800">
          <p className="text-sm text-blue-900 dark:text-blue-100">
            <span className="font-semibold">Ticket:</span> {ticket.ticketNumber}
          </p>
          <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
            <span className="font-semibold">Subject:</span> {ticket.subject}
          </p>
        </div>

        <div>
          <Label htmlFor="resolutionNote">
            {t("support.resolve.resolutionNote")} *
          </Label>
          <Textarea
            id="resolutionNote"
            value={resolutionNote}
            onChange={(e) => setResolutionNote(e.target.value)}
            placeholder={t("support.resolve.resolutionNotePlaceholder")}
            rows={6}
          />
        </div>
      </div>
    </BaseModal>
  );
}
