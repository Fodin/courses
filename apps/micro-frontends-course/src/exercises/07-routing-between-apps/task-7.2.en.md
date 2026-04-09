# Task 7.2: Route Table Builder

## Goal

Create a visual router configuration builder for an MFE system: shell routes table, expandable sections with internal routes for each MFE, live preview in two formats (JSON and React Router JSX), intersection validation and configuration error checking.

## Requirements

1. **Shell Routes Table** — displays top-level routes as a table with columns: Path, MFE, Strategy, Exact. Add form: path field, mfe-name field, strategy select (lazy/eager), exact checkbox. Order control buttons (↑/↓) and delete for each row.

2. **MFE Internal Routes** — list of MFEs as expandable sections. Each section: header with MFE name and route count, delete MFE button, inside — internal routes list (relative path, component name, index badge). Add internal route form: MFE select, path field, component field, index checkbox. Add new MFE button (name field + button).

3. **Live Preview** with two tabs:
   - `router.config.json` — structure in JSON format with `shell.routes[]` and `mfes.{name}.routes[]` keys
   - `React Router JSX` — ready code `createBrowserRouter([...])` with `lazy()` imports for lazy strategy, `children[]` for internal routes, `Suspense` wrapper

4. **Validation** (runs automatically after every change):
   - Duplicate paths in shell routes
   - Wildcard (`*` or `/*`) not in last position
   - MFE without any internal routes
   - Internal route path starts with `/`
   - Duplicate paths within a single MFE

   Errors are shown as a red block above the builder. Validation status displayed in preview header (green/red).

5. Initial state: Shell with three routes (Home, /catalog/*, /cart/*) and two MFEs (catalog with 3 routes, cart with 2 routes).

## Checklist

- [ ] Shell routes table displays all fields and allows row deletion
- [ ] ↑/↓ buttons correctly change route order
- [ ] Adding new shell route via form works
- [ ] Expandable MFE sections show/hide internal routes
- [ ] Add internal route form adds route to correct MFE
- [ ] JSON preview updates in real time on any change
- [ ] JSX preview generates valid code with lazy() for lazy strategy
- [ ] On validation errors, red block with messages is shown
- [ ] "✓ Configuration valid" / "✕ N errors" status visible in preview header

## How to Check Yourself

1. Add shell route `/profile/*` with MFE `profile` and strategy `lazy`. Verify it appears in the table and JSON preview.
2. Try to add a shell route with an existing path — "Duplicate shell route" error should appear.
3. Add new MFE `profile` via form — section should appear without routes, showing error "MFE has no internal routes".
4. Add internal route without `/` at the start (e.g. `orders`) — error should appear.
5. Switch to "React Router JSX" tab — verify lazy MFEs have `lazy(() => import(...))` and `<Suspense>` wrapper.
