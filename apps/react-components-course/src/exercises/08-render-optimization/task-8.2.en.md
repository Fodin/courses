# Task 8.2: "State down, children up" pattern — without a single memo

## Goal

Master structural render optimizations: learn to move state and components so that unnecessary renders disappear without using `React.memo`.

## Context

You have a theme settings component: a color picker that updates the page background. Next to it — a heavy `HeavyPreview` component (simulates slow render via render counter). Currently `HeavyPreview` re-renders on every color change, even though it doesn't use the color for display.

The task is to fix this **without `React.memo`**, using only structural changes.

## Requirements

1. Add render counters to `HeavyPreview` and the picker component — to see the problem
2. Part 1 — **State down**: if the color picker and its state can be extracted into a separate component, do it. `HeavyPreview` moves to the parent and stops being a descendant of the stateful component
3. Part 2 — **Children up**: alternative approach — let the stateful component accept `children`. Then `HeavyPreview` is created outside and doesn't get recreated on state change
4. Implement **both** approaches — show them side by side with explanations
5. Make sure `HeavyPreview` doesn't re-render on color change — only when its own props change

## Hints

- **State down**: extract `useState(color)` and `input[type=color]` into a separate `ColorPicker` component. `HeavyPreview` stays in `Page` — next to, but no longer a descendant of `ColorPicker`
- **Children up**: create a `ColorWrapper({ children })` component — it stores state and renders `{children}`. Outside: `<ColorWrapper><HeavyPreview /></ColorWrapper>`. `HeavyPreview` is created in `Page`, not in `ColorWrapper` — so it doesn't depend on its state
- Key understanding: React doesn't recreate a JSX element if it's passed as `children` from outside
- `HeavyPreview` can accept any stable props for demonstration

## Checklist

```
[ ] Render counters added and visible in UI
[ ] "State down" variant implemented: ColorPicker as separate component
[ ] In "State down" variant, HeavyPreview does NOT re-render on color change
[ ] "Children up" variant implemented: ColorWrapper accepts children
[ ] In "Children up" variant, HeavyPreview does NOT re-render on color change
[ ] Both variants shown side by side with labels
[ ] React.memo NOT used in either variant
```

## How to check yourself

Open the component and change the color via the picker. The color picker render counter should grow. The `HeavyPreview` counter — should remain unchanged in both variants.
