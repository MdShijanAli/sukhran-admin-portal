# FilterModal Component Usage Guide

The `FilterModal` component is now a reusable, dynamic component that handles API calls automatically, similar to `BaseTableList`.

## Features

- ✅ Generic TypeScript support
- ✅ Automatic API calls with query string building
- ✅ Loading state management
- ✅ Success/error toast notifications
- ✅ Backward compatible with custom callbacks
- ✅ Disabled state during loading

## Basic Usage (Automatic Mode)

Just pass `service` and `store`, and FilterModal handles everything:

```tsx
import FilterModal from "@/components/modals/FilterModal";
import { SupportTicket, useSupportStore } from "@/stores/supportStore";
import supportService from "@/services/supportService";

function MyComponent() {
  const store = useSupportStore();
  const [showFilterModal, setShowFilterModal] = useState(false);

  const filterConfigs = [
    {
      key: "status",
      label: "status",
      options: [
        { label: "All Statuses", value: "all" },
        { label: "Open", value: "open" },
        { label: "Closed", value: "closed" },
      ],
      defaultValue: "all",
    },
    {
      key: "priority",
      label: "priority",
      options: [
        { label: "All Priorities", value: "all" },
        { label: "High", value: "high" },
        { label: "Low", value: "low" },
      ],
      defaultValue: "all",
    },
  ];

  return (
    <FilterModal<SupportTicket>
      open={showFilterModal}
      onClose={() => setShowFilterModal(false)}
      title="Filter Tickets"
      filters={filterConfigs}
      service={supportService} // ✨ Just pass service
      store={store} // ✨ Just pass store
      submitButtonText="Apply"
      clearButtonText="Clear"
    />
  );
}
```

That's it! The modal will:

- Build query string from filters (e.g., `?status=open&priority=high`)
- Call `service.fetchLists(queryString)` on Apply
- Update store automatically
- Show success/error toasts
- Handle loading states

## Advanced Usage with Custom Service Method

If your service uses a different method name:

```tsx
<FilterModal<User>
  open={showFilterModal}
  onClose={() => setShowFilterModal(false)}
  filters={filterConfigs}
  service={userService}
  serviceMethod="fetchFilteredUsers" // ✨ Custom method name
  store={store}
/>
```

## Additional Query Parameters

Add extra params that aren't part of the filters:

```tsx
<FilterModal<Order>
  open={showFilterModal}
  onClose={() => setShowFilterModal(false)}
  filters={filterConfigs}
  service={orderService}
  store={store}
  additionalParams={{
    page: "1",
    per_page: "20",
    search: searchQuery,
  }}
/>
```

## Custom Callbacks (Backward Compatible)

You can still use custom callbacks if needed:

```tsx
<FilterModal
  open={showFilterModal}
  onClose={() => setShowFilterModal(false)}
  filters={filterConfigs}
  service={orderService}
  store={store}
  onApplyFilters={(filters) => {
    // Custom logic after filters applied
    console.log("Applied:", filters);
  }}
  onClearFilters={() => {
    // Custom logic after filters cleared
    console.log("Cleared");
  }}
/>
```

## Filter Configuration

Each filter config requires:

```typescript
{
  key: "status",           // Query param name (e.g., ?status=open)
  label: "Status",         // Display label
  options: [               // Dropdown options
    { label: "All", value: "all" },
    { label: "Open", value: "open" },
  ],
  defaultValue: "all",     // Default selected value
}
```

## Query String Building

Filters are automatically converted to query strings:

```typescript
// Filters:
{ status: "open", priority: "high", category: "all" }

// Resulting query string:
?status=open&priority=high
// (Note: "all" values are skipped)
```

## Migration from Old Pattern

**Before (Manual):**

```tsx
// ❌ Old way - lots of boilerplate
const [filterData, setFilterData] = useState({});

useEffect(() => {
  const params = new URLSearchParams();
  params.append("status", filterData.status);
  params.append("category", filterData.category);

  const fetchData = async () => {
    store.setLoading(true);
    try {
      await service.fetchLists(params.toString());
    } catch (error) {
      toast.error("Failed");
    } finally {
      store.setLoading(false);
    }
  };
  fetchData();
}, [filterData]);

const handleApply = (filters) => {
  setFilterData(filters);
  toast.success("Filters applied");
};

<FilterModal
  currentFilters={filterData}
  onApplyFilters={handleApply}
  onClearFilters={handleClear}
/>;
```

**After (Automatic):**

```tsx
// ✅ New way - clean and simple
<FilterModal<SupportTicket>
  filters={filterConfigs}
  service={supportService}
  store={store}
/>
```

## Complete Example

See [TicketsTab.tsx](src/pages/supports/tabs/TicketsTab.tsx) for a complete working example.

## Props Reference

| Prop               | Type                     | Required | Description                                 |
| ------------------ | ------------------------ | -------- | ------------------------------------------- |
| `open`             | `boolean`                | ✅       | Modal visibility                            |
| `onClose`          | `() => void`             | ✅       | Close handler                               |
| `filters`          | `FilterConfig[]`         | ✅       | Filter configurations                       |
| `title`            | `string`                 | ❌       | Modal title (default: "Apply Filters")      |
| `service`          | `ApiService<T>`          | ❌       | Service for API calls                       |
| `serviceMethod`    | `keyof ApiService<T>`    | ❌       | Custom service method (default: fetchLists) |
| `store`            | `StoreWithData<T>`       | ❌       | Store for state management                  |
| `currentFilters`   | `Record<string, string>` | ❌       | Initial filter values                       |
| `additionalParams` | `Record<string, string>` | ❌       | Extra query params                          |
| `onApplyFilters`   | `(filters) => void`      | ❌       | Custom apply callback                       |
| `onClearFilters`   | `() => void`             | ❌       | Custom clear callback                       |
| `submitButtonText` | `string`                 | ❌       | Apply button text                           |
| `clearButtonText`  | `string`                 | ❌       | Clear button text                           |
