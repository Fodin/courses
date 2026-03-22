# Task 3.4: keepAlive & equals

## Goal
Use `comparer.structural` to prevent unnecessary re-renders.

## Requirements

- [ ] Create two stores with computed `viewport: {width, height}`
- [ ] First — regular computed (new object each time)
- [ ] Second — computed with `comparer.structural`
- [ ] Create two observer components with render logging
- [ ] Show the difference: setting same values won't re-render smart version
