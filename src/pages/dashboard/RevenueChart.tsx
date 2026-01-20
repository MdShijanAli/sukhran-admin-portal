import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState, memo } from "react";
import { useTranslation } from "react-i18next";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { ChartDataPoint } from "./Dashboard";

interface RevenueChartProps {
  monthlyRevenueChart: ChartDataPoint[];
  yearlyRevenueChart: ChartDataPoint[];
  weeklyRevenueChart: ChartDataPoint[];
  dailyRevenueChart: ChartDataPoint[];
  hourlyRevenueChart: ChartDataPoint[];
}

const RevenueChart = memo(
  ({
    monthlyRevenueChart,
    yearlyRevenueChart,
    weeklyRevenueChart,
    dailyRevenueChart,
    hourlyRevenueChart,
  }: RevenueChartProps) => {
    const { t } = useTranslation();
    const [chartPeriod, setChartPeriod] = useState<
      "monthly" | "yearly" | "weekly" | "daily"
    >("daily");

    return (
      <Card className="shadow-card">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle>{t("dashboard.revenueChart")}</CardTitle>
          <Select
            value={chartPeriod}
            onValueChange={(value: "monthly" | "yearly" | "weekly" | "daily") =>
              setChartPeriod(value)
            }
          >
            <SelectTrigger className="w-[130px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="daily">{t("dashboard.daily")}</SelectItem>
              <SelectItem value="weekly">{t("dashboard.weekly")}</SelectItem>
              <SelectItem value="monthly">{t("dashboard.monthly")}</SelectItem>
              <SelectItem value="yearly">{t("dashboard.yearly")}</SelectItem>
            </SelectContent>
          </Select>
        </CardHeader>
        <CardContent className="">
          <div className="rounded-lg bg-muted/30 p-4 border border-border">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart
                data={
                  chartPeriod === "monthly"
                    ? monthlyRevenueChart
                    : chartPeriod === "yearly"
                      ? yearlyRevenueChart
                      : chartPeriod === "weekly"
                        ? weeklyRevenueChart
                        : dailyRevenueChart?.length > 0
                          ? dailyRevenueChart
                          : hourlyRevenueChart
                }
                margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="hsl(var(--border))"
                />
                <XAxis
                  dataKey="name"
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--popover))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "6px",
                    boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                  }}
                  labelFormatter={(value, payload) => {
                    if (payload?.[0]?.payload?.timestamp) {
                      return payload[0].payload.timestamp;
                    }
                    return value;
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  name={t("dashboard.revenue")}
                  dot={{ fill: "#3b82f6", r: 3 }}
                  activeDot={{ r: 5 }}
                />
                <Line
                  type="monotone"
                  dataKey="orders"
                  stroke="#10b981"
                  strokeWidth={2}
                  name={t("dashboard.orders")}
                  dot={{ fill: "#10b981", r: 3 }}
                  activeDot={{ r: 5 }}
                />
                <Line
                  type="monotone"
                  dataKey="avg_orders"
                  stroke="#f59e0b"
                  strokeWidth={2}
                  name={t("dashboard.averageOrderValue")}
                  dot={{ fill: "#f59e0b", r: 3 }}
                  activeDot={{ r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    );
  },
);

RevenueChart.displayName = "RevenueChart";

export default RevenueChart;
