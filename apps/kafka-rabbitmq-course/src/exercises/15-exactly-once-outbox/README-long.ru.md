# Уровень 15: Exactly-Once и Transactional Outbox — Подробная теория

## 1. Dual Write Problem: анатомия сбоя

Представьте сервис заказов: клиент нажимает «Купить», сервис должен:
1. Сохранить заказ в PostgreSQL
2. Опубликовать событие `OrderCreated` в Kafka

Кажется просто. Но эти два действия выполняются независимо, и между ними нет атомарности.

### Сценарии отказа

**Сценарий A: DB успешно, Broker упал**

```
Service → DB: INSERT orders → OK ✅
Service → Kafka: send OrderCreated → Connection timeout ❌

Результат: заказ есть в DB, email не отправлен,
           inventory не обновлён, payment не инициирован.
```

**Сценарий B: Broker успешно, DB упала**

```
Service → Kafka: send OrderCreated → OK ✅
Service → DB: INSERT orders → Disk full ❌

Результат: downstream сервисы обрабатывают заказ,
           которого нет в базе. Phantom order.
```

**Сценарий C: Partial success после сбоя сети**

```
Service → DB: INSERT → OK
Service → Kafka: send → TCP отправлен... сеть упала
Kafka: получил? неизвестно.
Service: ретраить или нет?

Ретрай → дублирование
Не ретраить → потеря
```

### Почему это сложно

Проблема фундаментальна — это частный случай [распределённых транзакций](https://en.wikipedia.org/wiki/Distributed_transaction). Теорема CAP говорит: невозможно одновременно обеспечить Consistency, Availability и Partition Tolerance.

```
Два ресурса: PostgreSQL + Kafka
Нужна атомарность: либо оба, либо никто
Нет общего coordinator → нет атомарности
```

---

## 2. Почему Two-Phase Commit (2PC) не работает

2PC — классическое решение распределённых транзакций. Coordinator спрашивает участников «готовы?», затем говорит «коммить».

```
Coordinator
    │
    ├─── PREPARE ──► PostgreSQL: OK
    ├─── PREPARE ──► Kafka: ???
    │
    └─── COMMIT ───► оба
```

### Проблемы 2PC с Kafka

**1. Kafka не поддерживает XA-транзакции**

Kafka имеет свои транзакции (для producer idempotency и read-process-write), но не поддерживает внешний XA-протокол, необходимый для 2PC с СУБД.

**2. Производительность**

2PC блокирует ресурсы до получения ответа от всех участников. Если Kafka-брокер медленно отвечает — весь сервис тормозит. Latency P99 существенно вырастает.

**3. Coordinator — точка отказа**

Если coordinator упал после PREPARE, но до COMMIT — все участники заблокированы. Нужен recovery-протокол, что добавляет сложность.

**4. Практика**

В реальных системах 2PC используется редко. Netflix, Uber, Airbnb — все решают задачу через eventual consistency + Outbox/Saga.

---

## 3. Transactional Outbox Pattern

### Идея

Вместо записи в два разных ресурса — записать в **один** (БД), используя атомарность СУБД.

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

После коммита данные консистентны внутри DB. Relay-процесс читает `outbox` и публикует в Kafka.

### Дизайн таблицы Outbox

```sql
CREATE TABLE outbox (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type    TEXT NOT NULL,           -- 'OrderCreated', 'PaymentProcessed'
  aggregate_id  TEXT NOT NULL,           -- ID сущности (для партиционирования)
  payload       JSONB NOT NULL,          -- тело события
  status        TEXT NOT NULL            -- 'pending' | 'published' | 'failed'
                DEFAULT 'pending',
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  published_at  TIMESTAMPTZ,
  retry_count   INT NOT NULL DEFAULT 0
);

CREATE INDEX idx_outbox_pending ON outbox (created_at)
  WHERE status = 'pending';
```

💡 Индекс по `(created_at) WHERE status = 'pending'` — partial index, очень быстрый: сканирует только pending-строки.

### Что гарантирует Outbox

- ✅ Если транзакция успешна — событие **будет** опубликовано (Relay его прочитает)
- ✅ Если транзакция откатилась — событие **не будет** опубликовано
- ✅ Данные в DB и в брокере всегда консистентны (eventual)
- ⚠️ At-least-once: событие может быть опубликовано несколько раз (если Relay упал после публикации, но до отметки)

---

## 4. Polling Publisher

Простейшая реализация Relay — периодический опрос outbox таблицы.

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
          `UPDATE outbox SET status = 'published', published_at = NOW()
           WHERE id = $1`,
          [event.id]
        )
      } catch (err) {
        await db.query(
          `UPDATE outbox SET retry_count = retry_count + 1
           WHERE id = $1`,
          [event.id]
        )
      }
    }

    await sleep(1000)
  }
}
```

### FOR UPDATE SKIP LOCKED

Критически важная деталь при горизонтальном масштабировании Relay:

```sql
SELECT * FROM outbox
WHERE status = 'pending'
FOR UPDATE SKIP LOCKED  -- другие инстанции пропускают залоченные строки
```

Без `SKIP LOCKED` несколько экземпляров Relay будут конкурировать и обрабатывать одни события.

### Плюсы и минусы Polling Publisher

| Аспект | Оценка |
|--------|--------|
| Простота реализации | ✅ Очень просто |
| Дополнительные зависимости | ✅ Только DB |
| Нагрузка на DB | ⚠️ SELECT каждую секунду |
| Latency | ⚠️ 1-5 сек задержки |
| Масштабирование | ✅ SKIP LOCKED решает |
| Мониторинг | ✅ SELECT COUNT WHERE pending |

---

## 5. Log-based CDC как альтернатива Relay

Вместо опроса таблицы — читать **Write-Ahead Log** (WAL) базы данных. СУБД записывает все изменения в WAL перед применением. CDC-инструмент читает WAL и стримит изменения.

### Как работает WAL PostgreSQL

```
Запрос: INSERT INTO outbox VALUES (...)
           ↓
WAL Writer: записывает LSN=0/1A2B3C { INSERT outbox ... }
           ↓
Executor: применяет изменение к таблице
           ↓
Replication Slot: Debezium читает LSN позицию
           ↓
Kafka: публикует событие
```

LSN (Log Sequence Number) — монотонно возрастающий указатель в WAL. Debezium сохраняет последнюю прочитанную LSN позицию в Kafka offset.

### Replication Slot

```sql
-- Создать logical replication slot для Debezium
SELECT pg_create_logical_replication_slot(
  'debezium_slot',
  'pgoutput'      -- output plugin
);

-- Посмотреть текущие слоты
SELECT slot_name, plugin, active, restart_lsn
FROM pg_replication_slots;
```

⚠️ Replication slot задерживает очистку WAL — необходимо мониторить `pg_replication_slots.pg_size_pretty(pg_wal_lsn_diff(...))`.

---

## 6. Debezium: CDC для продакшена

Debezium — open-source CDC-платформа от Red Hat, работающая поверх Kafka Connect.

### Архитектура

```
PostgreSQL WAL
      │
      ▼
Debezium PostgreSQL Connector (Kafka Connect worker)
      │
      ▼
Kafka Topics:
  db.public.orders     ← все изменения таблицы orders
  db.public.payments   ← все изменения таблицы payments
  db.public.inventory  ← все изменения таблицы inventory
```

### Конфигурация коннектора

```json
{
  "name": "orders-connector",
  "config": {
    "connector.class": "io.debezium.connector.postgresql.PostgresConnector",
    "database.hostname": "postgres",
    "database.port": "5432",
    "database.user": "debezium",
    "database.password": "secret",
    "database.dbname": "orders_db",
    "database.server.name": "db",
    "table.include.list": "public.orders,public.outbox",
    "plugin.name": "pgoutput",
    "slot.name": "debezium_slot",
    "publication.name": "debezium_pub",
    "transforms": "outbox",
    "transforms.outbox.type": "io.debezium.transforms.outbox.EventRouter"
  }
}
```

### Debezium Event Envelope

Каждое CDC-событие содержит:

```json
{
  "schema": { ... },
  "payload": {
    "before": {
      "id": "order-123",
      "amount": 100,
      "status": "created"
    },
    "after": {
      "id": "order-123",
      "amount": 150,
      "status": "updated"
    },
    "op": "u",
    "ts_ms": 1712345678000,
    "source": {
      "connector": "postgresql",
      "db": "orders_db",
      "schema": "public",
      "table": "orders",
      "lsn": 27648256,
      "txId": 756
    }
  }
}
```

Значения `op`:
- `c` — create (INSERT)
- `u` — update (UPDATE)
- `d` — delete (DELETE)
- `r` — read (initial snapshot)

---

## 7. Outbox Event Router (Debezium трансформация)

Debezium можно настроить для чтения именно `outbox`-таблицы и роутинга событий по топикам.

### Как работает EventRouter

```
DB: INSERT INTO outbox (event_type, aggregate_id, payload)
              ↓
Debezium читает WAL: новая строка в outbox
              ↓
EventRouter трансформация:
  - читает поле event_type → определяет topic
  - читает поле aggregate_id → использует как Kafka key
  - читает поле payload → тело сообщения
              ↓
Kafka topic: orders.OrderCreated
  key: "order-123"
  value: {"orderId": "order-123", "amount": 150}
```

### Конфигурация EventRouter

```json
{
  "transforms": "outbox",
  "transforms.outbox.type": "io.debezium.transforms.outbox.EventRouter",
  "transforms.outbox.route.by.field": "event_type",
  "transforms.outbox.route.topic.replacement": "orders.${routedByValue}",
  "transforms.outbox.table.field.event.id": "id",
  "transforms.outbox.table.field.event.key": "aggregate_id",
  "transforms.outbox.table.field.event.payload": "payload"
}
```

Преимущество: **не нужен отдельный Relay-процесс**. Debezium сам читает outbox из WAL и роутит в нужные топики.

---

## 8. Схема эволюции событий в CDC

Одна из сложностей CDC — изменение схемы таблицы ломает consumers.

### Schema Registry + Avro

```
PostgreSQL: ALTER TABLE orders ADD COLUMN discount DECIMAL;
                    ↓
Debezium: обновляет Avro-схему в Schema Registry
                    ↓
Kafka: сообщения содержат schema_id в заголовке
                    ↓
Consumer: десериализует по актуальной схеме
```

### Правила совместимости

```
BACKWARD: новый consumer читает старые сообщения
FORWARD: старый consumer читает новые сообщения
FULL: оба направления
```

⚠️ Удаление колонки — breaking change. Всегда сначала делать поле nullable, дать consumer-ам обновиться, затем удалять.

---

## 9. Listen/Notify PostgreSQL

Альтернатива polling для Relay — механизм `LISTEN/NOTIFY` в PostgreSQL. Relay подписывается на канал, триггер уведомляет при вставке в outbox.

```sql
-- Триггер на outbox
CREATE OR REPLACE FUNCTION notify_outbox()
RETURNS TRIGGER AS $$
BEGIN
  PERFORM pg_notify('outbox_events', NEW.id::text);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER outbox_notify
  AFTER INSERT ON outbox
  FOR EACH ROW EXECUTE FUNCTION notify_outbox();
```

```typescript
// Relay слушает уведомления
const client = new pg.Client(connectionConfig)
await client.connect()
await client.query('LISTEN outbox_events')

client.on('notification', async (msg) => {
  const eventId = msg.payload
  const event = await db.query('SELECT * FROM outbox WHERE id = $1', [eventId])
  await publishToKafka(event.rows[0])
  await markPublished(eventId)
})
```

### Плюсы LISTEN/NOTIFY

- ✅ Минимальная задержка (реальное время)
- ✅ Нет polling-нагрузки на DB
- ✅ Простая реализация

### Минусы

- ⚠️ Уведомления не persist — если Relay недоступен, уведомления теряются
- ⚠️ Нужен fallback-polling для восстановления после downtime
- ⚠️ Не работает через пул соединений (нужен dedicated connection)

---

## 10. Kafka Connect + Debezium в продакшене

### Конфигурация Kafka Connect (Distributed Mode)

```yaml
# docker-compose.yml
kafka-connect:
  image: debezium/connect:2.5
  environment:
    BOOTSTRAP_SERVERS: kafka:9092
    GROUP_ID: connect-cluster
    CONFIG_STORAGE_TOPIC: connect-configs
    OFFSET_STORAGE_TOPIC: connect-offsets
    STATUS_STORAGE_TOPIC: connect-statuses
    CONFIG_STORAGE_REPLICATION_FACTOR: 3
    OFFSET_STORAGE_REPLICATION_FACTOR: 3
    KEY_CONVERTER: org.apache.kafka.connect.json.JsonConverter
    VALUE_CONVERTER: io.confluent.connect.avro.AvroConverter
    VALUE_CONVERTER_SCHEMA_REGISTRY_URL: http://schema-registry:8081
```

### Monitoring

```bash
# REST API Kafka Connect
# Статус коннектора
curl http://connect:8083/connectors/orders-connector/status

# Текущие offsets (LSN позиция)
curl http://connect:8083/connectors/orders-connector/offsets

# Метрики
curl http://connect:8083/connectors/orders-connector/metrics
```

Ключевые метрики для мониторинга:

| Метрика | Нормальное значение |
|---------|---------------------|
| `source-record-poll-rate` | > 0 при активности |
| `connector-rebalances-total` | 0 в steady state |
| `task-count` | = configured |
| WAL lag | < 1MB в норме |

---

## 11. Exactly-Once: полная картина

Outbox даёт at-least-once. Для exactly-once нужна идемпотентность на каждом этапе.

### Kafka Producer Idempotency

```typescript
const producer = kafka.producer({
  idempotent: true,          // включает idempotent producer
  maxInFlightRequests: 5,    // при idempotent=true max=5
  transactionalId: 'relay-producer-1'  // для Kafka transactions
})
```

С `idempotent: true` Kafka отслеживает sequence number и не дублирует сообщения при ретраях.

### Kafka Transactions (Exactly-Once для Streams)

```typescript
await producer.transaction(async tx => {
  // Читаем из одного топика, пишем в другой — атомарно
  await tx.send({ topic: 'output', messages: processed })
  await tx.sendOffsets({
    consumerGroupId: 'my-group',
    topics: [{ topic: 'input', partition: 0, offset: String(offset + 1) }]
  })
})
```

### End-to-end Exactly-Once

```
Outbox (at-least-once из DB)
    +
Idempotent Kafka Producer (дедуп на уровне broker)
    +
Idempotent Consumer (Inbox pattern, дедуп на уровне consumer)
    =
Exactly-Once семантика для бизнес-логики
```

---

## 12. Inbox Pattern (Idempotent Consumer)

Consumer должен защититься от дубликатов, которые at-least-once неизбежно создаёт.

### Реализация Inbox

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
    // Проверяем: не обрабатывали ли уже?
    const existing = await tx.query(
      'SELECT 1 FROM inbox WHERE event_id = $1',
      [eventId]
    )

    if (existing.rows.length > 0) {
      console.log(`Duplicate event ${eventId}, skipping`)
      return
    }

    // Бизнес-логика
    await tx.query('UPDATE inventory SET quantity = quantity - $1 WHERE ...',
      [event.payload.quantity])

    // Запоминаем что обработали
    await tx.query('INSERT INTO inbox (event_id, event_type) VALUES ($1, $2)',
      [eventId, event.payload.type])
  })
}
```

### Очистка Inbox

```sql
-- Удалять старые записи (события старше N дней уже не придут повторно)
DELETE FROM inbox WHERE processed_at < NOW() - INTERVAL '7 days';
```

---

## 13. Мониторинг Outbox в продакшене

### Ключевые метрики

```sql
-- Количество pending событий (должно быть близко к 0)
SELECT COUNT(*) FROM outbox WHERE status = 'pending';

-- Возраст самого старого pending события (SLA alert)
SELECT EXTRACT(EPOCH FROM NOW() - MIN(created_at)) AS lag_seconds
FROM outbox WHERE status = 'pending';

-- Количество ошибок
SELECT COUNT(*) FROM outbox
WHERE retry_count > 0 AND status = 'pending';
```

### Alerting правила

```yaml
# Prometheus alert rules
- alert: OutboxLag
  expr: outbox_pending_oldest_seconds > 60
  labels:
    severity: warning
  annotations:
    summary: "Outbox events not published for >60s"

- alert: OutboxBacklog
  expr: outbox_pending_count > 1000
  labels:
    severity: critical
```

---

## 14. Dead Letter Queue для Outbox

Если событие не удаётся опубликовать после N попыток — перемещаем в DLQ.

```typescript
const MAX_RETRIES = 5

async function relayWithDLQ() {
  const pending = await db.query(`
    SELECT * FROM outbox
    WHERE status = 'pending' AND retry_count < $1
    FOR UPDATE SKIP LOCKED LIMIT 100
  `, [MAX_RETRIES])

  for (const event of pending.rows) {
    try {
      await kafka.send({ topic: ..., value: event.payload })
      await markPublished(event.id)
    } catch (err) {
      if (event.retry_count + 1 >= MAX_RETRIES) {
        // Перемещаем в DLQ
        await db.query(`
          UPDATE outbox SET status = 'failed'
          WHERE id = $1
        `, [event.id])
        // Или: INSERT INTO outbox_dlq SELECT * FROM outbox WHERE id = $1
        await alertOncall(`Outbox event ${event.id} exhausted retries`)
      } else {
        await incrementRetry(event.id)
      }
    }
  }
}
```

---

## 15. Сравнение подходов

| Характеристика | Polling Relay | CDC (Debezium) | LISTEN/NOTIFY |
|---|---|---|---|
| Сложность setup | Низкая | Высокая | Средняя |
| Latency | 1-5 сек | < 100ms | < 50ms |
| Нагрузка на DB | Средняя | Минимальная | Минимальная |
| Persistence уведомлений | Да (в таблице) | Да (WAL) | Нет |
| Зависимости | Только DB | Debezium + Kafka Connect | Только DB |
| Горизонтальное масштабирование | SKIP LOCKED | Kafka Connect distributed | Сложно |
| Поддержка schema evolution | Ручная | Avro + Schema Registry | Ручная |

### Когда что выбирать

**Polling Publisher** — для большинства микросервисов:
- Небольшой throughput (< 1000 событий/сек)
- Нет выделенной инфраструктуры для Kafka Connect
- Нужна быстрая реализация

**Debezium CDC** — для высоконагруженных систем:
- Много таблиц/событий
- Нужен реальный-time стриминг
- Уже есть Kafka Connect инфраструктура
- Нужна полная история изменений (audit log)

**LISTEN/NOTIFY** — для PostgreSQL-only систем:
- Минимальная latency важна
- Нет возможности использовать Debezium
- Обязателен fallback-polling

---

## ⚠️ Типичные ошибки

### 1. Публикация до коммита

```typescript
// ❌ НЕПРАВИЛЬНО
await db.query('INSERT INTO orders ...')
await kafka.send('order-created', event)  // транзакция ещё не закоммичена!
await db.commit()
// Если kafka.send упадёт — данные не сохранены, событие потеряно
// Если db.commit упадёт — событие ушло, заказа нет в DB
```

```typescript
// ✅ ПРАВИЛЬНО
await db.transaction(async tx => {
  await tx.query('INSERT INTO orders ...')
  await tx.query('INSERT INTO outbox (event_type, payload) VALUES (...)')
})
// После commit Relay опубликует событие
```

### 2. Нет идемпотентности у consumer

```typescript
// ❌ НЕПРАВИЛЬНО
async function onOrderCreated(event) {
  await sendEmail(event.userId, 'Your order confirmed')
  // При retry — клиент получит 2 письма
}
```

```typescript
// ✅ ПРАВИЛЬНО
async function onOrderCreated(event) {
  const sent = await db.query(
    'SELECT 1 FROM processed_emails WHERE event_id = $1',
    [event.id]
  )
  if (sent.rows.length > 0) return
  await sendEmail(event.userId, 'Your order confirmed')
  await db.query('INSERT INTO processed_emails (event_id) VALUES ($1)', [event.id])
}
```

### 3. Забыть индекс на outbox

```sql
-- ❌ Без индекса: full table scan каждую секунду
SELECT * FROM outbox WHERE status = 'pending';

-- ✅ Partial index: быстрый scan только pending строк
CREATE INDEX idx_outbox_pending ON outbox (created_at)
WHERE status = 'pending';
```

### 4. Не мониторить WAL lag у Debezium

```bash
# ❌ Нет мониторинга → не замечаем что Debezium отстаёт на часы

# ✅ Метрика WAL lag в Prometheus
debezium_connector_lag_seconds{connector="orders"} < 5
```

### 5. Replication slot без мониторинга

```sql
-- ❌ Replication slot не читается → WAL растёт неограниченно → disk full
-- Проверять регулярно:
SELECT slot_name,
       pg_size_pretty(pg_wal_lsn_diff(pg_current_wal_lsn(), restart_lsn)) AS lag
FROM pg_replication_slots;
```

---

## Итоги уровня

| Концепция | Суть | Когда применять |
|---|---|---|
| Dual Write Problem | Два независимых write = нет атомарности | Всегда, когда пишем в DB и broker |
| Transactional Outbox | Событие в той же DB-транзакции | Основной паттерн для at-least-once |
| Polling Publisher | Relay читает pending из outbox | Простые системы, < 1K событий/сек |
| CDC / Debezium | Читает WAL, стримит изменения | Высокая нагрузка, audit log |
| Idempotent Consumer | Inbox table, дедуп по event_id | Всегда при at-least-once delivery |
| Exactly-Once | Outbox + Idempotent Producer + Inbox | Финансовые операции, критичные данные |
