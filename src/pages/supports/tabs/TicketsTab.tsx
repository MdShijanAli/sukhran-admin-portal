import { useTranslation } from "react-i18next";
import {
  Eye,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  Flag,
  Filter,
} from "lucide-react";
import { BaseTableList } from "@/components/table/BaseTableList";
import { Column } from "@/components/table/BaseTable";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import { SupportTicket, useSupportStore } from "@/stores/supportStore";
import supportService from "@/services/supportService";
import { formatDate } from "@/lib/utils";
import { useState } from "react";
import FilterModal from "@/components/modals/FilterModal";
import { toast } from "@/components/ui/sonner";
import constData from "@/lib/constData";
import { ActionItem, DropdownMenuActions } from "@/components/table";

interface TicketsTabProps {
  onView: (ticket: SupportTicket) => void;
  onChangeStatus: (ticket: SupportTicket) => void;
  onChangePriority: (ticket: SupportTicket) => void;
  onResolve: (ticket: SupportTicket) => void;
  onClose: (ticket: SupportTicket) => void;
  onDelete: (ticket: SupportTicket) => void;
  onRefresh?: (refreshFn: () => void) => void;
}

export default function TicketsTab({
  onView,
  onChangeStatus,
  onChangePriority,
  onResolve,
  onClose,
  onDelete,
  onRefresh,
}: TicketsTabProps) {
  const { t } = useTranslation();
  const store = useSupportStore();

  const [showFilterModal, setShowFilterModal] = useState(false);
  const [filterData, setFilterData] = useState<Record<string, string>>({
    status: "",
    category: "",
    priority: "",
  });

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

  const ticketActions = (
    ticket: SupportTicket
  ): ActionItem<SupportTicket>[] => [
    {
      label: t("support.actions.view"),
      icon: Eye,
      onClick: onView,
    },
    {
      label: t("support.actions.changeStatus"),
      icon: Edit,
      onClick: onChangeStatus,
      show: ticket.status !== "closed" && ticket.status !== "resolved",
    },
    {
      label: t("support.actions.changePriority"),
      icon: Flag,
      onClick: onChangePriority,
      show: ticket.status !== "closed" && ticket.status !== "resolved",
    },
    {
      label: t("support.actions.resolve"),
      icon: Flag,
      onClick: onResolve,
      show: ticket.status !== "resolved" && ticket.status !== "closed",
    },
    {
      label: t("support.actions.close"),
      icon: XCircle,
      onClick: onClose,
      show: ticket.status !== "closed" && ticket.status === "resolved",
    },
    {
      label: t("support.actions.delete"),
      icon: Trash2,
      onClick: onDelete,
      show: ticket.status !== "closed" && ticket.status !== "resolved",
    },
  ];

  const getCategoryBadge = (category: string) => {
    const colors: Record<string, string> = {
      delivery: "bg-purple-500/10 text-purple-600",
      payment: "bg-green-500/10 text-green-600",
      product: "bg-orange-500/10 text-orange-600",
      account: "bg-pink-500/10 text-pink-600",
      order: "bg-blue-500/10 text-blue-600",
      return: "bg-red-500/10 text-red-600",
      other: "bg-gray-500/10 text-gray-600",
    };
    return (
      <Badge variant="secondary" className={colors[category] || ""}>
        {t(`support.tickets.category.${category}`)}
      </Badge>
    );
  };

  const columns: Column<SupportTicket>[] = [
    {
      key: "sl",
      label: t("support.tickets.columns.sl"),
      render: (_, index) => index + 1,
      className: "text-center",
    },
    {
      key: "ticketNumber",
      label: t("support.tickets.columns.ticketNumber"),
      render: (ticket) => (
        <div className="w-[120px]">
          <span className="font-mono font-medium">{ticket.ticketNumber}</span>
        </div>
      ),
    },
    {
      key: "customer",
      label: t("support.tickets.columns.customer"),
      render: (ticket) => (
        <div className="flex flex-col">
          <span className="font-medium">{ticket.customer.name}</span>
          <span className="text-xs text-muted-foreground">
            {ticket.customer.email}
          </span>
        </div>
      ),
    },
    {
      key: "subject",
      label: t("support.tickets.columns.subject"),
      render: (ticket) => (
        <div className="max-w-[300px]">
          <p className="truncate font-medium">{ticket.subject}</p>
        </div>
      ),
    },
    {
      key: "category",
      label: t("support.tickets.columns.category"),
      render: (ticket) => getCategoryBadge(ticket.category),
    },
    {
      key: "priority",
      label: t("support.tickets.columns.priority"),
      render: (ticket) => getPriorityBadge(ticket.priority),
    },
    {
      key: "status",
      label: t("support.tickets.columns.status"),
      render: (ticket) => (
        <div className="w-[90px]">{getStatusBadge(ticket.status)}</div>
      ),
    },
    {
      key: "createdByAdmin",
      label: t("support.tickets.columns.createdBy"),
      render: (ticket) => (
        <Badge variant="outline">
          {ticket.createdByAdmin
            ? t("support.tickets.createdBy.admin")
            : t("support.tickets.createdBy.customer")}
        </Badge>
      ),
    },
    {
      key: "created_at",
      label: t("support.tickets.columns.created"),
      render: (ticket) => (
        <div className="w-[100px]">
          <span className="text-sm text-muted-foreground">
            {formatDate(ticket.created_at)}
          </span>
        </div>
      ),
    },
    {
      key: "actions",
      label: t("support.tickets.columns.actions"),
      render: (ticket) => (
        <DropdownMenuActions
          item={ticket}
          actions={ticketActions(ticket)}
          menuLabel={t("actions")}
        />
      ),
    },
  ];

  const handleApplyFilters = (filters: Record<string, string>) => {
    setFilterData(filters);
    // Apply filters to your data fetching logic
    console.log("Applied filters:", filters);
    toast.success("Filters applied successfully");
  };

  // Filter configurations
  const ticketFilterConfigs = [
    {
      key: "status",
      label: t("support.filter.status"),
      options: [
        { label: t("support.filter.allStatuses"), value: "all" },
        {
          label: t("support.filter.open"),
          value: constData.ticketStatuses.OPEN,
        },
        {
          label: t("support.filter.inProgress"),
          value: constData.ticketStatuses.IN_PROGRESS,
        },
        {
          label: t("support.filter.resolved"),
          value: constData.ticketStatuses.RESOLVED,
        },
        {
          label: t("support.filter.closed"),
          value: constData.ticketStatuses.CLOSED,
        },
      ],
      defaultValue: "all",
    },
    {
      key: "priority",
      label: t("support.filter.priority"),
      options: [
        { label: t("support.filter.allPriorities"), value: "all" },
        { label: t("support.filter.high"), value: constData.priorities.HIGH },
        {
          label: t("support.filter.medium"),
          value: constData.priorities.MEDIUM,
        },
        { label: t("support.filter.low"), value: constData.priorities.LOW },
        {
          label: t("support.filter.urgent"),
          value: constData.priorities.URGENT,
        },
      ],
      defaultValue: "all",
    },
    {
      key: "category",
      label: t("support.filter.category"),
      options: [
        { label: t("support.filter.allCategories"), value: "all" },
        {
          label: t("support.filter.delivery"),
          value: constData.ticketCategories.DELIVERY,
        },
        {
          label: t("support.filter.payment"),
          value: constData.ticketCategories.PAYMENT,
        },
        {
          label: t("support.filter.product"),
          value: constData.ticketCategories.PRODUCT,
        },
        {
          label: t("support.filter.account"),
          value: constData.ticketCategories.ACCOUNT,
        },
        {
          label: t("support.filter.order"),
          value: constData.ticketCategories.ORDER,
        },
        {
          label: t("support.filter.return"),
          value: constData.ticketCategories.RETURN,
        },
        {
          label: t("support.filter.other"),
          value: constData.ticketCategories.OTHER,
        },
      ],
      defaultValue: "all",
    },
  ];

  const handleClearFilters = () => {
    setFilterData({
      status: "active",
      category: "all",
      priority: "all",
    });
    toast.info("Filters cleared");
    setShowFilterModal(false);
  };

  return (
    <div>
      <BaseTableList<SupportTicket>
        title=""
        description=""
        toolbarActions={
          <Button variant="outline" onClick={() => setShowFilterModal(true)}>
            <Filter className="mr-2 h-4 w-4" />
            {t("filter")}
          </Button>
        }
        searchPlaceholder="Search by ticket number, customer, subject..."
        enableSearch={true}
        columns={columns}
        service={supportService}
        store={store}
        getRowKey={(ticket) => ticket.id}
        onRefresh={onRefresh}
      />

      {/* Filter Modal */}
      <FilterModal
        open={showFilterModal}
        onClose={() => setShowFilterModal(false)}
        title={t("filter")}
        filters={ticketFilterConfigs}
        currentFilters={filterData}
        onApplyFilters={handleApplyFilters}
        onClearFilters={handleClearFilters}
        submitButtonText={t("users.filter.apply")}
        clearButtonText={t("users.filter.clear")}
      />
    </div>
  );
}
