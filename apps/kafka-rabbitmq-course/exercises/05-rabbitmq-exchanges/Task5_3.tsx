import { useState } from 'react'
import { useLanguage } from '@courses/platform'

// ============================================
// Задание 5.3: Topic Exchange
// ============================================
//
// Цель: реализовать симулятор Topic Exchange с поддержкой wildcard-паттернов.
//
// Правила Topic Exchange:
//   * (звёздочка) — заменяет ровно одно слово (сегмент между точками)
//   # (решётка)   — заменяет ноль или более слов
//
// Примеры:
//   order.*     совпадает с order.created, НО НЕ с order.created.eu
//   order.#     совпадает с order, order.created, order.created.eu
//   *.paid.*    совпадает с order.paid.eu, invoice.paid.us
//   #.error     совпадает с system.error, order.process.error

// TODO: Определи интерфейс TopicBinding:
//   id: string
//   pattern: string   — wildcard-паттерн привязки
//   queue: string     — имя очереди
//   color: string
//   bgColor: string
// interface TopicBinding { ... }

// TODO: Реализуй функцию matchTopicPattern(pattern: string, key: string): boolean
//   Алгоритм: разбей pattern и key на сегменты по точке.
//   Итерируй одновременно по pp (сегменты паттерна) и kp (сегменты ключа):
//     - pp[pi] === '#': если последний — return true
//                       иначе — рекурсивно перебери pp.slice(pi+1) против kp.slice(j..N)
//     - pp[pi] === '*': pp++, kp++
//     - pp[pi] === kp[ki]: pp++, kp++
//     - иначе: return false
//   После цикла: пропусти оставшиеся '#' в паттерне.
//   Return true только если оба итератора достигли конца.
// function matchTopicPattern(pattern: string, key: string): boolean { ... }

// TODO: Реализуй функцию highlightPattern(pattern: string, key: string): React.ReactNode[]
//   Возвращает массив <span> элементов для каждого сегмента паттерна:
//     - Сегменты разделены точками (отображать в сером цвете)
//     - Wildcard (*,#): цвет '#E65100' (оранжевый), fontWeight: 700
//     - Совпадающие: цвет '#2E7D32' (зелёный), fontWeight: 700
//     - Несовпадающие: цвет '#C62828' (красный)
// function highlightPattern(pattern: string, key: string): React.ReactNode[] { ... }

// TODO: Создай массив initialTopicBindings из 5 привязок:
//   { id: 'b1', pattern: 'order.#',         queue: 'all-orders',   color: '#1565C0', bgColor: '#E3F2FD' }
//   { id: 'b2', pattern: 'order.created.*', queue: 'new-orders',   color: '#2E7D32', bgColor: '#E8F5E9' }
//   { id: 'b3', pattern: '*.paid.*',        queue: 'payments',     color: '#6A1B9A', bgColor: '#F3E5F5' }
//   { id: 'b4', pattern: 'user.#',          queue: 'user-events',  color: '#E65100', bgColor: '#FFF3E0' }
//   { id: 'b5', pattern: '#.error',         queue: 'error-handler',color: '#C62828', bgColor: '#FFEBEE' }
// const initialTopicBindings: TopicBinding[] = [...]

// TODO: Создай массив topicExamples из 8 примеров routing keys:
//   'order.created.eu', 'order.paid.us', 'order.cancelled.eu', 'order.error',
//   'user.registered', 'user.login.mobile', 'payment.processed.us', 'system.error'
// const topicExamples: string[] = [...]

export function Task5_3() {
  const { t } = useLanguage()

  // TODO: Объяви состояния:
  //   bindings   — массив TopicBinding (initialTopicBindings)
  //   routingKey — string (текущий ключ, по умолчанию 'order.created.eu')
  //   newPattern — string (ввод нового паттерна)
  //   newQueue   — string (ввод имени новой очереди)
  //   log        — массив { key: string, matched: string[], ts: string }
  const [bindings, setBindings] = useState<string[]>([])
  const [routingKey, setRoutingKey] = useState('order.created.eu')
  const [newPattern, setNewPattern] = useState('')
  const [newQueue, setNewQueue] = useState('')
  const [log, setLog] = useState<Array<{ key: string; matched: string[]; ts: string }>>([])

  // TODO: Вычисли matchedBindings как производное:
  //   const matchedBindings = bindings.filter(b => matchTopicPattern(b.pattern, routingKey))
  const matchedBindings: string[] = []

  // TODO: Реализуй функцию publish():
  //   1. Получи временную метку
  //   2. Найди совпавшие очереди через matchTopicPattern
  //   3. Добавь запись в log (не более 10)
  const publish = () => {
    // TODO: реализовать
    console.log('TODO: publish()')
  }

  // TODO: Реализуй функцию addBinding():
  //   1. Проверь, что newPattern.trim() и newQueue.trim() не пустые
  //   2. Добавь новую привязку, назначив цвет по индексу (3 варианта):
  //      { color: '#00838F', bgColor: '#E0F7FA' }
  //      { color: '#AD1457', bgColor: '#FCE4EC' }
  //      { color: '#558B2F', bgColor: '#F1F8E9' }
  //   3. Очисти newPattern и newQueue
  const addBinding = () => {
    // TODO: реализовать
  }

  // TODO: Реализуй функцию removeBinding(id: string):
  //   Фильтрует bindings, оставляя только те у которых id !== переданного
  const removeBinding = (_id: string) => {
    // TODO: реализовать
  }

  return (
    <div style={{ padding: '1rem', fontFamily: 'sans-serif', maxWidth: '960px' }}>
      <h2 style={{ marginBottom: '0.25rem' }}>{t('task.5.3')}</h2>
      <p style={{ color: '#666', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
        Topic Exchange маршрутизирует по паттернам.{' '}
        <code style={{ background: '#f5f5f5', padding: '1px 4px' }}>*</code> — ровно одно слово,{' '}
        <code style={{ background: '#f5f5f5', padding: '1px 4px' }}>#</code> — ноль или более слов.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
        {/* Левая колонка: ввод routing key + примеры + форма добавления binding */}
        <div>
          <h3 style={{ marginBottom: '0.75rem', fontSize: '0.95rem' }}>Routing Key для отправки</h3>
          <input
            value={routingKey}
            onChange={e => setRoutingKey(e.target.value)}
            style={{
              width: '100%',
              padding: '0.6rem',
              border: '2px solid #E65100',
              borderRadius: '8px',
              fontFamily: 'monospace',
              fontSize: '1rem',
              boxSizing: 'border-box',
              marginBottom: '0.75rem',
            }}
          />

          {/* TODO: Кнопки-примеры из topicExamples
              - При клике устанавливают routingKey
              - Активная кнопка (routingKey === ex) имеет другой стиль
          */}
          <div style={{ fontSize: '0.8rem', color: '#888', marginBottom: '0.5rem' }}>Примеры (нажмите):</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
            <div style={{ color: '#999', fontSize: '0.8rem' }}>TODO: кнопки примеров</div>
          </div>

          {/* TODO: Форма добавления нового binding
              - Поле ввода паттерна (placeholder "паттерн: order.*.eu")
              - Поле ввода очереди (placeholder "имя очереди: eu-orders")
              - Кнопка "+ Добавить binding"
          */}
          <div style={{ marginTop: '1.25rem' }}>
            <h3 style={{ marginBottom: '0.75rem', fontSize: '0.95rem' }}>Добавить binding</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <input
                value={newPattern}
                onChange={e => setNewPattern(e.target.value)}
                placeholder="паттерн: order.*.eu"
                style={{
                  padding: '0.5rem',
                  border: '1px solid #ddd',
                  borderRadius: '6px',
                  fontFamily: 'monospace',
                  fontSize: '0.85rem',
                }}
              />
              <input
                value={newQueue}
                onChange={e => setNewQueue(e.target.value)}
                placeholder="имя очереди: eu-orders"
                style={{
                  padding: '0.5rem',
                  border: '1px solid #ddd',
                  borderRadius: '6px',
                  fontFamily: 'monospace',
                  fontSize: '0.85rem',
                }}
              />
              <button
                onClick={addBinding}
                style={{
                  padding: '0.5rem',
                  background: '#6A1B9A',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '0.85rem',
                }}
              >
                + Добавить binding
              </button>
            </div>
          </div>
        </div>

        {/* TODO: Правая колонка: список привязок
            Заголовок: "Bindings (N совпадений из M)"
            Для каждой привязки — карточка:
              - Цветная рамка если isMatch (matchTopicPattern)
              - Паттерн с подсветкой: если совпадение — highlightPattern(b.pattern, routingKey)
                                      иначе — серый текст
              - Имя очереди → queue
              - Иконка ✅ или ❌
              - Кнопка "✕" для removeBinding
        */}
        <div>
          <h3 style={{ marginBottom: '0.75rem', fontSize: '0.95rem' }}>
            Bindings ({matchedBindings.length} совпадений из {bindings.length})
          </h3>
          <div style={{ color: '#999', fontSize: '0.85rem' }}>
            TODO: отобразить список привязок с подсветкой совпадений
          </div>
        </div>
      </div>

      {/* TODO: Кнопка "Опубликовать" + строка о текущих совпадениях
          Если matchedBindings.length > 0: "→ Попадёт в: queue1, queue2"
          Иначе: "→ Нет совпадений — сообщение будет потеряно"
      */}
      <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
        <button
          onClick={publish}
          style={{
            padding: '0.75rem 2rem',
            background: '#E65100',
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: 700,
            fontSize: '0.95rem',
          }}
        >
          Опубликовать
        </button>
        <div style={{ fontSize: '0.85rem', color: '#999', paddingTop: '0.75rem' }}>
          TODO: показать куда попадёт сообщение
        </div>
      </div>

      {/* TODO: Лог (тёмный терминал), если log не пустой */}
      {log.length > 0 && (
        <div
          style={{
            background: '#1a1a2e',
            color: '#00ff88',
            fontFamily: 'monospace',
            fontSize: '0.75rem',
            padding: '0.75rem',
            borderRadius: '8px',
            maxHeight: '180px',
            overflowY: 'auto',
            marginBottom: '1.5rem',
          }}
        >
          TODO: отобразить log
        </div>
      )}

      {/* TODO: Блок-справочник по wildcard-символам (2 колонки):
          * (звёздочка): описание + 3 примера с ✅/❌
          # (решётка):   описание + 3 примера с ✅/❌
      */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <div style={{ padding: '1rem', background: '#FFF3E0', borderRadius: '8px', border: '1px solid #FFCC80', fontSize: '0.85rem' }}>
          <strong style={{ color: '#E65100' }}>* (звёздочка)</strong>
          <ul style={{ margin: '0.5rem 0 0 1.25rem', lineHeight: '1.7', color: '#999' }}>
            <li>TODO: описание и примеры</li>
          </ul>
        </div>
        <div style={{ padding: '1rem', background: '#E8F5E9', borderRadius: '8px', border: '1px solid #A5D6A7', fontSize: '0.85rem' }}>
          <strong style={{ color: '#2E7D32' }}># (решётка)</strong>
          <ul style={{ margin: '0.5rem 0 0 1.25rem', lineHeight: '1.7', color: '#999' }}>
            <li>TODO: описание и примеры</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
