import { useState, useCallback } from "react";
import { Eye, Users as UsersIcon, FolderSync } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  BaseTableList,
  Column,
  ActionItem,
  DropdownMenuActions,
} from "@/components/table";
import { User, useUserStore } from "@/stores/userStore";
import userService from "@/services/userService";
import { toast } from "sonner";
import noImage from "@/assets/images/avatar-ractangle.jpg";
import ConfirmationModal from "@/components/modals/ConfirmationModal";
import constData from "@/lib/constData";
import { useTranslation } from "react-i18next";
import { withPermission } from "@/hoc/withPermission";
import permissions from "@/lib/permissions";
import usePermissions from "@/hooks/use-permissions";
import getSerialNumber from "@/lib/getSerialNumber";
import ViewModal from "../modal/ViewModal";

const DeletedUsersTab = () => {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [showRestore, setShowRestore] = useState(false);
  const [isRestoring, setIsRestoring] = useState(false);
  const [refreshTable, setRefreshTable] = useState<(() => void) | null>(null);

  const store = useUserStore();
  const { t } = useTranslation();
  const { hasPermission } = usePermissions();

  const handleSetRefresh = useCallback((refreshFn: () => void) => {
    setRefreshTable(() => refreshFn);
  }, []);

  const handleViewDetails = (user: User) => {
    setSelectedUser(user);
    setShowDetails(true);
  };

  const handleRestore = (user: User) => {
    setSelectedUser(user);
    setShowRestore(true);
  };

  const handleRestoreUser = async () => {
    if (!selectedUser) return;
    setIsRestoring(true);
    try {
      await userService.restoreUser(selectedUser.id);
      toast.success("User restored successfully");
      refreshTable?.();
    } catch (error) {
      console.error("Error restoring user:", error);
      toast.error("Failed to restore user");
    } finally {
      setIsRestoring(false);
      setShowRestore(false);
    }
  };

  // Define actions for dropdown menu
  const userActions = (user: User): ActionItem<User>[] => [
    {
      label: t("view"),
      icon: Eye,
      onClick: handleViewDetails,
    },
    {
      label: t("restore"),
      icon: FolderSync,
      onClick: handleRestore,
      show: user.isDeleted && hasPermission(permissions.users.restore),
      variant: "default",
    },
  ];

  // Define table columns
  const columns: Column<User>[] = [
    {
      key: "sl",
      label: t("users.columns.sl"),
      render: (_, index) => getSerialNumber(store, index),
      className: "text-center",
    },
    {
      key: "image_url",
      label: t("users.columns.image"),
      render: (user) => (
        <img
          src={user.image_url || user.displayImage || noImage}
          alt={user.firstName}
          className="w-10 h-10 rounded-full object-cover"
        />
      ),
    },
    {
      key: "name",
      label: t("users.columns.userName"),
      render: (user) => (
        <p className="w-[100px]">{`${user.firstName} ${user.lastName}`}</p>
      ),
    },
    {
      key: "email",
      label: t("users.columns.email"),
    },
    {
      key: "mobile",
      label: t("users.form.mobile"),
    },
    {
      key: "role",
      label: t("users.columns.role"),
      render: (user) => (
        <Badge
          variant={
            user?.role?.name === constData.roles.CUSTOMER
              ? "primary"
              : "outline"
          }
        >
          {user?.role?.display_name}
        </Badge>
      ),
      className: "text-center",
    },
    {
      key: "isActive",
      label: t("users.columns.status"),
      render: (user) => (
        <>
          <Badge variant="destructive">
            {user.isActive
              ? t("users.columns.active")
              : t("users.columns.inactive")}
          </Badge>
        </>
      ),
      className: "text-center",
    },
    {
      key: "actions",
      label: t("actions"),
      className: "text-right",
      render: (user) => (
        <DropdownMenuActions
          item={user}
          actions={userActions(user)}
          menuLabel={t("actions")}
        />
      ),
    },
  ];

  return (
    <div className="animate-fade-in">
      <BaseTableList<User>
        title={t("users.deletedUsersTitle")}
        description={t("users.deletedUsersDescription")}
        searchPlaceholder={t("users.searchPlaceholder")}
        enableSearch={true}
        columns={columns}
        service={userService}
        queryParams={{ status: "deleted" }}
        store={store}
        emptyMessage={t("users.noUsersFound")}
        getRowKey={(user) => user.id}
        onRefresh={handleSetRefresh}
      />

      <ViewModal
        open={showDetails}
        onClose={setShowDetails}
        userId={selectedUser?.id || null}
      />

      <ConfirmationModal
        open={showRestore}
        onClose={() => setShowRestore(false)}
        title="Restore User"
        description={`Are you sure you want to restore ${selectedUser?.firstName} ${selectedUser?.lastName}?`}
        onConfirm={handleRestoreUser}
        isProcessing={isRestoring}
      />
    </div>
  );
};

export default withPermission(DeletedUsersTab, permissions.users.view);
