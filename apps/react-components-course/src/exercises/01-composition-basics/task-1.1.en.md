# Task 1.1 — Card with children and slots

## Goal

Create a reusable `Card` component that accepts `header`, `children`, and `footer` as slots, and demonstrate its flexibility with three different use cases.

## Requirements

1. Implement a `Card` component with props:
   - `children: React.ReactNode` — main content (required)
   - `header?: React.ReactNode` — card header (optional)
   - `footer?: React.ReactNode` — card footer (optional)
2. Header and footer should render **only if passed** — no empty containers
3. Implement three card variants using the same `Card` component:
   - **Profile card** — with avatar and name in `header`, biography in `children`, "Subscribe" button in `footer`
   - **Notification card** — only `children` (no header and footer), with icon and text
   - **Product card** — with name in `header`, description and price in `children`, two buttons ("Add to cart", "Buy") in `footer`
4. Each variant should look visually distinct (different data, different slot content)
5. Use inline styles — CSS modules are not needed

## Hints

- Slot type: `React.ReactNode` — accepts JSX, strings, numbers, `null`
- Slot check: `{header && <div className="card-header">{header}</div>}`
- You can extract card styles into a constant object and reuse
- Three cards should be rendered side by side for visual comparison

## Checklist

- [ ] `Card` component accepts `children`, `header`, `footer`
- [ ] `header` and `footer` slots are optional and don't render empty containers
- [ ] Profile card uses all three slots
- [ ] Notification card uses only `children`
- [ ] Product card uses all three slots with different content
- [ ] Component contains no hardcoded content — only structure

## How to check yourself

Remove the `footer` from the notification card and make sure no empty `<div>` appears in the DOM. Then add complex JSX instead of a string to the profile card `header` — the component should accept it without changes.
