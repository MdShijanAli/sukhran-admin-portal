import { BaseModal } from "@/components/modals";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Image as ImageIcon,
  Link as LinkIcon,
  Users,
  Send,
  CheckCircle2,
  XCircle,
  TrendingUp,
  Clock,
  User,
} from "lucide-react";
import { Notification } from "@/stores/notificationStore";
import { useTranslation } from "react-i18next";

interface ViewNotificationModalProps {
  open: boolean;
  onClose: (value: boolean) => void;
  notification: Notification | null;
}

export default function ViewNotificationModal({
  open,
  onClose,
  notification,
}: ViewNotificationModalProps) {
  const { t } = useTranslation();
  if (!notification) return null;

  const getImageUrl = (url: string) => {
    if (url.startsWith("http")) return url;
    return `${import.meta.env.VITE_API_URL?.replace("/api", "")}${url}`;
  };

  return (
    <BaseModal
      open={open}
      onOpenChange={onClose}
      title={t("notifications.view.title")}
      size="3xl"
      isSubmitting={false}
      closeButtonText={t("notifications.view.close")}
    >
      <div className="space-y-6">
        {/* Header Section */}
        <div className="space-y-3">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <h3 className="text-xl font-semibold text-foreground mb-2">
                {notification.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {notification.body}
              </p>
            </div>
            <Badge
              variant={
                notification.status === "sent"
                  ? "default"
                  : notification.status === "pending"
                  ? "secondary"
                  : "destructive"
              }
              className="capitalize shrink-0"
            >
              {notification.status}
            </Badge>
          </div>
        </div>

        <Separator />

        {/* Image Section */}
        {notification.image_url && (
          <Card className="overflow-hidden border-2">
            <div className="flex items-center gap-2 px-4 py-2 bg-muted/50">
              <ImageIcon className="h-4 w-4 text-muted-foreground" />
              <Label className="text-sm font-medium">
                {t("notifications.view.notificationImage")}
              </Label>
            </div>
            <div className="p-4">
              <img
                src={getImageUrl(notification.image_url)}
                alt="Notification"
                className="w-full rounded-lg object-cover max-h-[300px]"
                onError={(e) => {
                  e.currentTarget.src =
                    "https://via.placeholder.com/400x200?text=Image+Not+Found";
                }}
              />
            </div>
          </Card>
        )}

        {/* Link & Audience Section */}
        <div className="grid md:grid-cols-2 gap-4">
          <Card className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <LinkIcon className="h-4 w-4 text-muted-foreground" />
              <Label className="text-sm font-medium">
                {t("notifications.view.linkInformation")}
              </Label>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">
                  {t("notifications.view.type")}
                </span>
                <Badge variant="outline" className="capitalize">
                  {notification.link_type}
                </Badge>
              </div>
              {notification.url && notification.link_type === "url" && (
                <div className="mt-2">
                  <span className="text-sm text-muted-foreground block mb-1">
                    {t("notifications.view.url")}
                  </span>
                  <a
                    href={notification.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-primary hover:underline break-all"
                  >
                    {notification.url}
                  </a>
                </div>
              )}
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <Users className="h-4 w-4 text-muted-foreground" />
              <Label className="text-sm font-medium">
                {t("notifications.view.targetAudience")}
              </Label>
            </div>
            <Badge
              variant={
                notification.target_audience === "all" ? "default" : "secondary"
              }
              className="text-sm"
            >
              {notification.target_audience === "all"
                ? t("notifications.audience.all")
                : t("notifications.audience.specific")}
            </Badge>
          </Card>
        </div>

        {/* Statistics Section */}
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
            <Label className="text-sm font-medium">
              {t("notifications.view.performanceMetrics")}
            </Label>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Send className="h-4 w-4" />
                <span className="text-xs">{t("notifications.view.sent")}</span>
              </div>
              <p className="text-2xl font-bold text-foreground">
                {notification.sent_count || 0}
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-green-600">
                <CheckCircle2 className="h-4 w-4" />
                <span className="text-xs">
                  {t("notifications.view.success")}
                </span>
              </div>
              <p className="text-2xl font-bold text-green-600">
                {notification.success_count || 0}
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-red-600">
                <XCircle className="h-4 w-4" />
                <span className="text-xs">
                  {t("notifications.view.failed")}
                </span>
              </div>
              <p className="text-2xl font-bold text-red-600">
                {notification.failed_count || 0}
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-blue-600">
                <TrendingUp className="h-4 w-4" />
                <span className="text-xs">
                  {t("notifications.view.successRate")}
                </span>
              </div>
              <p className="text-2xl font-bold text-blue-600">
                {notification.success_rate || "0%"}
              </p>
            </div>
          </div>
        </Card>

        {/* Metadata Section */}
        <div className="grid md:grid-cols-2 gap-4">
          <Card className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <Label className="text-sm font-medium">
                {t("notifications.view.timeline")}
              </Label>
            </div>
            <div className="space-y-2 text-sm">
              <div>
                <span className="text-muted-foreground">
                  {t("notifications.view.sentAt")}
                </span>
                <p className="font-medium">
                  {new Date(
                    notification.sent_at || notification.created_at
                  ).toLocaleString()}
                </p>
              </div>
              {notification.sent_at !== notification.created_at && (
                <div>
                  <span className="text-muted-foreground">
                    {t("notifications.view.createdAt")}
                  </span>
                  <p className="font-medium">
                    {new Date(notification.created_at).toLocaleString()}
                  </p>
                </div>
              )}
            </div>
          </Card>

          {notification.sent_by && (
            <Card className="p-4">
              <div className="flex items-center gap-2 mb-3">
                <User className="h-4 w-4 text-muted-foreground" />
                <Label className="text-sm font-medium">
                  {t("notifications.view.sentBy")}
                </Label>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-sm">
                    {notification.sent_by.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    ID: {notification.sent_by.id}
                  </p>
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>
    </BaseModal>
  );
}
