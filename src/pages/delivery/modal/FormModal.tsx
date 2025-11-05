import { useEffect, useState } from "react";
import { BaseModal } from "@/components/modals";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface DeliveryFormData {
  orderId: string;
  customer: string;
  address: string;
  driver: string;
  status: "pending" | "assigned" | "in-transit" | "delivered" | "failed";
  scheduledTime: string;
}

interface DeliveryFormModalProps {
  open: boolean;
  onClose: () => void;
  editData?: DeliveryFormData;
}

export default function FormModal({
  open,
  onClose,
  editData,
}: DeliveryFormModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<DeliveryFormData>({
    orderId: "",
    customer: "",
    address: "",
    driver: "",
    status: "pending",
    scheduledTime: "",
  });

  const updateField = (
    field: keyof DeliveryFormData,
    value: string | DeliveryFormData["status"]
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    setIsSubmitting(true);
    // Handle form submission logic here
    console.log("Submitting form data:", formData);

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      onClose();
    }, 1000);
  };

  useEffect(() => {
    if (editData) {
      setIsEditing(true);
      setFormData({
        orderId: editData.orderId,
        customer: editData.customer,
        address: editData.address,
        driver: editData.driver,
        status: editData.status,
        scheduledTime: editData.scheduledTime,
      });
    }
  }, [editData]);

  return (
    <BaseModal
      open={open}
      onOpenChange={onClose}
      title={isEditing ? "Edit Delivery" : "Create New Delivery"}
      onSubmit={handleSubmit}
      isSubmitting={isSubmitting}
      submitButtonText={isEditing ? "Update Delivery" : "Create Delivery"}
      size="2xl"
    >
      <div className="grid gap-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="orderId">Order ID *</Label>
            <Input
              id="orderId"
              value={formData.orderId}
              onChange={(e) => updateField("orderId", e.target.value)}
              placeholder="ORD-2024-001"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="customer">Customer Name *</Label>
            <Input
              id="customer"
              value={formData.customer}
              onChange={(e) => updateField("customer", e.target.value)}
              placeholder="John Doe"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="address">Delivery Address *</Label>
          <Textarea
            id="address"
            value={formData.address}
            onChange={(e) => updateField("address", e.target.value)}
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
              onChange={(e) => updateField("driver", e.target.value)}
              placeholder="Karim Rahman"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="scheduledTime">Scheduled Time *</Label>
            <Input
              id="scheduledTime"
              value={formData.scheduledTime}
              onChange={(e) => updateField("scheduledTime", e.target.value)}
              placeholder="2024-01-20 09:00 AM"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <Select
            value={formData.status}
            onValueChange={(value) =>
              updateField("status", value as Delivery["status"])
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
    </BaseModal>
  );
}
