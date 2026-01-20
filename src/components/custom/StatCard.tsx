import { TrendingDown, TrendingUp, LucideIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { FC } from "react";
import { useTranslation } from "react-i18next";

interface StatCardProps {
  title: string;
  value: string | number;
  change?: number;
  icon: LucideIcon;
  trend?: "up" | "down";
  type?: "number" | "string";
}

const StatCard: FC<StatCardProps> = ({
  title,
  value,
  change,
  icon: Icon,
  trend,
  type,
}) => {
  const { t } = useTranslation();

  return (
    <Card className="shadow-card hover:shadow-elegant transition-all duration-300">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <Icon className="h-5 w-5 text-primary" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {type === "number" && typeof value === "number"
            ? value.toFixed(2)
            : value}
        </div>
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
              {change.toFixed(2)}%
            </span>
            <span className="text-xs text-muted-foreground ml-1">
              {t("dashboard.vsLastDay")}
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default StatCard;
