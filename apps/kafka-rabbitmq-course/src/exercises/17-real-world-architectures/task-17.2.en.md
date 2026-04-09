# Task 17.2: Centralized Logging

## Goal

Implement an interactive simulation of a centralized logging pipeline based on the ELK + Kafka stack. Multiple microservices write logs to separate Kafka topics, Logstash reads them and sends to Elasticsearch. The user sees a log stream in a Kibana-style interface with filtering by level, service, and message text.

## Requirements

1. Declare a `LogEntry` interface with fields: `id: number`, `service: string`, `level: 'INFO' | 'WARN' | 'ERROR'`, `message: string`, `topic: string`, `partition: number`, `timestamp: string`.
2. Declare a constant array `SERVICES_LOG` of 5 services: `'api-gateway'`, `'order-service'`, `'payment-service'`, `'inventory-service'`, `'notification-service'`.
3. Declare a `SERVICE_COLORS` dictionary — each service gets its own color.
4. Declare a `LOG_TEMPLATES` array of 12 templates with fields `service`, `level`, `message`. Templates should include realistic messages: HTTP requests, order creation, payment errors, low stock warnings, etc.
5. Declare a `LEVEL_COLORS` dictionary (INFO → green, WARN → yellow, ERROR → red).
6. Implement a helper function `getPartition(service): number` — returns partition via `indexOf(service) % 3`.
7. Implement a `genTimestamp(): string` function — returns current time in `HH:MM:SS.mmm` format (12 characters from ISO string).
8. Declare component states: `logs: LogEntry[]`, `streaming: boolean`, `searchTerm: string`, `filterLevel: 'ALL' | 'INFO' | 'WARN' | 'ERROR'`, `filterService: string`, `totalConsumed: number`, `counterRef` and `timerRef` via `useRef`.
9. Implement `startStreaming`: starts a `setInterval` at 700ms. On each tick, takes a template from `LOG_TEMPLATES` in rotation (via `counterRef`), creates a `LogEntry` with topic `logs.{service}` and partition via `getPartition`, adds entry to the beginning of `logs` (max 60), increases `totalConsumed`.
10. Implement `stopStreaming`: stops the interval, sets `streaming: false`.
11. Implement `clearLogs`: calls `stopStreaming`, resets `logs`, `totalConsumed`, and `counterRef.current`.
12. Add a `useEffect` to clear the interval on unmount.
13. Implement filtering `filteredLogs` by `filterLevel`, `filterService`, and `searchTerm` (case-insensitive search in `message`).
14. Compute `topicCounts: Record<string, number>` — count of entries in each topic.
15. Compute `levelCounts: { INFO: number; WARN: number; ERROR: number }`.
16. Render a pipeline visualization: colored service badges → Kafka (logs.*) → Logstash → Elasticsearch → Kibana UI.
17. When logs exist, display a Kafka topics block with message count and partition number for each topic.
18. Display level statistics (INFO / WARN / ERROR / Total in Elasticsearch) in colored badges.
19. Render a Kibana-style filter panel (dark background): text search, level selector, service selector.
20. Render the log stream in a dark terminal block. The first line is highlighted with a darker background. Each line: timestamp → level (colored) → [service] (colored) → message text. When filter yields no results, show a placeholder message.
21. Add "Start Log Stream" / "Stop Log Stream" (toggle) and "Clear" buttons.

## Checklist

- [ ] `LogEntry` interface declared with 7 fields
- [ ] `SERVICES_LOG` array contains exactly 5 services
- [ ] `SERVICE_COLORS` dictionary set for all 5 services
- [ ] `LOG_TEMPLATES` array contains 12 templates with realistic messages
- [ ] `LEVEL_COLORS` set for INFO, WARN, ERROR
- [ ] `getPartition` returns `indexOf % 3`
- [ ] `genTimestamp` returns `HH:MM:SS.mmm` format string
- [ ] States `logs`, `streaming`, `searchTerm`, `filterLevel`, `filterService`, `totalConsumed` declared
- [ ] `counterRef` and `timerRef` declared via `useRef`
- [ ] `startStreaming` starts 700ms interval, creates `LogEntry` with topic and partition
- [ ] New logs added to the beginning of the array, max 60 entries kept
- [ ] `stopStreaming` correctly stops the `setInterval`
- [ ] `clearLogs` resets logs, counter, and `counterRef.current = 0`
- [ ] `useEffect` clears interval on component unmount
- [ ] `filteredLogs` filtered by all three criteria simultaneously
- [ ] `topicCounts` counted from current `logs`
- [ ] `levelCounts` counted from current `logs`
- [ ] Pipeline (services → Kafka → Logstash → Elasticsearch → Kibana) rendered
- [ ] Kafka topics block appears only when logs exist
- [ ] Statistics block shows current INFO / WARN / ERROR / total counters
- [ ] Filter panel styled in dark tones
- [ ] Log stream is dark, first line highlighted, level colors correct
- [ ] Button toggles text "Start" / "Stop" based on state

## How to test yourself

1. Open the task — pipeline displayed, log empty, "Start Log Stream" button active.
2. Click the button. Logs start arriving approximately every 0.7 seconds. The first line is always highlighted.
3. A Kafka topics block appears — topics `logs.api-gateway`, `logs.payment-service`, etc. with partition numbers (0, 1, 2) are visible.
4. INFO / WARN / ERROR counters update as logs arrive.
5. Enter `order` in the search field — only lines containing "order" in text are displayed.
6. Select level ERROR — only red lines are visible. Switch to a specific service — only its logs remain.
7. Click "Stop Log Stream" — log arrival stops, filters still work.
8. Click "Clear" — all logs deleted, counters reset to zero.
