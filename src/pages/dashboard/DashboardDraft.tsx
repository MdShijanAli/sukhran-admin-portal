import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ShoppingCart,
  DollarSign,
  Package,
  AlertCircle,
  RefreshCcw,
} from "lucide-react";

import { dashboardStats } from "@/data/mockData";
import { useEffect, useState, useMemo } from "react";
import dashboardService from "@/services/dashboardService";
import { BaseDatePicker } from "@/components/custom/BaseDatePicker";
import { DateRange } from "react-day-picker";
import { Button } from "@/components/ui/button";
import RevenueChart from "./RevenueChart";
import TopProductsChart from "./TopProductsChart";
import StatCard from "@/components/custom/StatCard";
import {
  StatCardSkeleton,
  ChartSkeleton,
  AlertCardSkeleton,
} from "@/components/custom/Skeleton";

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

interface ChartDataPoint {
  name: string;
  revenue: string;
  orders: number;
}

interface TopProducts {
  id: string;
  name: number;
  sales: number;
  revenue: number;
}

interface DashboardData {
  core_metrics: CoreMetrics;
  charts: {
    monthly_trend: Array<{
      month: string;
      revenue: number;
      orders: number;
    }>;
    yearly_comparison: Array<{
      year: string;
      revenue: number;
      orders: number;
    }>;
  };
  TopProducts: TopProducts[];
}

export default function Dashboard() {
  const { t } = useTranslation();
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(
    null
  );
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const statsData = dashboardData?.core_metrics;

  const monthlyRevenueChart = useMemo<ChartDataPoint[]>(() => {
    if (!dashboardData?.charts?.monthly_trend) return [];
    return dashboardData.charts.monthly_trend.map((item) => ({
      name: item.month,
      revenue: `৳${item.revenue.toLocaleString()}`,
      orders: item.orders,
    }));
  }, [dashboardData]);

  const yearlyRevenueChart = useMemo<ChartDataPoint[]>(() => {
    if (!dashboardData?.charts?.yearly_comparison) return [];
    return dashboardData.charts.yearly_comparison.map((item) => ({
      name: item.year,
      revenue: `৳${item.revenue.toLocaleString()}`,
      orders: item.orders,
    }));
  }, [dashboardData]);
  //   const topPerformingProducts = useMemo<TopProducts[]>(() => {
  //     return dashboardStats?.topProducts.map((product) => ({
  //       id: product.id,
  //       name: product.name,
  //       sales: product.sales,
  //       revenue: product.revenue,
  //     }));
  //   }, [dashboardData]);

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
    const queryString = `period=custom&start_date=${start}&end_date=${end}`;
    fetchDashboardData(queryString);
  }, [dateRange]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await fetchDashboardData();
    } catch (error) {
      console.error("Error refreshing dashboard data:", error);
    } finally {
      setIsRefreshing(false);
    }
  };

  const dashboardStatsItems = useMemo(
    () => [
      {
        title: t("dashboard.todayOrders"),
        value: statsData?.orders?.current ?? 0,
        change: statsData?.orders?.growth_percentage,
        icon: ShoppingCart,
        trend:
          (statsData?.orders?.growth_percentage ?? 0) > 0
            ? ("up" as const)
            : ("down" as const),
      },
      {
        title: t("dashboard.totalRevenue"),
        value: `৳${(statsData?.revenue?.current ?? 0).toLocaleString()}`,
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
      },
      {
        title: t("dashboard.average_order"),
        value: statsData?.average_order_value?.current ?? 0,
        change: statsData?.average_order_value?.growth_percentage,
        icon: Package,
        trend:
          (statsData?.average_order_value?.growth_percentage ?? 0) > 0
            ? ("up" as const)
            : ("down" as const),
      },
    ],
    [statsData, t]
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">{t("dashboard.title")}</h1>
          <p className="text-muted-foreground mt-1">
            {t("dashboard.subtitle")}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2 w-full sm:w-auto">
          <BaseDatePicker
            value={dateRange}
            onChange={setDateRange}
            className="w-full sm:w-auto"
          />
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
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
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
            />
            <TopProductsChart />
          </>
        )}
      </div>

      {/* Alert Cards */}
      <div className="grid gap-4 md:grid-cols-2">
        {isLoading ? (
          <>
            <AlertCardSkeleton />
            <AlertCardSkeleton />
          </>
        ) : (
          <>
            <Card className="border-warning/50 bg-warning/5 shadow-card">
              <CardHeader className="flex flex-row items-center gap-2">
                <AlertCircle className="h-5 w-5 text-warning" />
                <CardTitle className="text-base">
                  {t("dashboard.pendingDeliveries")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">
                  {dashboardStats.pendingDeliveries.count}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  {t("dashboard.pendingDeliveriesDescription")}
                </p>
              </CardContent>
            </Card>

            <Card className="border-destructive/50 bg-destructive/5 shadow-card">
              <CardHeader className="flex flex-row items-center gap-2">
                <AlertCircle className="h-5 w-5 text-destructive" />
                <CardTitle className="text-base">
                  {t("dashboard.paymentFailures")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">
                  {dashboardStats.paymentFailures.count}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  {t("dashboard.paymentFailuresDescription")}
                </p>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  );
}
