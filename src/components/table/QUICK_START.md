# Quick Reference - BaseTableList Component

## Minimal Setup (3 Steps)

```tsx
// 1. Define your data type
interface User {
  id: string;
  name: string;
  email: string;
}

// 2. Define columns
const columns: Column<User>[] = [
  { key: "id", label: "ID" },
  { key: "name", label: "Name" },
  { key: "email", label: "Email" },
];

// 3. Use the component
<BaseTableList
  title="Users"
  columns={columns}
  data={users}
  getRowKey={(user) => user.id}
/>;
```

---

## Common Patterns

### ✅ With Search

```tsx
const [searchQuery, setSearchQuery] = useState("");

<BaseTableList
  searchValue={searchQuery}
  onSearchChange={setSearchQuery}
  // ... other props
/>;
```

### ✅ With Filter

```tsx
const [statusFilter, setStatusFilter] = useState("all");

<BaseTableList
  filters={[
    {
      value: statusFilter,
      options: [
        { label: "All", value: "all" },
        { label: "Active", value: "active" },
      ],
      onChange: setStatusFilter,
    },
  ]}
  // ... other props
/>;
```

### ✅ With Create Button

```tsx
<BaseTableList
  headerActions={[
    {
      label: "Create New",
      icon: Plus,
      onClick: () => setIsCreateOpen(true),
    },
  ]}
  // ... other props
/>
```

### ✅ With Custom Cell Rendering

```tsx
const columns: Column<Product>[] = [
  { key: "name", label: "Product" },
  {
    key: "price",
    label: "Price",
    render: (product) => `$${product.price.toFixed(2)}`,
  },
  {
    key: "status",
    label: "Status",
    render: (product) => (
      <Badge variant={product.status === "active" ? "default" : "secondary"}>
        {product.status}
      </Badge>
    ),
  },
];
```

### ✅ With Row Actions

```tsx
{
  key: 'actions',
  label: 'Actions',
  render: (item) => (
    <div className="flex gap-2">
      <Button variant="ghost" size="sm" onClick={() => handleEdit(item)}>
        <Pencil className="h-4 w-4" />
      </Button>
      <Button variant="ghost" size="sm" onClick={() => handleDelete(item)}>
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  ),
}
```

### ✅ With Loading State

```tsx
const [isLoading, setIsLoading] = useState(true);

<BaseTableList
  isLoading={isLoading}
  // ... other props
/>;
```

---

## Props Cheat Sheet

| Must Have   | Optional Enhancements            |
| ----------- | -------------------------------- |
| `title`     | `description`                    |
| `columns`   | `headerActions`                  |
| `data`      | `searchValue` + `onSearchChange` |
| `getRowKey` | `filters`                        |
|             | `isLoading`                      |
|             | `emptyMessage`                   |
|             | `rowClassName`                   |

---

## Column Definition Options

```tsx
{
  key: 'fieldName',           // Required: data property name
  label: 'Display Name',      // Required: column header
  render: (item) => <JSX />,  // Optional: custom rendering
  className: 'max-w-[200px]', // Optional: column styling
}
```

---

## Complete Example (Copy & Paste)

```tsx
import { useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { BaseTableList, Column } from "@/components/table";
import { Button } from "@/components/ui/button";

interface Item {
  id: string;
  name: string;
  status: "active" | "inactive";
}

export function MyTable() {
  const [data, setData] = useState<Item[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(false);

  const filteredData = data.filter((item) => {
    const matchesSearch = item.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || item.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const columns: Column<Item>[] = [
    { key: "id", label: "ID" },
    { key: "name", label: "Name" },
    {
      key: "status",
      label: "Status",
      render: (item) => <span className="capitalize">{item.status}</span>,
    },
    {
      key: "actions",
      label: "Actions",
      render: (item) => (
        <div className="flex gap-2">
          <Button variant="ghost" size="sm">
            <Pencil className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm">
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <BaseTableList
      title="My Items"
      description="Manage all items"
      headerActions={[
        {
          label: "Create New",
          icon: Plus,
          onClick: () => console.log("Create"),
        },
      ]}
      searchPlaceholder="Search items..."
      searchValue={searchQuery}
      onSearchChange={setSearchQuery}
      filters={[
        {
          value: statusFilter,
          options: [
            { label: "All", value: "all" },
            { label: "Active", value: "active" },
            { label: "Inactive", value: "inactive" },
          ],
          onChange: setStatusFilter,
          placeholder: "Filter by status",
        },
      ]}
      columns={columns}
      data={filteredData}
      isLoading={isLoading}
      emptyMessage="No items found"
      getRowKey={(item) => item.id}
    />
  );
}
```

---

## Import Statement

```tsx
import { BaseTableList, Column } from "@/components/table";
```

That's it! 🎉
