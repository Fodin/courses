# Task 3.1 — Message Broker Anatomy

## Goal

Create an interactive component that visualizes the internal architecture of an AMQP message broker (RabbitMQ). The user should be able to study each broker component and see the message path from producer to consumer in a step-by-step simulation.

## Requirements

1. Display broker components grouped into three layers: Connection Layer (Connection, Channel), Routing Layer (Exchange, Binding), Storage Layer (Queue).
2. On component click — show a detail panel with: icon, name, description, list of key details (4 items).
3. Click on the selected component again — hides the detail panel.
4. Implement a step-by-step message path simulation through 5 steps: Producer→Exchange, Exchange→Binding, Binding→Queue, Queue→Consumer, Consumer→ACK.
5. During simulation, the "Run" button should be disabled with text "Simulating...".
6. Simulation steps are displayed as a progress bar with circles (1-5) that fill in as execution proceeds.
7. Completed steps show a terminal-style log (dark background, monospace font) with fields: step number, step name, details.
8. Each component has a unique color scheme (bgColor, borderColor, color).

## Checklist

- [ ] Three architecture layers display with headings (Connection / Routing / Storage)
- [ ] Click on a component opens the detail panel
- [ ] Re-click hides the panel
- [ ] "Run simulation" button launches the step-by-step flow
- [ ] 5-step progress bar updates during simulation
- [ ] Button is disabled during animation
- [ ] Terminal log appears and fills step by step
- [ ] After simulation completes, the button is active again

## How to Check Yourself

1. Click on each of the 5 components — a detail panel should appear and disappear on re-click.
2. Press "Run simulation" — the progress bar should fill step by step with ~700ms delay.
3. During simulation, try pressing the button again — it should be inactive.
4. Upon completion, all 5 log entries should appear in the terminal.
5. Open the browser console — there should be no errors.