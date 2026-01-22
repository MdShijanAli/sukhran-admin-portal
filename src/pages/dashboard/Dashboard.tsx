import { useTranslation } from "react-i18next";
import { ShoppingCart, DollarSign, Package, RefreshCcw } from "lucide-react";

import { useEffect, useState, useMemo } from "react";
import dashboardService from "@/services/dashboardService";
import { BaseDatePicker } from "@/components/custom/BaseDatePicker";
import { DateRange } from "react-day-picker";
import { Button } from "@/components/ui/button";
import RevenueChart from "./RevenueChart";
import TopProductsChart from "./TopProductsChart";
import StatCard from "@/components/custom/StatCard";
import { StatCardSkeleton, ChartSkeleton } from "@/components/custom/Skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import RecentOrders from "./RecentOrders";
import RecentTransactions from "./RecentTransactions";
import { useSidebarStore } from "@/stores/sidebarStore";
import { formatDate } from "@/lib/utils";
import { CardDescription, CardTitle } from "@/components/ui/card";

interface CoreMetrics {
  orders: {
    current: number;
    growth_percentage: number;
  };
  revenue: {
    current: number;
    growth_percentage: number;
  };
  package_orders: {
    count: number;
    percentage: number;
  };
  regular_orders: {
    count: number;
    percentage: number;
  };
  average_order_value: {
    current: number;
    growth_percentage: number;
  };
}

export interface ChartDataPoint {
  name: string;
  revenue: string;
  orders: number;
  avg_orders?: string;
}

export interface TopProducts {
  id: string;
  name: string;
  total_quantity?: number;
  total_revenue?: number;
  sales?: number;
  revenue?: string;
  average_order_value?: string;
  total_orders?: number;
}

interface OrderStat {
  count: number;
  percentage: number;
}

export interface WeeklyTrendData extends ChartDataPoint {
  week: string;
  week_range: string;
  week_start: string;
  week_end: string;
  average_order_value?: number;
}

export interface DailyTrendData extends ChartDataPoint {
  date: string;
  day: string;
  day_name: string;
  average_order_value?: number;
}

export interface HourlyTrendData extends ChartDataPoint {
  hour: string;
  timestamp: string;
  average_order_value?: number;
}

export interface RecentOrdersData {
  id: string;
  orderId: string;
  type: "Package" | "Product";
  customer: {
    name: string;
    email: string;
  };
  amount: number;
  payment_mode: string;
  payment_status: string;
  order_status: string;
  created_at: string;
}

export interface RecentTransactionsData {
  id: number;
  transaction_id: string;
  customer: {
    name: string;
  };
  amount: number;
  payment_method: string;
  status: string;
  type: string;
  created_at: string;
}

interface Online {
  count: number;
  revenue: number;
  customer_payments: number;
  donations: number;
  percentage: number;
}

interface DashboardData {
  core_metrics: CoreMetrics;
  charts: {
    monthly_trend: Array<{
      month: string;
      revenue: number;
      orders: number;
      average_order_value: number;
    }>;
    yearly_comparison: Array<{
      year: string;
      revenue: number;
      orders: number;
      average_order_value: number;
    }>;
    weekly_trend: WeeklyTrendData[];
    daily_trend: DailyTrendData[];
    hourly_trend: HourlyTrendData[];
  };
  top_performers: {
    top_products: TopProducts[];
    top_packages: TopProducts[];
  };
  order_status_distribution: {
    returned: OrderStat;
    pending: OrderStat;
    delivered: OrderStat;
    cancelled: OrderStat;
    shipped: OrderStat;
    approved: OrderStat;
    confirmed: OrderStat;
    out_for_delivery: OrderStat;
  };
  recent_orders: RecentOrdersData[];
  recent_transactions: RecentTransactionsData[];
  payment_analytics: {
    payment_mode_breakdown: {
      online: Online;
      cod: Online;
    };
  };
  additional_metrics: {
    donations: {
      count: number;
      total_amount: number;
    };
  };
}

export default function Dashboard() {
  const { t } = useTranslation();
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(
    null,
  );
  const { isCollapsed } = useSidebarStore();
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const statsData = dashboardData?.core_metrics;
  const donation = dashboardData?.additional_metrics?.donations;

  const monthlyRevenueChart = useMemo<ChartDataPoint[]>(() => {
    if (!dashboardData?.charts?.monthly_trend) return [];
    return dashboardData.charts.monthly_trend.map((item) => ({
      name: item.month,
      revenue: `৳${item.revenue?.toLocaleString()}`,
      orders: item.orders,
      avg_orders: `৳${item.average_order_value?.toFixed(2)?.toLocaleString()}`,
    }));
  }, [dashboardData]);

  const yearlyRevenueChart = useMemo<ChartDataPoint[]>(() => {
    if (!dashboardData?.charts?.yearly_comparison) return [];
    return dashboardData.charts.yearly_comparison.map((item) => ({
      name: item.year,
      revenue: `৳${item.revenue?.toLocaleString()}`,
      orders: item.orders,
      avg_orders: `৳${item.average_order_value?.toFixed(2)?.toLocaleString()}`,
    }));
  }, [dashboardData]);
  const weeklyRevenueChart = useMemo<ChartDataPoint[]>(() => {
    if (!dashboardData?.charts?.weekly_trend) return [];
    return dashboardData.charts.weekly_trend.map((item) => ({
      name: item.week_range,
      revenue: `৳${item.revenue?.toLocaleString()}`,
      orders: item.orders,
      avg_orders: `৳${item.average_order_value?.toFixed(2)?.toLocaleString()}`,
    }));
  }, [dashboardData]);
  const dailyRevenueChart = useMemo<ChartDataPoint[]>(() => {
    if (!dashboardData?.charts?.daily_trend) return [];
    return dashboardData.charts.daily_trend.map((item) => ({
      name: item.date,
      revenue: `৳${item.revenue?.toLocaleString()}`,
      orders: item.orders,
      avg_orders: `৳${item.average_order_value?.toFixed(2)?.toLocaleString()}`,
    }));
  }, [dashboardData]);
  const hourlyRevenueChart = useMemo<ChartDataPoint[]>(() => {
    if (!dashboardData?.charts?.hourly_trend) return [];
    return dashboardData.charts.hourly_trend.map((item) => ({
      name: item.hour,
      revenue: `৳${item.revenue?.toLocaleString()}`,
      orders: item.orders,
      avg_orders: `৳${item.average_order_value?.toFixed(2)?.toLocaleString()}`,
      timestamp: formatDate(item.timestamp),
    }));
  }, [dashboardData]);
  const topPerformingProducts = useMemo<TopProducts[]>(() => {
    if (!dashboardData?.top_performers?.top_products) return [];
    return dashboardData.top_performers.top_products.map((product) => ({
      id: product.id,
      name: product.name,
      sales: product.total_quantity,
      revenue: `৳${product.total_revenue?.toLocaleString()}`,
    }));
  }, [dashboardData]);
  const topPerformingPackages = useMemo<TopProducts[]>(() => {
    if (!dashboardData?.top_performers?.top_packages) return [];
    return dashboardData.top_performers.top_packages.map((pkg) => ({
      id: pkg.id,
      name: pkg.name,
      sales: pkg.total_orders,
      revenue: `৳${pkg.total_revenue?.toLocaleString()}`,
      average_order_value: `৳${pkg.average_order_value?.toLocaleString()}`,
    }));
  }, [dashboardData]);

  const recentOrders = useMemo<RecentOrdersData[]>(() => {
    if (!dashboardData?.recent_orders) return [];
    return dashboardData.recent_orders;
  }, [dashboardData]);
  const recentTransactions = useMemo<RecentTransactionsData[]>(() => {
    if (!dashboardData?.recent_transactions) return [];
    return dashboardData.recent_transactions;
  }, [dashboardData]);
  const paymentAnalyticsStats = useMemo<{
    online: Online;
    cod: Online;
  }>(() => {
    if (!dashboardData?.payment_analytics?.payment_mode_breakdown)
      return {
        online: {
          count: 0,
          revenue: 0,
          customer_payments: 0,
          donations: 0,
          percentage: 0,
        },
        cod: {
          count: 0,
          revenue: 0,
          customer_payments: 0,
          donations: 0,
          percentage: 0,
        },
      };
    return dashboardData.payment_analytics.payment_mode_breakdown;
  }, [dashboardData]);

  const fetchDashboardData = async (queryString?: string) => {
    try {
      setIsLoading(true);
      const response = await dashboardService.getStatistics(queryString);
      if (response && typeof response === "object" && "data" in response) {
        setDashboardData(response.data as DashboardData);
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      setDashboardData(null);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    fetchDashboardData();
  }, []);

  useEffect(() => {
    if (!dateRange?.from) return;

    const start = dateRange.from.toISOString().split("T")[0];
    const end = dateRange.to
      ? dateRange.to.toISOString().split("T")[0]
      : dateRange.from.toISOString().split("T")[0];
    const queryString = `start_date=${start}&end_date=${end}`;
    fetchDashboardData(queryString);
  }, [dateRange]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await fetchDashboardData();
      setDateRange(undefined);
    } catch (error) {
      console.error("Error refreshing dashboard data:", error);
    } finally {
      setIsRefreshing(false);
    }
  };

  const dashboardStatsItems = useMemo(
    () => [
      {
        title: t("dashboard.totalOrders"),
        value: statsData?.orders?.current ?? 0,
        change: statsData?.orders?.growth_percentage,
        icon: ShoppingCart,
        trend:
          (statsData?.orders?.growth_percentage ?? 0) > 0
            ? ("up" as const)
            : ("down" as const),
        type: "number",
      },
      {
        title: t("dashboard.totalRevenue"),
        value: `৳${(statsData?.revenue?.current ?? 0)?.toLocaleString()}`,
        change: statsData?.revenue?.growth_percentage,
        icon: DollarSign,
        trend:
          (statsData?.revenue?.growth_percentage ?? 0) > 0
            ? ("up" as const)
            : ("down" as const),
      },
      {
        title: t("dashboard.packageOrders"),
        value: statsData?.package_orders?.count ?? 0,
        change: statsData?.package_orders?.percentage,
        icon: Package,
        trend:
          (statsData?.package_orders?.percentage ?? 0) > 0
            ? ("up" as const)
            : ("down" as const),
        type: "number",
      },
      {
        title: t("dashboard.productOrders"),
        value: statsData?.regular_orders?.count ?? 0,
        change: statsData?.regular_orders?.percentage,
        icon: Package,
        trend:
          (statsData?.regular_orders?.percentage ?? 0) > 0
            ? ("up" as const)
            : ("down" as const),
        type: "number",
      },
      {
        title: t("dashboard.average_order"),
        value: `৳${statsData?.average_order_value?.current?.toLocaleString()}`,
        change: statsData?.average_order_value?.growth_percentage,
        icon: Package,
        trend:
          (statsData?.average_order_value?.growth_percentage ?? 0) > 0
            ? ("up" as const)
            : ("down" as const),
      },
    ],
    [statsData, t],
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <CardTitle>{t("dashboard.title")}</CardTitle>
          <CardDescription>
            {t("dashboard.subtitle")}
          </CardDescription>
        </div>

        <div className="grid md:flex grid-cols-3 gap-3  flex-col sm:flex-row sm:items-center sm:gap-2 w-full sm:w-auto">
          <div className="col-span-2">
            <BaseDatePicker
              value={dateRange}
              onChange={setDateRange}
              className="w-full"
            />
          </div>
          <Button
            onClick={handleRefresh}
            variant="outline"
            className="w-full sm:w-auto"
          >
            <RefreshCcw
              className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`}
            />
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div
        className={`grid gap-4 sm:grid-cols-2 ${isCollapsed
          ? "sm:grid-cols-3 lg:grid-cols-5"
          : "sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5"
          }`}
      >
        {isLoading
          ? Array.from({ length: 5 }).map((_, i) => (
            <StatCardSkeleton key={i} />
          ))
          : dashboardStatsItems.map((stat, index) => (
            <StatCard
              key={index}
              title={stat.title}
              value={stat.value}
              change={stat.change}
              icon={stat.icon}
              trend={stat.trend}
            />
          ))}
      </div>

      {/* Charts */}
      <div className="grid gap-4 md:grid-cols-2">
        {isLoading ? (
          <>
            <ChartSkeleton />
            <ChartSkeleton />
          </>
        ) : (
          <>
            <RevenueChart
              monthlyRevenueChart={monthlyRevenueChart}
              yearlyRevenueChart={yearlyRevenueChart}
              weeklyRevenueChart={weeklyRevenueChart}
              dailyRevenueChart={dailyRevenueChart}
              hourlyRevenueChart={hourlyRevenueChart}
            />
            <TopProductsChart
              productData={topPerformingProducts}
              packageData={topPerformingPackages}
            />
          </>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-3">
        <div className="lg:col-span-3 border rounded-md p-2">
          <Tabs defaultValue="orders">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="orders">
                {t("dashboard.recentOrders.title")}
              </TabsTrigger>
              <TabsTrigger value="transactions">
                {t("dashboard.recentTransactions.title")}
              </TabsTrigger>
            </TabsList>
            <TabsContent value="orders">
              <RecentOrders data={recentOrders} isLoading={isLoading} />
            </TabsContent>
            <TabsContent value="transactions">
              <RecentTransactions
                data={recentTransactions}
                isLoading={isLoading}
              />
            </TabsContent>
          </Tabs>
        </div>
        <div className="lg:col-span-1">
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-1">
            {isLoading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <StatCardSkeleton key={i} />
              ))
            ) : (
              <>
                <StatCard
                  icon={DollarSign}
                  title={t("dashboard.onlinePayments")}
                  value={`৳${paymentAnalyticsStats.online.customer_payments?.toLocaleString()}`}
                  superText={`${paymentAnalyticsStats.online.count} ${t("dashboard.payment.orders")}`}
                  description={
                    <div className="text-xs text-muted-foreground mt-1 space-y-0.5">
                      <div>
                        {t("dashboard.payment.revenue")}: ৳
                        {paymentAnalyticsStats.online.revenue?.toLocaleString()}
                      </div>
                      <div>
                        {t("dashboard.payment.donations")}: ৳
                        {paymentAnalyticsStats.online.donations?.toLocaleString()}
                      </div>
                    </div>
                  }
                  change={paymentAnalyticsStats.online.percentage}
                  trend={
                    paymentAnalyticsStats.online.percentage > 0 ? "up" : "down"
                  }
                />
                <StatCard
                  icon={DollarSign}
                  title={t("dashboard.codPayments")}
                  value={`৳${paymentAnalyticsStats.cod.customer_payments?.toLocaleString()}`}
                  superText={`${paymentAnalyticsStats.cod.count} ${t("dashboard.payment.orders")}`}
                  description={
                    <div className="text-xs text-muted-foreground mt-1 space-y-0.5">
                      <div>
                        {t("dashboard.payment.revenue")}: ৳
                        {paymentAnalyticsStats.cod.revenue?.toLocaleString()}
                      </div>
                      <div>
                        {t("dashboard.payment.donations")}: ৳
                        {paymentAnalyticsStats.cod.donations?.toLocaleString()}
                      </div>
                    </div>
                  }
                  change={paymentAnalyticsStats.cod.percentage}
                  trend={
                    paymentAnalyticsStats.cod.percentage > 0 ? "up" : "down"
                  }
                />
                <StatCard
                  icon={DollarSign}
                  title={t("dashboard.donationAmount")}
                  value={`৳${donation?.total_amount?.toLocaleString()}`}
                  superText={`${donation?.count} ${t("dashboard.donations")}`}
                />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
