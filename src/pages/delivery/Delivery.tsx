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
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BaseTableList, Column } from "@/components/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import FormModal from "./modal/FormModal";
import TrackingModal from "./modal/TrackingModal";
import DeleteModal from "@/components/modals/DeleteModal";
import { useTranslation } from "react-i18next";

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
    setIsCreateDialogOpen(true);
  };

  const handleEditDelivery = (delivery: Delivery) => {
    setIsCreateDialogOpen(true);
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
    <div>
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
        summaryLists={stats}
      />

      {/* Create/Edit Delivery Form Modal */}
      <FormModal
        open={isCreateDialogOpen}
        onClose={() => setIsCreateDialogOpen(false)}
      />

      {/* Tracking Dialog */}
      <TrackingModal
        open={isTrackingDialogOpen}
        onClose={setIsTrackingDialogOpen}
      />

      {/* Delete Confirmation Dialog */}
      <DeleteModal
        open={isDeleteDialogOpen}
        onClose={setIsDeleteDialogOpen}
        title="Delete Delivery"
        description={`Are you sure you want to delete delivery ${selectedDelivery?.id}? This action cannot be undone.`}
        onConfirm={confirmDelete}
      />
    </div>
  );
}
