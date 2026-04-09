# Task 4.4: Refactoring withWindowSize → useWindowSize

## Goal

Refactor the `withWindowSize` HOC into a `useWindowSize` hook. Compare both approaches in one component and formulate when each is appropriate.

## Requirements

1. Given a ready-made HOC `withWindowSize<P>`:
   - Adds props `windowWidth: number` and `windowHeight: number`
   - Listens to `resize` event via `useEffect`
   - Removes listener on unmount
2. Use `withWindowSize` for a `ResponsiveLayoutHOC` component — it changes layout depending on width
3. Implement the `useWindowSize()` hook:
   - Returns `{ width: number, height: number }`
   - Same logic with `resize`, but without HOC wrapper
4. Implement a `ResponsiveLayoutHook` component that uses `useWindowSize()` directly — functionally identical to `ResponsiveLayoutHOC`
5. Display both variants side by side and add a comparison block with conclusions:
   - Lines of code
   - Testing convenience
   - Transparency in DevTools
   - Logic reuse
6. Add current `width × height` display in both variants — they should match

## Hints

- HOC for `withWindowSize` uses `useEffect` and `useState` inside the returned component — that's fine
- Hook `useWindowSize` — just extracted `useState` + `useEffect` from the HOC
- Component breakpoints: `< 640px` — mobile, `640-1024px` — tablet, `> 1024px` — desktop
- SSR compatibility: on initialization use `typeof window !== 'undefined' ? window.innerWidth : 0`

## Checklist

- [ ] HOC `withWindowSize` is typed and works
- [ ] `ResponsiveLayoutHOC` changes UI depending on width
- [ ] Hook `useWindowSize` implemented with same logic
- [ ] `ResponsiveLayoutHook` is functionally identical to HOC version
- [ ] Both components show same window size
- [ ] Comparison block of approaches is present
- [ ] Cleanup (listener removal) implemented in both variants

## How to check yourself

Resize the browser window — both components should:
1. Update displayed `width × height` synchronously
2. Switch layout when crossing breakpoint 640px / 1024px

Open React DevTools: in the HOC version you'll see an extra layer `withWindowSize(ResponsiveLayoutHOC)`, in the hook version — directly `ResponsiveLayoutHook` without wrappers.
