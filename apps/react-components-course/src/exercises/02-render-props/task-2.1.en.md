# Task 2.1: MouseTracker with render prop

## Goal

Implement a `MouseTracker` component that tracks the cursor position within its area and passes coordinates via render prop. Based on `MouseTracker`, create a tooltip-follower and coordinate display.

---

## Requirements

1. The `MouseTracker` component accepts a prop `render: (pos: { x: number; y: number }) => ReactNode`
2. The component tracks mouse movement via `onMouseMove` within its container block
3. The container has explicit dimensions (e.g., `height: 300px`) and style `position: 'relative'`
4. Coordinates `x` and `y` are the mouse position relative to the window (`clientX`, `clientY`), or relative to the container (your choice, but document it)
5. Implement two uses of `MouseTracker`:
   - **Coordinate display**: shows text `x: ..., y: ...` inside the area
   - **Tooltip-follower**: a circle/element that follows the cursor (via `position: absolute`)

---

## Hints

- `onMouseMove` receives `React.MouseEvent<HTMLDivElement>` — from it we get `clientX`, `clientY`
- For following the cursor use `position: 'absolute'`, `left: x`, `top: y` with `transform: 'translate(-50%, -50%)'` to center the element
- Type for render prop: `render: (pos: { x: number; y: number }) => ReactNode`
- Don't forget to add `cursor: 'none'` to the container if the tooltip replaces the system cursor

---

## Checklist

- [ ] `MouseTracker` component is declared with typed render prop
- [ ] `onMouseMove` correctly updates state via `useState`
- [ ] First example: coordinates displayed as text inside the area
- [ ] Second example: element follows cursor via `position: absolute`
- [ ] Tracking area is visually highlighted (border, background)

---

## How to check yourself

Open the component in the browser. Move the mouse over the tracking area:
- Coordinate numbers should update in real time
- Tooltip element should smoothly follow the cursor without lag
- If you move the mouse outside the area — position should not update (events don't arrive)
