import { useState, useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Transaction } from "@/lib/types";
import { useTransactionStore } from "@/stores/transactionStore";
import transactionService from "@/services/transactionService";
import { Column } from "@/components/table/BaseTable";
import {
  ActionItem,
  DropdownMenuActions,
} from "@/components/table/DropdownMenuActions";
import ViewModal from "./modal/ViewModal";
import RefundModal from "./modal/RefundModal";
import { Badge } from "@/components/ui/badge";
import {
  Eye,
  DollarSign,
  TrendingUp,
  CreditCard,
  CheckCircle2,
  XCircle,
  Clock,
  TrendingUpDown,
  Download,
} from "lucide-react";
import { BaseTableList } from "@/components/table";
import permissions from "@/lib/permissions";
import usePermissions from "@/hooks/use-permissions";
import { withPermission } from "@/hoc/withPermission";
import { formatNumberWithCommas } from "@/lib/utils";
import getSerialNumber from "@/lib/getSerialNumber";
import { toast } from "sonner";

const Transactions = () => {
  const { t } = useTranslation();
  const store = useTransactionStore();
  const { hasPermission } = usePermissions();

  const [selectedTransaction, setSelectedTransaction] =
    useState<Transaction | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [showRefund, setShowRefund] = useState(false);
  const [refreshTable, setRefreshTable] = useState<(() => void) | null>(null);

  const handleSetRefresh = useCallback((refreshFn: () => void) => {
    setRefreshTable(() => refreshFn);
  }, []);

  const handleViewDetails = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setShowDetails(true);
  };

  const handleRefund = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setShowRefund(true);
  };

  const handleExport = () => {
    toast.info("This feature is coming soon!");
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      success: {
        variant: "default" as const,
        icon: CheckCircle2,
        color: "text-green-600",
      },
      cancelled: {
        variant: "destructive" as const,
        icon: XCircle,
        color: "text-red-600",
      },
      pending: {
        variant: "secondary" as const,
        icon: Clock,
        color: "text-yellow-600",
      },
      failed: {
        variant: "destructive" as const,
        icon: XCircle,
        color: "text-red-600",
      },
      refunded: {
        variant: "outline" as const,
        icon: DollarSign,
        color: "text-blue-600",
      },
    };

    const config =
      variants[status as keyof typeof variants] || variants.pending;
    const Icon = config.icon;

    return (
      <Badge variant={config.variant} className="gap-1">
        <Icon className="h-3 w-3" />
        {t(`transactions.status.${status}`)}
      </Badge>
    );
  };

  // Define actions for dropdown menu
  const transactionActions = useMemo(
    (): ActionItem<Transaction>[] => [
      {
        label: t("view"),
        icon: Eye,
        onClick: handleViewDetails,
      },
      {
        label: t("refund"),
        icon: DollarSign,
        onClick: handleRefund,
        show: (transaction) =>
          hasPermission(permissions.transactions.refund) &&
          transaction.status === "success",
      },
    ],
    [t, handleViewDetails, handleRefund]
  );

  // Define table columns
  const columns: Column<Transaction>[] = [
    {
      key: "sl",
      label: t("transactions.columns.sl"),
      render: (_, index) => getSerialNumber(store, index),
      className: "text-center w-[60px]",
    },
    {
      key: "transactionId",
      label: t("transactions.columns.transactionId"),
      render: (transaction) => (
        <div className="w-[150px]">
          <span className="font-mono text-sm font-medium">
            {transaction.transactionId}
          </span>
        </div>
      ),
    },
    {
      key: "customer",
      label: t("transactions.columns.customer"),
      render: (transaction) => (
        <div>
          <p className="font-medium">{transaction?.customer?.name}</p>
          <p className="text-xs text-muted-foreground">
            {transaction?.customer?.email}
          </p>
          <p className="text-xs text-muted-foreground">
            {transaction?.customer?.mobile}
          </p>
        </div>
      ),
    },
    {
      key: "order",
      label: t("transactions.columns.order"),
      render: (transaction) => (
        <div className="w-[150px]">
          {transaction.order ? (
            <span className="font-mono text-sm">
              {transaction.order.orderId}
            </span>
          ) : (
            <span className="text-muted-foreground text-xs">
              {t("transactions.noOrder")}
            </span>
          )}
        </div>
      ),
    },
    {
      key: "amount",
      label: t("transactions.columns.amount"),
      render: (transaction) => (
        <div className="flex items-center gap-1 w-[100px]">
          <span className="font-semibold text-primary">
            {transaction.currency} {formatNumberWithCommas(transaction.amount)}
          </span>
        </div>
      ),
    },
    {
      key: "paymentGateway",
      label: t("transactions.columns.gateway"),
      render: (transaction) => (
        <div className="flex items-center gap-2 w-[130px]">
          <CreditCard className="h-4 w-4 text-muted-foreground" />
          <span className="uppercase text-sm">
            {transaction.paymentGateway}
          </span>
        </div>
      ),
    },
    {
      key: "status",
      label: t("transactions.columns.status"),
      render: (transaction) => getStatusBadge(transaction.status),
      className: "text-center",
    },
    {
      key: "created_at",
      label: t("transactions.columns.date"),
      render: (transaction) => (
        <div className="w-[100px]">
          <span className="text-sm">{transaction.created_at}</span>
        </div>
      ),
    },
    {
      key: "actions",
      label: t("actions"),
      className: "text-right",
      render: (transaction) => (
        <DropdownMenuActions
          item={transaction}
          actions={transactionActions}
          menuLabel={t("actions")}
        />
      ),
    },
  ];

  const summaryLists = [
    {
      title: t("transactions.summary.totalTransactions"),
      value: store.stats.total_transactions,
      icon: CreditCard,
      color: "text-muted-foreground",
    },
    {
      title: t("transactions.summary.totalAmount"),
      value: `৳${parseFloat(store.stats.total_amount).toLocaleString()}`,
      icon: DollarSign,
      color: "text-primary",
    },
    {
      title: t("transactions.summary.successful"),
      value: store.stats.successful,
      icon: CheckCircle2,
      color: "text-green-600",
    },
    {
      title: t("transactions.summary.pending"),
      value:
        store.stats.total_transactions -
        store.stats.successful -
        store.stats.failed -
        store.stats.refunded,
      icon: Clock,
      color: "text-yellow-600",
    },
    {
      title: t("transactions.summary.failed"),
      value: store.stats.failed,
      icon: XCircle,
      color: "text-red-600",
    },
    {
      title: t("transactions.summary.thisMonth"),
      value: `৳${parseFloat(store.stats.this_month.amount).toLocaleString()}`,
      icon: TrendingUp,
      color: "text-blue-600",
    },
  ];

  return (
    <div className="animate-fade-in">
      <BaseTableList<Transaction>
        title={t("transactions.title")}
        description={t("transactions.subtitle")}
        headerActions={
          hasPermission(permissions.transactions.export) && [
            {
              label: t("export"),
              icon: Download,
              onClick: handleExport,
              variant: "default",
            },
          ]
        }
        searchPlaceholder={t("transactions.searchPlaceholder")}
        enableSearch={true}
        columns={columns}
        service={transactionService}
        store={store}
        emptyMessage={t("transactions.emptyState")}
        getRowKey={(transaction) => transaction.id}
        onRefresh={handleSetRefresh}
        summaryLists={summaryLists}
      />

      {/* Modals */}
      <ViewModal
        open={showDetails}
        onClose={() => setShowDetails(false)}
        transactionId={selectedTransaction?.id || null}
      />

      <RefundModal
        open={showRefund}
        onClose={() => setShowRefund(false)}
        transactionId={selectedTransaction?.id || null}
        transactionAmount={selectedTransaction?.amount || 0}
        paymentMethod={selectedTransaction?.paymentGateway || "cod"}
      />
    </div>
  );
};

export default withPermission(Transactions, permissions.transactions.view);
