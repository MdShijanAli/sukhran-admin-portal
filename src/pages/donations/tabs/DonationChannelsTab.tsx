import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { BaseTableList } from "@/components/table/BaseTableList";
import { Column } from "@/components/table/BaseTable";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { DonationChannel } from "@/lib/types";
import { useDonationChannelStore } from "@/stores/donationChannelStore";
import donationChannelService from "@/services/donationChannelService";
import { formatCurrency, formatDate } from "@/lib/utils";
import { ActionItem, DropdownMenuActions } from "@/components/table";
import { Edit, Eye, Trash2 } from "lucide-react";
import { StatusSwitch } from "@/components/custom/StatusSwitch";

interface DonationChannelsTabProps {
  onViewDetails?: (channel: DonationChannel) => void;
  onEdit?: (channel: DonationChannel) => void;
  onDelete?: (channel: DonationChannel) => void;
  onToggleStatus?: (channel: DonationChannel) => void;
}

export default function DonationChannelsTab({
  onViewDetails,
  onEdit,
  onDelete,
  onToggleStatus,
}: DonationChannelsTabProps) {
  const { t } = useTranslation();

  const store = useDonationChannelStore();

  const handleViewDetails = (channel: DonationChannel) => {
    onViewDetails?.(channel);
  };

  const handleEdit = (channel: DonationChannel) => {
    onEdit?.(channel);
  };

  const handleDelete = (channel: DonationChannel) => {
    onDelete?.(channel);
  };

  // Define actions for dropdown menu
  const donationChannelsAction = (
    channel: DonationChannel
  ): ActionItem<DonationChannel>[] => [
    {
      label: t("orders.actions.viewDetails"),
      icon: Eye,
      onClick: handleViewDetails,
    },
    {
      label: t("donations.actions.edit"),
      icon: Edit,
      onClick: handleEdit,
      separator: true,
    },
    {
      label: t("donations.actions.delete"),
      icon: Trash2,
      onClick: handleDelete,
      variant: "destructive",
    },
  ];

  const columns: Column<DonationChannel>[] = [
    {
      key: "sl",
      label: t("donations.channels.columns.sl"),
      render: (_, index) => index + 1,
      className: "text-center w-16",
    },
    {
      key: "image_url",
      label: t("donations.channels.columns.name"),
      render: (channel) => (
        <div className="flex items-center gap-3 w-[150px]">
          <img
            src={channel.image_url}
            alt={channel.name}
            className="w-12 h-12 object-cover object-top border border-1 rounded-md"
          />
          <div>
            <p className="font-medium">{channel.name}</p>
            <p className="text-xs text-muted-foreground line-clamp-1">
              {channel.description}
            </p>
          </div>
        </div>
      ),
    },
    {
      key: "targetAmount",
      label: t("donations.channels.columns.target"),
      render: (channel) => (
        <div className="w-[100px] text-blue-800 font-medium">
          {formatCurrency(channel.targetAmount)}
        </div>
      ),
    },
    {
      key: "collectedAmount",
      label: t("donations.channels.columns.collected"),
      render: (channel) => (
        <div className="w-[100px] text-green-800 font-medium">
          {formatCurrency(channel.collectedAmount)}
        </div>
      ),
    },
    {
      key: "collectedAmount",
      label: t("donations.channels.columns.remaining"),
      render: (channel) => (
        <div className="w-[100px] text-red-800 font-medium">
          {formatCurrency(channel.remainingAmount)}
        </div>
      ),
    },
    {
      key: "progress",
      label: t("donations.channels.columns.progress"),
      render: (channel) => (
        <div className="w-24">
          <Progress value={channel.progress} className="h-2" />
          <p className="text-xs text-center mt-1">{channel.progress}%</p>
        </div>
      ),
    },
    {
      key: "totalDonations",
      label: t("donations.channels.columns.donations"),
      render: (channel) => (
        <Badge variant="secondary">{channel.totalDonations}</Badge>
      ),
      className: "text-center",
    },
    {
      key: "isActive",
      label: t("donations.channels.columns.status"),
      render: (channel) => (
        <StatusSwitch
          checked={channel.isActive}
          onToggle={() => onToggleStatus?.(channel)}
          activeLabel={t("active")}
          inactiveLabel={t("inactive")}
          size="sm"
        />
      ),
    },
    {
      key: "displayOrder",
      label: t("donations.channels.columns.order"),
      render: (channel) => (
        <Badge variant="outline">{channel.displayOrder}</Badge>
      ),
    },
    {
      key: "created_at",
      label: t("donations.channels.columns.created"),
      render: (channel) => (
        <div className="w-[100px]">{formatDate(channel.created_at)}</div>
      ),
    },
    {
      key: "actions",
      label: t("donations.channels.columns.actions"),
      className: "text-right",
      render: (channel) => (
        <DropdownMenuActions
          item={channel}
          actions={donationChannelsAction(channel)}
        />
      ),
    },
  ];

  return (
    <BaseTableList<DonationChannel>
      title=""
      description=""
      searchPlaceholder={t("donations.channels.subtitle")}
      enableSearch={true}
      columns={columns}
      service={donationChannelService}
      store={store}
      getRowKey={(order) => order.id}
    />
  );
}
