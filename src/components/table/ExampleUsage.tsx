// Example usage of BaseTableList in Delivery.tsx
// This is a reference implementation showing how to refactor the existing Delivery.tsx

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
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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

export default function DeliveryExample() {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Filter deliveries
  const filteredDeliveries = deliveries.filter((delivery) => {
    const matchesSearch =
      delivery.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      delivery.orderId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      delivery.driver.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || delivery.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Handle actions
  const handleCreateDelivery = () => {
    // Your create logic
  };

  const handleEditDelivery = (delivery: Delivery) => {
    // Your edit logic
  };

  const handleDeleteDelivery = (delivery: Delivery) => {
    // Your delete logic
  };

  const handleTrackDelivery = (delivery: Delivery) => {
    // Your tracking logic
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
    <div className="">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          {t("nav.delivery")}
        </h1>
        <p className="text-muted-foreground">Manage and track all deliveries</p>
      </div>

      {/* Stats Cards - Keep as is */}
      {/* ... */}

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
        isLoading={isLoading}
        emptyMessage="No deliveries found"
        getRowKey={(delivery) => delivery.id}
      />

      {/* Dialogs - Keep as is */}
      {/* ... */}
    </div>
  );
}
