import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { BaseModal } from "@/components/modals";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { Role, Permission, PermissionModule } from "@/stores/roleStore";
import roleService from "@/services/roleService";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [permissionModules, setPermissionModules] = useState<
    PermissionModule[]
  >([]);
  const [isLoadingPermissions, setIsLoadingPermissions] = useState(false);
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
      setIsLoadingPermissions(true);
      try {
        const response = await roleService.getAllPermissions();
        const permissionsData =
          (response as { data?: PermissionModule[] })?.data || [];
        setPermissionModules(permissionsData);
      } catch (error) {
        console.error("Error fetching permissions:", error);
        toast.error(t("roles.messages.failedToLoadPermissions"));
      } finally {
        setIsLoadingPermissions(false);
      }
    };

    if (open) {
      fetchPermissions();
    }
  }, [open]);

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
    const allPermissionIds = permissionModules.flatMap((module) =>
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
    return permissionModules.reduce(
      (total, module) => total + module.permissions.length,
      0
    );
  };

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
      loading={isLoadingPermissions}
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

          <div className="max-h-[400px] overflow-y-auto border rounded-lg">
            {permissionModules.length === 0 && !isLoadingPermissions && (
              <p className="text-sm text-muted-foreground text-center py-8">
                {t("roles.form.noPermissionsAvailable")}
              </p>
            )}
            <Accordion type="multiple" className="w-full">
              {permissionModules.map((module) => {
                const modulePermissionIds = module.permissions.map((p) => p.id);
                const selectedCount = modulePermissionIds.filter((id) =>
                  formData.permission_ids.includes(id)
                ).length;
                const allSelected = selectedCount === module.permissions.length;

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
                          <span className="font-medium capitalize">
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
                                className="font-medium cursor-pointer text-sm"
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
      </div>
    </BaseModal>
  );
}
