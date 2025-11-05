import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Download,
  MoreHorizontal,
  Clock,
  Truck,
  ShoppingCart,
  RefreshCcw,
} from "lucide-react";
import { BaseTableList, Column } from "@/components/table";

interface Order {
  id: string;
  customerName: string;
  customerPhone?: string;
  items: string;
  total: number;
  status: "pending" | "processing" | "in-transit" | "delivered";
  paymentMethod: string;
  orderDate: string;
  deliveryAgent?: string;
}

const orders: Order[] = [
  {
    id: "ORD-001",
    customerName: "Ahmed Hassan",
    customerPhone: "+880 1712-345678",
    items: "Fresh Milk 1L x2, Organic Eggs x1",
    total: 350,
    status: "pending",
    paymentMethod: "cash",
    orderDate: "2025-10-23T08:30:00",
    deliveryAgent: null,
  },
  {
    id: "ORD-002",
    customerName: "Fatima Rahman",
    customerPhone: "+880 1812-345679",
    items: "Greek Yogurt x3, Butter x1",
    total: 580,
    status: "processing",
    paymentMethod: "online",
    orderDate: "2025-10-23T09:15:00",
    deliveryAgent: "Rahim Khan",
  },
  {
    id: "ORD-003",
    customerName: "Karim Ahmed",
    customerPhone: "+880 1912-345680",
    items: "Cheese Block x2",
    total: 400,
    status: "delivered",
    paymentMethod: "online",
    orderDate: "2025-10-22T14:20:00",
    deliveryAgent: "Salim Uddin",
  },
];

export default function Orders() {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.items.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-warning/10 text-warning border-warning/20";
      case "processing":
        return "bg-primary/10 text-primary border-primary/20";
      case "delivered":
        return "bg-success/10 text-success border-success/20";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Define table columns
  const columns: Column<Order>[] = [
    {
      key: "id",
      label: "Order ID",
      render: (order) => <span className="font-medium">{order.id}</span>,
    },
    {
      key: "customer",
      label: "Customer",
      render: (order) => (
        <div>
          <p className="font-medium">{order.customerName}</p>
          <p className="text-xs text-muted-foreground">{order.customerPhone}</p>
        </div>
      ),
    },
    {
      key: "items",
      label: "Items",
    },
    {
      key: "total",
      label: "Total",
      render: (order) => <span className="font-medium">৳{order.total}</span>,
    },
    {
      key: "payment",
      label: "Payment",
      render: (order) => <Badge variant="outline">{order.paymentMethod}</Badge>,
    },
    {
      key: "status",
      label: "Status",
      render: (order) => (
        <Badge className={getStatusColor(order.status)}>{order.status}</Badge>
      ),
    },
    {
      key: "date",
      label: "Date",
      render: (order) => (
        <span className="text-sm">{formatDate(order.orderDate)}</span>
      ),
    },
    {
      key: "agent",
      label: "Agent",
      render: (order) => (
        <>
          {order.deliveryAgent || (
            <span className="text-muted-foreground">Unassigned</span>
          )}
        </>
      ),
    },
    {
      key: "actions",
      label: "Actions",
      render: (order) => (
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  const stats = [
    {
      title: "Total Orders",
      value: orders.length,
      icon: ShoppingCart,
      color: "text-blue-500",
    },
    {
      title: "Pending",
      value: orders.filter((d) => d.status === "pending").length,
      icon: Clock,
      color: "text-indigo-500",
    },
    {
      title: "Processing",
      value: orders.filter((d) => d.status === "processing").length,
      icon: RefreshCcw,
      color: "text-violet-500",
    },
    {
      title: "Delivered",
      value: orders.filter((d) => d.status === "delivered").length,
      icon: Truck,
      color: "text-teal-500",
    },
  ];

  return (
    <div className="animate-fade-in">
      <BaseTableList
        title="Order Management"
        description="View and process customer orders"
        headerSlots={
          <Button variant="outline" className="shadow-card">
            <Download className="mr-2 h-4 w-4" />
            {t("common.export")}
          </Button>
        }
        searchPlaceholder="Search by customer, order, or driver..."
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
        filters={[
          {
            value: statusFilter,
            options: [
              { label: "All Status", value: "all" },
              { label: "Pending", value: "pending" },
              { label: "Delivered", value: "delivered" },
            ],
            onChange: setStatusFilter,
            placeholder: "Filter by status",
            className: "w-[180px]",
          },
        ]}
        columns={columns}
        data={filteredOrders}
        emptyMessage="No orders found"
        getRowKey={(order) => order.id}
        summaryLists={stats}
      />
    </div>
  );
}
