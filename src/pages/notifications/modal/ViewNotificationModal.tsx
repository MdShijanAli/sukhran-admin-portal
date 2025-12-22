import { BaseModal } from "@/components/modals";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Notification } from "@/stores/notificationStore";

interface ViewNotificationModalProps {
  open: boolean;
  onClose: (value: boolean) => void;
  notification: Notification | null;
}

export default function ViewNotificationModal({
  open,
  onClose,
  notification,
}: ViewNotificationModalProps) {
  if (!notification) return null;

  return (
    <BaseModal
      open={open}
      onOpenChange={onClose}
      title="Notification Details"
      size="2xl"
      hideSubmitButton
      closeButtonText="Close"
    >
      <div className="grid gap-4 py-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label className="text-muted-foreground">Title</Label>
            <p className="font-medium mt-1">{notification.title}</p>
          </div>
          <div>
            <Label className="text-muted-foreground">Status</Label>
            <div className="mt-1">
              <Badge
                variant={
                  notification.status === "sent"
                    ? "default"
                    : notification.status === "pending"
                    ? "secondary"
                    : "destructive"
                }
                className="capitalize"
              >
                {notification.status}
              </Badge>
            </div>
          </div>
        </div>

        <div>
          <Label className="text-muted-foreground">Message</Label>
          <p className="mt-1">{notification.body}</p>
        </div>

        {notification.image_url && (
          <div>
            <Label className="text-muted-foreground">Image</Label>
            <img
              src={notification.image_url}
              alt="Notification"
              className="mt-2 rounded-lg max-h-48 object-cover"
            />
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label className="text-muted-foreground">Link Type</Label>
            <div className="mt-1">
              <Badge variant="outline" className="capitalize">
                {notification.link_type}
              </Badge>
            </div>
          </div>
          <div>
            <Label className="text-muted-foreground">Target Audience</Label>
            <div className="mt-1">
              <Badge
                variant={
                  notification.target_audience === "all"
                    ? "default"
                    : "secondary"
                }
              >
                {notification.target_audience === "all"
                  ? "All Users"
                  : "Specific Users"}
              </Badge>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <Label className="text-muted-foreground">Sent</Label>
            <p className="font-medium mt-1">{notification.sent_count || 0}</p>
          </div>
          <div>
            <Label className="text-muted-foreground">Delivered</Label>
            <p className="font-medium mt-1">
              {notification.delivered_count || 0}
            </p>
          </div>
          <div>
            <Label className="text-muted-foreground">Failed</Label>
            <p className="font-medium text-red-500 mt-1">
              {notification.failed_count || 0}
            </p>
          </div>
        </div>

        <div>
          <Label className="text-muted-foreground">Sent Date</Label>
          <p className="mt-1">
            {new Date(notification.created_at).toLocaleString()}
          </p>
        </div>

        {notification.created_by && (
          <div>
            <Label className="text-muted-foreground">Sent By</Label>
            <p className="mt-1">
              {notification.created_by.firstName}{" "}
              {notification.created_by.lastName}
            </p>
          </div>
        )}
      </div>
    </BaseModal>
  );
}
