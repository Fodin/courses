# Task 9.1: Polymorphic Button with `as` prop

## Goal

Implement a `Button` component that can render as different HTML elements or React components via the `as` prop. TypeScript should automatically pull in the right props depending on the `as` value.

## Requirements

1. Component accepts `as` prop with default value `'button'`
2. With `as="button"`, all standard `<button>` attributes are available: `onClick`, `disabled`, `type`, etc.
3. With `as="a"`, all standard `<a>` attributes are available: `href`, `target`, `rel`, etc.
4. Component supports `variant` prop: `'primary' | 'secondary' | 'ghost'`
5. Component supports `size` prop: `'sm' | 'md' | 'lg'`
6. All native HTML attributes are forwarded via `...rest`
7. Demonstration: show Button as `button` with onClick, Button as `a` with href, and different variants/sizes

## Hints

- Use `React.ComponentPropsWithoutRef<C>` to get props of the needed element
- Pattern: `type ButtonProps<C extends React.ElementType = 'button'> = { as?: C; variant?:... } & Omit<React.ComponentPropsWithoutRef<C>, 'as'>`
- Inside component: `const Component = as ?? 'button'`
- To have TypeScript correctly infer the generic, declare the function via `function Button<C extends React.ElementType = 'button'>`
- `Omit<ComponentPropsWithoutRef<C>, keyof OwnProps>` — removes conflicts between your props and native ones

## Checklist

- [ ] `ButtonProps<C>` type accepts generic parameter `C extends React.ElementType`
- [ ] With `as="a"` TypeScript requires `href` and suggests `target`, `rel`
- [ ] With `as="button"` TypeScript suggests `onClick`, `disabled`, `type`
- [ ] `variant` prop affects visual style
- [ ] `size` prop affects size
- [ ] Native attributes forwarded via `...rest`
- [ ] Demo: three buttons of different variants + link-button with href

## How to check yourself

Open the assignment in the browser. You should see:
- `primary`, `secondary`, `ghost` buttons — different styles
- `sm`, `md`, `lg` buttons — different sizes
- Link-button (`as="a"`) with correct href
- When hovering the link-button in the browser status bar — see the URL

Open TypeScript: try passing `href` to a button with `as="button"` — should be a compile error.
