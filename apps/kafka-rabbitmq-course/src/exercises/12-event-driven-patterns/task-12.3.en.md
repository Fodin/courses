# Task 12.3: Choreography vs Orchestration

## Goal

Implement an interactive visualization of two approaches to coordinating distributed operations in a microservice architecture: **choreography** (services react to events on their own) and **orchestration** (a central coordinator manages the flow). The student should animate both flows in parallel and compare their characteristics.

## Requirements

1. Define a `FlowStep` type — a union of string literals: `'order-service' | 'payment-service' | 'inventory-service' | 'shipping-service' | 'notification-service'`.
2. Define a `ServiceNode` interface with fields `id: FlowStep`, `label: string`, `x: number`, `y: number`, `color: string`. Declare a `SERVICES_LAYOUT` constant of 5 nodes with coordinates for the SVG diagram.
3. Define a `ChoreographyStep` interface with fields `from: FlowStep`, `event: string`, `to: FlowStep`, `produces: string`, `delay: number`. Declare a `CHOREOGRAPHY_STEPS` array of 4 steps: `OrderPlaced → PaymentProcessed → StockReserved → ShipmentCreated → NotificationSent` (600ms delay each).
4. Define an `OrchestrationStep` interface with fields `service: FlowStep`, `command: string`, `response: string`, `delay: number`. Declare an `ORCHESTRATION_STEPS` array of 4 steps: orchestrator sequentially calls Payment, Inventory, Shipping, Notification.
5. Implement states: `choreoStep: number` (−1 = not started), `orchStep: number` (−1), `choreoRunning: boolean`, `orchRunning: boolean`, `choreoLog: string[]`, `orchLog: string[]`.
6. Implement an async function `runChoreography`: resets state, adds initial log entry, in a loop waits `step.delay` ms via `setTimeout` in a Promise, updates `choreoStep` and adds a log line for each step. Disables running on completion.
7. Implement an async function `runOrchestration`: similar, but the log includes two lines per step — the orchestrator's command to the service and the service's response. At the end adds "Saga completed successfully".
8. Implement a `resetAll` function that resets all 4 step states and logs.
9. Render the choreography block: header + "Run" button (disabled while animating) + SVG diagram + scrollable log.
10. Choreography SVG: draws lines between services from `CHOREOGRAPHY_STEPS`; active line — solid colored with event name, inactive — gray dashed. Service nodes: active — filled with color, inactive — white with colored border. No `ORCHESTRATOR` header.
11. Render the orchestration block: header + "Run" button + SVG diagram + scrollable log.
12. Orchestration SVG: central rectangle "ORCHESTRATOR (Saga Controller)" + lines from it to each service. Active lines — solid with command name. Service nodes — same as choreography.
13. Add a "Reset" button below both diagrams.
14. Add a comparison block of the two approaches: two side-by-side blocks (choreography and orchestration) listing pros and cons of each.

## Checklist

- [ ] `FlowStep` type is declared as a union of 5 string literals
- [ ] Interfaces `ServiceNode`, `ChoreographyStep`, `OrchestrationStep` are declared
- [ ] `SERVICES_LAYOUT` contains 5 nodes with coordinates and colors
- [ ] `CHOREOGRAPHY_STEPS` — 4 steps with the correct event chain
- [ ] `ORCHESTRATION_STEPS` — 4 steps with commands and responses
- [ ] `runChoreography` uses `await new Promise(r => setTimeout(r, delay))` for animation
- [ ] `runOrchestration` generates 2 log lines per step (command + response)
- [ ] Buttons are disabled while any animation is running
- [ ] Choreography SVG: active lines solid, inactive dashed
- [ ] Event name is displayed on the active line
- [ ] Orchestration SVG: central ORCHESTRATOR + lines to services with commands
- [ ] Nodes: active = filled with service color + white text, inactive = white background + colored text
- [ ] "Reset" button returns everything to initial state
- [ ] Comparison block shows pros and cons of both approaches

## How to test yourself

1. Click "Run" under "Choreography" — animation runs ~2.4 seconds: nodes sequentially color, log fills with lines like `[Payment Service] Received OrderPlaced → processes → publishes PaymentProcessed`.
2. Click "Run" under "Orchestration" — the log alternates between orchestrator commands and service responses. The last line — "Saga completed successfully".
3. During animation, both buttons are inactive. After choreography completes, orchestration can be started.
4. Click "Reset" — all nodes become white, logs are cleared, steps reset to −1.
5. Verify that the choreography SVG has 4 lines between services, and the orchestration SVG has 4 lines from the central ORCHESTRATOR to services.
6. Check the comparison block: choreography lists "No single point of failure" and "Hard to trace the flow"; orchestration lists "Clear control flow" and "Orchestrator is a bottleneck".
