import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Users,
  UserPlus,
  Search,
  Filter,
  MoreVertical,
  Eye,
  Edit,
  Trash2,
  ShoppingCart,
  DollarSign,
  Calendar,
  Shield,
  CheckCircle2,
  XCircle,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";

interface FamilyMember {
  id: string;
  name: string;
  email: string;
  phone: string;
  relation: string;
  permissions: {
    canPlaceOrders: boolean;
    canMakePayments: boolean;
    canViewOrders: boolean;
    canManageAccount: boolean;
  };
  status: "active" | "inactive" | "suspended";
  createdAt: string;
  lastActive: string;
  totalOrders: number;
  totalSpent: number;
}

interface FamilyAccount {
  id: string;
  mainCustomerId: string;
  mainCustomerName: string;
  mainCustomerEmail: string;
  memberCount: number;
  members: FamilyMember[];
  totalOrders: number;
  totalSpent: number;
  status: "active" | "inactive";
  createdAt: string;
}

const mockFamilyAccounts: FamilyAccount[] = [
  {
    id: "1",
    mainCustomerId: "C001",
    mainCustomerName: "John Doe",
    mainCustomerEmail: "john.doe@example.com",
    memberCount: 3,
    members: [
      {
        id: "M001",
        name: "Jane Doe",
        email: "jane.doe@example.com",
        phone: "+1234567890",
        relation: "Spouse",
        permissions: {
          canPlaceOrders: true,
          canMakePayments: true,
          canViewOrders: true,
          canManageAccount: false,
        },
        status: "active",
        createdAt: "2024-01-15",
        lastActive: "2024-03-10",
        totalOrders: 12,
        totalSpent: 1250.0,
      },
      {
        id: "M002",
        name: "Jimmy Doe",
        email: "jimmy.doe@example.com",
        phone: "+1234567891",
        relation: "Son",
        permissions: {
          canPlaceOrders: true,
          canMakePayments: false,
          canViewOrders: true,
          canManageAccount: false,
        },
        status: "active",
        createdAt: "2024-02-01",
        lastActive: "2024-03-08",
        totalOrders: 5,
        totalSpent: 450.0,
      },
      {
        id: "M003",
        name: "Sarah Doe",
        email: "sarah.doe@example.com",
        phone: "+1234567892",
        relation: "Daughter",
        permissions: {
          canPlaceOrders: true,
          canMakePayments: false,
          canViewOrders: false,
          canManageAccount: false,
        },
        status: "inactive",
        createdAt: "2024-02-15",
        lastActive: "2024-02-20",
        totalOrders: 2,
        totalSpent: 120.0,
      },
    ],
    totalOrders: 19,
    totalSpent: 1820.0,
    status: "active",
    createdAt: "2024-01-15",
  },
  {
    id: "2",
    mainCustomerId: "C002",
    mainCustomerName: "Alice Smith",
    mainCustomerEmail: "alice.smith@example.com",
    memberCount: 2,
    members: [
      {
        id: "M004",
        name: "Bob Smith",
        email: "bob.smith@example.com",
        phone: "+1234567893",
        relation: "Spouse",
        permissions: {
          canPlaceOrders: true,
          canMakePayments: true,
          canViewOrders: true,
          canManageAccount: true,
        },
        status: "active",
        createdAt: "2024-01-20",
        lastActive: "2024-03-11",
        totalOrders: 8,
        totalSpent: 980.0,
      },
      {
        id: "M005",
        name: "Charlie Smith",
        email: "charlie.smith@example.com",
        phone: "+1234567894",
        relation: "Son",
        permissions: {
          canPlaceOrders: true,
          canMakePayments: false,
          canViewOrders: true,
          canManageAccount: false,
        },
        status: "active",
        createdAt: "2024-02-10",
        lastActive: "2024-03-09",
        totalOrders: 3,
        totalSpent: 340.0,
      },
    ],
    totalOrders: 11,
    totalSpent: 1320.0,
    status: "active",
    createdAt: "2024-01-20",
  },
];

export default function Family() {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [familyAccounts, setFamilyAccounts] =
    useState<FamilyAccount[]>(mockFamilyAccounts);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [selectedAccount, setSelectedAccount] = useState<FamilyAccount | null>(
    null,
  );
  const [selectedMember, setSelectedMember] = useState<FamilyMember | null>(
    null,
  );
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isEditMemberDialogOpen, setIsEditMemberDialogOpen] = useState(false);
  const [isDeleteMemberDialogOpen, setIsDeleteMemberDialogOpen] =
    useState(false);
  const [isAddMemberDialogOpen, setIsAddMemberDialogOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<FamilyMember | null>(null);

  const filteredAccounts = familyAccounts.filter((account) => {
    const matchesSearch =
      account.mainCustomerName
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      account.mainCustomerEmail
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      account.mainCustomerId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter =
      filterStatus === "all" || account.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const totalFamilyAccounts = familyAccounts.length;
  const totalMembers = familyAccounts.reduce(
    (sum, acc) => sum + acc.memberCount,
    0,
  );
  const activeMembers = familyAccounts.reduce(
    (sum, acc) => sum + acc.members.filter((m) => m.status === "active").length,
    0,
  );
  const totalRevenue = familyAccounts.reduce(
    (sum, acc) => sum + acc.totalSpent,
    0,
  );

  const handleViewAccount = (account: FamilyAccount) => {
    setSelectedAccount(account);
    setIsViewDialogOpen(true);
  };

  const handleEditMember = (account: FamilyAccount, member: FamilyMember) => {
    setSelectedAccount(account);
    setEditingMember({ ...member });
    setIsEditMemberDialogOpen(true);
  };

  const handleDeleteMember = (account: FamilyAccount, member: FamilyMember) => {
    setSelectedAccount(account);
    setSelectedMember(member);
    setIsDeleteMemberDialogOpen(true);
  };

  const handleAddMember = (account: FamilyAccount) => {
    setSelectedAccount(account);
    setEditingMember({
      id: "",
      name: "",
      email: "",
      phone: "",
      relation: "",
      permissions: {
        canPlaceOrders: false,
        canMakePayments: false,
        canViewOrders: false,
        canManageAccount: false,
      },
      status: "active",
      createdAt: new Date().toISOString().split("T")[0],
      lastActive: new Date().toISOString().split("T")[0],
      totalOrders: 0,
      totalSpent: 0,
    });
    setIsAddMemberDialogOpen(true);
  };

  const handleSaveMember = () => {
    if (!editingMember || !selectedAccount) return;

    const updatedAccounts = familyAccounts.map((account) => {
      if (account.id === selectedAccount.id) {
        const memberExists = account.members.some(
          (m) => m.id === editingMember.id,
        );
        const updatedMembers = memberExists
          ? account.members.map((m) =>
              m.id === editingMember.id ? editingMember : m,
            )
          : [...account.members, { ...editingMember, id: `M${Date.now()}` }];

        return {
          ...account,
          members: updatedMembers,
          memberCount: updatedMembers.length,
        };
      }
      return account;
    });

    setFamilyAccounts(updatedAccounts);
    setIsEditMemberDialogOpen(false);
    setIsAddMemberDialogOpen(false);
    toast({
      title: "Success",
      description: `Family member ${
        editingMember.id ? "updated" : "added"
      } successfully`,
    });
  };

  const handleConfirmDeleteMember = () => {
    if (!selectedMember || !selectedAccount) return;

    const updatedAccounts = familyAccounts.map((account) => {
      if (account.id === selectedAccount.id) {
        const updatedMembers = account.members.filter(
          (m) => m.id !== selectedMember.id,
        );
        return {
          ...account,
          members: updatedMembers,
          memberCount: updatedMembers.length,
        };
      }
      return account;
    });

    setFamilyAccounts(updatedAccounts);
    setIsDeleteMemberDialogOpen(false);
    toast({
      title: "Success",
      description: "Family member removed successfully",
    });
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive"> = {
      active: "default",
      inactive: "secondary",
      suspended: "destructive",
    };
    return <Badge variant={variants[status] || "default"}>{status}</Badge>;
  };

  return (
    <div className="">
      {/* Header */}
      <div>
        <CardTitle>{t("nav.family")}</CardTitle>
        <CardDescription>Manage family accounts and members</CardDescription>
      </div>

      {/* Statistics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Family Accounts
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl ">{totalFamilyAccounts}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Members</CardTitle>
            <UserPlus className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl ">{totalMembers}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Active Members
            </CardTitle>
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl ">{activeMembers}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl ">${totalRevenue.toFixed(2)}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle>Family Accounts</CardTitle>
          <CardDescription>View and manage all family accounts</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-4">
            <div className="flex flex-1 gap-2">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name, email, or ID..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-[150px]">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Customer ID</TableHead>
                  <TableHead>Main Account</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Members</TableHead>
                  <TableHead>Total Orders</TableHead>
                  <TableHead>Total Spent</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAccounts.map((account) => (
                  <TableRow key={account.id}>
                    <TableCell className="font-medium">
                      {account.mainCustomerId}
                    </TableCell>
                    <TableCell>{account.mainCustomerName}</TableCell>
                    <TableCell>{account.mainCustomerEmail}</TableCell>
                    <TableCell>{account.memberCount}</TableCell>
                    <TableCell>{account.totalOrders}</TableCell>
                    <TableCell>${account.totalSpent.toFixed(2)}</TableCell>
                    <TableCell>{getStatusBadge(account.status)}</TableCell>
                    <TableCell>{account.createdAt}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => handleViewAccount(account)}
                          >
                            <Eye className="mr-2 h-4 w-4" />
                            View Members
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleAddMember(account)}
                          >
                            <UserPlus className="mr-2 h-4 w-4" />
                            Add Member
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* View Family Members Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              Family Members - {selectedAccount?.mainCustomerName}
            </DialogTitle>
            <DialogDescription>
              Manage family members for {selectedAccount?.mainCustomerEmail}
            </DialogDescription>
          </DialogHeader>
          {selectedAccount && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <p className="text-sm text-muted-foreground">
                  Total Members: {selectedAccount.memberCount}
                </p>
                <Button
                  onClick={() => handleAddMember(selectedAccount)}
                  size="sm"
                >
                  <UserPlus className="h-4 w-4 mr-2" />
                  Add Member
                </Button>
              </div>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Relation</TableHead>
                      <TableHead>Orders</TableHead>
                      <TableHead>Spent</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {selectedAccount.members.map((member) => (
                      <TableRow key={member.id}>
                        <TableCell className="font-medium">
                          {member.name}
                        </TableCell>
                        <TableCell>{member.email}</TableCell>
                        <TableCell>{member.relation}</TableCell>
                        <TableCell>{member.totalOrders}</TableCell>
                        <TableCell>${member.totalSpent.toFixed(2)}</TableCell>
                        <TableCell>{getStatusBadge(member.status)}</TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                onClick={() =>
                                  handleEditMember(selectedAccount, member)
                                }
                              >
                                <Edit className="mr-2 h-4 w-4" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() =>
                                  handleDeleteMember(selectedAccount, member)
                                }
                                className="text-destructive"
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Remove
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit/Add Member Dialog */}
      <Dialog
        open={isEditMemberDialogOpen || isAddMemberDialogOpen}
        onOpenChange={(open) => {
          setIsEditMemberDialogOpen(open);
          setIsAddMemberDialogOpen(open);
        }}
      >
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingMember?.id ? "Edit Family Member" : "Add Family Member"}
            </DialogTitle>
            <DialogDescription>
              {editingMember?.id
                ? "Update member details and permissions"
                : "Add a new family member"}
            </DialogDescription>
          </DialogHeader>
          {editingMember && (
            <div className="space-y-4">
              <Tabs defaultValue="details">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="details">Details</TabsTrigger>
                  <TabsTrigger value="permissions">Permissions</TabsTrigger>
                </TabsList>
                <TabsContent value="details" className="space-y-4">
                  <div className="grid gap-4">
                    <div className="grid gap-2">
                      <Label>Name</Label>
                      <Input
                        value={editingMember.name}
                        onChange={(e) =>
                          setEditingMember({
                            ...editingMember,
                            name: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label>Email</Label>
                      <Input
                        type="email"
                        value={editingMember.email}
                        onChange={(e) =>
                          setEditingMember({
                            ...editingMember,
                            email: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label>Phone</Label>
                      <Input
                        value={editingMember.phone}
                        onChange={(e) =>
                          setEditingMember({
                            ...editingMember,
                            phone: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label>Relation</Label>
                      <Select
                        value={editingMember.relation}
                        onValueChange={(value) =>
                          setEditingMember({
                            ...editingMember,
                            relation: value,
                          })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Spouse">Spouse</SelectItem>
                          <SelectItem value="Son">Son</SelectItem>
                          <SelectItem value="Daughter">Daughter</SelectItem>
                          <SelectItem value="Parent">Parent</SelectItem>
                          <SelectItem value="Sibling">Sibling</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid gap-2">
                      <Label>Status</Label>
                      <Select
                        value={editingMember.status}
                        onValueChange={(value: any) =>
                          setEditingMember({ ...editingMember, status: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="inactive">Inactive</SelectItem>
                          <SelectItem value="suspended">Suspended</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="permissions" className="space-y-4">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Can Place Orders</Label>
                        <p className="text-sm text-muted-foreground">
                          Allow member to create and place orders
                        </p>
                      </div>
                      <Switch
                        checked={editingMember.permissions.canPlaceOrders}
                        onCheckedChange={(checked) =>
                          setEditingMember({
                            ...editingMember,
                            permissions: {
                              ...editingMember.permissions,
                              canPlaceOrders: checked,
                            },
                          })
                        }
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Can Make Payments</Label>
                        <p className="text-sm text-muted-foreground">
                          Allow member to process payments
                        </p>
                      </div>
                      <Switch
                        checked={editingMember.permissions.canMakePayments}
                        onCheckedChange={(checked) =>
                          setEditingMember({
                            ...editingMember,
                            permissions: {
                              ...editingMember.permissions,
                              canMakePayments: checked,
                            },
                          })
                        }
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Can View Orders</Label>
                        <p className="text-sm text-muted-foreground">
                          Allow member to view order history
                        </p>
                      </div>
                      <Switch
                        checked={editingMember.permissions.canViewOrders}
                        onCheckedChange={(checked) =>
                          setEditingMember({
                            ...editingMember,
                            permissions: {
                              ...editingMember.permissions,
                              canViewOrders: checked,
                            },
                          })
                        }
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Can Manage Account</Label>
                        <p className="text-sm text-muted-foreground">
                          Allow member to manage account settings
                        </p>
                      </div>
                      <Switch
                        checked={editingMember.permissions.canManageAccount}
                        onCheckedChange={(checked) =>
                          setEditingMember({
                            ...editingMember,
                            permissions: {
                              ...editingMember.permissions,
                              canManageAccount: checked,
                            },
                          })
                        }
                      />
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsEditMemberDialogOpen(false);
                setIsAddMemberDialogOpen(false);
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleSaveMember}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Member Dialog */}
      <Dialog
        open={isDeleteMemberDialogOpen}
        onOpenChange={setIsDeleteMemberDialogOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Remove Family Member</DialogTitle>
            <DialogDescription>
              Are you sure you want to remove {selectedMember?.name} from this
              family account? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteMemberDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleConfirmDeleteMember}>
              Remove Member
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
