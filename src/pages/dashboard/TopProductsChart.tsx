import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { topProducts } from "@/data/mockData";
import { useTranslation } from "react-i18next";
import { memo } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const TopProductsChart = memo(() => {
  const { t } = useTranslation();
  return (
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
  );
});

TopProductsChart.displayName = "TopProductsChart";

export default TopProductsChart;
