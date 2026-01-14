import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ShoppingCart,
  DollarSign,
  Users,
  TrendingUp,
  TrendingDown,
  Package,
  AlertCircle,
  CreditCard,
  RefreshCw,
  Clock,
  CheckCircle,
  XCircle,
  Coins,
  Gift,
  UserPlus,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import dashboardService from "@/services/dashboardService";
import { toast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";

interface DashboardData {
  core_metrics: any;
  payment_analytics: any;
  order_status_distribution: any;
  charts: any;
  operational_alerts: any;
  recent_orders: any[];
  recent_transactions: any[];
  additional_metrics: any;
}

export default function Dashboard() {
  const { t } = useTranslation();
  const [period, setPeriod] = useState("today");
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(
    null
  );

  const fetchDashboardData = async (selectedPeriod: string) => {
    try {
      setIsLoading(true);
      const response = await dashboardService.getStatistics(selectedPeriod);
      setDashboardData(response.data);
    } catch (error) {
      toast({
        title: t("dashboard.error"),
        description: t("dashboard.fetchError"),
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDashboardData(period);
  }, [period]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    fetchDashboardData(period);
  };

  const MetricCard = ({
    title,
    value,
    growth,
    trend,
    icon: Icon,
    iconColor,
    note,
  }: {
    title: string;
    value: string | number;
    growth?: number;
    trend?: string;
    icon: any;
    iconColor?: string;
    note?: string;
  }) => (
    <Card className="shadow-card hover:shadow-elegant transition-all duration-300">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <Icon className={`h-5 w-5 ${iconColor || "text-primary"}`} />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {growth !== undefined && growth !== 0 && (
          <div className="flex items-center gap-1 mt-1">
            {trend === "up" ? (
              <TrendingUp className="h-4 w-4 text-success" />
            ) : trend === "down" ? (
              <TrendingDown className="h-4 w-4 text-destructive" />
            ) : null}
            <span
              className={`text-xs font-medium ${
                trend === "up"
                  ? "text-success"
                  : trend === "down"
                  ? "text-destructive"
                  : "text-muted-foreground"
              }`}
            >
              {growth > 0 ? "+" : ""}
              {growth.toFixed(1)}%
            </span>
            <span className="text-xs text-muted-foreground ml-1">
              {t("dashboard.vsPrevious")}
            </span>
          </div>
        )}
        {note && <p className="text-xs text-muted-foreground mt-1">{note}</p>}
      </CardContent>
    </Card>
  );

  if (isLoading && !dashboardData) {
    return (
      <div className="animate-fade-in flex items-center justify-center h-[60vh]">
        <div className="text-center">
          <RefreshCw className="h-12 w-12 animate-spin text-primary mx-auto" />
          <p className="mt-4 text-muted-foreground">{t("dashboard.loading")}</p>
        </div>
      </div>
    );
  }

  if (!dashboardData) return null;

  const {
    core_metrics,
    payment_analytics,
    order_status_distribution,
    charts,
    operational_alerts,
    recent_orders,
    recent_transactions,
    additional_metrics,
  } = dashboardData;

  return (
    <div className="animate-fade-in space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">{t("dashboard.title")}</h1>
          <p className="text-muted-foreground mt-1">
            {t("dashboard.subtitle")}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">
                {t("dashboard.periods.today")}
              </SelectItem>
              <SelectItem value="yesterday">
                {t("dashboard.periods.yesterday")}
              </SelectItem>
              <SelectItem value="last_7_days">
                {t("dashboard.periods.last7Days")}
              </SelectItem>
              <SelectItem value="last_30_days">
                {t("dashboard.periods.last30Days")}
              </SelectItem>
              <SelectItem value="this_month">
                {t("dashboard.periods.thisMonth")}
              </SelectItem>
              <SelectItem value="last_month">
                {t("dashboard.periods.lastMonth")}
              </SelectItem>
              <SelectItem value="this_year">
                {t("dashboard.periods.thisYear")}
              </SelectItem>
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            size="icon"
            onClick={handleRefresh}
            disabled={isRefreshing}
          >
            <RefreshCw
              className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`}
            />
          </Button>
        </div>
      </div>

      {/* Core Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title={t("dashboard.metrics.revenue")}
          value={`৳${core_metrics.revenue.current.toLocaleString()}`}
          growth={core_metrics.revenue.growth_percentage}
          trend={core_metrics.revenue.trend}
          icon={DollarSign}
          iconColor="text-green-600"
          note={core_metrics.revenue.note}
        />
        <MetricCard
          title={t("dashboard.metrics.orders")}
          value={core_metrics.orders.current}
          growth={core_metrics.orders.growth_percentage}
          trend={core_metrics.orders.trend}
          icon={ShoppingCart}
          iconColor="text-blue-600"
        />
        <MetricCard
          title={t("dashboard.metrics.averageOrderValue")}
          value={`৳${core_metrics.average_order_value.current.toLocaleString()}`}
          growth={core_metrics.average_order_value.growth_percentage}
          trend={core_metrics.average_order_value.trend}
          icon={TrendingUp}
          iconColor="text-purple-600"
        />
        <MetricCard
          title={t("dashboard.metrics.newCustomers")}
          value={additional_metrics.customers.new_registrations}
          icon={UserPlus}
          iconColor="text-orange-600"
        />
      </div>

      {/* Order Type Breakdown */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              {t("dashboard.orderTypes.title")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-lg bg-blue-50 dark:bg-blue-950">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    {t("dashboard.orderTypes.package")}
                  </p>
                  <p className="text-2xl font-bold">
                    {core_metrics.package_orders.count}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">
                    ৳{core_metrics.package_orders.revenue.toLocaleString()}
                  </p>
                  <Badge variant="secondary">
                    {core_metrics.package_orders.percentage.toFixed(1)}%
                  </Badge>
                </div>
              </div>
              <div className="flex items-center justify-between p-4 rounded-lg bg-green-50 dark:bg-green-950">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    {t("dashboard.orderTypes.regular")}
                  </p>
                  <p className="text-2xl font-bold">
                    {core_metrics.regular_orders.count}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">
                    ৳{core_metrics.regular_orders.revenue.toLocaleString()}
                  </p>
                  <Badge variant="secondary">
                    {core_metrics.regular_orders.percentage.toFixed(1)}%
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Payment Status */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              {t("dashboard.paymentStatus.title")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-success" />
                  <span className="text-sm">
                    {t("dashboard.paymentStatus.paid")}
                  </span>
                </div>
                <div className="text-right">
                  <p className="font-semibold">
                    {payment_analytics.payment_status.paid.count}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    ৳
                    {payment_analytics.payment_status.paid.amount.toLocaleString()}
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-warning" />
                  <span className="text-sm">
                    {t("dashboard.paymentStatus.pending")}
                  </span>
                </div>
                <div className="text-right">
                  <p className="font-semibold">
                    {payment_analytics.payment_status.pending.count}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    ৳
                    {payment_analytics.payment_status.pending.amount.toLocaleString()}
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <XCircle className="h-4 w-4 text-destructive" />
                  <span className="text-sm">
                    {t("dashboard.paymentStatus.failed")}
                  </span>
                </div>
                <div className="text-right">
                  <p className="font-semibold">
                    {payment_analytics.payment_status.failed.count}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    ৳
                    {payment_analytics.payment_status.failed.amount.toLocaleString()}
                  </p>
                </div>
              </div>
              <div className="pt-3 border-t">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">
                    {t("dashboard.paymentStatus.successRate")}
                  </span>
                  <Badge
                    variant={
                      payment_analytics.payment_status.success_rate > 50
                        ? "default"
                        : "destructive"
                    }
                  >
                    {payment_analytics.payment_status.success_rate.toFixed(1)}%
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>{t("dashboard.charts.monthlyTrend")}</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={charts.monthly_trend}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="month" className="text-xs" />
                <YAxis className="text-xs" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                />
                <Legend />
                <Bar
                  dataKey="revenue"
                  fill="hsl(var(--primary))"
                  radius={[8, 8, 0, 0]}
                  name={t("dashboard.charts.revenue")}
                />
                <Bar
                  dataKey="orders"
                  fill="hsl(var(--success))"
                  radius={[8, 8, 0, 0]}
                  name={t("dashboard.charts.orders")}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>{t("dashboard.charts.yearlyComparison")}</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={charts.yearly_comparison.filter(
                  (item: any) => item.revenue > 0 || item.orders > 0
                )}
              >
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="year" className="text-xs" />
                <YAxis className="text-xs" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                />
                <Legend />
                <Bar
                  dataKey="revenue"
                  fill="hsl(var(--primary))"
                  radius={[8, 8, 0, 0]}
                  name={t("dashboard.charts.revenue")}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Operational Alerts */}
      <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-5">
        <Card className="border-warning/50 bg-warning/5">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <AlertCircle className="h-8 w-8 text-warning" />
              <div className="text-right">
                <p className="text-2xl font-bold">
                  {operational_alerts.pending_approvals}
                </p>
                <p className="text-xs text-muted-foreground">
                  {t("dashboard.alerts.pendingApprovals")}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-destructive/50 bg-destructive/5">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <XCircle className="h-8 w-8 text-destructive" />
              <div className="text-right">
                <p className="text-2xl font-bold">
                  {operational_alerts.failed_payments}
                </p>
                <p className="text-xs text-muted-foreground">
                  {t("dashboard.alerts.failedPayments")}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-orange-500/50 bg-orange-50 dark:bg-orange-950">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <AlertCircle className="h-8 w-8 text-orange-600" />
              <div className="text-right">
                <p className="text-2xl font-bold">
                  {operational_alerts.delivery_sync_failures}
                </p>
                <p className="text-xs text-muted-foreground">
                  {t("dashboard.alerts.deliverySyncFailures")}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-blue-500/50 bg-blue-50 dark:bg-blue-950">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <DollarSign className="h-8 w-8 text-blue-600" />
              <div className="text-right">
                <p className="text-2xl font-bold">
                  {operational_alerts.pending_refunds}
                </p>
                <p className="text-xs text-muted-foreground">
                  {t("dashboard.alerts.pendingRefunds")}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-purple-500/50 bg-purple-50 dark:bg-purple-950">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <Coins className="h-8 w-8 text-purple-600" />
              <div className="text-right">
                <p className="text-2xl font-bold">
                  {operational_alerts.low_coin_balance_users}
                </p>
                <p className="text-xs text-muted-foreground">
                  {t("dashboard.alerts.lowCoinBalance")}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Additional Metrics */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Gift className="h-5 w-5" />
              {t("dashboard.additional.donations")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">
                  {t("dashboard.additional.count")}
                </span>
                <span className="font-semibold">
                  {additional_metrics.donations.count}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">
                  {t("dashboard.additional.amount")}
                </span>
                <span className="font-semibold">
                  ৳{additional_metrics.donations.total_amount.toLocaleString()}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Coins className="h-5 w-5" />
              {t("dashboard.additional.coins")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">
                  {t("dashboard.additional.earned")}
                </span>
                <span className="font-semibold text-success">
                  +{additional_metrics.coins.earned.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">
                  {t("dashboard.additional.spent")}
                </span>
                <span className="font-semibold text-destructive">
                  -{additional_metrics.coins.spent.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between pt-2 border-t">
                <span className="text-sm font-medium">
                  {t("dashboard.additional.net")}
                </span>
                <span className="font-bold">
                  {additional_metrics.coins.net.toLocaleString()}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              {t("dashboard.additional.referrals")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">
                  {t("dashboard.additional.total")}
                </span>
                <span className="font-semibold">
                  {additional_metrics.referrals.total}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">
                  {t("dashboard.additional.credited")}
                </span>
                <span className="font-semibold">
                  {additional_metrics.referrals.credited}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">
                  {t("dashboard.additional.coinsDistributed")}
                </span>
                <span className="font-semibold">
                  {additional_metrics.referrals.coins_distributed.toLocaleString()}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>{t("dashboard.recentOrders.title")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recent_orders.slice(0, 5).map((order: any) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between p-3 rounded-lg border"
                >
                  <div className="flex-1">
                    <p className="font-medium text-sm">{order.orderId}</p>
                    <p className="text-xs text-muted-foreground">
                      {order.customer.name}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-sm">
                      ৳{order.amount.toLocaleString()}
                    </p>
                    <Badge
                      variant={
                        order.order_status === "Pending"
                          ? "secondary"
                          : order.order_status === "Cancelled"
                          ? "destructive"
                          : "default"
                      }
                      className="text-xs"
                    >
                      {order.order_status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>{t("dashboard.recentTransactions.title")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recent_transactions.slice(0, 5).map((txn: any) => (
                <div
                  key={txn.id}
                  className="flex items-center justify-between p-3 rounded-lg border"
                >
                  <div className="flex-1">
                    <p className="font-medium text-sm">{txn.transaction_id}</p>
                    <p className="text-xs text-muted-foreground">
                      {txn.customer.name}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-sm">
                      ৳{txn.amount.toLocaleString()}
                    </p>
                    <Badge
                      variant={
                        txn.status === "Success"
                          ? "default"
                          : txn.status === "Pending"
                          ? "secondary"
                          : "destructive"
                      }
                      className="text-xs"
                    >
                      {txn.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
