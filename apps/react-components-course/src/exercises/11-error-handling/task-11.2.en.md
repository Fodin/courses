# Task 11.2: Granular boundaries with retry mechanism

## Goal

Build a page with four independent widgets, each wrapped in its own Error Boundary. Add a retry mechanism with attempt limits and counter.

## Requirements

1. Use `ErrorBoundary` from task 11.1 (or implement again)
2. Create four independent widgets: `WeatherWidget`, `NewsWidget`, `StockWidget`, `CalendarWidget`
3. Each widget has internal state: shows content or can be "broken" by a button
4. Create `RetryFallback` component — accepts `FallbackProps` and additionally `maxRetries: number`
   - Stores attempt counter in its own state
   - Shows: error message, counter "Attempt X of N", "Retry" button
   - When attempts exhausted: shows "Widget unavailable. Contact support." without button
5. Wrap each widget in `ErrorBoundary` with `RetryFallback` (maxRetries=3)
6. Add `key` mechanism: "Reload all" button resets all boundaries and all attempt counters
7. Place widgets in a 2×2 grid (via CSS grid or flexbox)

## Hints

- `RetryFallback` — functional component, `ErrorBoundary` — class component. Mixing is fine and expected
- To reset ErrorBoundary via external key: `<ErrorBoundary key={retryKey}>` — key change recreates the entire boundary
- Attempt counter in `RetryFallback` resets automatically on component recreation (key change)
- Simulate error via state: `const [broken, setBroken] = useState(false); if (broken) throw new Error(...)`

## Checklist

- [ ] Four widgets in a 2×2 grid
- [ ] Each widget has a "Break" button
- [ ] `RetryFallback` shows attempt counter
- [ ] After exhausting attempts, "Retry" button disappears
- [ ] "Reload all" button resets all widgets and counters
- [ ] One widget crash doesn't affect the other three

## How to check yourself

1. Break WeatherWidget — RetryFallback appears with "Attempt 0 of 3"
2. Click "Retry" three times — widget recovers (simulate success on retry)
3. Break a widget and click "Retry" — after 3 attempts the button disappears
4. Break two widgets, click "Reload all" — both recover
5. NewsWidget, StockWidget, CalendarWidget work independently
