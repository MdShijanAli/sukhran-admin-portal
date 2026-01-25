import { useTranslation } from "react-i18next";
import { Column } from "@/components/table/BaseTable";
import { Badge } from "@/components/ui/badge";
import { CoinTransaction } from "@/lib/types";
import { formatNumberWithCommas } from "@/lib/utils";
import getSerialNumber from "@/lib/getSerialNumber";
import { useCoinStore } from "@/stores/coinStore";
import { BaseTableList } from "@/components/table";
import coinService from "@/services/coinService";

export default function AllTransactions() {
  const { t } = useTranslation();
  const store = useCoinStore();

  const columns: Column<CoinTransaction>[] = [
    {
      key: "sl",
      label: t("coinManagement.transactions.columns.sl"),
      render: (_, index) => getSerialNumber(store, index),
      className: "text-center w-16",
    },
    {
      key: "id",
      label: t("coinManagement.transactions.columns.id"),
      render: (transaction) => (
        <span className="font-mono">#{transaction.id}</span>
      ),
      className: "w-20",
    },
    {
      key: "user",
      label: t("coinManagement.transactions.columns.user"),
      render: (transaction) => (
        <div>
          <p className="font-medium">{transaction?.user?.name}</p>
          <p className="text-xs text-muted-foreground">
            {transaction?.user?.email}
          </p>
        </div>
      ),
    },
    {
      key: "type",
      label: t("coinManagement.transactions.columns.type"),
      render: (transaction) => (
        <Badge
          variant={transaction.type === "earned" ? "default" : "secondary"}
        >
          {t(`coinManagement.transactions.types.${transaction.type}`)}
        </Badge>
      ),
      className: "text-center",
    },
    {
      key: "amount",
      label: t("coinManagement.transactions.columns.amount"),
      render: (transaction) => (
        <span
          className={` ${transaction.type === "earned" ? "text-green-600" : "text-red-600"
            }`}
        >
          {transaction.type === "earned" ? "+" : "-"}
          {formatNumberWithCommas(transaction.amount)}
        </span>
      ),
      className: "text-right",
    },
    {
      key: "reason",
      label: t("coinManagement.transactions.columns.reason"),
      render: (transaction) => (
        <span className="text-sm">{transaction.reason || "N/A"}</span>
      ),
    },
    {
      key: "description",
      label: t("coinManagement.transactions.columns.description"),
      render: (transaction) => (
        <span className="text-sm text-muted-foreground line-clamp-2">
          {transaction.description}
        </span>
      ),
    },
    {
      key: "balance_after",
      label: t("coinManagement.transactions.columns.balanceAfter"),
      render: (transaction) => (
        <span className="font-medium">
          {formatNumberWithCommas(transaction.balance_after)}
        </span>
      ),
      className: "text-right",
    },
    {
      key: "created_at",
      label: t("coinManagement.transactions.columns.date"),
      render: (transaction) => (
        <span className="text-sm">
          {new Date(transaction.created_at).toLocaleString()}
        </span>
      ),
    },
  ];

  return (
    <div className="animate-fade-in">
      <BaseTableList<CoinTransaction>
        title={t("coinManagement.transactions.title")}
        description={t("coinManagement.transactions.description")}
        searchPlaceholder={t("coinManagement.transactions.searchPlaceholder")}
        enableSearch={true}
        columns={columns}
        service={coinService}
        store={store}
        emptyMessage={t("coinManagement.transactions.noTransactionsFound")}
        getRowKey={(transaction) => transaction.id}
      />
    </div>
  );
}
