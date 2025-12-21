import { useState, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ConfirmationModal from "@/components/modals/ConfirmationModal";
import { SupportTicket } from "@/stores/supportStore";
import supportService from "@/services/supportService";
import { toast } from "sonner";
import TicketsTab from "./tabs/TicketsTab";
import CloseTicketModal from "./modal/CloseTicketModal";
import ResolveTicketModal from "./modal/ResolveTicketModal";
import ChangePriorityModal from "./modal/ChangePriorityModal";
import ChangeStatusModal from "./modal/ChangeStatusModal";
import ViewTicketModal from "./modal/ViewTicketModal";
import CreateTicketModal from "./modal/CreateTicketModal";
import StatisticsTab from "./tabs/StatisticsTab";
import { useNavigate } from "react-router-dom";

function Support() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  // State for modals
  const [showCreateTicket, setShowCreateTicket] = useState(false);
  const [showViewTicket, setShowViewTicket] = useState(false);
  const [showChangeStatus, setShowChangeStatus] = useState(false);
  const [showChangePriority, setShowChangePriority] = useState(false);
  const [showResolve, setShowResolve] = useState(false);
  const [showClose, setShowClose] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // State for selected items
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(
    null
  );
  const [ticketToDelete, setTicketToDelete] = useState<SupportTicket | null>(
    null
  );

  // State for actions
  const [isDeleting, setIsDeleting] = useState(false);
  const [refreshTickets, setRefreshTickets] = useState<(() => void) | null>(
    null
  );

  // Handlers
  const handleCreateTicket = () => {
    navigate("/support/create-ticket");
    // setShowCreateTicket(true);
  };

  const handleViewTicket = (ticket: SupportTicket) => {
    setSelectedTicket(ticket);
    setShowViewTicket(true);
  };

  const handleChangeStatus = (ticket: SupportTicket) => {
    setSelectedTicket(ticket);
    setShowChangeStatus(true);
  };

  const handleChangePriority = (ticket: SupportTicket) => {
    setSelectedTicket(ticket);
    setShowChangePriority(true);
  };

  const handleResolveTicket = (ticket: SupportTicket) => {
    setSelectedTicket(ticket);
    setShowResolve(true);
  };

  const handleCloseTicket = (ticket: SupportTicket) => {
    setSelectedTicket(ticket);
    setShowClose(true);
  };

  const handleDeleteTicket = (ticket: SupportTicket) => {
    setTicketToDelete(ticket);
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = async () => {
    if (!ticketToDelete) return;

    setIsDeleting(true);
    try {
      await supportService.deleteItem(ticketToDelete.id);
      toast.success(t("support.messages.deleted"));
      refreshTickets?.();
      setShowDeleteConfirm(false);
      setTicketToDelete(null);
    } catch (error) {
      console.error("Error deleting ticket:", error);
      toast.error(t("support.messages.failedToDelete"));
    } finally {
      setIsDeleting(false);
    }
  };

  const handleTicketSuccess = () => {
    refreshTickets?.();
  };

  const handleSetRefreshTickets = useCallback((refreshFn: () => void) => {
    setRefreshTickets(() => refreshFn);
  }, []);

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">{t("support.title")}</h1>
          <p className="text-muted-foreground mt-1">{t("support.subtitle")}</p>
        </div>
        <Button onClick={handleCreateTicket}>
          <Plus className="mr-2 h-4 w-4" />
          {t("support.addTicket")}
        </Button>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="tickets" className="w-full">
        <TabsList className="flex items-center justify-start mb-4">
          <TabsTrigger value="tickets">{t("support.tabs.tickets")}</TabsTrigger>
          <TabsTrigger value="statistics">
            {t("support.tabs.statistics")}
          </TabsTrigger>
        </TabsList>

        {/* Tickets Tab */}
        <TabsContent value="tickets">
          <Card>
            <TicketsTab
              onView={handleViewTicket}
              onChangeStatus={handleChangeStatus}
              onChangePriority={handleChangePriority}
              onResolve={handleResolveTicket}
              onClose={handleCloseTicket}
              onDelete={handleDeleteTicket}
              onRefresh={handleSetRefreshTickets}
            />
          </Card>
        </TabsContent>

        {/* Statistics Tab */}
        <TabsContent value="statistics">
          <Card>
            <StatisticsTab />
          </Card>
        </TabsContent>
      </Tabs>

      {/* Modals */}
      <CreateTicketModal
        open={showCreateTicket}
        onClose={() => setShowCreateTicket(false)}
        onSuccess={handleTicketSuccess}
      />

      <ViewTicketModal
        open={showViewTicket}
        onClose={() => setShowViewTicket(false)}
        ticketId={selectedTicket?.id || null}
      />

      {selectedTicket && (
        <>
          <ChangeStatusModal
            open={showChangeStatus}
            onClose={() => setShowChangeStatus(false)}
            ticket={selectedTicket}
            onSuccess={handleTicketSuccess}
          />

          <ChangePriorityModal
            open={showChangePriority}
            onClose={() => setShowChangePriority(false)}
            ticket={selectedTicket}
            onSuccess={handleTicketSuccess}
          />

          <ResolveTicketModal
            open={showResolve}
            onClose={() => setShowResolve(false)}
            ticket={selectedTicket}
            onSuccess={handleTicketSuccess}
          />

          <CloseTicketModal
            open={showClose}
            onClose={() => setShowClose(false)}
            ticket={selectedTicket}
            onSuccess={handleTicketSuccess}
          />
        </>
      )}

      <ConfirmationModal
        open={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleConfirmDelete}
        title={t("support.messages.deleted")}
        description={`Are you sure you want to delete ticket ${ticketToDelete?.ticketNumber}?`}
        isProcessing={isDeleting}
      />
    </div>
  );
}

export default Support;
