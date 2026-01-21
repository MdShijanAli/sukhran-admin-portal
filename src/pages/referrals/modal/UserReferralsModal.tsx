import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { BaseModal } from "@/components/modals";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import referralService from "@/services/referralService";
import { UserReferrals } from "@/lib/types";
import {
  User,
  Mail,
  FileText,
  Users,
  Clock,
  Lock,
  CheckCircle,
  Coins,
  Award,
  Calendar,
} from "lucide-react";
import { formatDate } from "@/lib/utils";

interface UserReferralsModalProps {
  open: boolean;
  onClose: (value: boolean) => void;
  userId: number | null;
}

export default function UserReferralsModal({
  open,
  onClose,
  userId,
}: UserReferralsModalProps) {
  const { t } = useTranslation();
  const [userReferrals, setUserReferrals] = useState<UserReferrals | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchUserReferrals = async () => {
      if (!userId || !open) return;
      setIsLoading(true);
      try {
        const response = await referralService.getUserReferrals(userId);
        setUserReferrals(response as unknown as UserReferrals);
      } catch (error) {
        console.error("Error fetching user referrals:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchUserReferrals();
  }, [userId, open]);

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
      <Badge variant={variants[status] || "secondary"} className="text-xs">
        {status}
      </Badge>
    );
  };

  if (!userReferrals && !isLoading) return null;

  return (
    <BaseModal
      open={open}
      onOpenChange={onClose}
      title={t("referrals.userReferrals.title")}
      showSubmitButton={false}
      closeButtonText={t("close")}
      size="3xl"
    >
      {isLoading ? (
        <div className="space-y-4">
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      ) : userReferrals ? (
        <div className="space-y-4">
          {/* User Info */}
          <Card className="p-4 bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                <User className="w-8 h-8 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl  mb-1">{userReferrals.user.name}</h3>
                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                  <div className="flex items-center gap-1">
                    <Mail className="w-3 h-3" />
                    <span>{userReferrals.user.email}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-primary" />
                  <span className="font-mono font-semibold text-primary">
                    {t("referrals.userReferrals.referralCode")}:{" "}
                    {userReferrals.statistics.referral_code}
                  </span>
                </div>
              </div>
            </div>
          </Card>

          {/* Statistics */}
          <Card className="p-4">
            <h4 className="font-semibold text-sm text-primary mb-3 flex items-center gap-2">
              <Award className="w-4 h-4" />
              {t("referrals.userReferrals.statistics.totalReferred")}
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
              {/* Total Referred */}
              <div className="p-3 bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg border">
                <div className="flex items-center gap-2 mb-1">
                  <Users className="w-4 h-4 text-primary" />
                  <p className="text-xs text-muted-foreground">Total</p>
                </div>
                <p className="text-2xl ">
                  {userReferrals.statistics.total_referred}
                </p>
              </div>

              {/* Pending Rewards */}
              <div className="p-3 bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-900/10 rounded-lg border border-yellow-200 dark:border-yellow-800">
                <div className="flex items-center gap-2 mb-1">
                  <Clock className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
                  <p className="text-xs text-muted-foreground">
                    {t("referrals.userReferrals.statistics.pendingRewards")}
                  </p>
                </div>
                <p className="text-xl  text-yellow-700 dark:text-yellow-400">
                  {userReferrals.statistics.pending_rewards.count}
                </p>
                <p className="text-xs text-muted-foreground">
                  {userReferrals.statistics.pending_rewards.total_coins} coins
                </p>
              </div>

              {/* Locked Rewards */}
              <div className="p-3 bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-900/10 rounded-lg border border-orange-200 dark:border-orange-800">
                <div className="flex items-center gap-2 mb-1">
                  <Lock className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                  <p className="text-xs text-muted-foreground">
                    {t("referrals.userReferrals.statistics.lockedRewards")}
                  </p>
                </div>
                <p className="text-xl  text-orange-700 dark:text-orange-400">
                  {userReferrals.statistics.locked_rewards.count}
                </p>
                <p className="text-xs text-muted-foreground">
                  {userReferrals.statistics.locked_rewards.total_coins} coins
                </p>
              </div>

              {/* Credited Rewards */}
              <div className="p-3 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-900/10 rounded-lg border border-green-200 dark:border-green-800">
                <div className="flex items-center gap-2 mb-1">
                  <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
                  <p className="text-xs text-muted-foreground">
                    {t("referrals.userReferrals.statistics.creditedRewards")}
                  </p>
                </div>
                <p className="text-xl  text-green-700 dark:text-green-400">
                  {userReferrals.statistics.credited_rewards.count}
                </p>
                <p className="text-xs text-muted-foreground">
                  {userReferrals.statistics.credited_rewards.total_coins} coins
                </p>
              </div>

              {/* Total Coins Earned */}
              <div className="p-3 bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900/20 dark:to-amber-900/10 rounded-lg border border-amber-200 dark:border-amber-800">
                <div className="flex items-center gap-2 mb-1">
                  <Coins className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                  <p className="text-xs text-muted-foreground">
                    {t("referrals.userReferrals.statistics.totalCoinsEarned")}
                  </p>
                </div>
                <p className="text-2xl  text-amber-700 dark:text-amber-400">
                  {userReferrals.statistics.total_coins_earned}
                </p>
                <p className="text-xs text-muted-foreground">coins</p>
              </div>
            </div>
          </Card>

          {/* Referrals List */}
          <Card className="p-4">
            <h4 className="font-semibold text-sm text-primary mb-3 flex items-center gap-2">
              <Users className="w-4 h-4" />
              {t("referrals.userReferrals.referralsList")}
            </h4>
            {userReferrals.referrals.length > 0 ? (
              <div className="space-y-2">
                {userReferrals.referrals.map((referral) => (
                  <div
                    key={referral.id}
                    className="p-3 border rounded-lg hover:bg-muted/30 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3 flex-1">
                        <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0">
                          <User className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-sm">
                            {referral.referred_user.name}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <Calendar className="w-3 h-3 text-muted-foreground" />
                            <span className="text-xs text-muted-foreground">
                              Registered:{" "}
                              {formatDate(
                                referral.referred_user.registered_at ||
                                  referral.created_at,
                              )}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            {getStatusBadge(referral.status)}
                            <span className="text-xs text-muted-foreground">
                              {referral.status_display}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <div className="flex items-center gap-1 justify-end">
                          <Coins className="w-4 h-4 text-amber-600" />
                          <span className=" text-amber-600">
                            {referral.coins_amount}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          {formatDate(referral.created_at)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Users className="w-12 h-12 mx-auto text-muted-foreground mb-2" />
                <p className="text-muted-foreground text-sm">
                  {t("referrals.userReferrals.noReferrals")}
                </p>
              </div>
            )}
          </Card>
        </div>
      ) : null}
    </BaseModal>
  );
}
