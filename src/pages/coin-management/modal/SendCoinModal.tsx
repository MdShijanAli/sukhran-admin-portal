import { useState, useEffect } from "react";
import { BaseModal } from "@/components/modals";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { SendCoinPayload, TopHolder } from "@/lib/types";
import coinService from "@/services/coinService";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { Coins } from "lucide-react";
import { formatNumberWithCommas } from "@/lib/utils";

interface SendCoinModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  selectedUser: TopHolder | null;
}

export default function SendCoinModal({
  open,
  onClose,
  onSuccess,
  selectedUser,
}: SendCoinModalProps) {
  const { t } = useTranslation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<SendCoinPayload>({
    user_id: selectedUser?.user.id || 0,
    amount: 0,
    reason: "",
  });

  const handleSubmit = async () => {
    // Validate required fields
    if (!formData.amount || !formData.reason) {
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
    if (open && selectedUser) {
      setFormData({
        user_id: selectedUser.user.id,
        amount: 0,
        reason: "",
      });
    } else if (!open) {
      setFormData({
        user_id: 0,
        amount: 0,
        reason: "",
      });
    }
  }, [open, selectedUser]);

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
        {/* User Information - Read Only */}
        <div className="space-y-2">
          <Label>{t("coinManagement.sendCoin.selectedUser")}</Label>
          <Card className="p-4 bg-muted/50">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-base">
                    {selectedUser?.user.name}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {selectedUser?.user.email}
                  </p>
                </div>
                <div className="flex items-center gap-2 bg-background px-3 py-1.5 rounded-md border">
                  <Coins className="h-4 w-4 text-amber-600" />
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">
                      {t("coinManagement.userBalances.columns.currentBalance")}
                    </p>
                    <p className="font-bold text-amber-600">
                      {formatNumberWithCommas(selectedUser?.total_coins || 0)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Card>
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
