# Task 4.2: Management UI — Dashboard

## Goal

Implement a RabbitMQ Management UI simulator with live animated metrics. The student will learn to read dashboard data, understand queue metrics, distinguish queue types and states.

## Requirements

1. Define interfaces `QueueStats` and `ConnectionInfo` with all necessary fields:
   - `QueueStats`: `name`, `vhost`, `type` (`'classic' | 'quorum' | 'stream'`), `state` (`'running' | 'idle' | 'flow'`), `messages`, `messagesReady`, `messagesUnacked`, `publishRate`, `deliverRate`, `consumers`, `memory`
   - `ConnectionInfo`: `name`, `user`, `vhost`, `state`, `channels`, `sendRate`, `recvRate`
2. Create initial data: at least 5 queues (including at least one quorum, one stream, and one with 0 consumers) and at least 3 connections.
3. Implement metric animation via `setInterval` (1500ms): publish/deliver rates change slightly, message counts recalculate based on the delta between publish and deliver. Don't animate idle queues.
4. Implement three tabs (`overview`, `queues`, `connections`) with switching:
   - **Overview**: 4 summary cards (Queues, Messages, Publish/s, Deliver/s), node info block (Disk free, Memory used, FD used, Erlang processes, Uptime, etc.), animated rate-bars for active queues.
   - **Queues**: table with all queues, colored type badges, status icon. Click on a row — shows a detail panel with additional fields. Queues with 0 consumers are highlighted with a warning.
   - **Connections**: connection table with user, vhost, state, channels, and rates.
5. Dashboard header: node name, RabbitMQ version, Erlang version, current time.
6. Footer: Management Plugin version, update counter (tick).
7. Component must correctly clear the interval on unmount (`useEffect` with cleanup).

## Checklist

- [ ] Interfaces `QueueStats` and `ConnectionInfo` are strictly typed
- [ ] Initial data contains diverse queues (quorum, stream, classic, idle, no consumers)
- [ ] Animation works via `setInterval` with cleanup in `useEffect`
- [ ] Overview tab: 4 cards with aggregated metrics
- [ ] Overview tab: Node info block with 6+ parameters
- [ ] Overview tab: animated rate-bars for active queues
- [ ] Queues tab: table with colored type and status badges
- [ ] Click on a row opens the detail panel
- [ ] Queue without consumers is highlighted with a warning (⚠️ 0)
- [ ] Connections tab: table with users and vhosts
- [ ] Header imitates Management UI (orange background, node name, versions)

## How to Check Yourself

1. Dashboard opens on the Overview tab — 4 cards with aggregate metrics are visible.
2. Publish/s and Deliver/s values in the cards change every 1-2 seconds (animation).
3. On the Queues tab, colored type badges are visible in the Type column: blue "quorum", purple "stream", gray "classic".
4. The dead.letter queue (0 consumers) shows "⚠️ 0" in red in the Consumers column.
5. Click on a queue row — a detail panel opens (Virtual Host, Memory, etc.).
6. Click the same row again — the panel hides.
7. On the Connections tab, all connected services are visible with their vhosts and channels.
8. After component unmount (level switch), the interval doesn't keep running.