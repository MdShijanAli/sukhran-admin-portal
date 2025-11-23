import { useState, useCallback } from "react";
import { Eye, Edit, Trash2, Plus } from "lucide-react";
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
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { AvatarFallback } from "@radix-ui/react-avatar";
import { Switch } from "@/components/ui/switch";

const Users = () => {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [dialogMode, setDialogMode] = useState<"create" | "edit" | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [refreshTable, setRefreshTable] = useState<(() => void) | null>(null);
  const [togglingUserId, setTogglingUserId] = useState<number | null>(null);

  const store = useUserStore();

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
      await userService.toggleUserStatus(user.id);
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

  // Define actions for dropdown menu
  const userActions: ActionItem<User>[] = [
    {
      label: "View Details",
      icon: Eye,
      onClick: handleViewDetails,
    },
    {
      label: "Edit User",
      icon: Edit,
      onClick: handleEdit,
    },
    {
      label: "Delete User",
      icon: Trash2,
      onClick: handleDelete,
      variant: "destructive",
      separator: true,
    },
  ];

  // Define table columns
  const columns: Column<User>[] = [
    {
      key: "sl",
      label: "Sl.",
      render: (_, index) => index + 1,
      className: "text-center",
    },
    {
      key: "image_url",
      label: "Image",
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
      label: "Name",
      render: (user) => `${user.firstName} ${user.lastName}`,
    },
    {
      key: "email",
      label: "Email",
    },
    {
      key: "mobile",
      label: "Mobile",
    },
    {
      key: "role",
      label: "Role",
      render: (user) => (
        <Badge variant="outline">{user.role.display_name}</Badge>
      ),
      className: "text-center",
    },
    {
      key: "isActive",
      label: "Status",
      render: (user) => (
        <div className="flex items-center justify-center gap-2">
          <Switch
            checked={user.isActive}
            onCheckedChange={() => handleStatusToggle(user)}
            disabled={togglingUserId === user.id}
          />
          <Badge variant={user.isActive ? "default" : "secondary"}>
            {user.isActive ? "Active" : "Inactive"}
          </Badge>
        </div>
      ),
      className: "text-center",
    },
    {
      key: "actions",
      label: "Actions",
      className: "text-right",
      render: (user) => (
        <DropdownMenuActions item={user} actions={userActions} />
      ),
    },
  ];

  return (
    <div className="animate-fade-in">
      <BaseTableList<User>
        title="User Management"
        description="View and manage all registered users"
        headerActions={[
          {
            label: "Add User",
            icon: Plus,
            onClick: handleCreate,
            variant: "default",
          },
        ]}
        searchPlaceholder="Search by name, email, or mobile..."
        enableSearch={true}
        columns={columns}
        service={userService}
        store={store}
        emptyMessage="No users found"
        getRowKey={(user) => user.id}
        onRefresh={handleSetRefresh}
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
        title="Delete User"
        description={`Are you sure you want to delete ${selectedUser?.firstName} ${selectedUser?.lastName}? This action cannot be undone.`}
        onConfirm={handleDeleteUser}
        isDeleting={isDeleting}
      />
    </div>
  );
};

export default Users;
