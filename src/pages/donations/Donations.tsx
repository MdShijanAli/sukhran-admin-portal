import { useState, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { Plus, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import DonationChannelsTab from "./tabs/DonationChannelsTab";
import DonationsTab from "./tabs/DonationsTab";
import ChannelFormModal from "./modal/ChannelFormModal";
import ViewDonationModal from "./modal/ViewDonationModal";
import FulfillCoinModal from "./modal/FulfillCoinModal";
import ConfirmationModal from "@/components/modals/ConfirmationModal";
import { DonationChannel, Donation } from "@/lib/types";
import donationChannelService from "@/services/donationChannelService";
import { toast } from "sonner";
import { useDonationStore } from "@/stores/donationStore";

function Donations() {
  const { t } = useTranslation();
  const donationStore = useDonationStore();

  // State for modals
  const [showChannelForm, setShowChannelForm] = useState(false);
  const [showDonationView, setShowDonationView] = useState(false);
  const [showFulfillCoin, setShowFulfillCoin] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // State for selected items
  const [selectedChannel, setSelectedChannel] =
    useState<DonationChannel | null>(null);
  const [selectedDonation, setSelectedDonation] = useState<Donation | null>(
    null
  );
  const [channelToDelete, setChannelToDelete] =
    useState<DonationChannel | null>(null);

  // State for actions
  const [isDeleting, setIsDeleting] = useState(false);
  const [refreshChannels, setRefreshChannels] = useState<(() => void) | null>(
    null
  );
  const [refreshDonations, setRefreshDonations] = useState<(() => void) | null>(
    null
  );

  // Handlers for donation channels
  const handleCreateChannel = () => {
    setSelectedChannel(null);
    setShowChannelForm(true);
  };

  const handleEditChannel = (channel: DonationChannel) => {
    setSelectedChannel(channel);
    setShowChannelForm(true);
  };

  const handleDeleteChannel = (channel: DonationChannel) => {
    setChannelToDelete(channel);
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = async () => {
    if (!channelToDelete) return;

    setIsDeleting(true);
    try {
      await donationChannelService.delete(channelToDelete.id);
      toast.success(t("donations.channels.messages.deleted"));
      refreshChannels?.();
      setShowDeleteConfirm(false);
      setChannelToDelete(null);
    } catch (error) {
      console.error("Error deleting channel:", error);
      toast.error(t("donations.channels.messages.failedToDelete"));
    } finally {
      setIsDeleting(false);
    }
  };

  const handleToggleStatus = async (channel: DonationChannel) => {
    try {
      await donationChannelService.toggleStatus(channel.id);
      toast.success(t("donations.channels.messages.statusToggled"));
      refreshChannels?.();
    } catch (error) {
      console.error("Error toggling status:", error);
      toast.error(t("donations.channels.messages.failedToUpdate"));
    }
  };

  const handleChannelFormSuccess = () => {
    refreshChannels?.();
  };

  // Handlers for donations
  const handleViewDonation = (donation: Donation) => {
    setSelectedDonation(donation);
    setShowDonationView(true);
  };

  // Handlers for coin fulfillment
  const handleFulfillCoins = (channel: DonationChannel) => {
    setSelectedChannel(channel);
    setShowFulfillCoin(true);
  };

  const handleFulfillSuccess = () => {
    refreshChannels?.();
    refreshDonations?.();
    // Refresh coin report if needed
  };

  const handleSetRefreshChannels = useCallback((refreshFn: () => void) => {
    setRefreshChannels(() => refreshFn);
  }, []);

  const handleSetRefreshDonations = useCallback((refreshFn: () => void) => {
    setRefreshDonations(() => refreshFn);
  }, []);

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">{t("donations.title")}</h1>
          <p className="text-muted-foreground mt-1">
            {t("donations.subtitle")}
          </p>
        </div>
        <Button onClick={handleCreateChannel}>
          <Plus className="mr-2 h-4 w-4" />
          {t("donations.channels.addChannel")}
        </Button>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="channels" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2 mb-4">
          <TabsTrigger value="channels">
            {t("donations.tabs.channels")}
          </TabsTrigger>
          <TabsTrigger value="donations">
            {t("donations.tabs.donations")}
          </TabsTrigger>
        </TabsList>

        {/* Donation Channels Tab */}
        <TabsContent value="channels">
          <Card>
            <DonationChannelsTab
              onEdit={handleEditChannel}
              onDelete={handleDeleteChannel}
              onToggleStatus={handleToggleStatus}
            />
          </Card>
        </TabsContent>

        {/* All Donations Tab */}
        <TabsContent value="donations">
          <Card>
            <DonationsTab onViewDetails={handleViewDonation} />
          </Card>
        </TabsContent>
      </Tabs>

      {/* Modals */}
      <ChannelFormModal
        open={showChannelForm}
        onClose={() => setShowChannelForm(false)}
        editData={selectedChannel || undefined}
        onSuccess={handleChannelFormSuccess}
      />

      <ViewDonationModal
        open={showDonationView}
        onClose={() => setShowDonationView(false)}
        donationId={selectedDonation?.id || null}
      />

      {selectedChannel && (
        <FulfillCoinModal
          open={showFulfillCoin}
          onClose={() => setShowFulfillCoin(false)}
          channelId={selectedChannel.id}
          channelName={selectedChannel.name}
          unfulfilledAmount={selectedChannel.remainingAmount}
          onSuccess={handleFulfillSuccess}
        />
      )}

      <ConfirmationModal
        open={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleConfirmDelete}
        title={t("donations.channels.delete.title")}
        description={t("donations.channels.delete.message")}
        isProcessing={isDeleting}
      />
    </div>
  );
}

export default Donations;
