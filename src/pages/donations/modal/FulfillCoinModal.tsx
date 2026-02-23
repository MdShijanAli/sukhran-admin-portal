import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { BaseModal } from "@/components/modals/BaseModal";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Upload, X, FileText } from "lucide-react";
import { toast } from "sonner";
import donationService from "@/services/donationService";

interface FulfillCoinModalProps {
  open: boolean;
  onClose: () => void;
  channelId: number | string;
  channelName: string;
  unfulfilledAmount: number;
  onSuccess: () => void;
}

export default function FulfillCoinModal({
  open,
  onClose,
  channelId,
  channelName,
  unfulfilledAmount,
  onSuccess,
}: FulfillCoinModalProps) {
  const { t } = useTranslation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [amount, setAmount] = useState("");
  const [notes, setNotes] = useState("");
  const [proofDocument, setProofDocument] = useState<File | null>(null);
  const [fileName, setFileName] = useState("");

  useEffect(() => {
    if (open) {
      setAmount("");
      setNotes("");
      setProofDocument(null);
      setFileName("");
    }
  }, [open]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProofDocument(file);
      setFileName(file.name);
    }
  };

  const removeFile = () => {
    setProofDocument(null);
    setFileName("");
  };

  const handleSubmit = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      toast.error(t("donations.coinReport.fulfill.amountRequired"));
      return;
    }

    if (!notes.trim()) {
      toast.error(t("donations.coinReport.fulfill.notesRequired"));
      return;
    }

    if (!proofDocument) {
      toast.error(t("donations.coinReport.fulfill.fileRequired"));
      return;
    }

    if (parseFloat(amount) > unfulfilledAmount) {
      toast.error(t("donations.coinReport.fulfill.amountExceedsLimit"));
      return;
    }

    setIsSubmitting(true);
    try {
      await donationService.fulfillCoinDonation(channelId, {
        amount: parseFloat(amount),
        notes: notes.trim(),
        proof_document: proofDocument,
      });
      toast.success(t("donations.coinReport.messages.fulfilled"));
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Error fulfilling coin donation:", error);
      toast.error(t("donations.coinReport.messages.failedToFulfill"));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <BaseModal
      open={open}
      onOpenChange={onClose}
      title={t("donations.coinReport.fulfill.title")}
      onSubmit={handleSubmit}
      isSubmitting={isSubmitting}
      submitButtonText={t("donations.coinReport.fulfill.submit")}
      size="lg"
    >
      <div className="space-y-4">
        {/* Channel Info */}
        <div className="bg-blue-50 dark:bg-blue-950 p-3 rounded-lg border border-blue-200 dark:border-blue-800">
          <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
            {t("donations.coinReport.fulfill.channel")}: {channelName}
          </p>
          <p className="text-xs text-blue-700 dark:text-blue-300 mt-1">
            {t("donations.coinReport.fulfill.unfulfilledAmount")}: ৳
            {unfulfilledAmount.toFixed(2)}
          </p>
        </div>

        {/* Amount */}
        <div>
          <Label htmlFor="amount">
            {t("donations.coinReport.fulfill.amount")} *
          </Label>
          <Input
            id="amount"
            type="number"
            min="0"
            max={unfulfilledAmount}
            step="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder={t("donations.coinReport.fulfill.amountPlaceholder")}
          />
        </div>

        {/* Notes */}
        <div>
          <Label htmlFor="notes">
            {t("donations.coinReport.fulfill.notes")} *
          </Label>
          <Textarea
            id="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder={t("donations.coinReport.fulfill.notesPlaceholder")}
            rows={4}
          />
        </div>

        {/* Proof Document */}
        <div>
          <Label>{t("donations.coinReport.fulfill.proofDocument")} *</Label>
          <div className="mt-2">
            {fileName ? (
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-blue-500" />
                  <span className="text-sm">{fileName}</span>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={removeFile}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-900">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <Upload className="w-8 h-8 mb-2 text-gray-400" />
                  <p className="mb-1 text-sm text-gray-500 dark:text-gray-400">
                    <span className="">
                      {t("donations.coinReport.fulfill.selectFile")}
                    </span>
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {t("donations.coinReport.fulfill.fileFormats")}
                  </p>
                </div>
                <input
                  type="file"
                  className="hidden"
                  accept=".pdf,.png,.jpg,.jpeg"
                  onChange={handleFileChange}
                />
              </label>
            )}
          </div>
        </div>
      </div>
    </BaseModal>
  );
}
