# Task 11.1: Basic ErrorBoundary

## Goal

Implement a universal `ErrorBoundary` as a class component with a typed render prop `fallback` accepting `{ error, resetErrorBoundary }`. Wrap several independent dashboard sections.

## Requirements

1. Create `FallbackProps` interface with fields `error: Error` and `resetErrorBoundary: () => void`
2. Create `ErrorBoundaryProps` interface with fields `fallback: (props: FallbackProps) => React.ReactNode` and `children: React.ReactNode`
3. Implement `ErrorBoundary` as a class component with methods:
   - `static getDerivedStateFromError(error)` — updates state on error
   - `componentDidCatch(error, info)` — logs error to console.error
   - `reset` — method to reset state back to `{ hasError: false, error: null }`
4. In `render`, call `this.props.fallback(...)` if `hasError === true`, otherwise render `children`
5. Create `DashboardSection` component — accepts `title: string` and `children`
6. Create three section components: `StatsWidget`, `ChartWidget`, `ActivityWidget`
7. Each widget should have a "Break" button (on click throws `new Error(...)`)
8. Wrap each widget in a separate `ErrorBoundary` with fallback showing error message and "Restore" button

## Hints

- `getDerivedStateFromError` is a static method, written as `static getDerivedStateFromError`
- Throwing error in event handler: `onClick={() => { throw new Error('...') }}` — attention, this will **not** be caught by boundary (onClick is not render). Instead, save error in component state: `setError(new Error(...))`, then `if (error) throw error`
- Fallback receives `error.message` — display it to the user
- To reset widget after `resetErrorBoundary`, a `key` on ErrorBoundary may be needed

## Checklist

- [ ] `ErrorBoundary` — class component with correct lifecycle methods
- [ ] `FallbackProps` and `ErrorBoundaryProps` — typed
- [ ] `fallback` — render prop, receives `error` and `resetErrorBoundary`
- [ ] Three widgets with "Break" button
- [ ] Each widget wrapped in a separate `ErrorBoundary`
- [ ] When one widget crashes, others continue working
- [ ] "Restore" button returns widget to working state

## How to check yourself

1. Click "Break" in StatsWidget — a stub should appear only for it
2. ChartWidget and ActivityWidget work fine
3. Click "Restore" — StatsWidget shows content again
4. Click "Break" in two widgets simultaneously — the third continues working
