import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DollarSign,
  TrendingUp,
  Calendar,
  CreditCard,
  AlertCircle,
  RefreshCw,
  CheckCircle,
  XCircle,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
} from "lucide-react";
import transactionService from "@/services/transactionService";
import { formatCurrency, formatDate } from "@/lib/utils";
import { getStatusColor, getStatusIcon } from "@/components/custom/StatusUtils";
import { format } from "date-fns";

interface TransactionStatistics {
  period: string;
  date_range: {
    start: string;
    end: string;
  };
  totals: {
    transactions: number;
    amount: number;
    refunds: number;
    refundAmount: number;
    netRevenue: number;
  };
  by_status: Record<
    string,
    {
      count: string | number;
      amount: number;
    }
  >;
  by_gateway: Record<
    string,
    {
      count: string | number;
      amount: number;
      successRate: number;
    }
  >;
  daily_breakdown: Array<{
    date: string;
    transactions: string | number;
    amount: number;
  }>;
}

const StatisticsTab = ({ dateRange }) => {
  const { t } = useTranslation();
  const [statistics, setStatistics] = useState<TransactionStatistics | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchStatistics();
  }, [dateRange]);

  const fetchStatistics = async () => {
    setIsLoading(true);
    try {
      const queryParams = new URLSearchParams();
      if (dateRange?.from) {
        queryParams.append("start_date", format(dateRange.from, "yyyy-MM-dd"));
      }
      if (dateRange?.to) {
        queryParams.append("end_date", format(dateRange.to, "yyyy-MM-dd"));
      }
      const response = await transactionService.statistics(
        queryParams.toString(),
      );
      console.log("Statistics response:", response);
      setStatistics(response.statistics as TransactionStatistics);
    } catch (error) {
      console.error("Error fetching statistics:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="p-6 space-y-3">
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-64 w-full" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (!statistics) {
    return (
      <div className="p-6 text-center">
        <AlertCircle className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
        <p className="text-muted-foreground">
          {t("transactions.statistics.noDataAvailable")}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Period Info */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            {t("transactions.statistics.overview")} -{" "}
            <span className="text-primary capitalize">{statistics.period}</span>
          </h3>
          <p className="text-sm text-muted-foreground mt-1">
            {formatDate(statistics.date_range.start)} -{" "}
            {formatDate(statistics.date_range.end)}
          </p>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
        {/* Total Transactions */}
        <Card className="p-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">
                {t("transactions.statistics.totalTransactions")}
              </p>
              <p className="text-2xl  text-primary">
                {statistics.totals.transactions}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {t("transactions.statistics.allTransactions")}
              </p>
            </div>
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Activity className="w-6 h-6 text-primary" />
            </div>
          </div>
        </Card>

        {/* Total Amount */}
        <Card className="p-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">
                {t("transactions.statistics.totalAmount")}
              </p>
              <p className="text-2xl  text-green-600">
                {formatCurrency(statistics.totals.amount)}
              </p>
              <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                <ArrowUpRight className="w-3 h-3" />
                {t("transactions.statistics.revenue")}
              </p>
            </div>
            <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </Card>

        {/* Total Refunds */}
        <Card className="p-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">
                {t("transactions.statistics.totalRefunds")}
              </p>
              <p className="text-2xl  text-red-600">
                {statistics.totals.refunds}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {formatCurrency(statistics.totals.refundAmount)}
              </p>
            </div>
            <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center">
              <RefreshCw className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </Card>

        {/* Net Revenue */}
        <Card className="p-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">
                {t("transactions.statistics.netRevenue")}
              </p>
              <p className="text-2xl  text-blue-600">
                {formatCurrency(statistics.totals.netRevenue)}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {t("transactions.statistics.afterRefunds")}
              </p>
            </div>
            <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </Card>

        {/* Average Transaction */}
        <Card className="p-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">
                {t("transactions.statistics.avgTransaction")}
              </p>
              <p className="text-2xl  text-purple-600">
                {statistics.totals.transactions > 0
                  ? formatCurrency(
                      statistics.totals.amount / statistics.totals.transactions,
                    )
                  : formatCurrency(0)}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {t("transactions.statistics.perTransaction")}
              </p>
            </div>
            <div className="w-12 h-12 rounded-full bg-purple-500/10 flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* Status Breakdown */}
      <Card className="p-3">
        <h4 className="font-semibold mb-4 flex items-center gap-2">
          <Activity className="w-5 h-5" />
          {t("transactions.statistics.statusBreakdown")}
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {Object.entries(statistics.by_status).map(([status, data]) => (
            <div
              key={status}
              className={`p-3 rounded-lg border ${getStatusColor(status)}`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  {getStatusIcon(status)}
                  <Badge variant="outline" className="capitalize">
                    {status}
                  </Badge>
                </div>
              </div>
              <div>
                <p className="text-2xl ">{formatCurrency(data.amount)}</p>
                <p className="text-sm mt-1">
                  {data.count} {t("transactions.statistics.transactions")}
                </p>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Payment Gateway Breakdown */}
      <Card className="p-3">
        <h4 className="font-semibold mb-4 flex items-center gap-2">
          <CreditCard className="w-5 h-5" />
          {t("transactions.statistics.paymentGatewayBreakdown")}
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {Object.entries(statistics.by_gateway).map(([gateway, data]) => (
            <div
              key={gateway}
              className="p-4 border rounded-lg hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between mb-3">
                <Badge variant="default" className="capitalize text-sm">
                  {gateway}
                </Badge>
                <Badge
                  variant="secondary"
                  className={
                    data.successRate >= 80
                      ? "bg-green-100 text-green-700 dark:bg-green-950"
                      : data.successRate >= 50
                        ? "bg-orange-100 text-orange-700 dark:bg-orange-950"
                        : "bg-red-100 text-red-700 dark:bg-red-950"
                  }
                >
                  {data.successRate}% {t("transactions.statistics.successRate")}
                </Badge>
              </div>
              <p className="text-2xl  text-primary mb-2">
                {formatCurrency(data.amount)}
              </p>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  {data.count} {t("transactions.statistics.transactions")}
                </span>
              </div>
              <Progress value={data.successRate} className="h-2 mt-3" />
            </div>
          ))}
        </div>
      </Card>

      {/* Daily Breakdown */}
      <Card className="p-3">
        <h4 className="font-semibold mb-4 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-primary" />
          {t("transactions.statistics.dailyBreakdown")}
        </h4>
        <div className="space-y-3">
          {statistics.daily_breakdown.map((day) => {
            const maxAmount = Math.max(
              ...statistics.daily_breakdown.map((d) => d.amount),
            );
            const widthPercentage =
              maxAmount > 0 ? (day.amount / maxAmount) * 100 : 0;

            return (
              <div key={day.date} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">{formatDate(day.date)}</span>
                  <div className="flex items-center gap-3">
                    <Badge variant="secondary">
                      {day.transactions}{" "}
                      {t("transactions.statistics.transactions")}
                    </Badge>
                    <span className=" text-primary">
                      {formatCurrency(day.amount)}
                    </span>
                  </div>
                </div>
                <div className="h-8 bg-muted rounded-lg overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-green-500 to-primary rounded-lg flex items-center justify-end pr-3 transition-all duration-500"
                    style={{ width: `${widthPercentage}%` }}
                  >
                    {widthPercentage > 20 && (
                      <span className="text-xs  text-white">
                        {formatCurrency(day.amount)}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {/* Refund Analysis */}
        <Card className="p-4">
          <h4 className="font-semibold mb-4 flex items-center gap-2">
            <ArrowDownRight className="w-5 h-5 text-red-600" />
            {t("transactions.statistics.refundAnalysis")}
          </h4>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-red-50 dark:bg-red-950 rounded-lg">
              <div>
                <p className="text-sm font-medium">
                  {t("transactions.statistics.refundRate")}
                </p>
                <p className="text-xs text-muted-foreground">
                  {t("transactions.statistics.totalRefundsVsTransactions")}
                </p>
              </div>
              <p className="text-2xl  text-red-600">
                {statistics.totals.transactions > 0
                  ? (
                      (statistics.totals.refunds /
                        statistics.totals.transactions) *
                      100
                    ).toFixed(1)
                  : 0}
                %
              </p>
            </div>
            <div className="flex items-center justify-between p-3 bg-orange-50 dark:bg-orange-950 rounded-lg">
              <div>
                <p className="text-sm font-medium">
                  {t("transactions.statistics.avgRefundAmount")}
                </p>
                <p className="text-xs text-muted-foreground">
                  {t("transactions.statistics.perRefund")}
                </p>
              </div>
              <p className="text-2xl  text-orange-600">
                {statistics.totals.refunds > 0
                  ? formatCurrency(
                      statistics.totals.refundAmount /
                        statistics.totals.refunds,
                    )
                  : formatCurrency(0)}
              </p>
            </div>
          </div>
        </Card>

        {/* Revenue Insights */}
        <Card className="p-4">
          <h4 className="font-semibold mb-4 flex items-center gap-2">
            <ArrowUpRight className="w-5 h-5 text-green-600" />
            {t("transactions.statistics.revenueInsights")}
          </h4>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-950 rounded-lg">
              <div>
                <p className="text-sm font-medium">
                  {t("transactions.statistics.revenueImpact")}
                </p>
                <p className="text-xs text-muted-foreground">
                  {t("transactions.statistics.refundsVsRevenue")}
                </p>
              </div>
              <p className="text-2xl  text-green-600">
                {statistics.totals.amount > 0
                  ? (
                      (statistics.totals.refundAmount /
                        statistics.totals.amount) *
                      100
                    ).toFixed(1)
                  : 0}
                %
              </p>
            </div>
            <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
              <div>
                <p className="text-sm font-medium">
                  {t("transactions.statistics.netRevenueRate")}
                </p>
                <p className="text-xs text-muted-foreground">
                  {t("transactions.statistics.afterAllDeductions")}
                </p>
              </div>
              <p className="text-2xl  text-blue-600">
                {statistics.totals.amount > 0
                  ? (
                      (statistics.totals.netRevenue /
                        statistics.totals.amount) *
                      100
                    ).toFixed(1)
                  : 0}
                %
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default StatisticsTab;
