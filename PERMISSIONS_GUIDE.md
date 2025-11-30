# Permissions System Guide

## Overview

This guide explains how to implement and use the permission-based access control system in the Sukhran Admin Portal. The system allows you to control access to modules, pages, and specific actions based on user permissions.

## Table of Contents

1. [Architecture](#architecture)
2. [Setup](#setup)
3. [Quick Start](#quick-start)
4. [Usage Examples](#usage-examples)
5. [Implementation Patterns](#implementation-patterns)
6. [Complete Examples](#complete-examples)
7. [Best Practices](#best-practices)
8. [Testing Checklist](#testing-checklist)

---

## Architecture

### Components

1. **Permission Definitions** (`src/lib/permissions.ts`)

   - Central location for all permission strings
   - Organized by module
   - Easy to maintain and update

2. **Auth Store** (`src/stores/authStore.ts`)

   - Stores user permissions from API
   - Automatically extracts permissions from user object
   - Persists in localStorage

3. **usePermissions Hook** (`src/hooks/use-permissions.ts`)
   - Provides `hasPermission()` function
   - Returns boolean for permission checks
   - Automatically grants all permissions to super_admin role
   - Easy to use in any component

### Data Flow

```
API Response → Auth Store → usePermissions Hook → Component
                                    ↓
                            (super_admin check)
```

---

## Setup

### 1. Permission Definitions

All permissions are defined in `src/lib/permissions.ts`:

```typescript
const permissions = {
  orders: {
    view: "orders.view",
    create: "orders.create",
    edit: "orders.update",
    delete: "orders.delete",
    updateStatus: "orders.update_status",
    updateDeliveryTime: "orders.update_delivery_time",
  },
  // ... other modules
};
```

### 2. Auth Store Configuration

The auth store automatically extracts permissions:

```typescript
export const useAuthStore = createStore<AuthState>(
  (set) => ({
    user: null,
    permissions: [],
    isAuthenticated: false,
    setState: (state: Partial<AuthState>) => {
      set({
        ...state,
        permissions: state.user?.permissions ?? [],
      });
    },
  }),
  "auth-storage",
  true
);
```

### 3. API Response Structure

Your API should return user permissions in this format:

```json
{
  "user": {
    "id": "1",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "role": {
      "name": "admin",
      "display_name": "Administrator"
    },
    "permissions": [
      "orders.view",
      "orders.create",
      "orders.update",
      "orders.delete",
      "orders.update_status",
      "users.view",
      "products.view"
    ]
  }
}
```

**Note:** Users with `role.name === "super_admin"` automatically have access to all features without needing explicit permissions in the array. The permissions array can be empty or omitted for super_admin users.

---

## Quick Start

### Add Permission Check to Any Page (2 Lines!)

```typescript
import { usePermissionCheck } from "@/lib/withPermission";
import permissions from "@/lib/permissions";

export default function YourPage() {
  // Add these 2 lines at the start
  const permissionCheck = usePermissionCheck(permissions.yourModule.view);
  if (permissionCheck) return permissionCheck;

  // Your normal component code continues...
  return <div>Your Page Content</div>;
}
```

That's it! The NoPermission component will automatically show if the user doesn't have access.

---

## Usage Examples

### 1. Page-Level Permission Check (Recommended)

**Using `usePermissionCheck` Hook:**

```typescript
import { usePermissionCheck } from "@/lib/withPermission";
import permissions from "@/lib/permissions";

export default function Orders() {
  const { t } = useTranslation();

  // Check permission at the start of component
  const permissionCheck = usePermissionCheck(permissions.orders.view);
  if (permissionCheck) return permissionCheck;

  // Rest of your component code...
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  return <div>{/* Your page content */}</div>;
}
```

**Using HOC `withPermission`:**

```typescript
import { withPermission } from "@/lib/withPermission";
import permissions from "@/lib/permissions";

function Orders() {
  // Your component code...
  return <div>Orders Page</div>;
}

// Wrap component with permission check
export default withPermission(Orders, permissions.orders.view);
```

### 2. Sidebar Navigation (Module-Level)

**File:** `src/components/layout/Sidebar.tsx`

```typescript
import usePermissions from "@/hooks/use-permissions";
import permissions from "@/lib/permissions";

export default function Sidebar() {
  const { hasPermission } = usePermissions();

  const menuItems = [
    {
      icon: ShoppingCart,
      label: "nav.orders",
      path: "/orders",
      permission: permissions.orders.view,
    },
    // ... other items
  ];

  return (
    <nav>
      <ul>
        {menuItems
          .filter((item) => hasPermission(item.permission))
          .map((item) => (
            <NavLink to={item.path}>{item.label}</NavLink>
          ))}
      </ul>
    </nav>
  );
}
```

### 3. Action Buttons (Component-Level)

**File:** `src/pages/orders/Orders.tsx`

```typescript
import { Plus, Edit, Trash2 } from "lucide-react";
import usePermissions from "@/hooks/use-permissions";
import permissions from "@/lib/permissions";

export default function Orders() {
  const { hasPermission } = usePermissions();

  return (
    <BaseTableList
      title="Orders"
      headerActions={
        hasPermission(permissions.orders.create)
          ? [
              {
                label: "Create Order",
                icon: Plus,
                onClick: handleCreate,
                variant: "default",
              },
            ]
          : []
      }
      // ... rest of props
    />
  );
}
```

### 4. Dropdown Actions (Row-Level)

**File:** `src/pages/orders/Orders.tsx`

```typescript
import usePermissions from "@/hooks/use-permissions";
import permissions from "@/lib/permissions";

export default function Orders() {
  const { hasPermission } = usePermissions();

  const orderActions = (order: Order): ActionItem<Order>[] => [
    {
      label: "View Details",
      icon: Eye,
      onClick: handleViewDetails,
      // Always show view if user has view permission
    },
    {
      label: "Edit Order",
      icon: Edit,
      onClick: handleEdit,
      show:
        hasPermission(permissions.orders.edit) && order.status === "pending",
    },
    {
      label: "Update Status",
      icon: Edit,
      onClick: handleUpdateStatus,
      show: hasPermission(permissions.orders.updateStatus),
    },
    {
      label: "Update Delivery Time",
      icon: Clock,
      onClick: handleUpdateDeliveryTime,
      show: hasPermission(permissions.orders.updateDeliveryTime),
    },
    {
      label: "Delete Order",
      icon: Trash2,
      onClick: handleDelete,
      variant: "destructive",
      separator: true,
      show:
        hasPermission(permissions.orders.delete) && order.status === "pending",
    },
  ];

  return (
    <BaseTableList
      columns={[
        // ... other columns
        {
          key: "actions",
          label: "Actions",
          render: (order) => (
            <DropdownMenuActions item={order} actions={orderActions(order)} />
          ),
        },
      ]}
    />
  );
}
```

### 4. Conditional Rendering (Feature-Level)

```typescript
import usePermissions from "@/hooks/use-permissions";
import permissions from "@/lib/permissions";

export default function OrderDetails() {
  const { hasPermission } = usePermissions();

  return (
    <div>
      <h1>Order Details</h1>

      {/* Only show status update section if user has permission */}
      {hasPermission(permissions.orders.updateStatus) && (
        <section>
          <h2>Update Status</h2>
          <StatusUpdateForm />
        </section>
      )}

      {/* Only show delete button if user has permission */}
      {hasPermission(permissions.orders.delete) && (
        <Button variant="destructive" onClick={handleDelete}>
          Delete Order
        </Button>
      )}
    </div>
  );
}
```

### 5. NoPermission Component

When a user tries to access a page without permission, show a professional error page:

**Using `usePermissionCheck` (Recommended):**

```typescript
import { usePermissionCheck } from "@/lib/withPermission";
import permissions from "@/lib/permissions";

export default function Orders() {
  // This will return NoPermission component if user lacks permission
  const permissionCheck = usePermissionCheck(permissions.orders.view);
  if (permissionCheck) return permissionCheck;

  // Your normal component code continues...
  return <div>Orders Page</div>;
}
```

**Using `NoPermission` directly:**

```typescript
import NoPermission from "@/components/NoPermission";
import usePermissions from "@/hooks/use-permissions";
import permissions from "@/lib/permissions";

export default function Orders() {
  const { hasPermission } = usePermissions();

  if (!hasPermission(permissions.orders.view)) {
    return <NoPermission />;
  }

  return <div>Orders Page</div>;
}
```

**Custom NoPermission messages:**

```typescript
import NoPermission from "@/components/NoPermission";

return (
  <NoPermission
    title="Orders Access Required"
    message="You need special permission to view orders. Contact your manager to request access."
    showBackButton={true}
    showHomeButton={true}
  />
);
```

    </div>

);
}

````

### 6. Form Modal Actions

**File:** `src/pages/orders/Orders.tsx`

```typescript
import usePermissions from "@/hooks/use-permissions";
import permissions from "@/lib/permissions";

export default function Orders() {
  const { hasPermission } = usePermissions();
  const [showFormModal, setShowFormModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);

  const handleCreate = () => {
    if (!hasPermission(permissions.orders.create)) {
      toast.error("You don't have permission to create orders");
      return;
    }
    setShowFormModal(true);
  };

  const handleUpdateStatus = (order: Order) => {
    if (!hasPermission(permissions.orders.updateStatus)) {
      toast.error("You don't have permission to update order status");
      return;
    }
    setSelectedOrder(order);
    setShowStatusModal(true);
  };

  return (
    <>
      <BaseTableList {...props} />

      {/* Modal will only be rendered if permission exists */}
      {hasPermission(permissions.orders.create) && (
        <FormModal
          open={showFormModal}
          onClose={() => setShowFormModal(false)}
        />
      )}

      {hasPermission(permissions.orders.updateStatus) && (
        <UpdateOrderStatusModal
          open={showStatusModal}
          onClose={() => setShowStatusModal(false)}
        />
      )}
    </>
  );
}
````

---

## Implementation Patterns

### Pattern 1: Hide UI Elements (Recommended)

Best for: Buttons, menu items, form sections

```typescript
{
  hasPermission(permissions.orders.create) && (
    <Button onClick={handleCreate}>Create Order</Button>
  );
}
```

**Pros:**

- Clean UI - users don't see disabled options
- Better UX - no confusion about unavailable features
- Cleaner code

### Pattern 2: Disable UI Elements

Best for: Complex forms with partial access

```typescript
<Button
  onClick={handleCreate}
  disabled={!hasPermission(permissions.orders.create)}
>
  Create Order
</Button>
```

**Pros:**

- Users can see all features
- Useful for showing "locked" features

**Cons:**

- Can clutter UI
- May confuse users

### Pattern 3: Filter Arrays (Recommended for Lists)

Best for: Navigation menus, action lists

```typescript
const menuItems = [
  { label: "Orders", path: "/orders", permission: permissions.orders.view },
  { label: "Users", path: "/users", permission: permissions.users.view },
];

const visibleItems = menuItems.filter((item) => hasPermission(item.permission));
```

### Pattern 4: Combined Permission Checks

Best for: Complex business logic

```typescript
const canEditOrder = (order: Order) => {
  return (
    hasPermission(permissions.orders.edit) &&
    order.status === "pending" &&
    !order.isLocked
  );
};

// Usage
{
  canEditOrder(order) && (
    <Button onClick={() => handleEdit(order)}>Edit</Button>
  );
}
```

---

## Complete Examples

### Example 1: Orders Page (Full Implementation)

```typescript
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
import { toast } from "sonner";

export default function Orders() {
  const { t } = useTranslation();
  const { hasPermission } = usePermissions();

  // Page-level permission check
  const permissionCheck = usePermissionCheck(permissions.orders.view);
  if (permissionCheck) return permissionCheck;

  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showFormModal, setShowFormModal] = useState(false);

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
      show: hasPermission(permissions.orders.delete),
    },
  ];

  return (
    <BaseTableList<Order>
      title={t("orders.title")}
      headerActions={
        hasPermission(permissions.orders.create)
          ? [{ label: t("orders.addOrder"), icon: Plus, onClick: handleCreate }]
          : []
      }
      columns={columns}
      service={orderService}
      store={useOrderStore()}
    />
  );
}
```

### Example 2: Settings Page with Section Permissions

```typescript
// src/pages/Settings.tsx
import { usePermissionCheck } from "@/lib/withPermission";
import usePermissions from "@/hooks/use-permissions";
import permissions from "@/lib/permissions";

export default function Settings() {
  const { hasPermission } = usePermissions();

  // Page-level permission check
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

### Example 3: Custom Permission Gate Component

```typescript
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
</PermissionGate>;

// With fallback:
<PermissionGate
  permission={permissions.orders.create}
  fallback={<Button disabled>Create Order (No Permission)</Button>}
>
  <Button onClick={handleCreate}>Create Order</Button>
</PermissionGate>;
```

---

## Best Practices

### 1. Always Check Permissions in Handler Functions

Even if UI is hidden, always check permissions in handlers:

```typescript
const handleDelete = async (order: Order) => {
  // Double-check permission
  if (!hasPermission(permissions.orders.delete)) {
    toast.error("You don't have permission to delete orders");
    return;
  }

  // Proceed with deletion
  await orderService.deleteItem(order.id);
};
```

### 2. Use Descriptive Permission Names

```typescript
// ❌ Bad
permissions.orders.action1;

// ✅ Good
permissions.orders.updateStatus;
```

### 3. Group Related Permissions

```typescript
// ✅ Good organization
permissions.orders = {
  view: "orders.view",
  create: "orders.create",
  edit: "orders.update",
  delete: "orders.delete",
  updateStatus: "orders.update_status",
  updateDeliveryTime: "orders.update_delivery_time",
};
```

### 4. Provide User Feedback

```typescript
const handleAction = () => {
  if (!hasPermission(permissions.orders.edit)) {
    toast.error("You don't have permission to edit orders");
    return;
  }
  // Proceed...
};
```

### 5. Document Permission Requirements

Add comments in your code:

```typescript
/**
 * Orders Management Component
 *
 * Required Permissions:
 * - orders.view: View order list
 * - orders.create: Create new orders
 * - orders.update: Edit existing orders
 * - orders.delete: Delete orders
 * - orders.update_status: Update order status
 */
export default function Orders() {
  // ...
}
```

### 6. Handle Missing Permissions Gracefully

```typescript
// Show helpful message if no permissions
if (!hasPermission(permissions.orders.view)) {
  return (
    <div className="p-8 text-center">
      <h2>Access Denied</h2>
      <p>You don't have permission to view orders.</p>
      <p>Please contact your administrator.</p>
    </div>
  );
}
```

### 7. Test with Different Permission Sets

Create test users with different permission combinations:

- **Admin**: All permissions
- **Manager**: View + Edit permissions
- **Operator**: View only permissions
- **Custom**: Specific permission sets

---

## Complete Example: Orders Module

Here's a complete implementation example:

```typescript
import { useState, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { Eye, Edit, Trash2, Plus, Clock } from "lucide-react";
import {
  BaseTableList,
  Column,
  ActionItem,
  DropdownMenuActions,
} from "@/components/table";
import usePermissions from "@/hooks/use-permissions";
import permissions from "@/lib/permissions";
import { Order, useOrderStore } from "@/stores/orderStore";
import orderService from "@/services/orderService";
import { toast } from "sonner";
import { DeleteModal } from "@/components/modals";
import FormModal from "./modal/FormModal";
import ViewModal from "./modal/ViewModal";
import UpdateOrderStatusModal from "./modal/UpdateOrderStatusModal";
import UpdateDeliveryTimeModal from "./modal/UpdateDeliveryTimeModal";

export default function Orders() {
  const { t } = useTranslation();
  const { hasPermission } = usePermissions();
  const store = useOrderStore();

  // Check if user has view permission
  if (!hasPermission(permissions.orders.view)) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-xl font-semibold mb-2">Access Denied</h2>
        <p className="text-muted-foreground">
          You don't have permission to view orders.
        </p>
      </div>
    );
  }

  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [dialogMode, setDialogMode] = useState<"create" | "edit" | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [showUpdateStatusModal, setShowUpdateStatusModal] = useState(false);
  const [showUpdateDeliveryTimeModal, setShowUpdateDeliveryTimeModal] =
    useState(false);
  const [refreshTable, setRefreshTable] = useState<(() => void) | null>(null);

  // Handler with permission check
  const handleCreate = () => {
    if (!hasPermission(permissions.orders.create)) {
      toast.error("You don't have permission to create orders");
      return;
    }
    setSelectedOrder(null);
    setDialogMode("create");
  };

  const handleEdit = (order: Order) => {
    if (!hasPermission(permissions.orders.edit)) {
      toast.error("You don't have permission to edit orders");
      return;
    }
    setSelectedOrder(order);
    setDialogMode("edit");
  };

  const handleDelete = (order: Order) => {
    if (!hasPermission(permissions.orders.delete)) {
      toast.error("You don't have permission to delete orders");
      return;
    }
    setSelectedOrder(order);
    setShowDelete(true);
  };

  const handleUpdateStatus = (order: Order) => {
    if (!hasPermission(permissions.orders.updateStatus)) {
      toast.error("You don't have permission to update order status");
      return;
    }
    setSelectedOrder(order);
    setShowUpdateStatusModal(true);
  };

  const handleUpdateDeliveryTime = (order: Order) => {
    if (!hasPermission(permissions.orders.updateDeliveryTime)) {
      toast.error("You don't have permission to update delivery time");
      return;
    }
    setSelectedOrder(order);
    setShowUpdateDeliveryTimeModal(true);
  };

  // Define actions with permissions
  const orderActions = (order: Order): ActionItem<Order>[] => [
    {
      label: t("orders.actions.viewDetails"),
      icon: Eye,
      onClick: (order) => {
        setSelectedOrder(order);
        setShowDetails(true);
      },
    },
    {
      label: t("orders.actions.editOrder"),
      icon: Edit,
      onClick: handleEdit,
      show:
        hasPermission(permissions.orders.edit) &&
        order.status !== "delivered" &&
        order.status !== "cancelled",
    },
    {
      label: t("orders.actions.updateStatus"),
      icon: Edit,
      onClick: handleUpdateStatus,
      show: hasPermission(permissions.orders.updateStatus),
    },
    {
      label: t("orders.actions.updateDeliveryTime"),
      icon: Clock,
      onClick: handleUpdateDeliveryTime,
      show:
        hasPermission(permissions.orders.updateDeliveryTime) &&
        order.status !== "delivered" &&
        order.status !== "cancelled",
    },
    {
      label: t("orders.actions.deleteOrder"),
      icon: Trash2,
      onClick: handleDelete,
      variant: "destructive",
      separator: true,
      show:
        hasPermission(permissions.orders.delete) &&
        (order.status === "pending" || order.status === "cancelled"),
    },
  ];

  return (
    <div className="animate-fade-in">
      <BaseTableList<Order>
        title={t("orders.title")}
        description={t("orders.subtitle")}
        headerActions={
          hasPermission(permissions.orders.create)
            ? [
                {
                  label: t("orders.addOrder"),
                  icon: Plus,
                  onClick: handleCreate,
                  variant: "default",
                },
              ]
            : []
        }
        searchPlaceholder={t("orders.searchPlaceholder")}
        enableSearch={true}
        columns={columns}
        service={orderService}
        store={store}
        emptyMessage={t("orders.noOrdersFound")}
        getRowKey={(order) => order.id}
        onRefresh={(refreshFn) => setRefreshTable(() => refreshFn)}
      />

      {/* Modals - only render if user has permissions */}
      {hasPermission(permissions.orders.create || permissions.orders.edit) && (
        <FormModal
          open={dialogMode !== null}
          onClose={() => setDialogMode(null)}
          editData={selectedOrder || undefined}
          onSuccess={() => refreshTable?.()}
        />
      )}

      <ViewModal
        open={showDetails}
        onClose={setShowDetails}
        orderId={selectedOrder?.id || null}
      />

      {hasPermission(permissions.orders.delete) && (
        <DeleteModal
          open={showDelete}
          onClose={setShowDelete}
          title={t("orders.delete.title")}
          description={`${t("orders.delete.message")} ${
            selectedOrder?.orderId
          }?`}
          onConfirm={handleDeleteOrder}
        />
      )}

      {hasPermission(permissions.orders.updateStatus) && (
        <UpdateOrderStatusModal
          open={showUpdateStatusModal}
          onClose={setShowUpdateStatusModal}
          orderId={selectedOrder?.id || null}
          status={selectedOrder?.status || ""}
          onSuccess={() => refreshTable?.()}
        />
      )}

      {hasPermission(permissions.orders.updateDeliveryTime) && (
        <UpdateDeliveryTimeModal
          open={showUpdateDeliveryTimeModal}
          onClose={setShowUpdateDeliveryTimeModal}
          orderId={selectedOrder?.id || null}
          onSuccess={() => refreshTable?.()}
        />
      )}
    </div>
  );
}
```

---

## Available Permissions

Here's the complete list of available permissions:

### Dashboard

- `dashboard.view`

### Users

- `users.view`
- `users.create`
- `users.update`
- `users.delete`
- `users.restore`
- `users.force_delete`
- `users.reset_password`

### Roles

- `roles.view`
- `roles.create`
- `roles.update`
- `roles.delete`
- `roles.assign_permissions`

### Orders

- `orders.view`
- `orders.create`
- `orders.update`
- `orders.delete`
- `orders.update_status`
- `orders.update_delivery_time`

### Delivery

- `delivery.view`
- `delivery.create`
- `delivery.update`
- `delivery.delete`
- `delivery.assign_agent`
- `delivery.track`

### Products

- `products.view`
- `products.create`
- `products.update`
- `products.delete`

### Categories

- `categories.view`
- `categories.create`
- `categories.update`
- `categories.delete`

### Packages

- `packages.view`
- `packages.create`
- `packages.update`
- `packages.delete`

### And more... (see `src/lib/permissions.ts`)

**Note:** Super Admin users with `role.name === "super_admin"` have automatic access to all permissions without needing them explicitly listed.

---

## Troubleshooting

### Permissions Not Working

1. **Check API Response**

   ```javascript
   console.log(useAuthStore.getState().permissions);
   console.log(useAuthStore.getState().user?.role?.name);
   ```

2. **Verify Permission String**

   ```javascript
   console.log(permissions.orders.view); // Should output: "orders.view"
   ```

3. **Check User Object**
   ```javascript
   console.log(useAuthStore.getState().user);
   ```

### Permission Always Returns False

- Ensure permissions are stored in auth store
- Check if permission string matches exactly
- Verify API is sending permissions array
- Check if user role is "super_admin" (they should have all permissions)

### Sidebar Items Not Showing

- Check if `hasPermission()` is called correctly
- Verify permission names in menuItems
- Ensure auth store has permissions loaded
- For super_admin users, verify role name is exactly "super_admin"

---

## Testing Checklist

### Implementation Checklist

- [ ] Add permission check to all protected pages
- [ ] Update sidebar menu items with permissions
- [ ] Add permission checks to action buttons
- [ ] Add permission checks to dropdown actions
- [ ] Add permission checks in handler functions
- [ ] Test with super_admin role
- [ ] Test with regular user roles
- [ ] Test with no permissions

### Files to Update

1. ✅ `src/hooks/use-permissions.ts` - Super_admin check implemented
2. ✅ `src/lib/permissions.ts` - All module permissions defined
3. ✅ `src/lib/withPermission.tsx` - Helper functions created
4. ✅ `src/components/NoPermission.tsx` - Error component created
5. ✅ `src/components/layout/Sidebar.tsx` - Using permissions
6. ✅ `src/pages/orders/Orders.tsx` - Example implementation
7. ⏳ `src/pages/users/Users.tsx` - Add permission check
8. ⏳ `src/pages/products/Products.tsx` - Add permission check
9. ⏳ Other page files - Add permission checks as needed

### User Experience Testing

- [ ] Super admin can access all pages
- [ ] Regular users with no permissions see NoPermission component
- [ ] Users with specific permissions see only allowed features
- [ ] Sidebar only shows items user has access to
- [ ] Action buttons are hidden for unauthorized actions
- [ ] Dropdown actions respect permissions
- [ ] Direct URL navigation shows NoPermission if no access
- [ ] Toast messages shown for unauthorized actions
- [ ] NoPermission component has working "Go Back" button
- [ ] NoPermission component has working "Go to Dashboard" button

### Permission Test Scenarios

Create test users with these permission sets:

1. **Super Admin**: `role.name = "super_admin"` (no explicit permissions needed)
2. **Full Admin**: All permissions in permissions array
3. **Manager**: View + Edit permissions for most modules
4. **Operator**: View only permissions
5. **Limited User**: Only specific module permissions (e.g., only orders.view)
6. **No Permissions**: Empty permissions array

---

## Summary

1. **Define** permissions in `src/lib/permissions.ts`
2. **Store** permissions in auth store from API
3. **Use** `usePermissions()` hook in components
4. **Check** permissions before showing UI or executing actions
5. **Provide** feedback for unauthorized actions
6. **Test** with different permission sets

**Special Role:** Users with `role.name === "super_admin"` automatically bypass all permission checks and have full access to the application.

This system provides a flexible, maintainable way to control access to features in your application.
