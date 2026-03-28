# Task 5.3: Suspense during navigation

## Objective

Use Suspense and transitions for smooth navigation between "pages".

## Requirements

1. Create several "pages" (lazy components or components with simulated delay)
2. Navigation is wrapped in `startTransition`
3. Suspense shows a fallback on first load
4. On subsequent navigation the old page stays visible (transition)

## Checklist

- [ ] Multiple pages with simulated loading
- [ ] Navigation via `startTransition`
- [ ] Suspense fallback for first load
- [ ] Smooth transition between pages

## How to verify

1. First load shows a spinner
2. Switching between pages — the old page stays visible while the new one loads
