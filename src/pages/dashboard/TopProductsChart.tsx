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
import { TopProducts } from "./Dashboard";

interface TopProductsChartProps {
  productData: TopProducts[];
  packageData: TopProducts[];
}

const TopProductsChart = memo(
  ({ productData, packageData }: TopProductsChartProps) => {
    const { t } = useTranslation();
    const [chartType, setChartType] = useState<"product" | "package">(
      "product",
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
        <CardContent className="">
          {!hasData ? (
            <div className="flex items-center justify-center h-[300px] text-muted-foreground">
              {t("dashboard.noDataFound")}
            </div>
          ) : (
            <div className="rounded-lg bg-muted/30 p-4 border border-border">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={currentData}
                  margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="hsl(var(--border))"
                  />
                  <XAxis
                    dataKey="name"
                    angle={-45}
                    textAnchor="end"
                    height={100}
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
                  />
                  <Bar
                    dataKey="sales"
                    fill="#3b82f6"
                    radius={[8, 8, 0, 0]}
                    name={t("dashboard.sales")}
                  />
                  <Bar
                    dataKey="revenue"
                    fill="#10b981"
                    radius={[8, 8, 0, 0]}
                    name={t("dashboard.revenue")}
                  />
                  <Bar
                    dataKey="average_order_value"
                    fill="#f59e0b"
                    radius={[8, 8, 0, 0]}
                    name={t("dashboard.averageOrderValue")}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </CardContent>
      </Card>
    );
  },
);

TopProductsChart.displayName = "TopProductsChart";

export default TopProductsChart;
