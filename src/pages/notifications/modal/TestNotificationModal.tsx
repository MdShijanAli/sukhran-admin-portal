import { useState } from "react";
import { BaseModal } from "@/components/modals";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import notificationService from "@/services/notificationService";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

interface TestFormData {
  fcm_token: string;
  title: string;
  body: string;
}

interface TestNotificationModalProps {
  open: boolean;
  onClose: () => void;
}

export default function TestNotificationModal({
  open,
  onClose,
}: TestNotificationModalProps) {
  const { t } = useTranslation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<TestFormData>({
    fcm_token: "",
    title: "",
    body: "",
  });

  const handleSubmit = async () => {
    // Validate required fields
    if (!formData.fcm_token || !formData.title || !formData.body) {
      toast.error(t("notifications.messages.testFieldsRequired"));
      return;
    }

    setIsSubmitting(true);
    try {
      await notificationService.testNotification(formData);

      toast.success(t("notifications.messages.testSentSuccess"));
      onClose();
      // Reset form
      setFormData({
        fcm_token: "",
        title: "",
        body: "",
      });
    } catch (error) {
      console.error("Error testing notification:", error);
      toast.error(t("notifications.messages.testSentFailed"));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <BaseModal
      open={open}
      onOpenChange={onClose}
      title={t("notifications.test.title")}
      description={t("notifications.test.description")}
      onSubmit={handleSubmit}
      isSubmitting={isSubmitting}
      submitButtonText={t("notifications.test.submitButton")}
      size="lg"
      closeButtonText={t("notifications.test.cancel")}
    >
      <div className="grid gap-4">
        <div className="space-y-2">
          <Label htmlFor="fcm_token">
            {t("notifications.test.fcmToken")}{" "}
            <span className="text-red-500">*</span>
          </Label>
          <Textarea
            id="fcm_token"
            placeholder={t("notifications.test.fcmTokenPlaceholder")}
            value={formData.fcm_token}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, fcm_token: e.target.value }))
            }
            rows={3}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="test_title">
            {t("notifications.test.notificationTitle")}{" "}
            <span className="text-red-500">*</span>
          </Label>
          <Input
            id="test_title"
            placeholder={t("notifications.test.titlePlaceholder")}
            value={formData.title}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, title: e.target.value }))
            }
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="test_body">
            {t("notifications.test.notificationMessage")}{" "}
            <span className="text-red-500">*</span>
          </Label>
          <Textarea
            id="test_body"
            placeholder={t("notifications.test.messagePlaceholder")}
            value={formData.body}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, body: e.target.value }))
            }
            rows={3}
          />
        </div>
      </div>
    </BaseModal>
  );
}
