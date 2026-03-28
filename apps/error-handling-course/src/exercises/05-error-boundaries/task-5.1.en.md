# Task 5.1: Basic Error Boundary

## Goal
Create a class component Error Boundary to intercept render errors.

## Requirements
1. Create class `BasicErrorBoundary extends Component`
2. Implement `getDerivedStateFromError` to update state
3. Implement `componentDidCatch` to log to console
4. Display a message with `error.message` when an error occurs
5. Create `BuggyCounter` — a component that crashes when count === 3
6. Wrap `BuggyCounter` in `BasicErrorBoundary`

## Checklist
- [ ] Error Boundary class created
- [ ] `getDerivedStateFromError` implemented
- [ ] `componentDidCatch` logs the error
- [ ] Fallback displayed when error occurs
- [ ] `BuggyCounter` crashes at 3 and is caught by boundary
