import { useEffect, useState } from "react";
import { BaseModal } from "@/components/modals";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";
import { Role } from "@/stores/roleStore";
import roleService from "@/services/roleService";

interface ViewModalProps {
  open: boolean;
  onClose: (value: boolean) => void;
  roleId: number | string | null;
}

export default function ViewModal({ open, onClose, roleId }: ViewModalProps) {
  const [role, setRole] = useState<Role | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchRoleDetails = async () => {
      if (!roleId || !open) return;
      setIsLoading(true);
      try {
        const response = await roleService.fetchDetails(roleId);
        const responseData = response as unknown as Record<string, unknown>;
        const roleData =
          (responseData?.data as Role) || (response as unknown as Role);
        setRole(roleData);
      } catch (error) {
        console.error("Error fetching role details:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchRoleDetails();
  }, [roleId, open]);

  if (!role && !isLoading) return null;

  return (
    <BaseModal
      open={open}
      onOpenChange={onClose}
      title="Role Details"
      showSubmitButton={false}
      closeButtonText="Close"
      size="lg"
    >
      {isLoading ? (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : role ? (
        <div className="space-y-4">
          {/* Role Header */}
          <div className="bg-gradient-to-r from-primary/5 to-primary/10 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold mb-1">{role.display_name}</h3>
                <p className="text-sm text-muted-foreground">{role.name}</p>
              </div>
              <Badge variant={role.isActive ? "default" : "secondary"}>
                {role.isActive ? "Active" : "Inactive"}
              </Badge>
            </div>
            {role.description && (
              <p className="text-sm mt-3 text-muted-foreground">
                {role.description}
              </p>
            )}
          </div>

          {/* Role Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border rounded-lg p-4 space-y-3">
              <h4 className="font-semibold text-sm text-primary mb-3">
                Role Information
              </h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <Label className="text-xs text-muted-foreground">
                    Total Permissions
                  </Label>
                  <span className="font-medium">
                    {role.permissions_count || role.permissions?.length || 0}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <Label className="text-xs text-muted-foreground">
                    Assigned Users
                  </Label>
                  <span className="font-medium">{role.users_count || 0}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <Label className="text-xs text-muted-foreground">
                    Created At
                  </Label>
                  <span className="font-medium">
                    {new Date(role.created_at).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <Label className="text-xs text-muted-foreground">
                    Updated At
                  </Label>
                  <span className="font-medium">
                    {new Date(role.updated_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>

            <div className="border rounded-lg p-4 space-y-3">
              <h4 className="font-semibold text-sm text-primary mb-3">
                Status Information
              </h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <Label className="text-xs text-muted-foreground">
                    Status
                  </Label>
                  <Badge variant={role.isActive ? "default" : "secondary"}>
                    {role.isActive ? "Active" : "Inactive"}
                  </Badge>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <Label className="text-xs text-muted-foreground">
                    Role ID
                  </Label>
                  <span className="font-medium">{role.id}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Permissions Section */}
          {role.permissions && role.permissions.length > 0 && (
            <div className="border rounded-lg p-4">
              <h4 className="font-semibold text-sm text-primary mb-3">
                Permissions ({role.permissions.length})
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {role.permissions.map((permission) => (
                  <div
                    key={permission.id}
                    className="flex items-start gap-2 p-2 rounded bg-muted/30"
                  >
                    <div className="flex-1">
                      <p className="text-sm font-medium">
                        {permission.display_name}
                      </p>
                      {permission.description && (
                        <p className="text-xs text-muted-foreground">
                          {permission.description}
                        </p>
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
