import { useEffect, useState } from "react";
import { BaseModal } from "@/components/modals";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { User } from "@/stores/userStore";
import userService from "@/services/userService";
import { Loader2 } from "lucide-react";

interface ViewModalProps {
  open: boolean;
  onClose: (value: boolean) => void;
  userId: number | string | null;
}

export default function ViewModal({ open, onClose, userId }: ViewModalProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchUserDetails = async () => {
      if (!userId || !open) return;
      setIsLoading(true);
      try {
        const response = await userService.fetchDetails(userId);
        // API returns { user: User } structure based on the provided response
        const responseData = response as unknown as Record<string, unknown>;
        const userData =
          (responseData?.user as User) || (response as unknown as User);
        setUser(userData);
      } catch (error) {
        console.error("Error fetching user details:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchUserDetails();
  }, [userId, open]);

  if (!user && !isLoading) return null;

  return (
    <BaseModal
      open={open}
      onOpenChange={onClose}
      title="User Details"
      showSubmitButton={false}
      closeButtonText="Close"
      size="2xl"
    >
      {isLoading ? (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : user ? (
        <div className="space-y-6">
          {/* User Info Section */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Personal Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-muted-foreground">First Name</Label>
                <p className="font-medium">{user.firstName}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Last Name</Label>
                <p className="font-medium">{user.lastName}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Email</Label>
                <p className="font-medium">{user.email}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Mobile</Label>
                <p className="font-medium">{user.mobile}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Gender</Label>
                <p className="font-medium">{user.gender || "N/A"}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Date of Birth</Label>
                <p className="font-medium">{user.date_of_birth || "N/A"}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Role</Label>
                <Badge variant="outline">{user.role.display_name}</Badge>
              </div>
              <div>
                <Label className="text-muted-foreground">Status</Label>
                <Badge variant={user.isActive ? "default" : "secondary"}>
                  {user.isActive ? "Active" : "Inactive"}
                </Badge>
              </div>
              <div>
                <Label className="text-muted-foreground">Referral Code</Label>
                <p className="font-medium">{user.referral_code || "N/A"}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Business ID</Label>
                <p className="font-medium">{user.businessId || "N/A"}</p>
              </div>
            </div>
          </div>

          {/* Addresses Section */}
          {user.addresses && user.addresses.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-3">Addresses</h3>
              <div className="space-y-3">
                {user.addresses.map((address, index) => (
                  <div key={address.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">Address {index + 1}</span>
                      <div className="flex gap-2">
                        <Badge variant="outline">{address.category}</Badge>
                        {address.is_default && (
                          <Badge variant="default">Default</Badge>
                        )}
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <span className="text-muted-foreground">House:</span>{" "}
                        {address.house}
                      </div>
                      <div>
                        <span className="text-muted-foreground">Road:</span>{" "}
                        {address.road}
                      </div>
                      <div>
                        <span className="text-muted-foreground">Block:</span>{" "}
                        {address.block}
                      </div>
                      <div>
                        <span className="text-muted-foreground">Zip:</span>{" "}
                        {address.zip_code}
                      </div>
                      {address.label && (
                        <div className="col-span-2">
                          <span className="text-muted-foreground">Label:</span>{" "}
                          {address.label}
                        </div>
                      )}
                      {address.landmark && (
                        <div className="col-span-2">
                          <span className="text-muted-foreground">
                            Landmark:
                          </span>{" "}
                          {address.landmark}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : null}
    </BaseModal>
  );
}
