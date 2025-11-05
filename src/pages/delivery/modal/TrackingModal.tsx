import { BaseModal } from "@/components/modals";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Clock, Package, Truck, XCircle } from "lucide-react";
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

interface StatusConfig {
  label: string;
  variant: "default" | "secondary" | "destructive";
}

interface DeliveryTrackingModalProps {
  open: boolean;
  onClose: (open: boolean) => void;
}

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

export default function DeliveryTrackingModal({
  open,
  onClose,
}: DeliveryTrackingModalProps) {
  const delivery: Delivery = {
    id: "DEL-001",
    orderId: "ORD-2024-001",
    customer: "Ahmed Hassan",
    address: "House 12, Road 5, Dhanmondi, Dhaka",
    driver: "Karim Rahman",
    status: "in-transit",
    scheduledTime: "2024-01-20 09:00 AM",
  };

  return (
    <BaseModal
      open={open}
      onOpenChange={onClose}
      title="Track Delivery"
      showCloseButton={true}
      closeButtonText="Close"
      showSubmitButton={false}
      size="lg"
    >
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Delivery ID</p>
            <p className="font-medium">{delivery.id}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Order ID</p>
            <p className="font-medium">{delivery.orderId}</p>
          </div>
        </div>

        <div>
          <p className="text-sm text-muted-foreground">Customer</p>
          <p className="font-medium">{delivery.customer}</p>
        </div>

        <div>
          <p className="text-sm text-muted-foreground">Delivery Address</p>
          <p className="font-medium">{delivery.address}</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Driver</p>
            <p className="font-medium">{delivery.driver}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Status</p>
            <Badge variant={statusConfig[delivery.status].variant}>
              {statusConfig[delivery.status].label}
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Scheduled</p>
            <p className="font-medium">{delivery.scheduledTime}</p>
          </div>
          {delivery.deliveredTime && (
            <div>
              <p className="text-sm text-muted-foreground">Delivered</p>
              <p className="font-medium">{delivery.deliveredTime}</p>
            </div>
          )}
        </div>

        <div className="border-t pt-4">
          <p className="text-sm font-medium mb-2">Tracking Timeline</p>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div
                className={`h-2 w-2 rounded-full ${
                  delivery.status === "pending" ||
                  delivery.status === "assigned" ||
                  delivery.status === "in-transit" ||
                  delivery.status === "delivered"
                    ? "bg-primary"
                    : "bg-muted"
                }`}
              />
              <p className="text-sm">Order Placed</p>
            </div>
            <div className="flex items-center gap-2">
              <div
                className={`h-2 w-2 rounded-full ${
                  delivery.status === "assigned" ||
                  delivery.status === "in-transit" ||
                  delivery.status === "delivered"
                    ? "bg-primary"
                    : "bg-muted"
                }`}
              />
              <p className="text-sm">Driver Assigned</p>
            </div>
            <div className="flex items-center gap-2">
              <div
                className={`h-2 w-2 rounded-full ${
                  delivery.status === "in-transit" ||
                  delivery.status === "delivered"
                    ? "bg-primary"
                    : "bg-muted"
                }`}
              />
              <p className="text-sm">Out for Delivery</p>
            </div>
            <div className="flex items-center gap-2">
              <div
                className={`h-2 w-2 rounded-full ${
                  delivery.status === "delivered" ? "bg-primary" : "bg-muted"
                }`}
              />
              <p className="text-sm">Delivered</p>
            </div>
          </div>
        </div>
      </div>
    </BaseModal>
  );
}
