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

interface ChartDataPoint {
  name: string;
  revenue: string;
  orders: number;
}

interface RevenueChartProps {
  monthlyRevenueChart: ChartDataPoint[];
  yearlyRevenueChart: ChartDataPoint[];
}

const RevenueChart = memo(
  ({ monthlyRevenueChart, yearlyRevenueChart }: RevenueChartProps) => {
    const { t } = useTranslation();
    const [chartPeriod, setChartPeriod] = useState<"monthly" | "yearly">(
      "monthly"
    );

    return (
      <Card className="shadow-card">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle>{t("dashboard.revenueChart")}</CardTitle>
          <Select
            value={chartPeriod}
            onValueChange={(value: "monthly" | "yearly") =>
              setChartPeriod(value)
            }
          >
            <SelectTrigger className="w-[130px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="monthly">{t("dashboard.monthly")}</SelectItem>
              <SelectItem value="yearly">{t("dashboard.yearly")}</SelectItem>
            </SelectContent>
          </Select>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart
              data={
                chartPeriod === "monthly"
                  ? monthlyRevenueChart
                  : yearlyRevenueChart
              }
            >
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
                name={t("dashboard.revenue")}
              />
              <Line
                type="monotone"
                dataKey="orders"
                stroke="hsl(var(--success))"
                strokeWidth={2}
                name={t("dashboard.orders")}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    );
  }
);

RevenueChart.displayName = "RevenueChart";

export default RevenueChart;
