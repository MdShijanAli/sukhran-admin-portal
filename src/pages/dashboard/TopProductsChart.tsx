import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTranslation } from "react-i18next";
import { memo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface TopPerformerData {
  id: string;
  name: string;
  sales: number;
  revenue: string;
}

interface TopProductsChartProps {
  productData: TopPerformerData[];
  packageData: TopPerformerData[];
}

const TopProductsChart = memo(
  ({ productData, packageData }: TopProductsChartProps) => {
    const { t } = useTranslation();
    const [chartType, setChartType] = useState<"product" | "package">(
      "product"
    );

    const currentData = chartType === "product" ? productData : packageData;
    const hasData = currentData && currentData.length > 0;

    return (
      <Card className="shadow-card">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle>{t("dashboard.topProducts")}</CardTitle>
          <Select
            value={chartType}
            onValueChange={(value: "product" | "package") =>
              setChartType(value)
            }
          >
            <SelectTrigger className="w-[130px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="product">{t("dashboard.product")}</SelectItem>
              <SelectItem value="package">{t("dashboard.package")}</SelectItem>
            </SelectContent>
          </Select>
        </CardHeader>
        <CardContent>
          {!hasData ? (
            <div className="flex items-center justify-center h-[300px] text-muted-foreground">
              {t("dashboard.noDataFound")}
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={currentData}>
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
                  name={t("dashboard.sales")}
                />
                <Bar
                  dataKey="revenue"
                  fill="green"
                  radius={[8, 8, 0, 0]}
                  name={t("dashboard.revenue")}
                />
              </BarChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>
    );
  }
);

TopProductsChart.displayName = "TopProductsChart";

export default TopProductsChart;
