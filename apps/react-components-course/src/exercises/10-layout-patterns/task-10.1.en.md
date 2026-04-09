# Task 10.1: Layout components with navigation

## Goal

Implement three layout components — `RootLayout`, `SidebarLayout`, `CenteredLayout` — and demonstrate their joint operation through simulated navigation using buttons/tabs.

## Requirements

1. `RootLayout` — root layout:
   - Displays a header (Header) with app title and navigation buttons
   - Accepts `children: ReactNode`
   - Header is fixed at top (or static, but always visible)

2. `SidebarLayout` — two-column layout:
   - Accepts `sidebar: ReactNode` and `children: ReactNode`
   - Accepts optional `sidebarWidth?: number` (default: 220)
   - Sidebar displayed on the left, main content on the right
   - Implemented via flexbox

3. `CenteredLayout` — centering layout:
   - Accepts `children: ReactNode`
   - Accepts `maxWidth?: number` (default: 720)
   - Centers content horizontally with padding

4. Navigation via buttons (simulates React Router):
   - Three "pages": Dashboard, Profile, Settings
   - Dashboard uses `SidebarLayout` with side menu
   - Profile and Settings use `CenteredLayout`
   - `RootLayout` wraps everything

5. Layout components contain no business logic — only structure

## Hints

- Use `useState` to store current "page"
- `SidebarLayout`: `display: flex`, `aside` of fixed width, `main` with `flex: 1` and `minWidth: 0`
- `CenteredLayout`: `margin: '0 auto'`, `maxWidth`, `padding` on sides
- Navigation buttons can be placed in the `RootLayout` header
- Each layout component — a separate function, not inline JSX

## Checklist

- [ ] `RootLayout` accepts `children` and renders header + content
- [ ] `SidebarLayout` accepts `sidebar` + `children`, supports `sidebarWidth`
- [ ] `CenteredLayout` accepts `children`, supports `maxWidth`
- [ ] Navigation switches between three different "pages"
- [ ] Dashboard uses `SidebarLayout` with side menu
- [ ] Profile and Settings use `CenteredLayout`
- [ ] Layout components don't import or know about specific pages

## How to check yourself

Switch pages via buttons in the header. Dashboard should show two-column layout with sidebar. Profile and Settings — content centered. When changing `sidebarWidth` in `SidebarLayout`, column widths should change. Page content should not "know" about its positioning.
