import constData from "@/lib/constData";
import { useAuthStore } from "@/stores/authStore";

const usePermissions = () => {
  const user = useAuthStore((state) => state.user);
  const permissions = useAuthStore((state) => state.permissions);

  const hasPermission = (permission: string): boolean => {
    // Super admin has all permissions
    if (user?.role?.name === constData.roles.SUPER_ADMIN) {
      return true;
    }

    return permissions?.includes(permission) || false;
  };

  return { hasPermission };
};
export default usePermissions;
