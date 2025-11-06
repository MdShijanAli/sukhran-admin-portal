import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Filter, MoreHorizontal, Eye, Edit, Trash2, Plus } from "lucide-react";
import { users as initialUsers } from "@/data/mockData";
import { toast } from "@/hooks/use-toast";
import { BaseTableList, Column } from "@/components/table";
import { DeleteModal } from "@/components/modals";
import FormModal from "./modal/FormModal";
import ViewModal from "./modal/ViewModal";

interface User {
  id: string;
  name: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  location: string;
  status: string;
  subscriptionStatus: string;
  loyaltyPoints: number;
  totalOrders: number;
  joinDate: string;
}

export default function Users() {
  const { t } = useTranslation();
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterSubscription, setFilterSubscription] = useState<string>("all");
  const [showFilterDialog, setShowFilterDialog] = useState(false);
  const [showUserDialog, setShowUserDialog] = useState(false);
  const [showViewDialog, setShowViewDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      filterStatus === "all" || user.status === filterStatus;
    const matchesSubscription =
      filterSubscription === "all" ||
      user.subscriptionStatus === filterSubscription;
    return matchesSearch && matchesStatus && matchesSubscription;
  });

  const handleAddUser = () => {
    setSelectedUser(null);
    setShowUserDialog(true);
  };

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setShowUserDialog(true);
  };

  const handleViewUser = (user: User) => {
    setSelectedUser(user);
    setShowViewDialog(true);
  };

  const handleCloseUserDialog = () => {
    setShowUserDialog(false);
    setSelectedUser(null);
  };

  const handleDeleteClick = (user: User) => {
    setSelectedUser(user);
    setShowDeleteDialog(true);
  };

  const handleDeleteUser = () => {
    if (selectedUser) {
      setUsers(users.filter((user) => user.id !== selectedUser.id));
      toast({
        title: "Success",
        description: "User deleted successfully",
      });
      setShowDeleteDialog(false);
      setSelectedUser(null);
    }
  };

  const handleClearFilters = () => {
    setFilterStatus("all");
    setFilterSubscription("all");
    setShowFilterDialog(false);
  };

  // Define table columns
  const columns: Column<User>[] = [
    {
      key: "name",
      label: "Name",
    },
    {
      key: "email",
      label: "Email",
    },
    {
      key: "phone",
      label: "Phone",
    },
    {
      key: "location",
      label: "Location",
      className: "max-w-[200px]",
    },
    {
      key: "status",
      label: "Status",
      render: (user) => (
        <Badge variant={user.status === "active" ? "default" : "secondary"}>
          {user.status}
        </Badge>
      ),
    },
    {
      key: "subscription",
      label: "Subscription",
      render: (user) => (
        <Badge
          variant={user.subscriptionStatus === "active" ? "default" : "outline"}
        >
          {user.subscriptionStatus}
        </Badge>
      ),
    },
    {
      key: "loyaltyPoints",
      label: "Loyalty Points",
    },
    {
      key: "totalOrders",
      label: "Orders",
    },
    {
      key: "actions",
      label: "Actions",
      className: "text-right",
      render: (user) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => handleViewUser(user)}>
              <Eye className="mr-2 h-4 w-4" />
              View Details
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleEditUser(user)}>
              <Edit className="mr-2 h-4 w-4" />
              Edit User
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => handleDeleteClick(user)}
              className="text-destructive"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete User
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  return (
    <div className="animate-fade-in">
      <BaseTableList
        title="User Management"
        description="View and manage all registered users"
        headerActions={[
          {
            label: "Add User",
            icon: Plus,
            onClick: handleAddUser,
            variant: "default",
          },
        ]}
        toolbarActions={
          <Button variant="outline" onClick={() => setShowFilterDialog(true)}>
            <Filter className="mr-2 h-4 w-4" />
            Filter
          </Button>
        }
        searchPlaceholder="Search by name, email, or phone..."
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
        columns={columns}
        data={filteredUsers}
        emptyMessage="No users found"
        getRowKey={(user) => user.id}
      />

      {/* Filter Dialog */}
      <Dialog open={showFilterDialog} onOpenChange={setShowFilterDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Filter Users</DialogTitle>
            <DialogDescription>
              Apply filters to narrow down the user list
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Account Status</Label>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="suspended">Suspended</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Subscription Status</Label>
              <Select
                value={filterSubscription}
                onValueChange={setFilterSubscription}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Subscriptions</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="expired">Expired</SelectItem>
                  <SelectItem value="none">None</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={handleClearFilters}>
              Clear Filters
            </Button>
            <Button onClick={() => setShowFilterDialog(false)}>
              Apply Filters
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create/Edit User Form Modal */}
      <FormModal
        open={showUserDialog}
        onClose={handleCloseUserDialog}
        editData={selectedUser}
      />

      {/* View User Modal */}
      <ViewModal
        open={showViewDialog}
        onClose={() => setShowViewDialog(false)}
        user={selectedUser}
      />

      {/* Delete Confirmation Dialog */}
      <DeleteModal
        open={showDeleteDialog}
        onClose={setShowDeleteDialog}
        title="Delete User"
        description={`Are you sure you want to delete user ${selectedUser?.name}? This action cannot be undone.`}
        onConfirm={handleDeleteUser}
      />
    </div>
  );
}
