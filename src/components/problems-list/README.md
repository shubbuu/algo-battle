# ProblemsList Components

This directory contains the refactored ProblemsList components, split into smaller, more manageable pieces for better maintainability and reusability.

## Component Structure

### Main Components

- **`ProblemsList.tsx`** - Main orchestrator component that manages state and coordinates other components
- **`ProblemItem.tsx`** - Individual problem item component with solve status toggle functionality
- **`StatusIcon.tsx`** - Reusable status icon component for different problem states
- **`PaginationControls.tsx`** - Pagination controls with items per page selection
- **`ProblemSkeleton.tsx`** - Loading skeleton for hydration states

### Index File

- **`index.ts`** - Exports all components for easy importing

## Usage

```tsx
import ProblemsList from '@/components/problems-list/ProblemsList';

// The main component can be used exactly as before
<ProblemsList initialProblems={problems} />
```

## Benefits of Refactoring

1. **Separation of Concerns**: Each component has a single responsibility
2. **Reusability**: Components can be reused in other parts of the application
3. **Maintainability**: Easier to maintain and update individual components
4. **Testing**: Each component can be tested independently
5. **Performance**: Better memoization and optimization opportunities
6. **Code Organization**: Clearer file structure and easier navigation

## Component Details

### ProblemsList
- Manages overall state and pagination
- Handles client-side hydration
- Coordinates between child components

### ProblemItem
- Renders individual problem cards
- Handles solve status toggling
- Manages problem-specific styling and interactions

### StatusIcon
- Pure component for rendering status icons
- Memoized for performance
- Supports different problem states (submitted, attempted, not-attempted)

### PaginationControls
- Handles pagination logic
- Provides items per page selection
- Responsive pagination with smart page number display

### ProblemSkeleton
- Loading state component
- Used during hydration to prevent layout shifts
- Matches the structure of ProblemItem

## Performance Optimizations

- All components are memoized using `React.memo`
- Expensive computations are memoized with `useMemo`
- Event handlers are memoized with `useCallback`
- Proper dependency arrays for all hooks
