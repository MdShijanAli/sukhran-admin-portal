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
import { Search, UserPlus, Edit, Trash2, Shield } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

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
  const [userRoles, setUserRoles] = useState<UserRole[]>(mockUserRoles);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedUserRole, setSelectedUserRole] = useState<UserRole | null>(null);
  const [formData, setFormData] = useState({
    userName: '',
    email: '',
    role: 'user' as 'admin' | 'moderator' | 'user',
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

  const handleEditRole = (userRole: UserRole) => {
    setSelectedUserRole(userRole);
    setFormData({
      userName: userRole.userName,
      email: userRole.email,
      role: userRole.role,
    });
    setIsEditDialogOpen(true);
  };

  const handleDeleteRole = (userRole: UserRole) => {
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Role Management</h1>
          <p className="text-muted-foreground mt-2">
            Manage user roles and permissions
          </p>
        </div>
        <Button onClick={handleAssignRole} className="gap-2">
          <UserPlus className="h-4 w-4" />
          Assign Role
        </Button>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
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
                        onClick={() => handleEditRole(userRole)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteRole(userRole)}
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

      {/* Delete Confirmation Dialog */}
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
    </div>
  );
}
