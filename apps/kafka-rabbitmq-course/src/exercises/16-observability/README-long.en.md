# Level 16: Observability and Monitoring (detailed)

## Why observability is more important than monitoring

Classic **monitoring** answers "is everything working?" with predefined metrics. **Observability** answers "why did it break?" — including for scenarios nobody thought about during development.

In messaging systems this is especially important: the broker is an asynchronous intermediary. When a payment fails, how do you know — is it stuck in the queue? Did the consumer crash? Is the message format wrong? Without observability, the answer requires hours of log investigation.

---

## Metrics with Prometheus and JMX Exporter

### Kafka metrics collection architecture

```
Kafka Broker (JMX port :9999) → JMX Exporter (:7071/metrics) → Prometheus → Grafana
                                                              → Alertmanager → Slack / PagerDuty
```

JMX Exporter — a Java agent that translates JMX MBeans into Prometheus format. Launched with Kafka via the `-javaagent` flag.

---

## Kafka Metrics Deep Dive

### Consumer Lag — the key operational metric

Consumer Lag = Log-End Offset (LEO) − Current Committed Offset

```
Producer writes:  [msg1][msg2][msg3][msg4][msg5]  ← LEO = 5
Consumer read:    [msg1][msg2][msg3]               ← Committed = 3
                                      ^^^^^^^^
                                      LAG = 2
```

Lag is measured per **partition**. Total group lag = sum of lags across all partitions.

#### Burrow tool

Burrow (LinkedIn) — a specialized consumer lag monitoring service. Unlike simple numeric thresholds, Burrow analyzes the **trend**: is lag stable, growing, or shrinking?

Burrow states:
- **GOOD** — lag is stable or shrinking
- **WARNING** — lag growing, but consumer is reading
- **ERR** — lag growing sharply
- **STALLED** — consumer reads, but lag doesn't decrease (processing too slow)
- **STOPPED** — consumer stopped committing offsets

### UnderReplicatedPartitions

Number of partitions with fewer replicas than specified in `replication.factor`. Should always be **0**.

### RequestsPerSec and BytesInPerSec / BytesOutPerSec

```
BytesInPerSec  — incoming throughput (producer → broker)
BytesOutPerSec — outgoing throughput (broker → consumer)
RequestsPerSec — number of requests (Produce, Fetch, Metadata) per second
```

### ActiveControllerCount

A Kafka cluster should always have exactly **one** controller. If 0 — the cluster has no controller and won't accept new partitions. If > 1 — split brain.

---

## RabbitMQ Metrics

### Queue Depth

```
rabbitmq_queue_messages_total — total messages in queue
rabbitmq_queue_messages_ready — ready for consumer delivery
rabbitmq_queue_messages_unacked — delivered but not acknowledged
```

High `messages_unacked` with zero `messages_ready` — consumer receives messages but doesn't ACK (processing stuck or consumer crashed after receiving).

### Message Rates

```
rabbitmq_queue_messages_published_total — publish rate (msg/s)
rabbitmq_queue_messages_delivered_total — delivery rate (msg/s)
rabbitmq_queue_messages_acked_total     — acknowledgment rate (msg/s)
```

In steady state: `published_rate ≈ delivered_rate ≈ acked_rate`. Divergence indicates a problem.

---

## Distributed Tracing with OpenTelemetry

### Concepts

**Trace** — the full processing tree of one request, from entry to exit. Identified by `trace_id`.

**Span** — one logical step within a trace. Has:
- `span_id` — unique step ID
- `parent_span_id` — parent step ID
- `start_time`, `end_time`
- Attributes (tags): `http.method`, `messaging.system`, `db.statement`
- Status: OK / ERROR

### OpenTelemetry SDK

OpenTelemetry is the de-facto standard for observability. Supports all three pillars (metrics, logs, traces).

```typescript
import { KafkaJsInstrumentation } from '@opentelemetry/instrumentation-kafkajs'

// Auto-instrumentation of KafkaJS — spans created automatically
registerInstrumentations({
  instrumentations: [new KafkaJsInstrumentation()],
})
```

---

## Trace Context Propagation in Kafka messages

Problem: HTTP requests pass context through headers automatically. In Kafka, producer and consumer are separated — no automatic "channel" for trace context.

Solution: **W3C TraceContext** — a standard for passing context via the `traceparent` field.

### traceparent format

```
traceparent: 00-4bf92f3577b34da6a3ce929d0e0e4736-00f067aa0ba902b7-01
              ^  ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ ^^^^^^^^^^^^^^^^ ^^
              v  trace-id (16 bytes hex)          span-id (8 bytes) flags
```

### Propagation on publish

```typescript
import { propagation, context } from '@opentelemetry/api'

async function publishOrder(order: Order) {
  const headers: Record<string, string> = {}
  propagation.inject(context.active(), headers)
  await producer.send({
    topic: 'orders',
    messages: [{ key: order.id, value: JSON.stringify(order), headers }],
  })
}
```

### Extraction on consume

```typescript
consumer.run({
  eachMessage: async ({ message }) => {
    const parentContext = propagation.extract(ROOT_CONTEXT, message.headers ?? {})
    return context.with(parentContext, async () => {
      const span = tracer.startSpan('processOrder')
      try {
        await processOrder(JSON.parse(message.value!.toString()))
        span.setStatus({ code: SpanStatusCode.OK })
      } catch (err) {
        span.recordException(err as Error)
        span.setStatus({ code: SpanStatusCode.ERROR })
      } finally { span.end() }
    })
  },
})
```

---

## Correlation ID Pattern

A simpler alternative to full distributed tracing — **Correlation ID**. One UUID passed through all services in message headers and logs.

```typescript
interface MessageHeaders {
  correlationId: string
  causationId: string   // ID of the event that caused this
  timestamp: string
}
```

Advantage: minimal dependencies. Disadvantage: no timing information — can't build a waterfall diagram.

---

## Alerting Strategies and Runbooks

### Prometheus alert rules (Kafka)

```yaml
groups:
  - name: kafka-alerts
    rules:
      - alert: KafkaConsumerLagWarning
        expr: kafka_consumer_records_lag > 500
        for: 5m
        labels:
          severity: warning
      - alert: KafkaConsumerLagCritical
        expr: kafka_consumer_records_lag > 2000
        for: 3m
        labels:
          severity: critical
      - alert: KafkaUnderReplicatedPartitions
        expr: kafka_server_under_replicated_partitions > 0
        for: 1m
        labels:
          severity: critical
```

---

## SLI/SLO for Messaging Systems

**SLI (Service Level Indicator)** — measurable quality indicator.

**SLO (Service Level Objective)** — target SLI value.

| SLI | Example SLO |
|---|---|
| End-to-end latency (produce → consume) | P99 < 500ms over rolling 30 days |
| Consumer Lag | < 1000 msgs 99.9% of time |
| Message loss rate | 0 lost messages |
| Broker availability | 99.95% uptime |

Key idea: alert not on threshold breach, but on **error budget burn rate**. If you burned 5% of the monthly budget in 1 hour — something is very wrong.

---

## ⚠️ Common beginner mistakes

**1. Alert without `for` — triggers on short spikes**

A short lag spike during burst traffic is completely normal. An alert without a time window will be "crying wolf".

**2. No trace context in Kafka headers**

The trace in Service A ends at produce. Service B starts a new trace. Impossible to link end-to-end.

**3. Monitoring only broker, not consumer**

If the consumer crashes — the broker looks healthy. Lag grows silently.

**4. Too many alerts — alert fatigue**

10 firing alerts simultaneously → on-call ignores them all. Better to have 3 well-calibrated alerts than 30 noisy ones.

**5. Charts without context**

A standalone "Consumer Lag" chart is useless without comparison to "Produce Rate". Growing lag with growing produce rate — normal. Growing lag with stable produce rate — problem.
