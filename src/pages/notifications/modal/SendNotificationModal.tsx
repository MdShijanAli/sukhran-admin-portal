import { useState } from "react";
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
import { useProductStore } from "@/stores/productStore";
import productService from "@/services/productService";
import { useTranslation } from "react-i18next";

interface NotificationFormData {
  title: string;
  body: string;
  image: string;
  imageFile: File | null;
  link_type: "none" | "product" | "package" | "url";
  package_id?: string;
  product_id?: string;
  url?: string;
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
  const packageStore = usePackageStore();
  const productStore = useProductStore();
  const { t } = useTranslation();
  const userStore = useUserStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<NotificationFormData>({
    title: "",
    body: "",
    image: "",
    imageFile: null,
    link_type: "none",
    package_id: "",
    product_id: "",
    url: "",
    target_audience: "all",
    target_user_ids: [],
  });

  // No need for manual fetching - ComboboxSelect will handle it

  const handleImageUpload = (imageUrl: string) => {
    if (!imageUrl) {
      setFormData((prev) => ({ ...prev, image: "", imageFile: null }));
      return;
    }

    // Convert base64 to File object for API submission
    fetch(imageUrl)
      .then((res) => res.blob())
      .then((blob) => {
        const file = new File([blob], "notification-image.jpg", {
          type: blob.type,
        });
        setFormData((prev) => ({ ...prev, image: imageUrl, imageFile: file }));
      })
      .catch((error) => {
        console.error("Error converting image:", error);
        toast.error(t("notifications.messages.imageProcessFailed"));
      });
  };

  const handleUserSelection = async (searchQuery: string) => {
    const queryString = `search=${encodeURIComponent(searchQuery)}&per_page=50`;
    try {
      await userService.fetchLists(queryString);
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
      toast.error(t("notifications.messages.titleBodyRequired"));
      return;
    }

    if (formData.link_type === "package" && !formData.package_id) {
      toast.error(t("notifications.messages.packageRequired"));
      return;
    }

    if (formData.link_type === "url" && !formData.url) {
      toast.error(t("notifications.messages.urlRequired"));
      return;
    }

    if (formData.link_type === "product" && !formData.product_id) {
      toast.error(t("notifications.messages.productRequired"));
      return;
    }

    if (
      formData.target_audience === "specific" &&
      formData.target_user_ids.length === 0
    ) {
      toast.error(t("notifications.messages.usersRequired"));
      return;
    }

    setIsSubmitting(true);
    try {
      await notificationService.sendNotification({
        title: formData.title,
        body: formData.body,
        image: formData.imageFile || undefined,
        link_type: formData.link_type,
        package_id: formData.package_id || undefined,
        url: formData.url || undefined,
        product_id: formData.product_id || undefined,
        target_audience: formData.target_audience,
        target_user_ids:
          formData.target_audience === "specific"
            ? formData.target_user_ids
            : undefined,
      });

      toast.success(t("notifications.messages.sentSuccess"));
      onSuccess?.();
      onClose();
      // Reset form
      setFormData({
        title: "",
        body: "",
        image: "",
        imageFile: null,
        link_type: "none",
        package_id: "",
        product_id: "",
        url: "",
        target_audience: "all",
        target_user_ids: [],
      });
    } catch (error) {
      console.error("Error sending notification:", error);
      toast.error(t("notifications.messages.sentFailed"));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <BaseModal
      open={open}
      onOpenChange={onClose}
      title={t("notifications.send.title")}
      onSubmit={handleSubmit}
      isSubmitting={isSubmitting}
      submitButtonText={t("notifications.send.submitButton")}
      size="2xl"
      closeButtonText={t("notifications.send.cancel")}
    >
      <div className="grid gap-4">
        <div className="space-y-2">
          <Label htmlFor="title">
            {t("notifications.send.notificationTitle")}{" "}
            <span className="text-red-500">*</span>
          </Label>
          <Input
            id="title"
            placeholder={t("notifications.send.titlePlaceholder")}
            value={formData.title}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, title: e.target.value }))
            }
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="body">
            {t("notifications.send.notificationMessage")}{" "}
            <span className="text-red-500">*</span>
          </Label>
          <Textarea
            id="body"
            placeholder={t("notifications.send.messagePlaceholder")}
            value={formData.body}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, body: e.target.value }))
            }
            rows={4}
          />
        </div>

        <div className="space-y-2">
          <Label>{t("notifications.send.notificationImage")}</Label>
          <ImageUpload value={formData.image} onChange={handleImageUpload} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="link_type">{t("notifications.send.linkType")}</Label>
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
              <SelectValue placeholder={t("notifications.send.linkType")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">
                {t("notifications.linkTypes.none")}
              </SelectItem>
              <SelectItem value="product">
                {t("notifications.linkTypes.product")}
              </SelectItem>
              <SelectItem value="package">
                {t("notifications.linkTypes.package")}
              </SelectItem>
              <SelectItem value="url">
                {t("notifications.linkTypes.url")}
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {formData.link_type === "url" && (
          <div className="space-y-2">
            <Label htmlFor="url">
              {t("notifications.send.url")}{" "}
              <span className="text-red-500">*</span>
            </Label>
            <Input
              id="url"
              placeholder={t("notifications.send.urlPlaceholder")}
              value={formData.url || ""}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, url: e.target.value }))
              }
            />
          </div>
        )}

        {formData.link_type === "product" && (
          <div className="space-y-2">
            <Label htmlFor="product_id">
              {t("notifications.send.selectProduct")}{" "}
              <span className="text-red-500">*</span>
            </Label>
            <ComboboxSelect
              service={productService}
              store={productStore}
              storeDataKey="products"
              enableApiSearch={true}
              value={formData.product_id}
              onValueChange={(value) =>
                setFormData((prev) => ({
                  ...prev,
                  product_id: value.toString(),
                }))
              }
              placeholder={t("notifications.send.selectProduct")}
              searchPlaceholder={t("notifications.send.searchProducts")}
              emptyText={t("notifications.send.noProducts")}
              getOptionValue={(product) => product.id.toString()}
              getOptionLabel={(product) => product?.name}
              renderOption={(product) => (
                <div className="flex flex-col">
                  <span className="font-medium">{product.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {product.category?.name}
                  </span>
                </div>
              )}
            />
          </div>
        )}

        {formData.link_type === "package" && (
          <div className="space-y-2">
            <Label htmlFor="package_id">
              {t("notifications.send.selectPackage")}{" "}
              <span className="text-red-500">*</span>
            </Label>
            <ComboboxSelect
              service={packageService}
              store={packageStore}
              storeDataKey="packages"
              enableApiSearch={true}
              value={formData.package_id}
              onValueChange={(value) =>
                setFormData((prev) => ({
                  ...prev,
                  package_id: value.toString(),
                }))
              }
              placeholder={t("notifications.send.selectPackage")}
              searchPlaceholder={t("notifications.send.searchPackages")}
              emptyText={t("notifications.send.noPackages")}
              getOptionValue={(pkg) => pkg.id.toString()}
              getOptionLabel={(pkg) =>
                pkg?.name + ` - ${pkg.pricing?.currentPrice} BDT`
              }
              renderOption={(pkg) => (
                <div className="flex flex-col">
                  <span className="font-medium">{pkg.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {pkg.pricing?.currentPrice} BDT
                  </span>
                </div>
              )}
            />
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="target_audience">
            {t("notifications.send.targetAudience")}
          </Label>
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
              <SelectValue
                placeholder={t("notifications.send.targetAudience")}
              />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">
                {t("notifications.audience.all")}
              </SelectItem>
              <SelectItem value="specific">
                {t("notifications.audience.specific")}
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {formData.target_audience === "specific" && (
          <div className="space-y-2">
            <Label>
              {t("notifications.send.selectUsers")}{" "}
              <span className="text-red-500">*</span>
            </Label>
            <div className="border rounded-lg p-4 space-y-2">
              <Input
                placeholder={t("notifications.send.searchUsers")}
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
                  {formData.target_user_ids.length}{" "}
                  {t("notifications.send.usersSelected")}
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </BaseModal>
  );
}
