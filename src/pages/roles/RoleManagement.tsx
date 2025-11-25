import { useState, useCallback } from "react";
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
      toast.success("Role deleted successfully");
      refreshTable?.();
    } catch (error) {
      console.error("Error deleting role:", error);
      toast.error("Failed to delete role");
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
        `Role ${!role.isActive ? "activated" : "deactivated"} successfully`
      );
    } catch (error) {
      console.error("Error toggling role status:", error);
      toast.error(
        error?.response?.data?.message || "Failed to update role status"
      );
    } finally {
      setTogglingRoleId(null);
    }
  };

  // Define actions for dropdown menu
  const roleActions = (role: Role): ActionItem<Role>[] => [
    {
      label: "View Details",
      icon: Eye,
      show: role.name !== constData.roles.CUSTOMER,
      onClick: handleViewDetails,
    },
    {
      label: "Edit Role",
      icon: Edit,
      show:
        role.name !== constData.roles.SUPER_ADMIN &&
        role.name !== constData.roles.CUSTOMER, // Prevent editing super admin and admin roles
      onClick: handleEdit,
    },
    {
      label: "Delete Role",
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
      label: "Sl.",
      render: (_, index) => index + 1,
      className: "text-center",
    },
    {
      key: "name",
      label: "Role Name",
      render: (role) => (
        <div>
          <p className="font-medium">{role.display_name}</p>
          <p className="text-xs text-muted-foreground">{role.name}</p>
        </div>
      ),
    },
    {
      key: "description",
      label: "Description",
      render: (role) => (
        <p className="text-sm text-muted-foreground truncate max-w-md">
          {role.description || "No description"}
        </p>
      ),
    },
    {
      key: "permissions_count",
      label: "Permissions",
      render: (role) => (
        <Badge variant="outline" className="text-center">
          {role.permissions_count || role.permissions?.length || 0}
        </Badge>
      ),
      className: "text-center",
    },
    {
      key: "users_count",
      label: "Users",
      render: (role) => (
        <Badge variant="secondary" className="text-center">
          {role.users_count || 0}
        </Badge>
      ),
      className: "text-center",
    },
    {
      key: "isActive",
      label: "Status",
      render: (role) => (
        <div className="flex items-center justify-center gap-2">
          <Badge variant={role.isActive ? "default" : "secondary"}>
            {role.isActive ? "Active" : "Inactive"}
          </Badge>
        </div>
      ),
      className: "text-center",
    },
    {
      key: "actions",
      label: "Actions",
      className: "text-right",
      render: (role) => (
        <DropdownMenuActions item={role} actions={roleActions(role)} />
      ),
    },
  ];

  const summaryLists = [
    {
      title: "Total Roles",
      value: store.statistics.total_roles,
      icon: Shield,
      color: "text-muted-foreground",
    },
    {
      title: "Active Roles",
      value: store.statistics.active_roles,
      icon: ShieldCheck,
      color: "text-green-600",
    },
    {
      title: "Inactive Roles",
      value: store.statistics.inactive_roles,
      icon: ShieldOff,
      color: "text-orange-600",
    },
    {
      title: "Roles with Users",
      value: store.statistics.roles_with_users,
      icon: ShieldCheck,
      color: "text-blue-600",
    },
    {
      title: "Roles without Users",
      value: store.statistics.roles_without_users,
      icon: ShieldOff,
      color: "text-red-600",
    },
  ];

  return (
    <div className="animate-fade-in">
      <BaseTableList<Role>
        title="Role Management"
        description="Manage roles and permissions"
        headerActions={[
          {
            label: "Add Role",
            icon: Plus,
            onClick: handleCreate,
            variant: "default",
          },
        ]}
        searchPlaceholder="Search by role name or description..."
        enableSearch={true}
        columns={columns}
        service={roleService}
        store={store}
        emptyMessage="No roles found"
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
        title="Delete Role"
        description={`Are you sure you want to delete ${selectedRole?.display_name}? This action cannot be undone.`}
        onConfirm={handleDeleteRole}
        isDeleting={isDeleting}
      />
    </div>
  );
};

export default RoleManagement;
