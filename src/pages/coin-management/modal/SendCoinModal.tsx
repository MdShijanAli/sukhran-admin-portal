import { useState, useEffect } from "react";
import { BaseModal } from "@/components/modals";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { CoinUser, SendCoinPayload } from "@/lib/types";
import coinService from "@/services/coinService";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { Coins, User2 } from "lucide-react";
import { formatNumberWithCommas } from "@/lib/utils";
import userService from "@/services/userService";
import { ComboboxSelect } from "@/components/custom/ComboboxSelect";
import { useUserStore, User } from "@/stores/userStore";

interface SendCoinModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  selectedUser: CoinUser | null;
}

export default function SendCoinModal({
  open,
  onClose,
  onSuccess,
  selectedUser
}: SendCoinModalProps) {
  const { t } = useTranslation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [reasonError, setReasonError] = useState<string>("");
  const [formData, setFormData] = useState<SendCoinPayload>({
    user_id: selectedUser?.user_id || 0,
    amount: 0,
    reason: "",
  });
  const userstore = useUserStore()

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

    if (formData.reason.length < 10) {
      setReasonError(t("coinManagement.messages.reasonMinLength"));
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
      toast.error(
        t(
          error.response.data.error_message ||
          "coinManagement.messages.coinsSentError",
        ),
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (open) {
      if (selectedUser) {
        // Pre-selected user mode
        setFormData({
          user_id: selectedUser.user_id,
          amount: 0,
          reason: "",
        });
      } else {
        // Selection mode
        setFormData({
          user_id: 0,
          amount: 0,
          reason: "",
        });
      }
      setReasonError("");
    } else if (!open) {
      setFormData({
        user_id: 0,
        amount: 0,
        reason: "",
      });
      setReasonError("");
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
        {/* User Information - Conditional: Select or Display */}
        {selectedUser ? (
          // Pre-selected user - Read Only Display
          <div className="space-y-2">
            <Label>{t("coinManagement.sendCoin.selectedUser")}</Label>
            <Card className="p-4 bg-muted/50">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <p className=" text-base">
                      {selectedUser.name}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {selectedUser.email}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 bg-background px-3 py-1.5 rounded-md border">
                    <Coins className="h-4 w-4 text-amber-600" />
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground">
                        {t(
                          "coinManagement.userBalances.columns.currentBalance",
                        )}
                      </p>
                      <p className=" text-amber-600">
                        {formatNumberWithCommas(selectedUser.statistics.net_coins)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        ) : (
          // Selection mode - Dropdown
          <div className="space-y-2">
            <Label htmlFor="user_id">
              {t("coinManagement.sendCoin.selectUser")} *
            </Label>
            <ComboboxSelect<User>
              service={userService}
              store={userstore}
              additionalParams={{ role_id: "1" }}
              storeDataKey="users"
              enableApiSearch={true}
              value={formData.user_id ? formData.user_id.toString() : ""}
              onValueChange={(value) => setFormData({ ...formData, user_id: Number(value) })}
              placeholder={t("coinManagement.sendCoin.selectUserPlaceholder")}
              searchPlaceholder={t(
                "coinManagement.sendCoin.searchUsersPlaceholder",
              )}
              emptyText={t("coinManagement.sendCoin.noUsersFound")}
              getOptionValue={(user) => user.id}
              getOptionLabel={(user) =>
                `${user.firstName} ${user.lastName}`
              }
              renderOption={(user) => (
                <div className="flex flex-col">
                  <span className="font-medium">
                    {user.firstName} {user.lastName}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {user.mobile}
                  </span>
                </div>
              )}
              icon={
                <User2 className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              }
            />
          </div>
        )}

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
            onChange={(e) => {
              const value = e.target.value;
              setFormData({ ...formData, reason: value });
              if (value.length > 0 && value.length < 10) {
                setReasonError(t("coinManagement.messages.reasonMinLength"));
              } else {
                setReasonError("");
              }
            }}
            placeholder={t("coinManagement.sendCoin.reasonPlaceholder")}
            rows={4}
            className={reasonError ? "border-red-500" : ""}
          />
          {reasonError && <p className="text-sm text-red-500">{reasonError}</p>}
          <p className="text-xs text-muted-foreground">
            {formData.reason.length}/10 characters minimum
          </p>
        </div>
      </div>
    </BaseModal>
  );
}
