import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Search, UserPlus, Edit, Trash2, Shield, Settings, Lock } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface Permission {
  id: string;
  name: string;
  description: string;
  category: string;
}

interface Role {
  id: string;
  name: string;
  description: string;
  permissionIds: string[];
  userCount: number;
}

const availablePermissions: Permission[] = [
  // User Management
  { id: 'user_view', name: 'View Users', description: 'Can view user list and details', category: 'Users' },
  { id: 'user_create', name: 'Create Users', description: 'Can create new users', category: 'Users' },
  { id: 'user_edit', name: 'Edit Users', description: 'Can edit user information', category: 'Users' },
  { id: 'user_delete', name: 'Delete Users', description: 'Can delete users', category: 'Users' },
  
  // Product Management
  { id: 'product_view', name: 'View Products', description: 'Can view product list', category: 'Products' },
  { id: 'product_create', name: 'Create Products', description: 'Can create new products', category: 'Products' },
  { id: 'product_edit', name: 'Edit Products', description: 'Can edit product information', category: 'Products' },
  { id: 'product_delete', name: 'Delete Products', description: 'Can delete products', category: 'Products' },
  
  // Order Management
  { id: 'order_view', name: 'View Orders', description: 'Can view order list', category: 'Orders' },
  { id: 'order_edit', name: 'Edit Orders', description: 'Can edit order status', category: 'Orders' },
  { id: 'order_delete', name: 'Delete Orders', description: 'Can delete orders', category: 'Orders' },
  
  // Financial
  { id: 'financial_view', name: 'View Financial', description: 'Can view financial reports', category: 'Financial' },
  { id: 'financial_manage', name: 'Manage Financial', description: 'Can manage financial settings', category: 'Financial' },
  
  // Delivery
  { id: 'delivery_view', name: 'View Deliveries', description: 'Can view delivery list', category: 'Delivery' },
  { id: 'delivery_manage', name: 'Manage Deliveries', description: 'Can manage delivery status', category: 'Delivery' },
  
  // Reports
  { id: 'reports_view', name: 'View Reports', description: 'Can view all reports', category: 'Reports' },
  { id: 'reports_export', name: 'Export Reports', description: 'Can export reports', category: 'Reports' },
  
  // Settings
  { id: 'settings_view', name: 'View Settings', description: 'Can view settings', category: 'Settings' },
  { id: 'settings_edit', name: 'Edit Settings', description: 'Can modify system settings', category: 'Settings' },
  
  // Roles & Permissions
  { id: 'role_view', name: 'View Roles', description: 'Can view roles', category: 'Roles' },
  { id: 'role_manage', name: 'Manage Roles', description: 'Can create, edit, delete roles', category: 'Roles' },
];

const mockRoles: Role[] = [
  {
    id: '1',
    name: 'Admin',
    description: 'Full system access with all permissions',
    permissionIds: availablePermissions.map(p => p.id),
    userCount: 5,
  },
  {
    id: '2',
    name: 'Moderator',
    description: 'Can manage products, orders, and deliveries',
    permissionIds: [
      'user_view', 'product_view', 'product_create', 'product_edit',
      'order_view', 'order_edit', 'delivery_view', 'delivery_manage'
    ],
    userCount: 12,
  },
  {
    id: '3',
    name: 'User',
    description: 'Basic viewing permissions only',
    permissionIds: ['product_view', 'order_view'],
    userCount: 143,
  },
];

interface UserRole {
  id: string;
  userName: string;
  email: string;
  role: 'admin' | 'moderator' | 'user';
  assignedDate: string;
  assignedBy: string;
}

const mockUserRoles: UserRole[] = [
  {
    id: '1',
    userName: 'John Doe',
    email: 'john@example.com',
    role: 'admin',
    assignedDate: '2024-01-15',
    assignedBy: 'System',
  },
  {
    id: '2',
    userName: 'Jane Smith',
    email: 'jane@example.com',
    role: 'moderator',
    assignedDate: '2024-02-20',
    assignedBy: 'John Doe',
  },
  {
    id: '3',
    userName: 'Bob Wilson',
    email: 'bob@example.com',
    role: 'user',
    assignedDate: '2024-03-10',
    assignedBy: 'Jane Smith',
  },
];

export default function RoleManagement() {
  const { t } = useTranslation();
  const [roles, setRoles] = useState<Role[]>(mockRoles);
  const [userRoles, setUserRoles] = useState<UserRole[]>(mockUserRoles);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isRoleDialogOpen, setIsRoleDialogOpen] = useState(false);
  const [isDeleteRoleDialogOpen, setIsDeleteRoleDialogOpen] = useState(false);
  const [selectedUserRole, setSelectedUserRole] = useState<UserRole | null>(null);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [formData, setFormData] = useState({
    userName: '',
    email: '',
    role: 'user' as 'admin' | 'moderator' | 'user',
  });
  const [roleFormData, setRoleFormData] = useState({
    name: '',
    description: '',
    permissionIds: [] as string[],
  });

  const filteredUserRoles = userRoles.filter(
    (ur) =>
      ur.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ur.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ur.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAssignRole = () => {
    setFormData({ userName: '', email: '', role: 'user' });
    setIsAssignDialogOpen(true);
  };

  const handleEditUserRole = (userRole: UserRole) => {
    setSelectedUserRole(userRole);
    setFormData({
      userName: userRole.userName,
      email: userRole.email,
      role: userRole.role,
    });
    setIsEditDialogOpen(true);
  };

  const handleDeleteUserRole = (userRole: UserRole) => {
    setSelectedUserRole(userRole);
    setIsDeleteDialogOpen(true);
  };

  const handleSaveRole = () => {
    if (selectedUserRole) {
      setUserRoles(
        userRoles.map((ur) =>
          ur.id === selectedUserRole.id
            ? { ...ur, ...formData, assignedDate: new Date().toISOString().split('T')[0] }
            : ur
        )
      );
      toast({
        title: 'Success',
        description: 'Role updated successfully',
      });
    } else {
      const newUserRole: UserRole = {
        id: Math.random().toString(36).substr(2, 9),
        ...formData,
        assignedDate: new Date().toISOString().split('T')[0],
        assignedBy: 'Current User',
      };
      setUserRoles([...userRoles, newUserRole]);
      toast({
        title: 'Success',
        description: 'Role assigned successfully',
      });
    }
    setIsAssignDialogOpen(false);
    setIsEditDialogOpen(false);
    setSelectedUserRole(null);
  };

  const confirmDelete = () => {
    if (selectedUserRole) {
      setUserRoles(userRoles.filter((ur) => ur.id !== selectedUserRole.id));
      toast({
        title: 'Success',
        description: 'Role removed successfully',
      });
    }
    setIsDeleteDialogOpen(false);
    setSelectedUserRole(null);
  };

  const handleCreateRole = () => {
    setSelectedRole(null);
    setRoleFormData({ name: '', description: '', permissionIds: [] });
    setIsRoleDialogOpen(true);
  };

  const handleEditRole = (role: Role) => {
    setSelectedRole(role);
    setRoleFormData({
      name: role.name,
      description: role.description,
      permissionIds: role.permissionIds,
    });
    setIsRoleDialogOpen(true);
  };

  const handleDeleteRole = (role: Role) => {
    setSelectedRole(role);
    setIsDeleteRoleDialogOpen(true);
  };

  const handleSaveRolePermissions = () => {
    if (selectedRole) {
      setRoles(
        roles.map((r) =>
          r.id === selectedRole.id ? { ...r, ...roleFormData } : r
        )
      );
      toast({
        title: 'Success',
        description: 'Role updated successfully',
      });
    } else {
      const newRole: Role = {
        id: Math.random().toString(36).substr(2, 9),
        ...roleFormData,
        userCount: 0,
      };
      setRoles([...roles, newRole]);
      toast({
        title: 'Success',
        description: 'Role created successfully',
      });
    }
    setIsRoleDialogOpen(false);
    setSelectedRole(null);
  };

  const confirmDeleteRole = () => {
    if (selectedRole) {
      setRoles(roles.filter((r) => r.id !== selectedRole.id));
      toast({
        title: 'Success',
        description: 'Role deleted successfully',
      });
    }
    setIsDeleteRoleDialogOpen(false);
    setSelectedRole(null);
  };

  const togglePermission = (permissionId: string) => {
    setRoleFormData((prev) => ({
      ...prev,
      permissionIds: prev.permissionIds.includes(permissionId)
        ? prev.permissionIds.filter((id) => id !== permissionId)
        : [...prev.permissionIds, permissionId],
    }));
  };

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'admin':
        return 'destructive';
      case 'moderator':
        return 'default';
      default:
        return 'secondary';
    }
  };

  const groupPermissionsByCategory = () => {
    const grouped: Record<string, Permission[]> = {};
    availablePermissions.forEach((permission) => {
      if (!grouped[permission.category]) {
        grouped[permission.category] = [];
      }
      grouped[permission.category].push(permission);
    });
    return grouped;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Role Management</h1>
          <p className="text-muted-foreground mt-2">
            Manage roles, permissions, and user assignments
          </p>
        </div>
      </div>

      <Tabs defaultValue="users" className="space-y-6">
        <TabsList>
          <TabsTrigger value="users" className="gap-2">
            <UserPlus className="h-4 w-4" />
            User Roles
          </TabsTrigger>
          <TabsTrigger value="roles" className="gap-2">
            <Shield className="h-4 w-4" />
            Roles & Permissions
          </TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search users..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button onClick={handleAssignRole} className="gap-2">
              <UserPlus className="h-4 w-4" />
              Assign Role
            </Button>
          </div>

          <div className="rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Assigned Date</TableHead>
              <TableHead>Assigned By</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUserRoles.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  No user roles found
                </TableCell>
              </TableRow>
            ) : (
              filteredUserRoles.map((userRole) => (
                <TableRow key={userRole.id}>
                  <TableCell className="font-medium">{userRole.userName}</TableCell>
                  <TableCell>{userRole.email}</TableCell>
                  <TableCell>
                    <Badge variant={getRoleBadgeVariant(userRole.role)}>
                      <Shield className="h-3 w-3 mr-1" />
                      {userRole.role}
                    </Badge>
                  </TableCell>
                  <TableCell>{userRole.assignedDate}</TableCell>
                  <TableCell>{userRole.assignedBy}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEditUserRole(userRole)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteUserRole(userRole)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
          </div>
        </TabsContent>

        <TabsContent value="roles" className="space-y-6">
          <div className="flex items-center justify-end">
            <Button onClick={handleCreateRole} className="gap-2">
              <Shield className="h-4 w-4" />
              Create Role
            </Button>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {roles.map((role) => (
              <Card key={role.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <CardTitle className="flex items-center gap-2">
                        <Shield className="h-5 w-5" />
                        {role.name}
                      </CardTitle>
                      <CardDescription>{role.description}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Users</span>
                    <Badge variant="secondary">{role.userCount}</Badge>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Permissions</span>
                    <Badge variant="secondary">{role.permissionIds.length}</Badge>
                  </div>
                  <div className="flex gap-2 pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => handleEditRole(role)}
                    >
                      <Settings className="h-4 w-4 mr-1" />
                      Configure
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteRole(role)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Assign Role Dialog */}
      <Dialog open={isAssignDialogOpen} onOpenChange={setIsAssignDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Assign Role</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="userName">User Name</Label>
              <Input
                id="userName"
                value={formData.userName}
                onChange={(e) => setFormData({ ...formData, userName: e.target.value })}
                placeholder="Enter user name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="Enter email"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Select
                value={formData.role}
                onValueChange={(value) =>
                  setFormData({ ...formData, role: value as 'admin' | 'moderator' | 'user' })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="user">User</SelectItem>
                  <SelectItem value="moderator">Moderator</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAssignDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveRole}>Assign Role</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Role Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Role</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="editUserName">User Name</Label>
              <Input
                id="editUserName"
                value={formData.userName}
                onChange={(e) => setFormData({ ...formData, userName: e.target.value })}
                placeholder="Enter user name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="editEmail">Email</Label>
              <Input
                id="editEmail"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="Enter email"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="editRole">Role</Label>
              <Select
                value={formData.role}
                onValueChange={(value) =>
                  setFormData({ ...formData, role: value as 'admin' | 'moderator' | 'user' })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="user">User</SelectItem>
                  <SelectItem value="moderator">Moderator</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveRole}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Role Configuration Dialog */}
      <Dialog open={isRoleDialogOpen} onOpenChange={setIsRoleDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Lock className="h-5 w-5" />
              {selectedRole ? 'Edit Role' : 'Create Role'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="roleName">Role Name</Label>
                <Input
                  id="roleName"
                  value={roleFormData.name}
                  onChange={(e) =>
                    setRoleFormData({ ...roleFormData, name: e.target.value })
                  }
                  placeholder="e.g., Content Manager"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="roleDescription">Description</Label>
                <Input
                  id="roleDescription"
                  value={roleFormData.description}
                  onChange={(e) =>
                    setRoleFormData({ ...roleFormData, description: e.target.value })
                  }
                  placeholder="Brief description of the role"
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-base font-semibold">Permissions</Label>
                <Badge variant="secondary">
                  {roleFormData.permissionIds.length} selected
                </Badge>
              </div>
              <div className="space-y-6">
                {Object.entries(groupPermissionsByCategory()).map(([category, permissions]) => (
                  <div key={category} className="space-y-3">
                    <h4 className="font-medium text-sm flex items-center gap-2">
                      <Shield className="h-4 w-4" />
                      {category}
                    </h4>
                    <div className="grid gap-3 ml-6">
                      {permissions.map((permission) => (
                        <div
                          key={permission.id}
                          className="flex items-start space-x-3 rounded-lg border p-3 hover:bg-accent/50 transition-colors"
                        >
                          <Checkbox
                            id={permission.id}
                            checked={roleFormData.permissionIds.includes(permission.id)}
                            onCheckedChange={() => togglePermission(permission.id)}
                          />
                          <div className="flex-1 space-y-1">
                            <Label
                              htmlFor={permission.id}
                              className="text-sm font-medium leading-none cursor-pointer"
                            >
                              {permission.name}
                            </Label>
                            <p className="text-sm text-muted-foreground">
                              {permission.description}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRoleDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveRolePermissions}>
              {selectedRole ? 'Save Changes' : 'Create Role'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete User Role Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove Role</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove the role from {selectedUserRole?.userName}? This
              action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>Remove</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete Role Dialog */}
      <AlertDialog open={isDeleteRoleDialogOpen} onOpenChange={setIsDeleteRoleDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Role</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete the "{selectedRole?.name}" role? This will affect{' '}
              {selectedRole?.userCount} user(s). This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteRole}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
