import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ComingSoon from "@/components/custom/ComingSoon";
import {
  ShoppingCart,
  DollarSign,
  Users,
  TrendingUp,
  TrendingDown,
  Package,
  AlertCircle,
} from "lucide-react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { dashboardStats, revenueData, topProducts } from "@/data/mockData";

export default function Dashboard() {
  const { t } = useTranslation();
  const isProduction = import.meta.env.PROD;

  // Show Coming Soon in production mode
  if (isProduction) {
    return (
      <div className="animate-fade-in">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Welcome back! Here's what's happening today.
          </p>
        </div>
        <ComingSoon />
      </div>
    );
  }

  const StatCard = ({
    title,
    value,
    change,
    icon: Icon,
    trend,
  }: {
    title: string;
    value: string | number;
    change?: number;
    icon: any;
    trend?: "up" | "down";
  }) => (
    <Card className="shadow-card hover:shadow-elegant transition-all duration-300">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <Icon className="h-5 w-5 text-primary" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {change !== undefined && (
          <div className="flex items-center gap-1 mt-1">
            {trend === "up" ? (
              <TrendingUp className="h-4 w-4 text-success" />
            ) : (
              <TrendingDown className="h-4 w-4 text-destructive" />
            )}
            <span
              className={`text-xs font-medium ${
                trend === "up" ? "text-success" : "text-destructive"
              }`}
            >
              {change > 0 ? "+" : ""}
              {change}%
            </span>
            <span className="text-xs text-muted-foreground ml-1">
              vs last week
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="animate-fade-in space-y-4">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Welcome back! Here's what's happening today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title={t("dashboard.todayOrders")}
          value={dashboardStats.todayOrders.count}
          change={dashboardStats.todayOrders.change}
          icon={ShoppingCart}
          trend="up"
        />
        <StatCard
          title={t("dashboard.totalRevenue")}
          value={`৳${dashboardStats.revenue.amount.toLocaleString()}`}
          change={dashboardStats.revenue.change}
          icon={DollarSign}
          trend="up"
        />
        <StatCard
          title={t("dashboard.activeSubscriptions")}
          value={dashboardStats.activeSubscriptions.count}
          change={-1.2}
          icon={Package}
          trend="down"
        />
        <StatCard
          title={t("dashboard.newUsers")}
          value={dashboardStats.newUsers.count}
          change={dashboardStats.newUsers.change}
          icon={Users}
          trend="up"
        />
      </div>

      {/* Charts */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>{t("dashboard.revenueChart")}</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="name" className="text-xs" />
                <YAxis className="text-xs" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  name="Revenue"
                />
                <Line
                  type="monotone"
                  dataKey="subscriptions"
                  stroke="hsl(var(--success))"
                  strokeWidth={2}
                  name="Subscriptions"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>{t("dashboard.topProducts")}</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={topProducts}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis
                  dataKey="name"
                  className="text-xs"
                  angle={-45}
                  textAnchor="end"
                  height={100}
                />
                <YAxis className="text-xs" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                />
                <Bar
                  dataKey="sales"
                  fill="hsl(var(--primary))"
                  radius={[8, 8, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Alert Cards */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="border-warning/50 bg-warning/5 shadow-card">
          <CardHeader className="flex flex-row items-center gap-2">
            <AlertCircle className="h-5 w-5 text-warning" />
            <CardTitle className="text-base">Pending Deliveries</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {dashboardStats.pendingDeliveries.count}
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              Orders waiting for delivery assignment
            </p>
          </CardContent>
        </Card>

        <Card className="border-destructive/50 bg-destructive/5 shadow-card">
          <CardHeader className="flex flex-row items-center gap-2">
            <AlertCircle className="h-5 w-5 text-destructive" />
            <CardTitle className="text-base">Payment Failures</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {dashboardStats.paymentFailures.count}
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              Failed transactions requiring attention
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
