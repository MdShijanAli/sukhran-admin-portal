# StatusView Component Documentation

A modern, reusable status display component that centralizes all status styling logic across the application.

## Features

- ✅ Centralized status styling and configuration
- ✅ Support for multiple status types (payment, order, delivery, transaction, payment_method)
- ✅ Consistent design system across the entire application
- ✅ Modern UI with smooth transitions and hover effects
- ✅ Optional icon support
- ✅ Customizable sizing (small, default, large)
- ✅ TypeScript support with full type safety
- ✅ Backward compatibility with existing code
- ✅ Auto-fallback for unknown statuses

## Basic Usage

```tsx
import StatusView from "@/components/custom/StatusView";

// Simple usage - auto-detects status type
<StatusView status="pending" />

// With specific type for better accuracy
<StatusView
  status="delivered"
  type="order"
/>

// With custom label (useful for i18n)
<StatusView
  status="paid"
  type="payment"
  label={t("payment.status.paid")}
/>

// With icon
<StatusView
  status="in-transit"
  type="delivery"
  showIcon={true}
/>

// Custom size
<StatusView
  status="success"
  type="transaction"
  size="lg"
/>
```

## Props

| Prop        | Type                        | Default        | Description                                                                                               |
| ----------- | --------------------------- | -------------- | --------------------------------------------------------------------------------------------------------- |
| `status`    | `string`                    | **required**   | The status value to display                                                                               |
| `type`      | `StatusType`                | `"default"`    | Type of status: `"payment"`, `"order"`, `"delivery"`, `"transaction"`, `"payment_method"`, or `"default"` |
| `label`     | `string`                    | auto-generated | Custom label to display (useful for translations)                                                         |
| `showIcon`  | `boolean`                   | `false`        | Show icon before the label                                                                                |
| `className` | `string`                    | -              | Additional CSS classes                                                                                    |
| `size`      | `"sm" \| "default" \| "lg"` | `"default"`    | Badge size                                                                                                |

## Supported Status Types

### Payment Statuses (`type="payment"`)

- `pending` - Yellow/Warning (⏳)
- `paid` - Green/Success (✓)
- `failed` - Red/Error (✕)
- `cancelled` - Red/Error (✕)
- `refunded` - Orange/Warning (↩)

### Order Statuses (`type="order"`)

- `pending` - Yellow/Warning (⏳)
- `confirmed` - Purple/Primary (✓)
- `approved` - Green/Success (✓)
- `shipped` - Blue/Info (📦)
- `delivered` - Green/Success (✓)
- `cancelled` - Red/Error (✕)
- `cancelled_at_delivery` / `cancelled-at-delivery` - Red/Error (✕)
- `returned` - Orange/Warning (↩)
- `processing` - Indigo/Info (⚙)

### Delivery Statuses (`type="delivery"`)

- `pending` - Yellow/Warning (⏳)
- `assigned` - Blue/Info (👤)
- `picked-up` - Indigo/Info (📦)
- `in-transit` - Primary/Brand (🚚)
- `delivered` - Green/Success (✓)
- `failed` - Red/Error (✕)
- `cancelled` - Red/Error (✕)
- `confirmed` - Purple/Primary (✓)
- `out-for-delivery` - Primary/Brand (🚚)

### Transaction Statuses (`type="transaction"`)

- `success` - Green/Success (✓)
- `failed` - Red/Error (✕)
- `pending` - Yellow/Warning (⏳)
- `refunded` - Orange/Warning (↩)

### Payment Methods (`type="payment_method"`)

- `cod` / `Cod` - Purple with white text (💵)
- `online` / `Online` - Green with white text (💳)
- `online-payment` / `Online Payment` - Green with white text (💳)

## Real-World Examples

### In Table Columns

```tsx
const columns: Column<Order>[] = [
  {
    key: "status",
    label: t("orders.columns.status"),
    render: (order) => (
      <StatusView
        status={order.status}
        type="order"
        label={t(`orders.status.${order.status}`)}
      />
    ),
  },
  {
    key: "payment_status",
    label: t("orders.columns.paymentStatus"),
    render: (order) => (
      <StatusView
        status={order.payment_status}
        type="payment"
        label={t(`orders.paymentStatus.${order.payment_status}`)}
      />
    ),
  },
];
```

### In Detail Views

```tsx
<div className="flex items-center gap-2">
  <span className="text-sm text-muted-foreground">Status:</span>
  <StatusView
    status={delivery.status}
    type="delivery"
    showIcon={true}
    size="lg"
  />
</div>
```

### In Cards

```tsx
<Card>
  <CardHeader>
    <div className="flex items-center justify-between">
      <CardTitle>Order #{order.id}</CardTitle>
      <StatusView status={order.status} type="order" showIcon={true} />
    </div>
  </CardHeader>
</Card>
```

### In Lists

```tsx
{
  orders.map((order) => (
    <div key={order.id} className="flex items-center justify-between p-4">
      <span>{order.customer_name}</span>
      <div className="flex gap-2">
        <StatusView status={order.status} type="order" size="sm" />
        <StatusView status={order.payment_status} type="payment" size="sm" />
      </div>
    </div>
  ));
}
```

## Migration Guide

### Before (Old Code)

```tsx
// Using Badge with variant
<Badge variant={order.payment_status as any}>
  {t(`orders.paymentStatus.${order.payment_status}`)}
</Badge>

// Using Badge with className function
<Badge className={getStatusColor(delivery.status)}>
  {t(`delivery.status.${delivery.status}`)}
</Badge>

// Using StatusVariant utility
<Badge className={StatusVariant(item.status)}>
  {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
</Badge>
```

### After (New Code)

```tsx
// Simple and clean
<StatusView
  status={order.payment_status}
  type="payment"
  label={t(`orders.paymentStatus.${order.payment_status}`)}
/>

<StatusView
  status={delivery.status}
  type="delivery"
  label={t(`delivery.status.${delivery.status}`)}
/>

<StatusView
  status={item.status}
  type="transaction"
/>
```

## Customization

### Adding New Statuses

Edit [StatusView.tsx](src/components/custom/StatusView.tsx) and add to the appropriate status configuration:

```tsx
const orderStatuses: Record<string, StatusConfig> = {
  // ... existing statuses
  "new-status": {
    label: "New Status",
    className:
      "bg-blue-500/10 text-blue-700 border-blue-500/30 hover:bg-blue-500/20",
    icon: "🆕",
  },
};
```

### Custom Styling

```tsx
<StatusView
  status="delivered"
  type="order"
  className="shadow-lg ring-2 ring-green-500/20"
/>
```

## Backward Compatibility

For codebases with existing `StatusVariant` usage, the component exports a utility function:

```tsx
import { getStatusClassName } from "@/components/custom/StatusView";

// Returns the className string
const className = getStatusClassName("paid", "payment");
```

## Design System

The component follows a consistent design pattern:

- **Background**: 10% opacity of the status color
- **Text**: 700 shade of the status color
- **Border**: 30% opacity of the status color
- **Hover**: 20% opacity background on hover
- **Transitions**: Smooth 200ms transitions
- **Font Weight**: Medium (500) for better readability
- **Shadows**: Subtle shadows for elevated states (payment methods)

## Benefits

1. **Centralized Management**: All status styles in one place
2. **Type Safety**: Full TypeScript support prevents errors
3. **Consistency**: Same look and feel across the entire app
4. **Easy Updates**: Change once, apply everywhere
5. **i18n Ready**: Easy integration with translation systems
6. **Accessibility**: Semantic HTML with proper contrast ratios
7. **Performance**: Optimized rendering with memoization support
8. **Maintainability**: Easy to add new statuses without code duplication

## Best Practices

1. Always specify the `type` prop for better accuracy
2. Use `label` prop for translated text
3. Enable `showIcon` for better visual hierarchy in important views
4. Use appropriate `size` based on context (sm for compact lists, lg for headers)
5. Wrap in responsive containers when needed

## Notes

- Status values are case-insensitive
- Underscores and hyphens are normalized (e.g., `in_transit` = `in-transit`)
- Unknown statuses get a default gray style
- The component handles null/undefined gracefully by returning null
