# Table Component Architecture

## Component Hierarchy

```
┌─────────────────────────────────────────────────────────┐
│                    BaseTableList.tsx                     │
│  ┌────────────────────────────────────────────────────┐ │
│  │ Card Header                                        │ │
│  │  - Title & Description                             │ │
│  │  - Header Action Buttons (Create, Export, etc.)   │ │
│  └────────────────────────────────────────────────────┘ │
│  ┌────────────────────────────────────────────────────┐ │
│  │ Toolbar                                            │ │
│  │  - Search Input                                    │ │
│  │  - Filter Dropdowns                                │ │
│  │  - Custom Actions                                  │ │
│  └────────────────────────────────────────────────────┘ │
│  ┌────────────────────────────────────────────────────┐ │
│  │              BaseTable.tsx                         │ │
│  │  ┌──────────────────────────────────────────────┐ │ │
│  │  │ Table Header                                 │ │ │
│  │  │  - Column Labels                             │ │ │
│  │  └──────────────────────────────────────────────┘ │ │
│  │  ┌──────────────────────────────────────────────┐ │ │
│  │  │ Table Body                                   │ │ │
│  │  │  - Data Rows (if data exists)                │ │ │
│  │  │  - TableSkeleton (if loading)                │ │ │
│  │  │  - Empty State (if no data)                  │ │ │
│  │  └──────────────────────────────────────────────┘ │ │
│  └────────────────────────────────────────────────────┘ │
│  ┌────────────────────────────────────────────────────┐ │
│  │ Pagination (optional)                              │ │
│  │  - Page controls                                   │ │
│  │  - Item count                                      │ │
│  └────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────┘
```

## Data Flow

```
┌──────────────────┐
│   Your Page      │
│  (Delivery.tsx)  │
└────────┬─────────┘
         │
         │ Props:
         │ - data[]
         │ - columns[]
         │ - handlers
         │ - search/filter state
         │
         ▼
┌──────────────────┐
│  BaseTableList   │◄─────── Provides: UI structure,
└────────┬─────────┘         search, filters, actions
         │
         │ Props:
         │ - columns[]
         │ - data[]
         │ - getRowKey()
         │
         ▼
┌──────────────────┐
│    BaseTable     │◄─────── Provides: Table rendering,
└────────┬─────────┘         loading states, empty states
         │
         │ Renders:
         │ - Headers
         │ - Rows
         │ - Cells
         │
         ▼
┌──────────────────┐
│  shadcn/ui       │
│  Table Components│
└──────────────────┘
```

## File Structure

```
src/components/table/
├── BaseTable.tsx          # Core table rendering logic
├── BaseTableList.tsx      # Enhanced table with toolbar
├── TableSkelaton.tsx      # Loading skeleton
├── Pagination.tsx         # Pagination controls
├── index.ts               # Exports all components
├── ExampleUsage.tsx       # Reference implementation
├── README.md              # Full documentation
└── QUICK_START.md         # Quick reference guide
```

## Usage Pattern

```
Page Component (Delivery.tsx)
├── Manages state (data, search, filters)
├── Defines columns with render functions
├── Handles CRUD operations
└── Renders BaseTableList
    ├── Displays Card with title/description
    ├── Renders search input
    ├── Renders filter dropdowns
    ├── Renders header action buttons
    └── Renders BaseTable
        ├── Shows loading skeleton (if loading)
        ├── Shows empty message (if no data)
        └── Shows table rows (if data exists)
```

## Component Responsibilities

### BaseTable

- ✅ Render table structure (header, body, cells)
- ✅ Handle loading state with skeletons
- ✅ Handle empty state with message
- ✅ Apply custom row/column classes
- ✅ Support custom cell rendering

### BaseTableList

- ✅ Wrap table in Card component
- ✅ Provide search input
- ✅ Provide filter dropdowns
- ✅ Provide header action buttons
- ✅ Provide pagination controls (optional)
- ✅ Coordinate between toolbar and table

### Your Page

- ✅ Fetch and manage data
- ✅ Define column configuration
- ✅ Handle search/filter logic
- ✅ Handle CRUD operations
- ✅ Manage dialogs and modals
- ✅ Handle form submissions

## Props Flow Diagram

```
┌─────────────────────────────────────────────────┐
│              Your Page Component                │
│                                                 │
│  const columns = [...]                          │
│  const [data, setData] = useState([])           │
│  const [search, setSearch] = useState('')       │
│  const [filter, setFilter] = useState('all')    │
│                                                 │
└───────────────────┬─────────────────────────────┘
                    │
                    │ Passes Props ▼
                    │
┌───────────────────▼─────────────────────────────┐
│            BaseTableList Component              │
│                                                 │
│  - title, description                           │
│  - headerActions [{label, icon, onClick}]       │
│  - searchValue, onSearchChange                  │
│  - filters [{value, options, onChange}]         │
│  - columns, data, getRowKey                     │
│                                                 │
└───────────────────┬─────────────────────────────┘
                    │
                    │ Passes Table Props ▼
                    │
┌───────────────────▼─────────────────────────────┐
│              BaseTable Component                │
│                                                 │
│  - columns                                      │
│  - data                                         │
│  - isLoading                                    │
│  - emptyMessage                                 │
│  - getRowKey                                    │
│  - rowClassName                                 │
│                                                 │
└─────────────────────────────────────────────────┘
```

## State Management

```
┌─────────────────────────────────────┐
│  Component State (Page Level)       │
├─────────────────────────────────────┤
│  - data: T[]                        │
│  - searchQuery: string              │
│  - filterValues: Record<string,any> │
│  - isLoading: boolean               │
│  - currentPage: number              │
│  - dialogs: boolean flags           │
│  - formData: Form state             │
└─────────────────────────────────────┘
         │
         │ Derives ▼
         │
┌─────────────────────────────────────┐
│  Computed/Filtered Data             │
├─────────────────────────────────────┤
│  filteredData = data                │
│    .filter(searchPredicate)         │
│    .filter(filterPredicate)         │
└─────────────────────────────────────┘
         │
         │ Passes to ▼
         │
┌─────────────────────────────────────┐
│  BaseTableList                      │
│  (Receives filtered data as prop)   │
└─────────────────────────────────────┘
```

## Key Concepts

1. **Separation of Concerns**

   - BaseTable: Pure table rendering
   - BaseTableList: UI enhancements (search, filters, actions)
   - Page Component: Business logic and state management

2. **Type Safety**

   - All components use TypeScript generics
   - Column definitions are type-safe
   - Render functions have correct types

3. **Composition**

   - Small, focused components
   - Easy to customize and extend
   - Reusable across different pages

4. **Flexibility**
   - All props are optional except essentials
   - Custom rendering via render functions
   - Extensible with toolbarActions and custom elements
