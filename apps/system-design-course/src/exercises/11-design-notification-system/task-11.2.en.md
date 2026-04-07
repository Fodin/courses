# Task 11.2: Notification Pipeline Constructor

## Objective

Assemble the notification pipeline from the proposed stages in the correct order. Understand why each stage is in its position and observe how an event passes through the entire pipeline with filtering at each step.

## Requirements

1. You're given a set of pipeline stages (in random order)
2. Arrange the stages in the correct order using drag-and-drop
3. Click "Check" — the system will show which stages are placed correctly
4. After assembling the correct pipeline — run a simulation of event passing
5. Observe how the event is filtered at each stage (dedup blocks duplicates, preference removes disabled channels, etc.)

## Pipeline stages

- **Event Trigger** — external service generates an event (order, OTP, promo)
- **Deduplication** — idempotency key check, duplicate filtering
- **Preference Check** — check user channels, quiet hours, unsubscribes
- **Template Render** — variable substitution in the message template
- **Priority Queue** — enqueue by priority (critical/high/normal/low)
- **Channel Router** — route to specific channel (push/email/SMS/in-app)
- **Delivery** — send via provider (APNs, SendGrid, Twilio)

## Checklist

- [ ] All 7 stages placed in the correct order
- [ ] Understood why dedup comes before preference check (resource savings)
- [ ] Understood why template render comes before queue (finished message goes into queue)
- [ ] Understood why priority queue comes before channel router (priority determines processing order)
- [ ] Simulation launched and the path of at least 3 different events traced
- [ ] Understood at which stages an event can be filtered out and why

## How to Check Yourself

1. Arrange the stages and click "Check"
2. If there are errors — think: "What would happen if I swap these two stages?"
3. Run the simulation for different event types (OTP, promo, social)
4. Trace how dedup blocks a repeated event and how preference check filters a disabled channel
