# Level 0: Introduction to MQTT — Detailed Theory

## History and Context

In 1999, engineers Andy Stanford-Clark (IBM) and Arlen Nipper (Arcom) were solving the problem of monitoring oil pipelines via satellite links. The conditions were harsh: unstable connection, high latency, limited bandwidth, battery-powered devices. HTTP was completely unsuitable for this.

They created MQTT — a protocol where every byte counts, connections recover automatically, and devices don't need to stay permanently connected.

Today MQTT is used by: Philips Hue smart bulbs, Facebook Messenger (messages), Amazon IoT, Azure IoT Hub, smart water and electricity meters worldwide.

---

## Architectural Model in Detail

### The Problem with HTTP in IoT

Imagine 1000 temperature sensors. Each needs to send data to a server every 10 seconds.

**With HTTP:**
- Each sensor makes an HTTP POST request
- Headers: 400+ bytes per request
- No persistent connection — TCP handshake every time
- Server cannot "push" data to a sensor
- 1000 sensors × 400 bytes × 6 times/min = ~2.4 MB/min in overhead

**With MQTT:**
- Each sensor maintains a single persistent TCP connection
- Data: 2 bytes header + topic length + payload
- Server can send commands to a sensor at any time
- 1000 sensors × ~30 bytes × 6 times/min = ~180 KB/min

### The Broker — Heart of the System

```mermaid
graph LR
    A[Temperature\nSensor] -->|PUBLISH home/temp| B[Mosquitto\nBroker]
    C[Door\nSensor] -->|PUBLISH home/door| B
    D[Light\nSwitch] -->|PUBLISH home/light| B
    B -->|DELIVER| E[Node-RED\nAutomation]
    B -->|DELIVER| F[InfluxDB\nLogger]
    B -->|DELIVER| G[Web\nDashboard]
```

The broker performs three key functions:
1. **Routing** — delivers messages to all subscribed clients
2. **Buffering** — stores messages for temporarily offline clients (QoS 1/2)
3. **Retained messages** — stores the last value per topic for new subscribers

### Connection Lifecycle

```mermaid
graph LR
    A[Client] -->|CONNECT| B[Broker]
    B -->|CONNACK| A
    A -->|SUBSCRIBE home/+| B
    B -->|SUBACK| A
    C[Another Client] -->|PUBLISH home/temp| B
    B -->|PUBLISH home/temp| A
    A -->|PINGREQ| B
    B -->|PINGRESP| A
    A -->|DISCONNECT| B
```

---

## Topics: Anatomy and Rules

### Topic Structure

A topic is a UTF-8 string, separator is `/` (U+002F). Maximum length — 65535 bytes.

```
# Well-structured topics
home/floor1/bedroom/sensor/temperature
factory/line-3/machine-12/rpm
vehicles/truck-42/gps/coordinates
users/alice/notifications/inbox

# Bad practice
/sensor/temp          # leading slash = empty first level
TEMPERATURE           # all uppercase, no hierarchy
a                     # not informative
```

### Wildcards (SUBSCRIBE only)

The `+` and `#` symbols work **only in subscription patterns**. They are invalid in publish topics.

```
Publish topic:       home/bedroom/temperature  (concrete path)
Subscribe pattern:   home/+/temperature        (single level)
Subscribe pattern:   home/#                    (all levels)
Subscribe pattern:   #                         (EVERYTHING — be careful!)
```

**Match table:**

| Pattern | Matches | Does not match |
|---------|---------|----------------|
| `home/+/temp` | `home/bedroom/temp` | `home/floor1/bedroom/temp` |
| `home/#` | `home/`, `home/a/b/c/d` | `office/` |
| `+/+` | `a/b` | `a/b/c` |
| `#` | anything | — |

### System Topics $SYS

Mosquitto publishes metadata about its operation to special topics:

```bash
# Subscribe to all system topics
mosquitto_sub -t '$SYS/#' -v

# Examples of system topics:
$SYS/broker/version          → "mosquitto version 2.0.18"
$SYS/broker/uptime           → "3600 seconds"
$SYS/broker/clients/connected → "42"
$SYS/broker/messages/received → "18293"
$SYS/broker/load/messages/received/1min → "12.5"
```

📌 Notice the quotes around `$SYS` in the command line — otherwise the shell expands `$SYS` as an environment variable.

---

## Quality of Service (QoS)

Three levels of delivery guarantee:

### QoS 0 — At most once

```
Publisher  →  Broker  →  Subscriber
   PUBLISH ─────────────────────→
              (no confirmation)
```

The message is sent once without confirmation. If the broker is unavailable — the message is lost. Suitable for: frequent telemetry data where losing a single value is non-critical.

### QoS 1 — At least once

```
Publisher  →  Broker  →  Subscriber
   PUBLISH ─────────→
              PUBACK ←
                         PUBLISH ─────────→
                                   PUBACK ←
```

Guarantee: the message will arrive **at least once** (duplicates are possible). Suitable for: control commands, events, data important for logic.

### QoS 2 — Exactly once

```
PUBLISH → PUBREC → PUBREL → PUBCOMP (4 exchanges)
```

Guaranteed delivery without duplication. The slowest and most resource-intensive. Suitable for: critical transactions, financial data.

---

## Retained Messages and LWT

### Retained Messages

When publishing with `retain=true`, the broker stores the **last** message for that topic. A new subscriber immediately receives this message upon subscribing.

```bash
# Publish a retained message
mosquitto_pub -t "home/boiler/status" -m "online" -r

# Clear a retained message (empty payload)
mosquitto_pub -t "home/boiler/status" -m "" -r
```

💡 Analogy: retained message = the latest status on a bulletin board. A new employee immediately sees the current state without waiting for the next update.

### Last Will and Testament (LWT)

When connecting, a client can specify a "will" — a message the broker will publish if the client disconnects unexpectedly.

```python
# Example (paho-mqtt Python):
client.will_set(
    topic="home/sensors/boiler/status",
    payload="offline",
    qos=1,
    retain=True
)
```

This is a powerful mechanism for detecting emergency disconnects without periodic polling.

---

## MQTT 5.0: What's New

MQTT 3.1.1 was the IoT workhorse for over 10 years, but it lacked many features that developers implemented with workarounds. In 2019, MQTT 5.0 was released — backward-incompatible but significantly more powerful. Mosquitto supports v5 starting from version 2.0.

💡 Analogy: if MQTT 3.1.1 is SMS (text and that's it), then MQTT 5.0 is a messenger: delivery statuses, metadata, error reactions, groups.

### Properties (Message Metadata)

In v3.1.1, a message is just `topic + payload`. No metadata. Want to pass a content type? Put it in the payload. Want a TTL? Implement it yourself. In v5, standard **properties** can be attached to any packet:

```
Message Properties:
  Content-Type: "application/json"          # MIME type of payload
  Response-Topic: "response/request-id-123" # for request/reply pattern
  Correlation-Data: [binary]                # link request to response
  User-Property: {"source": "sensor-42"}    # arbitrary key-value pairs
  Message-Expiry-Interval: 3600             # auto-delete after an hour
  Payload-Format-Indicator: 1               # 0 = bytes, 1 = UTF-8 text
  Topic-Alias: 7                            # numeric topic alias
```

#### Topic Alias — Traffic Savings

When a device publishes to the same long topic thousands of times, the full string is transmitted every time. Topic Alias solves this:

```
# First PUBLISH — broker remembers that alias 7 = this topic
PUBLISH topic="factory/line-3/machine-12/vibration/sensor-a" alias=7

# All subsequent — only 2 bytes instead of 48
PUBLISH topic="" alias=7
PUBLISH topic="" alias=7
```

On a device with thousands of messages per minute, this is significant savings.

#### Request/Response Pattern

In v3.1.1, implementing request/response required inventing your own conventions. In v5 it's standardized:

```mermaid
graph LR
    A[Client A] -->|"PUBLISH topic=cmd/reboot\nResponse-Topic=reply/abc-123\nCorrelation-Data=abc-123"| B[Broker]
    B -->|DELIVER| C[Client B]
    C -->|"PUBLISH topic=reply/abc-123\nCorrelation-Data=abc-123"| B
    B -->|DELIVER| A
```

Client A sends a command and specifies where to expect the reply (`Response-Topic`). Client B executes the command and sends the result back. `Correlation-Data` allows matching a response to a specific request when multiple are in flight simultaneously.

### Reason Codes — Clear Diagnostics

In v3.1.1, when an error occurred, the broker simply dropped the connection. Why? Unknown. Figure it out from the logs. In v5, **every** response packet contains a numeric Reason Code:

| Code | Name | When It Occurs |
|------|------|----------------|
| `0x00` | Success | Operation completed successfully |
| `0x10` | No Matching Subscribers | Message published but nobody is subscribed |
| `0x80` | Unspecified Error | General error without details |
| `0x83` | Implementation Specific Error | Error specific to the broker implementation |
| `0x87` | Not Authorized | No permission for this operation |
| `0x8F` | Session Taken Over | Another client connected with the same clientId |
| `0x90` | Topic Filter Invalid | Invalid subscription pattern |
| `0x97` | Quota Exceeded | Quota exceeded (too many messages/subscriptions) |

Additionally, the broker can send a **Reason String** — a textual error description for debugging:

```
CONNACK Reason Code: 0x87
Reason String: "User 'sensor-42' not authorized for topic 'admin/#'"
```

### Shared Subscriptions — Load Balancing

In v3.1.1, when multiple clients subscribe to the same topic, **each one** receives a copy of the message. Shared Subscriptions allow creating a consumer group where each message is delivered to **only one** member of the group:

```mermaid
graph LR
    P[Publisher] -->|"PUBLISH jobs/process"| B[Broker]
    B -->|"Round-robin"| W1[Worker 1]
    B -.->|"doesn't receive"| W2[Worker 2]
    B -.->|"doesn't receive"| W3[Worker 3]
```

```bash
# All three workers subscribe to the same shared group "workers"
mosquitto_sub -t '$share/workers/jobs/#'  # Worker 1
mosquitto_sub -t '$share/workers/jobs/#'  # Worker 2
mosquitto_sub -t '$share/workers/jobs/#'  # Worker 3

# Each message in jobs/# will be received by only one of three
```

Format: `$share/{group-name}/{topic-filter}`. Different groups work independently — you can create a `loggers` group and a `processors` group, and each will receive all messages, but within a group — no duplication.

### Session Expiry Interval — Session Lifetime Management

In v3.1.1, a session is either deleted on disconnect (`clean session = true`) or lives forever (`clean session = false`). Eternal sessions are a headache: forgotten devices accumulate message queues, consuming broker memory.

In v5, the client specifies the **exact session lifetime** in seconds:

```
CONNECT:
  Clean Start: true / false
  Session Expiry Interval: 3600  # session lives 1 hour after disconnect
```

- `0` — delete session on disconnect (equivalent to `clean session = true`)
- `4294967295` (0xFFFFFFFF) — session lives indefinitely
- Any other value — TTL in seconds

This solves the "zombie sessions" problem: if a device doesn't reconnect within an hour, the broker automatically cleans up its queue.

### Flow Control — Overload Protection

In v3.1.1, a fast publisher could "flood" a slow subscriber, and the broker had no standard way to limit this. In v5, **Receive Maximum** appeared — the maximum number of unacknowledged QoS 1/2 messages in flight:

```
CONNECT:
  Receive Maximum: 10   # client can handle at most 10 messages simultaneously

CONNACK:
  Receive Maximum: 100  # broker can accept at most 100 simultaneously
```

When the limit is reached, the sender pauses publishing until acknowledgments are received. This prevents a device with 32 KB of RAM from drowning in a data stream.

### Comparison Summary

| Feature | MQTT 3.1.1 | MQTT 5.0 |
|---------|-----------|----------|
| Message metadata | ❌ | ✅ Properties |
| Error diagnostics | Connection drop | Reason Code + String |
| Load balancing | ❌ | ✅ Shared Subscriptions |
| Session lifetime | Forever or 0 | Configurable TTL |
| Message lifetime | ❌ | ✅ Message Expiry |
| Request/Response | Workarounds | ✅ Response-Topic |
| Flow Control | ❌ | ✅ Receive Maximum |
| Topic Alias | ❌ | ✅ Traffic savings |
| Disconnect reason | ❌ | ✅ Disconnect Reason Code |

### When to Stay on 3.1.1?

Not everyone needs to upgrade to v5:
- **Device doesn't support v5** — many cheap ESP8266/ESP32 libraries still only work with v3.1.1
- **Broker doesn't support v5** — some cloud IoT platforms haven't updated yet
- **Simple scenario** — if pub/sub with QoS 0 without metadata is sufficient, v3.1.1 is simpler and lighter

Mosquitto 2.x supports both protocols simultaneously — v3.1.1 and v5 clients can work with the same broker.

---

## MQTT vs HTTP vs WebSocket vs AMQP

### When to Choose MQTT

✅ Use MQTT if:
- Devices have limited resources (RAM < 64 MB, unstable internet)
- You need push notifications from devices to server AND from server to devices
- Many devices → one server (message fan-out)
- You need LWT (connection drop detection)
- Battery-powered devices (minimal network traffic)

❌ Don't use MQTT if:
- You need request/response with a guaranteed specific response (HTTP is better)
- Transactional message processing (AMQP with RabbitMQ is better)
- Single device, web browser, public API (WebSocket or HTTP is better)

### Comparison Table

| Parameter | MQTT 5 | HTTP/2 | WebSocket | AMQP 1.0 |
|---------|--------|--------|-----------|----------|
| Fixed header | 2 bytes | ~200 bytes | ~10 bytes (after HS) | ~8 bytes |
| Persistent connection | ✅ | ✅ (HTTP/2) | ✅ | ✅ |
| Pub/Sub out of the box | ✅ | ❌ | ❌ | ✅ |
| QoS guarantees | QoS 0/1/2 | ❌ | ❌ | ACK/txn |
| Broker-free | ❌ | ✅ | ✅ | ❌ |
| Wildcards | ✅ | ❌ | ❌ | ✅ |
| LWT | ✅ | ❌ | ❌ | ❌ |
| IoT Standard | ✅ IANA 1883 | ❌ | partial | ❌ |

---

## ⚠️ Common Beginner Mistakes

### ❌ Publishing from a single client to all topics

```python
# Bad: one "central client" publishing on behalf of all sensors
central_client.publish("home/sensor1/temp", "23.5")
central_client.publish("home/sensor2/temp", "21.0")
```
**Why it's a problem:** if the central client disconnects, all topics go silent. LWT won't help for each sensor.

✅ Each device = its own MQTT client. The broker is designed for thousands of simultaneous connections.

### ❌ Using `#` as the only subscription pattern

```python
# Bad: subscribing to everything in production
client.subscribe("#")
```
**Why it's a problem:** the broker will send ABSOLUTELY ALL messages to the client. Under high load the client will choke.

✅ Subscribe to specific subtrees: `home/#`, `factory/line1/#`.

### ❌ Storing state only in retained messages

```bash
# Bad: the only state storage is a retained message
mosquitto_pub -t "system/config" -m '{"timeout":30}' -r
# After a broker restart without persistence, data is lost!
```
✅ Retained messages are a cache, not a database. Duplicate critical data to external storage.

### ❌ Leaving clientId empty or generating it randomly

```python
# Bad:
client = mqtt.Client()  # random clientId

# Even worse:
client = mqtt.Client(client_id="")  # broker will assign a random one
```
**Why it's a problem:** a persistent session with QoS 1/2 will never recover. The broker accumulates "abandoned" sessions.

✅ Use stable, unique clientIds: `sensor-bedroom-01`, `dashboard-main`.

---

## Practice: First Steps with mosquitto_pub/sub

```bash
# Terminal 1: subscriber
mosquitto_sub -h 192.168.1.1 -p 1883 -t "test/#" -v

# Terminal 2: publisher
mosquitto_pub -h 192.168.1.1 -p 1883 -t "test/hello" -m "Hello, MQTT!"

# Terminal 1 will receive:
# test/hello Hello, MQTT!
```

mosquitto_pub flags:
| Flag | Meaning |
|------|---------|
| `-h` | broker address |
| `-p` | port (default 1883) |
| `-t` | topic |
| `-m` | payload (message) |
| `-q` | QoS (0, 1, 2) |
| `-r` | retain flag |
| `-u` / `-P` | username / password |
| `-d` | debug output |
| `-i` | client ID |
