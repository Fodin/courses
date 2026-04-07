# Level 4: QoS and Delivery

## What is QoS?

QoS (Quality of Service) — the level of message delivery guarantee. Imagine three ways to send an important letter:

- **QoS 0** — drop it in the mailbox and forget. Will it arrive? Most likely. Definitely? No.
- **QoS 1** — send with delivery confirmation. May be delivered twice (if the confirmation was lost).
- **QoS 2** — notarized delivery. Exactly once, guaranteed.

## QoS 0 — At most once

```
Publisher → PUBLISH → Broker → PUBLISH → Subscriber
```

The lightest mode. No confirmations, no retries. Suitable for data where loss is non-critical: temperature readings, GPS coordinates, real-time monitoring.

```bash
mosquitto_pub -q 0 -t 'home/temp' -m '22.5'
```

## QoS 1 — At least once

```
Publisher → PUBLISH     → Broker
Publisher ← PUBACK      ← Broker
```

The broker confirms receipt via `PUBACK`. If the confirmation doesn't arrive — the publisher retries. The subscriber may receive duplicates.

```bash
mosquitto_pub -q 1 -t 'alarm/door' -m 'opened'
```

📌 Messages with QoS 1 are stored in the queue while the subscriber is offline (if it has a persistent session).

## QoS 2 — Exactly once

```
Publisher → PUBLISH  → Broker  (stored)
Publisher ← PUBREC   ← Broker  (received)
Publisher → PUBREL   → Broker  (release)
Publisher ← PUBCOMP  ← Broker  (complete)
```

Four steps guarantee exactly-once delivery. The slowest and heaviest mode. Use for financial operations, execution commands, critical alerts.

```bash
mosquitto_pub -q 2 -t 'valve/cmd' -m 'close'
```

## Retained Messages

A retained message is a message the broker stores and immediately delivers to new subscribers.

Imagine an information board at a station: when you approach, you immediately see the current schedule — you don't wait for the next update.

```bash
# Publish with retained flag
mosquitto_pub -r -t 'home/temp' -m '22.5'

# New subscriber immediately receives "22.5"
mosquitto_sub -t 'home/temp'

# Delete retained message
mosquitto_pub -r -t 'home/temp' -m ''  # empty payload
```

Setting in `mosquitto.conf`:
```
retain_available true   # enabled by default
max_inflight_messages 20
```

## Last Will and Testament (LWT)

LWT — a message the broker will automatically send if a client disconnects improperly (connection drop, crash, power loss).

Analogy: a will. When connecting, the client tells the broker: "If I disappear — send this message to this topic."

```bash
# Connect with LWT (via client library)
# On disconnect the broker sends: device/esp32/status → "offline"
mosquitto_sub -t 'device/+/status' \
  --will-topic 'monitor/lwt' \
  --will-payload 'monitor disconnected' \
  --will-qos 1
```

Typical usage: `device/{id}/status` → `online` on connect, LWT → `offline` on disconnect.

## ⚠️ Common Mistakes

❌ **QoS 2 everywhere "for reliability"** — slows down 4× compared to QoS 0. On a slow OpenWRT link this is critical.

❌ **Retained + QoS 0 for critical data** — the message will be stored, but may be lost during delivery.

❌ **Not clearing retained messages** — the old value will be given to new subscribers forever. Delete with an empty payload.

❌ **LWT with QoS 0** — the "crash" message may not arrive. Use QoS 1 for LWT.
