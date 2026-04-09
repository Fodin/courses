# Task 11.2: Delivery Models

## Goal

Implement an interactive component for visual comparison of message delivery models across five brokers. The student will create an animated diagram with moving message particles, switchable between brokers, and a descriptive block with characteristics of each model.

## Requirements

1. Define a `BrokerModel` type — a union type of five values: `'rabbitmq' | 'kafka' | 'nats' | 'redis' | 'pulsar'`.
2. Define a `MessageParticle` interface with fields: `id: number`, `x: number`, `progress: number`, `active: boolean`.
3. Define a `ModelConfig` interface with fields: `name: string`, `color: string`, `delivery: string`, `guarantee: string`, `brokerRole: string`, `consumerRole: string`, `description: string`, `flow: string[]`.
4. Fill the `MODEL_CONFIGS: Record<BrokerModel, ModelConfig>` object with data for all 5 brokers:
   - RabbitMQ: Push, at-least-once, Smart broker / Dumb consumer
   - Kafka: Pull, at-least-once / exactly-once, Dumb broker / Smart consumer
   - NATS: Push (Core) / Pull (JetStream), at-most-once (Core) / at-least-once (JetStream)
   - Redis Streams: Pull (XREADGROUP), at-least-once with ACK
   - Pulsar: Push + Pull hybrid, Stateless broker + BookKeeper
   - Each broker should have a `flow` array of 5 steps (message path)
5. Implement states: `selected: BrokerModel` (selected broker), `particles: MessageParticle[]` (moving particles), `running: boolean` (auto mode), `msgCount: number`.
6. Implement a `sendMessage` function: creates a new particle and animates it by `progress` from 0 to 100 in steps of 5 every 40ms; when reaching 100 — removes after 600ms.
7. Implement a `startAuto` function: when `running=false`, starts sending 12 messages at 350ms intervals; when `running=true` — stops.
8. Render a panel with broker switch buttons. The active button is underlined with the broker's color.
9. Render an info block with colored border: delivery, guarantee, brokerRole, consumerRole, description.
10. Render an animated diagram (SVG + absolute positioning): "Producer" block, broker (colored border), "Consumer" block; dashed lines between them; particles as colored circles with glow effect, fading when `progress > 90`.
11. "Send Message" and "Auto x12" / "Stop" buttons; counter "Sent: N".
12. List of message flow steps from `config.flow` with numbering.
13. On broker switch: clear particles, reset counter, stop auto mode.

## Checklist

- [ ] `BrokerModel` type is declared as a union of 5 values
- [ ] `MessageParticle` and `ModelConfig` interfaces are defined with all fields
- [ ] `MODEL_CONFIGS` contains configuration for all 5 brokers
- [ ] Each broker has a non-empty `flow` array of 5 steps
- [ ] Switching brokers resets particles and counter
- [ ] Active button is underlined with the current broker's color
- [ ] Info block updates on broker change
- [ ] "Send Message" button launches one particle
- [ ] Particle moves left to right and disappears upon reaching Consumer
- [ ] Particle color matches the selected broker's color
- [ ] "Auto x12" button sends 12 messages at intervals
- [ ] Button text changes to "Stop" during auto mode
- [ ] `msgCount` counter increments with each message
- [ ] `flow` step list is displayed with colored numbers

## How to test yourself

1. On open, RabbitMQ should be selected. Click "Send Message" — an orange dot should travel from Producer through RabbitMQ to Consumer.
2. Click "Auto x12" — 12 messages should be sent automatically. The button becomes "Stop".
3. Click "Stop" before completion — the animation should stop (but the current particle will finish).
4. Switch to Kafka — the button is underlined in red, info block changes to "Pull (Kafka protocol)", broker role "Dumb broker".
5. Switch to NATS — color is green, latency "★★★★★ (< 1ms)", delivery shows both modes.
6. Verify the flow step list is displayed for each broker with numbering 1-5.
7. Verify the block border changes color on broker switch.
