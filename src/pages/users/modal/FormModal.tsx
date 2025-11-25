import { useEffect, useState } from "react";
import { BaseModal } from "@/components/modals";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { User } from "@/stores/userStore";
import { Role } from "@/stores/roleStore";
import userService from "@/services/userService";
import roleService from "@/services/roleService";
import { toast } from "sonner";

interface UserFormData {
  firstName: string;
  lastName: string;
  preferredName: string;
  email: string;
  mobile: string;
  password: string;
  role_id: number | string;
  send_email: boolean;
  gender: string;
  date_of_birth: string;
  isActive: boolean;
}

interface FormModalProps {
  open: boolean;
  onClose: () => void;
  editData?: User;
  onSuccess?: () => void;
}

export default function FormModal({
  open,
  onClose,
  editData,
  onSuccess,
}: FormModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [roles, setRoles] = useState<Role[]>([]);
  const [formData, setFormData] = useState<UserFormData>({
    firstName: "",
    lastName: "",
    preferredName: "firstName",
    email: "",
    mobile: "",
    password: "",
    role_id: "",
    send_email: true,
    gender: "male",
    date_of_birth: "",
    isActive: true,
  });

  const handleSubmit = async () => {
    // Validate required fields
    if (
      !formData.firstName ||
      !formData.email ||
      !formData.role_id ||
      !formData.mobile
    ) {
      toast.error("Please fill in all required fields");
      return;
    }

    // Validate password for new users
    if (!isEditing && !formData.password) {
      toast.error("Password is required for new users");
      return;
    }

    setIsSubmitting(true);
    try {
      const submitData = new FormData();
      submitData.append("firstName", formData.firstName);
      submitData.append("lastName", formData.lastName);
      submitData.append("preferredName", formData.preferredName);
      submitData.append("email", formData.email);
      submitData.append("mobile", formData.mobile);
      submitData.append("role_id", String(formData.role_id));
      submitData.append("gender", formData.gender);
      submitData.append("date_of_birth", formData.date_of_birth);
      submitData.append("is_active", formData.isActive ? "1" : "0");

      if (!isEditing) {
        submitData.append("password", formData.password);
        submitData.append("send_email", formData.send_email ? "1" : "0");
      }

      if (isEditing && editData) {
        await userService.updateItem(editData.id, submitData);
        toast.success("User updated successfully");
      } else {
        await userService.storeItem(submitData);
        toast.success("User created successfully");
      }

      onSuccess?.();
      onClose();
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error(
        isEditing ? "Failed to update user" : "Failed to create user"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    // Fetch roles
    const fetchRoles = async () => {
      try {
        const response = await roleService.fetchLists();
        const responseData = response as unknown as Record<string, unknown>;
        const rolesData =
          (responseData?.data as Role[]) || (response as unknown as Role[]);
        // Filter only active roles
        const activeRoles = Array.isArray(rolesData)
          ? rolesData.filter((role) => role.isActive)
          : [];
        setRoles(activeRoles);
      } catch (error) {
        console.error("Error fetching roles:", error);
        toast.error("Failed to load roles");
      }
    };

    if (open) {
      fetchRoles();
    }

    if (editData) {
      setIsEditing(true);
      setFormData({
        firstName: editData.firstName,
        lastName: editData.lastName,
        preferredName: editData.preferredName || "firstName",
        email: editData.email,
        mobile: editData.mobile,
        password: "",
        role_id: editData.role_id || "",
        send_email: false,
        gender: editData.gender || "male",
        date_of_birth: editData.date_of_birth || "",
        isActive: editData.isActive,
      });
    } else {
      setIsEditing(false);
      setFormData({
        firstName: "",
        lastName: "",
        preferredName: "firstName",
        email: "",
        mobile: "",
        password: "",
        role_id: "",
        send_email: true,
        gender: "male",
        date_of_birth: "",
        isActive: true,
      });
    }
  }, [editData, open]);

  return (
    <BaseModal
      open={open}
      onOpenChange={onClose}
      title={isEditing ? "Edit User" : "Create New Staff User"}
      onSubmit={handleSubmit}
      isSubmitting={isSubmitting}
      submitButtonText={isEditing ? "Update User" : "Create User"}
      size="2xl"
    >
      <div className="grid gap-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="firstName">First Name *</Label>
            <Input
              id="firstName"
              value={formData.firstName}
              onChange={(e) =>
                setFormData({ ...formData, firstName: e.target.value })
              }
              placeholder="Enter first name"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastName">Last Name</Label>
            <Input
              id="lastName"
              value={formData.lastName}
              onChange={(e) =>
                setFormData({ ...formData, lastName: e.target.value })
              }
              placeholder="Enter last name"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="preferredName">Preferred Name *</Label>
            <Select
              value={formData.preferredName}
              onValueChange={(value) =>
                setFormData({ ...formData, preferredName: value })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="firstName">First Name</SelectItem>
                <SelectItem value="lastName">Last Name</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="role">Role *</Label>
            <Select
              value={String(formData.role_id)}
              onValueChange={(value) =>
                setFormData({ ...formData, role_id: Number(value) })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                {roles.map((role) => (
                  <SelectItem key={role.id} value={String(role.id)}>
                    {role.display_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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
              disabled={isEditing}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="mobile">Mobile *</Label>
            <Input
              id="mobile"
              value={formData.mobile}
              onChange={(e) =>
                setFormData({ ...formData, mobile: e.target.value })
              }
              placeholder="Enter mobile number (e.g., 01XXXXXXXXX)"
              disabled={isEditing}
            />
          </div>
        </div>

        {!isEditing && (
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              type="password"
              id="password"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              placeholder="Enter password"
            />
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="gender">Gender</Label>
            <Select
              value={formData.gender}
              onValueChange={(value) =>
                setFormData({ ...formData, gender: value })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="date_of_birth">Date of Birth</Label>
            <Input
              type="date"
              id="date_of_birth"
              value={formData.date_of_birth}
              onChange={(e) =>
                setFormData({ ...formData, date_of_birth: e.target.value })
              }
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Account Status</Label>
          <Select
            value={formData.isActive ? "active" : "inactive"}
            onValueChange={(value) =>
              setFormData({ ...formData, isActive: value === "active" })
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {!isEditing && (
          <div className="flex items-center space-x-2">
            <Checkbox
              id="send_email"
              checked={formData.send_email}
              onCheckedChange={(checked) =>
                setFormData({ ...formData, send_email: checked as boolean })
              }
            />
            <Label
              htmlFor="send_email"
              className="text-sm font-normal cursor-pointer"
            >
              Send welcome email with login credentials
            </Label>
          </div>
        )}
      </div>
    </BaseModal>
  );
}
