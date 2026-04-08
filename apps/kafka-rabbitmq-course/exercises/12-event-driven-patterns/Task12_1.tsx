import { useState } from 'react'
import { useLanguage } from 'src/hooks'

// ============================================================
// Task 12.1: Event Sourcing — Event Stream Visualization
// Задание 12.1: Event Sourcing — визуализация потока событий
// ============================================================
//
// Goal: implement a component demonstrating the core idea of
// Цель: реализовать компонент, демонстрирующий ключевую идею
// Event Sourcing: aggregate state is NEVER stored directly —
// it is always computed by replaying the sequence of events from the Event Store.
// Ползунок управляет точкой воспроизведения, состояние пересчитывается в реальном времени.
// The slider controls the replay point, state is recalculated in real time.

// TODO: Define type OrderEventType — union of four strings:
// TODO: Определи тип OrderEventType — объединение четырёх строк:
// 'OrderCreated' | 'ItemAdded' | 'ItemRemoved' | 'OrderPaid'
// type OrderEventType = ...

// TODO: Define base interface OrderEventBase with fields:
// TODO: Определи базовый интерфейс OrderEventBase с полями:
// id: string, type: OrderEventType, timestamp: number, version: number
// interface OrderEventBase { ... }

// TODO: Define 4 specific event interfaces (each extends OrderEventBase):
// TODO: Определи 4 конкретных интерфейса событий (каждый extends OrderEventBase):
// - OrderCreatedEvent: type 'OrderCreated', payload: { orderId: string; customerId: string }
// - ItemAddedEvent:    type 'ItemAdded',    payload: { productId: string; name: string; price: number; qty: number }
// - ItemRemovedEvent:  type 'ItemRemoved',  payload: { productId: string; name: string }
// - OrderPaidEvent:    type 'OrderPaid',    payload: { amount: number; method: string }
// interface OrderCreatedEvent extends OrderEventBase { ... }
// ...

// TODO: Declare type OrderEvent as union of all 4 specific events
// TODO: Объяви тип OrderEvent как объединение всех 4 конкретных событий
// type OrderEvent = OrderCreatedEvent | ItemAddedEvent | ItemRemovedEvent | OrderPaidEvent

// TODO: Define interface OrderState with fields:
// TODO: Определи интерфейс OrderState с полями:
// orderId: string, customerId: string,
// items: Array<{ productId: string; name: string; price: number; qty: number }>,
// status: 'pending' | 'paid', total: number, version: number
// interface OrderState { ... }

// TODO: Declare initial state INITIAL_STATE = null with type OrderState | null
// TODO: Объяви начальное состояние INITIAL_STATE = null с типом OrderState | null
// const INITIAL_STATE: OrderState | null = null

// TODO: Implement pure function applyEvent(state, event) → OrderState.
// TODO: Реализуй чистую функцию applyEvent(state, event) → OrderState.
// Use switch on event.type. For each type:
// Используй switch по event.type. Для каждого типа:
// - OrderCreated: returns a new OrderState with empty cart, status: 'pending', total: 0
// - OrderCreated: возвращает новый OrderState с пустой корзиной, status: 'pending', total: 0
// - ItemAdded:    adds item to items, recalculates total via reduce
// - ItemAdded:    добавляет товар в items, пересчитывает total через reduce
// - ItemRemoved:  filters items by productId, recalculates total via reduce
// - ItemRemoved:  фильтрует items по productId, пересчитывает total через reduce
// - OrderPaid:    changes status to 'paid'
// - OrderPaid:    меняет status на 'paid'
// If state === null for ItemAdded/ItemRemoved/OrderPaid — throw new Error('Order not created')
// Если state === null при ItemAdded/ItemRemoved/OrderPaid — бросай new Error('Order not created')
// function applyEvent(state: OrderState | null, event: OrderEvent): OrderState { ... }

// TODO: Declare array PRESET_EVENTS of 5 events of type OrderEvent[]:
// TODO: Объяви массив PRESET_EVENTS из 5 событий типа OrderEvent[]:
// evt-1: OrderCreated,  version 1, payload: { orderId: 'ORD-001', customerId: 'CUS-42' }
// evt-2: ItemAdded,     version 2, payload: { productId: 'P-01', name: 'Kafka: The Definitive Guide', price: 49, qty: 1 }
// evt-3: ItemAdded,     version 3, payload: { productId: 'P-02', name: 'Designing Data-Intensive Applications', price: 54, qty: 2 }
// evt-4: ItemRemoved,   version 4, payload: { productId: 'P-01', name: 'Kafka: The Definitive Guide' }
// evt-5: OrderPaid,     version 5, payload: { amount: 108, method: 'credit_card' }
// For timestamp you can use Date.now() - N*1000
// Поле timestamp можно задать как Date.now() - N*1000
// const PRESET_EVENTS: OrderEvent[] = [...]

// TODO: Declare dictionary EVENT_COLORS of type Record<OrderEventType, string>:
// TODO: Объяви словарь EVENT_COLORS типа Record<OrderEventType, string>:
// OrderCreated: '#4f86f7', ItemAdded: '#38a169', ItemRemoved: '#e53e3e', OrderPaid: '#b34ff7'
// const EVENT_COLORS: Record<OrderEventType, string> = { ... }

// TODO: Declare dictionary EVENT_ICONS of type Record<OrderEventType, string>:
// TODO: Объяви словарь EVENT_ICONS типа Record<OrderEventType, string>:
// OrderCreated: '📋', ItemAdded: '➕', ItemRemoved: '➖', OrderPaid: '💳'
// const EVENT_ICONS: Record<OrderEventType, string> = { ... }

export function Task12_1() {
  const { t } = useLanguage()

  // TODO: State replayTo: number — how many events to replay.
  // TODO: Состояние replayTo: number — сколько событий воспроизвести.
  // Initial value = PRESET_EVENTS.length (all events active).
  // Начальное значение = PRESET_EVENTS.length (все события активны).
  const [replayTo, setReplayTo] = useState<number>(0) // replace 0 with PRESET_EVENTS.length // замени 0 на PRESET_EVENTS.length

  // TODO: Compute visibleEvents = PRESET_EVENTS.slice(0, replayTo)
  // TODO: Вычисли visibleEvents = PRESET_EVENTS.slice(0, replayTo)
  // const visibleEvents = ...

  // TODO: Compute currentState via visibleEvents.reduce(applyEvent, INITIAL_STATE)
  // TODO: Вычисли currentState через visibleEvents.reduce(applyEvent, INITIAL_STATE)
  // Result type: OrderState | null
  // Тип результата: OrderState | null
  // const currentState = visibleEvents.reduce<OrderState | null>(...)

  return (
    <div className="exercise-container">
      <h2>{t('task.12.1')}</h2>
      <p style={{ color: '#666', marginBottom: '1.5rem' }}>
        {/* Event Store contains an immutable sequence of events. Move the slider to replay events and see how the aggregate state is restored. */}
        {/* Event Store содержит неизменяемую последовательность событий. Двигайте ползунок, чтобы воспроизвести события и увидеть, как восстанавливается состояние агрегата. */}
        Event Store contains an immutable sequence of events. Move the slider to replay events and see how the aggregate state is restored.
      </p>

      <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap', alignItems: 'flex-start' }}>
        {/* Left column: Event Store + slider */}
        {/* Левая колонка: Event Store + ползунок */}
        <div style={{ flex: '1 1 300px' }}>
          <div style={{
            fontSize: '0.8rem', fontWeight: 700, color: '#888',
            textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.75rem',
          }}>
            Event Store — timeline
          </div>

          {/* TODO: Slider <input type="range"> */}
          {/* TODO: Ползунок <input type="range">
              - min={0}, max={PRESET_EVENTS.length}, value={replayTo}
              - onChange: setReplayTo(Number(e.target.value))
              - style: width '100%', accentColor '#4f86f7'
              Labels: "Start (empty)" on the left and "Replayed: N/5" on the right.
              Подписи: "Начало (пусто)" слева и "Воспроизведено: N/5" справа.
          */}
          <div style={{ marginBottom: '1rem' }}>
            {/* TODO: input range */}
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#999' }}>
              <span>Start (empty) {/* Начало (пусто) */}</span>
              <span>Replayed: {replayTo}/0 {/* Воспроизведено: N/5 — замени 0 на PRESET_EVENTS.length // замени 0 на PRESET_EVENTS.length */}</span>
            </div>
          </div>

          {/* TODO: Vertical event timeline. */}
          {/* TODO: Вертикальный timeline событий.
              For each event (PRESET_EVENTS.map) draw:
              Для каждого события (PRESET_EVENTS.map) отрисуй:
              - circle 36x36: if idx < replayTo — colored with EVENT_ICONS, otherwise gray with version number
              - кружок 36×36: если idx < replayTo — цветной с EVENT_ICONS, иначе серый с номером версии
              - card: if active — color EVENT_COLORS[event.type] + type + version; otherwise gray
              - карточка: если active — цвет EVENT_COLORS[event.type] + тип + версия; иначе серая
              - below title: JSON.stringify(event.payload)
              - под заголовком: JSON.stringify(event.payload)
              - opacity: active ? 1 : 0.3, transition: 'opacity 0.3s ease'
              - opacity: active ? 1 : 0.3, transition: 'opacity 0.3s ease'
              Add pseudo-vertical line (position: absolute, left: 18px).
              Добавь псевдо-вертикальную линию (position: absolute, left: 18px).
          */}
          <div>
            {/* TODO: timeline */}
            <p style={{ color: '#aaa', fontSize: '0.85rem' }}>Event timeline will appear here... {/* Timeline событий появится здесь... */}</p>
          </div>
        </div>

        {/* Right column: current aggregate state */}
        {/* Правая колонка: текущее состояние агрегата */}
        <div style={{ flex: '1 1 260px' }}>
          <div style={{
            fontSize: '0.8rem', fontWeight: 700, color: '#888',
            textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.75rem',
          }}>
            Current aggregate state {/* Текущее состояние агрегата */}
          </div>

          {/* TODO: If currentState === null — placeholder with text */}
          {/* TODO: Если currentState === null — заглушка с текстом
              "State not initialized. Move the slider to the right."
              "Состояние не инициализировано. Переместите ползунок вправо."
              (dashed border, textAlign center, color #aaa)

              If currentState not null — card with:
              Если currentState не null — карточка с:
              - Title: orderId + status badge (PAID / PENDING)
              - Заголовок: orderId + бейдж статуса (ОПЛАЧЕН / В ОБРАБОТКЕ)
              - Row: Customer: customerId · Version: vN
              - Строка: Клиент: customerId · Версия: vN
              - Items list: name + qty × $price (or "Cart is empty")
              - Список позиций: name + qty × $price (или "Корзина пуста")
              - Total: $total (color #38a169, fontWeight 700)
              - Итого: $total (цвет #38a169, fontWeight 700)
          */}
          <div>
            {/* TODO: state block */}
            {/* TODO: блок состояния */}
            <p style={{ color: '#aaa', fontSize: '0.85rem' }}>Aggregate state will appear here... {/* Состояние агрегата появится здесь... */}</p>
          </div>

          {/* TODO: Info block "Key principle": */}
          {/* TODO: Информационный блок "Ключевой принцип":
              background '#fffbeb', border '#f6e05e', color '#744210'
              Text: state is never saved directly — it is computed from events.
              Текст: состояние никогда не сохраняется напрямую — оно вычисляется из событий.
          */}
        </div>
      </div>
    </div>
  )
}
