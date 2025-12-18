import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { BaseModal } from "@/components/modals/BaseModal";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { SupportTicket } from "@/stores/supportStore";
import supportService from "@/services/supportService";
import { formatDate } from "@/lib/utils";
import {
  User,
  Mail,
  Phone,
  MessageSquare,
  Calendar,
  Tag,
  Flag,
  AlertCircle,
  ShoppingBag,
} from "lucide-react";

interface ViewTicketModalProps {
  open: boolean;
  onClose: (value: boolean) => void;
  ticketId: number | string | null;
}

export default function ViewTicketModal({
  open,
  onClose,
  ticketId,
}: ViewTicketModalProps) {
  const { t } = useTranslation();
  const [ticket, setTicket] = useState<SupportTicket | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchTicketDetails = async () => {
      if (!ticketId || !open) return;
      setIsLoading(true);
      try {
        const response = await supportService.fetchDetails(ticketId);
        const responseData = response as unknown as Record<string, unknown>;
        const ticketData =
          (responseData?.data as SupportTicket) ||
          (response as unknown as SupportTicket);
        setTicket(ticketData);
      } catch (error) {
        console.error("Error fetching ticket details:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTicketDetails();
  }, [ticketId, open]);

  const getStatusBadge = (status: string) => {
    const variants: Record<string, any> = {
      open: { variant: "default", className: "bg-yellow-500" },
      in_progress: { variant: "default", className: "bg-blue-500" },
      resolved: { variant: "default", className: "bg-green-500" },
      closed: { variant: "secondary", className: "" },
    };
    const config = variants[status] || variants.open;
    return (
      <Badge variant={config.variant} className={config.className}>
        {t(`support.tickets.status.${status}`)}
      </Badge>
    );
  };

  const getPriorityBadge = (priority: string) => {
    const variants: Record<string, any> = {
      urgent: "destructive",
      high: "default",
      medium: "secondary",
      low: "outline",
    };
    return (
      <Badge variant={variants[priority] || "secondary"}>
        {t(`support.tickets.priority.${priority}`)}
      </Badge>
    );
  };

  if (!ticket && !isLoading) return null;

  return (
    <BaseModal
      open={open}
      onOpenChange={onClose}
      title={t("support.view.title")}
      showSubmitButton={false}
      closeButtonText={t("close")}
      size="3xl"
    >
      {isLoading ? (
        <div className="space-y-4">
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-24 w-full" />
        </div>
      ) : ticket ? (
        <div className="space-y-4">
          {/* Ticket Header */}
          <Card className="p-4 bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">
                  {t("support.view.ticketNumber")}
                </p>
                <p className="text-2xl font-mono font-bold text-primary">
                  {ticket.ticketNumber}
                </p>
              </div>
              <div className="flex flex-col items-end gap-2">
                {getStatusBadge(ticket.status)}
                {getPriorityBadge(ticket.priority)}
              </div>
            </div>
          </Card>

          {/* Customer Information */}
          <Card className="p-4">
            <h4 className="font-semibold text-sm text-primary mb-3 flex items-center gap-2">
              <User className="w-4 h-4" />
              {t("support.view.customerInfo")}
            </h4>
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="w-6 h-6 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-lg">
                    {ticket.customer.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {t("support.view.customerName")}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center gap-2 p-2 border rounded-lg">
                  <Mail className="w-4 h-4 text-muted-foreground" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-muted-foreground">
                      {t("support.view.customerEmail")}
                    </p>
                    <p className="text-sm font-medium truncate">
                      {ticket.customer.email}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 p-2 border rounded-lg">
                  <Phone className="w-4 h-4 text-muted-foreground" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-muted-foreground">
                      {t("support.view.customerMobile")}
                    </p>
                    <p className="text-sm font-medium">
                      {ticket.customer.mobile}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Ticket Information */}
          <Card className="p-4">
            <h4 className="font-semibold text-sm text-primary mb-3 flex items-center gap-2">
              <MessageSquare className="w-4 h-4" />
              {t("support.view.ticketInfo")}
            </h4>
            <div className="space-y-3">
              <div className="p-3 border rounded-lg">
                <p className="text-xs text-muted-foreground mb-1">
                  {t("support.view.subject")}
                </p>
                <p className="font-semibold">{ticket.subject}</p>
              </div>
              <div className="p-3 border rounded-lg bg-muted/30">
                <p className="text-xs text-muted-foreground mb-2">
                  {t("support.view.description")}
                </p>
                <p className="text-sm whitespace-pre-wrap">
                  {/* {ticket.description} */}
                  {t("support.view.noDescription")}
                </p>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div className="p-2 border rounded-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <Tag className="w-3 h-3 text-muted-foreground" />
                    <p className="text-xs text-muted-foreground">
                      {t("support.view.category")}
                    </p>
                  </div>
                  <Badge variant="secondary">
                    {t(`support.tickets.category.${ticket.category}`)}
                  </Badge>
                </div>
                <div className="p-2 border rounded-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <Flag className="w-3 h-3 text-muted-foreground" />
                    <p className="text-xs text-muted-foreground">
                      {t("support.view.priority")}
                    </p>
                  </div>
                  {getPriorityBadge(ticket.priority)}
                </div>
                <div className="p-2 border rounded-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <AlertCircle className="w-3 h-3 text-muted-foreground" />
                    <p className="text-xs text-muted-foreground">
                      {t("support.view.status")}
                    </p>
                  </div>
                  {getStatusBadge(ticket.status)}
                </div>
              </div>
            </div>
          </Card>

          {/* Order Information */}
          {ticket.order && (
            <Card className="p-4">
              <h4 className="font-semibold text-sm text-primary mb-3 flex items-center gap-2">
                <ShoppingBag className="w-4 h-4" />
                {t("support.view.orderInfo")}
              </h4>
              <div className="p-3 border rounded-lg bg-blue-50 dark:bg-blue-950">
                <p className="text-xs text-muted-foreground mb-1">
                  {t("support.view.orderNumber")}
                </p>
                <p className="font-mono text-sm font-bold text-blue-600">
                  {ticket.order.orderNumber}
                </p>
              </div>
            </Card>
          )}

          {!ticket.order && (
            <Card className="p-4 bg-muted/30">
              <p className="text-sm text-muted-foreground text-center">
                {t("support.view.noOrder")}
              </p>
            </Card>
          )}

          {/* Additional Information */}
          <Card className="p-4">
            <h4 className="font-semibold text-sm text-primary mb-3 flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              {t("support.view.timeline")}
            </h4>
            <div className="space-y-3">
              <div className="flex items-center gap-2 p-3 border rounded-lg">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">
                    {t("support.view.createdAt")}
                  </p>
                  <p className="text-sm font-medium">
                    {formatDate(ticket.created_at)}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 p-3 border rounded-lg">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">
                    {t("support.view.updatedAt")}
                  </p>
                  <p className="text-sm font-medium">
                    {formatDate(ticket.updated_at)}
                  </p>
                </div>
              </div>
              <div className="p-3 border rounded-lg">
                <p className="text-xs text-muted-foreground mb-1">
                  {t("support.view.createdBy")}
                </p>
                <Badge variant="outline">
                  {ticket.createdByAdmin
                    ? t("support.tickets.createdBy.admin")
                    : t("support.tickets.createdBy.customer")}
                </Badge>
              </div>
            </div>
          </Card>
        </div>
      ) : null}
    </BaseModal>
  );
}
