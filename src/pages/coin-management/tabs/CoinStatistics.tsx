import { useTranslation } from "react-i18next";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { CoinStatisticsResponse } from "@/lib/types";
import {
  Coins,
  TrendingUp,
  TrendingDown,
  Users,
  Lock,
  Unlock,
} from "lucide-react";
import { formatNumberWithCommas } from "@/lib/utils";

interface CoinStatisticsProps {
  statistics: CoinStatisticsResponse | null;
  isLoading: boolean;
}

export default function CoinStatistics({
  statistics,
  isLoading,
}: CoinStatisticsProps) {
  const { t } = useTranslation();

  if (isLoading) {
    return (
      <div className="space-y-3">
        <div className="grid gap-3 md:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i}>
              <CardHeader className="pb-2">
                <Skeleton className="h-4 w-24" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-32" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (!statistics) {
    return (
      <Card className="p-12">
        <div className="text-center text-muted-foreground">
          {t("coinManagement.statistics.noData")}
        </div>
      </Card>
    );
  }

  const {
    overview,
    today,
    this_week,
    this_month,
    all_time,
    top_holders,
    recent_transactions,
  } = statistics;

  return (
    <div className="space-y-3">
      {/* Overview Cards */}
      <div className="grid gap-3 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t("coinManagement.statistics.totalCoins")}
            </CardTitle>
            <Coins className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl ">
              {formatNumberWithCommas(overview.total_coins_in_circulation)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {overview.coin_value}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t("coinManagement.statistics.lockedCoins")}
            </CardTitle>
            <Lock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl ">
              {formatNumberWithCommas(overview.total_locked_coins)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t("coinManagement.statistics.availableCoins")}
            </CardTitle>
            <Unlock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl ">
              {formatNumberWithCommas(overview.total_available_coins)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t("coinManagement.statistics.usersWithCoins")}
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl ">
              {formatNumberWithCommas(overview.users_with_coins, {
                minDigit: 0,
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Period Statistics */}
      <div className="grid gap-3 md:grid-cols-4">
        {[
          { label: t("coinManagement.statistics.today"), data: today },
          { label: t("coinManagement.statistics.thisWeek"), data: this_week },
          { label: t("coinManagement.statistics.thisMonth"), data: this_month },
          { label: t("coinManagement.statistics.allTime"), data: all_time },
        ].map((period, index) => (
          <Card key={index}>
            <CardHeader>
              <CardTitle className="text-sm font-medium">
                {period.label}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  {t("coinManagement.statistics.earned")}
                </span>
                <div className="flex items-center gap-1 text-green-600">
                  <TrendingUp className="h-3 w-3" />
                  <span className="font-medium">
                    {formatNumberWithCommas(period.data.earned)}
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  {t("coinManagement.statistics.spent")}
                </span>
                <div className="flex items-center gap-1 text-red-600">
                  <TrendingDown className="h-3 w-3" />
                  <span className="font-medium">
                    {formatNumberWithCommas(period.data.spent)}
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between pt-2 border-t">
                <span className="text-sm font-medium">
                  {t("coinManagement.statistics.net")}
                </span>
                <span className="">
                  {formatNumberWithCommas(period.data.net)}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Top Holders and Recent Transactions */}
      <div className="grid gap-3 md:grid-cols-2">
        {/* Top Holders */}
        <Card>
          <CardHeader>
            <CardTitle>{t("coinManagement.statistics.topHolders")}</CardTitle>
            <CardDescription>
              Users with the highest coin balances
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {top_holders.slice(0, 5).map((holder, index) => (
                <div
                  key={holder.user.id}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary ">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium">{holder.user.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {holder.user.email}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1  text-primary">
                      <Coins className="h-4 w-4" />
                      {formatNumberWithCommas(holder.total_coins)}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Available:{" "}
                      {formatNumberWithCommas(holder.available_coins)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Transactions */}
        <Card>
          <CardHeader>
            <CardTitle>
              {t("coinManagement.statistics.recentTransactions")}
            </CardTitle>
            <CardDescription>Latest coin transactions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recent_transactions.slice(0, 5).map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex items-start justify-between p-3 border rounded-lg"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-medium">{transaction.user.name}</p>
                      <Badge
                        variant={
                          transaction.type === "earned"
                            ? "default"
                            : "secondary"
                        }
                      >
                        {transaction.type}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {transaction.description}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {new Date(transaction.created_at).toLocaleString()}
                    </p>
                  </div>
                  <div
                    className={` ${
                      transaction.type === "earned"
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {transaction.type === "earned" ? "+" : "-"}
                    {formatNumberWithCommas(transaction.amount)}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
