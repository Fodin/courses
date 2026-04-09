# Task 3.1: `<Tabs>` Component with Compound Components

## Goal

Implement a tab switching component with a declarative API, using the Compound Components pattern based on React Context.

## Requirements

1. Create a `TabsContext` with fields `activeTab: string` and `setActiveTab: (id: string) => void`
2. Implement a `useTabsContext()` hook with a check for use outside Provider (throws an error with a clear message)
3. Implement `TabsRoot` — root component storing `activeTab` in `useState`, accepts `defaultTab: string` and `children`
4. Implement `Tabs.List` — wrapper for tab buttons (just `<div role="tablist">`)
5. Implement `Tabs.Tab` — tab button, accepts `id: string` and `children`; reads `activeTab` from context, adds `active` class when id matches, calls `setActiveTab` on click
6. Implement `Tabs.Panel` — content panel, accepts `id: string` and `children`; displayed only when `activeTab === id`
7. Assemble the final `Tabs` object via `Object.assign(TabsRoot, { List, Tab, Panel })`
8. Demonstrate usage in `Task3_1_Solution` component with three tabs and real content

## Hints

- Start with types: define interfaces `TabsContextValue`, `TabsProps`, `TabProps`, `PanelProps` before writing components
- `createContext<TabsContextValue | null>(null)` — initial value `null`, check in hook
- For active tab add aria attributes: `aria-selected={isActive}` on button and `role="tabpanel"` on panel
- `Object.assign` returns the first argument with added properties — TypeScript infers the type automatically

## Checklist

- [ ] `TabsContext` created with type `TabsContextValue | null`
- [ ] `useTabsContext()` throws error outside Provider
- [ ] `TabsRoot` stores `activeTab` in `useState(defaultTab)`
- [ ] `Tabs.List` renders `<div role="tablist">`
- [ ] `Tabs.Tab` applies `active` class and changes tab on click
- [ ] `Tabs.Panel` hides when `activeTab !== id`
- [ ] Final object assembled via `Object.assign`
- [ ] Demo has at least 3 tabs with different content

## How to check yourself

Open the component in the browser and verify:
- Clicking any tab shows its panel and hides the rest
- Active tab is visually highlighted
- React DevTools shows the tree: `Tabs > Tabs.List > Tabs.Tab`, `Tabs > Tabs.Panel`
- If you move `<Tabs.Tab>` outside `<Tabs>` — a clear error appears in the console
