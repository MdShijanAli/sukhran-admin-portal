import { useEffect, useState } from "react";
import { BaseModal } from "@/components/modals";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface UserFormData {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  location: string;
  status: string;
  subscriptionStatus: string;
}

interface DeliveryFormModalProps {
  open: boolean;
  onClose: () => void;
  editData?: UserFormData;
}

export default function FormModal({
  open,
  onClose,
  editData,
}: DeliveryFormModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<UserFormData>({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    location: "",
    status: "active",
    subscriptionStatus: "none",
  });

  const updateField = (field: keyof UserFormData, value: string) => {
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
        first_name: editData.first_name,
        last_name: editData.last_name,
        email: editData.email,
        phone: editData.phone,
        location: editData.location,
        status: editData.status,
        subscriptionStatus: editData.subscriptionStatus,
      });
    } else {
      setIsEditing(false);
      setFormData({
        first_name: "",
        last_name: "",
        email: "",
        phone: "",
        location: "",
        status: "active",
        subscriptionStatus: "none",
      });
    }
  }, [editData]);

  return (
    <BaseModal
      open={open}
      onOpenChange={onClose}
      title={isEditing ? "Edit User" : "Create New User"}
      onSubmit={handleSubmit}
      isSubmitting={isSubmitting}
      submitButtonText={isEditing ? "Update User" : "Create User"}
      size="2xl"
    >
      <div className="grid gap-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="first_name">First Name *</Label>
            <Input
              id="first_name"
              value={formData.first_name}
              onChange={(e) =>
                setFormData({ ...formData, first_name: e.target.value })
              }
              placeholder="Enter first name"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="last_name">Last Name </Label>
            <Input
              id="last_name"
              value={formData.last_name}
              onChange={(e) =>
                setFormData({ ...formData, last_name: e.target.value })
              }
              placeholder="Enter last name"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email *</Label>
            <Input
              type="email"
              id="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              placeholder="Enter email address"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Phone *</Label>
            <Input
              id="phone"
              value={formData.phone}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
              placeholder="Enter phone number"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="location">Location *</Label>
          <Input
            id="location"
            value={formData.location}
            onChange={(e) =>
              setFormData({ ...formData, location: e.target.value })
            }
            placeholder="Enter location"
          />
        </div>

        <div className="space-y-2">
          <Label>Account Status</Label>
          <Select
            value={formData.status}
            onValueChange={(value) =>
              setFormData({ ...formData, status: value })
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

        <div className="space-y-2">
          <Label>Subscription Status</Label>
          <Select
            value={formData.subscriptionStatus}
            onValueChange={(value) =>
              setFormData({ ...formData, subscriptionStatus: value })
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="expired">Expired</SelectItem>
              <SelectItem value="none">None</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </BaseModal>
  );
}
