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
import { Badge } from "@/components/ui/badge";
import {
  Eye,
  DollarSign,
  CreditCard,
  CheckCircle2,
  XCircle,
  Clock,
} from "lucide-react";
import { BaseTableList } from "@/components/table";
import permissions from "@/lib/permissions";
import usePermissions from "@/hooks/use-permissions";
import { withPermission } from "@/hoc/withPermission";
import { formatNumberWithCommas } from "@/lib/utils";
import getSerialNumber from "@/lib/getSerialNumber";
import RefundModal from "../modal/RefundModal";
import ViewModal from "../modal/ViewModal";

const TransactionsTab = () => {
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
          <span className=" text-primary">
            {transaction?.currency}{" "}
            {formatNumberWithCommas(transaction?.amount)}
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

  const filterItemes = [
    {
      label: t("orders.filter.orderStatus"),
      value: "status",
      options: [
        { label: t("orders.filter.allStatuses"), value: "all" },
        { label: t("orders.status.pending"), value: "pending" },
        { label: t("orders.status.approved"), value: "approved" },
        { label: t("orders.status.shipped"), value: "shipped" },
        { label: t("orders.status.delivered"), value: "delivered" },
        { label: t("orders.status.cancelled"), value: "cancelled" },
        {
          label: t("orders.status.cancelled_at_delivery"),
          value: "cancelled_at_delivery",
        },
        { label: t("orders.status.returned"), value: "returned" },
      ],
      placeholder: t("orders.filter.selectOrderStatus"),
    },
    {
      label: t("orders.filter.paymentStatus"),
      value: "payment_status",
      options: [
        { label: t("orders.filter.allPaymentStatuses"), value: "all" },
        { label: t("orders.paymentStatus.pending"), value: "pending" },
        { label: t("orders.paymentStatus.paid"), value: "paid" },
        { label: t("orders.paymentStatus.failed"), value: "failed" },
        { label: t("orders.paymentStatus.cancelled"), value: "cancelled" },
        { label: t("orders.paymentStatus.refunded"), value: "refunded" },
      ],
      placeholder: t("orders.filter.selectPaymentStatus"),
    },
    {
      label: t("orders.filter.paymentMode"),
      value: "payment_mode",
      options: [
        { label: t("orders.filter.allPaymentMethods"), value: "all" },
        { label: t("orders.paymentMethod.cod"), value: "cod" },
        { label: t("orders.paymentMethod.online"), value: "online" },
      ],
      placeholder: t("orders.filter.selectPaymentMethod"),
    },
  ];

  return (
    <div className="animate-fade-in">
      <BaseTableList<Transaction>
        title=""
        description=""
        searchPlaceholder={t("transactions.searchPlaceholder")}
        enableSearch={true}
        columns={columns}
        service={transactionService}
        store={store}
        emptyMessage={t("transactions.emptyState")}
        getRowKey={(transaction) => transaction.id}
        onRefresh={handleSetRefresh}
        showDateFilter={true}
        showExportButton={true}
        filters={filterItemes}
      />

      {/* Modals */}
      <ViewModal
        open={showDetails}
        onClose={() => setShowDetails(false)}
        transactionId={selectedTransaction?.paymentGateway === 'cod' ? `cod_${selectedTransaction?.id}` : selectedTransaction?.id}
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

export default withPermission(TransactionsTab, permissions.transactions.view);
