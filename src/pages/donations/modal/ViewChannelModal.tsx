import { useTranslation } from "react-i18next";
import { BaseModal } from "@/components/modals/BaseModal";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { DonationChannel } from "@/lib/types";
import { formatCurrency, formatDate } from "@/lib/utils";
import {
  Calendar,
  Target,
  TrendingUp,
  Users,
  Hash,
  CheckCircle,
  XCircle,
} from "lucide-react";
import TimeStaps from "@/components/custom/TimeStamps";

interface ViewChannelModalProps {
  open: boolean;
  onClose: (value: boolean) => void;
  channel: DonationChannel | null;
}

export default function ViewChannelModal({
  open,
  onClose,
  channel,
}: ViewChannelModalProps) {
  const { t } = useTranslation();

  if (!channel) return null;

  return (
    <BaseModal
      open={open}
      onOpenChange={onClose}
      title={t("donations.channels.columns.name")}
      showSubmitButton={false}
      closeButtonText={t("close")}
      size="2xl"
    >
      <div className="space-y-4">
        {/* Channel Image and Basic Info */}
        <Card className="p-4">
          <div className="flex items-start gap-4">
            <img
              src={channel.image_url}
              alt={channel.name}
              className="w-24 h-24 object-cover rounded-lg border-2 border-border"
            />
            <div className="flex-1">
              <h3 className="text-xl  mb-2">{channel.name}</h3>
              <p className="text-sm text-muted-foreground mb-3">
                {channel.description}
              </p>
              <div className="flex items-center gap-2">
                <Badge variant={channel.isActive ? "default" : "secondary"}>
                  {channel.isActive ? (
                    <CheckCircle className="w-3 h-3 mr-1" />
                  ) : (
                    <XCircle className="w-3 h-3 mr-1" />
                  )}
                  {channel.isActive ? t("active") : t("inactive")}
                </Badge>
                <Badge variant="outline">
                  <Hash className="w-3 h-3 mr-1" />
                  {t("donations.channels.columns.order")}:{" "}
                  {channel.displayOrder}
                </Badge>
                <Badge variant="secondary">
                  <Users className="w-3 h-3 mr-1" />
                  {channel.totalDonations}{" "}
                  {t("donations.channels.columns.donations")}
                </Badge>
              </div>
            </div>
          </div>
        </Card>

        {/* Financial Overview */}
        <Card className="p-4">
          <h4 className="font-semibold text-sm text-primary mb-4 flex items-center gap-2">
            <Target className="w-4 h-4" />
            {t("donations.channels.columns.target")} &{" "}
            {t("donations.channels.columns.progress")}
          </h4>
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
                <p className="text-xs text-muted-foreground mb-1">
                  {t("donations.channels.columns.target")}
                </p>
                <p className="text-lg  text-blue-600 dark:text-blue-400">
                  {formatCurrency(channel.targetAmount)}
                </p>
              </div>
              <div className="text-center p-3 bg-green-50 dark:bg-green-950 rounded-lg">
                <p className="text-xs text-muted-foreground mb-1">
                  {t("donations.channels.columns.collected")}
                </p>
                <p className="text-lg  text-green-600 dark:text-green-400">
                  {formatCurrency(channel.collectedAmount)}
                </p>
              </div>
              <div className="text-center p-3 bg-orange-50 dark:bg-orange-950 rounded-lg">
                <p className="text-xs text-muted-foreground mb-1">
                  {t("donations.channels.columns.remaining")}
                </p>
                <p className="text-lg  text-orange-600 dark:text-orange-400">
                  {formatCurrency(channel.remainingAmount)}
                </p>
              </div>
            </div>

            {/* Progress Bar */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">
                  {t("donations.channels.columns.progress")}
                </span>
                <span className="text-sm  text-primary">
                  {channel.progress}%
                </span>
              </div>
              <Progress value={channel.progress} className="h-3" />
              <p className="text-xs text-muted-foreground mt-2 text-center">
                {channel.progress < 25
                  ? "Just getting started!"
                  : channel.progress < 50
                    ? "Making progress!"
                    : channel.progress < 75
                      ? "More than halfway there!"
                      : channel.progress < 100
                        ? "Almost there!"
                        : "Goal achieved! 🎉"}
              </p>
            </div>
          </div>
        </Card>

        {/* Statistics */}
        <Card className="p-4">
          <h4 className="font-semibold text-sm text-primary mb-3 flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            Statistics
          </h4>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Users className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Total Donations</p>
                <p className="text-lg ">{channel.totalDonations}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
              <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center">
                <Target className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Completion</p>
                <p className="text-lg ">{channel.progress}%</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Timestamps */}
        <Card className="p-4">
          <h4 className="font-semibold text-sm text-primary mb-3 flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            Timeline
          </h4>
          <TimeStaps item={channel} />
        </Card>
      </div>
    </BaseModal>
  );
}
