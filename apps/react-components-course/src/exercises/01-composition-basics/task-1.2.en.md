# Task 1.2 — PageLayout with four slots

## Goal

Create a `PageLayout` component that accepts four slots (`header`, `sidebar`, `children`, `footer`) and demonstrate building a full dashboard interface through composition.

## Requirements

1. Implement a `PageLayout` component with props:
   - `header: React.ReactNode` — top navigation bar (required)
   - `sidebar?: React.ReactNode` — left sidebar (optional)
   - `children: React.ReactNode` — main page content (required)
   - `footer?: React.ReactNode` — bottom footer (optional)
2. If `sidebar` is not passed — main content takes full width
3. If `footer` is not passed — the bottom block doesn't render
4. Implement a `DashboardPage` component that uses `PageLayout` and fills the slots:
   - `header`: navigation bar with app name and user icon
   - `sidebar`: navigation menu with 4-5 items (Home, Analytics, Users, Settings)
   - `children`: grid of at least three stat cards (use Card from task 1.1 or a simplified version)
   - `footer`: copyright line
5. All blocks are visually separated (background colors, padding, borders)
6. Use flexbox via inline styles

## Hints

- Use `display: flex` for horizontal sidebar + content separation
- Sidebar has fixed width, content takes `flex: 1`
- Header and Footer — full width, `position: static` (not sticky)
- For card grid, `display: grid, gridTemplateColumns: 'repeat(3, 1fr)'` works well
- Minimum layout height: `minHeight: '100vh'` with `flexDirection: 'column'`

## Checklist

- [ ] `PageLayout` accepts `header`, `sidebar?`, `children`, `footer?`
- [ ] Without `sidebar` — content takes full width
- [ ] Without `footer` — bottom block doesn't render
- [ ] `DashboardPage` fills all four slots
- [ ] Header is rendered full width
- [ ] Sidebar and Content are laid out horizontally side by side
- [ ] Footer is rendered full width at the bottom
- [ ] Stat cards in content area are visually styled

## How to check yourself

Remove `sidebar` from `DashboardPage` — content should automatically expand to full width. Remove `footer` — the bottom bar should disappear. Replace `header` content with different JSX — `PageLayout` should accept it without changes to the component itself.
