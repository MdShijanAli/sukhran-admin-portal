import { useState, useCallback } from "react";
import { Eye, Users as UsersIcon, FolderSync, Trash2Icon } from "lucide-react";
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
import { DeleteModal } from "@/components/modals";

const DeletedUsersTab = () => {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [showRestore, setShowRestore] = useState(false);
  const [isRestoring, setIsRestoring] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [refreshTable, setRefreshTable] = useState<(() => void) | null>(null);
  const [deleteConfirmation, setDeleteConfirmation] = useState("");
  const [deleteReason, setDeleteReason] = useState("");

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

  const handleForceDelete = (user: User) => {
    setSelectedUser(user);
    setShowDeleteModal(true);
  };

  const handleDeleteUser = async () => {
    if (!selectedUser) return;

    if (deleteConfirmation !== "PERMANENTLY_DELETE") {
      toast.error(t("users.delete.confirmationRequired"));
      return;
    }

    if (!deleteReason.trim()) {
      toast.error(t("users.delete.reasonRequired"));
      return;
    }

    setIsDeleting(true);
    try {
      await userService.forceDeleteUser(selectedUser.id, {
        confirmation: deleteConfirmation,
        reason: deleteReason,
      });
      toast.success("User deleted successfully");
      refreshTable?.();
      setDeleteConfirmation("");
      setDeleteReason("");
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error("Failed to delete user");
    } finally {
      setIsDeleting(false);
      setShowDeleteModal(false);
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
    {
      label: t("forceDelete"),
      icon: Trash2Icon,
      onClick: handleForceDelete,
      show: hasPermission(permissions.users.forceDelete),
      variant: "destructive",
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

      <DeleteModal
        open={showDeleteModal}
        onClose={(open) => {
          setShowDeleteModal(open);
          if (!open) {
            setDeleteConfirmation("");
            setDeleteReason("");
          }
        }}
        title={t("users.delete.title")}
        description={`${t("permanentDelete")} ${selectedUser?.firstName} ${
          selectedUser?.lastName
        }? ${t("deleteAftermath")}`}
        onConfirm={handleDeleteUser}
        isDeleting={isDeleting}
      >
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium">
              {t("users.delete.typeToConfirm")}{" "}
              <span className=" text-destructive">
                {t("users.delete.confirmationText")}
              </span>{" "}
              {t("users.delete.toConfirm")}
            </label>
            <input
              type="text"
              value={deleteConfirmation}
              onChange={(e) => setDeleteConfirmation(e.target.value)}
              className="mt-1.5 w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder={t("users.delete.confirmationText")}
            />
            {deleteConfirmation &&
              deleteConfirmation !== "PERMANENTLY_DELETE" && (
                <p className="text-sm text-destructive mt-1">
                  {t("users.delete.confirmationRequired")}
                </p>
              )}
          </div>
          <div>
            <label className="text-sm font-medium">
              {t("users.delete.reasonLabel")}{" "}
              <span className="text-destructive">*</span>
            </label>
            <textarea
              value={deleteReason}
              onChange={(e) => setDeleteReason(e.target.value)}
              className="mt-1.5 w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring min-h-[80px]"
              placeholder={t("users.delete.reasonPlaceholder")}
            />
          </div>
        </div>
      </DeleteModal>
    </div>
  );
};

export default withPermission(DeletedUsersTab, permissions.users.view);
