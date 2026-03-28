# Task 1.3: ref Cleanup Function

## Objective

Create a component with a ref callback that returns a cleanup function (a new capability in React 19).

## Requirements

1. Create a component with a button to show/hide an `<input>`
2. Set a ref callback on the `<input>`:
   ```tsx
   ref={(node) => {
     // Setup: element appeared in the DOM
     node.focus()

     // Cleanup: element removed from the DOM
     return () => {
       console.log('Element removed!')
     }
   }}
   ```
3. When the input is shown — automatically focus it (in setup)
4. When the input is hidden — log the event (in cleanup)
5. Add a visual event log on the page

## Pattern

```tsx
// React 18 (old pattern)
ref={(node) => {
  if (node) { /* setup */ }
  else { /* cleanup (node === null) */ }
}}

// React 19 (new pattern)
ref={(node) => {
  /* setup */
  return () => { /* cleanup */ }
}}
```

## Checklist

- [ ] The ref callback returns a cleanup function
- [ ] The input receives focus on mount
- [ ] Cleanup runs on unmount
- [ ] The event log is displayed on the page
