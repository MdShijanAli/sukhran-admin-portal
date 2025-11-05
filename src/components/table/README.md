# Reusable Table Components

A set of reusable, type-safe table components built with React, TypeScript, and shadcn/ui.

## Components Overview

### 1. **BaseTable** - Core Table Component

The foundation table component that handles rendering table structure with headers, body, loading states, and empty states.

### 2. **BaseTableList** - Enhanced Table with Toolbar

A wrapper around BaseTable that adds search, filters, header actions, and pagination support.

### 3. **TableSkeleton** - Loading State Component

Displays skeleton loaders while data is being fetched.

### 4. **Pagination** - Pagination Controls

Provides full pagination controls with first, last, prev, next, and page number buttons.

---

## Installation & Usage

### Basic Import

```tsx
import { BaseTableList, Column } from "@/components/table";
```

---

## Component Documentation

### BaseTableList Props

| Prop                | Type                            | Required | Description                                   |
| ------------------- | ------------------------------- | -------- | --------------------------------------------- |
| `title`             | `string`                        | ✅       | Card header title                             |
| `description`       | `string`                        | ❌       | Card header description                       |
| `headerActions`     | `ActionButton[]`                | ❌       | Action buttons in header (e.g., "Create New") |
| `searchPlaceholder` | `string`                        | ❌       | Search input placeholder text                 |
| `searchValue`       | `string`                        | ❌       | Controlled search value                       |
| `onSearchChange`    | `(value: string) => void`       | ❌       | Search change handler                         |
| `filters`           | `Filter[]`                      | ❌       | Array of filter dropdowns                     |
| `toolbarActions`    | `ReactNode`                     | ❌       | Custom toolbar elements                       |
| `columns`           | `Column<T>[]`                   | ✅       | Table column definitions                      |
| `data`              | `T[]`                           | ✅       | Array of data to display                      |
| `isLoading`         | `boolean`                       | ❌       | Show loading skeleton                         |
| `emptyMessage`      | `string`                        | ❌       | Message when no data                          |
| `getRowKey`         | `(item: T) => string \| number` | ✅       | Unique row identifier                         |
| `rowClassName`      | `(item: T) => string`           | ❌       | Dynamic row classes                           |
| `showPagination`    | `boolean`                       | ❌       | Enable pagination                             |
| `currentPage`       | `number`                        | ❌       | Current page number                           |
| `totalPages`        | `number`                        | ❌       | Total number of pages                         |
| `onPageChange`      | `(page: number) => void`        | ❌       | Page change handler                           |

---

## Usage Examples

### Example 1: Simple Table

```tsx
import { BaseTableList, Column } from "@/components/table";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

function UsersTable() {
  const [users, setUsers] = useState<User[]>([]);

  const columns: Column<User>[] = [
    { key: "id", label: "ID" },
    { key: "name", label: "Name" },
    { key: "email", label: "Email" },
    { key: "role", label: "Role" },
  ];

  return (
    <BaseTableList
      title="Users"
      description="Manage system users"
      columns={columns}
      data={users}
      getRowKey={(user) => user.id}
    />
  );
}
```

### Example 2: Table with Search and Filters

```tsx
function DeliveriesTable() {
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredData = deliveries.filter((d) => {
    const matchesSearch = d.customer
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || d.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <BaseTableList
      title="Deliveries"
      searchPlaceholder="Search by customer..."
      searchValue={searchQuery}
      onSearchChange={setSearchQuery}
      filters={[
        {
          value: statusFilter,
          options: [
            { label: "All", value: "all" },
            { label: "Pending", value: "pending" },
            { label: "Delivered", value: "delivered" },
          ],
          onChange: setStatusFilter,
          placeholder: "Filter by status",
        },
      ]}
      columns={columns}
      data={filteredData}
      getRowKey={(d) => d.id}
    />
  );
}
```

### Example 3: Table with Custom Rendering and Actions

```tsx
import { Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

function ProductsTable() {
  const [products, setProducts] = useState<Product[]>([]);

  const columns: Column<Product>[] = [
    {
      key: "id",
      label: "ID",
      render: (product) => <span className="font-medium">{product.id}</span>,
    },
    {
      key: "name",
      label: "Product Name",
    },
    {
      key: "price",
      label: "Price",
      render: (product) => `$${product.price.toFixed(2)}`,
    },
    {
      key: "stock",
      label: "Stock",
      render: (product) => (
        <span
          className={product.stock < 10 ? "text-red-500" : "text-green-500"}
        >
          {product.stock}
        </span>
      ),
    },
    {
      key: "actions",
      label: "Actions",
      render: (product) => (
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" onClick={() => handleEdit(product)}>
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleDelete(product)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <BaseTableList
      title="Products"
      headerActions={[
        {
          label: "Add Product",
          icon: Plus,
          onClick: () => setIsCreateOpen(true),
        },
      ]}
      columns={columns}
      data={products}
      getRowKey={(p) => p.id}
    />
  );
}
```

### Example 4: Table with Loading State

```tsx
function OrdersTable() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchOrders().then((data) => {
      setOrders(data);
      setIsLoading(false);
    });
  }, []);

  return (
    <BaseTableList
      title="Orders"
      columns={columns}
      data={orders}
      isLoading={isLoading}
      emptyMessage="No orders found"
      getRowKey={(order) => order.id}
    />
  );
}
```

### Example 5: Table with Multiple Filters

```tsx
function InventoryTable() {
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  return (
    <BaseTableList
      title="Inventory"
      filters={[
        {
          value: categoryFilter,
          options: [
            { label: "All Categories", value: "all" },
            { label: "Electronics", value: "electronics" },
            { label: "Clothing", value: "clothing" },
          ],
          onChange: setCategoryFilter,
          placeholder: "Category",
        },
        {
          value: statusFilter,
          options: [
            { label: "All Status", value: "all" },
            { label: "In Stock", value: "in-stock" },
            { label: "Low Stock", value: "low-stock" },
            { label: "Out of Stock", value: "out-of-stock" },
          ],
          onChange: setStatusFilter,
          placeholder: "Status",
        },
      ]}
      columns={columns}
      data={filteredInventory}
      getRowKey={(item) => item.id}
    />
  );
}
```

---

## Type Definitions

### Column<T>

```tsx
interface Column<T> {
  key: string; // Property key from data object
  label: string; // Column header label
  render?: (item: T) => React.ReactNode; // Custom render function
  className?: string; // Additional CSS classes
}
```

### ActionButton

```tsx
interface ActionButton {
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
  onClick: () => void;
  variant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link";
}
```

### FilterOption

```tsx
interface FilterOption {
  label: string;
  value: string;
}
```

---

## Best Practices

1. **Always provide `getRowKey`**: Ensures proper React key management
2. **Use `render` for custom content**: Format dates, prices, status badges, etc.
3. **Keep columns focused**: One piece of data per column
4. **Handle loading states**: Use `isLoading` prop for better UX
5. **Provide meaningful empty messages**: Help users understand why table is empty
6. **Use TypeScript generics**: Get full type safety for your data

---

## Styling

The components use Tailwind CSS and shadcn/ui. You can customize:

- **Column widths**: Use `className` on column definition
- **Row styling**: Use `rowClassName` for conditional row styles
- **Card appearance**: Modify the BaseTableList wrapper

---

## Advanced Features

### Custom Toolbar Actions

```tsx
<BaseTableList
  // ... other props
  toolbarActions={
    <Button variant="outline">
      <Download className="h-4 w-4 mr-2" />
      Export CSV
    </Button>
  }
/>
```

### Conditional Row Styling

```tsx
<BaseTableList
  // ... other props
  rowClassName={(item) => (item.status === "urgent" ? "bg-red-50" : "")}
/>
```

---

## Migration Guide

To convert existing table code to use BaseTableList:

1. Extract column definitions into a `Column<T>[]` array
2. Move search/filter logic into state
3. Replace Card + Table markup with `<BaseTableList />`
4. Pass all props to BaseTableList
5. Keep dialogs and other UI outside the table component

See `ExampleUsage.tsx` for a complete migration example.
