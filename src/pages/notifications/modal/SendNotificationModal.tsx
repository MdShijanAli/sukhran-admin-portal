import { useEffect, useState } from "react";
import { BaseModal } from "@/components/modals";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { usePackageStore } from "@/stores/packageStore";
import { useUserStore } from "@/stores/userStore";
import notificationService from "@/services/notificationService";
import packageService from "@/services/packageService";
import userService from "@/services/userService";
import { ComboboxSelect } from "@/components/custom/ComboboxSelect";
import { ImageUpload } from "@/components/content/ImageUpload";
import { toast } from "sonner";

interface NotificationFormData {
  title: string;
  body: string;
  image: File | null;
  link_type: "none" | "product" | "package" | "url";
  package_id: string;
  target_audience: "all" | "specific";
  target_user_ids: (number | string)[];
}

interface SendNotificationModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function SendNotificationModal({
  open,
  onClose,
  onSuccess,
}: SendNotificationModalProps) {
  const [packages, setPackages] = useState([]);
  const userStore = useUserStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<NotificationFormData>({
    title: "",
    body: "",
    image: null,
    link_type: "none",
    package_id: "",
    target_audience: "all",
    target_user_ids: [],
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await packageService.fetchLists();
      const data = response as any;
      console.log("Fetched packages:", data);
      setPackages(data?.data || []);
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error(t("support.create.failedToLoadUsers"));
    }
  };

  const handleImageUpload = (file: File | null) => {
    setFormData((prev) => ({ ...prev, image: file }));
  };

  const handleUserSelection = async (searchQuery: string) => {
    try {
      await userService.getAll({ search: searchQuery, per_page: 50 });
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const toggleUserSelection = (userId: number | string) => {
    setFormData((prev) => ({
      ...prev,
      target_user_ids: prev.target_user_ids.includes(userId)
        ? prev.target_user_ids.filter((id) => id !== userId)
        : [...prev.target_user_ids, userId],
    }));
  };

  const handleSubmit = async () => {
    // Validate required fields
    if (!formData.title || !formData.body) {
      toast.error("Title and body are required");
      return;
    }

    if (formData.link_type === "package" && !formData.package_id) {
      toast.error("Please select a package");
      return;
    }

    if (
      formData.target_audience === "specific" &&
      formData.target_user_ids.length === 0
    ) {
      toast.error("Please select at least one user");
      return;
    }

    setIsSubmitting(true);
    try {
      await notificationService.sendNotification({
        title: formData.title,
        body: formData.body,
        image: formData.image || undefined,
        link_type: formData.link_type,
        package_id: formData.package_id || undefined,
        target_audience: formData.target_audience,
        target_user_ids:
          formData.target_audience === "specific"
            ? formData.target_user_ids
            : undefined,
      });

      toast.success("Notification sent successfully");
      onSuccess?.();
      onClose();
    } catch (error) {
      console.error("Error sending notification:", error);
      toast.error("Failed to send notification");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <BaseModal
      open={open}
      onOpenChange={onClose}
      title="Send Push Notification"
      onSubmit={handleSubmit}
      isSubmitting={isSubmitting}
      submitButtonText="Send Notification"
      size="2xl"
      closeButtonText="Cancel"
    >
      <div className="grid gap-4">
        <div className="space-y-2">
          <Label htmlFor="title">
            Title <span className="text-red-500">*</span>
          </Label>
          <Input
            id="title"
            placeholder="Enter notification title"
            value={formData.title}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, title: e.target.value }))
            }
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="body">
            Message <span className="text-red-500">*</span>
          </Label>
          <Textarea
            id="body"
            placeholder="Enter notification message"
            value={formData.body}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, body: e.target.value }))
            }
            rows={4}
          />
        </div>

        <div className="space-y-2">
          <Label>Notification Image (Optional)</Label>
          <ImageUpload
            value={formData.image ? URL.createObjectURL(formData.image) : ""}
            onChange={(file) => handleImageUpload(file)}
            onRemove={() => handleImageUpload(null)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="link_type">Link Type</Label>
          <Select
            value={formData.link_type}
            onValueChange={(value: "none" | "product" | "package" | "url") =>
              setFormData((prev) => ({
                ...prev,
                link_type: value,
                package_id: "",
              }))
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select link type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">None</SelectItem>
              <SelectItem value="product">Product</SelectItem>
              <SelectItem value="package">Package</SelectItem>
              <SelectItem value="url">URL</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {formData.link_type === "package" && (
          <div className="space-y-2">
            <Label htmlFor="package_id">
              Select Package <span className="text-red-500">*</span>
            </Label>
            <ComboboxSelect
              options={packages}
              value={formData.package_id}
              onValueChange={(value) =>
                setFormData((prev) => ({
                  ...prev,
                  package_id: value.toString(),
                }))
              }
              placeholder="Select a package..."
              searchPlaceholder="Search packages..."
              emptyText="No packages found."
              getOptionValue={(pkg) => pkg.id.toString()}
              getOptionLabel={(pkg) => pkg?.package_name}
              renderOption={(pkg) => (
                <div className="flex flex-col">
                  <span className="font-medium">{pkg.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {pkg.category?.category_name}
                  </span>
                </div>
              )}
            />
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="target_audience">Target Audience</Label>
          <Select
            value={formData.target_audience}
            onValueChange={(value: "all" | "specific") =>
              setFormData((prev) => ({
                ...prev,
                target_audience: value,
                target_user_ids: [],
              }))
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select target audience" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Users</SelectItem>
              <SelectItem value="specific">Specific Users</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {formData.target_audience === "specific" && (
          <div className="space-y-2">
            <Label>
              Select Users <span className="text-red-500">*</span>
            </Label>
            <div className="border rounded-lg p-4 space-y-2">
              <Input
                placeholder="Search users by name or email..."
                onChange={(e) => handleUserSelection(e.target.value)}
              />
              <div className="max-h-[200px] overflow-y-auto space-y-1">
                {userStore.users.map((user) => (
                  <div
                    key={user.id}
                    className="flex items-center space-x-2 p-2 hover:bg-accent rounded cursor-pointer"
                    onClick={() => toggleUserSelection(user.id)}
                  >
                    <input
                      type="checkbox"
                      checked={formData.target_user_ids.includes(user.id)}
                      onChange={() => toggleUserSelection(user.id)}
                      className="h-4 w-4"
                    />
                    <div className="flex-1">
                      <p className="text-sm font-medium">
                        {user.firstName} {user.lastName}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              {formData.target_user_ids.length > 0 && (
                <p className="text-sm text-muted-foreground">
                  {formData.target_user_ids.length} user(s) selected
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </BaseModal>
  );
}
