import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { BaseModal } from "@/components/modals";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import referralService from "@/services/referralService";
import { Referral } from "@/lib/types";
import {
  User,
  Mail,
  Phone,
  Calendar,
  Coins,
  ShoppingCart,
  CreditCard,
  FileText,
} from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/utils";
import TimeStaps from "@/components/custom/TimeStamps";

interface ViewReferralModalProps {
  open: boolean;
  onClose: (value: boolean) => void;
  referralId: number | string | null;
}

export default function ViewReferralModal({
  open,
  onClose,
  referralId,
}: ViewReferralModalProps) {
  const { t } = useTranslation();
  const [referral, setReferral] = useState<Referral | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchReferralDetails = async () => {
      if (!referralId || !open) return;
      setIsLoading(true);
      try {
        const response = await referralService.fetchDetails(referralId);
        const responseData = response as unknown as Record<string, unknown>;
        const referralData =
          (responseData?.data as Referral) || (response as unknown as Referral);
        setReferral(referralData);
      } catch (error) {
        console.error("Error fetching referral details:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchReferralDetails();
  }, [referralId, open]);

  const getStatusBadge = (status: string) => {
    const variants: Record<
      string,
      "default" | "secondary" | "destructive" | "outline"
    > = {
      pending: "secondary",
      locked: "outline",
      credited: "default",
      cancelled: "destructive",
    };
    return (
      <Badge variant={variants[status] || "secondary"}>
        {t(`referrals.referrals.status.${status}`)}
      </Badge>
    );
  };

  if (!referral && !isLoading) return null;

  return (
    <BaseModal
      open={open}
      onOpenChange={onClose}
      title={t("referrals.referrals.view.title")}
      showSubmitButton={false}
      closeButtonText={t("close")}
      size="2xl"
    >
      {isLoading ? (
        <div className="space-y-4">
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
        </div>
      ) : referral ? (
        <div className="space-y-4">
          {/* Reward Highlight */}
          <Card className="p-4 bg-gradient-to-r from-amber-50 to-amber-100 dark:from-amber-900/20 dark:to-amber-900/10 border-amber-200 dark:border-amber-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground mb-1">
                  {t("referrals.referrals.view.coinsAmount")}
                </p>
                <p className="text-3xl font-bold text-amber-600">
                  {referral.coins_amount}
                </p>
                <p className="text-xs text-muted-foreground">coins</p>
              </div>
              <div className="w-16 h-16 rounded-full bg-amber-500 flex items-center justify-center">
                <Coins className="w-8 h-8 text-white" />
              </div>
            </div>
            <div className="flex items-center gap-2 mt-3">
              {getStatusBadge(referral.status)}
              <Badge variant="outline">{referral.status_display}</Badge>
            </div>
          </Card>

          {/* Referrer Information */}
          <Card className="p-4">
            <h4 className="font-semibold text-sm text-primary mb-3 flex items-center gap-2">
              <User className="w-4 h-4" />
              {t("referrals.referrals.view.referrerInfo")}
            </h4>
            <div className="space-y-3">
              <div className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <User className="w-6 h-6 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold">{referral.referrer.name}</p>
                  <div className="space-y-1 mt-2">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Mail className="w-3 h-3" />
                      <span>{referral.referrer.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Phone className="w-3 h-3" />
                      <span>{referral.referrer.mobile}</span>
                    </div>
                    {referral.referrer.referral_code && (
                      <div className="flex items-center gap-2 text-xs">
                        <FileText className="w-3 h-3" />
                        <span className="font-mono font-semibold text-primary">
                          {t("referrals.referrals.view.referralCode")}:{" "}
                          {referral.referrer.referral_code}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Referred User Information */}
          <Card className="p-4">
            <h4 className="font-semibold text-sm text-primary mb-3 flex items-center gap-2">
              <User className="w-4 h-4" />
              {t("referrals.referrals.view.referredUserInfo")}
            </h4>
            <div className="space-y-3">
              <div className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg">
                <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0">
                  <User className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold">{referral.referred_user.name}</p>
                  <div className="space-y-1 mt-2">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Mail className="w-3 h-3" />
                      <span>{referral.referred_user.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Phone className="w-3 h-3" />
                      <span>{referral.referred_user.mobile}</span>
                    </div>
                    {referral.referred_user.registered_at && (
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Calendar className="w-3 h-3" />
                        <span>
                          {t("referrals.referrals.view.registeredAt")}:{" "}
                          {formatDate(referral.referred_user.registered_at)}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* First Order Information */}
            {referral.first_order && (
              <Card className="p-4">
                <h4 className="font-semibold text-sm text-primary mb-3 flex items-center gap-2">
                  <ShoppingCart className="w-4 h-4" />
                  {t("referrals.referrals.view.orderInfo")}
                </h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-2 bg-muted/30 rounded">
                    <span className="text-xs text-muted-foreground">
                      {t("referrals.referrals.view.orderId")}
                    </span>
                    <span className="font-mono text-sm font-semibold">
                      {referral.first_order.orderId}
                    </span>
                  </div>
                  {referral.first_order.status && (
                    <div className="flex justify-between items-center p-2 bg-muted/30 rounded">
                      <span className="text-xs text-muted-foreground">
                        {t("referrals.referrals.view.orderStatus")}
                      </span>
                      <Badge variant="outline">
                        {referral.first_order.status}
                      </Badge>
                    </div>
                  )}
                  {referral.first_order.paymentStatus && (
                    <div className="flex justify-between items-center p-2 bg-muted/30 rounded">
                      <span className="text-xs text-muted-foreground">
                        {t("referrals.referrals.view.paymentStatus")}
                      </span>
                      <Badge>{referral.first_order.paymentStatus}</Badge>
                    </div>
                  )}
                  <div className="flex justify-between items-center p-2 bg-muted/30 rounded">
                    <span className="text-xs text-muted-foreground">
                      {t("referrals.referrals.view.grandTotal")}
                    </span>
                    <span className="font-bold text-green-600">
                      {formatCurrency(referral.first_order.grandTotal)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-muted/30 rounded">
                    <span className="text-xs text-muted-foreground">
                      {t("referrals.referrals.view.orderDate")}
                    </span>
                    <span className="text-sm">
                      {formatDate(referral.first_order.created_at)}
                    </span>
                  </div>
                </div>
              </Card>
            )}

            {/* Coin Transaction Information */}
            {referral.coin_transaction && (
              <Card className="p-4">
                <h4 className="font-semibold text-sm text-primary mb-3 flex items-center gap-2">
                  <CreditCard className="w-4 h-4" />
                  {t("referrals.referrals.view.transactionInfo")}
                </h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-2 bg-muted/30 rounded">
                    <span className="text-xs text-muted-foreground">
                      {t("referrals.referrals.view.transactionId")}
                    </span>
                    <span className="font-mono text-sm font-semibold">
                      #{referral.coin_transaction.id}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-muted/30 rounded">
                    <span className="text-xs text-muted-foreground">
                      {t("referrals.referrals.view.amount")}
                    </span>
                    <span className="font-bold text-amber-600">
                      {referral.coin_transaction.amount} coins
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-muted/30 rounded">
                    <span className="text-xs text-muted-foreground">
                      {t("referrals.referrals.view.balanceAfter")}
                    </span>
                    <span className="font-bold text-green-600">
                      {referral.coin_transaction.balanceAfter} coins
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-muted/30 rounded">
                    <span className="text-xs text-muted-foreground">
                      {t("referrals.referrals.view.transactionDate")}
                    </span>
                    <span className="text-sm">
                      {formatDate(referral.coin_transaction.created_at)}
                    </span>
                  </div>
                </div>
              </Card>
            )}
          </div>

          {/* Additional Information */}
          <Card className="p-4">
            <h4 className="font-semibold text-sm text-primary mb-3 flex items-center gap-2">
              <FileText className="w-4 h-4" />
              {t("referrals.referrals.view.timeline")}
            </h4>
            <div className="space-y-3">
              {referral.notes && (
                <div className="p-3 bg-muted/30 rounded-lg">
                  <p className="text-xs text-muted-foreground mb-2">
                    {t("referrals.referrals.view.notes")}
                  </p>
                  <p className="text-sm whitespace-pre-wrap">
                    {referral.notes}
                  </p>
                </div>
              )}
              <TimeStaps item={referral} />
            </div>
          </Card>
        </div>
      ) : null}
    </BaseModal>
  );
}
