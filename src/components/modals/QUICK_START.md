# Modal Components - Quick Reference

## Import

```tsx
import {
  BaseModal,
  FormModal,
  DeleteModal,
  ConfirmationModal,
} from "@/components/modals";
```

---

## Quick Examples

### ✅ Form Modal

```tsx
const [open, setOpen] = useState(false);
const [data, setData] = useState({});

<FormModal
  open={open}
  onOpenChange={setOpen}
  title="Create Item"
  onSubmit={() => saveData(data)}
>
  <Input value={data.name} onChange={...} />
</FormModal>
```

### ✅ Delete Confirmation

```tsx
const [open, setOpen] = useState(false);

<DeleteModal
  open={open}
  onOpenChange={setOpen}
  itemName="user John Doe"
  onConfirm={handleDelete}
/>;
```

### ✅ General Confirmation

```tsx
<ConfirmationModal
  open={open}
  onOpenChange={setOpen}
  title="Are you sure?"
  description="This will cancel the order"
  onConfirm={handleConfirm}
/>
```

### ✅ Custom BaseModal

```tsx
<BaseModal
  open={open}
  onOpenChange={setOpen}
  title="Custom Modal"
  submitButtonText="Save Changes"
  onSubmit={handleSave}
>
  <p>Your content here</p>
</BaseModal>
```

---

## Common Props

| Prop           | Form | Delete | Confirmation | Base |
| -------------- | ---- | ------ | ------------ | ---- |
| `open`         | ✅   | ✅     | ✅           | ✅   |
| `onOpenChange` | ✅   | ✅     | ✅           | ✅   |
| `title`        | ✅   | ✅     | ✅           | ✅   |
| `description`  | ✅   | ✅     | ✅           | ✅   |
| `onSubmit`     | ✅   | -      | -            | ✅   |
| `onConfirm`    | -    | ✅     | ✅           | -    |
| `isSubmitting` | ✅   | -      | -            | ✅   |
| `isDeleting`   | -    | ✅     | -            | -    |
| `isProcessing` | -    | -      | ✅           | -    |

---

## Sizes

```tsx
size = "sm"; // Small - 384px
size = "md"; // Medium - 448px (default)
size = "lg"; // Large - 512px
size = "xl"; // Extra Large - 576px
size = "2xl"; // 2X Large - 672px
size = "full"; // Full width
```

---

## Button Variants

```tsx
variant = "default"; // Primary blue
variant = "destructive"; // Red danger
variant = "outline"; // Outlined
variant = "secondary"; // Gray
variant = "ghost"; // Transparent
variant = "link"; // Link style
```

---

## Complete Example

```tsx
function MyComponent() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "" });

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await api.save(formData);
      toast({ title: "Success!" });
      setIsOpen(false);
    } catch (error) {
      toast({ title: "Error", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>Open Modal</Button>

      <FormModal
        open={isOpen}
        onOpenChange={setIsOpen}
        title="Create User"
        description="Add a new user to the system"
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
        submitButtonText="Create"
        size="lg"
      >
        <div className="space-y-4">
          <Input
            placeholder="Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
          <Input
            placeholder="Email"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
          />
        </div>
      </FormModal>
    </>
  );
}
```

---

## Tips

✅ Use FormModal for forms
✅ Use DeleteModal for deletions
✅ Use ConfirmationModal for confirmations
✅ Use BaseModal for custom needs
✅ Always handle loading states
✅ Disable buttons during submission
✅ Show toast after success/error
✅ Reset form on close

---

## Page-Specific Modals

Create in: `src/pages/[page]/modal/`

```tsx
// src/pages/delivery/modal/FormModal.tsx
import { FormModal } from "@/components/modals";

export function DeliveryFormModal({ open, onOpenChange, data, onSubmit }) {
  return (
    <FormModal
      open={open}
      onOpenChange={onOpenChange}
      title="Create Delivery"
      onSubmit={onSubmit}
      size="2xl"
    >
      {/* Page-specific form fields */}
    </FormModal>
  );
}
```

Then use in page:

```tsx
import { DeliveryFormModal } from './delivery/modal';

<DeliveryFormModal open={open} ... />
```
