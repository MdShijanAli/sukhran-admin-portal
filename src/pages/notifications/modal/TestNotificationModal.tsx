import { useState } from "react";
import { BaseModal } from "@/components/modals";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import notificationService from "@/services/notificationService";
import { toast } from "sonner";

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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<TestFormData>({
    fcm_token: "",
    title: "",
    body: "",
  });

  const handleSubmit = async () => {
    // Validate required fields
    if (!formData.fcm_token || !formData.title || !formData.body) {
      toast.error("All fields are required for testing");
      return;
    }

    setIsSubmitting(true);
    try {
      await notificationService.testNotification(formData);

      toast.success("Test notification sent successfully");
      onClose();
      // Reset form
      setFormData({
        fcm_token: "",
        title: "",
        body: "",
      });
    } catch (error) {
      console.error("Error testing notification:", error);
      toast.error("Failed to send test notification");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <BaseModal
      open={open}
      onOpenChange={onClose}
      title="Test Push Notification"
      description="Send a test notification to a specific FCM token"
      onSubmit={handleSubmit}
      isSubmitting={isSubmitting}
      submitButtonText="Send Test"
      size="lg"
      closeButtonText="Cancel"
    >
      <div className="grid gap-4">
        <div className="space-y-2">
          <Label htmlFor="fcm_token">
            FCM Token <span className="text-red-500">*</span>
          </Label>
          <Textarea
            id="fcm_token"
            placeholder="Enter FCM token"
            value={formData.fcm_token}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, fcm_token: e.target.value }))
            }
            rows={3}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="test_title">
            Title <span className="text-red-500">*</span>
          </Label>
          <Input
            id="test_title"
            placeholder="Enter notification title"
            value={formData.title}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, title: e.target.value }))
            }
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="test_body">
            Message <span className="text-red-500">*</span>
          </Label>
          <Textarea
            id="test_body"
            placeholder="Enter notification message"
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
