import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import {
  Coins,
  TrendingUp,
  AlertCircle,
  Award,
  Clock,
  Target,
  CheckCircle,
  XCircle,
  DollarSign,
  Users,
  RefreshCcw,
} from "lucide-react";
import donationService from "@/services/donationService";
import { useDonationStore } from "@/stores/donationStore";
import { formatCurrency, formatDate } from "@/lib/utils";

const CoinReportTab = () => {
  const { t } = useTranslation();
  const { coinReport } = useDonationStore();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchCoinReport();
  }, []);

  const fetchCoinReport = async () => {
    setIsLoading(true);
    try {
      await donationService.getCoinDonationReport();
    } catch (error) {
      console.error("Error fetching coin report:", error);
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

  if (!coinReport) {
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
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Coins className="w-5 h-5 text-amber-600" />
            {t("donations.coinReport.overview.title")}
          </h3>
          <p className="text-sm text-muted-foreground mt-1">
            {t("donations.coinReport.subtitle")}
          </p>
        </div>
        <Button onClick={fetchCoinReport} variant="outline" size="sm">
          <RefreshCcw className="w-4 h-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Overview Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {/* Total Coin Donations */}
        <Card className="p-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">
                {t("donations.coinReport.overview.totalCoins")}
              </p>
              <p className="text-2xl  text-amber-600">
                {formatCurrency(coinReport.overview.total_coin_donations)}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {coinReport.overview.total_coin_donation_count}{" "}
                {t("donations.statistics.donations")}
              </p>
            </div>
            <div className="w-12 h-12 rounded-full bg-amber-500/10 flex items-center justify-center">
              <Coins className="w-6 h-6 text-amber-600" />
            </div>
          </div>
        </Card>

        {/* Total Fulfilled */}
        <Card className="p-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">
                {t("donations.coinReport.overview.fulfilled")}
              </p>
              <p className="text-2xl  text-green-600">
                {formatCurrency(coinReport.overview.total_fulfilled)}
              </p>
              <p className="text-xs text-muted-foreground mt-1">Completed</p>
            </div>
            <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </Card>

        {/* Company Owes */}
        <Card className="p-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">
                {t("donations.coinReport.overview.companyOwes")}
              </p>
              <p className="text-2xl  text-orange-600">
                {formatCurrency(coinReport.overview.company_owes)}
              </p>
              <p className="text-xs text-muted-foreground mt-1">Pending</p>
            </div>
            <div className="w-12 h-12 rounded-full bg-orange-500/10 flex items-center justify-center">
              <XCircle className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* Secondary Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center">
              <AlertCircle className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">
                {t("donations.coinReport.overview.unfulfilled")}
              </p>
              <p className="text-xl  text-red-600">
                {formatCurrency(coinReport.overview.total_unfulfilled)}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-purple-500/10 flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">
                Average Coin Donation
              </p>
              <p className="text-xl  text-purple-600">
                {formatCurrency(coinReport.overview.average_coin_donation)}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* By Channel Section */}
      <Card className="p-4">
        <h4 className="font-semibold mb-4 flex items-center gap-2">
          <Target className="w-5 h-5 text-primary" />
          {t("donations.coinReport.byChannel.title")}
        </h4>
        <div className="space-y-4">
          {coinReport.by_channel.map((channel) => {
            const fulfillmentPercentage =
              channel.fulfillment.fulfillment_percentage;

            return (
              <div
                key={channel.id}
                className="p-4 border rounded-lg hover:border-primary transition-colors"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex-1">
                    <h5 className="font-semibold text-lg">{channel.name}</h5>
                    {channel.description && (
                      <p className="text-xs text-muted-foreground mt-1">
                        {channel.description}
                      </p>
                    )}
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="secondary">
                        <Coins className="w-3 h-3 mr-1" />
                        {channel.statistics.coin_donation_count}{" "}
                        {t("donations.statistics.donations")}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {t("donations.statistics.target")}:{" "}
                        {formatCurrency(channel.target.target_amount)}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xl  text-amber-600">
                      {formatCurrency(channel.statistics.total_coin_donations)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {channel.target.progress_percentage}%{" "}
                      {t("donations.statistics.complete")}
                    </p>
                  </div>
                </div>

                {/* Fulfillment Status */}
                <div className="grid grid-cols-3 gap-2 mb-3">
                  <div className="text-center p-2 bg-green-50 dark:bg-green-950 rounded">
                    <p className="text-xs text-muted-foreground">
                      {t("donations.coinReport.overview.fulfilled")}
                    </p>
                    <p className="text-sm  text-green-600">
                      {formatCurrency(channel.fulfillment.fulfilled_amount)}
                    </p>
                  </div>
                  <div className="text-center p-2 bg-orange-50 dark:bg-orange-950 rounded">
                    <p className="text-xs text-muted-foreground">
                      {t("donations.coinReport.overview.unfulfilled")}
                    </p>
                    <p className="text-sm  text-orange-600">
                      {formatCurrency(channel.fulfillment.unfulfilled_amount)}
                    </p>
                  </div>
                  <div className="text-center p-2 bg-red-50 dark:bg-red-950 rounded">
                    <p className="text-xs text-muted-foreground">
                      {t("donations.coinReport.overview.companyOwes")}
                    </p>
                    <p className="text-sm  text-red-600">
                      {formatCurrency(channel.fulfillment.company_owes)}
                    </p>
                  </div>
                </div>

                {/* Progress Bar */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">
                      {t("donations.coinReport.byChannel.progress")}
                    </span>
                    <span className="text-sm  text-primary">
                      {fulfillmentPercentage}%
                    </span>
                  </div>
                  <Progress value={fulfillmentPercentage} className="h-2" />
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Recent Donations & Top Donors */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        {/* Recent Coin Donations */}
        <Card className="p-4">
          <h4 className="font-semibold mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5 text-blue-600" />
            {t("donations.coinReport.recentDonations.title")}
          </h4>
          <div className="space-y-3">
            {coinReport.recent_donations.map((donation) => (
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
                  <div className="text-right">
                    <p className="text-lg  text-amber-600">
                      {formatCurrency(donation.value)}
                    </p>
                    <Badge variant="secondary" className="text-xs">
                      <Coins className="w-3 h-3 mr-1" />
                      {donation.coins_donated}
                    </Badge>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">
                    {formatDate(donation.donated_at)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Top Coin Donors */}
        <Card className="p-4">
          <h4 className="font-semibold mb-4 flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-600" />
            {t("donations.coinReport.topDonors.title")}
          </h4>
          <div className="space-y-3">
            {coinReport.top_donors.map((donor, index) => (
              <div
                key={`${donor.userId}-${index}`}
                className="flex items-center gap-3 p-3 border rounded-lg hover:bg-accent transition-colors"
              >
                <div className="w-10 h-10 rounded-full bg-amber-500/10 flex items-center justify-center  text-amber-600">
                  #{index + 1}
                </div>
                <div className="flex-1">
                  <p className="font-medium">{donor.name}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="secondary" className="text-xs">
                      {donor.donation_count}{" "}
                      {t("donations.statistics.donations")}
                    </Badge>
                    <span className="text-xs text-amber-600">
                      <Coins className="w-3 h-3 inline mr-1" />
                      {donor.total_coins_donated}
                    </span>
                  </div>
                </div>
                <p className="text-lg  text-primary">
                  {formatCurrency(donor.total_value)}
                </p>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Fulfillment Summary */}
      <Card className="p-4 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950 dark:to-orange-950 border-amber-200 dark:border-amber-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-amber-500/20 flex items-center justify-center">
              <AlertCircle className="w-6 h-6 text-amber-600" />
            </div>
            <div>
              <h4 className="font-semibold text-lg">
                Action Required: Fulfill Pending Coins
              </h4>
              <p className="text-sm text-muted-foreground">
                Total unfulfilled coin donations need to be processed
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs text-muted-foreground mb-1">
              Amount to Fulfill
            </p>
            <p className="text-2xl  text-orange-600">
              {formatCurrency(coinReport.overview.total_unfulfilled)}
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default CoinReportTab;
