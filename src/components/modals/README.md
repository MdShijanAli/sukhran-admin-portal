# Reusable Modal Components

A complete modal system with base components and specialized modals for common use cases.

## Components Overview

### 1. **BaseModal** - Foundation Modal Component

The core modal component that all other modals build upon. Provides consistent structure with customizable header, body, and footer.

### 2. **FormModal** - Form/Data Entry Modal

Pre-configured modal for forms with submit and cancel buttons.

### 3. **DeleteModal** - Deletion Confirmation

AlertDialog-based modal specifically for delete confirmations with warning styling.

### 4. **ConfirmationModal** - General Confirmation

AlertDialog-based modal for any confirmation action (not just delete).

---

## Installation & Usage

### Basic Import

```tsx
import {
  BaseModal,
  FormModal,
  DeleteModal,
  ConfirmationModal,
} from "@/components/modals";
```

---

## Component Documentation

### BaseModal Props

| Prop                   | Type                                              | Default     | Description                        |
| ---------------------- | ------------------------------------------------- | ----------- | ---------------------------------- |
| `open`                 | `boolean`                                         | -           | **Required.** Modal open state     |
| `onOpenChange`         | `(open: boolean) => void`                         | -           | **Required.** State change handler |
| `title`                | `string`                                          | -           | **Required.** Modal title          |
| `description`          | `string`                                          | -           | Modal description                  |
| `children`             | `ReactNode`                                       | -           | **Required.** Modal content        |
| `showCloseButton`      | `boolean`                                         | `true`      | Show cancel/close button           |
| `closeButtonText`      | `string`                                          | `'Cancel'`  | Close button text                  |
| `closeButtonVariant`   | `ButtonVariant`                                   | `'outline'` | Close button style                 |
| `onClose`              | `() => void`                                      | -           | Close button handler               |
| `showSubmitButton`     | `boolean`                                         | `true`      | Show submit button                 |
| `submitButtonText`     | `string`                                          | `'Submit'`  | Submit button text                 |
| `submitButtonVariant`  | `ButtonVariant`                                   | `'default'` | Submit button style                |
| `onSubmit`             | `() => void`                                      | -           | Submit button handler              |
| `submitButtonDisabled` | `boolean`                                         | `false`     | Disable submit button              |
| `isSubmitting`         | `boolean`                                         | `false`     | Show loading state                 |
| `customActions`        | `ReactNode`                                       | -           | Additional footer actions          |
| `size`                 | `'sm' \| 'md' \| 'lg' \| 'xl' \| '2xl' \| 'full'` | `'md'`      | Modal width                        |
| `className`            | `string`                                          | -           | Additional CSS classes             |

---

## Usage Examples

### Example 1: Simple BaseModal

```tsx
import { BaseModal } from "@/components/modals";

function MyComponent() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <BaseModal
      open={isOpen}
      onOpenChange={setIsOpen}
      title="Simple Modal"
      description="This is a basic modal"
      onSubmit={() => console.log("Submitted")}
    >
      <p>Modal content goes here</p>
    </BaseModal>
  );
}
```

### Example 2: FormModal for Data Entry

```tsx
import { FormModal } from "@/components/modals";

function UserForm() {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "" });

  const handleSubmit = () => {
    console.log("Form data:", formData);
    setIsOpen(false);
  };

  return (
    <FormModal
      open={isOpen}
      onOpenChange={setIsOpen}
      title="Create User"
      description="Add a new user to the system"
      onSubmit={handleSubmit}
      submitButtonText="Create User"
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
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        />
      </div>
    </FormModal>
  );
}
```

### Example 3: DeleteModal for Confirmations

```tsx
import { DeleteModal } from "@/components/modals";

function UserList() {
  const [showDelete, setShowDelete] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const handleDelete = () => {
    // Perform delete operation
    console.log("Deleting user:", selectedUser?.id);
    setShowDelete(false);
  };

  return (
    <>
      <Button
        onClick={() => {
          setSelectedUser(user);
          setShowDelete(true);
        }}
      >
        Delete
      </Button>

      <DeleteModal
        open={showDelete}
        onOpenChange={setShowDelete}
        title="Delete User"
        itemName={`user ${selectedUser?.name}`}
        onConfirm={handleDelete}
      />
    </>
  );
}
```

### Example 4: ConfirmationModal for General Actions

```tsx
import { ConfirmationModal } from "@/components/modals";

function OrderActions() {
  const [showConfirm, setShowConfirm] = useState(false);

  const handleConfirm = () => {
    console.log("Order cancelled");
    setShowConfirm(false);
  };

  return (
    <ConfirmationModal
      open={showConfirm}
      onOpenChange={setShowConfirm}
      title="Cancel Order"
      description="Are you sure you want to cancel this order? The customer will be notified."
      onConfirm={handleConfirm}
      confirmButtonText="Yes, Cancel Order"
      variant="destructive"
    />
  );
}
```

### Example 5: BaseModal with Custom Actions

```tsx
import { BaseModal } from "@/components/modals";
import { Button } from "@/components/ui/button";

function AdvancedModal() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <BaseModal
      open={isOpen}
      onOpenChange={setIsOpen}
      title="Advanced Options"
      showSubmitButton={false}
      customActions={
        <>
          <Button variant="secondary" onClick={() => console.log("Option 1")}>
            Option 1
          </Button>
          <Button variant="secondary" onClick={() => console.log("Option 2")}>
            Option 2
          </Button>
          <Button onClick={() => console.log("Confirm")}>Confirm</Button>
        </>
      }
    >
      <p>Content with custom footer buttons</p>
    </BaseModal>
  );
}
```

### Example 6: FormModal with Loading State

```tsx
import { FormModal } from "@/components/modals";

function AsyncForm() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [data, setData] = useState("");

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await saveData(data);
      setIsOpen(false);
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <FormModal
      open={isOpen}
      onOpenChange={setIsOpen}
      title="Save Data"
      onSubmit={handleSubmit}
      isSubmitting={isSubmitting}
      submitButtonText="Save"
    >
      <Input value={data} onChange={(e) => setData(e.target.value)} />
    </FormModal>
  );
}
```

### Example 7: Modal with Size Variations

```tsx
// Small modal
<BaseModal size="sm" {...props}>Content</BaseModal>

// Medium (default)
<BaseModal size="md" {...props}>Content</BaseModal>

// Large
<BaseModal size="lg" {...props}>Content</BaseModal>

// Extra Large
<BaseModal size="xl" {...props}>Content</BaseModal>

// 2XL
<BaseModal size="2xl" {...props}>Content</BaseModal>

// Full width
<BaseModal size="full" {...props}>Content</BaseModal>
```

---

## Creating Page-Specific Modals

For page-specific modals (like delivery forms), create them in your page folder:

```
src/pages/delivery/modal/
├── FormModal.tsx       # Delivery-specific form modal
├── TrackingModal.tsx   # Delivery tracking modal
└── index.ts            # Exports
```

**Example: DeliveryFormModal.tsx**

```tsx
import { FormModal } from '@/components/modals';

export function DeliveryFormModal({ open, onOpenChange, formData, onSubmit }) {
  return (
    <FormModal
      open={open}
      onOpenChange={onOpenChange}
      title="Create Delivery"
      onSubmit={onSubmit}
      size="2xl"
    >
      {/* Your form fields here */}
      <Input value={formData.customer} ... />
      <Textarea value={formData.address} ... />
    </FormModal>
  );
}
```

---

## Best Practices

1. **Use Specialized Modals**: Use FormModal, DeleteModal, etc. instead of BaseModal when possible
2. **Controlled State**: Always use controlled state for open/close
3. **Loading States**: Use `isSubmitting` for async operations
4. **Validation**: Disable submit button when form is invalid
5. **Feedback**: Show toast notifications after successful actions
6. **Cleanup**: Reset form data when modal closes

---

## Modal Sizes

| Size   | Max Width | Use Case                             |
| ------ | --------- | ------------------------------------ |
| `sm`   | 384px     | Small alerts, simple confirmations   |
| `md`   | 448px     | Default, general content             |
| `lg`   | 512px     | Forms with moderate content          |
| `xl`   | 576px     | Larger forms                         |
| `2xl`  | 672px     | Complex forms with multiple sections |
| `full` | 100%      | Maximum space needed                 |

---

## Type Definitions

### ButtonVariant

```tsx
type ButtonVariant =
  | "default"
  | "destructive"
  | "outline"
  | "secondary"
  | "ghost"
  | "link";
```

### ModalSize

```tsx
type ModalSize = "sm" | "md" | "lg" | "xl" | "2xl" | "full";
```

---

## Component Hierarchy

```
BaseModal (Foundation)
├── FormModal (Extends BaseModal)
│   └── DeliveryFormModal (Page-specific)
│   └── UserFormModal (Page-specific)
│   └── ProductFormModal (Page-specific)
│
├── DeleteModal (AlertDialog)
│   └── Used directly
│
└── ConfirmationModal (AlertDialog)
    └── Used directly
```

---

## Migration from Dialog/AlertDialog

**Before:**

```tsx
<Dialog open={open} onOpenChange={setOpen}>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Title</DialogTitle>
    </DialogHeader>
    {/* content */}
    <DialogFooter>
      <Button onClick={onCancel}>Cancel</Button>
      <Button onClick={onSubmit}>Submit</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
```

**After:**

```tsx
<FormModal open={open} onOpenChange={setOpen} title="Title" onSubmit={onSubmit}>
  {/* content */}
</FormModal>
```

---

## File Structure

```
src/components/modals/
├── BaseModal.tsx          # Core modal component
├── FormModal.tsx          # Form modal wrapper
├── DeleteModal.tsx        # Delete confirmation
├── ConfirmationModal.tsx  # General confirmation
└── index.ts              # Exports

src/pages/[page]/modal/
├── FormModal.tsx         # Page-specific form
├── TrackingModal.tsx     # Page-specific modal
└── index.ts             # Page modal exports
```
