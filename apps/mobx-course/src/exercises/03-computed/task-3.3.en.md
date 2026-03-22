# Task 3.3: Computed Caching

## Goal
Verify that computed values are cached and don't recalculate unnecessarily.

## Requirements

- [ ] Create `ProductFilterStore` with products array, category and rating filters
- [ ] Add computed `filteredAndSorted` with console logging
- [ ] Add computation counter `computeCount`
- [ ] Add "Force re-render" button — computed should NOT recalculate
- [ ] Verify: recalculation happens only when filters change
