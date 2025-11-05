import { BaseModal } from "@/components/modals";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  status: string;
  subscriptionStatus: string;
  loyaltyPoints: number;
  totalOrders: number;
  joinDate: string;
}

interface ViewModalProps {
  open: boolean;
  onClose: () => void;
  user: User | null;
}

export default function ViewModal({ open, onClose, user }: ViewModalProps) {
  if (!user) return null;

  return (
    <BaseModal
      open={open}
      onOpenChange={onClose}
      title="User Details"
      showSubmitButton={false}
      closeButtonText="Close"
      size="lg"
    >
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label className="text-muted-foreground">Name</Label>
            <p className="font-medium">{user.name}</p>
          </div>
          <div>
            <Label className="text-muted-foreground">Email</Label>
            <p className="font-medium">{user.email}</p>
          </div>
          <div>
            <Label className="text-muted-foreground">Phone</Label>
            <p className="font-medium">{user.phone}</p>
          </div>
          <div>
            <Label className="text-muted-foreground">Location</Label>
            <p className="font-medium">{user.location}</p>
          </div>
          <div>
            <Label className="text-muted-foreground">Status</Label>
            <div className="mt-1">
              <Badge
                variant={user.status === "active" ? "default" : "secondary"}
              >
                {user.status}
              </Badge>
            </div>
          </div>
          <div>
            <Label className="text-muted-foreground">Subscription</Label>
            <div className="mt-1">
              <Badge
                variant={
                  user.subscriptionStatus === "active" ? "default" : "outline"
                }
              >
                {user.subscriptionStatus}
              </Badge>
            </div>
          </div>
          <div>
            <Label className="text-muted-foreground">Loyalty Points</Label>
            <p className="font-medium">{user.loyaltyPoints}</p>
          </div>
          <div>
            <Label className="text-muted-foreground">Total Orders</Label>
            <p className="font-medium">{user.totalOrders}</p>
          </div>
          <div>
            <Label className="text-muted-foreground">Join Date</Label>
            <p className="font-medium">{user.joinDate}</p>
          </div>
        </div>
      </div>
    </BaseModal>
  );
}
