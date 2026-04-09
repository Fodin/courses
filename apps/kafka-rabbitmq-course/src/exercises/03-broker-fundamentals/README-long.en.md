# Level 3: Message Broker Fundamentals — Detailed Theory

## History of AMQP

In the early 2000s, enterprise messaging was a closed market: IBM MQ, TIBCO, Microsoft MSMQ — each with its own protocol and proprietary clients. Integration between them cost enormous sums.

In 2003, JPMorgan Chase initiated the creation of an open standard. In 2006, AMQP 0-8 was released, and in 2008 — AMQP 0-9-1, which RabbitMQ implemented. The goal was simple: **any client should work with any broker**.

```
2003 — JPMorgan initiates the standard
2006 — AMQP 0-8 (first public release)
2008 — AMQP 0-9-1 (RabbitMQ implements this variant)
2011 — AMQP 1.0 (complete refactor, incompatible with 0-9-1)
2012 — AMQP 1.0 becomes an OASIS standard
```

---

## AMQP 0-9-1 vs AMQP 1.0

These are **two fundamentally different protocols** sharing the same name. Understanding the difference is critical.

### AMQP 0-9-1 (RabbitMQ)

- Model: Exchange → Binding → Queue (fixed topology)
- Broker is central, knows about topology
- Binary protocol, frames with method/header/body
- Clients: pika (Python), amqplib (Node.js), RabbitMQ Java Client
- Port: 5672 (plain), 5671 (TLS)

```
+-----------+    AMQP 0-9-1     +------------+
|  Producer |  ===============> |  RabbitMQ  |
|  Consumer |  <=============== |  Broker    |
+-----------+                   +------------+
```

### AMQP 1.0 (Azure Service Bus, ActiveMQ Artemis)

- Model: peer-to-peer, no mandatory concept of exchange/queue
- Broker is optional: direct peer-to-peer is possible
- More complex: sessions, links, delivery states
- Clients: Apache Qpid, Azure SDK, rhea (Node.js)
- Port: 5672 (same, but incompatible protocol!)

💡 **Practical takeaway**: if you work with RabbitMQ — it's AMQP 0-9-1. If Azure Service Bus or ActiveMQ Artemis — AMQP 1.0. Don't confuse them.

⚠️ **Common error**: RabbitMQ supports AMQP 1.0 as a plugin, but it's a separate codebase with limited functionality.

---

## AMQP 0-9-1 Frames

All data exchange in AMQP 0-9-1 happens through **frames** (frames). A frame is the minimum unit of transfer.

### Frame Structure

```
+----------+------------+-----------+------------------+-----------+
| type     | channel-id | size      | payload          | frame-end |
| (1 byte) | (2 bytes)  | (4 bytes) | (size bytes)     | (1 byte)  |
+----------+------------+-----------+------------------+-----------+
                                                          = 0xCE
```

`frame-end` is always `0xCE` (206). If it differs — the protocol is violated, connection is terminated.

### Frame Types

| Type | Code | Purpose |
|-----|-----|-----------|
| Method Frame | 1 | Command or response (publish, consume, ack...) |
| Header Frame | 2 | Message metadata (content properties) |
| Body Frame | 3 | Message body (can be multiple) |
| Heartbeat Frame | 8 | Connection liveness check |

### Method Frame in Detail

Each AMQP command is identified by a class-id + method-id pair:

```
Class: connection (10)
  connection.start      (10)
  connection.start-ok   (11)
  connection.tune       (30)
  connection.tune-ok    (31)
  connection.open       (40)
  connection.open-ok    (41)
  connection.close      (50)

Class: channel (20)
  channel.open          (10)
  channel.open-ok       (11)
  channel.close         (40)

Class: exchange (40)
  exchange.declare      (10)
  exchange.delete       (20)

Class: queue (50)
  queue.declare         (10)
  queue.bind            (20)
  queue.unbind          (50)
  queue.purge           (30)
  queue.delete          (40)

Class: basic (60)
  basic.qos             (10)  ← prefetch
  basic.consume         (20)
  basic.cancel          (30)
  basic.publish         (40)
  basic.return          (50)  ← mandatory=true, not routed
  basic.deliver         (60)  ← push from broker to consumer
  basic.get             (70)  ← pull
  basic.ack             (80)
  basic.nack            (120)
  basic.reject          (90)
```

### Publishing a Message: Full Frame Flow

When a producer does `basic.publish` with a body, the broker receives **three frames**:

```
Frame 1: Method Frame
  type=1, channel=1, payload=[class=60, method=40, exchange="orders",
                               routing-key="orders.new", mandatory=1]

Frame 2: Header Frame
  type=2, channel=1, payload=[class=60, body-size=47,
                               content-type="application/json",
                               delivery-mode=2, message-id="uuid-123",
                               timestamp=1712345678]

Frame 3: Body Frame
  type=3, channel=1, payload=[{"orderId":"42","amount":1500}]
```

If the body exceeds `frame-max` (default 131072 bytes = 128KB), it's split into multiple Body Frames.

---

## Multiplexing through Channels

Channels solve a fundamental problem: how can one TCP stream handle multiple independent "conversations" simultaneously?

```
TCP Connection (one socket)
│
├── Channel 1 (ID: 0x0001) — producer, publishes orders
│   └── [Method: basic.publish] [Header] [Body]
│
├── Channel 2 (ID: 0x0002) — consumer A, processes orders
│   └── [Method: basic.consume] ... [Method: basic.ack]
│
└── Channel 3 (ID: 0x0003) — admin, manages queues
    └── [Method: queue.declare] [Method: exchange.declare]
```

Each frame carries a channel-id, so both broker and client know which "conversation" the frame belongs to.

**Why not open multiple TCP connections?**

TCP connection is an expensive resource:
- 3-way handshake
- TLS handshake (if enabled): additional 1-2 RTT
- AMQP connection negotiation: several more RTT
- Memory on the broker side

A channel is created almost instantly: one Method Frame `channel.open` + response `channel.open-ok`.

**Channel limitations:**

```python
# When creating a connection, channel-max is negotiated
connection = pika.BlockingConnection(pika.ConnectionParameters(
    host='localhost',
    channel_max=2047  # maximum number of channels
))
```

⚠️ **Common mistake**: using one channel from multiple threads. A channel is not thread-safe. Rule: **one channel per thread**.

---

## Connection Lifecycle

Establishing a connection in AMQP 0-9-1 is a strict sequence of messages:

```mermaid
graph LR
    C[Client] -->|"AMQP\0\0\9\1"| B[Broker]
    B -->|connection.start| C
    C -->|connection.start-ok| B
    B -->|connection.tune| C
    C -->|connection.tune-ok| B
    C -->|connection.open| B
    B -->|connection.open-ok| C
```

### Step 1: Protocol Header

The client sends 8 bytes: `A M Q P 0 0 9 1` (ASCII + version). This isn't a frame — it's just an initiation.

### Step 2: connection.start

The broker responds with its capabilities:
```json
{
  "version-major": 0,
  "version-minor": 9,
  "server-properties": {
    "product": "RabbitMQ",
    "version": "3.12.0",
    "capabilities": {
      "publisher_confirms": true,
      "consumer_cancel_notify": true,
      "basic.nack": true,
      "per_consumer_qos": true
    }
  },
  "mechanisms": "PLAIN AMQPLAIN",
  "locales": "en_US"
}
```

### Step 3: connection.tune

Parameter negotiation:
- `channel-max`: maximum channels (0 = no limit)
- `frame-max`: maximum frame size in bytes
- `heartbeat`: heartbeat interval in seconds

The client can reduce the proposed values in `tune-ok`.

### Heartbeat

Heartbeat — a special frame (type 8, 8 bytes) for detecting "dead" connections:

```
+------+------------+---------+-----------+
| 0x08 | 0x00 0x00  | 0x00000 | 0xCE      |
| type | channel=0  | size=0  | frame-end |
+------+------------+---------+-----------+
```

If no data is received within `heartbeat * 2` seconds — the connection is considered lost.

```python
connection = pika.BlockingConnection(pika.ConnectionParameters(
    heartbeat=60  # 60 seconds
))
```

---

## Message Properties

Each message carries a set of **content properties** in a Header Frame. These are analogous to HTTP headers, but in binary format.

### Complete List of Basic Class Properties

| Property | Type | Description |
|---------|-----|-------------|
| `content-type` | short-str | MIME type: `application/json`, `text/plain` |
| `content-encoding` | short-str | Encoding: `gzip`, `deflate` |
| `headers` | table | Arbitrary headers (key-value) |
| `delivery-mode` | octet | 1=transient (lost on restart), 2=persistent |
| `priority` | octet | 0-9, for priority queues |
| `correlation-id` | short-str | Original message ID (for RPC) |
| `reply-to` | short-str | Queue for response (RPC pattern) |
| `expiration` | short-str | Message TTL in ms (string!) |
| `message-id` | short-str | Unique ID, assigned by sender |
| `timestamp` | longlong | Unix timestamp of sending |
| `type` | short-str | Event type (e.g., `OrderCreated`) |
| `user-id` | short-str | User ID (verified by broker) |
| `app-id` | short-str | Sender application ID |

### Practical Examples

```python
import pika
import json
import time
import uuid

channel.basic_publish(
    exchange='orders',
    routing_key='orders.new',
    body=json.dumps({'orderId': '42', 'amount': 1500}),
    properties=pika.BasicProperties(
        content_type='application/json',
        delivery_mode=2,          # persistent
        message_id=str(uuid.uuid4()),
        timestamp=int(time.time()),
        correlation_id='req-id-789',  # for tracing
        type='OrderCreated',
        app_id='order-service',
        headers={
            'x-retry-count': 0,
            'x-source-region': 'eu-west-1',
        },
    )
)
```

### delivery-mode: Persistence

```python
# Transient — fast, but lost on restart
delivery_mode=1

# Persistent — written to disk
# Requires: durable queue + persistent message + durable exchange
delivery_mode=2
```

⚠️ **Mistake**: `delivery_mode=2` without `durable=True` on the queue. The message is "persistent," but the queue disappears on restart along with messages.

---

## Acknowledgment Modes

### Auto-ack (no-ack=true)

```python
channel.basic_consume(
    queue='orders',
    on_message_callback=callback,
    auto_ack=True  # immediate acknowledgment on delivery
)
```

The broker deletes the message immediately after sending to the consumer. If the consumer crashes during processing — the message is lost.

✅ When to use: high-throughput, loss is acceptable (metrics, logs)
❌ When not to use: financial operations, critical events

### Manual ACK

```python
def callback(ch, method, properties, body):
    try:
        process_order(json.loads(body))
        ch.basic_ack(delivery_tag=method.delivery_tag)
    except Exception:
        ch.basic_nack(
            delivery_tag=method.delivery_tag,
            requeue=False  # to dead letter
        )
```

### basic.ack with multiple=True

```python
# ACK all messages with delivery-tag <= 10
ch.basic_ack(delivery_tag=10, multiple=True)
```

Useful for batch processing: accumulate N messages, process, one ACK.

### basic.nack vs basic.reject

```python
# basic.nack — can ACK/NACK multiple messages
ch.basic_nack(delivery_tag=5, requeue=True, multiple=True)

# basic.reject — only one message, no multiple
ch.basic_reject(delivery_tag=5, requeue=False)
```

### Dead Letter Exchange (DLX)

```python
# Declare a queue with DLX
channel.queue_declare(
    queue='orders',
    durable=True,
    arguments={
        'x-dead-letter-exchange': 'dlx',
        'x-dead-letter-routing-key': 'dead.orders',
    }
)

# Declare DLX and DLQ
channel.exchange_declare(exchange='dlx', exchange_type='direct')
channel.queue_declare(queue='dead-letters', durable=True)
channel.queue_bind(exchange='dlx', queue='dead-letters', routing_key='dead.orders')
```

A message goes to DLX when:
- `basic.nack` or `basic.reject` with `requeue=False`
- TTL expires (`x-message-ttl`)
- Queue overflows (`x-max-length` + `x-overflow=reject-publish`)

The broker adds `x-death` headers to the dead-lettered message:

```json
{
  "x-death": [{
    "count": 1,
    "exchange": "orders-exchange",
    "queue": "orders",
    "reason": "rejected",
    "routing-keys": ["orders.new"],
    "time": "2024-01-15T10:30:00Z"
  }]
}
```

---

## Publisher Confirms

By default, `basic.publish` is "fire and forget." The broker doesn't confirm receipt. If the broker crashes after writing to the network buffer — the message is lost.

**Publisher Confirms** — an extension that enables confirmations at the publisher level:

```python
# Enable confirm mode for the channel
channel.confirm_delivery()

# Synchronous publish with confirmation
try:
    channel.basic_publish(
        exchange='orders',
        routing_key='orders.new',
        body=json.dumps({'orderId': '42'}),
        properties=pika.BasicProperties(delivery_mode=2),
        mandatory=True,
    )
    print('Message confirmed by broker')
except pika.exceptions.UnroutableError:
    print('Message unroutable (mandatory=True)')
```

**Internal mechanism**: the channel enters "confirm mode." Each published message gets a monotonically increasing sequence number. The broker sends `basic.ack` (or `basic.nack`) with that number after writing to disk/memory.

```
Producer                    Broker
   |                           |
   |--basic.publish (seq=1)--->|
   |--basic.publish (seq=2)--->|
   |--basic.publish (seq=3)--->|
   |<--basic.ack (seq=1,2)-----|  (multiple=true)
   |<--basic.ack (seq=3)-------|
```

⚠️ **Common mistake**: using publisher confirms synchronously for every message. This catastrophically reduces throughput. Use async mode with batches.

---

## Consumer Prefetch (QoS)

Prefetch controls how many messages the broker sends to a consumer before receiving an ACK.

### The Problem Without Prefetch

```
Queue: [msg1, msg2, msg3, ..., msg1000]
Consumer A — receives ALL 1000 messages at once
Consumer B — receives 0 (queue is empty)
```

If Consumer A is slow — load doesn't balance. If Consumer A crashes — all 1000 messages are redelivered.

### With prefetch=1

```
Queue: [msg1, msg2, msg3, msg4, msg5]
Consumer A: receives msg1, processing...
Consumer B: receives msg2, processing...
Consumer A: ACK msg1 → receives msg3
Consumer B: ACK msg2 → receives msg4
```

Ideal round-robin. But with short messages, the overhead is high.

### Optimal Prefetch

```python
# For CPU-intensive tasks
channel.basic_qos(prefetch_count=1)

# For fast tasks (I/O bound)
channel.basic_qos(prefetch_count=20)

# For batch processing
channel.basic_qos(prefetch_count=100)
```

📌 **Rule of thumb**: start with `prefetch_count=10` and measure throughput. Increase until throughput grows. If the consumer is slow and load balancing is critical — use 1.

### global=True vs global=False

```python
# global=False (default): prefetch per consumer
channel.basic_qos(prefetch_count=10, global_=False)

# global=True: prefetch per channel (sum of all consumers)
channel.basic_qos(prefetch_count=10, global_=True)
```

---

## Flow Control

AMQP 0-9-1 has a backpressure mechanism at the connection level:

```
channel.flow(active=False)  # Stop message flow
channel.flow(active=True)   # Resume
```

Modern RabbitMQ versions use **credit-based flow control** — the broker itself manages pressure on producers when memory or disk fills up.

```
Broker → Producer: connection.blocked (reason: "memory alarm")
Producer: stops publishing, waits...
Broker → Producer: connection.unblocked
Producer: resumes publishing
```

```python
# Handle connection blocking
def on_connection_blocked(connection, reason):
    print(f'Connection blocked: {reason}')

def on_connection_unblocked(connection):
    print('Connection unblocked, resuming...')

connection = pika.BlockingConnection(
    pika.ConnectionParameters(
        blocked_connection_timeout=300  # seconds
    )
)
```

---

## Comparing AMQP with Other Protocols

### AMQP 0-9-1 vs STOMP vs MQTT

| Characteristic | AMQP 0-9-1 | STOMP | MQTT |
|---------------|-----------|-------|------|
| Format | Binary | Text | Binary |
| Complexity | High | Low | Low |
| Routing | Exchanges + Bindings | Destination string | Topics + wildcards |
| QoS | ACK/NACK/publish confirms | ACK | QoS 0/1/2 |
| Overhead | Medium | High | Minimal |
| IoT-friendly | No | No | Yes |
| Transactions | Yes (rarely) | Yes | No |
| Use case | Enterprise messaging | Simple clients | IoT, mobile |

### When to Choose AMQP (RabbitMQ)

✅ Need flexible routing (topic exchange, headers exchange)
✅ Guaranteed delivery with confirmations
✅ Dead letter queues and retry logic
✅ Priority queues
✅ RPC pattern via reply-to

❌ When maximum throughput is needed (Kafka is better)
❌ When long-term event history is needed (Kafka with retention)
❌ Resource-constrained IoT devices (MQTT is better)

---

## Mermaid: Full Broker Architecture

```mermaid
graph LR
    subgraph Client["Client"]
        P[Producer] --> CH1[Channel 1]
        C[Consumer] --> CH2[Channel 2]
    end

    subgraph Broker["RabbitMQ Broker"]
        subgraph VH["Virtual Host: /production"]
            EX1[Direct Exchange\norders] -->|binding: orders.new| Q1[Queue\norder-processing]
            EX1 -->|binding: orders.priority| Q2[Queue\norder-priority]
            EX2[Topic Exchange\nevents] -->|binding: *.error| Q3[Queue\nerror-log]
            Q1 -->|x-dead-letter-exchange| DLX[DLX Exchange]
            DLX --> DLQ[Dead Letter Queue]
        end
    end

    CH1 -->|basic.publish\nrouting_key=orders.new| EX1
    Q1 -->|basic.deliver| CH2
    CH2 -->|basic.ack| Q1
```

---

## Typical Mistakes and Best Practices

### ❌ Mistake 1: One channel for the entire application

```python
# Bad — one channel from multiple threads
channel = connection.channel()
thread1 = Thread(target=lambda: channel.basic_publish(...))
thread2 = Thread(target=lambda: channel.basic_publish(...))
```

```python
# Good — separate channel for each thread
def worker():
    ch = connection.channel()
    ch.basic_publish(...)
```

### ❌ Mistake 2: Not ack'ing messages

```python
# Bad — consumer processes but doesn't call ack
def callback(ch, method, props, body):
    process(body)
    # forgot ch.basic_ack!
```

Over time, the broker's queue fills with unacked messages. On reconnect, they're all redelivered. If the consumer rapidly connects/disconnects — "flooding" with redeliveries.

```python
# Good
def callback(ch, method, props, body):
    try:
        process(body)
        ch.basic_ack(delivery_tag=method.delivery_tag)
    except Exception as e:
        ch.basic_nack(delivery_tag=method.delivery_tag, requeue=False)
```

### ❌ Mistake 3: Non-durable queue for important data

```python
# Bad — on RabbitMQ restart, the queue disappears
channel.queue_declare(queue='orders')  # durable=False by default
```

```python
# Good
channel.queue_declare(queue='orders', durable=True)
channel.basic_publish(
    ...,
    properties=pika.BasicProperties(delivery_mode=2)  # persistent
)
```

### ❌ Mistake 4: Infinite requeue on error

```python
# Bad — poison pill message spins forever
def callback(ch, method, props, body):
    try:
        process(body)
        ch.basic_ack(delivery_tag=method.delivery_tag)
    except Exception:
        ch.basic_nack(delivery_tag=method.delivery_tag, requeue=True)
        # If process always fails — infinite loop!
```

```python
# Good — retry counter via x-death header
def callback(ch, method, props, body):
    headers = props.headers or {}
    x_death = headers.get('x-death', [{}])
    retry_count = x_death[0].get('count', 0) if x_death else 0

    try:
        process(body)
        ch.basic_ack(delivery_tag=method.delivery_tag)
    except Exception:
        if retry_count >= 3:
            ch.basic_nack(delivery_tag=method.delivery_tag, requeue=False)
        else:
            ch.basic_nack(delivery_tag=method.delivery_tag, requeue=True)
```

### ✅ Best Practice: Connection Pooling

```python
# For production: use connection pool
# pika doesn't have built-in pooling — use aio-pika or other libraries

import aio_pika

async def main():
    connection = await aio_pika.connect_robust(
        'amqp://guest:guest@localhost/',
        reconnect_interval=5,  # auto-reconnect
    )
    async with connection:
        channel = await connection.channel()
        await channel.set_qos(prefetch_count=10)
        # ...
```

### ✅ Best Practice: Idempotent Consumers

Even with manual ACK, a message can be delivered twice (on crash after processing but before ACK). The consumer must be **idempotent**:

```python
def callback(ch, method, props, body):
    message_id = props.message_id

    # Check if already processed
    if redis.sismember('processed_messages', message_id):
        ch.basic_ack(delivery_tag=method.delivery_tag)
        return

    process(body)

    # Atomic operation: save ID + ack
    with transaction:
        redis.sadd('processed_messages', message_id)
        ch.basic_ack(delivery_tag=method.delivery_tag)
```