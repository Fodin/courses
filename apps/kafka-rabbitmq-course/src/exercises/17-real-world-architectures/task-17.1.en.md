# Task 17.1: E-Commerce — Order Architecture

## Goal

Implement an interactive animation of a hybrid e-commerce microservice architecture. The user clicks "Create Order" and step by step observes how the request flows through API Gateway, OrderService, RabbitMQ (commands), and Kafka (events) until the order is fully confirmed and the email is sent.

## Requirements

1. Declare an `OrderStep` type with 11 values: `'idle' | 'api-gateway' | 'order-created' | 'payment-command' | 'payment-processing' | 'payment-done' | 'inventory-command' | 'inventory-reserved' | 'order-confirmed' | 'notification-sent' | 'complete'`.
2. Declare a `FlowMessage` interface with fields: `id: number`, `from: string`, `to: string`, `text: string`, `broker: 'rabbitmq' | 'kafka' | 'http'`, `step: OrderStep`.
3. Declare a constant array `FLOW_MESSAGES: FlowMessage[]` of 10 messages describing the flow: Client → API Gateway (HTTP), API Gateway → OrderService (HTTP), OrderService → RabbitMQ (ProcessPayment command), RabbitMQ → PaymentService, PaymentService → Kafka (PaymentCompleted), OrderService → RabbitMQ (ReserveInventory), RabbitMQ → InventoryService, InventoryService → Kafka (ItemReserved), Kafka → OrderService (OrderConfirmed), Kafka → NotificationService (SendEmail).
4. Declare a `STEP_LABELS: Record<OrderStep, string>` dictionary with human-readable descriptions of each step.
5. Declare dictionaries `BROKER_COLORS` (rabbitmq → `'#ff6600'`, kafka → `'#3a7ebf'`, http → `'#38a169'`) and `BROKER_LABELS` (rabbitmq → `'RabbitMQ (commands)'`, kafka → `'Kafka (events)'`, http → `'HTTP/REST'`).
6. Declare a `SERVICE_POSITIONS` dictionary with coordinates `{ x, y, color }` for nodes: Client, API Gateway, OrderService, RabbitMQ, PaymentService, Kafka, InventoryService, NotificationService.
7. Implement a helper function `getNodeCenter(name)` returning `{ cx, cy }` — the center of a node rectangle.
8. Declare component states: `currentStep: number` (initially `-1`), `running: boolean`, `speed: number` (initially `1200`), `timerRef` via `useRef`.
9. Implement `startFlow`: resets `currentStep` to `-1`, sets `running: true`.
10. In `useEffect`, organize auto-scrolling: every `speed` ms, increment `currentStep` by 1 while `running === true` and steps remain; on exhaustion, set `running: false`.
11. Implement `reset`: stops the timer, sets `running: false` and `currentStep: -1`.
12. Render an SVG diagram (`viewBox="0 0 650 360"`) with service nodes and animated arrows. Arrows of already visible messages are displayed dimmed, the last active one — full brightness with a label. Nodes are highlighted with color when active.
13. Add a step status block with a colored broker indicator and step counter.
14. Add a scrollable message log in monospace style with a colored broker label.
15. Add a color legend (RabbitMQ / Kafka / HTTP).
16. Add "Create Order" / "Reset" buttons and a speed selector (Slow / Normal / Fast).
17. When animation completes (`currentStepName === 'complete'`), display a final green block explaining the hybrid architecture.

## Checklist

- [ ] `OrderStep` type declared with 11 values
- [ ] `FlowMessage` interface declared with fields `id`, `from`, `to`, `text`, `broker`, `step`
- [ ] `FLOW_MESSAGES` array contains exactly 10 messages in correct order
- [ ] Three brokers (`rabbitmq`, `kafka`, `http`) colored differently
- [ ] All 8 service nodes present in `SERVICE_POSITIONS` with coordinates and color
- [ ] `getNodeCenter` returns rectangle center accounting for `NODE_W` and `NODE_H`
- [ ] States `currentStep`, `running`, `speed`, `timerRef` declared
- [ ] `startFlow` resets step and starts animation
- [ ] `useEffect` automatically advances `currentStep` with `speed` ms delay
- [ ] `reset` stops the timer and returns to initial state
- [ ] SVG diagram rendered with nodes and arrows
- [ ] Last active arrow is full color, previous ones are dimmed
- [ ] Active nodes (sender and receiver of current step) are highlighted
- [ ] Arrows contain `markerEnd` with colored tips (`<defs><marker ...>`)
- [ ] Status block displays `STEP_LABELS[currentStepName]`
- [ ] Message log scrolls and shows all visible steps
- [ ] Legend displays three line types with labels
- [ ] "Create Order" button is disabled during execution
- [ ] Speed selector changes `speed` (2000 / 1200 / 600 ms)
- [ ] Final block appears only when `currentStepName === 'complete'`

## How to test yourself

1. Open the task — SVG diagram with gray nodes, "Waiting" status, button active.
2. Click "Create Order". Arrows appear one by one: green (HTTP), orange (RabbitMQ), blue (Kafka). Current sender and receiver are highlighted with their color.
3. The log at the bottom shows all completed steps, the last one highlighted.
4. After the last step (step 10/10), a final green block with text about hybrid architecture appears.
5. Select "Fast" speed — animation noticeably speeds up.
6. Click "Reset" — diagram returns to initial gray state, log is cleared.
