import { useEffect, useState } from "react";
import { BaseModal } from "@/components/modals";
import { Badge } from "@/components/ui/badge";
import { User } from "@/stores/userStore";
import userService from "@/services/userService";
import { Loader2 } from "lucide-react";
import noImage from "@/assets/images/avatar-ractangle.jpg";

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
        <div className="space-y-3">
          {/* User Profile Section */}
          <div className="flex items-center gap-3 bg-gradient-to-r from-primary/5 to-primary/10 rounded-lg p-4">
            <img
              src={user.image_url || user.displayImage || noImage}
              alt={`${user.firstName} ${user.lastName}`}
              className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-md"
            />
            <div className="flex-1 min-w-0">
              <h3 className="text-xl font-bold mb-1 truncate">
                {user.firstName} {user.lastName}
              </h3>
              {user.preferredName && (
                <p className="text-sm text-muted-foreground mb-2">
                  Preferred: {user.preferredName}
                </p>
              )}
              <div className="flex flex-wrap gap-1.5">
                <Badge variant="outline" className="text-xs">
                  {user.role.display_name}
                </Badge>
                <Badge
                  variant={user.isActive ? "default" : "secondary"}
                  className="text-xs"
                >
                  {user.isActive ? "Active" : "Inactive"}
                </Badge>
                {user.isBlocked && (
                  <Badge variant="destructive" className="text-xs">
                    Blocked
                  </Badge>
                )}
                {user.email_verified_at && (
                  <Badge className="bg-green-600 text-xs">Email ✓</Badge>
                )}
                {user.mobile_verified_at && (
                  <Badge className="bg-blue-600 text-xs">Mobile ✓</Badge>
                )}
              </div>
            </div>
          </div>

          {/* Information Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {/* Personal Information */}
            <div className="border rounded-lg p-4 space-y-3">
              <h4 className="font-semibold text-sm text-primary mb-3">
                Personal Information
              </h4>
              <div className="space-y-2">
                <div className="flex justify-between items-start">
                  <span className="text-xs text-muted-foreground">Email:</span>
                  <span className="text-sm font-medium text-right">
                    {user.email}
                  </span>
                </div>
                <div className="flex justify-between items-start">
                  <span className="text-xs text-muted-foreground">Mobile:</span>
                  <span className="text-sm font-medium text-right">
                    {user.mobile}
                  </span>
                </div>
                <div className="flex justify-between items-start">
                  <span className="text-xs text-muted-foreground">Gender:</span>
                  <span className="text-sm font-medium capitalize">
                    {user.gender || "N/A"}
                  </span>
                </div>
                <div className="flex justify-between items-start">
                  <span className="text-xs text-muted-foreground">
                    Date of Birth:
                  </span>
                  <span className="text-sm font-medium">
                    {user.date_of_birth || "N/A"}
                  </span>
                </div>
              </div>
            </div>

            {/* Account Details */}
            <div className="border rounded-lg p-4 space-y-3">
              <h4 className="font-semibold text-sm text-primary mb-3">
                Account Details
              </h4>
              <div className="space-y-2">
                <div className="flex justify-between items-start">
                  <span className="text-xs text-muted-foreground">
                    Referral Code:
                  </span>
                  <span className="text-sm font-medium">
                    {user.referral_code || "N/A"}
                  </span>
                </div>
                <div className="flex justify-between items-start">
                  <span className="text-xs text-muted-foreground">
                    Referred By:
                  </span>
                  <span className="text-sm font-medium">
                    {user.referred_by || "N/A"}
                  </span>
                </div>
                <div className="flex justify-between items-start">
                  <span className="text-xs text-muted-foreground">
                    Business ID:
                  </span>
                  <span className="text-sm font-medium">
                    {user.businessId || "N/A"}
                  </span>
                </div>
                <div className="flex justify-between items-start">
                  <span className="text-xs text-muted-foreground">
                    Store ID:
                  </span>
                  <span className="text-sm font-medium">
                    {user.storeId || "N/A"}
                  </span>
                </div>
              </div>
            </div>

            {/* Security Information */}
            <div className="border rounded-lg p-4 space-y-3">
              <h4 className="font-semibold text-sm text-primary mb-3">
                Security
              </h4>
              <div className="space-y-2">
                <div className="flex justify-between items-start">
                  <span className="text-xs text-muted-foreground">
                    Failed Attempts:
                  </span>
                  <span className="text-sm font-medium">
                    {user.attemptWrongPassword}
                  </span>
                </div>
                <div className="flex justify-between items-start">
                  <span className="text-xs text-muted-foreground">Status:</span>
                  <div className="flex gap-1">
                    {user.isBlocked && (
                      <Badge variant="destructive" className="text-xs">
                        Blocked
                      </Badge>
                    )}
                    {user.isDeleted && (
                      <Badge variant="destructive" className="text-xs">
                        Deleted
                      </Badge>
                    )}
                    {!user.isBlocked && !user.isDeleted && (
                      <Badge variant="default" className="text-xs">
                        Active
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Timestamps */}
            <div className="border rounded-lg p-4 space-y-3">
              <h4 className="font-semibold text-sm text-primary mb-3">
                Timeline
              </h4>
              <div className="space-y-2">
                <div className="flex justify-between items-start">
                  <span className="text-xs text-muted-foreground">
                    Created:
                  </span>
                  <span className="text-sm font-medium">
                    {new Date(user.created_at).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                </div>
                <div className="flex justify-between items-start">
                  <span className="text-xs text-muted-foreground">
                    Last Updated:
                  </span>
                  <span className="text-sm font-medium">
                    {new Date(user.updated_at).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Addresses Section */}
          {user.addresses && user.addresses.length > 0 && (
            <div className="border rounded-lg p-4">
              <h4 className="font-semibold text-sm text-primary mb-3">
                Addresses ({user.addresses.length})
              </h4>
              <div className="space-y-2">
                {user.addresses.map((address, index) => (
                  <div
                    key={address.id}
                    className="bg-muted/50 rounded-md p-3 space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">
                        Address {index + 1}
                      </span>
                      <div className="flex gap-1.5">
                        <Badge variant="outline" className="text-xs capitalize">
                          {address.category}
                        </Badge>
                        {address.is_default && (
                          <Badge variant="default" className="text-xs">
                            Default
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">House:</span>
                        <span className="font-medium">{address.house}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Road:</span>
                        <span className="font-medium">{address.road}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Block:</span>
                        <span className="font-medium">{address.block}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Zip:</span>
                        <span className="font-medium">{address.zip_code}</span>
                      </div>
                      {address.label && (
                        <div className="col-span-2 flex justify-between">
                          <span className="text-muted-foreground">Label:</span>
                          <span className="font-medium">{address.label}</span>
                        </div>
                      )}
                      {address.landmark && (
                        <div className="col-span-2 flex justify-between">
                          <span className="text-muted-foreground">
                            Landmark:
                          </span>
                          <span className="font-medium">
                            {address.landmark}
                          </span>
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
