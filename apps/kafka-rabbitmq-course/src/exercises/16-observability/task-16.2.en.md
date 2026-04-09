# Task 16.2: Distributed Tracing

## Goal

Implement a **distributed tracing** visualizer — a waterfall diagram showing the full path of a request across multiple services connected via Kafka. The task demonstrates how trace ID is passed through the broker and how spans can identify bottlenecks in the system.

## Requirements

1. Declare a `TraceSpan` interface with fields: `id: string`, `parentId: string | null`, `service: string`, `operation: string`, `startMs: number`, `durationMs: number`, `status: 'ok' | 'error' | 'slow'`, `tags: Record<string, string>`.
2. Declare a `TraceScenario` interface with fields: `id: string`, `name: string`, `traceId: string`, `spans: TraceSpan[]`.
3. Declare a `SCENARIOS` array with three scenarios:
   - **success** (`traceId: 'abc123def456'`) — 7 spans, all `status: 'ok'`, path through Service A → Kafka → Service B → Kafka → Service C.
   - **slow** (`traceId: 'ff9900aa1122'`) — 7 spans, span `kafka.consume ← orders` in Service B has `status: 'slow'` and `durationMs: 3600`, Service A root span marked `status: 'slow'`.
   - **error** (`traceId: '1234error5678'`) — 4 spans, `processOrder` in Service B has `status: 'error'`, tag `error.message` contains error description.
4. Declare constants `SERVICE_COLORS` (color for each service) and `SPAN_STATUS_COLORS` for `ok / slow / error`.
5. Declare states: `selectedScenario: TraceScenario` (initial: `SCENARIOS[0]`) and `selectedSpan: TraceSpan | null` (initial: `null`).
6. Compute `totalMs` — the maximum value of `startMs + durationMs` among all spans of the selected scenario.
7. Render three scenario selection buttons. On scenario change, reset `selectedSpan` to `null`.
8. Render a Trace Info row: Trace ID, Duration, number of Spans, root span status.
9. Implement a waterfall diagram as a table:
   - Columns: "Operation" (200px) and "Time (0 — {totalMs}ms)".
   - Each row: left — colored service dot, service name and operation; right — positioned bar `left: startPct%`, `width: widthPct%` (minimum 0.5%) with status color.
   - Kafka operations (containing `kafka` in the operation name) displayed with a more saturated bar background (`${statusColor}50`), others — `${statusColor}20`.
   - Inside the bar — text with duration in milliseconds.
   - Click on a row selects the span; click on the already selected one deselects. Selected row is highlighted.
10. When a span is selected, display details below the diagram: Service + Operation, Start, Duration, Status, all tags as `key=value` badges.
11. Display a hint below the diagram explaining that trace ID is passed through Kafka.

## Checklist

- [ ] `TraceSpan` and `TraceScenario` interfaces declared with correct fields
- [ ] `SCENARIOS` array contains three scenarios: `success`, `slow`, `error`
- [ ] `slow` scenario — Service B has `durationMs: 3600` on `kafka.consume`
- [ ] `error` scenario — `processOrder` contains `error.message` tag with error description
- [ ] `SERVICE_COLORS` and `SPAN_STATUS_COLORS` constants declared
- [ ] Scenario selection buttons work, scenario change resets selected span
- [ ] Trace Info row shows traceId, totalMs, span count, status
- [ ] `totalMs` computed as max of `startMs + durationMs`
- [ ] Waterfall diagram: bars positioned by `startMs / totalMs`
- [ ] Kafka operations visually distinct from regular ones (more saturated background)
- [ ] Click on row — span selected, click again — deselected
- [ ] Span details show all tags as `key=value` badges
- [ ] Detail block border color matches the service color (`SERVICE_COLORS`)

## How to test yourself

1. Open the task — "Successful path" scenario selected by default. Diagram shows 7 spans, all green, total duration 245ms.
2. Click on any span — a block with tags appears below the diagram. For Kafka-spans, tags `messaging.system`, `messaging.destination`, `messaging.operation` should be visible. Click again — block disappears.
3. Switch to "Slow consumer" — the `kafka.consume ← orders` span in Service B should be orange and take most of the timeline (~93% width). Total trace duration — 3850ms.
4. Switch to "Error in Service B" — `processOrder` is highlighted in red, Trace Info shows status `ERROR`. Diagram contains only 4 spans (Service C didn't receive the event).
5. Verify that when switching scenarios, the details block is hidden (selected span reset).
