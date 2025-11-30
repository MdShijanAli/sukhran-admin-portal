import { ComponentType } from "react";
import usePermissions from "@/hooks/use-permissions";
import NoPermission from "@/components/NoPermission";

interface WithPermissionProps {
  permission: string;
  fallback?: ComponentType;
}

/**
 * Higher-Order Component that checks if user has required permission
 * If not, shows NoPermission component instead
 *
 * @example
 * ```tsx
 * export default withPermission(Orders, permissions.orders.view);
 * ```
 */
export function withPermission<P extends object>(
  Component: ComponentType<P>,
  permission: string,
  fallback?: ComponentType
): ComponentType<P> {
  return function PermissionWrapper(props: P) {
    const { hasPermission } = usePermissions();

    if (!hasPermission(permission)) {
      const FallbackComponent = fallback || NoPermission;
      return <FallbackComponent />;
    }

    return <Component {...props} />;
  };
}

/**
 * Hook to check permission and get NoPermission component if needed
 * Use this in component body for more flexibility
 *
 * @example
 * ```tsx
 * export default function Orders() {
 *   const permissionCheck = usePermissionCheck(permissions.orders.view);
 *   if (permissionCheck) return permissionCheck;
 *
 *   // Rest of component...
 * }
 * ```
 */
export function usePermissionCheck(permission: string) {
  const { hasPermission } = usePermissions();

  if (!hasPermission(permission)) {
    return <NoPermission />;
  }

  return null;
}
