import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { BaseModal } from "@/components/modals";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { Role, Permission, useRoleStore } from "@/stores/roleStore";
import roleService from "@/services/roleService";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import usePermissions from "@/hooks/use-permissions";
import authPermissions from "@/lib/permissions";

interface RoleFormData {
  name: string;
  display_name: string;
  description: string;
  isActive: boolean;
  permission_ids: number[];
}

interface FormModalProps {
  open: boolean;
  onClose: () => void;
  editData?: Role;
  onSuccess?: () => void;
}

export default function FormModal({
  open,
  onClose,
  editData,
  onSuccess,
}: FormModalProps) {
  const { t } = useTranslation();
  const { permissions, totalPermissions } = useRoleStore();
  const { hasPermission } = usePermissions();

  console.log("Total Permissions from Store:", permissions, totalPermissions);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [formData, setFormData] = useState<RoleFormData>({
    name: "",
    display_name: "",
    description: "",
    isActive: true,
    permission_ids: [],
  });

  // Fetch permissions on mount
  useEffect(() => {
    const fetchPermissions = async () => {
      try {
        await roleService.getAllPermissions();
      } catch (error) {
        console.error("Error fetching permissions:", error);
        toast.error(t("roles.messages.failedToLoadPermissions"));
      }
    };

    if (
      open &&
      permissions.length === 0 &&
      hasPermission(authPermissions.roles.assignPermissions)
    ) {
      fetchPermissions();
    }
  }, [open, permissions.length]);

  const handleSubmit = async () => {
    // Validate required fields
    if (!formData.name || !formData.display_name) {
      toast.error(t("roles.messages.fillRequiredFields"));
      return;
    }

    setIsSubmitting(true);
    try {
      const submitData = {
        name: formData.name,
        display_name: formData.display_name,
        description: formData.description,
        isActive: formData.isActive,
        permission_ids: formData.permission_ids,
      };

      if (isEditing && editData) {
        await roleService.updateItem(editData.id, submitData);
        toast.success(t("roles.messages.roleUpdated"));
      } else {
        await roleService.storeItem(submitData);
        toast.success(t("roles.messages.roleCreated"));
      }

      onSuccess?.();
      onClose();
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error(
        isEditing
          ? t("roles.messages.failedToUpdate")
          : t("roles.messages.failedToCreate")
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (editData) {
      setIsEditing(true);
      setFormData({
        name: editData.name,
        display_name: editData.display_name,
        description: editData.description,
        isActive: editData.isActive,
        permission_ids: editData.permissions.map((p) => p.id),
      });
    } else {
      setIsEditing(false);
      setFormData({
        name: "",
        display_name: "",
        description: "",
        isActive: true,
        permission_ids: [],
      });
    }
  }, [editData, open]);

  const handlePermissionToggle = (permissionId: number) => {
    setFormData((prev) => ({
      ...prev,
      permission_ids: prev.permission_ids.includes(permissionId)
        ? prev.permission_ids.filter((id) => id !== permissionId)
        : [...prev.permission_ids, permissionId],
    }));
  };

  const handleSelectAll = () => {
    const allPermissionIds = permissions.flatMap((module) =>
      module.permissions.map((p) => p.id)
    );
    if (formData.permission_ids.length === allPermissionIds.length) {
      setFormData((prev) => ({ ...prev, permission_ids: [] }));
    } else {
      setFormData((prev) => ({
        ...prev,
        permission_ids: allPermissionIds,
      }));
    }
  };

  const handleModuleToggle = (modulePermissions: Permission[]) => {
    const modulePermissionIds = modulePermissions.map((p) => p.id);
    const allSelected = modulePermissionIds.every((id) =>
      formData.permission_ids.includes(id)
    );

    if (allSelected) {
      // Deselect all permissions in this module
      setFormData((prev) => ({
        ...prev,
        permission_ids: prev.permission_ids.filter(
          (id) => !modulePermissionIds.includes(id)
        ),
      }));
    } else {
      // Select all permissions in this module
      setFormData((prev) => ({
        ...prev,
        permission_ids: [
          ...prev.permission_ids,
          ...modulePermissionIds.filter(
            (id) => !prev.permission_ids.includes(id)
          ),
        ],
      }));
    }
  };

  const getTotalPermissions = () => {
    return permissions.reduce(
      (total, module) => total + module.permissions.length,
      0
    );
  };

  // Filter permissions based on search query
  const filteredPermissions = permissions.filter((module) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();

    // Check if module name matches
    if (module.module.toLowerCase().includes(query)) return true;

    // Check if any permission in the module matches
    return module.permissions.some(
      (permission) =>
        permission.display_name.toLowerCase().includes(query) ||
        permission.description?.toLowerCase().includes(query)
    );
  });

  return (
    <BaseModal
      open={open}
      onOpenChange={onClose}
      title={
        isEditing ? t("roles.form.editRole") : t("roles.form.createNewRole")
      }
      onSubmit={handleSubmit}
      isSubmitting={isSubmitting}
      submitButtonText={
        isEditing ? t("roles.form.updateRole") : t("roles.form.createRole")
      }
      size="2xl"
    >
      <div className="grid gap-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="name">
              {t("roles.form.roleName")} <span className="text-red-500">*</span>
            </Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder={t("roles.form.roleNamePlaceholder")}
              disabled={isEditing}
            />
            <p className="text-xs text-muted-foreground">
              {t("roles.form.roleNameHint")}
            </p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="display_name">
              {t("roles.form.displayName")}{" "}
              <span className="text-red-500">*</span>
            </Label>
            <Input
              id="display_name"
              value={formData.display_name}
              onChange={(e) =>
                setFormData({ ...formData, display_name: e.target.value })
              }
              placeholder={t("roles.form.displayNamePlaceholder")}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">{t("roles.form.description")}</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            placeholder={t("roles.form.descriptionPlaceholder")}
            rows={3}
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label>{t("roles.form.status")}</Label>
            <div className="flex items-center gap-2">
              <Switch
                checked={formData.isActive}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, isActive: checked })
                }
              />
              <Badge variant={formData.isActive ? "default" : "secondary"}>
                {formData.isActive
                  ? t("roles.status.active")
                  : t("roles.status.inactive")}
              </Badge>
            </div>
          </div>
        </div>

        {hasPermission(authPermissions.roles.assignPermissions) && (
          <div className="space-y-3 border-t pt-4">
            <div className="flex items-center justify-between">
              <Label className="text-base">
                {t("roles.form.permissions")}{" "}
                <span className="text-sm text-muted-foreground">
                  ({formData.permission_ids.length} / {getTotalPermissions()}{" "}
                  {t("roles.form.selected")})
                </span>
              </Label>
              <button
                type="button"
                onClick={handleSelectAll}
                className="text-sm text-primary hover:underline"
              >
                {formData.permission_ids.length === getTotalPermissions()
                  ? t("roles.form.deselectAll")
                  : t("roles.form.selectAll")}
              </button>
            </div>

            {/* Search Input */}
            <div className="relative">
              <Input
                type="text"
                placeholder={
                  t("roles.form.searchPermissions") ||
                  "Search permissions or modules..."
                }
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  ✕
                </button>
              )}
            </div>

            <div className="max-h-[400px] overflow-y-auto border rounded-lg">
              {filteredPermissions.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-8">
                  {searchQuery
                    ? t("roles.form.noMatchingPermissions") ||
                    "No matching permissions found"
                    : t("roles.form.noPermissionsAvailable")}
                </p>
              )}
              <Accordion type="multiple" className="w-full">
                {filteredPermissions.map((module) => {
                  const modulePermissionIds = module.permissions.map(
                    (p) => p.id
                  );
                  const selectedCount = modulePermissionIds.filter((id) =>
                    formData.permission_ids.includes(id)
                  ).length;
                  const allSelected =
                    selectedCount === module.permissions.length;

                  return (
                    <AccordionItem key={module.module} value={module.module}>
                      <div className="flex items-center border-b">
                        <div className="flex items-center gap-2 px-4 py-3">
                          <Checkbox
                            checked={allSelected}
                            onCheckedChange={() =>
                              handleModuleToggle(module.permissions)
                            }
                          />
                        </div>
                        <AccordionTrigger className="flex-1 px-0 py-3 hover:bg-muted/50 hover:no-underline">
                          <div className="flex items-center justify-between w-full pr-4">
                            <span className=" capitalize">
                              {module.module}
                            </span>
                            <Badge variant="outline" className="text-xs">
                              {selectedCount} / {module.permissions.length}
                            </Badge>
                          </div>
                        </AccordionTrigger>
                      </div>
                      <AccordionContent className="px-4 pb-4">
                        <div className="space-y-2 pt-2">
                          {module.permissions.map((permission) => (
                            <div
                              key={permission.id}
                              className="flex items-start space-x-3 p-2 rounded hover:bg-muted/50"
                            >
                              <Checkbox
                                id={`permission-${permission.id}`}
                                checked={formData.permission_ids.includes(
                                  permission.id
                                )}
                                onCheckedChange={() =>
                                  handlePermissionToggle(permission.id)
                                }
                              />
                              <div className="flex-1">
                                <Label
                                  htmlFor={`permission-${permission.id}`}
                                  className=" cursor-pointer text-sm"
                                >
                                  {permission.display_name}
                                </Label>
                                {permission.description && (
                                  <p className="text-xs text-muted-foreground mt-0.5">
                                    {permission.description}
                                  </p>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  );
                })}
              </Accordion>
            </div>
          </div>
        )}
      </div>
    </BaseModal>
  );
}
