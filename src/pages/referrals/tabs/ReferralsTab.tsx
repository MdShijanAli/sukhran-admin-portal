import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { BaseTableList } from "@/components/table/BaseTableList";
import { Column } from "@/components/table/BaseTable";
import { Badge } from "@/components/ui/badge";
import { Referral } from "@/lib/types";
import { useReferralStore } from "@/stores/referralStore";
import referralService from "@/services/referralService";
import { formatCurrency, formatDate } from "@/lib/utils";
import { ActionItem, DropdownMenuActions } from "@/components/table";
import { Eye, Users } from "lucide-react";
import getSerialNumber from "@/lib/getSerialNumber";

interface ReferralsTabProps {
  onViewDetails?: (referral: Referral) => void;
  onViewUserReferrals?: (userId: number) => void;
  onSetRefresh?: (refreshFn: () => void) => void;
}

export default function ReferralsTab({
  onViewDetails,
  onViewUserReferrals,
  onSetRefresh,
}: ReferralsTabProps) {
  const { t } = useTranslation();
  const store = useReferralStore();

  const getStatusBadge = useMemo(
    () => (status: string) => {
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
    },
    [t]
  );

  const handleViewDetails = (referral: Referral) => {
    onViewDetails?.(referral);
  };

  const handleViewUserReferrals = (userId: number) => {
    onViewUserReferrals?.(userId);
  };

  // Define actions for dropdown menu
  const referralActions = useMemo<ActionItem<Referral>[]>(
    () => [
      {
        label: t("referrals.actions.viewDetails"),
        icon: Eye,
        onClick: handleViewDetails,
      },
      {
        label: t("referrals.actions.viewUserReferrals"),
        icon: Users,
        onClick: (referral) => handleViewUserReferrals(referral.referrer.id),
      },
    ],
    [t]
  );

  const columns = useMemo<Column<Referral>[]>(
    () => [
      {
        key: "sl",
        label: t("referrals.referrals.columns.sl"),
        render: (_, index) => getSerialNumber(store, index),
        className: "text-center w-16",
      },
      {
        key: "referrer",
        label: t("referrals.referrals.columns.referrer"),
        render: (referral) => (
          <div>
            <p className="font-medium">{referral.referrer.name}</p>
            <p className="text-xs text-muted-foreground">
              {referral.referrer.email}
            </p>
            <p className="text-xs text-muted-foreground">
              {referral.referrer.mobile}
            </p>
            {referral.referrer.referral_code && (
              <p className="text-xs font-mono text-primary">
                Code: {referral.referrer.referral_code}
              </p>
            )}
          </div>
        ),
      },
      {
        key: "referred_user",
        label: t("referrals.referrals.columns.referredUser"),
        render: (referral) => (
          <div>
            <p className="font-medium">{referral.referred_user.name}</p>
            <p className="text-xs text-muted-foreground">
              {referral.referred_user.email}
            </p>
            <p className="text-xs text-muted-foreground">
              {referral.referred_user.mobile}
            </p>
            {referral.referred_user.registered_at && (
              <p className="text-xs text-muted-foreground">
                Registered: {formatDate(referral.referred_user.registered_at)}
              </p>
            )}
          </div>
        ),
      },
      {
        key: "status",
        label: t("referrals.referrals.columns.status"),
        render: (referral) => (
          <div className="space-y-1">
            {getStatusBadge(referral.status)}
            <p className="text-xs text-muted-foreground">
              {referral.status_display}
            </p>
          </div>
        ),
        className: "text-center",
      },
      {
        key: "coins_amount",
        label: t("referrals.referrals.columns.coins"),
        render: (referral) => (
          <div className="text-center">
            <p className="font-bold text-amber-600">{referral.coins_amount}</p>
          </div>
        ),
        className: "text-center",
      },
      {
        key: "first_order",
        label: t("referrals.referrals.columns.firstOrder"),
        render: (referral) =>
          referral.first_order ? (
            <div>
              <p className="font-mono text-xs font-medium">
                {referral.first_order.orderId}
              </p>
              <p className="text-xs text-muted-foreground">
                {formatCurrency(referral.first_order.grandTotal)}
              </p>
              <p className="text-xs text-muted-foreground">
                {formatDate(referral.first_order.created_at)}
              </p>
            </div>
          ) : (
            <span className="text-muted-foreground text-xs">
              {t("referrals.referrals.noOrderYet")}
            </span>
          ),
      },
      {
        key: "credited_at",
        label: t("referrals.referrals.columns.creditedAt"),
        render: (referral) =>
          referral.credited_at ? (
            <div className="w-[100px]">{formatDate(referral.credited_at)}</div>
          ) : (
            <span className="text-muted-foreground text-xs">-</span>
          ),
      },
      {
        key: "created_at",
        label: t("referrals.referrals.columns.createdAt"),
        render: (referral) => (
          <div className="w-[100px]">{formatDate(referral.created_at)}</div>
        ),
      },
      {
        key: "actions",
        label: t("referrals.referrals.columns.actions"),
        className: "text-right",
        render: (referral) => (
          <DropdownMenuActions item={referral} actions={referralActions} />
        ),
      },
    ],
    [t, referralActions]
  );

  return (
    <BaseTableList<Referral>
      title=""
      description=""
      columns={columns}
      searchPlaceholder={t("referrals.referrals.subtitle")}
      enableSearch={true}
      service={referralService}
      store={store}
      getRowKey={(referral) => referral.id}
      onRefresh={onSetRefresh}
    />
  );
}
