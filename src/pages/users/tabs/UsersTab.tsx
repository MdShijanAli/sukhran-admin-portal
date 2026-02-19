import { useState, useCallback, useEffect } from "react";
import {
  Eye,
  Edit,
  Trash2,
  Plus,
  Users as UsersIcon,
  FolderSync,
  Trash2Icon,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  BaseTableList,
  Column,
  ActionItem,
  DropdownMenuActions,
} from "@/components/table";
import { DeleteModal } from "@/components/modals";
import { User, useUserStore } from "@/stores/userStore";
import userService from "@/services/userService";
import { toast } from "sonner";
import noImage from "@/assets/images/avatar-ractangle.jpg";
import { Switch } from "@/components/ui/switch";
import ConfirmationModal from "@/components/modals/ConfirmationModal";
import constData from "@/lib/constData";
import { useTranslation } from "react-i18next";
import roleService from "@/services/roleService";
import { useRoleStore } from "@/stores/roleStore";
import { withPermission } from "@/hoc/withPermission";
import permissions from "@/lib/permissions";
import usePermissions from "@/hooks/use-permissions";
import getSerialNumber from "@/lib/getSerialNumber";
import ViewModal from "../modal/ViewModal";
import FormModal from "../modal/FormModal";
import { useAuthStore, useIsAdmin } from "@/stores/authStore";

const UsersTab = () => {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [dialogMode, setDialogMode] = useState<"create" | "edit" | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [showRestore, setShowRestore] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isRestoring, setIsRestoring] = useState(false);
  const [refreshTable, setRefreshTable] = useState<(() => void) | null>(null);
  const [togglingUserId, setTogglingUserId] = useState<number | string | null>(
    null
  );
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState("");
  const [deleteReason, setDeleteReason] = useState("");

  const store = useUserStore();
  const roleStore = useRoleStore();
  const { t } = useTranslation();
  const { hasPermission } = usePermissions();


  useEffect(() => {
    const fetchRoles = async () => {
      try {
        await roleService.fetchLists();
      } catch (error) {
        console.error("Error fetching user roles:", error);
        toast.error("Failed to fetch user roles");
      }
    };
    if (
      hasPermission(permissions.users.create) ||
      hasPermission(permissions.users.edit)
    ) {
      fetchRoles();
    }
  }, []);

  const handleSetRefresh = useCallback((refreshFn: () => void) => {
    setRefreshTable(() => refreshFn);
  }, []);

  const handleCreate = () => {
    setSelectedUser(null);
    setDialogMode("create");
  };

  const handleEdit = (user: User) => {
    setSelectedUser(user);
    setDialogMode("edit");
  };

  const handleViewDetails = (user: User) => {
    setSelectedUser(user);
    setShowDetails(true);
  };

  const handleDelete = (user: User) => {
    setSelectedUser(user);
    setShowDelete(true);
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

  const handleDeleteUser = async () => {
    if (!selectedUser) return;
    setIsDeleting(true);
    try {
      await userService.deleteItem(selectedUser.id);
      toast.success("User deleted successfully");
      refreshTable?.();
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error("Failed to delete user");
    } finally {
      setIsDeleting(false);
      setShowDelete(false);
    }
  };

  const handleStatusToggle = async (user: User) => {
    setTogglingUserId(user.id);
    try {
      const result = await userService.toggleUserStatus(user.id);
      toast.success(
        `User ${!user.isActive ? "activated" : "deactivated"} successfully`
      );
    } catch (error) {
      console.error("Error toggling user status:", error);
      toast.error(
        error?.response?.data?.message || "Failed to update user status"
      );
    } finally {
      setTogglingUserId(null);
    }
  };

  const handleForceDelete = (user: User) => {
    setSelectedUser(user);
    setShowDeleteModal(true);
  };

  const handleForceDeleteUser = async () => {
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
      label: t("edit"),
      icon: Edit,
      onClick: handleEdit,
      show: hasPermission(permissions.users.edit),
    },
    {
      label: t("delete"),
      icon: Trash2,
      onClick: handleDelete,
      show:
        !user.isDeleted &&
        user?.role?.name !== constData.roles.ADMIN &&
        hasPermission(permissions.users.delete),
      variant: "destructive",
      separator: true,
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
      show: hasPermission(permissions.users.forceDelete) && user.isDeleted,
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
          {user.isDeleted ? (
            <div className="flex items-center justify-end">
              <Badge variant="destructive">{t("deleted")}</Badge>
            </div>
          ) : (
            <div className="flex items-center justify-end gap-2">
              {user?.role?.name !== constData.roles.SUPER_ADMIN ? (
                <>
                  {hasPermission(permissions.users.delete) && (
                    <Switch
                      checked={user.isActive}
                      onCheckedChange={() => handleStatusToggle(user)}
                      disabled={togglingUserId === user.id}
                    />
                  )}
                  <Badge variant={user.isActive ? "default" : "outline"}>
                    {user.isActive
                      ? t("users.columns.active")
                      : t("users.columns.inactive")}
                  </Badge>
                </>
              ) : (
                <Badge variant={user.isActive ? "default" : "outline"}>
                  {user.isActive
                    ? t("users.columns.active")
                    : t("users.columns.inactive")}
                </Badge>
              )}
            </div>
          )}
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

  const filterItemes = [
    {
      label: t("users.filter.account_status"),
      value: "status",
      options: [
        { label: t("users.filter.allStatuses"), value: "all" },
        { label: t("users.filter.active"), value: "active" },
        { label: t("users.filter.inactive"), value: "inactive" },
        { label: t("users.filter.deleted"), value: "deleted" },
      ],
      placeholder: t("users.filter.selectAccountStatus"),
    },
    ...(hasPermission(permissions.roles.view)
      ? [
        {
          label: t("users.filter.user_role"),
          value: "role_id",
          options: [
            { label: t("users.filter.allRoles"), value: "all" },
            ...roleStore.roles.map((role) => ({
              label: role?.display_name,
              value: role.id,
            })),
          ],
          placeholder: t("users.filter.selectUserRole"),
        },
      ]
      : []),
  ];

  return (
    <div className="animate-fade-in">
      <BaseTableList<User>
        title={t("users.title")}
        description={t("users.subtitle")}
        headerActions={
          hasPermission(permissions.users.create) && [
            {
              label: t("add"),
              icon: Plus,
              onClick: handleCreate,
              variant: "default",
            },
          ]
        }
        searchPlaceholder={t("users.searchPlaceholder")}
        enableSearch={true}
        columns={columns}
        service={userService}
        queryParams={{ status: "" }}
        store={store}
        emptyMessage={t("users.noUsersFound")}
        getRowKey={(user) => user.id}
        onRefresh={handleSetRefresh}
        filters={filterItemes}
      />

      {/* Dialogs */}
      <FormModal
        open={dialogMode !== null}
        onClose={() => setDialogMode(null)}
        editData={selectedUser || undefined}
        onSuccess={() => refreshTable?.()}
      />

      <ViewModal
        open={showDetails}
        onClose={setShowDetails}
        userId={selectedUser?.id || null}
      />

      <DeleteModal
        open={showDelete}
        onClose={setShowDelete}
        title={t("users.delete.title")}
        description={`${t("deleteConfirm")} ${selectedUser?.firstName} ${selectedUser?.lastName
          }? ${t("deleteAftermath")}`}
        onConfirm={handleDeleteUser}
        isDeleting={isDeleting}
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
        description={`${t("permanentDelete")} ${selectedUser?.firstName} ${selectedUser?.lastName
          }? ${t("deleteAftermath")}`}
        onConfirm={handleForceDeleteUser}
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

export default withPermission(UsersTab, permissions.users.view);
