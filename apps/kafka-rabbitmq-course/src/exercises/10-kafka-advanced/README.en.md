# Level 10: Kafka — Advanced Features

## Kafka Streams

Kafka Streams is a library for processing data directly within Kafka topics. No separate cluster needed: the application itself is the streaming processor.

```mermaid
graph LR
    A[Source Topic] --> B[KStream]
    B --> C[filter]
    C --> D[map / flatMap]
    D --> E[groupByKey]
    E --> F[aggregate / reduce]
    F --> G[KTable]
    G --> H[Sink Topic]

    I[State Store<br/>RocksDB] -.->|stores state| F
    J[Changelog Topic] -.->|backup| I
```

**KStream** — infinite stream of events. Each record is an independent event.
**KTable** — materialized view: only the latest value for each key. Behaves like a DB table.

### Windowed Aggregations

```mermaid
graph LR
    A[Tumbling<br/>fixed<br/>non-overlapping] --> B[Hopping<br/>fixed<br/>overlapping]
    B --> C[Sliding<br/>by time<br/>distance between records]
    C --> D[Session<br/>user<br/>activity]
```

💡 Windowing only works with groupBy + aggregate operations.

---

## KStream vs KTable

| Characteristic | KStream | KTable |
|---------------|---------|--------|
| Semantics | Event stream | Update table |
| Duplicate keys | All records | Latest only |
| Join with KStream | stream-stream join | stream-table join |
| Analogy | INSERT | UPSERT |

---

## Kafka Connect

Ready-made framework for integration with external systems without code.

```mermaid
graph LR
    DB[(PostgreSQL)] --> SC[Source<br/>Connector]
    SC --> KT[Kafka Topic]
    KT --> SK[Sink<br/>Connector]
    SK --> ES[(Elasticsearch)]

    SMT[SMT<br/>Single Message<br/>Transform] -.->|transform| SC
    SMT -.->|transform| SK
```

**Source Connector** — reads data from an external system, writes to Kafka.
**Sink Connector** — reads from Kafka, writes to an external system.

---

## Schema Registry

Stores message schemas (Avro, JSON Schema, Protobuf) and ensures compatibility.

```mermaid
graph LR
    P[Producer] -->|1. register schema| SR[(Schema Registry)]
    SR -->|2. schema id| P
    P -->|3. id + encoded data| K[Kafka Topic]
    K -->|4. read| C[Consumer]
    C -->|5. fetch schema by id| SR
    SR -->|6. schema| C
```

Compatibility modes: **BACKWARD** (new schema reads old data), **FORWARD**, **FULL**.

---

## Log Compaction

Kafka stores only the **latest** value for each key. Tombstone (null value) = deletion.

```mermaid
graph LR
    A[Segments before compaction<br/>user:1 v1, user:1 v2, user:2 v1] -->|cleaner thread| B[After compaction<br/>user:1 v2, user:2 v1]
    B -->|tombstone| C[Key disappears<br/>from compacted log]
```

---

## Exactly-Once Semantics

Three levels of guarantees: at-most-once, at-least-once, exactly-once.

```mermaid
graph LR
    P[Producer] -->|beginTransaction| TC[Transaction<br/>Coordinator]
    P -->|produce to A, B, C| K[Kafka Brokers]
    P -->|commitTransaction| TC
    TC -->|COMMITTED marker| K
    C[Consumer<br/>read_committed] -->|sees only COMMITTED| K
```

⚠️ Requires: `transactional.id`, `enable.idempotence=true`, consumer `isolation.level=read_committed`.
