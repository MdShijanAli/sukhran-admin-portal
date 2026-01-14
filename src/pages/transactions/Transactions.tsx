import { withPermission } from "@/hoc/withPermission";
import permissions from "@/lib/permissions";
import TransactionsTab from "./tabs/TransactionsTab";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Filter } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { toast } from "sonner";
import StatisticsTab from "./tabs/StatisticsTab";
import { BaseDatePicker } from "@/components/custom/BaseDatePicker";
import { DateRange } from "react-day-picker";

const Transactions = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState("transactions");
  const [dateRange, setDateRange] = useState<DateRange | undefined>();

  return (
    <div className="animate-fade-in">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">{t("transactions.title")}</h1>
            <p className="text-muted-foreground">
              {t("transactions.subtitle")}
            </p>
          </div>

          <div className="flex items-center gap-3">
            {activeTab === "statistics" && (
              <div>
                <BaseDatePicker
                  value={dateRange}
                  onChange={(range) => setDateRange(range)}
                />
              </div>
            )}

            <TabsList className="gap-2">
              <TabsTrigger value="transactions" className="gap-2">
                {t("transactions.tabs.transactions")}
              </TabsTrigger>
              <TabsTrigger value="statistics" className="gap-2">
                {t("transactions.tabs.statistics")}
              </TabsTrigger>
            </TabsList>
          </div>
        </div>

        <TabsContent value="statistics" className="mt-0">
          <StatisticsTab dateRange={dateRange} />
        </TabsContent>
        <TabsContent value="transactions" className="mt-0">
          <TransactionsTab />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default withPermission(Transactions, permissions.transactions.view);
