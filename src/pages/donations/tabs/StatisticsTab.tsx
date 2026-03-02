import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DollarSign,
  Coins,
  Users,
  TrendingUp,
  Calendar,
  Award,
  Clock,
  CreditCard,
  Target,
  AlertCircle,
} from "lucide-react";
import donationService from "@/services/donationService";
import { useDonationStore } from "@/stores/donationStore";
import { formatCurrency, formatDate } from "@/lib/utils";

const StatisticsTab = () => {
  const { t } = useTranslation();
  const { statistics } = useDonationStore();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchStatistics();
  }, []);

  const fetchStatistics = async () => {
    setIsLoading(true);
    try {
      await donationService.getStatistics();
    } catch (error) {
      console.error("Error fetching statistics:", error);
    } finally {
      setIsLoading(false);
    }
  };

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
          {t("donations.statistics.noDataAvailable")}
        </p>
      </div>
    );
  }

  return (
    <div className="p-3 space-y-3">
      {/* Overview Section */}
      <div>
        <h3 className="text-lg  mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5" />
          {t("donations.statistics.overview")}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Total Donations */}
          <Card className="p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">
                  {t("donations.statistics.totalDonations")}
                </p>
                <p className="text-2xl  text-primary">
                  {formatCurrency(statistics.overview.totalDonations)}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {statistics.overview.totalDonationCount}{" "}
                  {t("donations.statistics.donations")}
                </p>
              </div>
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-primary" />
              </div>
            </div>
          </Card>

          {/* Total Donors */}
          <Card className="p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">
                  {t("donations.statistics.totalDonors")}
                </p>
                <p className="text-2xl  text-blue-600">
                  {statistics.overview.totalDonors}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {t("donations.statistics.uniqueDonors")}
                </p>
              </div>
              <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </Card>

          {/* Cash Donations */}
          <Card className="p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">
                  {t("donations.statistics.cashDonations")}
                </p>
                <p className="text-2xl  text-green-600">
                  {formatCurrency(statistics.overview.totalCashDonations)}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {t("donations.statistics.onlineAndCod")}
                </p>
              </div>
              <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center">
                <CreditCard className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </Card>

          {/* Coin Donations */}
          <Card className="p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">
                  {t("donations.statistics.coinDonations")}
                </p>
                <p className="text-2xl  text-amber-600">
                  {formatCurrency(statistics.overview.totalCoinDonations)}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {t("donations.statistics.coinBased")}
                </p>
              </div>
              <div className="w-12 h-12 rounded-full bg-amber-500/10 flex items-center justify-center">
                <Coins className="w-6 h-6 text-amber-600" />
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Secondary Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
        <Card className="p-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-orange-500/10 flex items-center justify-center">
              <Clock className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">
                {t("donations.statistics.pendingDonations")}
              </p>
              <p className="text-xl  text-orange-600">
                {formatCurrency(statistics.overview.pendingDonations)}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-purple-500/10 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">
                {t("donations.statistics.averageDonation")}
              </p>
              <p className="text-xl  text-purple-600">
                {formatCurrency(statistics.overview.averageDonation)}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center">
              <AlertCircle className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">
                {t("donations.statistics.failedDonations")}
              </p>
              <p className="text-xl  text-red-600">
                {formatCurrency(statistics.overview.failedDonations)}
              </p>
            </div>
          </div>
        </Card>
        <Card className="p-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center">
              <Users className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">
                {t("donations.statistics.totalDonationCount")}
              </p>
              <p className="text-xl  text-blue-600">
                {statistics.overview.totalDonationCount}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Coin Fulfillment & Time-Based */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        {/* Coin Fulfillment */}
        <Card className="p-3">
          <h4 className=" mb-4 flex items-center gap-2">
            <Coins className="w-5 h-5 text-amber-600" />
            {t("donations.statistics.coinFulfillmentStatus")}
          </h4>
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="text-center p-3 bg-amber-50 dark:bg-amber-950 rounded-lg">
                <p className="text-xs text-muted-foreground mb-1">
                  {t("donations.statistics.totalCoins")}
                </p>
                <p className="text-lg  text-amber-600">
                  {formatCurrency(
                    statistics.coinFulfillment.totalCoinDonations,
                  )}
                </p>
              </div>
              <div className="text-center p-3 bg-green-50 dark:bg-green-950 rounded-lg">
                <p className="text-xs text-muted-foreground mb-1">
                  {t("donations.statistics.fulfilled")}
                </p>
                <p className="text-lg  text-green-600">
                  {formatCurrency(statistics.coinFulfillment.totalFulfilled)}
                </p>
              </div>
            </div>
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">
                  {t("donations.statistics.fulfillmentProgress")}
                </span>
                <span className="text-sm  text-primary">
                  {statistics.coinFulfillment.fulfillmentPercentage}%
                </span>
              </div>
              <Progress
                value={statistics.coinFulfillment.fulfillmentPercentage}
                className="h-3"
              />
            </div>
            <div className="p-3 bg-orange-50 dark:bg-orange-950 rounded-lg">
              <p className="text-xs text-muted-foreground mb-1">
                {t("donations.statistics.companyOwes")}
              </p>
              <p className="text-xl  text-orange-600">
                {formatCurrency(statistics.coinFulfillment.companyOwes)}
              </p>
            </div>
          </div>
        </Card>

        {/* Time-Based Statistics */}
        <Card className="p-3">
          <h4 className=" mb-4 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-blue-600" />
            {t("donations.statistics.timeBasedDonations")}
          </h4>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium">
                    {t("donations.statistics.today")}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {t("donations.statistics.donationsToday")}
                  </p>
                </div>
              </div>
              <p className="text-xl  text-blue-600">
                {formatCurrency(statistics.timeBased.today)}
              </p>
            </div>

            <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-950 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium">
                    {t("donations.statistics.thisWeek")}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {t("donations.statistics.last7Days")}
                  </p>
                </div>
              </div>
              <p className="text-xl  text-green-600">
                {formatCurrency(statistics.timeBased.thisWeek)}
              </p>
            </div>

            <div className="flex items-center justify-between p-3 bg-purple-50 dark:bg-purple-950 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm font-medium">
                    {t("donations.statistics.thisMonth")}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {t("donations.statistics.last30Days")}
                  </p>
                </div>
              </div>
              <p className="text-xl  text-purple-600">
                {formatCurrency(statistics.timeBased.thisMonth)}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Payment Method Breakdown */}
      <Card className="p-3">
        <h4 className=" mb-4 flex items-center gap-2">
          <CreditCard className="w-5 h-5" />
          {t("donations.statistics.paymentMethodBreakdown")}
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {Object.entries(statistics.byPaymentMethod).map(([method, data]) => (
            <div
              key={method}
              className="p-3 border rounded-lg hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between mb-2">
                <Badge variant="outline" className="capitalize">
                  {method}
                </Badge>
                <Badge variant="secondary">
                  {data.count} {t("donations.statistics.donations")}
                </Badge>
              </div>
              <p className="text-2xl  text-primary">
                {formatCurrency(data.total)}
              </p>
            </div>
          ))}
        </div>
      </Card>

      {/* Top Channels */}
      <Card className="p-3">
        <h4 className=" mb-4 flex items-center gap-2">
          <Target className="w-5 h-5 text-primary" />
          {t("donations.statistics.topChannels")}
        </h4>
        <div className="space-y-3">
          {/* {statistics.topChannels.slice(0, 5).map((channel) => ( */}
          {statistics.topChannels.map((channel) => (
            <div
              key={channel.id}
              className="p-3 border rounded-lg hover:border-primary transition-colors"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex-1">
                  <h5 className="">{channel.name}</h5>
                  <div className="flex items-center gap-3 mt-1">
                    <Badge variant="secondary">
                      <Users className="w-3 h-3 mr-1" />
                      {channel.donorCount} {t("donations.statistics.donors")}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {t("donations.statistics.target")}:{" "}
                      {formatCurrency(channel.targetAmount)}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xl  text-primary">
                    {formatCurrency(channel.totalDonations)}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {channel.progressPercentage}%{" "}
                    {t("donations.statistics.complete")}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2 mb-3">
                <div className="text-center p-2 bg-green-50 dark:bg-green-950 rounded">
                  <p className="text-xs text-muted-foreground">
                    {t("donations.statistics.cash")}
                  </p>
                  <p className="text-sm  text-green-600">
                    {formatCurrency(channel.cashDonations)}
                  </p>
                </div>
                <div className="text-center p-2 bg-amber-50 dark:bg-amber-950 rounded">
                  <p className="text-xs text-muted-foreground">
                    {t("donations.statistics.coins")}
                  </p>
                  <p className="text-sm  text-amber-600">
                    {formatCurrency(channel.coinDonations)}
                  </p>
                </div>
                <div className="text-center p-2 bg-orange-50 dark:bg-orange-950 rounded">
                  <p className="text-xs text-muted-foreground">
                    {t("donations.statistics.unfulfilled")}
                  </p>
                  <p className="text-sm  text-orange-600">
                    {formatCurrency(channel.unfulfilledCoins)}
                  </p>
                </div>
              </div>
              <Progress value={channel.progressPercentage} className="h-2" />
            </div>
          ))}
        </div>
      </Card>

      {/* Top Donors & Recent Donations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        {/* Top Donors */}
        <Card className="p-3">
          <h4 className=" mb-4 flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-600" />
            {t("donations.statistics.topDonors")}
          </h4>
          <div className="space-y-3">
            {statistics.topDonors.map((donor, index) => (
              <div
                key={`${donor.userId}-${index}`}
                className="flex items-center gap-3 p-3 border rounded-lg hover:bg-accent transition-colors"
              >
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center  text-primary">
                  #{index + 1}
                </div>
                <div className="flex-1">
                  <p className="font-medium">{donor.name}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="secondary" className="text-xs">
                      {donor.donationCount}{" "}
                      {t("donations.statistics.donations")}
                    </Badge>
                    <span className="text-xs text-green-600">
                      {t("donations.statistics.cash")}:{" "}
                      {formatCurrency(donor.cashDonations)}
                    </span>
                    <span className="text-xs text-amber-600">
                      {t("donations.statistics.coins")}:{" "}
                      {formatCurrency(donor.coinDonations)}
                    </span>
                  </div>
                </div>
                <p className="text-lg  text-primary">
                  {formatCurrency(donor.totalDonations)}
                </p>
              </div>
            ))}
          </div>
        </Card>

        {/* Recent Donations */}
        <Card className="p-3">
          <h4 className=" mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5 text-blue-600" />
            {t("donations.statistics.recentDonations")}
          </h4>
          <div className="space-y-3">
            {statistics.recentDonations.map((donation) => (
              <div
                key={donation.id}
                className="p-3 border rounded-lg hover:bg-accent transition-colors"
              >
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <p className="font-medium">{donation.donor}</p>
                    <p className="text-xs text-muted-foreground">
                      {donation.channel}
                    </p>
                  </div>
                  <p className="text-lg  text-primary">
                    {formatCurrency(donation.amount)}
                  </p>
                </div>
                <div className="flex items-center justify-between">
                  <Badge
                    variant={donation.type === "cash" ? "default" : "secondary"}
                    className="capitalize"
                  >
                    {donation.type}
                    {donation.coins > 0 && ` (${donation.coins} coins)`}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {formatDate(donation.donatedAt)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Daily Trend */}
      <Card className="p-3">
        <h4 className=" mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-primary" />
          {t("donations.statistics.dailyTrend")}
        </h4>
        <div className="space-y-3">
          {statistics.dailyTrend.map((trend) => {
            const maxTotal = Math.max(
              ...statistics.dailyTrend.map((t) => t.total),
            );
            const widthPercentage = (trend.total / maxTotal) * 100;

            return (
              <div key={trend.date} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">{formatDate(trend.date)}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-green-600">
                      {t("donations.statistics.cash")}:{" "}
                      {formatCurrency(trend.cash_total)}
                    </span>
                    <span className="text-xs text-amber-600">
                      {t("donations.statistics.coins")}:{" "}
                      {formatCurrency(trend.coin_total)}
                    </span>
                    <Badge variant="secondary">
                      {trend.count} {t("donations.statistics.donations")}
                    </Badge>
                    <span className=" text-primary">
                      {formatCurrency(trend.total)}
                    </span>
                  </div>
                </div>
                <div className="h-8 bg-muted rounded-lg overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-green-500 to-primary rounded-lg flex items-center justify-end pr-3"
                    style={{ width: `${widthPercentage}%` }}
                  >
                    {widthPercentage > 20 && (
                      <span className="text-xs  text-white">
                        {formatCurrency(trend.total)}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
};

export default StatisticsTab;
