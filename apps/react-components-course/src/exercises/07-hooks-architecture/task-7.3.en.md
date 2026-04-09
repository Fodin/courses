# Task 7.3: usePagination + useFilters + useSorting → useDataTable

## Goal

Implement three specialized hooks and compose them into `useDataTable`. The table component receives ready data and control functions — and focuses only on rendering.

## Requirements

1. Implement `usePagination(totalItems: number, pageSize: number)`:
   - Stores current page (starting from 1)
   - Computes `totalPages`, `offset` (for data slicing), `hasPrev` / `hasNext` flags
   - Returns functions `goTo(page)`, `next()`, `prev()`
   - When `totalItems` changes, resets to page 1 if current page is out of bounds

2. Implement `useSorting<T>()`:
   - Stores `field: keyof T | null` and `direction: 'asc' | 'desc'`
   - `toggleSort(field)`: if field already selected — changes direction; otherwise sets field with `'asc'`
   - Returns `sort(items: T[]): T[]` function for sorting arrays

3. Implement `useFilters<F extends Record<string, unknown>>(initialFilters: F)`:
   - Stores current filter values
   - `setFilter(key, value)` — updates a single filter
   - `resetFilters()` — resets all filters to `initialFilters`
   - Returns `values: F` and control functions

4. Implement `useDataTable<T>(data: T[], options)`:
   - Accepts source data and options: `pageSize`, `filterFn`
   - Uses `useSorting`, `useFilters`, `usePagination` internally
   - Applies filtering → sorting → pagination in correct order
   - Returns: `pageData` (current page data), `pagination`, `sorting`, `filters`, `totalCount`

5. Implement demo component `EmployeeTable` with employee table:
   - Data: at least 15 employees with fields `id`, `name`, `department`, `salary`
   - Department filter (select)
   - Sorting by name and salary (click on column header)
   - Pagination with 5 records per page

## Hints

- Order of application matters: filter → sort → paginate. Pagination must count `totalItems` from the already filtered array
- For string sorting use `a.localeCompare(b)`, for numbers — regular subtraction
- `useMemo` for derived values (filtered, sorted) — prevents unnecessary computations
- When filters change, don't forget to reset pagination to page 1
- Sort icons: `↑` for asc, `↓` for desc, `↕` for inactive column

## Checklist

- [ ] `usePagination` correctly computes `totalPages` and `offset`
- [ ] `usePagination` resets to page 1 when `totalItems` changes
- [ ] `useSorting.toggleSort` toggles direction for current field
- [ ] `useSorting.sort` returns sorted array without mutation
- [ ] `useFilters.setFilter` updates one filter, leaves others untouched
- [ ] `useDataTable` applies filter → sort → paginate in correct order
- [ ] `totalCount` reflects count after filtering (before pagination)
- [ ] `EmployeeTable` component contains no filter/sort/paginate logic
- [ ] On filter change, table resets to first page

## How to check yourself

Open the table with 15+ employees. Select a department filter — the list shrinks, pagination recalculates. Click the "Salary" header — the list sorts ascending, click again — descending. Go to page two, then change the filter — should automatically return to page one.
