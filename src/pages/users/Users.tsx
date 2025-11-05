import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
import {
  Search,
  Filter,
  UserPlus,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  X,
  Plus,
} from "lucide-react";
import { users as initialUsers } from "@/data/mockData";
import { toast } from "@/hooks/use-toast";
import { BaseTableList, Column } from "@/components/table";
import FormModal from "./modal/FormModal";

interface User {
  id: string;
  name: string;
  first_name?: string;
  last_name?: string;
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
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [viewingUser, setViewingUser] = useState<User | null>(null);
  const [deletingUser, setDeletingUser] = useState<User | null>(null);

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
    setEditingUser(null);
    setShowUserDialog(true);
  };

  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setShowUserDialog(true);
  };

  const handleViewUser = (user: User) => {
    setViewingUser(user);
    setShowViewDialog(true);
  };

  const handleDeleteClick = (user: User) => {
    setDeletingUser(user);
    setShowDeleteDialog(true);
  };

  const handleDeleteUser = () => {
    if (deletingUser) {
      setUsers(users.filter((user) => user.id !== deletingUser.id));
      toast({
        title: "Success",
        description: "User deleted successfully",
      });
      setShowDeleteDialog(false);
      setDeletingUser(null);
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
        onClose={() => setShowUserDialog(false)}
        editData={editingUser}
      />

      {/* View User Dialog */}
      <Dialog open={showViewDialog} onOpenChange={setShowViewDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>User Details</DialogTitle>
            <DialogDescription>
              Complete information about this user
            </DialogDescription>
          </DialogHeader>
          {viewingUser && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">Name</Label>
                  <p className="font-medium">{viewingUser.name}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Email</Label>
                  <p className="font-medium">{viewingUser.email}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Phone</Label>
                  <p className="font-medium">{viewingUser.phone}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Location</Label>
                  <p className="font-medium">{viewingUser.location}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Status</Label>
                  <div className="mt-1">
                    <Badge
                      variant={
                        viewingUser.status === "active"
                          ? "default"
                          : "secondary"
                      }
                    >
                      {viewingUser.status}
                    </Badge>
                  </div>
                </div>
                <div>
                  <Label className="text-muted-foreground">Subscription</Label>
                  <div className="mt-1">
                    <Badge
                      variant={
                        viewingUser.subscriptionStatus === "active"
                          ? "default"
                          : "outline"
                      }
                    >
                      {viewingUser.subscriptionStatus}
                    </Badge>
                  </div>
                </div>
                <div>
                  <Label className="text-muted-foreground">
                    Loyalty Points
                  </Label>
                  <p className="font-medium">{viewingUser.loyaltyPoints}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Total Orders</Label>
                  <p className="font-medium">{viewingUser.totalOrders}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Join Date</Label>
                  <p className="font-medium">{viewingUser.joinDate}</p>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setShowViewDialog(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete User</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this user? This action cannot be
              undone.
            </DialogDescription>
          </DialogHeader>
          {deletingUser && (
            <div className="py-4">
              <p className="font-medium">{deletingUser.name}</p>
              <p className="text-sm text-muted-foreground">
                {deletingUser.email}
              </p>
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowDeleteDialog(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteUser}>
              Delete User
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
