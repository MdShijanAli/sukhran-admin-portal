import { useState, useCallback, useEffect } from "react";
import {
  Eye,
  Edit,
  Trash2,
  Plus,
  Users as UsersIcon,
  UserCheck,
  UserX,
  UserMinus,
  Filter,
  FolderSync,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  BaseTableList,
  Column,
  ActionItem,
  DropdownMenuActions,
} from "@/components/table";
import { DeleteModal } from "@/components/modals";
import FormModal from "./modal/FormModal";
import ViewModal from "./modal/ViewModal";
import { User, useUserStore } from "@/stores/userStore";
import userService from "@/services/userService";
import { toast } from "sonner";
import noImage from "@/assets/images/avatar-ractangle.jpg";
import { Switch } from "@/components/ui/switch";
import FilterModal from "./modal/FilterModal";
import { Button } from "@/components/ui/button";
import ConfirmationModal from "@/components/modals/ConfirmationModal";
import constData from "@/lib/constData";
import { useTranslation } from "react-i18next";

const Users = () => {
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

  const [showFilterModal, setShowFilterModal] = useState(false);
  const [filterData, setFilterData] = useState<Record<string, string>>({
    status: "",
    subscription: "",
    role: "",
  });

  const store = useUserStore();
  const { t } = useTranslation();

  useEffect(() => {
    const params = new URLSearchParams();
    if (filterData.status) {
      params.append("status", filterData.status);
    }
    if (filterData.subscription) {
      params.append("subscription", filterData.subscription);
    }
    if (filterData.role) {
      params.append("role", filterData.role);
    }
    const queryString = params.toString();
    const fetchLists = async () => {
      store.setLoading(true);
      try {
        await userService.fetchLists(queryString);
      } catch (error) {
        console.error("Error fetching filtered user list:", error);
        toast.error("Failed to fetch filtered user list");
      } finally {
        store.setLoading(false);
      }
    };
    if (!queryString) {
      return;
    } else {
      fetchLists();
    }
  }, [filterData.status, filterData.subscription, filterData.role]);

  const handleApplyFilters = (filters: Record<string, string>) => {
    setFilterData(filters);
    // Apply filters to your data fetching logic
    console.log("Applied filters:", filters);
    toast.success("Filters applied successfully");
  };

  const handleClearFilters = () => {
    setFilterData({
      status: "active",
      subscription: "all",
      role: "all",
    });
    toast.info("Filters cleared");
    setShowFilterModal(false);
  };

  // Filter configurations
  const userFilterConfigs = [
    {
      key: "status",
      label: t("users.filter.account_status"),
      options: [
        { label: t("users.filter.allStatuses"), value: "all" },
        { label: t("users.filter.active"), value: "active" },
        { label: t("users.filter.inactive"), value: "inactive" },
        { label: t("users.filter.deleted"), value: "deleted" },
      ],
      defaultValue: "active",
    },
    // {
    //   key: "subscription",
    //   label: "Subscription Status",
    //   options: [
    //     { label: "All Subscriptions", value: "all" },
    //     { label: "Active", value: "active" },
    //     { label: "Expired", value: "expired" },
    //     { label: "None", value: "none" },
    //   ],
    //   defaultValue: "all",
    // },
    {
      key: "role",
      label: t("users.filter.user_role"),
      options: [
        { label: "All Roles", value: "all" },
        { label: "Admin", value: "admin" },
        { label: "Customer", value: "customer" },
        { label: "Manager", value: "manager" },
      ],
      defaultValue: "all",
    },
  ];

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
      handleClearFilters();
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
      if (result && result.user) {
        setFilterData((prev) => ({ ...prev, status: "active" }));
      }
    } catch (error) {
      console.error("Error toggling user status:", error);
      toast.error(
        error?.response?.data?.message || "Failed to update user status"
      );
    } finally {
      setTogglingUserId(null);
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
    },
    {
      label: t("delete"),
      icon: Trash2,
      onClick: handleDelete,
      show: !user.isDeleted && user.role.name !== constData.roles.ADMIN,
      variant: "destructive",
      separator: true,
    },
    {
      label: t("restore"),
      icon: FolderSync,
      onClick: handleRestore,
      show: user.isDeleted,
      variant: "default",
    },
  ];

  // Define table columns
  const columns: Column<User>[] = [
    {
      key: "sl",
      label: t("users.columns.sl"),
      render: (_, index) => index + 1,
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
      render: (user) => `${user.firstName} ${user.lastName}`,
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
          {user.role.display_name}
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
              {user.role.name !== constData.roles.ADMIN ? (
                <>
                  <Switch
                    checked={user.isActive}
                    onCheckedChange={() => handleStatusToggle(user)}
                    disabled={togglingUserId === user.id}
                  />
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

  const summaryLists = [
    {
      title: t("users.summary.totalUsers"),
      value: store.statistics.total_users,
      icon: UsersIcon,
      color: "text-muted-foreground",
    },
    {
      title: t("users.summary.activeUsers"),
      value: store.statistics.active_users,
      icon: UserCheck,
      color: "text-green-600",
    },
    {
      title: t("users.summary.inactiveUsers"),
      value: store.statistics.inactive_users,
      icon: UserX,
      color: "text-orange-600",
    },
    {
      title: t("users.summary.blockedUsers"),
      value: store.statistics.deleted_users,
      icon: UserMinus,
      color: "text-red-600",
    },
    // {
    //   title: "Verified Users",
    //   value: stats.verified_users,
    //   icon: UserCheck,
    //   color: "text-green-600",
    // },
    // {
    //   title: "Unverified Users",
    //   value: stats.unverified_users,
    //   icon: UserX,
    //   color: "text-orange-600",
    // },
  ];

  return (
    <div className="animate-fade-in">
      <BaseTableList<User>
        title={t("users.title")}
        description={t("users.subtitle")}
        headerActions={[
          {
            label: t("add"),
            icon: Plus,
            onClick: handleCreate,
            variant: "default",
          },
        ]}
        toolbarActions={
          <Button variant="outline" onClick={() => setShowFilterModal(true)}>
            <Filter className="mr-2 h-4 w-4" />
            {t("filter")}
          </Button>
        }
        searchPlaceholder={t("users.searchPlaceholder")}
        enableSearch={true}
        columns={columns}
        service={userService}
        store={store}
        emptyMessage={t("users.noUsersFound")}
        getRowKey={(user) => user.id}
        onRefresh={handleSetRefresh}
        summaryLists={summaryLists}
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
        description={`${t("deleteConfirm")} ${selectedUser?.firstName} ${
          selectedUser?.lastName
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

      {/* Filter Modal */}
      <FilterModal
        open={showFilterModal}
        onClose={() => setShowFilterModal(false)}
        title={t("filter")}
        filters={userFilterConfigs}
        currentFilters={filterData}
        onApplyFilters={handleApplyFilters}
        onClearFilters={handleClearFilters}
        submitButtonText={t("users.filter.apply")}
        clearButtonText={t("users.filter.clear")}
      />
    </div>
  );
};

export default Users;
