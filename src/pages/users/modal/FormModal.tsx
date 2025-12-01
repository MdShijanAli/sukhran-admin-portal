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
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Eye, EyeClosed, EyeOffIcon } from "lucide-react";

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
  const { t } = useTranslation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
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
      toast.error(t("users.messages.requiredFields"));
      return;
    }

    // Validate password for new users
    if (!isEditing && !formData.password) {
      toast.error(t("users.messages.passwordRequired"));
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
        toast.success(t("users.messages.userUpdated"));
      } else {
        await userService.storeItem(submitData);
        toast.success(t("users.messages.userCreated"));
      }

      onSuccess?.();
      onClose();
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error(
        isEditing
          ? t("users.messages.failedToUpdate")
          : t("users.messages.failedToCreate")
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    // Fetch roles
    const fetchRoles = async () => {
      try {
        const response = await roleService.fetchLists("exclude_customer=1");
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
        toast.error(t("users.messages.failedToLoadRoles"));
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
  }, [editData, open, t]);

  return (
    <BaseModal
      open={open}
      onOpenChange={onClose}
      title={isEditing ? t("users.modal.edit") : t("users.modal.create")}
      onSubmit={handleSubmit}
      isSubmitting={isSubmitting}
      submitButtonText={
        isEditing ? t("users.modal.updateUser") : t("users.modal.createUser")
      }
      size="2xl"
      closeButtonText={t("cancel")}
    >
      <div className="grid gap-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="firstName">{t("users.form.firstName")} *</Label>
            <Input
              id="firstName"
              value={formData.firstName}
              onChange={(e) =>
                setFormData({ ...formData, firstName: e.target.value })
              }
              placeholder={t("users.form.enterFirstName")}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastName">{t("users.form.lastName")}</Label>
            <Input
              id="lastName"
              value={formData.lastName}
              onChange={(e) =>
                setFormData({ ...formData, lastName: e.target.value })
              }
              placeholder={t("users.form.enterLastName")}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="preferredName">
              {t("users.form.preferredName")} *
            </Label>
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
                <SelectItem value="firstName">
                  {t("users.form.firstName")}
                </SelectItem>
                <SelectItem value="lastName">
                  {t("users.form.lastName")}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="role">{t("users.columns.role")} *</Label>
            <Select
              value={String(formData.role_id)}
              onValueChange={(value) =>
                setFormData({ ...formData, role_id: Number(value) })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder={t("users.form.selectRole")} />
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
            <Label htmlFor="email">{t("users.columns.email")} *</Label>
            <Input
              type="email"
              id="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              placeholder={t("users.form.enterEmail")}
              disabled={isEditing}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="mobile">{t("users.form.mobile")} *</Label>
            <Input
              id="mobile"
              value={formData.mobile}
              onChange={(e) =>
                setFormData({ ...formData, mobile: e.target.value })
              }
              placeholder={t("users.form.enterMobile")}
              disabled={isEditing}
            />
          </div>
        </div>

        {!isEditing && (
          <div className="space-y-2 relative">
            <Label htmlFor="password">{t("users.form.password")}</Label>
            <Input
              type={showPassword ? "text" : "password"}
              id="password"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              placeholder={t("users.form.enterPassword")}
            />
            {showPassword ? (
              <EyeClosed
                className="absolute right-3 top-8 cursor-pointer"
                onClick={() => setShowPassword(false)}
              />
            ) : (
              <EyeOffIcon
                className="absolute right-3 top-8 cursor-pointer"
                onClick={() => setShowPassword(true)}
              />
            )}
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="gender">{t("users.form.gender")}</Label>
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
                <SelectItem value="male">{t("users.form.male")}</SelectItem>
                <SelectItem value="female">{t("users.form.female")}</SelectItem>
                <SelectItem value="other">{t("users.form.other")}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="date_of_birth">{t("users.form.dateOfBirth")}</Label>
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
          <Label>{t("users.form.accountStatus")}</Label>
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
              <SelectItem value="active">
                {t("users.columns.active")}
              </SelectItem>
              <SelectItem value="inactive">
                {t("users.columns.inactive")}
              </SelectItem>
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
              {t("users.form.sendWelcomeEmail")}
            </Label>
          </div>
        )}
      </div>
    </BaseModal>
  );
}
