import { useState, useCallback } from "react";
import { Plus, Eye, TestTube } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  BaseTableList,
  Column,
  ActionItem,
  DropdownMenuActions,
} from "@/components/table";
import { Notification, useNotificationStore } from "@/stores/notificationStore";
import notificationService from "@/services/notificationService";
import SendNotificationModal from "./modal/SendNotificationModal";
import TestNotificationModal from "./modal/TestNotificationModal";
import ViewNotificationModal from "./modal/ViewNotificationModal";
import { useTranslation } from "react-i18next";
import { formatDate } from "@/lib/utils";
import getSerialNumber from "@/lib/getSerialNumber";
import { withPermission } from "@/hoc/withPermission";
import permissions from "@/lib/permissions";
import usePermissions from "@/hooks/use-permissions";

const Notifications = () => {
  const { t } = useTranslation();
  const store = useNotificationStore();
  const { hasPermission } = usePermissions();

  const [showSendModal, setShowSendModal] = useState(false);
  const [showTestModal, setShowTestModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedNotification, setSelectedNotification] =
    useState<Notification | null>(null);
  const [refreshTable, setRefreshTable] = useState<(() => void) | null>(null);

  const handleSetRefresh = useCallback((refreshFn: () => void) => {
    setRefreshTable(() => refreshFn);
  }, []);

  const handleCreate = () => {
    setShowSendModal(true);
  };

  const handleTest = () => {
    setShowTestModal(true);
  };

  const handleViewDetails = (notification: Notification) => {
    setSelectedNotification(notification);
    setShowViewModal(true);
  };

  // Define actions for dropdown menu
  const notificationActions = (
    notification: Notification
  ): ActionItem<Notification>[] => [
    {
      label: t("notifications.buttons.viewDetails"),
      icon: Eye,
      onClick: handleViewDetails,
    },
  ];

  // Define table columns
  const columns: Column<Notification>[] = [
    {
      key: "sl",
      label: t("notifications.columns.sl"),
      render: (_, index) => getSerialNumber(store, index),
      className: "text-center",
    },
    {
      key: "title",
      label: t("notifications.columns.title"),
      render: (notification) => (
        <div className="max-w-[200px]">
          <p className="font-medium truncate">{notification.title}</p>
        </div>
      ),
    },
    {
      key: "body",
      label: t("notifications.columns.message"),
      render: (notification) => (
        <div className="max-w-[300px]">
          <p className="text-sm text-muted-foreground truncate">
            {notification.body}
          </p>
        </div>
      ),
    },
    {
      key: "link_type",
      label: t("notifications.columns.linkType"),
      render: (notification) => (
        <div className="text-center w-[80px]">
          <Badge variant="outline" className="capitalize">
            {notification.link_type}
          </Badge>
        </div>
      ),
      className: "text-center",
    },
    {
      key: "target_audience",
      label: t("notifications.columns.targetAudience"),
      render: (notification) => (
        <div className="w-[120px]">
          <Badge
            variant={
              notification.target_audience === "all" ? "default" : "secondary"
            }
          >
            {notification.target_audience === "all"
              ? t("notifications.audience.all")
              : t("notifications.audience.specific")}
          </Badge>
        </div>
      ),
      className: "text-center",
    },
    {
      key: "sent_count",
      label: t("notifications.columns.sent"),
      render: (notification) => (
        <span className="text-sm text-blue-900">
          {notification.sent_count || 0}
        </span>
      ),
      className: "text-center",
    },
    {
      key: "success_count",
      label: t("notifications.columns.success"),
      render: (notification) => (
        <span className="text-sm text-green-700">
          {notification.success_count || 0}
        </span>
      ),
      className: "text-center",
    },
    {
      key: "failed_count",
      label: t("notifications.columns.failed"),
      render: (notification) => (
        <span className="text-sm text-red-700">
          {notification.failed_count || 0}
        </span>
      ),
      className: "text-center",
    },
    {
      key: "success_rate",
      label: t("notifications.columns.success_rate"),
      render: (notification) => (
        <div className="w-[100px]">
          <span className="text-sm">{notification.success_rate || "0%"}</span>
        </div>
      ),
      className: "text-center",
    },
    {
      key: "created_at",
      label: t("notifications.columns.sentDate"),
      render: (notification) => (
        <div className="w-[100px]">
          <span className="text-sm">{formatDate(notification.created_at)}</span>
        </div>
      ),
    },
    {
      key: "actions",
      label: t("notifications.columns.actions"),
      className: "text-right",
      render: (notification) => (
        <DropdownMenuActions
          item={notification}
          actions={notificationActions(notification)}
          menuLabel="Actions"
        />
      ),
    },
  ];

  const headerActions = [
    ...(hasPermission(permissions.notification.test) && import.meta.env.DEV
      ? [
          {
            label: t("notifications.buttons.test"),
            icon: TestTube,
            onClick: handleTest,
            variant: "outline",
          },
        ]
      : []),
    ...(hasPermission(permissions.notification.send)
      ? [
          {
            label: t("notifications.buttons.send"),
            icon: Plus,
            onClick: handleCreate,
            variant: "default",
          },
        ]
      : []),
  ];

  return (
    <div className="animate-fade-in">
      <BaseTableList<Notification>
        title={t("notifications.title")}
        description={t("notifications.description")}
        headerActions={headerActions}
        searchPlaceholder={t("notifications.searchPlaceholder")}
        enableSearch={true}
        columns={columns}
        service={notificationService}
        store={store}
        emptyMessage={t("notifications.emptyMessage")}
        getRowKey={(notification) => notification.id}
        onRefresh={handleSetRefresh}
        showDateFilter={true}
      />

      {/* Modals */}
      <SendNotificationModal
        open={showSendModal}
        onClose={() => setShowSendModal(false)}
        onSuccess={() => refreshTable?.()}
      />

      <TestNotificationModal
        open={showTestModal}
        onClose={() => setShowTestModal(false)}
      />

      <ViewNotificationModal
        open={showViewModal}
        onClose={setShowViewModal}
        notification={selectedNotification}
      />
    </div>
  );
};

export default withPermission(Notifications, permissions.notification.view);
