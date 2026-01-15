import { BaseTable, Column } from "@/components/table";
import { RecentTransactionsData } from "./Dashboard";
import { useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { StatusVariant } from "@/lib/utils";
import { useTranslation } from "react-i18next";

export default function RecentTransactions({
  data,
  isLoading = false,
}: {
  data: RecentTransactionsData[];
  isLoading?: boolean;
}) {
  const { t } = useTranslation();
  const columns = useMemo<Column<RecentTransactionsData>[]>(() => {
    return [
      {
        key: "transaction_id",
        label: t("dashboard.recentTransactions.transactionId"),
        render: (item) => item.transaction_id,
      },
      {
        key: "name",
        label: t("dashboard.recentTransactions.customerName"),
        render: (item) => item.customer.name,
      },
      {
        key: "amount",
        label: t("dashboard.recentTransactions.amount"),
        render: (item) => `৳${item.amount.toFixed(2)}`,
      },
      {
        key: "payment_method",
        label: t("dashboard.recentTransactions.paymentMethod"),
        render: (item) => (
          <Badge className={StatusVariant(item.payment_method)}>
            {item.payment_method.charAt(0).toUpperCase() +
              item.payment_method.slice(1)}
          </Badge>
        ),
      },
      {
        key: "status",
        label: t("dashboard.recentTransactions.status"),
        render: (item) => (
          <Badge className={StatusVariant(item.status)}>
            {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
          </Badge>
        ),
      },
      {
        key: "type",
        label: t("dashboard.recentTransactions.type"),
        render: (item) => (
          <Badge variant={`${item.type === "Regular" ? "primary" : "outline"}`}>
            {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
          </Badge>
        ),
      },
      {
        key: "created_at",
        label: t("dashboard.recentTransactions.date"),
        className: "w-[120px]",
      },
    ];
  }, [t]);
  return (
    <div className="h-[400px] overflow-y-auto">
      <BaseTable
        columns={columns}
        data={data?.slice(0, 10) || []}
        isLoading={isLoading}
        getRowKey={(item) => item.transaction_id}
        rowClassName={() =>
          "hover:bg-primary/5 transition-colors w-[1500px] overflow-x-auto"
        }
      />
    </div>
  );
}
