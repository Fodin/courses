# Уровень 3: Основы брокеров сообщений — Подробная теория

## История AMQP

В начале 2000-х корпоративный messaging был закрытым рынком: IBM MQ, TIBCO, Microsoft MSMQ — каждый со своим протоколом и проприетарными клиентами. Интеграция между ними стоила огромных денег.

В 2003 году JPMorgan Chase инициировал создание открытого стандарта. В 2006 году вышел AMQP 0-8, в 2008 — AMQP 0-9-1, который реализовал RabbitMQ. Цель была проста: **любой клиент должен работать с любым брокером**.

```
2003 — JPMorgan инициирует стандарт
2006 — AMQP 0-8 (первый публичный релиз)
2008 — AMQP 0-9-1 (RabbitMQ реализует этот вариант)
2011 — AMQP 1.0 (полный рефакторинг, несовместим с 0-9-1)
2012 — AMQP 1.0 становится стандартом OASIS
```

---

## AMQP 0-9-1 vs AMQP 1.0

Это **два принципиально разных протокола** с общим именем. Понимание разницы критично.

### AMQP 0-9-1 (RabbitMQ)

- Модель: Exchange → Binding → Queue (жёсткая топология)
- Брокер — центральный элемент, знает о топологии
- Бинарный протокол, фреймы с method/header/body
- Клиенты: pika (Python), amqplib (Node.js), RabbitMQ Java Client
- Порт: 5672 (plain), 5671 (TLS)

```
+-----------+    AMQP 0-9-1     +------------+
|  Producer |  ===============> |  RabbitMQ  |
|  Consumer |  <=============== |  Broker    |
+-----------+                   +------------+
```

### AMQP 1.0 (Azure Service Bus, ActiveMQ Artemis)

- Модель: peer-to-peer, нет обязательного понятия exchange/queue
- Брокер опционален: возможна прямая связь peer-to-peer
- Сложнее: sessions, links, delivery states
- Клиенты: Apache Qpid, Azure SDK, rhea (Node.js)
- Порт: 5672 (тот же, но несовместимый протокол!)

💡 **Практический вывод**: если вы работаете с RabbitMQ — это AMQP 0-9-1. Если Azure Service Bus или ActiveMQ Artemis — AMQP 1.0. Не путайте их.

⚠️ **Распространённая ошибка**: RabbitMQ поддерживает AMQP 1.0 как плагин, но это отдельная кодовая база с ограниченной функциональностью.

---

## Фреймы AMQP 0-9-1

Весь обмен данными в AMQP 0-9-1 осуществляется через **фреймы** (frames). Фрейм — минимальная единица передачи.

### Структура фрейма

```
+----------+------------+-----------+------------------+-----------+
| type     | channel-id | size      | payload          | frame-end |
| (1 byte) | (2 bytes)  | (4 bytes) | (size bytes)     | (1 byte)  |
+----------+------------+-----------+------------------+-----------+
                                                          = 0xCE
```

`frame-end` всегда равен `0xCE` (206). Если он отличается — протокол нарушен, соединение разрывается.

### Типы фреймов

| Тип | Код | Назначение |
|-----|-----|-----------|
| Method Frame | 1 | Команда или ответ (publish, consume, ack...) |
| Header Frame | 2 | Метаданные сообщения (content properties) |
| Body Frame | 3 | Тело сообщения (может быть несколько) |
| Heartbeat Frame | 8 | Проверка живости соединения |

### Method Frame в деталях

Каждая команда AMQP идентифицируется парой class-id + method-id:

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
  basic.return          (50)  ← mandatory=true, не доставлено
  basic.deliver         (60)  ← push от брокера к consumer
  basic.get             (70)  ← pull
  basic.ack             (80)
  basic.nack            (120)
  basic.reject          (90)
```

### Публикация сообщения: полный поток фреймов

Когда producer делает `basic.publish` с телом, брокер получает **три фрейма**:

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

Если тело больше `frame-max` (по умолчанию 131072 байт = 128KB), оно разбивается на несколько Body Frame.

---

## Multiplexing через Channels

Channels решают фундаментальную проблему: как один TCP-поток обслуживать несколько независимых "разговоров" одновременно?

```
TCP Connection (один сокет)
│
├── Channel 1 (ID: 0x0001) — producer, публикует заказы
│   └── [Method: basic.publish] [Header] [Body]
│
├── Channel 2 (ID: 0x0002) — consumer A, обрабатывает заказы
│   └── [Method: basic.consume] ... [Method: basic.ack]
│
└── Channel 3 (ID: 0x0003) — admin, управление очередями
    └── [Method: queue.declare] [Method: exchange.declare]
```

Каждый фрейм несёт channel-id, поэтому брокер и клиент знают, к какому "разговору" относится фрейм.

**Зачем не открывать несколько TCP-соединений?**

TCP-соединение — дорогостоящий ресурс:
- 3-way handshake
- TLS handshake (если включён): дополнительно 1-2 RTT
- AMQP connection negotiation: ещё несколько RTT
- Память на стороне брокера

Channel создаётся практически мгновенно: один Method Frame `channel.open` + ответ `channel.open-ok`.

**Ограничения channels:**

```python
# При создании соединения согласуется channel-max
connection = pika.BlockingConnection(pika.ConnectionParameters(
    host='localhost',
    channel_max=2047  # максимальное количество channels
))
```

⚠️ **Частая ошибка**: использовать один channel из нескольких потоков. Channel не потокобезопасен. Правило: **один channel на поток**.

---

## Connection Lifecycle

Установка соединения в AMQP 0-9-1 — это строгая последовательность сообщений:

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

### Шаг 1: Protocol Header

Клиент отправляет 8 байт: `A M Q P 0 0 9 1` (ASCII + версия). Это не фрейм — это просто инициация.

### Шаг 2: connection.start

Брокер отвечает своими возможностями:
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

### Шаг 3: connection.tune

Согласование параметров:
- `channel-max`: максимум channels (0 = без ограничений)
- `frame-max`: максимальный размер фрейма в байтах
- `heartbeat`: интервал heartbeat в секундах

Клиент может уменьшить предложенные значения в `tune-ok`.

### Heartbeat

Heartbeat — специальный фрейм (тип 8, 8 байт) для обнаружения "мёртвых" соединений:

```
+------+------------+---------+-----------+
| 0x08 | 0x00 0x00  | 0x00000 | 0xCE      |
| type | channel=0  | size=0  | frame-end |
+------+------------+---------+-----------+
```

Если за `heartbeat * 2` секунд нет данных — соединение считается потерянным.

```python
connection = pika.BlockingConnection(pika.ConnectionParameters(
    heartbeat=60  # 60 секунд
))
```

---

## Message Properties

Каждое сообщение несёт набор **content properties** в Header Frame. Это аналог HTTP-заголовков, но в бинарном формате.

### Полный список свойств basic класса

| Свойство | Тип | Описание |
|---------|-----|---------|
| `content-type` | short-str | MIME-тип: `application/json`, `text/plain` |
| `content-encoding` | short-str | Кодировка: `gzip`, `deflate` |
| `headers` | table | Произвольные заголовки (key-value) |
| `delivery-mode` | octet | 1=transient (теряется при рестарте), 2=persistent |
| `priority` | octet | 0-9, для priority queues |
| `correlation-id` | short-str | ID исходного сообщения (для RPC) |
| `reply-to` | short-str | Очередь для ответа (RPC pattern) |
| `expiration` | short-str | TTL сообщения в мс (строка!) |
| `message-id` | short-str | Уникальный ID, назначается отправителем |
| `timestamp` | longlong | Unix timestamp отправки |
| `type` | short-str | Тип события (например, `OrderCreated`) |
| `user-id` | short-str | ID пользователя (верифицируется брокером) |
| `app-id` | short-str | ID приложения-отправителя |

### Практические примеры

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
        correlation_id='req-id-789',  # для трассировки
        type='OrderCreated',
        app_id='order-service',
        headers={
            'x-retry-count': 0,
            'x-source-region': 'eu-west-1',
        },
    )
)
```

### delivery-mode: persistence

```python
# Transient — быстро, но теряется при рестарте
delivery_mode=1

# Persistent — записывается на диск
# Требует: durable queue + persistent message + durable exchange
delivery_mode=2
```

⚠️ **Ошибка**: `delivery_mode=2` без `durable=True` очереди. Сообщение "persistent", но очередь исчезает при рестарте вместе с сообщениями.

---

## Acknowledgment Modes

### Auto-ack (no-ack=true)

```python
channel.basic_consume(
    queue='orders',
    on_message_callback=callback,
    auto_ack=True  # немедленное подтверждение при доставке
)
```

Брокер удаляет сообщение сразу после отправки consumer'у. Если consumer упадёт во время обработки — сообщение потеряно.

✅ Когда использовать: high-throughput, потеря допустима (метрики, логи)
❌ Когда не использовать: финансовые операции, критичные события

### Manual ACK

```python
def callback(ch, method, properties, body):
    try:
        process_order(json.loads(body))
        ch.basic_ack(delivery_tag=method.delivery_tag)
    except Exception:
        ch.basic_nack(
            delivery_tag=method.delivery_tag,
            requeue=False  # в dead letter
        )
```

### basic.ack с multiple=True

```python
# ACK всех сообщений с delivery-tag <= 10
ch.basic_ack(delivery_tag=10, multiple=True)
```

Полезно для batch-обработки: накопить N сообщений, обработать, один ACK.

### basic.nack vs basic.reject

```python
# basic.nack — может ACK/NACK несколько сообщений
ch.basic_nack(delivery_tag=5, requeue=True, multiple=True)

# basic.reject — только одно сообщение, нет multiple
ch.basic_reject(delivery_tag=5, requeue=False)
```

### Dead Letter Exchange (DLX)

```python
# Объявить очередь с DLX
channel.queue_declare(
    queue='orders',
    durable=True,
    arguments={
        'x-dead-letter-exchange': 'dlx',
        'x-dead-letter-routing-key': 'dead.orders',
    }
)

# Объявить DLX и DLQ
channel.exchange_declare(exchange='dlx', exchange_type='direct')
channel.queue_declare(queue='dead-letters', durable=True)
channel.queue_bind(exchange='dlx', queue='dead-letters', routing_key='dead.orders')
```

Сообщение попадает в DLX при:
- `basic.nack` или `basic.reject` с `requeue=False`
- Истечении TTL (`x-message-ttl`)
- Переполнении очереди (`x-max-length` + `x-overflow=reject-publish`)

Брокер добавляет к dead-lettered сообщению заголовки `x-death`:

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

По умолчанию `basic.publish` — "fire and forget". Брокер не подтверждает получение. Если брокер упадёт после записи в network buffer — сообщение потеряно.

**Publisher Confirms** — расширение, которое включает подтверждения на уровне publisher:

```python
# Включить режим подтверждений для channel
channel.confirm_delivery()

# Синхронная публикация с подтверждением
try:
    channel.basic_publish(
        exchange='orders',
        routing_key='orders.new',
        body=json.dumps({'orderId': '42'}),
        properties=pika.BasicProperties(delivery_mode=2),
        mandatory=True,
    )
    print('Сообщение подтверждено брокером')
except pika.exceptions.UnroutableError:
    print('Сообщение не маршрутизировано (mandatory=True)')
```

**Внутренний механизм**: channel переходит в "confirm mode". Каждое опубликованное сообщение получает sequence number. Брокер отправляет `basic.ack` (или `basic.nack`) с этим номером после записи на диск/в память.

```
Producer                    Broker
   |                           |
   |--basic.publish (seq=1)--->|
   |--basic.publish (seq=2)--->|
   |--basic.publish (seq=3)--->|
   |<--basic.ack (seq=1,2)-----|  (multiple=true)
   |<--basic.ack (seq=3)-------|
```

⚠️ **Распространённая ошибка**: использовать publisher confirms в синхронном режиме для каждого сообщения. Это катастрофически снижает throughput. Используйте асинхронный режим с батчами.

---

## Consumer Prefetch (QoS)

Prefetch контролирует, сколько сообщений брокер отправит consumer'у до получения ACK.

### Проблема без prefetch

```
Queue: [msg1, msg2, msg3, ..., msg1000]
Consumer A — получает ВСЕ 1000 сообщений сразу
Consumer B — получает 0 (очередь опустела)
```

Если Consumer A медленный — нагрузка не балансируется. Если Consumer A упадёт — все 1000 сообщений будут переотправлены.

### С prefetch=1

```
Queue: [msg1, msg2, msg3, msg4, msg5]
Consumer A: получает msg1, обрабатывает...
Consumer B: получает msg2, обрабатывает...
Consumer A: ACK msg1 → получает msg3
Consumer B: ACK msg2 → получает msg4
```

Идеальный round-robin. Но при коротких сообщениях overhead велик.

### Оптимальный prefetch

```python
# Для CPU-интенсивных задач
channel.basic_qos(prefetch_count=1)

# Для быстрых задач (I/O bound)
channel.basic_qos(prefetch_count=20)

# Для batch-обработки
channel.basic_qos(prefetch_count=100)
```

📌 **Правило большого пальца**: начните с `prefetch_count=10` и измерьте throughput. Увеличивайте, пока throughput растёт. Если consumer медленный и критична балансировка — используйте 1.

### global=True vs global=False

```python
# global=False (по умолчанию): prefetch на consumer
channel.basic_qos(prefetch_count=10, global_=False)

# global=True: prefetch на channel (сумма всех consumers)
channel.basic_qos(prefetch_count=10, global_=True)
```

---

## Flow Control

AMQP 0-9-1 имеет механизм обратного давления (backpressure) на уровне connection:

```
channel.flow(active=False)  # Остановить поток сообщений
channel.flow(active=True)   # Возобновить
```

Современные версии RabbitMQ используют **credit-based flow control** — брокер сам управляет давлением на producer'ов при переполнении памяти или диска.

```
Брокер → Producer: connection.blocked (reason: "memory alarm")
Producer: перестаёт публиковать, ждёт...
Брокер → Producer: connection.unblocked
Producer: возобновляет публикацию
```

```python
# Обработка блокировки соединения
def on_connection_blocked(connection, reason):
    print(f'Connection blocked: {reason}')

def on_connection_unblocked(connection):
    print('Connection unblocked, resuming...')

connection = pika.BlockingConnection(
    pika.ConnectionParameters(
        blocked_connection_timeout=300  # секунд
    )
)
```

---

## Сравнение AMQP с другими протоколами

### AMQP 0-9-1 vs STOMP vs MQTT

| Характеристика | AMQP 0-9-1 | STOMP | MQTT |
|---------------|-----------|-------|------|
| Формат | Бинарный | Текстовый | Бинарный |
| Сложность | Высокая | Низкая | Низкая |
| Routing | Exchanges + Bindings | Destination string | Topics + wildcards |
| QoS | ACK/NACK/publish confirms | ACK | QoS 0/1/2 |
| Overhead | Средний | Высокий | Минимальный |
| IoT-friendly | Нет | Нет | Да |
| Транзакции | Да (редко) | Да | Нет |
| Use case | Корпоративный messaging | Простые клиенты | IoT, mobile |

### Когда выбирать AMQP (RabbitMQ)

✅ Нужна гибкая маршрутизация (topic exchange, headers exchange)
✅ Гарантированная доставка с подтверждениями
✅ Dead letter queues и retry логика
✅ Priority queues
✅ RPC pattern через reply-to

❌ Когда нужен максимальный throughput (лучше Kafka)
❌ Когда нужна долгосрочная история событий (Kafka с retention)
❌ IoT-устройства с ограниченными ресурсами (лучше MQTT)

---

## Mermaid: полная архитектура брокера

```mermaid
graph LR
    subgraph Client["Клиент"]
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

## Типичные ошибки и лучшие практики

### ❌ Ошибка 1: Один channel на всё приложение

```python
# Плохо — один channel из нескольких потоков
channel = connection.channel()
thread1 = Thread(target=lambda: channel.basic_publish(...))
thread2 = Thread(target=lambda: channel.basic_publish(...))
```

```python
# Хорошо — отдельный channel для каждого потока
def worker():
    ch = connection.channel()
    ch.basic_publish(...)
```

### ❌ Ошибка 2: Не ack'ать сообщения

```python
# Плохо — consumer обрабатывает, но не вызывает ack
def callback(ch, method, props, body):
    process(body)
    # забыли ch.basic_ack!
```

Через время очередь на стороне брокера заполнится unacked сообщениями. При переподключении все они будут переотправлены. Если consumer быстро подключается/отключается — "flooding" повторными доставками.

```python
# Хорошо
def callback(ch, method, props, body):
    try:
        process(body)
        ch.basic_ack(delivery_tag=method.delivery_tag)
    except Exception as e:
        ch.basic_nack(delivery_tag=method.delivery_tag, requeue=False)
```

### ❌ Ошибка 3: Non-durable queue для важных данных

```python
# Плохо — при рестарте RabbitMQ очередь исчезнет
channel.queue_declare(queue='orders')  # durable=False по умолчанию
```

```python
# Хорошо
channel.queue_declare(queue='orders', durable=True)
channel.basic_publish(
    ...,
    properties=pika.BasicProperties(delivery_mode=2)  # persistent
)
```

### ❌ Ошибка 4: Бесконечный requeue при ошибке

```python
# Плохо — ядовитое сообщение (poison pill) будет крутиться вечно
def callback(ch, method, props, body):
    try:
        process(body)
        ch.basic_ack(delivery_tag=method.delivery_tag)
    except Exception:
        ch.basic_nack(delivery_tag=method.delivery_tag, requeue=True)
        # Если process всегда фейлится — бесконечный цикл!
```

```python
# Хорошо — счётчик попыток через x-death заголовок
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

### ✅ Лучшая практика: Connection pooling

```python
# Для production: используйте connection pool
# pika не имеет встроенного пула — используйте aio-pika или другие библиотеки

import aio_pika

async def main():
    connection = await aio_pika.connect_robust(
        'amqp://guest:guest@localhost/',
        reconnect_interval=5,  # авто-переподключение
    )
    async with connection:
        channel = await connection.channel()
        await channel.set_qos(prefetch_count=10)
        # ...
```

### ✅ Лучшая практика: Идемпотентные consumers

Даже с manual ACK сообщение может быть доставлено дважды (при сбое после обработки, но до ACK). Consumer должен быть **идемпотентным**:

```python
def callback(ch, method, props, body):
    message_id = props.message_id

    # Проверить, не обрабатывали ли уже
    if redis.sismember('processed_messages', message_id):
        ch.basic_ack(delivery_tag=method.delivery_tag)
        return

    process(body)

    # Атомарная операция: сохранить ID + ack
    with transaction:
        redis.sadd('processed_messages', message_id)
        ch.basic_ack(delivery_tag=method.delivery_tag)
```
