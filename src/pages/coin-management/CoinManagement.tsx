import { useEffect, useState, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RotateCcw, BarChart3, Users, History } from "lucide-react";
import { useCoinStore } from "@/stores/coinStore";
import coinService from "@/services/coinService";
import CoinStatistics from "./tabs/CoinStatistics";
import UserBalances from "./tabs/Transactions";
import AllTransactions from "./tabs/AllTransactions";
import { withPermission } from "@/hoc/withPermission";
import permissions from "@/lib/permissions";
import usePermissions from "@/hooks/use-permissions";

function CoinManagement() {
  const { t } = useTranslation();
  const store = useCoinStore();
  const { hasPermission } = usePermissions();
  const { statistics, transactions, pagination, isLoading } = store;

  const [currentPage, setCurrentPage] = useState(1);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchAllData = useCallback(async () => {
    try {
      store.setLoading(true);
      await Promise.all([
        coinService.fetchStatistics(),
        coinService.fetchTransactions(`page=${currentPage}`),
      ]);
    } catch (error) {
      console.error("Failed to fetch coin management data:", error);
      toast.error(t("coinManagement.messages.statisticsLoadError"));
    } finally {
      store.setLoading(false);
    }
  }, [currentPage, t]);

  useEffect(() => {
    fetchAllData();
  }, []);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchAllData();
    setIsRefreshing(false);
    toast.success(t("refreshSuccess"));
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardContent className="p-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-wide">
              {t("coinManagement.title")}
            </h1>
            <p className="text-muted-foreground mt-1">
              {t("coinManagement.subtitle")}
            </p>
          </div>
          <Button
            variant="outline"
            onClick={handleRefresh}
            disabled={isRefreshing}
          >
            <RotateCcw
              className={`h-4 w-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`}
            />
            {t("coinManagement.refresh")}
          </Button>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs defaultValue="statistics" className="space-y-4">
        <TabsList>
          <TabsTrigger value="statistics" className="gap-2">
            <BarChart3 className="h-4 w-4" />
            {t("coinManagement.tabs.statistics")}
          </TabsTrigger>
          <TabsTrigger value="userBalances" className="gap-2">
            <Users className="h-4 w-4" />
            {t("coinManagement.tabs.userBalances")}
          </TabsTrigger>
          {hasPermission(permissions.coins.view_transactions) && (
            <TabsTrigger value="allTransactions" className="gap-2">
              <History className="h-4 w-4" />
              {t("coinManagement.tabs.allTransactions")}
            </TabsTrigger>
          )}
        </TabsList>

        {/* Statistics Tab */}
        <TabsContent value="statistics">
          <CoinStatistics statistics={statistics} isLoading={isLoading} />
        </TabsContent>

        {/* User Balances Tab */}
        <TabsContent value="userBalances">
          <UserBalances
            topHolders={statistics?.top_holders || []}
            isLoading={isLoading}
            onRefresh={fetchAllData}
          />
        </TabsContent>

        {/* All Transactions Tab */}
        <TabsContent value="allTransactions">
          <AllTransactions
            transactions={transactions}
            isLoading={isLoading}
            pagination={pagination}
            onPageChange={handlePageChange}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default withPermission(CoinManagement, permissions.coins.view);
