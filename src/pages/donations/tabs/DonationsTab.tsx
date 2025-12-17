import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { BaseTableList } from "@/components/table/BaseTableList";
import { Column } from "@/components/table/BaseTable";
import { Badge } from "@/components/ui/badge";
import { Donation } from "@/lib/types";
import { useDonationStore } from "@/stores/donationStore";
import donationService from "@/services/donationService";
import { formatCurrency, formatDate } from "@/lib/utils";

interface DonationsTabProps {
  onViewDetails?: (donation: Donation) => void;
}

export default function DonationsTab({ onViewDetails }: DonationsTabProps) {
  const { t } = useTranslation();

  const store = useDonationStore();

  const getStatusBadge = useMemo(
    () => (status: string) => {
      const variants: Record<string, "default" | "secondary" | "destructive"> =
        {
          paid: "default",
          pending: "secondary",
          failed: "destructive",
        };
      return (
        <Badge variant={variants[status] || "secondary"}>
          {t(`donations.donations.status.${status}`)}
        </Badge>
      );
    },
    [t]
  );

  const getPaymentMethodBadge = useMemo(
    () => (method: string) => {
      const colors: Record<string, string> = {
        coins: "bg-yellow-100 text-yellow-800",
        online: "bg-blue-100 text-blue-800",
        cod: "bg-green-100 text-green-800",
      };
      return (
        <Badge variant="outline" className={colors[method] || ""}>
          {t(`donations.donations.paymentMethod.${method}`)}
        </Badge>
      );
    },
    [t]
  );

  const columns: Column<Donation>[] = useMemo(
    () => [
      {
        key: "sl",
        label: t("donations.donations.columns.sl"),
        render: (_, index) => index + 1,
        className: "text-center w-16",
      },
      {
        key: "donor",
        label: t("donations.donations.columns.donor"),
        render: (donation) => (
          <div>
            <p className="font-medium">
              {donation.donor.isAnonymous
                ? t("donations.donations.view.anonymous")
                : donation.donor.name}
            </p>
            {!donation.donor.isAnonymous && (
              <>
                <p className="text-xs text-muted-foreground">
                  {donation.donor.email}
                </p>
                <p className="text-xs text-muted-foreground">
                  {donation.donor.mobile}
                </p>
              </>
            )}
          </div>
        ),
      },
      {
        key: "channel",
        label: t("donations.donations.columns.channel"),
        render: (donation) => (
          <div>
            <p className="font-medium">{donation.channel.name}</p>
            {donation.channel.description && (
              <p className="text-xs text-muted-foreground line-clamp-1">
                {donation.channel.description}
              </p>
            )}
          </div>
        ),
      },
      {
        key: "amount",
        label: t("donations.donations.columns.amount"),
        render: (donation) => (
          <p className="font-bold">{formatCurrency(donation.amount)}</p>
        ),
      },
      {
        key: "donationType",
        label: t("donations.donations.columns.type"),
        render: (donation) => (
          <Badge variant="outline">
            {t(`donations.donations.type.${donation.donationType}`)}
          </Badge>
        ),
      },
      {
        key: "paymentMethod",
        label: t("donations.donations.columns.paymentMethod"),
        render: (donation) => getPaymentMethodBadge(donation.paymentMethod),
      },
      {
        key: "paymentStatus",
        label: t("donations.donations.columns.status"),
        render: (donation) => getStatusBadge(donation.paymentStatus),
      },
      {
        key: "transactionId",
        label: t("donations.donations.columns.transactionId"),
        render: (donation) => (
          <span className="font-mono text-xs">
            {donation.transactionId || "-"}
          </span>
        ),
      },
      {
        key: "donatedAt",
        label: t("donations.donations.columns.date"),
        render: (donation) => formatDate(donation.donatedAt),
      },
    ],
    [t, getStatusBadge, getPaymentMethodBadge]
  );

  const getActions = (donation: Donation) => {
    const actions = [];

    if (onViewDetails) {
      actions.push({
        label: t("donations.actions.viewDetails"),
        onClick: () => onViewDetails(donation),
      });
    }

    return actions;
  };

  return (
    <BaseTableList<Donation>
      title=""
      description=""
      columns={columns}
      searchPlaceholder={t("donations.donations.subtitle")}
      enableSearch={true}
      service={donationService}
      store={store}
      getRowKey={(order) => order.id}
    />
  );
}
