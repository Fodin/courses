# Level 15: Exactly-Once and Transactional Outbox — Detailed Theory

## 1. Dual Write Problem: Anatomy of a Failure

Imagine an order service: client clicks "Buy", the service must:
1. Save the order in PostgreSQL
2. Publish an `OrderCreated` event to Kafka

Seems simple. But these two actions are performed independently, and there's no atomicity between them.

### Failure Scenarios

**Scenario A: DB succeeds, Broker fails**

```
Service → DB: INSERT orders → OK ✅
Service → Kafka: send OrderCreated → Connection timeout ❌

Result: order exists in DB, email not sent,
        inventory not updated, payment not initiated.
```

**Scenario B: Broker succeeds, DB fails**

```
Service → Kafka: send OrderCreated → OK ✅
Service → DB: INSERT orders → Disk full ❌

Result: downstream services process an order
        that doesn't exist in the database. Phantom order.
```

### Why this is hard

The problem is fundamental — it's a specific case of [distributed transactions](https://en.wikipedia.org/wiki/Distributed_transaction). CAP theorem says: you can't simultaneously guarantee Consistency, Availability, and Partition Tolerance.

---

## 2. Why Two-Phase Commit (2PC) doesn't work

2PC is the classic solution for distributed transactions. The coordinator asks participants "ready?", then says "commit".

### Problems with 2PC and Kafka

**1. Kafka doesn't support XA transactions**

Kafka has its own transactions (for producer idempotency and read-process-write), but doesn't support the external XA protocol needed for 2PC with a DBMS.

**2. Performance**

2PC blocks resources until all participants respond. If a Kafka broker responds slowly — the whole service slows down. P99 latency increases significantly.

**3. Coordinator — single point of failure**

If the coordinator crashes after PREPARE but before COMMIT — all participants are locked. A recovery protocol is needed, adding complexity.

**4. Practice**

In real systems, 2PC is rarely used. Netflix, Uber, Airbnb — all solve this through eventual consistency + Outbox/Saga.

---

## 3. Transactional Outbox Pattern

### The Idea

Instead of writing to two different resources — write to **one** (the DB), using DBMS atomicity.

```sql
BEGIN;
  INSERT INTO orders (id, user_id, amount, status)
  VALUES ('order-123', 'user-456', 150.00, 'created');

  INSERT INTO outbox (event_type, aggregate_id, payload, status)
  VALUES (
    'OrderCreated',
    'order-123',
    '{"orderId": "order-123", "userId": "user-456", "amount": 150.00}',
    'pending'
  );
COMMIT;
```

After commit, data is consistent within the DB. The Relay process reads `outbox` and publishes to Kafka.

### Outbox Table Design

```sql
CREATE TABLE outbox (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type    TEXT NOT NULL,
  aggregate_id  TEXT NOT NULL,
  payload       JSONB NOT NULL,
  status        TEXT NOT NULL DEFAULT 'pending',
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  published_at  TIMESTAMPTZ,
  retry_count   INT NOT NULL DEFAULT 0
);

CREATE INDEX idx_outbox_pending ON outbox (created_at)
  WHERE status = 'pending';
```

💡 Index on `(created_at) WHERE status = 'pending'` — a partial index, very fast: scans only pending rows.

### What Outbox guarantees

- ✅ If the transaction succeeds — the event **will** be published (Relay will read it)
- ✅ If the transaction rolls back — the event **won't** be published
- ✅ Data in DB and broker are always eventually consistent
- ⚠️ At-least-once: an event may be published multiple times (if Relay crashes after publishing but before marking)

---

## 4. Polling Publisher

The simplest Relay implementation — periodic polling of the outbox table.

```typescript
async function pollingPublisher() {
  while (true) {
    const pending = await db.query(`
      SELECT * FROM outbox
      WHERE status = 'pending'
      ORDER BY created_at
      LIMIT 100
      FOR UPDATE SKIP LOCKED
    `)

    for (const event of pending.rows) {
      try {
        await kafka.send({
          topic: topicFor(event.event_type),
          key: event.aggregate_id,
          value: JSON.stringify(event.payload),
          headers: { 'event-id': event.id },
        })
        await db.query(
          `UPDATE outbox SET status = 'published', published_at = NOW() WHERE id = $1`,
          [event.id]
        )
      } catch (err) {
        await db.query(
          `UPDATE outbox SET retry_count = retry_count + 1 WHERE id = $1`,
          [event.id]
        )
      }
    }
    await sleep(1000)
  }
}
```

### FOR UPDATE SKIP LOCKED

Critical detail for horizontal Relay scaling:

```sql
SELECT * FROM outbox WHERE status = 'pending' FOR UPDATE SKIP LOCKED
```

Without `SKIP LOCKED`, multiple Relay instances would compete and process the same events.

---

## 5. Log-based CDC as an alternative

Instead of polling the table — read the **Write-Ahead Log** (WAL). The DBMS writes all changes to WAL before applying them. A CDC tool reads WAL and streams changes.

### How PostgreSQL WAL works

```
Query: INSERT INTO outbox VALUES (...)
       ↓
WAL Writer: writes LSN=0/1A2B3C { INSERT outbox ... }
       ↓
Executor: applies change to the table
       ↓
Replication Slot: Debezium reads the LSN position
       ↓
Kafka: publishes the event
```

---

## 6. Debezium: CDC for Production

Debezium is an open-source CDC platform from Red Hat, running on Kafka Connect.

### Architecture

```
PostgreSQL WAL → Debezium PostgreSQL Connector → Kafka Topics:
                                           db.public.orders
                                           db.public.payments
```

### Debezium Event Envelope

Each CDC event contains `before`, `after`, `op`, `source` fields.

Operation values: `c` (create), `u` (update), `d` (delete), `r` (read/snapshot).

---

## 7. Outbox Event Router

Debezium can be configured to read the `outbox` table specifically and route events to topics.

```
DB: INSERT INTO outbox (event_type, aggregate_id, payload)
         ↓
Debezium reads WAL: new row in outbox
         ↓
EventRouter transform:
  - reads event_type → determines topic
  - reads aggregate_id → uses as Kafka key
  - reads payload → message body
         ↓
Kafka topic: orders.OrderCreated
  key: "order-123"
  value: {"orderId": "order-123", "amount": 150}
```

Advantage: **no separate Relay process needed**. Debezium reads outbox from WAL and routes to the right topics.

---

## 8. Exactly-Once: the full picture

Outbox gives at-least-once. For exactly-once, idempotency is needed at each stage.

```
Outbox (at-least-once from DB)
    +
Idempotent Kafka Producer (dedup at broker level)
    +
Idempotent Consumer (Inbox pattern, dedup at consumer level)
    =
Exactly-Once semantics for business logic
```

---

## 9. Inbox Pattern (Idempotent Consumer)

The consumer must protect against duplicates that at-least-once inevitably creates.

```sql
CREATE TABLE inbox (
  event_id    UUID PRIMARY KEY,
  event_type  TEXT NOT NULL,
  processed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

```typescript
async function processEvent(event: KafkaMessage) {
  const eventId = event.headers['event-id'] as string
  await db.transaction(async tx => {
    const existing = await tx.query('SELECT 1 FROM inbox WHERE event_id = $1', [eventId])
    if (existing.rows.length > 0) return // duplicate
    // Business logic
    await tx.query('UPDATE inventory SET quantity = quantity - $1 WHERE ...', [event.payload.quantity])
    await tx.query('INSERT INTO inbox (event_id, event_type) VALUES ($1, $2)', [eventId, event.payload.type])
  })
}
```

---

## 10. Comparing approaches

| Characteristic | Polling Relay | CDC (Debezium) | LISTEN/NOTIFY |
|---|---|---|---|
| Setup complexity | Low | High | Medium |
| Latency | 1-5 sec | < 100ms | < 50ms |
| DB load | Medium | Minimal | Minimal |
| Notification persistence | Yes (in table) | Yes (WAL) | No |
| Horizontal scaling | SKIP LOCKED | Kafka Connect distributed | Hard |

### When to choose what

**Polling Publisher** — for most microservices:
- Small throughput (< 1000 events/sec)
- No dedicated Kafka Connect infrastructure
- Need fast implementation

**Debezium CDC** — for high-load systems:
- Many tables/events
- Real-time streaming needed
- Kafka Connect infrastructure exists
- Full change history needed (audit log)

**LISTEN/NOTIFY** — for PostgreSQL-only systems:
- Minimal latency matters
- No ability to use Debezium
- Fallback polling required

---

## ⚠️ Common mistakes

**1. Publishing before commit**

❌ Publishing before the transaction commits means the event may be sent even if the transaction rolls back.

✅ Write to outbox in the same transaction, let Relay publish after commit.

**2. No idempotency at the consumer**

❌ Processing without dedup → duplicate effects (double emails, double charges).

✅ Check idempotency key before processing, record after.

**3. Forgetting the outbox index**

❌ Without index: full table scan every second.

✅ Partial index: `CREATE INDEX idx_outbox_pending ON outbox (created_at) WHERE status = 'pending'`

**4. Not monitoring WAL lag with Debezium**

✅ Monitor: `debezium_connector_lag_seconds < 5`

**5. Replication slot without monitoring**

✅ Check regularly: `SELECT slot_name, pg_size_pretty(pg_wal_lsn_diff(...)) AS lag FROM pg_replication_slots`
