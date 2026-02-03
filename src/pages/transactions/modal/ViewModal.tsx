import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Transaction } from "@/lib/types";
import transactionService from "@/services/transactionService";
import { BaseModal } from "@/components/modals";
import { Badge } from "@/components/ui/badge";
import {
  Loader2,
  CreditCard,
  User,
  DollarSign,
  Calendar,
  CheckCircle2,
  XCircle,
  Clock,
  Package,
} from "lucide-react";
import { formatDDMMYYY, formatNumberWithCommas } from "@/lib/utils";

interface ViewModalProps {
  open: boolean;
  onClose: (value: boolean) => void;
  transactionId: number | string | null;
}

export default function ViewModal({
  open,
  onClose,
  transactionId,
}: ViewModalProps) {
  const { t } = useTranslation();
  const [transaction, setTransaction] = useState<Transaction | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchTransactionDetails = async () => {
      if (!transactionId || !open) return;
      setIsLoading(true);
      try {
        const response = await transactionService.fetchDetails(transactionId);
        const responseData = response as unknown as Record<string, unknown>;
        console.log("Transaction Details Response:", responseData);
        const transactionData =
          (responseData?.transaction as Transaction) ||
          (response as unknown as Transaction);
        setTransaction(transactionData);
      } catch (error) {
        console.error("Error fetching transaction details:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTransactionDetails();
  }, [transactionId, open]);

  if (!transaction && !isLoading) return null;

  const getStatusBadge = (status: string) => {
    const variants = {
      success: {
        variant: "default" as const,
        icon: CheckCircle2,
        color: "text-green-600",
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

  return (
    <BaseModal
      open={open}
      onOpenChange={onClose}
      title={t("transactions.modal.viewDetails")}
      showSubmitButton={false}
      closeButtonText={t("transactions.modal.close")}
      size="2xl"
    >
      {isLoading ? (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : transaction ? (
        <div className="space-y-4">
          {/* Transaction Header */}
          <div className="bg-gradient-to-r from-primary/5 to-primary/10 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-xl ">{transaction.transactionId}</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {formatDDMMYYY(transaction.created_at)}
                </p>
              </div>
              {getStatusBadge(transaction.status)}
            </div>

            <div className="flex items-center justify-between bg-white/50 rounded-lg p-3 mt-3">
              <span className="text-sm text-muted-foreground">
                {t("transactions.view.amount")}
              </span>
              <span className="text-2xl  text-primary">
                {transaction.currency}{" "}
                {formatNumberWithCommas(transaction.amount)}
              </span>
            </div>
          </div>

          {/* Information Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Customer Information */}
            <div className="border rounded-lg p-4 space-y-3">
              <h4 className=" text-sm text-primary flex items-center gap-2">
                <User className="h-4 w-4" />
                {t("transactions.view.customerInfo")}
              </h4>
              <div className="space-y-2">
                <div className="flex justify-between items-start">
                  <span className="text-sm text-muted-foreground">
                    {t("transactions.view.name")}:
                  </span>
                  <span className="text-sm font-medium text-right">
                    {transaction.customer.name}
                  </span>
                </div>
                <div className="flex justify-between items-start">
                  <span className="text-sm text-muted-foreground">
                    {t("transactions.view.email")}:
                  </span>
                  <span className="text-sm font-medium text-right">
                    {transaction.customer.email}
                  </span>
                </div>
                <div className="flex justify-between items-start">
                  <span className="text-sm text-muted-foreground">
                    {t("transactions.view.mobile")}:
                  </span>
                  <span className="text-sm font-medium text-right">
                    {transaction.customer.mobile}
                  </span>
                </div>
              </div>
            </div>

            {/* Payment Information */}
            <div className="border rounded-lg p-4 space-y-3">
              <h4 className=" text-sm text-primary flex items-center gap-2">
                <CreditCard className="h-4 w-4" />
                {t("transactions.view.paymentInfo")}
              </h4>
              <div className="space-y-2">
                <div className="flex justify-between items-start">
                  <span className="text-sm text-muted-foreground">
                    {t("transactions.view.gateway")}:
                  </span>
                  <span className="text-sm font-medium text-right uppercase">
                    {transaction.paymentGateway}
                  </span>
                </div>
                {transaction.gatewayTransactionId && (
                  <div className="flex justify-between items-start">
                    <span className="text-sm text-muted-foreground">
                      {t("transactions.view.gatewayTxnId")}:
                    </span>
                    <span className="text-sm font-medium text-right font-mono text-xs">
                      {transaction.gatewayTransactionId}
                    </span>
                  </div>
                )}
                {transaction.bankTransactionId && (
                  <div className="flex justify-between items-start">
                    <span className="text-sm text-muted-foreground">
                      {t("transactions.view.bankTxnId")}:
                    </span>
                    <span className="text-sm font-medium text-right font-mono text-xs">
                      {transaction.bankTransactionId}
                    </span>
                  </div>
                )}
                {transaction.cardType && (
                  <div className="flex justify-between items-start">
                    <span className="text-sm text-muted-foreground">
                      {t("transactions.view.cardType")}:
                    </span>
                    <span className="text-sm font-medium text-right">
                      {transaction.cardType}
                    </span>
                  </div>
                )}
                {transaction.cardBrand && (
                  <div className="flex justify-between items-start">
                    <span className="text-sm text-muted-foreground">
                      {t("transactions.view.cardBrand")}:
                    </span>
                    <span className="text-sm font-medium text-right">
                      {transaction.cardBrand}
                    </span>
                  </div>
                )}
                {transaction.cardIssuer && (
                  <div className="flex justify-between items-start">
                    <span className="text-sm text-muted-foreground">
                      {t("transactions.view.cardIssuer")}:
                    </span>
                    <span className="text-sm font-medium text-right">
                      {transaction.cardIssuer}
                    </span>
                  </div>
                )}
                {transaction.cardIssuerCountry && (
                  <div className="flex justify-between items-start">
                    <span className="text-sm text-muted-foreground">
                      {t("transactions.view.cardIssuerCountry")}:
                    </span>
                    <span className="text-sm font-medium text-right">
                      {transaction.cardIssuerCountry}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Gateway Response Details */}
            {transaction.gatewayResponse && (
              <div className="border rounded-lg p-4 space-y-3 md:col-span-2">
                <h4 className=" text-sm text-primary flex items-center gap-2">
                  <CreditCard className="h-4 w-4" />
                  {t("transactions.view.gatewayResponseInfo")}
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {transaction.gatewayResponse.card_sub_brand && (
                    <div className="flex justify-between items-start">
                      <span className="text-sm text-muted-foreground">
                        {t("transactions.view.cardSubBrand")}:
                      </span>
                      <span className="text-sm font-medium text-right">
                        {transaction.gatewayResponse.card_sub_brand as string}
                      </span>
                    </div>
                  )}
                  {transaction.gatewayResponse.risk_level !== undefined && (
                    <div className="flex justify-between items-start">
                      <span className="text-sm text-muted-foreground">
                        {t("transactions.view.riskLevel")}:
                      </span>
                      <span className="text-sm font-medium text-right">
                        {transaction.gatewayResponse.risk_level as string}
                      </span>
                    </div>
                  )}
                  {transaction.gatewayResponse.risk_title && (
                    <div className="flex justify-between items-start">
                      <span className="text-sm text-muted-foreground">
                        {t("transactions.view.riskTitle")}:
                      </span>
                      <Badge
                        variant={
                          transaction.gatewayResponse.risk_title === "Safe"
                            ? "default"
                            : "destructive"
                        }
                        className="text-xs"
                      >
                        {transaction.gatewayResponse.risk_title as string}
                      </Badge>
                    </div>
                  )}
                  {transaction.gatewayResponse.store_amount && (
                    <div className="flex justify-between items-start">
                      <span className="text-sm text-muted-foreground">
                        {t("transactions.view.storeAmount")}:
                      </span>
                      <span className="text-sm font-medium text-right">
                        {transaction.currency}{" "}
                        {formatNumberWithCommas(
                          parseFloat(
                            transaction.gatewayResponse.store_amount as string,
                          ),
                        )}
                      </span>
                    </div>
                  )}
                  {transaction.gatewayResponse.status && (
                    <div className="flex justify-between items-start">
                      <span className="text-sm text-muted-foreground">
                        {t("transactions.view.gatewayStatus")}:
                      </span>
                      <Badge
                        variant={
                          transaction.gatewayResponse.status === "VALID"
                            ? "default"
                            : "secondary"
                        }
                        className="text-xs"
                      >
                        {transaction.gatewayResponse.status as string}
                      </Badge>
                    </div>
                  )}
                  {transaction.gatewayResponse.tran_date && (
                    <div className="flex justify-between items-start">
                      <span className="text-sm text-muted-foreground">
                        {t("transactions.view.transactionDate")}:
                      </span>
                      <span className="text-sm font-medium text-right">
                        {transaction.gatewayResponse.tran_date as string}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Order Information */}
            {transaction.order ? (
              <div className="border rounded-lg p-4 space-y-3">
                <h4 className=" text-sm text-primary flex items-center gap-2">
                  <Package className="h-4 w-4" />
                  {t("transactions.view.orderInfo")}
                </h4>
                <div className="space-y-2">
                  <div className="flex justify-between items-start">
                    <span className="text-sm text-muted-foreground">
                      {t("transactions.view.orderId")}:
                    </span>
                    <span className="text-sm font-medium text-right font-mono">
                      {transaction.order.orderId}
                    </span>
                  </div>
                  <div className="flex justify-between items-start">
                    <span className="text-sm text-muted-foreground">
                      {t("transactions.view.orderStatus")}:
                    </span>
                    <Badge variant="outline" className="text-xs">
                      {transaction.order.status}
                    </Badge>
                  </div>
                </div>
              </div>
            ) : (
              <div className="border rounded-lg p-4 space-y-3">
                <h4 className=" text-sm text-primary flex items-center gap-2">
                  <Package className="h-4 w-4" />
                  {t("transactions.view.orderInfo")}
                </h4>
                <div className="flex items-center justify-center py-4">
                  <p className="text-sm text-muted-foreground">
                    {t("transactions.view.noOrder")}
                  </p>
                </div>
              </div>
            )}

            {/* Transaction Details */}
            <div className="border rounded-lg p-4 space-y-3">
              <h4 className=" text-sm text-primary flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                {t("transactions.view.transactionDetails")}
              </h4>
              <div className="space-y-2">
                <div className="flex justify-between items-start">
                  <span className="text-sm text-muted-foreground">
                    {t("transactions.view.transactionId")}:
                  </span>
                  <span className="text-sm font-medium text-right font-mono text-xs">
                    {transaction.transactionId}
                  </span>
                </div>
                <div className="flex justify-between items-start">
                  <span className="text-sm text-muted-foreground">
                    {t("transactions.view.currency")}:
                  </span>
                  <span className="text-sm font-medium text-right">
                    {transaction.currency}
                  </span>
                </div>
                <div className="flex justify-between items-start">
                  <span className="text-sm text-muted-foreground">
                    {t("transactions.view.createdAt")}:
                  </span>
                  <span className="text-sm font-medium text-right">
                    {transaction.created_at}
                  </span>
                </div>
                <div className="flex justify-between items-start">
                  <span className="text-sm text-muted-foreground">
                    {t("transactions.view.updatedAt")}:
                  </span>
                  <span className="text-sm font-medium text-right">
                    {transaction.updated_at}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Refund Information - Only show if transaction is refunded */}
          {transaction.status === "refunded" && (
            <div className="border border-blue-200 bg-blue-50 rounded-lg p-4 space-y-3">
              <h4 className=" text-sm text-blue-700 flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                {t("transactions.view.refundInfo")}
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {transaction.refundAmount && (
                  <div className="flex justify-between items-start">
                    <span className="text-sm text-muted-foreground">
                      {t("transactions.view.refundAmount")}:
                    </span>
                    <span className="text-sm font-medium text-right">
                      {transaction.currency}{" "}
                      {formatNumberWithCommas(transaction.refundAmount)}
                    </span>
                  </div>
                )}
                {transaction.refundedAt && (
                  <div className="flex justify-between items-start">
                    <span className="text-sm text-muted-foreground">
                      {t("transactions.view.refundedAt")}:
                    </span>
                    <span className="text-sm font-medium text-right">
                      {transaction.refundedAt}
                    </span>
                  </div>
                )}
                {transaction.refundReason && (
                  <div className="col-span-full">
                    <span className="text-sm text-muted-foreground block mb-1">
                      {t("transactions.view.refundReason")}:
                    </span>
                    <p className="text-sm font-medium bg-white p-2 rounded">
                      {transaction.refundReason}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Failure Information - Only show if transaction failed */}
          {transaction.status === "failed" && transaction.failureReason && (
            <div className="border border-red-200 bg-red-50 rounded-lg p-4 space-y-3">
              <h4 className=" text-sm text-red-700 flex items-center gap-2">
                <XCircle className="h-4 w-4" />
                {t("transactions.view.failureInfo")}
              </h4>
              <div>
                <span className="text-sm text-muted-foreground block mb-1">
                  {t("transactions.view.failureReason")}:
                </span>
                <p className="text-sm font-medium bg-white p-2 rounded">
                  {transaction.failureReason}
                </p>
              </div>
            </div>
          )}
        </div>
      ) : null}
    </BaseModal>
  );
}
