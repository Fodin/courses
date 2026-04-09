# Task 0.3: Dashboard decomposition by responsibilities

## Goal

Split the monolithic `Dashboard` into four components with clear zones of responsibility: `DashboardFilters` (filter management), `DashboardStats` (statistics cards), `SalesChart` (chart visualization via HTML/CSS), `DataTable` (data table).

## Requirements

1. Create a `DashboardFilters` interface with fields `period: 'day' | 'week' | 'month'` and `category: string`
2. Create a `FilterPanel` component that:
   - Accepts `filters` and `onChange`
   - Renders a select for period and a select for category
   - Has no state — only calls `onChange`
3. Create a `StatsCards` component that accepts a `stats: StatItem[]` array (name, value, change in %) and displays cards. Positive change — green, negative — red
4. Create a `SalesChart` component that accepts a `data: ChartPoint[]` array (label, value) and draws a simple bar chart via `div` with CSS height
5. Create a `DataTable` component that accepts `rows: TableRow[]` and displays a table with sorting by one column (local state: `sortField`, `sortDir`)
6. The `Task0_3` component — orchestrator: stores `filters` in state, passes them to child components, generates data based on filters

## Hints

- `FilterPanel` is a dumb component: only controlled inputs
- `StatsCards` and `SalesChart` are dumb components without state
- `DataTable` can have local UI-state for sorting — that's fine
- Data can be generated statically or via a simple `generateData(filters)` function
- Bar chart: height of `div` = `(value / maxValue) * 200px`

## Checklist

- [ ] `DashboardFilters`, `StatItem`, `ChartPoint`, `TableRow` interfaces defined
- [ ] `FilterPanel` is a controlled component without its own state
- [ ] `StatsCards` renders cards with change color indication
- [ ] `SalesChart` draws a bar chart via CSS heights
- [ ] `DataTable` supports column sorting
- [ ] Data updates when filters change
- [ ] `Task0_3` manages filter state and coordinates all components

## How to check yourself

1. Change the filter period — data in the table and chart should change
2. Click a table column header — rows should sort
3. Click again — reverse sort
4. Make sure changing the filter doesn't reset table sorting (states are independent)
