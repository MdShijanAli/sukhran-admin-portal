import {
  Package,
  MapPin,
  Clock,
  CheckCircle,
  XCircle,
  Truck,
  Plus,
  Pencil,
  Trash2,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { BaseTableList, Column } from "@/components/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
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
import { toast } from "@/hooks/use-toast";

interface Delivery {
  id: string;
  orderId: string;
  customer: string;
  address: string;
  driver: string;
  status: "pending" | "assigned" | "in-transit" | "delivered" | "failed";
  scheduledTime: string;
  deliveredTime?: string;
}

const mockDeliveries: Delivery[] = [
  {
    id: "DEL-001",
    orderId: "ORD-2024-001",
    customer: "Ahmed Hassan",
    address: "House 12, Road 5, Dhanmondi, Dhaka",
    driver: "Karim Rahman",
    status: "in-transit",
    scheduledTime: "2024-01-20 09:00 AM",
  },
  {
    id: "DEL-002",
    orderId: "ORD-2024-002",
    customer: "Fatima Khan",
    address: "Flat 3B, Gulshan Avenue, Dhaka",
    driver: "Rahim Ali",
    status: "delivered",
    scheduledTime: "2024-01-20 08:30 AM",
    deliveredTime: "2024-01-20 08:45 AM",
  },
  {
    id: "DEL-003",
    orderId: "ORD-2024-003",
    customer: "Mohammad Islam",
    address: "House 45, Banani DOHS, Dhaka",
    driver: "Jamal Uddin",
    status: "pending",
    scheduledTime: "2024-01-20 10:00 AM",
  },
  {
    id: "DEL-004",
    orderId: "ORD-2024-004",
    customer: "Nusrat Jahan",
    address: "Apartment 7C, Bashundhara, Dhaka",
    driver: "Selim Ahmed",
    status: "assigned",
    scheduledTime: "2024-01-20 11:00 AM",
  },
  {
    id: "DEL-005",
    orderId: "ORD-2024-005",
    customer: "Rafiq Hossain",
    address: "House 89, Uttara Sector 10, Dhaka",
    driver: "Abdul Karim",
    status: "failed",
    scheduledTime: "2024-01-20 07:00 AM",
  },
];

const statusConfig = {
  pending: { label: "Pending", icon: Clock, variant: "secondary" as const },
  assigned: { label: "Assigned", icon: Package, variant: "default" as const },
  "in-transit": {
    label: "In Transit",
    icon: Truck,
    variant: "default" as const,
  },
  delivered: {
    label: "Delivered",
    icon: CheckCircle,
    variant: "default" as const,
  },
  failed: { label: "Failed", icon: XCircle, variant: "destructive" as const },
};

export default function Delivery() {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [deliveries, setDeliveries] = useState<Delivery[]>(mockDeliveries);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isTrackingDialogOpen, setIsTrackingDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedDelivery, setSelectedDelivery] = useState<Delivery | null>(
    null
  );
  const [editingDelivery, setEditingDelivery] = useState<Delivery | null>(null);
  const [formData, setFormData] = useState({
    orderId: "",
    customer: "",
    address: "",
    driver: "",
    status: "pending" as Delivery["status"],
    scheduledTime: "",
  });

  const stats = [
    {
      title: "Pending Deliveries",
      value: deliveries.filter((d) => d.status === "pending").length,
      icon: Clock,
      color: "text-yellow-500",
    },
    {
      title: "In Transit",
      value: deliveries.filter((d) => d.status === "in-transit").length,
      icon: Truck,
      color: "text-blue-500",
    },
    {
      title: "Delivered Today",
      value: deliveries.filter((d) => d.status === "delivered").length,
      icon: CheckCircle,
      color: "text-green-500",
    },
    {
      title: "Failed",
      value: deliveries.filter((d) => d.status === "failed").length,
      icon: XCircle,
      color: "text-red-500",
    },
  ];

  const filteredDeliveries = deliveries.filter((delivery) => {
    const matchesSearch =
      delivery.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      delivery.orderId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      delivery.driver.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || delivery.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleCreateDelivery = () => {
    setEditingDelivery(null);
    setFormData({
      orderId: "",
      customer: "",
      address: "",
      driver: "",
      status: "pending",
      scheduledTime: "",
    });
    setIsCreateDialogOpen(true);
  };

  const handleEditDelivery = (delivery: Delivery) => {
    setEditingDelivery(delivery);
    setFormData({
      orderId: delivery.orderId,
      customer: delivery.customer,
      address: delivery.address,
      driver: delivery.driver,
      status: delivery.status,
      scheduledTime: delivery.scheduledTime,
    });
    setIsCreateDialogOpen(true);
  };

  const handleSaveDelivery = () => {
    if (
      !formData.orderId ||
      !formData.customer ||
      !formData.address ||
      !formData.driver ||
      !formData.scheduledTime
    ) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    if (editingDelivery) {
      setDeliveries(
        deliveries.map((d) =>
          d.id === editingDelivery.id ? { ...d, ...formData } : d
        )
      );
      toast({
        title: "Success",
        description: "Delivery updated successfully",
      });
    } else {
      const newDelivery: Delivery = {
        id: `DEL-${String(deliveries.length + 1).padStart(3, "0")}`,
        ...formData,
      };
      setDeliveries([newDelivery, ...deliveries]);
      toast({
        title: "Success",
        description: "Delivery created successfully",
      });
    }
    setIsCreateDialogOpen(false);
  };

  const handleStatusChange = (
    deliveryId: string,
    newStatus: Delivery["status"]
  ) => {
    setDeliveries(
      deliveries.map((d) => {
        if (d.id === deliveryId) {
          const updated = { ...d, status: newStatus };
          if (newStatus === "delivered") {
            updated.deliveredTime = new Date().toLocaleString();
          }
          return updated;
        }
        return d;
      })
    );
    toast({
      title: "Status Updated",
      description: `Delivery status changed to ${statusConfig[newStatus].label}`,
    });
  };

  const handleTrackDelivery = (delivery: Delivery) => {
    setSelectedDelivery(delivery);
    setIsTrackingDialogOpen(true);
  };

  const handleDeleteDelivery = (delivery: Delivery) => {
    setSelectedDelivery(delivery);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (selectedDelivery) {
      setDeliveries(deliveries.filter((d) => d.id !== selectedDelivery.id));
      toast({
        title: "Deleted",
        description: "Delivery deleted successfully",
      });
    }
    setIsDeleteDialogOpen(false);
    setSelectedDelivery(null);
  };

  // Define table columns
  const columns: Column<Delivery>[] = [
    {
      key: "id",
      label: "Delivery ID",
      render: (delivery) => <span className="font-medium">{delivery.id}</span>,
    },
    {
      key: "orderId",
      label: "Order ID",
    },
    {
      key: "customer",
      label: "Customer",
    },
    {
      key: "address",
      label: "Address",
      className: "max-w-[200px]",
      render: (delivery) => (
        <span className="truncate block">{delivery.address}</span>
      ),
    },
    {
      key: "driver",
      label: "Driver",
    },
    {
      key: "scheduledTime",
      label: "Scheduled Time",
    },
    {
      key: "status",
      label: "Status",
      render: (delivery) => (
        <Select
          value={delivery.status}
          onValueChange={(value) =>
            handleStatusChange(delivery.id, value as Delivery["status"])
          }
        >
          <SelectTrigger className="w-[140px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="assigned">Assigned</SelectItem>
            <SelectItem value="in-transit">In Transit</SelectItem>
            <SelectItem value="delivered">Delivered</SelectItem>
            <SelectItem value="failed">Failed</SelectItem>
          </SelectContent>
        </Select>
      ),
    },
    {
      key: "actions",
      label: "Actions",
      render: (delivery) => (
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleTrackDelivery(delivery)}
          >
            <MapPin className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleEditDelivery(delivery)}
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleDeleteDelivery(delivery)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          {t("nav.delivery")}
        </h1>
        <p className="text-muted-foreground">Manage and track all deliveries</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Table with BaseTableList */}
      <BaseTableList
        title="Delivery List"
        description="View and manage all delivery orders"
        headerActions={[
          {
            label: "Create Delivery",
            icon: Plus,
            onClick: handleCreateDelivery,
            variant: "default",
          },
        ]}
        searchPlaceholder="Search by customer, order, or driver..."
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
        filters={[
          {
            value: statusFilter,
            options: [
              { label: "All Status", value: "all" },
              { label: "Pending", value: "pending" },
              { label: "Assigned", value: "assigned" },
              { label: "In Transit", value: "in-transit" },
              { label: "Delivered", value: "delivered" },
              { label: "Failed", value: "failed" },
            ],
            onChange: setStatusFilter,
            placeholder: "Filter by status",
            className: "w-[180px]",
          },
        ]}
        columns={columns}
        data={filteredDeliveries}
        emptyMessage="No deliveries found"
        getRowKey={(delivery) => delivery.id}
      />

      {/* Create/Edit Delivery Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingDelivery ? "Edit Delivery" : "Create New Delivery"}
            </DialogTitle>
            <DialogDescription>
              {editingDelivery
                ? "Update delivery details"
                : "Add a new delivery to the system"}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="orderId">Order ID *</Label>
                <Input
                  id="orderId"
                  value={formData.orderId}
                  onChange={(e) =>
                    setFormData({ ...formData, orderId: e.target.value })
                  }
                  placeholder="ORD-2024-001"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="customer">Customer Name *</Label>
                <Input
                  id="customer"
                  value={formData.customer}
                  onChange={(e) =>
                    setFormData({ ...formData, customer: e.target.value })
                  }
                  placeholder="John Doe"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">Delivery Address *</Label>
              <Textarea
                id="address"
                value={formData.address}
                onChange={(e) =>
                  setFormData({ ...formData, address: e.target.value })
                }
                placeholder="House 12, Road 5, Dhanmondi, Dhaka"
                rows={2}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="driver">Driver Name *</Label>
                <Input
                  id="driver"
                  value={formData.driver}
                  onChange={(e) =>
                    setFormData({ ...formData, driver: e.target.value })
                  }
                  placeholder="Karim Rahman"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="scheduledTime">Scheduled Time *</Label>
                <Input
                  id="scheduledTime"
                  value={formData.scheduledTime}
                  onChange={(e) =>
                    setFormData({ ...formData, scheduledTime: e.target.value })
                  }
                  placeholder="2024-01-20 09:00 AM"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value) =>
                  setFormData({
                    ...formData,
                    status: value as Delivery["status"],
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="assigned">Assigned</SelectItem>
                  <SelectItem value="in-transit">In Transit</SelectItem>
                  <SelectItem value="delivered">Delivered</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsCreateDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleSaveDelivery}>
              {editingDelivery ? "Update" : "Create"} Delivery
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Tracking Dialog */}
      <Dialog
        open={isTrackingDialogOpen}
        onOpenChange={setIsTrackingDialogOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Track Delivery</DialogTitle>
            <DialogDescription>
              Real-time delivery tracking information
            </DialogDescription>
          </DialogHeader>
          {selectedDelivery && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Delivery ID</p>
                  <p className="font-medium">{selectedDelivery.id}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Order ID</p>
                  <p className="font-medium">{selectedDelivery.orderId}</p>
                </div>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Customer</p>
                <p className="font-medium">{selectedDelivery.customer}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">
                  Delivery Address
                </p>
                <p className="font-medium">{selectedDelivery.address}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Driver</p>
                  <p className="font-medium">{selectedDelivery.driver}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <Badge
                    variant={statusConfig[selectedDelivery.status].variant}
                  >
                    {statusConfig[selectedDelivery.status].label}
                  </Badge>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Scheduled</p>
                  <p className="font-medium">
                    {selectedDelivery.scheduledTime}
                  </p>
                </div>
                {selectedDelivery.deliveredTime && (
                  <div>
                    <p className="text-sm text-muted-foreground">Delivered</p>
                    <p className="font-medium">
                      {selectedDelivery.deliveredTime}
                    </p>
                  </div>
                )}
              </div>
              <div className="border-t pt-4">
                <p className="text-sm font-medium mb-2">Tracking Timeline</p>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div
                      className={`h-2 w-2 rounded-full ${
                        selectedDelivery.status === "pending" ||
                        selectedDelivery.status === "assigned" ||
                        selectedDelivery.status === "in-transit" ||
                        selectedDelivery.status === "delivered"
                          ? "bg-primary"
                          : "bg-muted"
                      }`}
                    />
                    <p className="text-sm">Order Placed</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div
                      className={`h-2 w-2 rounded-full ${
                        selectedDelivery.status === "assigned" ||
                        selectedDelivery.status === "in-transit" ||
                        selectedDelivery.status === "delivered"
                          ? "bg-primary"
                          : "bg-muted"
                      }`}
                    />
                    <p className="text-sm">Driver Assigned</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div
                      className={`h-2 w-2 rounded-full ${
                        selectedDelivery.status === "in-transit" ||
                        selectedDelivery.status === "delivered"
                          ? "bg-primary"
                          : "bg-muted"
                      }`}
                    />
                    <p className="text-sm">Out for Delivery</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div
                      className={`h-2 w-2 rounded-full ${
                        selectedDelivery.status === "delivered"
                          ? "bg-primary"
                          : "bg-muted"
                      }`}
                    />
                    <p className="text-sm">Delivered</p>
                  </div>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setIsTrackingDialogOpen(false)}>
              Close
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
            <AlertDialogTitle>Delete Delivery</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete delivery {selectedDelivery?.id}?
              This action cannot be undone.
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
