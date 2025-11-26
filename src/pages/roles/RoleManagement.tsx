import { useState, useCallback } from "react";
import { useTranslation } from "react-i18next";
import {
  Eye,
  Edit,
  Trash2,
  Plus,
  Shield,
  ShieldCheck,
  ShieldOff,
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
import { Role, useRoleStore } from "@/stores/roleStore";
import roleService from "@/services/roleService";
import { toast } from "sonner";
import { Switch } from "@/components/ui/switch";
import constData from "@/lib/constData";

const RoleManagement = () => {
  const { t } = useTranslation();
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [dialogMode, setDialogMode] = useState<"create" | "edit" | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [refreshTable, setRefreshTable] = useState<(() => void) | null>(null);
  const [togglingRoleId, setTogglingRoleId] = useState<number | string | null>(
    null
  );

  const store = useRoleStore();

  const handleSetRefresh = useCallback((refreshFn: () => void) => {
    setRefreshTable(() => refreshFn);
  }, []);

  const handleCreate = () => {
    setSelectedRole(null);
    setDialogMode("create");
  };

  const handleEdit = (role: Role) => {
    setSelectedRole(role);
    setDialogMode("edit");
  };

  const handleViewDetails = (role: Role) => {
    setSelectedRole(role);
    setShowDetails(true);
  };

  const handleDelete = (role: Role) => {
    setSelectedRole(role);
    setShowDelete(true);
  };

  const handleDeleteRole = async () => {
    if (!selectedRole) return;
    setIsDeleting(true);
    try {
      await roleService.deleteItem(selectedRole.id);
      toast.success(t("roles.messages.roleDeleted"));
      refreshTable?.();
    } catch (error) {
      console.error("Error deleting role:", error);
      toast.error(t("roles.messages.failedToDelete"));
    } finally {
      setIsDeleting(false);
      setShowDelete(false);
    }
  };

  const handleStatusToggle = async (role: Role) => {
    setTogglingRoleId(role.id);
    try {
      await roleService.toggleRoleStatus(role.id);
      toast.success(
        !role.isActive
          ? t("roles.messages.roleActivated")
          : t("roles.messages.roleDeactivated")
      );
    } catch (error) {
      console.error("Error toggling role status:", error);
      toast.error(
        error?.response?.data?.message ||
          t("roles.messages.failedToToggleStatus")
      );
    } finally {
      setTogglingRoleId(null);
    }
  };

  // Define actions for dropdown menu
  const roleActions = (role: Role): ActionItem<Role>[] => [
    {
      label: t("roles.actions.viewDetails"),
      icon: Eye,
      show: role.name !== constData.roles.CUSTOMER,
      onClick: handleViewDetails,
    },
    {
      label: t("roles.actions.editRole"),
      icon: Edit,
      show:
        role.name !== constData.roles.SUPER_ADMIN &&
        role.name !== constData.roles.CUSTOMER, // Prevent editing super admin and admin roles
      onClick: handleEdit,
    },
    {
      label: t("roles.actions.deleteRole"),
      icon: Trash2,
      onClick: handleDelete,
      show: role.users_count === 0 && role.name !== constData.roles.CUSTOMER, // Only show delete if no users assigned
      variant: "destructive",
      separator: true,
    },
  ];

  // Define table columns
  const columns: Column<Role>[] = [
    {
      key: "sl",
      label: t("roles.columns.sl"),
      render: (_, index) => index + 1,
      className: "text-center",
    },
    {
      key: "name",
      label: t("roles.columns.roleName"),
      render: (role) => (
        <div>
          <p className="font-medium">{role.display_name}</p>
          <p className="text-xs text-muted-foreground">{role.name}</p>
        </div>
      ),
    },
    {
      key: "description",
      label: t("roles.columns.description"),
      render: (role) => (
        <p className="text-sm text-muted-foreground truncate max-w-md">
          {role.description || t("roles.columns.noDescription")}
        </p>
      ),
    },
    {
      key: "permissions_count",
      label: t("roles.columns.permissions"),
      render: (role) => (
        <Badge variant="outline" className="text-center">
          {role.permissions_count || role.permissions?.length || 0}
        </Badge>
      ),
      className: "text-center",
    },
    {
      key: "users_count",
      label: t("roles.columns.users"),
      render: (role) => (
        <Badge variant="secondary" className="text-center">
          {role.users_count || 0}
        </Badge>
      ),
      className: "text-center",
    },
    {
      key: "isActive",
      label: t("roles.columns.status"),
      render: (role) => (
        <div className="flex items-center justify-center gap-2">
          <Badge variant={role.isActive ? "default" : "secondary"}>
            {role.isActive
              ? t("roles.status.active")
              : t("roles.status.inactive")}
          </Badge>
        </div>
      ),
      className: "text-center",
    },
    {
      key: "actions",
      label: t("roles.columns.actions"),
      className: "text-right",
      render: (role) => (
        <DropdownMenuActions item={role} actions={roleActions(role)} />
      ),
    },
  ];

  const summaryLists = [
    {
      title: t("roles.totalRoles"),
      value: store.statistics.total_roles,
      icon: Shield,
      color: "text-muted-foreground",
    },
    {
      title: t("roles.activeRoles"),
      value: store.statistics.active_roles,
      icon: ShieldCheck,
      color: "text-green-600",
    },
    {
      title: t("roles.inactiveRoles"),
      value: store.statistics.inactive_roles,
      icon: ShieldOff,
      color: "text-orange-600",
    },
    {
      title: t("roles.rolesWithUsers"),
      value: store.statistics.roles_with_users,
      icon: ShieldCheck,
      color: "text-blue-600",
    },
    {
      title: t("roles.rolesWithoutUsers"),
      value: store.statistics.roles_without_users,
      icon: ShieldOff,
      color: "text-red-600",
    },
  ];

  return (
    <div className="animate-fade-in">
      <BaseTableList<Role>
        title={t("roles.title")}
        description={t("roles.subtitle")}
        headerActions={[
          {
            label: t("roles.addRole"),
            icon: Plus,
            onClick: handleCreate,
            variant: "default",
          },
        ]}
        searchPlaceholder={t("roles.searchPlaceholder")}
        enableSearch={true}
        columns={columns}
        service={roleService}
        store={store}
        emptyMessage={t("roles.noRolesFound")}
        getRowKey={(role) => role.id}
        onRefresh={handleSetRefresh}
        summaryLists={summaryLists}
      />

      {/* Dialogs */}
      <FormModal
        open={dialogMode !== null}
        onClose={() => setDialogMode(null)}
        editData={selectedRole || undefined}
        onSuccess={() => refreshTable?.()}
      />

      <ViewModal
        open={showDetails}
        onClose={setShowDetails}
        roleId={selectedRole?.id || null}
      />

      <DeleteModal
        open={showDelete}
        onClose={setShowDelete}
        title={t("roles.delete.title")}
        description={`${t("roles.delete.message")} ${
          selectedRole?.display_name
        }? ${t("roles.delete.cannotUndo")}`}
        onConfirm={handleDeleteRole}
        isDeleting={isDeleting}
      />
    </div>
  );
};

export default RoleManagement;
