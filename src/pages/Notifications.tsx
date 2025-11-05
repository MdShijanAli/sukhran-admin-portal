import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Search,
  Plus,
  Edit,
  Trash2,
  Bell,
  Mail,
  MessageSquare,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface Notification {
  id: string;
  title: string;
  message: string;
  type: "info" | "success" | "warning" | "error";
  channel: "email" | "push" | "sms" | "in-app";
  status: "sent" | "pending" | "failed";
  sentDate: string;
  recipient: string;
  isActive: boolean;
}

const mockNotifications: Notification[] = [
  {
    id: "1",
    title: "Order Confirmation",
    message: "Your order #12345 has been confirmed",
    type: "success",
    channel: "email",
    status: "sent",
    sentDate: "2024-01-15 10:30",
    recipient: "customer@example.com",
    isActive: true,
  },
  {
    id: "2",
    title: "Payment Failed",
    message: "Payment for order #12346 failed. Please update payment method.",
    type: "error",
    channel: "push",
    status: "sent",
    sentDate: "2024-01-16 14:20",
    recipient: "user@example.com",
    isActive: true,
  },
  {
    id: "3",
    title: "Delivery Update",
    message: "Your package is out for delivery",
    type: "info",
    channel: "sms",
    status: "pending",
    sentDate: "2024-01-17 09:15",
    recipient: "+1234567890",
    isActive: true,
  },
];

export default function Notifications() {
  const { t } = useTranslation();
  const [notifications, setNotifications] =
    useState<Notification[]>(mockNotifications);
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedNotification, setSelectedNotification] =
    useState<Notification | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    message: "",
    type: "info" as "info" | "success" | "warning" | "error",
    channel: "email" as "email" | "push" | "sms" | "in-app",
    recipient: "",
    isActive: true,
  });

  const filteredNotifications = notifications.filter(
    (notif) =>
      notif.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      notif.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
      notif.recipient.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreateNotification = () => {
    setFormData({
      title: "",
      message: "",
      type: "info",
      channel: "email",
      recipient: "",
      isActive: true,
    });
    setIsCreateDialogOpen(true);
  };

  const handleEditNotification = (notification: Notification) => {
    setSelectedNotification(notification);
    setFormData({
      title: notification.title,
      message: notification.message,
      type: notification.type,
      channel: notification.channel,
      recipient: notification.recipient,
      isActive: notification.isActive,
    });
    setIsEditDialogOpen(true);
  };

  const handleDeleteNotification = (notification: Notification) => {
    setSelectedNotification(notification);
    setIsDeleteDialogOpen(true);
  };

  const handleSaveNotification = () => {
    if (selectedNotification) {
      setNotifications(
        notifications.map((notif) =>
          notif.id === selectedNotification.id
            ? {
                ...notif,
                ...formData,
                sentDate:
                  new Date().toISOString().split("T")[0] +
                  " " +
                  new Date().toTimeString().split(" ")[0].slice(0, 5),
              }
            : notif
        )
      );
      toast({
        title: "Success",
        description: "Notification updated successfully",
      });
    } else {
      const newNotification: Notification = {
        id: Math.random().toString(36).substr(2, 9),
        ...formData,
        status: "pending",
        sentDate:
          new Date().toISOString().split("T")[0] +
          " " +
          new Date().toTimeString().split(" ")[0].slice(0, 5),
      };
      setNotifications([newNotification, ...notifications]);
      toast({
        title: "Success",
        description: "Notification created successfully",
      });
    }
    setIsCreateDialogOpen(false);
    setIsEditDialogOpen(false);
    setSelectedNotification(null);
  };

  const confirmDelete = () => {
    if (selectedNotification) {
      setNotifications(
        notifications.filter((notif) => notif.id !== selectedNotification.id)
      );
      toast({
        title: "Success",
        description: "Notification deleted successfully",
      });
    }
    setIsDeleteDialogOpen(false);
    setSelectedNotification(null);
  };

  const toggleNotificationStatus = (id: string) => {
    setNotifications(
      notifications.map((notif) =>
        notif.id === id ? { ...notif, isActive: !notif.isActive } : notif
      )
    );
    toast({
      title: "Success",
      description: "Notification status updated",
    });
  };

  const getTypeBadgeVariant = (type: string) => {
    switch (type) {
      case "success":
        return "default";
      case "error":
        return "destructive";
      case "warning":
        return "secondary";
      default:
        return "outline";
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "sent":
        return "default";
      case "pending":
        return "secondary";
      case "failed":
        return "destructive";
      default:
        return "outline";
    }
  };

  const getChannelIcon = (channel: string) => {
    switch (channel) {
      case "email":
        return <Mail className="h-3 w-3 mr-1" />;
      case "push":
        return <Bell className="h-3 w-3 mr-1" />;
      case "sms":
        return <MessageSquare className="h-3 w-3 mr-1" />;
      case "in-app":
        return <AlertCircle className="h-3 w-3 mr-1" />;
      default:
        return null;
    }
  };

  return (
    <div className="">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Notifications</h1>
          <p className="text-muted-foreground mt-2">
            Manage and send notifications to users
          </p>
        </div>
        <Button onClick={handleCreateNotification} className="gap-2">
          <Plus className="h-4 w-4" />
          Create Notification
        </Button>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search notifications..."
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
              <TableHead>Title</TableHead>
              <TableHead>Message</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Channel</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Sent Date</TableHead>
              <TableHead>Active</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredNotifications.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={8}
                  className="text-center py-8 text-muted-foreground"
                >
                  No notifications found
                </TableCell>
              </TableRow>
            ) : (
              filteredNotifications.map((notification) => (
                <TableRow key={notification.id}>
                  <TableCell className="font-medium">
                    {notification.title}
                  </TableCell>
                  <TableCell className="max-w-xs truncate">
                    {notification.message}
                  </TableCell>
                  <TableCell>
                    <Badge variant={getTypeBadgeVariant(notification.type)}>
                      {notification.type}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="gap-1">
                      {getChannelIcon(notification.channel)}
                      {notification.channel}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStatusBadgeVariant(notification.status)}>
                      {notification.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{notification.sentDate}</TableCell>
                  <TableCell>
                    <Switch
                      checked={notification.isActive}
                      onCheckedChange={() =>
                        toggleNotificationStatus(notification.id)
                      }
                    />
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEditNotification(notification)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteNotification(notification)}
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

      {/* Create/Edit Dialog */}
      <Dialog
        open={isCreateDialogOpen || isEditDialogOpen}
        onOpenChange={(open) => {
          setIsCreateDialogOpen(open);
          setIsEditDialogOpen(open);
        }}
      >
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {selectedNotification
                ? "Edit Notification"
                : "Create Notification"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                placeholder="Enter notification title"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="message">Message</Label>
              <Textarea
                id="message"
                value={formData.message}
                onChange={(e) =>
                  setFormData({ ...formData, message: e.target.value })
                }
                placeholder="Enter notification message"
                rows={4}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="type">Type</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value) =>
                    setFormData({
                      ...formData,
                      type: value as "info" | "success" | "warning" | "error",
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="info">Info</SelectItem>
                    <SelectItem value="success">Success</SelectItem>
                    <SelectItem value="warning">Warning</SelectItem>
                    <SelectItem value="error">Error</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="channel">Channel</Label>
                <Select
                  value={formData.channel}
                  onValueChange={(value) =>
                    setFormData({
                      ...formData,
                      channel: value as "email" | "push" | "sms" | "in-app",
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="email">Email</SelectItem>
                    <SelectItem value="push">Push Notification</SelectItem>
                    <SelectItem value="sms">SMS</SelectItem>
                    <SelectItem value="in-app">In-App</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="recipient">Recipient</Label>
              <Input
                id="recipient"
                value={formData.recipient}
                onChange={(e) =>
                  setFormData({ ...formData, recipient: e.target.value })
                }
                placeholder="Enter recipient (email, phone, or user ID)"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="isActive"
                checked={formData.isActive}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, isActive: checked })
                }
              />
              <Label htmlFor="isActive">Active</Label>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsCreateDialogOpen(false);
                setIsEditDialogOpen(false);
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleSaveNotification}>
              {selectedNotification ? "Save Changes" : "Create"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Notification</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this notification? This action
              cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
