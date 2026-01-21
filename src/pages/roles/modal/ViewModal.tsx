import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { BaseModal } from "@/components/modals";
import { Badge } from "@/components/ui/badge";
import { Loader2, Shield, Users, Key, Calendar } from "lucide-react";
import { Role } from "@/stores/roleStore";
import roleService from "@/services/roleService";

interface ViewModalProps {
  open: boolean;
  onClose: (value: boolean) => void;
  roleId: number | string | null;
}

export default function ViewModal({ open, onClose, roleId }: ViewModalProps) {
  const { t } = useTranslation();
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
          (responseData?.role as Role) || (response as unknown as Role);
        console.log("Fetched role details:", roleData);
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
      title={t("roles.view.roleDetails")}
      showSubmitButton={false}
      closeButtonText={t("close")}
      size="xl"
    >
      {isLoading ? (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : role ? (
        <div className="space-y-4">
          {/* Role Header */}
          <div className="flex items-center justify-between p-4 bg-card border rounded-lg">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-primary/10 rounded-lg">
                <Shield className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">{role.display_name}</h3>
                <p className="text-sm text-muted-foreground">{role.name}</p>
              </div>
            </div>
            <Badge variant={role.isActive ? "default" : "secondary"}>
              {role.isActive
                ? t("roles.status.active")
                : t("roles.status.inactive")}
            </Badge>
          </div>

          {/* Description */}
          {role.description && (
            <div className="p-3 bg-muted/50 border rounded-lg">
              <p className="text-sm text-muted-foreground leading-relaxed">
                {role.description}
              </p>
            </div>
          )}

          {/* Stats Cards */}
          <div className="grid grid-cols-3 gap-3">
            <div className="p-3 bg-card border rounded-lg">
              <div className="flex items-center gap-2 text-muted-foreground mb-2">
                <Key className="h-4 w-4" />
                <span className="text-xs font-medium">
                  {t("roles.view.permissions")}
                </span>
              </div>
              <p className="text-2xl ">{role.permissions_count || 0}</p>
            </div>

            <div className="p-3 bg-card border rounded-lg">
              <div className="flex items-center gap-2 text-muted-foreground mb-2">
                <Users className="h-4 w-4" />
                <span className="text-xs font-medium">
                  {t("roles.view.assignedUsers")}
                </span>
              </div>
              <p className="text-2xl ">{role.users_count || 0}</p>
            </div>

            <div className="p-3 bg-card border rounded-lg">
              <div className="flex items-center gap-2 text-muted-foreground mb-2">
                <Calendar className="h-4 w-4" />
                <span className="text-xs font-medium">
                  {t("roles.view.created")}
                </span>
              </div>
              <p className="text-sm font-semibold">
                {new Date(role.created_at).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </p>
            </div>
          </div>

          {/* Permissions Section */}
          {role.permissions && role.permissions.length > 0 && (
            <div className="border rounded-lg overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 bg-muted/50 border-b">
                <h4 className="font-semibold text-sm">
                  {t("roles.view.assignedPermissions")}
                </h4>
                <Badge variant="secondary">
                  {role.permissions.length} {t("roles.view.total")}
                </Badge>
              </div>

              <div className="p-4 space-y-4 max-h-[400px] overflow-y-auto">
                {(() => {
                  const groupedPermissions = role.permissions.reduce(
                    (acc, permission) => {
                      if (!acc[permission.module]) {
                        acc[permission.module] = [];
                      }
                      acc[permission.module].push(permission);
                      return acc;
                    },
                    {} as Record<string, typeof role.permissions>,
                  );

                  return (
                    <>
                      {Object.entries(groupedPermissions).map(
                        ([module, permissions]) => (
                          <div key={module}>
                            <div className="flex items-center gap-2 mb-2 px-2 py-1.5 bg-muted/50 rounded">
                              <h5 className="text-xs font-semibold text-primary uppercase">
                                {module}
                              </h5>
                              <Badge variant="outline" className="text-xs h-5">
                                {permissions.length}
                              </Badge>
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                              {permissions.map((permission) => (
                                <div
                                  key={permission.id}
                                  className="p-2.5 bg-card border rounded hover:border-primary/50 transition-colors"
                                >
                                  <p className="text-sm font-medium mb-1">
                                    {permission.display_name}
                                  </p>
                                  {permission.description && (
                                    <p className="text-xs text-muted-foreground">
                                      {permission.description}
                                    </p>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        ),
                      )}
                    </>
                  );
                })()}
              </div>
            </div>
          )}
        </div>
      ) : null}
    </BaseModal>
  );
}
