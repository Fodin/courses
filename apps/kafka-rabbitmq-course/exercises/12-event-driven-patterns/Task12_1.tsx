import { useState } from 'react'
import { useLanguage } from 'src/hooks'

// ============================================================
// Задание 12.1: Event Sourcing — визуализация потока событий
// ============================================================
//
// Цель: реализовать компонент, демонстрирующий ключевую идею
// Event Sourcing: состояние агрегата НИКОГДА не хранится напрямую —
// оно всегда вычисляется replay-ем последовательности событий из Event Store.
// Ползунок управляет точкой воспроизведения, состояние пересчитывается в реальном времени.

// TODO: Определи тип OrderEventType — объединение четырёх строк:
// 'OrderCreated' | 'ItemAdded' | 'ItemRemoved' | 'OrderPaid'
// type OrderEventType = ...

// TODO: Определи базовый интерфейс OrderEventBase с полями:
// id: string, type: OrderEventType, timestamp: number, version: number
// interface OrderEventBase { ... }

// TODO: Определи 4 конкретных интерфейса событий (каждый extends OrderEventBase):
// - OrderCreatedEvent: type 'OrderCreated', payload: { orderId: string; customerId: string }
// - ItemAddedEvent:    type 'ItemAdded',    payload: { productId: string; name: string; price: number; qty: number }
// - ItemRemovedEvent:  type 'ItemRemoved',  payload: { productId: string; name: string }
// - OrderPaidEvent:    type 'OrderPaid',    payload: { amount: number; method: string }
// interface OrderCreatedEvent extends OrderEventBase { ... }
// ...

// TODO: Объяви тип OrderEvent как объединение всех 4 конкретных событий
// type OrderEvent = OrderCreatedEvent | ItemAddedEvent | ItemRemovedEvent | OrderPaidEvent

// TODO: Определи интерфейс OrderState с полями:
// orderId: string, customerId: string,
// items: Array<{ productId: string; name: string; price: number; qty: number }>,
// status: 'pending' | 'paid', total: number, version: number
// interface OrderState { ... }

// TODO: Объяви начальное состояние INITIAL_STATE = null с типом OrderState | null
// const INITIAL_STATE: OrderState | null = null

// TODO: Реализуй чистую функцию applyEvent(state, event) → OrderState.
// Используй switch по event.type. Для каждого типа:
// - OrderCreated: возвращает новый OrderState с пустой корзиной, status: 'pending', total: 0
// - ItemAdded:    добавляет товар в items, пересчитывает total через reduce
// - ItemRemoved:  фильтрует items по productId, пересчитывает total через reduce
// - OrderPaid:    меняет status на 'paid'
// Если state === null при ItemAdded/ItemRemoved/OrderPaid — бросай new Error('Order not created')
// function applyEvent(state: OrderState | null, event: OrderEvent): OrderState { ... }

// TODO: Объяви массив PRESET_EVENTS из 5 событий типа OrderEvent[]:
// evt-1: OrderCreated,  version 1, payload: { orderId: 'ORD-001', customerId: 'CUS-42' }
// evt-2: ItemAdded,     version 2, payload: { productId: 'P-01', name: 'Kafka: The Definitive Guide', price: 49, qty: 1 }
// evt-3: ItemAdded,     version 3, payload: { productId: 'P-02', name: 'Designing Data-Intensive Applications', price: 54, qty: 2 }
// evt-4: ItemRemoved,   version 4, payload: { productId: 'P-01', name: 'Kafka: The Definitive Guide' }
// evt-5: OrderPaid,     version 5, payload: { amount: 108, method: 'credit_card' }
// Поле timestamp можно задать как Date.now() - N*1000
// const PRESET_EVENTS: OrderEvent[] = [...]

// TODO: Объяви словарь EVENT_COLORS типа Record<OrderEventType, string>:
// OrderCreated: '#4f86f7', ItemAdded: '#38a169', ItemRemoved: '#e53e3e', OrderPaid: '#b34ff7'
// const EVENT_COLORS: Record<OrderEventType, string> = { ... }

// TODO: Объяви словарь EVENT_ICONS типа Record<OrderEventType, string>:
// OrderCreated: '📋', ItemAdded: '➕', ItemRemoved: '➖', OrderPaid: '💳'
// const EVENT_ICONS: Record<OrderEventType, string> = { ... }

export function Task12_1() {
  const { t } = useLanguage()

  // TODO: Состояние replayTo: number — сколько событий воспроизвести.
  // Начальное значение = PRESET_EVENTS.length (все события активны).
  const [replayTo, setReplayTo] = useState<number>(0) // замени 0 на PRESET_EVENTS.length

  // TODO: Вычисли visibleEvents = PRESET_EVENTS.slice(0, replayTo)
  // const visibleEvents = ...

  // TODO: Вычисли currentState через visibleEvents.reduce(applyEvent, INITIAL_STATE)
  // Тип результата: OrderState | null
  // const currentState = visibleEvents.reduce<OrderState | null>(...)

  return (
    <div className="exercise-container">
      <h2>{t('task.12.1')}</h2>
      <p style={{ color: '#666', marginBottom: '1.5rem' }}>
        Event Store содержит неизменяемую последовательность событий. Двигайте ползунок,
        чтобы воспроизвести события и увидеть, как восстанавливается состояние агрегата.
      </p>

      <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap', alignItems: 'flex-start' }}>
        {/* Левая колонка: Event Store + ползунок */}
        <div style={{ flex: '1 1 300px' }}>
          <div style={{
            fontSize: '0.8rem', fontWeight: 700, color: '#888',
            textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.75rem',
          }}>
            Event Store — timeline
          </div>

          {/* TODO: Ползунок <input type="range">
              - min={0}, max={PRESET_EVENTS.length}, value={replayTo}
              - onChange: setReplayTo(Number(e.target.value))
              - style: width '100%', accentColor '#4f86f7'
              Подписи: "Начало (пусто)" слева и "Воспроизведено: N/5" справа.
          */}
          <div style={{ marginBottom: '1rem' }}>
            {/* TODO: input range */}
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#999' }}>
              <span>Начало (пусто)</span>
              <span>Воспроизведено: {replayTo}/0 {/* замени 0 на PRESET_EVENTS.length */}</span>
            </div>
          </div>

          {/* TODO: Вертикальный timeline событий.
              Для каждого события (PRESET_EVENTS.map) отрисуй:
              - кружок 36×36: если idx < replayTo — цветной с EVENT_ICONS, иначе серый с номером версии
              - карточка: если active — цвет EVENT_COLORS[event.type] + тип + версия; иначе серая
              - под заголовком: JSON.stringify(event.payload)
              - opacity: active ? 1 : 0.3, transition: 'opacity 0.3s ease'
              Добавь псевдо-вертикальную линию (position: absolute, left: 18px).
          */}
          <div>
            {/* TODO: timeline */}
            <p style={{ color: '#aaa', fontSize: '0.85rem' }}>Timeline событий появится здесь...</p>
          </div>
        </div>

        {/* Правая колонка: текущее состояние агрегата */}
        <div style={{ flex: '1 1 260px' }}>
          <div style={{
            fontSize: '0.8rem', fontWeight: 700, color: '#888',
            textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.75rem',
          }}>
            Текущее состояние агрегата
          </div>

          {/* TODO: Если currentState === null — заглушка с текстом
              "Состояние не инициализировано. Переместите ползунок вправо."
              (dashed border, textAlign center, color #aaa)

              Если currentState не null — карточка с:
              - Заголовок: orderId + бейдж статуса (ОПЛАЧЕН / В ОБРАБОТКЕ)
              - Строка: Клиент: customerId · Версия: vN
              - Список позиций: name + qty × $price (или "Корзина пуста")
              - Итого: $total (цвет #38a169, fontWeight 700)
          */}
          <div>
            {/* TODO: блок состояния */}
            <p style={{ color: '#aaa', fontSize: '0.85rem' }}>Состояние агрегата появится здесь...</p>
          </div>

          {/* TODO: Информационный блок "Ключевой принцип":
              background '#fffbeb', border '#f6e05e', color '#744210'
              Текст: состояние никогда не сохраняется напрямую — оно вычисляется из событий.
          */}
        </div>
      </div>
    </div>
  )
}
