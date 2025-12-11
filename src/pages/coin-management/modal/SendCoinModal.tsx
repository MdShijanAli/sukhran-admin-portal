import { useState, useEffect } from "react";
import { BaseModal } from "@/components/modals";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SendCoinPayload, TopHolder } from "@/lib/types";
import coinService from "@/services/coinService";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

interface SendCoinModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  topHolders: TopHolder[];
}

export default function SendCoinModal({
  open,
  onClose,
  onSuccess,
  topHolders,
}: SendCoinModalProps) {
  const { t } = useTranslation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<SendCoinPayload>({
    user_id: 0,
    amount: 0,
    reason: "",
  });

  const handleSubmit = async () => {
    // Validate required fields
    if (!formData.user_id || !formData.amount || !formData.reason) {
      toast.error(t("coinManagement.messages.fillAllFields"));
      return;
    }

    if (formData.amount <= 0) {
      toast.error(t("coinManagement.messages.invalidAmount"));
      return;
    }

    setIsSubmitting(true);
    try {
      await coinService.sendCoin(formData);
      toast.success(t("coinManagement.messages.coinsSentSuccess"));
      onSuccess?.();
      onClose();
    } catch (error) {
      console.error("Error sending coins:", error);
      toast.error(t("coinManagement.messages.coinsSentError"));
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (!open) {
      setFormData({
        user_id: 0,
        amount: 0,
        reason: "",
      });
    }
  }, [open]);

  return (
    <BaseModal
      open={open}
      onOpenChange={onClose}
      title={t("coinManagement.sendCoin.title")}
      onSubmit={handleSubmit}
      isSubmitting={isSubmitting}
      submitButtonText={
        isSubmitting
          ? t("coinManagement.sendCoin.sending")
          : t("coinManagement.sendCoin.send")
      }
      closeButtonText={t("coinManagement.sendCoin.cancel")}
    >
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="user_id">
            {t("coinManagement.sendCoin.selectUser")} *
          </Label>
          <Select
            value={formData.user_id.toString()}
            onValueChange={(value) =>
              setFormData({ ...formData, user_id: Number(value) })
            }
          >
            <SelectTrigger>
              <SelectValue
                placeholder={t("coinManagement.sendCoin.selectUserPlaceholder")}
              />
            </SelectTrigger>
            <SelectContent>
              {topHolders.map((holder) => (
                <SelectItem
                  key={holder.user.id}
                  value={holder.user.id.toString()}
                >
                  {holder.user.name} ({holder.user.email}) - Balance:{" "}
                  {holder.available_coins}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="amount">
            {t("coinManagement.sendCoin.amount")} *
          </Label>
          <Input
            id="amount"
            type="number"
            min="1"
            value={formData.amount || ""}
            onChange={(e) =>
              setFormData({ ...formData, amount: Number(e.target.value) })
            }
            placeholder={t("coinManagement.sendCoin.amountPlaceholder")}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="reason">
            {t("coinManagement.sendCoin.reason")} *
          </Label>
          <Textarea
            id="reason"
            value={formData.reason}
            onChange={(e) =>
              setFormData({ ...formData, reason: e.target.value })
            }
            placeholder={t("coinManagement.sendCoin.reasonPlaceholder")}
            rows={4}
          />
        </div>
      </div>
    </BaseModal>
  );
}
