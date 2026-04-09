# Task 5.3: ComposeProviders — getting rid of pyramid of doom

## Goal

Implement a `ComposeProviders` component that takes an array of providers and composes them in the correct order via `Array.reduceRight`. Compare code readability before and after.

## Requirements

1. Implement the `ProviderComponent` type:
   ```ts
   type ProviderComponent = React.ComponentType<{ children: React.ReactNode }>
   ```

2. Implement the `ComposeProviders` component:
   - Props: `{ providers: ProviderComponent[]; children: React.ReactNode }`
   - Uses `providers.reduceRight((acc, Provider) => <Provider>{acc}</Provider>, children)`
   - Result: first provider in the array is the outermost in the tree

3. Demonstrate via a "before" and "after" comparison:
   - "Pyramid of doom" section — 5 manually nested providers (UserProvider, ThemeProvider, LocaleProvider, NotificationsProvider, plus a custom CounterProvider)
   - "With ComposeProviders" section — same result via `<ComposeProviders providers={[...]}>`
   - Both variants render the same demo app `<MiniApp />`

4. `MiniApp` should:
   - Read data from all 5 providers (user, theme, locale, notifications, counter)
   - Show a widget for each context
   - Data change buttons should work

5. Add `CounterProvider` as the fifth example:
   - Type: `{ count: number; increment: () => void; decrement: () => void }`
   - Implement via `createStrictContext`

## Hints

- `reduceRight` — not `reduce`. First in array must be the outermost
- To verify correct order: put `console.log` in each provider on mount
- The `reduceRight` return type needs casting: `as React.ReactNode`

## Checklist

- [ ] `ProviderComponent` type defined correctly
- [ ] `ComposeProviders` uses `reduceRight`
- [ ] First provider in array is the outermost in the tree
- [ ] Both variants (pyramid and compose) render the same `MiniApp`
- [ ] `MiniApp` reads data from all 5 contexts
- [ ] `CounterProvider` implemented via `createStrictContext`
- [ ] No `any` in types

## How to check yourself

Open the assignment in the browser. You'll see two identical blocks — "Pyramid of doom" and "ComposeProviders". Both should show the same widgets with working buttons.

Change the order of providers in the `ComposeProviders` array — `MiniApp` should still work correctly (provider order shouldn't affect functionality for independent contexts).

Open React DevTools and compare the component tree for both variants — it should be identical.
