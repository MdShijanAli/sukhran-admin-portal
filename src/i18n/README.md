# Localization Structure

## Overview

The i18n structure follows a modular approach for better organization and maintainability. Each language has its own folder with module-specific translation files.

## File Structure

```
src/i18n/
├── config.ts                    # Main i18n configuration
└── locales/
    ├── en/                      # English translations
    │   ├── index.js            # Combines all English modules
    │   ├── common.json         # Common translations
    │   └── users/
    │       └── index.json      # Users module translations
    │
    └── bn/                      # Bengali translations
        ├── index.js            # Combines all Bengali modules
        ├── common.json         # Common translations (Bengali)
        └── users/
            └── index.json      # Users module translations (Bengali)
```

## Structure Pattern

Each language folder (`en/`, `bn/`) follows this pattern:

1. **index.js** - Entry point that combines all modules
2. **common.json** - Shared translations across all modules
3. **[module]/index.json** - Module-specific translations

### Example: en/index.js

```javascript
import common from "./common.json";
import users from "./users/index.json";

const combined = {
  ...common, // Spreads common keys at root level
  users, // Nested under 'users' key
};

export default combined;
```

## Module Structure

Each module follows a consistent nested structure:

```json
{
  "title": "Module Title",
  "subtitle": "Module description",
  "columns": {
    "columnName": "Column Label"
  },
  "form": {
    "fieldName": "Field Label",
    "enterFieldName": "Placeholder text"
  },
  "modal": {
    "add": "Add Item",
    "edit": "Edit Item",
    "create": "Create New Item"
  },
  "filter": {
    "apply": "Apply Filters",
    "clear": "Clear Filters"
  },
  "view": {
    "sectionName": "Section Title"
  },
  "messages": {
    "success": "Success message",
    "error": "Error message"
  }
}
```

## Usage Examples

### Basic Usage

```typescript
import { useTranslation } from "react-i18next";

const MyComponent = () => {
  const { t } = useTranslation();

  return (
    <div>
      <h1>{t("users.title")}</h1>
      <p>{t("users.subtitle")}</p>
    </div>
  );
};
```

### Using Nested Translations

```typescript
// Common translations (root level)
<Button>{t('save')}</Button>
<Button>{t('cancel')}</Button>
<Badge>{t('active')}</Badge>

// Module-specific translations
<Label>{t('users.columns.userName')}</Label>
<Input placeholder={t('users.form.enterFirstName')} />
<BaseModal title={t('users.modal.create')}>
<Button>{t('users.filter.apply')}</Button>

// Messages
toast.success(t('users.messages.userCreated'));
toast.error(t('users.messages.failedToCreate'));
```

## Adding New Modules

### Step 1: Create Module Files

Create translation files for each language:

**English:** `src/i18n/locales/en/[module]/index.json`

```json
{
  "title": "Module Title",
  "columns": {},
  "form": {},
  "modal": {},
  "filter": {},
  "view": {},
  "messages": {}
}
```

**Bengali:** `src/i18n/locales/bn/[module]/index.json`

```json
{
  "title": "মডিউল শিরোনাম",
  "columns": {},
  "form": {},
  "modal": {},
  "filter": {},
  "view": {},
  "messages": {}
}
```

### Step 2: Update index.js Files

**Update:** `src/i18n/locales/en/index.js`

```javascript
import common from "./common.json";
import users from "./users/index.json";
import products from "./products/index.json"; // Add new module

const combined = {
  ...common,
  users,
  products, // Add to export
};

export default combined;
```

**Update:** `src/i18n/locales/bn/index.js`

```javascript
import common from "./common.json";
import users from "./users/index.json";
import products from "./products/index.json"; // Add new module

const combined = {
  ...common,
  users,
  products, // Add to export
};

export default combined;
```

### Step 3: Use in Components

```typescript
const ProductsPage = () => {
  const { t } = useTranslation();

  return (
    <div>
      <h1>{t("products.title")}</h1>
      <Label>{t("products.form.productName")}</Label>
    </div>
  );
};
```

## Benefits

✅ **Organized**: Clear separation by language and module
✅ **Modular**: Each feature module has its own translation file
✅ **Scalable**: Easy to add new modules or languages
✅ **Maintainable**: Easy to find and update specific translations
✅ **Clean**: Common translations at root, modules nested
✅ **Flexible**: Can add nested structures within modules

## Translation Key Patterns

### Common Translations (Root Level)

```typescript
t("search"); // "Search..."
t("filter"); // "Filter"
t("save"); // "Save"
t("cancel"); // "Cancel"
t("active"); // "Active"
t("inactive"); // "Inactive"
```

### Module Translations (Nested)

```typescript
t("users.title"); // "User Management"
t("users.columns.userName"); // "User Name"
t("users.form.firstName"); // "First Name"
t("users.form.enterFirstName"); // "Enter first name"
t("users.modal.create"); // "Create New Staff User"
t("users.filter.byStatus"); // "Filter by Status"
t("users.view.personalInformation"); // "Personal Information"
t("users.messages.userCreated"); // "User created successfully"
```

## Best Practices

1. **Keep it organized**: Use nested objects (columns, form, modal, filter, view, messages)
2. **Be specific**: Use descriptive keys like `users.form.enterFirstName`
3. **Group related items**: Keep similar translations together
4. **Reuse common**: Use root-level keys for shared translations
5. **Consistent naming**: Follow same structure across all modules
6. **Document changes**: Update this README when adding new modules
7. **Sync translations**: Ensure all languages have matching keys
