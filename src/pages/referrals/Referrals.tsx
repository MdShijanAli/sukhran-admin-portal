import React, { useState, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ReferralsTab from "./tabs/ReferralsTab";
import StatisticsTab from "./tabs/StatisticsTab";
import SettingsTab from "./tabs/SettingsTab";
import ViewReferralModal from "./modal/ViewReferralModal";
import UserReferralsModal from "./modal/UserReferralsModal";
import { Referral } from "@/lib/types";

function Referrals() {
  const { t } = useTranslation();

  // State for modals
  const [showReferralView, setShowReferralView] = useState(false);
  const [showUserReferrals, setShowUserReferrals] = useState(false);

  // State for selected items
  const [selectedReferral, setSelectedReferral] = useState<Referral | null>(
    null
  );
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);

  // State for actions
  const [refreshReferrals, setRefreshReferrals] = useState<(() => void) | null>(
    null
  );
  const [refreshStatistics, setRefreshStatistics] = useState<
    (() => void) | null
  >(null);

  // Handlers for referrals
  const handleViewReferral = (referral: Referral) => {
    setSelectedReferral(referral);
    setShowReferralView(true);
  };

  const handleViewUserReferrals = (userId: number) => {
    setSelectedUserId(userId);
    setShowUserReferrals(true);
  };

  const handleSetRefreshReferrals = useCallback((refreshFn: () => void) => {
    setRefreshReferrals(() => refreshFn);
  }, []);

  const handleSetRefreshStatistics = useCallback((refreshFn: () => void) => {
    setRefreshStatistics(() => refreshFn);
  }, []);

  const handleSettingsUpdate = () => {
    refreshStatistics?.();
  };

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">{t("referrals.title")}</h1>
          <p className="text-muted-foreground mt-1">
            {t("referrals.subtitle")}
          </p>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="referrals" className="w-full">
        <TabsList className="flex items-center justify-start mb-4">
          <TabsTrigger value="referrals">
            {t("referrals.tabs.referrals")}
          </TabsTrigger>
          <TabsTrigger value="statistics">
            {t("referrals.tabs.statistics")}
          </TabsTrigger>
          <TabsTrigger value="settings">
            {t("referrals.tabs.settings")}
          </TabsTrigger>
        </TabsList>

        {/* All Referrals Tab */}
        <TabsContent value="referrals">
          <ReferralsTab
            onViewDetails={handleViewReferral}
            onViewUserReferrals={handleViewUserReferrals}
            onSetRefresh={handleSetRefreshReferrals}
          />
        </TabsContent>

        {/* Statistics Tab */}
        <TabsContent value="statistics">
          <StatisticsTab onSetRefresh={handleSetRefreshStatistics} />
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings">
          <SettingsTab onSuccess={handleSettingsUpdate} />
        </TabsContent>
      </Tabs>

      {/* Modals */}
      <ViewReferralModal
        open={showReferralView}
        onClose={() => setShowReferralView(false)}
        referralId={selectedReferral?.id || null}
      />

      <UserReferralsModal
        open={showUserReferrals}
        onClose={() => setShowUserReferrals(false)}
        userId={selectedUserId}
      />
    </div>
  );
}

export default Referrals;
