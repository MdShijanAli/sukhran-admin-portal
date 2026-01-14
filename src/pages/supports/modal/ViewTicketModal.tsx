import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { BaseModal } from "@/components/modals/BaseModal";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import supportService from "@/services/supportService";
import { formatDate } from "@/lib/utils";
import {
  User,
  Mail,
  Phone,
  MessageSquare,
  Tag,
  Flag,
  AlertCircle,
  ShoppingBag,
  FileText,
  Clock,
  CheckCircle2,
  XCircle,
} from "lucide-react";

interface TimelineItem {
  id: number;
  action: string;
  oldValue: string | null;
  newValue: string;
  notes: string;
  updatedBy: {
    id: number;
    name: string;
  };
  created_at: string;
}

interface TicketDetails {
  ticket: {
    id: number;
    ticketNumber: string;
    category: string;
    subject: string;
    description: string;
    status: string;
    priority: string;
    resolutionNote: string | null;
    createdByAdmin: boolean;
    resolvedAt: string | null;
    closedAt: string | null;
    created_at: string;
    updated_at: string;
  };
  customer: {
    id: number;
    name: string;
    email: string;
    mobile: string;
  };
  order: {
    id: number;
    orderNumber: string;
  } | null;
  attachments: Array<{
    id: number;
    fileName: string;
    fileUrl: string;
    fileSize: string;
  }>;
  timeline: TimelineItem[];
}

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
  const [details, setDetails] = useState<TicketDetails | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchTicketDetails = async () => {
      if (!ticketId || !open) return;
      setIsLoading(true);
      try {
        const response = await supportService.fetchDetails(ticketId);
        const data = (response as any)?.data || response;
        setDetails(data);
      } catch (error) {
        console.error("Error fetching ticket details:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTicketDetails();
  }, [ticketId, open]);

  const getBadge = (
    type: "status" | "priority",
    value: string
  ): JSX.Element => {
    if (type === "status") {
      const config: Record<string, { variant: any; className: string }> = {
        open: { variant: "default", className: "bg-yellow-500" },
        in_progress: { variant: "default", className: "bg-blue-500" },
        resolved: { variant: "default", className: "bg-green-500" },
        closed: { variant: "secondary", className: "" },
      };
      const { variant, className } = config[value] || config.open;
      return (
        <Badge variant={variant} className={className}>
          {t(`support.tickets.status.${value}`)}
        </Badge>
      );
    } else {
      const variants: Record<string, any> = {
        urgent: "destructive",
        high: "default",
        medium: "secondary",
        low: "outline",
      };
      return (
        <Badge variant={variants[value] || "secondary"}>
          {t(`support.tickets.priority.${value}`)}
        </Badge>
      );
    }
  };

  const getTimelineIcon = (action: string) => {
    const icons: Record<string, JSX.Element> = {
      "Ticket Created": <MessageSquare className="w-4 h-4" />,
      "Status Changed": <AlertCircle className="w-4 h-4" />,
      "Priority Changed": <Flag className="w-4 h-4" />,
      "Ticket Resolved": <CheckCircle2 className="w-4 h-4" />,
      "Ticket Closed": <XCircle className="w-4 h-4" />,
      "Ticket Reopened": <Clock className="w-4 h-4" />,
    };
    return icons[action] || <AlertCircle className="w-4 h-4" />;
  };

  if (!details && !isLoading) return null;

  const { ticket, customer, order, attachments, timeline } = details || {};

  return (
    <BaseModal
      open={open}
      onOpenChange={onClose}
      title={t("support.view.title")}
      showSubmitButton={false}
      closeButtonText={t("close")}
      size="4xl"
    >
      {isLoading ? (
        <div className="space-y-3">
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-48 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      ) : ticket && customer ? (
        <div className="space-y-3">
          {/* Header Card */}
          <Card className="p-6 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border-primary/20">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">
                  {t("support.view.ticketNumber")}
                </p>
                <p className="text-3xl font-mono font-bold text-primary">
                  {ticket.ticketNumber}
                </p>
              </div>
              <div className="flex flex-col items-end gap-3">
                {getBadge("status", ticket.status)}
                {getBadge("priority", ticket.priority)}
              </div>
            </div>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
            {/* Customer Information */}
            <Card className="p-3">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 rounded-lg bg-blue-500/10">
                  <User className="w-5 h-5 text-blue-600" />
                </div>
                <h4 className="font-semibold text-lg">
                  {t("support.view.customerInfo")}
                </h4>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold text-lg">
                    {customer.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-base">{customer.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {t("support.view.customer")}
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-center gap-3 p-3 border rounded-lg hover:bg-muted/30 transition-colors">
                    <Mail className="w-4 h-4 text-muted-foreground" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-muted-foreground">
                        {t("support.view.customerEmail")}
                      </p>
                      <p className="text-sm font-medium truncate">
                        {customer.email}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 border rounded-lg hover:bg-muted/30 transition-colors">
                    <Phone className="w-4 h-4 text-muted-foreground" />
                    <div className="flex-1">
                      <p className="text-xs text-muted-foreground">
                        {t("support.view.customerMobile")}
                      </p>
                      <p className="text-sm font-medium">{customer.mobile}</p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Ticket Details */}
            <Card className="p-3">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 rounded-lg bg-purple-500/10">
                  <MessageSquare className="w-5 h-5 text-purple-600" />
                </div>
                <h4 className="font-semibold text-lg">
                  {t("support.view.ticketDetails")}
                </h4>
              </div>
              <div className="space-y-3">
                <div className="grid grid-cols-3 gap-3">
                  <div className="p-3 border rounded-lg text-center hover:border-primary transition-colors">
                    <Tag className="w-4 h-4 text-muted-foreground mx-auto mb-1" />
                    <p className="text-xs text-muted-foreground mb-1">
                      {t("support.view.category")}
                    </p>
                    <Badge variant="secondary" className="text-xs">
                      {t(`support.tickets.category.${ticket.category}`)}
                    </Badge>
                  </div>
                  <div className="p-3 border rounded-lg text-center hover:border-primary transition-colors">
                    <Flag className="w-4 h-4 text-muted-foreground mx-auto mb-1" />
                    <p className="text-xs text-muted-foreground mb-1">
                      {t("support.view.priority")}
                    </p>
                    {getBadge("priority", ticket.priority)}
                  </div>
                  <div className="p-3 border rounded-lg text-center hover:border-primary transition-colors">
                    <AlertCircle className="w-4 h-4 text-muted-foreground mx-auto mb-1" />
                    <p className="text-xs text-muted-foreground mb-1">
                      {t("support.view.status")}
                    </p>
                    {getBadge("status", ticket.status)}
                  </div>
                </div>
                <Separator />
                <div className="space-y-3">
                  <div>
                    <p className="text-xs font-medium text-muted-foreground mb-1">
                      {t("support.view.createdBy")}
                    </p>
                    <Badge variant="outline" className="font-normal">
                      {ticket.createdByAdmin
                        ? t("support.tickets.createdBy.admin")
                        : t("support.tickets.createdBy.customer")}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <p className="text-muted-foreground mb-1">
                        {t("support.view.createdAt")}
                      </p>
                      <p className="font-medium">
                        {formatDate(ticket.created_at)}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground mb-1">
                        {t("support.view.updatedAt")}
                      </p>
                      <p className="font-medium">
                        {formatDate(ticket.updated_at)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Subject & Description */}
          <Card className="p-3">
            <div className="space-y-3">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-2">
                  {t("support.view.subject")}
                </p>
                <p className="text-base font-semibold">{ticket.subject}</p>
              </div>
              <Separator />
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-2">
                  {t("support.view.description")}
                </p>
                <p className="text-sm leading-relaxed whitespace-pre-wrap bg-muted/30 p-4 rounded-lg">
                  {ticket.description || t("support.view.noDescription")}
                </p>
              </div>
            </div>
          </Card>

          {/* Resolution Note */}
          {ticket.resolutionNote && (
            <Card className="p-3 bg-green-50/50 dark:bg-green-950/20 border-green-200 dark:border-green-800">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-green-500/10">
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-green-900 dark:text-green-100 mb-2">
                    {t("support.view.resolutionNote")}
                  </p>
                  <p className="text-sm text-green-800 dark:text-green-200 leading-relaxed">
                    {ticket.resolutionNote}
                  </p>
                  {ticket.resolvedAt && (
                    <p className="text-xs text-green-600 dark:text-green-400 mt-2">
                      {t("support.view.resolvedAt")}:{" "}
                      {formatDate(ticket.resolvedAt)}
                    </p>
                  )}
                </div>
              </div>
            </Card>
          )}

          {/* Order Information */}
          {order ? (
            <Card className="p-3">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 rounded-lg bg-amber-500/10">
                  <ShoppingBag className="w-5 h-5 text-amber-600" />
                </div>
                <h4 className="font-semibold text-lg">
                  {t("support.view.orderInfo")}
                </h4>
              </div>
              <div className="p-4 border-2 border-dashed rounded-lg bg-amber-50/50 dark:bg-amber-950/20">
                <p className="text-xs text-muted-foreground mb-1">
                  {t("support.view.orderNumber")}
                </p>
                <p className="font-mono text-lg font-bold text-amber-600">
                  {order.orderNumber}
                </p>
              </div>
            </Card>
          ) : null}

          {/* Attachments */}
          {attachments && attachments.length > 0 && (
            <Card className="p-3">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 rounded-lg bg-indigo-500/10">
                  <FileText className="w-5 h-5 text-indigo-600" />
                </div>
                <h4 className="font-semibold text-lg">
                  {t("support.view.attachments")}
                </h4>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {attachments.map((file) => (
                  <a
                    key={file.id}
                    href={file.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 border rounded-lg hover:bg-muted/50 hover:border-primary transition-all"
                  >
                    <FileText className="w-5 h-5 text-muted-foreground" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {file.fileName}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {file.fileSize}
                      </p>
                    </div>
                  </a>
                ))}
              </div>
            </Card>
          )}

          {/* Timeline */}
          {timeline && timeline.length > 0 && (
            <Card className="p-3">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 rounded-lg bg-slate-500/10">
                  <Clock className="w-5 h-5 text-slate-600" />
                </div>
                <h4 className="font-semibold text-lg">
                  {t("support.view.timeline")}
                </h4>
              </div>
              <div className="relative space-y-3">
                <div className="absolute left-6 top-8 bottom-8 w-0.5 bg-border" />
                {timeline.map((item, index) => (
                  <div key={item.id} className="relative flex gap-4">
                    <div className="relative z-10 flex items-center justify-center w-12 h-12 rounded-full bg-background border-2 border-primary">
                      {getTimelineIcon(item.action)}
                    </div>
                    <div className="flex-1 pb-4">
                      <div className="p-4 border rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                        <div className="flex items-start justify-between gap-3 mb-2">
                          <p className="font-semibold text-sm">{item.action}</p>
                          <p className="text-xs text-muted-foreground whitespace-nowrap">
                            {formatDate(item.created_at)}
                          </p>
                        </div>
                        {item.notes && (
                          <p className="text-sm text-muted-foreground mb-2">
                            {item.notes}
                          </p>
                        )}
                        <div className="flex items-center gap-3">
                          <Badge variant="outline" className="text-xs">
                            <User className="w-3 h-3 mr-1" />
                            {item.updatedBy.name}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>
      ) : null}
    </BaseModal>
  );
}
