# Permission Implementation Examples

This file shows how to implement permission checks in different page components.

## Example 1: Orders Page (Complete Implementation)

```tsx
// src/pages/orders/Orders.tsx
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Eye, Edit, Trash2, Plus, Clock } from "lucide-react";
import { BaseTableList, ActionItem } from "@/components/table";
import { usePermissionCheck } from "@/lib/withPermission";
import usePermissions from "@/hooks/use-permissions";
import permissions from "@/lib/permissions";
import { Order, useOrderStore } from "@/stores/orderStore";
import orderService from "@/services/orderService";
import FormModal from "./modal/FormModal";
import ViewModal from "./modal/ViewModal";

export default function Orders() {
  const { t } = useTranslation();
  const { hasPermission } = usePermissions();

  // CHECK 1: Page-level permission (shows NoPermission if user lacks access)
  const permissionCheck = usePermissionCheck(permissions.orders.view);
  if (permissionCheck) return permissionCheck;

  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showFormModal, setShowFormModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);

  // Handler with permission check
  const handleCreate = () => {
    if (!hasPermission(permissions.orders.create)) {
      toast.error("You don't have permission to create orders");
      return;
    }
    setShowFormModal(true);
  };

  // Define actions with permissions
  const orderActions = (order: Order): ActionItem<Order>[] => [
    {
      label: "View Details",
      icon: Eye,
      onClick: (order) => {
        setSelectedOrder(order);
        setShowViewModal(true);
      },
    },
    {
      label: "Edit Order",
      icon: Edit,
      onClick: handleEdit,
      show: hasPermission(permissions.orders.edit),
    },
    {
      label: "Update Status",
      icon: Clock,
      onClick: handleUpdateStatus,
      show: hasPermission(permissions.orders.updateStatus),
    },
    {
      label: "Delete Order",
      icon: Trash2,
      onClick: handleDelete,
      variant: "destructive",
      separator: true,
      show: hasPermission(permissions.orders.delete),
    },
  ];

  return (
    <>
      <BaseTableList<Order>
        title={t("orders.title")}
        headerActions={
          hasPermission(permissions.orders.create)
            ? [
                {
                  label: t("orders.addOrder"),
                  icon: Plus,
                  onClick: handleCreate,
                },
              ]
            : []
        }
        columns={columns}
        service={orderService}
        store={useOrderStore()}
      />

      {/* Only render modals if user has permissions */}
      {hasPermission(permissions.orders.create) && (
        <FormModal
          open={showFormModal}
          onClose={() => setShowFormModal(false)}
        />
      )}

      <ViewModal
        open={showViewModal}
        onClose={() => setShowViewModal(false)}
        order={selectedOrder}
      />
    </>
  );
}
```

## Example 2: Users Page

```tsx
// src/pages/users/Users.tsx
import { useState } from "react";
import { usePermissionCheck } from "@/lib/withPermission";
import permissions from "@/lib/permissions";

export default function Users() {
  // CHECK: Page-level permission
  const permissionCheck = usePermissionCheck(permissions.users.view);
  if (permissionCheck) return permissionCheck;

  // Rest of component...
  return <div>Users Page</div>;
}
```

## Example 3: Products Page

```tsx
// src/pages/products/Products.tsx
import { usePermissionCheck } from "@/lib/withPermission";
import permissions from "@/lib/permissions";

export default function Products() {
  // CHECK: Page-level permission
  const permissionCheck = usePermissionCheck(permissions.products.view);
  if (permissionCheck) return permissionCheck;

  // Rest of component...
  return <div>Products Page</div>;
}
```

## Example 4: Dashboard (No Restrictions)

```tsx
// src/pages/Dashboard.tsx
// Dashboard might not need permission checks if all users should see it
export default function Dashboard() {
  return <div>Dashboard - Accessible to all users</div>;
}

// OR if you want to restrict it:
import { usePermissionCheck } from "@/lib/withPermission";
import permissions from "@/lib/permissions";

export default function Dashboard() {
  const permissionCheck = usePermissionCheck(permissions.dashboard.view);
  if (permissionCheck) return permissionCheck;

  return <div>Dashboard</div>;
}
```

## Example 5: Settings Page with Section-Level Permissions

```tsx
// src/pages/Settings.tsx
import { usePermissionCheck } from "@/lib/withPermission";
import usePermissions from "@/hooks/use-permissions";
import permissions from "@/lib/permissions";

export default function Settings() {
  const { hasPermission } = usePermissions();

  // CHECK: Page-level permission
  const permissionCheck = usePermissionCheck(permissions.settings.view);
  if (permissionCheck) return permissionCheck;

  return (
    <div>
      <h1>Settings</h1>

      {/* General settings - always visible */}
      <section>
        <h2>General Settings</h2>
        {/* ... */}
      </section>

      {/* Admin-only settings */}
      {hasPermission(permissions.settings.update) && (
        <section>
          <h2>Advanced Settings</h2>
          {/* ... */}
        </section>
      )}

      {/* Super admin only */}
      {hasPermission(permissions.settings.delete) && (
        <section>
          <h2>Danger Zone</h2>
          {/* ... */}
        </section>
      )}
    </div>
  );
}
```

## Example 6: Custom Permission Component

```tsx
// src/components/PermissionGate.tsx
import usePermissions from "@/hooks/use-permissions";

interface PermissionGateProps {
  permission: string;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function PermissionGate({
  permission,
  children,
  fallback = null,
}: PermissionGateProps) {
  const { hasPermission } = usePermissions();

  if (!hasPermission(permission)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}

// Usage:
import { PermissionGate } from "@/components/PermissionGate";
import permissions from "@/lib/permissions";

<PermissionGate permission={permissions.orders.create}>
  <Button onClick={handleCreate}>Create Order</Button>
</PermissionGate>

// With fallback:
<PermissionGate
  permission={permissions.orders.create}
  fallback={<Button disabled>Create Order (No Permission)</Button>}
>
  <Button onClick={handleCreate}>Create Order</Button>
</PermissionGate>
```

## Quick Reference

### 1. Add to Every Protected Page:

```tsx
import { usePermissionCheck } from "@/lib/withPermission";
import permissions from "@/lib/permissions";

export default function YourPage() {
  const permissionCheck = usePermissionCheck(permissions.yourModule.view);
  if (permissionCheck) return permissionCheck;

  // Your code...
}
```

### 2. For Action Buttons:

```tsx
import usePermissions from "@/hooks/use-permissions";
import permissions from "@/lib/permissions";

const { hasPermission } = usePermissions();

{
  hasPermission(permissions.yourModule.action) && (
    <Button onClick={handleAction}>Action</Button>
  );
}
```

### 3. For Dropdown Actions:

```tsx
const actions = [
  {
    label: "Edit",
    icon: Edit,
    onClick: handleEdit,
    show: hasPermission(permissions.yourModule.edit),
  },
];
```

## Files to Update

To implement permissions across your app, update these files:

1. ✅ `src/hooks/use-permissions.ts` - Already updated with super_admin check
2. ✅ `src/lib/permissions.ts` - Already has all module permissions
3. ✅ `src/lib/withPermission.tsx` - Helper functions created
4. ✅ `src/components/NoPermission.tsx` - Error component created
5. ✅ `src/components/layout/Sidebar.tsx` - Already using permissions
6. ✅ `src/pages/orders/Orders.tsx` - Example implementation done
7. ⏳ `src/pages/users/Users.tsx` - Add permission check
8. ⏳ `src/pages/products/Products.tsx` - Add permission check
9. ⏳ Other page files - Add permission checks as needed

## Testing Checklist

- [ ] Super admin can access all pages
- [ ] Regular users with no permissions see NoPermission component
- [ ] Users with specific permissions see only allowed features
- [ ] Sidebar only shows items user has access to
- [ ] Action buttons are hidden for unauthorized actions
- [ ] Dropdown actions respect permissions
- [ ] Direct URL navigation redirects if no permission
- [ ] Toast messages shown for unauthorized actions
