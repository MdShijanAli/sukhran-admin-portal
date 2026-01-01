import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { useReferralStore } from "@/stores/referralStore";
import referralService from "@/services/referralService";
import { useStatsController } from "@/hooks/use-api-controller";
import {
  Users,
  Clock,
  Lock,
  CheckCircle,
  XCircle,
  Coins,
  TrendingUp,
  AlertCircle,
  RefreshCw,
  DollarSign,
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { ReferralStatistics } from "@/lib/types";

interface StatisticsTabProps {
  onSetRefresh?: (refreshFn: () => void) => void;
}

const StatisticsTab = ({ onSetRefresh }: StatisticsTabProps) => {
  const { t } = useTranslation();
  const store = useReferralStore.getState();

  const { data, isLoading, refresh } = useStatsController({
    serviceFn: () => referralService.getStatistics(),
    store,
    dataKey: "statistics",
    setterKey: "setStatistics",
    autoFetch: true,
    cacheEnabled: true,
  });

  const statistics = data?.data as ReferralStatistics;

  useEffect(() => {
    onSetRefresh?.(refresh);
  }, [refresh]);

  if (isLoading) {
    return (
      <div className="p-6 space-y-3">
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-64 w-full" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (!statistics) {
    return (
      <div className="p-6 text-center">
        <AlertCircle className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
        <p className="text-muted-foreground">
          {t("referrals.statistics.noDataAvailable")}
        </p>
        <Button onClick={refresh} className="mt-4">
          <RefreshCw className="w-4 h-4 mr-2" />
          {t("referrals.statistics.refreshData")}
        </Button>
      </div>
    );
  }

  return (
    <div className="p-3 space-y-3">
      {/* Header with Refresh */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <TrendingUp className="w-5 h-5" />
          {t("referrals.statistics.overview")}
        </h3>
        <Button onClick={refresh} variant="outline" size="sm">
          <RefreshCw className="w-4 h-4 mr-2" />
          {t("referrals.statistics.refreshData")}
        </Button>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
        {/* Total Referrals */}
        <Card className="p-3">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-xs text-muted-foreground mb-1">
                {t("referrals.statistics.totalReferrals")}
              </p>
              <p className="text-2xl font-bold">
                {statistics?.overview?.total_referrals}
              </p>
            </div>
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Users className="w-6 h-6 text-primary" />
            </div>
          </div>
        </Card>

        {/* Pending */}
        <Card className="p-3">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-xs text-muted-foreground mb-1">
                {t("referrals.statistics.pending")}
              </p>
              <p className="text-2xl font-bold">
                {statistics?.overview?.pending}
              </p>
            </div>
            <div className="w-12 h-12 rounded-full bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center">
              <Clock className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
            </div>
          </div>
        </Card>

        {/* Locked */}
        <Card className="p-3">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-xs text-muted-foreground mb-1">
                {t("referrals.statistics.locked")}
              </p>
              <p className="text-2xl font-bold">
                {statistics?.overview?.locked}
              </p>
            </div>
            <div className="w-12 h-12 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
              <Lock className="w-6 h-6 text-orange-600 dark:text-orange-400" />
            </div>
          </div>
        </Card>

        {/* Credited */}
        <Card className="p-3">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-xs text-muted-foreground mb-1">
                {t("referrals.statistics.credited")}
              </p>
              <p className="text-2xl font-bold">
                {statistics?.overview?.credited}
              </p>
            </div>
            <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </Card>

        {/* Cancelled */}
        <Card className="p-3">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-xs text-muted-foreground mb-1">
                {t("referrals.statistics.cancelled")}
              </p>
              <p className="text-2xl font-bold">
                {statistics?.overview?.cancelled}
              </p>
            </div>
            <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
              <XCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
            </div>
          </div>
        </Card>
      </div>

      {/* Coins Distribution */}
      <Card className="p-4">
        <h4 className="font-semibold mb-4 flex items-center gap-2">
          <Coins className="w-5 h-5 text-amber-600" />
          {t("referrals.statistics.coinsDistribution")}
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="p-4 bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900/20 dark:to-amber-900/10 rounded-lg border border-amber-200 dark:border-amber-800">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-full bg-amber-500 flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">
                  {t("referrals.statistics.totalDistributed")}
                </p>
                <p className="text-2xl font-bold text-amber-700 dark:text-amber-400">
                  {statistics?.coins?.total_distributed}
                </p>
                <p className="text-xs text-muted-foreground">coins</p>
              </div>
            </div>
          </div>

          <div className="p-4 bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-900/10 rounded-lg border border-yellow-200 dark:border-yellow-800">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-full bg-yellow-500 flex items-center justify-center">
                <Clock className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">
                  {t("referrals.statistics.pendingCoins")}
                </p>
                <p className="text-2xl font-bold text-yellow-700 dark:text-yellow-400">
                  {statistics?.coins?.pending_coins}
                </p>
                <p className="text-xs text-muted-foreground">coins</p>
              </div>
            </div>
          </div>

          <div className="p-4 bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-900/10 rounded-lg border border-orange-200 dark:border-orange-800">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center">
                <Lock className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">
                  {t("referrals.statistics.lockedCoins")}
                </p>
                <p className="text-2xl font-bold text-orange-700 dark:text-orange-400">
                  {statistics?.coins?.locked_coins}
                </p>
                <p className="text-xs text-muted-foreground">coins</p>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Time-Based Metrics */}
      <Card className="p-4">
        <h4 className="font-semibold mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-blue-600" />
          {t("referrals.statistics.timeBasedMetrics")}
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {/* Today */}
          <div className="p-4 bg-muted/30 rounded-lg">
            <h5 className="font-semibold text-sm mb-3 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-blue-500"></div>
              {t("referrals.statistics.today")}
            </h5>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-xs text-muted-foreground">
                  {t("referrals.statistics.newReferrals")}
                </span>
                <span className="font-bold">
                  {statistics?.today?.new_referrals}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-muted-foreground">
                  {t("referrals.statistics.coinsCredited")}
                </span>
                <span className="font-bold text-amber-600">
                  {statistics?.today?.coins_credited}
                </span>
              </div>
            </div>
          </div>

          {/* This Week */}
          <div className="p-4 bg-muted/30 rounded-lg">
            <h5 className="font-semibold text-sm mb-3 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500"></div>
              {t("referrals.statistics.thisWeek")}
            </h5>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-xs text-muted-foreground">
                  {t("referrals.statistics.newReferrals")}
                </span>
                <span className="font-bold">
                  {statistics?.this_week?.new_referrals}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-muted-foreground">
                  {t("referrals.statistics.coinsCredited")}
                </span>
                <span className="font-bold text-amber-600">
                  {statistics?.this_week?.coins_credited}
                </span>
              </div>
            </div>
          </div>

          {/* This Month */}
          <div className="p-4 bg-muted/30 rounded-lg">
            <h5 className="font-semibold text-sm mb-3 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-purple-500"></div>
              {t("referrals.statistics.thisMonth")}
            </h5>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-xs text-muted-foreground">
                  {t("referrals.statistics.newReferrals")}
                </span>
                <span className="font-bold">
                  {statistics?.this_month?.new_referrals}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-muted-foreground">
                  {t("referrals.statistics.coinsCredited")}
                </span>
                <span className="font-bold text-amber-600">
                  {statistics?.this_month?.coins_credited}
                </span>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Program Settings */}
      <Card className="p-4">
        <h4 className="font-semibold mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-primary" />
          {t("referrals.statistics.programSettings")}
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
            <div className="flex-1">
              <p className="text-xs text-muted-foreground mb-1">
                {t("referrals.statistics.programStatus")}
              </p>
              <Badge
                variant={
                  statistics?.settings?.is_enabled ? "default" : "secondary"
                }
              >
                {statistics?.settings?.is_enabled
                  ? t("referrals.statistics.enabled")
                  : t("referrals.statistics.disabled")}
              </Badge>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
            <div className="flex-1">
              <p className="text-xs text-muted-foreground mb-1">
                {t("referrals.statistics.coinsPerReferral")}
              </p>
              <p className="text-xl font-bold text-amber-600">
                {statistics?.settings?.coins_per_referral}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
            <div className="flex-1">
              <p className="text-xs text-muted-foreground mb-1">
                {t("referrals.statistics.minOrderAmount")}
              </p>
              <p className="text-xl font-bold text-green-600">
                {formatCurrency(statistics?.settings?.min_order_amount)}
              </p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default StatisticsTab;
