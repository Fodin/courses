# Уровень 10: Kafka — продвинутые возможности

## Kafka Streams

Kafka Streams — библиотека для обработки данных прямо внутри Kafka-топиков. Никакого отдельного кластера не нужно: приложение само является потоковым процессором.

```mermaid
graph LR
    A[Source Topic] --> B[KStream]
    B --> C[filter]
    C --> D[map / flatMap]
    D --> E[groupByKey]
    E --> F[aggregate / reduce]
    F --> G[KTable]
    G --> H[Sink Topic]

    I[State Store<br/>RocksDB] -.->|хранит состояние| F
    J[Changelog Topic] -.->|резервирование| I
```

**KStream** — бесконечный поток событий. Каждая запись — независимое событие.
**KTable** — материализованное представление: только последнее значение для каждого ключа. Ведёт себя как таблица БД.

### Оконные агрегации

```mermaid
graph LR
    A[Tumbling<br/>фиксированные<br/>неперекрывающиеся] --> B[Hopping<br/>фиксированные<br/>перекрывающиеся]
    B --> C[Sliding<br/>по временному<br/>расстоянию записей]
    C --> D[Session<br/>активность<br/>пользователя]
```

💡 Windowing работает только с операциями groupBy + aggregate.

---

## KStream vs KTable

| Характеристика | KStream | KTable |
|---------------|---------|--------|
| Семантика | Поток событий | Таблица обновлений |
| Дубликаты ключей | Все записи | Только последняя |
| Join с KStream | stream-stream join | stream-table join |
| Аналогия | INSERT | UPSERT |

---

## Kafka Connect

Готовый фреймворк для интеграции с внешними системами без кода.

```mermaid
graph LR
    DB[(PostgreSQL)] --> SC[Source<br/>Connector]
    SC --> KT[Kafka Topic]
    KT --> SK[Sink<br/>Connector]
    SK --> ES[(Elasticsearch)]

    SMT[SMT<br/>Single Message<br/>Transform] -.->|трансформация| SC
    SMT -.->|трансформация| SK
```

**Source Connector** — читает данные из внешней системы, пишет в Kafka.
**Sink Connector** — читает из Kafka, пишет во внешнюю систему.

---

## Schema Registry

Хранит схемы сообщений (Avro, JSON Schema, Protobuf) и обеспечивает совместимость.

```mermaid
graph LR
    P[Producer] -->|1. register schema| SR[(Schema Registry)]
    SR -->|2. schema id| P
    P -->|3. id + encoded data| K[Kafka Topic]
    K -->|4. read| C[Consumer]
    C -->|5. fetch schema by id| SR
    SR -->|6. schema| C
```

Режимы совместимости: **BACKWARD** (новая схема читает старые данные), **FORWARD**, **FULL**.

---

## Log Compaction

Kafka хранит только **последнее** значение для каждого ключа. Tombstone (null value) = удаление.

```mermaid
graph LR
    A[Сегменты до compaction<br/>user:1 v1, user:1 v2, user:2 v1] -->|cleaner thread| B[После compaction<br/>user:1 v2, user:2 v1]
    B -->|tombstone| C[Ключ исчезает<br/>из compacted лога]
```

---

## Exactly-Once Semantics

Три уровня гарантий: at-most-once, at-least-once, exactly-once.

```mermaid
graph LR
    P[Producer] -->|beginTransaction| TC[Transaction<br/>Coordinator]
    P -->|produce to A, B, C| K[Kafka Brokers]
    P -->|commitTransaction| TC
    TC -->|COMMITTED marker| K
    C[Consumer<br/>read_committed] -->|видит только COMMITTED| K
```

⚠️ Requires: `transactional.id`, `enable.idempotence=true`, consumer `isolation.level=read_committed`.
