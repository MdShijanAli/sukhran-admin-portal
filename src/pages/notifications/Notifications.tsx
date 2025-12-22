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

const Notifications = () => {
  const { t } = useTranslation();
  const store = useNotificationStore();

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
      label: "View Details",
      icon: Eye,
      onClick: handleViewDetails,
    },
  ];

  // Define table columns
  const columns: Column<Notification>[] = [
    {
      key: "sl",
      label: "SL",
      render: (_, index) => index + 1,
      className: "text-center",
    },
    {
      key: "title",
      label: "Title",
      render: (notification) => (
        <div className="max-w-[200px]">
          <p className="font-medium truncate">{notification.title}</p>
        </div>
      ),
    },
    {
      key: "body",
      label: "Message",
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
      label: "Link Type",
      render: (notification) => (
        <Badge variant="outline" className="capitalize">
          {notification.link_type}
        </Badge>
      ),
      className: "text-center",
    },
    {
      key: "target_audience",
      label: "Target Audience",
      render: (notification) => (
        <Badge
          variant={
            notification.target_audience === "all" ? "default" : "secondary"
          }
        >
          {notification.target_audience === "all"
            ? "All Users"
            : "Specific Users"}
        </Badge>
      ),
      className: "text-center",
    },
    {
      key: "sent_count",
      label: "Sent",
      render: (notification) => (
        <span className="text-sm">{notification.sent_count || 0}</span>
      ),
      className: "text-center",
    },
    {
      key: "status",
      label: "Status",
      render: (notification) => {
        const variant =
          notification.status === "sent"
            ? "default"
            : notification.status === "pending"
            ? "secondary"
            : "destructive";
        return (
          <Badge variant={variant} className="capitalize">
            {notification.status}
          </Badge>
        );
      },
      className: "text-center",
    },
    {
      key: "created_at",
      label: "Sent Date",
      render: (notification) => (
        <span className="text-sm">
          {new Date(notification.created_at).toLocaleString()}
        </span>
      ),
    },
    {
      key: "actions",
      label: "Actions",
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

  return (
    <div className="animate-fade-in">
      <BaseTableList<Notification>
        title="Notifications"
        description="Send push notifications to your users"
        headerActions={[
          {
            label: "Test",
            icon: TestTube,
            onClick: handleTest,
            variant: "outline",
          },
          {
            label: "Send",
            icon: Plus,
            onClick: handleCreate,
            variant: "default",
          },
        ]}
        searchPlaceholder="Search notifications..."
        enableSearch={true}
        columns={columns}
        service={notificationService}
        store={store}
        emptyMessage="No notifications found"
        getRowKey={(notification) => notification.id}
        onRefresh={handleSetRefresh}
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

export default Notifications;
