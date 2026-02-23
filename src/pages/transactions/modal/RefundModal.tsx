import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { BaseModal } from "@/components/modals/BaseModal";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import transactionService from "@/services/transactionService";
import { Upload, X, DollarSign, FileText, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import constData from "@/lib/constData";

interface RefundFormData {
  amount: string;
  reason: string;
  notes: string;
  proof: File | null;
}

interface RefundModalProps {
  open: boolean;
  onClose: () => void;
  transactionId: number | string | null;
  transactionAmount?: number;
  paymentMethod?: string;
}

export default function RefundModal({
  open,
  onClose,
  transactionId,
  transactionAmount = 0,
  paymentMethod = "cod",
}: RefundModalProps) {
  const { t } = useTranslation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [proofPreview, setProofPreview] = useState<string | null>(null);
  const [formData, setFormData] = useState<RefundFormData>({
    amount: "",
    reason: "",
    notes: "",
    proof: null,
  });

  useEffect(() => {
    if (open) {
      setFormData({
        amount: transactionAmount.toString(),
        reason: "",
        notes: "",
        proof: null,
      });
      setProofPreview(null);
    }
  }, [open, transactionAmount, paymentMethod]);

  const updateField = <K extends keyof RefundFormData>(
    field: K,
    value: RefundFormData[K],
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleProofUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const validTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "application/pdf",
    ];
    if (!validTypes.includes(file.type)) {
      toast.error(t("transactions.refund.invalidFileType"));
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error(t("transactions.refund.fileTooLarge"));
      return;
    }

    updateField("proof", file);

    // Create preview for images only
    if (file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProofPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setProofPreview(null);
    }
  };

  const removeProof = () => {
    updateField("proof", null);
    setProofPreview(null);
  };

  const handleSubmit = async () => {
    // Validation
    if (!transactionId) {
      toast.error(t("transactions.refund.noTransactionId"));
      return;
    }

    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      toast.error(t("transactions.refund.invalidAmount"));
      return;
    }

    if (parseFloat(formData.amount) > transactionAmount) {
      toast.error(t("transactions.refund.amountExceedsTransaction"));
      return;
    }

    if (!formData.reason || formData.reason.trim().length < 10) {
      toast.error(t("transactions.refund.reasonTooShort"));
      return;
    }

    setIsSubmitting(true);

    try {
      if (paymentMethod === constData.SSLCOMMERZ) {
        // Online refund - JSON body
        await transactionService.refundTransaction(transactionId, {
          amount: parseFloat(formData.amount),
          reason: formData.reason,
        });
      } else {
        // COD refund - FormData
        const submitData = new FormData();
        submitData.append("refund_amount", formData.amount);
        submitData.append("refund_reason", formData.reason);
        if (formData.notes) {
          submitData.append("refund_notes", formData.notes);
        }
        if (formData.proof) {
          submitData.append("refund_proof", formData.proof);
        }
        await transactionService.refundCODTransaction(
          transactionId,
          submitData,
        );
      }

      toast.success(t("transactions.refund.success"));
      onClose();

      // Reset form
      setFormData({
        amount: "",
        reason: "",
        notes: "",
        proof: null,
      });
      setProofPreview(null);
    } catch (error) {
      console.error("Error processing refund:", error);
      toast.error(
        error.response?.data?.message || t("transactions.refund.failed"),
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <BaseModal
      open={open}
      onOpenChange={onClose}
      title={t("transactions.refund.title")}
      onSubmit={handleSubmit}
      isSubmitting={isSubmitting}
      submitButtonText={t("transactions.refund.processRefund")}
      size="2xl"
      closeButtonText={t("transactions.refund.cancel")}
    >
      <div className="grid gap-6">
        {/* Alert Info */}
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {t("transactions.refund.alertMessage")}{" "}
            <span className="">
              {transactionAmount.toLocaleString()} BDT
            </span>
          </AlertDescription>
        </Alert>

        {/* Refund Amount */}
        <div className="space-y-2">
          <Label htmlFor="amount">
            {t("transactions.refund.amount")}{" "}
            <span className="text-destructive">*</span>
          </Label>
          <div className="relative">
            <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="amount"
              type="number"
              step="0.01"
              min="0"
              max={transactionAmount}
              value={formData.amount}
              onChange={(e) => updateField("amount", e.target.value)}
              placeholder={t("transactions.refund.amountPlaceholder")}
              className="pl-9"
            />
          </div>
          <p className="text-xs text-muted-foreground">
            {t("transactions.refund.maxAmount")}:{" "}
            <span className="">
              {transactionAmount.toLocaleString()} BDT
            </span>
          </p>
        </div>

        {/* Refund Reason */}
        <div className="space-y-2">
          <Label htmlFor="reason">
            {t("transactions.refund.reason")}{" "}
            <span className="text-destructive">*</span>
          </Label>
          <Textarea
            id="reason"
            value={formData.reason}
            onChange={(e) => updateField("reason", e.target.value)}
            placeholder={t("transactions.refund.reasonPlaceholder")}
            rows={3}
          />
          <p className="text-xs text-muted-foreground">
            {t("transactions.refund.reasonHint")}
          </p>
        </div>

        {/* COD Specific Fields */}
        {paymentMethod !== constData.SSLCOMMERZ && (
          <>
            {/* Additional Notes */}
            <div className="space-y-2">
              <Label htmlFor="notes">{t("transactions.refund.notes")}</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => updateField("notes", e.target.value)}
                placeholder={t("transactions.refund.notesPlaceholder")}
                rows={2}
              />
              <p className="text-xs text-muted-foreground">
                {t("transactions.refund.notesHint")}
              </p>
            </div>

            {/* Refund Proof */}
            <div className="space-y-2">
              <Label>
                {t("transactions.refund.proof")}{" "}
                <span className="text-destructive">*</span>
              </Label>

              {proofPreview ? (
                <div className="space-y-3">
                  <div className="relative w-full max-w-md rounded-lg overflow-hidden border bg-muted">
                    <img
                      src={proofPreview}
                      alt="Refund proof preview"
                      className="w-full h-auto object-cover"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute top-2 right-2"
                      onClick={removeProof}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  <div>
                    <Label
                      htmlFor="proof-change"
                      className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-secondary hover:bg-secondary/80 rounded-md text-sm"
                    >
                      <Upload className="h-4 w-4" />
                      {t("transactions.refund.changeProof")}
                    </Label>
                    <Input
                      id="proof-change"
                      type="file"
                      accept="image/jpeg,image/png,image/webp,application/pdf"
                      className="hidden"
                      onChange={handleProofUpload}
                    />
                  </div>
                </div>
              ) : formData.proof ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-4 border rounded-lg bg-muted">
                    <FileText className="h-8 w-8 text-muted-foreground" />
                    <div className="flex-1">
                      <p className="font-medium text-sm">
                        {formData.proof.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {(formData.proof.size / 1024).toFixed(2)} KB
                      </p>
                    </div>
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      onClick={removeProof}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  <div>
                    <Label
                      htmlFor="proof-change"
                      className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-secondary hover:bg-secondary/80 rounded-md text-sm"
                    >
                      <Upload className="h-4 w-4" />
                      {t("transactions.refund.changeProof")}
                    </Label>
                    <Input
                      id="proof-change"
                      type="file"
                      accept="image/jpeg,image/png,image/webp,application/pdf"
                      className="hidden"
                      onChange={handleProofUpload}
                    />
                  </div>
                </div>
              ) : (
                <div>
                  <Label
                    htmlFor="proof"
                    className="cursor-pointer flex items-center justify-center gap-2 w-full h-32 border-2 border-dashed rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <Upload className="h-8 w-8 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      {t("transactions.refund.proofPlaceholder")}
                    </span>
                  </Label>
                  <Input
                    id="proof"
                    type="file"
                    accept="image/jpeg,image/png,image/webp,application/pdf"
                    className="hidden"
                    onChange={handleProofUpload}
                  />
                </div>
              )}

              <p className="text-xs text-muted-foreground">
                {t("transactions.refund.proofHint")}
              </p>
            </div>
          </>
        )}

        {/* Summary */}
        <div className="bg-primary/5 rounded-lg p-4 space-y-2">
          <h4 className=" text-sm">
            {t("transactions.refund.summary")}
          </h4>
          <div className="space-y-1">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">
                {t("transactions.refund.refundType")}:
              </span>
              <span className="font-medium capitalize">
                {paymentMethod !== constData.SSLCOMMERZ ? "cod" : "online"}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">
                {t("transactions.refund.refundAmount")}:
              </span>
              <span className=" text-primary">
                {formData.amount || "0"} BDT
              </span>
            </div>
            {paymentMethod !== constData.SSLCOMMERZ && (
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">
                  {t("transactions.refund.proofAttached")}:
                </span>
                <span className="font-medium">
                  {formData.proof ? "✓ " + t("yes") : "✗ " + t("no")}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </BaseModal>
  );
}
