import { TrendingDown, TrendingUp, LucideIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { FC } from "react";
import { useTranslation } from "react-i18next";
import { Skeleton } from "../ui/skeleton";

interface StatCardProps {
  title: string;
  value: string | number;
  change?: number;
  icon: LucideIcon;
  trend?: "up" | "down";
  type?: "number" | "string";
  superText?: string;
  description?: React.ReactNode;
  loading?: boolean;
}

const StatCard: FC<StatCardProps> = ({
  title,
  value,
  change,
  icon: Icon,
  trend,
  type,
  superText,
  description,
  loading = false,
}) => {
  const { t } = useTranslation();

  const getTrendColor = () => {
    if (trend === "up") return "border-l-success";
    if (trend === "down") return "border-l-destructive";
    return "border-l-primary";
  };

  return (
    <Card className={`relative border-l-4 ${getTrendColor()} hover:shadow-md transition-shadow duration-200`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
          <Icon className="h-4 w-4 text-primary" />
        </div>
      </CardHeader>

      <CardContent>
        <div className="flex items-baseline gap-2 mb-2">
          {loading ? (
            <Skeleton className="h-8 w-28" />
          ) : (
            <>
              <span className="text-2xl font-bold">
                {type === "number" && typeof value === "number"
                  ? value.toFixed(2)
                  : value}
              </span>
              {superText && (
                <span className="text-xs text-muted-foreground">
                  {superText}
                </span>
              )}
            </>
          )}
        </div>

        {description && (
          <div className="text-sm text-muted-foreground mb-2">
            {description}
          </div>
        )}

        {change !== undefined && (
          <div className="flex items-center gap-1 text-xs">
            {trend === "up" ? (
              <TrendingUp className="h-4 w-4 text-success" />
            ) : (
              <TrendingDown className="h-4 w-4 text-destructive" />
            )}
            <span className={`font-medium ${
              trend === "up" ? "text-success" : "text-destructive"
            }`}>
              {change > 0 ? "+" : ""}{change.toFixed(2)}%
            </span>
            <span className="text-muted-foreground">
              {t("dashboard.vsLastDay")}
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default StatCard;
