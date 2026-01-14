import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  TrendingUp,
  TrendingDown,
  RefreshCw,
  Filter,
  Download,
  ArrowRight,
  MoreHorizontal,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import dashboardService from "@/services/dashboardService";
import { toast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

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

// Chart colors matching the reference design
const CHART_COLORS = {
  desktop: "#f97316", // Orange
  mobile: "#14b8a6", // Teal
};

const DONUT_COLORS = ["#f97316", "#14b8a6", "#ef4444", "#8b5cf6"];

// Mock data for the revenue chart matching the design
const revenueChartData = [
  { month: "Jan", desktop: 186, mobile: 80 },
  { month: "Feb", desktop: 305, mobile: 200 },
  { month: "Mar", desktop: 237, mobile: 120 },
  { month: "Apr", desktop: 73, mobile: 190 },
  { month: "May", desktop: 209, mobile: 130 },
  { month: "Jun", desktop: 214, mobile: 140 },
];

// Mock data for recent activity
const recentActivityData = [
  { id: 1, name: "Lera", email: "lera75@gmail.com", status: "Invited", orderId: "#329341", date: "40 min ago", amount: "$509.29" },
  { id: 2, name: "Kailee", email: "kailee.grimes@yahoo.com", status: "Suspended", orderId: "#329341", date: "34 min ago", amount: "$292.23" },
  { id: 3, name: "Karine", email: "karine59@yahoo.com", status: "Invited", orderId: "#329341", date: "44 min ago", amount: "$71.36" },
  { id: 4, name: "Haylie", email: "haylie.koelpin40@gmail.com", status: "Delete", orderId: "#329341", date: "00 min ago", amount: "$467.67" },
  { id: 5, name: "Lane", email: "lane.beer81@yahoo.com", status: "Suspended", orderId: "#329341", date: "02 min ago", amount: "$856.77" },
];

// Visitor donut chart data
const visitorChartData = [
  { name: "Desktop", value: 400 },
  { name: "Mobile", value: 300 },
  { name: "Tablet", value: 200 },
  { name: "Other", value: 225 },
];

export default function Dashboard() {
  const { t } = useTranslation();
  const [period, setPeriod] = useState("today");
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);

  const fetchDashboardData = async (selectedPeriod: string) => {
    try {
      setIsLoading(true);
      const response = await dashboardService.getStatistics(selectedPeriod) as { data: DashboardData };
      setDashboardData(response?.data);
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

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Invited":
        return <span className="text-muted-foreground text-sm">{status}</span>;
      case "Suspended":
        return (
          <Badge variant="outline" className="bg-orange-50 text-orange-600 border-orange-200 dark:bg-orange-950 dark:text-orange-400 dark:border-orange-800">
            {status}
          </Badge>
        );
      case "Delete":
        return (
          <Badge variant="outline" className="bg-red-50 text-red-600 border-red-200 dark:bg-red-950 dark:text-red-400 dark:border-red-800">
            {status}
          </Badge>
        );
      default:
        return <span className="text-muted-foreground text-sm">{status}</span>;
    }
  };

  // Stats Card Component
  const StatsCard = ({
    title,
    value,
    growth,
    trend,
    todayValue,
    iconBgColor,
  }: {
    title: string;
    value: string;
    growth: number;
    trend: "up" | "down";
    todayValue: string;
    iconBgColor: string;
  }) => (
    <Card className="shadow-card hover:shadow-elegant transition-all duration-300">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="flex items-center gap-2">
          <div className={`w-8 h-8 rounded-lg ${iconBgColor} flex items-center justify-center`}>
            <div className="w-3 h-3 rounded-full bg-white" />
          </div>
          <CardTitle className="text-sm font-medium text-muted-foreground font-body">
            {title}
          </CardTitle>
        </div>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="text-3xl font-bold font-body">{value}</div>
        <div className="flex items-center gap-2">
          {trend === "up" ? (
            <div className="flex items-center gap-1 text-teal-500">
              <TrendingUp className="h-4 w-4" />
              <span className="text-sm font-medium">{growth}%</span>
            </div>
          ) : (
            <div className="flex items-center gap-1 text-red-500">
              <TrendingDown className="h-4 w-4" />
              <span className="text-sm font-medium">{growth}%</span>
            </div>
          )}
          <span className="text-sm text-muted-foreground">{todayValue}</span>
        </div>
        <Button variant="link" className="p-0 h-auto text-foreground hover:text-primary gap-1">
          View Report <ArrowRight className="h-4 w-4" />
        </Button>
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

  // Calculate total visitors for donut chart center
  const totalVisitors = visitorChartData.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="animate-fade-in space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">{t("dashboard.title")}</h1>
          <p className="text-muted-foreground mt-1">
            Here're the details of your analysis.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="gap-2">
            <Filter className="h-4 w-4" />
            Filter By
          </Button>
          <Button className="gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Stats Cards + Revenue Chart */}
      <div className="grid gap-4 lg:grid-cols-3">
        {/* Left side - 4 stat cards in 2x2 grid */}
        <div className="lg:col-span-2 grid gap-4 sm:grid-cols-2">
          <StatsCard
            title="Total Sales"
            value="$4,523,189"
            growth={10.2}
            trend="up"
            todayValue="+1,454.89 today"
            iconBgColor="bg-teal-500"
          />
          <StatsCard
            title="Total Orders"
            value="12,545"
            growth={20.2}
            trend="up"
            todayValue="+1,589 today"
            iconBgColor="bg-orange-500"
          />
          <StatsCard
            title="Total Visitors"
            value="8,344"
            growth={14.2}
            trend="down"
            todayValue="-89 today"
            iconBgColor="bg-teal-500"
          />
          <StatsCard
            title="Refunded"
            value="3,148"
            growth={12.6}
            trend="up"
            todayValue="+48 today"
            iconBgColor="bg-orange-500"
          />
        </div>

        {/* Right side - Revenue Chart */}
        <Card className="shadow-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle className="text-lg font-semibold font-body">Revenue</CardTitle>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-2xl font-bold font-body">$14,324</span>
                <Badge className="bg-teal-500 text-white hover:bg-teal-600">+12%</Badge>
              </div>
            </div>
            <Select defaultValue="2024">
              <SelectTrigger className="w-[80px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2024">2024</SelectItem>
                <SelectItem value="2023">2023</SelectItem>
                <SelectItem value="2022">2022</SelectItem>
              </SelectContent>
            </Select>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={revenueChartData} barGap={2}>
                <XAxis 
                  dataKey="month" 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                />
                <YAxis hide />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                />
                <Bar 
                  dataKey="desktop" 
                  fill={CHART_COLORS.desktop}
                  radius={[4, 4, 0, 0]}
                  name="Desktop"
                />
                <Bar 
                  dataKey="mobile" 
                  fill={CHART_COLORS.mobile}
                  radius={[4, 4, 0, 0]}
                  name="Mobile"
                />
              </BarChart>
            </ResponsiveContainer>
            <div className="flex items-center justify-center gap-6 mt-2">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-sm bg-orange-500" />
                <span className="text-sm text-muted-foreground">Desktop</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-sm bg-teal-500" />
                <span className="text-sm text-muted-foreground">Mobile</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Section - Recent Activity + Visitor Chart */}
      <div className="grid gap-4 lg:grid-cols-3">
        {/* Recent Activity Table */}
        <Card className="lg:col-span-2 shadow-card">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-xl font-semibold font-body">Recent Activity</CardTitle>
            <Select defaultValue="period">
              <SelectTrigger className="w-[100px]">
                <SelectValue placeholder="Period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="period">Period</SelectItem>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="week">This Week</SelectItem>
                <SelectItem value="month">This Month</SelectItem>
              </SelectContent>
            </Select>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>ID</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentActivityData.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9">
                          <AvatarFallback className="bg-muted text-muted-foreground text-sm">
                            {item.name.substring(0, 2)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-sm">{item.name}</p>
                          <p className="text-xs text-muted-foreground">{item.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(item.status)}</TableCell>
                    <TableCell className="text-muted-foreground">{item.orderId}</TableCell>
                    <TableCell className="text-muted-foreground">{item.date}</TableCell>
                    <TableCell className="text-right font-medium">{item.amount}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <p className="text-center text-sm text-muted-foreground mt-4">
              A list of your recent activity.
            </p>
          </CardContent>
        </Card>

        {/* Total Visitor Donut Chart */}
        <Card className="shadow-card">
          <CardHeader className="text-center pb-2">
            <CardTitle className="text-lg font-semibold font-body">Total Visitor - Chart</CardTitle>
            <CardDescription>January - June 2024</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            <div className="relative">
              <ResponsiveContainer width={220} height={220}>
                <PieChart>
                  <Pie
                    data={visitorChartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={100}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {visitorChartData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={DONUT_COLORS[index % DONUT_COLORS.length]}
                      />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              {/* Center text */}
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-bold font-body">1,125</span>
                <span className="text-sm text-muted-foreground">Visitors</span>
              </div>
            </div>
            <div className="text-center mt-4 space-y-1">
              <div className="flex items-center justify-center gap-1">
                <span className="text-sm">Trending up by 5.2% this month</span>
                <TrendingUp className="h-4 w-4 text-teal-500" />
              </div>
              <p className="text-xs text-muted-foreground">
                Showing total visitors for the last 6 months
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
