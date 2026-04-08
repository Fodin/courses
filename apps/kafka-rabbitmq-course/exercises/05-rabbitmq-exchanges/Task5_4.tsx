import { useState } from 'react'
import { useLanguage } from '@courses/platform'

// ============================================
// Задание 5.4: Headers Exchange и сравнение типов
// ============================================
//
// Цель: реализовать симулятор Headers Exchange и интерактивное сравнение
// всех 4 типов Exchange (Direct, Fanout, Topic, Headers).
//
// Headers Exchange маршрутизирует по заголовкам AMQP-сообщения (не по routing key).
// Каждая привязка имеет набор ожидаемых заголовков и режим x-match:
//   x-match: all — ВСЕ заголовки привязки должны совпасть с заголовками сообщения
//   x-match: any — ХОТЯ БЫ ОДИН заголовок должен совпасть

// TODO: Определи интерфейс HeadersBinding:
//   id: string
//   queue: string
//   headers: Record<string, string>   — ожидаемые заголовки привязки
//   xMatch: 'all' | 'any'
//   color: string
//   bgColor: string
// interface HeadersBinding { ... }

// TODO: Определи интерфейс ExchangeType:
//   name: string          — 'Direct' | 'Fanout' | 'Topic' | 'Headers'
//   icon: string          — эмодзи
//   color: string
//   bgColor: string
//   routing: string       — описание алгоритма маршрутизации
//   speed: string         — производительность
//   complexity: string    — сложность конфигурации
//   useCases: string[]    — сценарии использования
//   when: string          — когда выбирать этот тип
//   example: string       — пример использования
// interface ExchangeType { ... }

// TODO: Создай массив headersBindings с 4 фиксированными привязками:
//   {
//     id: 'h1', queue: 'eu-mobile-orders',
//     headers: { region: 'eu', platform: 'mobile' }, xMatch: 'all',
//     color: '#1565C0', bgColor: '#E3F2FD'
//   }
//   {
//     id: 'h2', queue: 'premium-orders',
//     headers: { tier: 'premium' }, xMatch: 'any',
//     color: '#6A1B9A', bgColor: '#F3E5F5'
//   }
//   {
//     id: 'h3', queue: 'mobile-or-tablet',
//     headers: { platform: 'mobile', platform2: 'tablet' }, xMatch: 'any',
//     color: '#E65100', bgColor: '#FFF3E0'
//   }
//   {
//     id: 'h4', queue: 'us-all-platforms',
//     headers: { region: 'us' }, xMatch: 'all',
//     color: '#2E7D32', bgColor: '#E8F5E9'
//   }
// const headersBindings: HeadersBinding[] = [...]

// TODO: Создай массив exchangeTypes с данными для всех 4 типов:
//   Direct:  icon '🎯', routing 'Точное совпадение routing key', speed 'Высокая', complexity 'Простой'
//   Fanout:  icon '📢', routing 'Routing key игнорируется — всем', speed 'Очень высокая', complexity 'Самый простой'
//   Topic:   icon '🌿', routing 'Wildcard паттерны (* и #)', speed 'Высокая', complexity 'Средний'
//   Headers: icon '🏷️', routing 'Совпадение заголовков AMQP (x-match: all/any)', speed 'Низкая', complexity 'Сложный'
// const exchangeTypes: ExchangeType[] = [...]

export function Task5_4() {
  const { t } = useLanguage()

  // TODO: Объяви состояния:
  //   messageHeaders — Record<string, string>: начальные заголовки { region: 'eu', platform: 'mobile', tier: 'standard' }
  //   headerInput    — { key: string, value: string } — поля для добавления заголовка
  //   view           — 'headers' | 'comparison' (переключение вкладок)
  //   activeExchange — string (активный тип в режиме сравнения, по умолчанию 'Direct')
  //   log            — string[] (лог публикаций)
  const [messageHeaders, setMessageHeaders] = useState<Record<string, string>>({
    region: 'eu',
    platform: 'mobile',
    tier: 'standard',
  })
  const [headerInput, setHeaderInput] = useState({ key: '', value: '' })
  const [view, setView] = useState<'headers' | 'comparison'>('headers')
  const [activeExchange, setActiveExchange] = useState('Direct')
  const [log, setLog] = useState<string[]>([])

  // TODO: Реализуй функцию matchHeaders(binding: HeadersBinding): boolean
  //   Для каждого заголовка binding проверь: messageHeaders[k] === v
  //   Если xMatch === 'all': checks.every(Boolean)
  //   Если xMatch === 'any': checks.some(Boolean)
  const matchHeaders = (_binding: unknown): boolean => {
    // TODO: реализовать
    return false
  }

  // TODO: Вычисли matchedBindings как производное:
  //   const matchedBindings = headersBindings.filter(matchHeaders)
  const matchedBindings: unknown[] = []

  // TODO: Реализуй функцию publish():
  //   1. Получи временную метку
  //   2. Собери строку заголовков: `key1=val1, key2=val2`
  //   3. Запишем в log: `[ts] HEADERS {headers} → queue1, queue2` или `→ UNROUTABLE`
  const publish = () => {
    // TODO: реализовать
    console.log('TODO: publish()')
  }

  // TODO: Реализуй функцию addHeader():
  //   1. Проверь, что headerInput.key.trim() не пустой
  //   2. Добавь { [key]: value } в messageHeaders
  //   3. Очисти headerInput
  const addHeader = () => {
    // TODO: реализовать
  }

  // TODO: Реализуй функцию removeHeader(key: string):
  //   Создай копию messageHeaders без данного ключа и установи её
  const removeHeader = (_key: string) => {
    // TODO: реализовать
  }

  return (
    <div style={{ padding: '1rem', fontFamily: 'sans-serif', maxWidth: '960px' }}>
      <h2 style={{ marginBottom: '0.25rem' }}>{t('task.5.4')}</h2>
      <p style={{ color: '#666', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
        Headers Exchange маршрутизирует по заголовкам AMQP. Затем — сравнение всех 4 типов Exchange.
      </p>

      {/* TODO: Переключатель вкладок ("🏷️ Headers Exchange" | "📊 Сравнение типов")
          Активная вкладка: border и background '#6A1B9A', цвет '#fff'
          Неактивная: border '#ddd', background '#fff'
      */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
        {(['headers', 'comparison'] as const).map(v => (
          <button
            key={v}
            onClick={() => setView(v)}
            style={{
              padding: '0.5rem 1.25rem',
              borderRadius: '8px',
              border: `2px solid ${view === v ? '#6A1B9A' : '#ddd'}`,
              background: view === v ? '#6A1B9A' : '#fff',
              color: view === v ? '#fff' : '#333',
              cursor: 'pointer',
              fontWeight: view === v ? 700 : 400,
              fontSize: '0.9rem',
            }}
          >
            {v === 'headers' ? '🏷️ Headers Exchange' : '📊 Сравнение типов'}
          </button>
        ))}
      </div>

      {view === 'headers' ? (
        /* ---- Вкладка Headers Exchange ---- */
        <div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>

            {/* Левая: редактор заголовков + кнопка публикации */}
            <div>
              <h3 style={{ marginBottom: '0.75rem', fontSize: '0.95rem' }}>Заголовки сообщения</h3>

              {/* TODO: Блок текущих заголовков:
                  - Шапка "AMQP message headers" на сером фоне
                  - Для каждой пары [key, value]: показать key (фиолетовый) + value (зелёный) + кнопка ✕
                  - removeHeader при клике на ✕
              */}
              <div style={{ border: '1px solid #ddd', borderRadius: '8px', overflow: 'hidden', marginBottom: '0.75rem' }}>
                <div style={{ background: '#f5f5f5', padding: '0.5rem 0.75rem', fontSize: '0.75rem', color: '#888', fontFamily: 'monospace' }}>
                  AMQP message headers
                </div>
                {Object.entries(messageHeaders).map(([k, v]) => (
                  <div
                    key={k}
                    style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.5rem 0.75rem', borderTop: '1px solid #f0f0f0' }}
                  >
                    <div style={{ fontFamily: 'monospace', fontSize: '0.85rem' }}>
                      <span style={{ color: '#6A1B9A', fontWeight: 700 }}>{k}</span>
                      <span style={{ color: '#888' }}>: </span>
                      <span style={{ color: '#2E7D32' }}>"{v}"</span>
                    </div>
                    <button
                      onClick={() => removeHeader(k)}
                      style={{ padding: '2px 6px', border: '1px solid #ddd', borderRadius: '4px', background: '#fff', cursor: 'pointer', fontSize: '0.7rem', color: '#C62828' }}
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>

              {/* TODO: Форма добавления заголовка: поле key + поле value + кнопка "+" */}
              <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <input
                  value={headerInput.key}
                  onChange={e => setHeaderInput(prev => ({ ...prev, key: e.target.value }))}
                  placeholder="ключ"
                  style={{ flex: 1, padding: '0.4rem', border: '1px solid #ddd', borderRadius: '6px', fontFamily: 'monospace', fontSize: '0.8rem' }}
                />
                <input
                  value={headerInput.value}
                  onChange={e => setHeaderInput(prev => ({ ...prev, value: e.target.value }))}
                  placeholder="значение"
                  style={{ flex: 1, padding: '0.4rem', border: '1px solid #ddd', borderRadius: '6px', fontFamily: 'monospace', fontSize: '0.8rem' }}
                />
                <button
                  onClick={addHeader}
                  style={{ padding: '0.4rem 0.75rem', background: '#6A1B9A', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '0.8rem' }}
                >
                  +
                </button>
              </div>

              <button
                onClick={publish}
                style={{ width: '100%', padding: '0.75rem', background: '#E65100', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 700, fontSize: '0.9rem' }}
              >
                Опубликовать с этими заголовками
              </button>
            </div>

            {/* TODO: Правая: список привязок с детальной проверкой
                Заголовок: "Bindings (N совпадений)"
                Для каждой привязки — карточка:
                  - Подсвечена (цветная рамка + bgColor), если matchHeaders(b)
                  - Имя очереди (цветное)
                  - Badge "x-match: all" или "x-match: any" (синий/оранжевый)
                  - Иконка ✅ или ❌
                  - Детальная проверка заголовков: каждый заголовок привязки отображается
                    как badge с цветом: зелёный если messageHeaders[k] === v, красный если нет
                    Показывает ожидаемое значение и фактическое (got: actual)
            */}
            <div>
              <h3 style={{ marginBottom: '0.75rem', fontSize: '0.95rem' }}>
                Bindings ({matchedBindings.length} совпадений)
              </h3>
              <div style={{ color: '#999', fontSize: '0.85rem' }}>
                TODO: отобразить привязки с детальной проверкой заголовков
              </div>
            </div>
          </div>

          {/* TODO: Лог публикаций (тёмный терминал), если log не пустой */}
          {log.length > 0 && (
            <div style={{ background: '#1a1a2e', color: '#00ff88', fontFamily: 'monospace', fontSize: '0.75rem', padding: '0.75rem', borderRadius: '8px', maxHeight: '130px', overflowY: 'auto' }}>
              {log.map((line, i) => <div key={i}>{line}</div>)}
            </div>
          )}
        </div>
      ) : (
        /* ---- Вкладка Сравнение типов ---- */
        <div>
          {/* TODO: Кнопки-переключатели для 4 типов Exchange
              Для каждого типа из exchangeTypes:
                - Активная кнопка: border и bgColor типа
                - Показывает icon + name
          */}
          <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
            <div style={{ color: '#999', fontSize: '0.85rem' }}>
              TODO: кнопки выбора типа Exchange (Direct, Fanout, Topic, Headers)
            </div>
          </div>

          {/* TODO: Карточка активного типа Exchange
              Показывает 2 колонки:
              Левая: алгоритм маршрутизации, производительность, сложность, пример
              Правая: список сценариев использования, когда выбирать
          */}
          <div style={{ border: '2px solid #ddd', borderRadius: '12px', padding: '1.25rem', background: '#f9f9f9', marginBottom: '1.5rem' }}>
            <div style={{ color: '#999', fontSize: '0.85rem' }}>
              TODO: карточка с характеристиками активного типа Exchange ({activeExchange})
            </div>
          </div>

          {/* TODO: Таблица сравнения всех 4 типов
              Строки: тип Exchange | маршрутизация | скорость | сложность
              Активная строка подсвечена
          */}
          <div style={{ border: '1px solid #ddd', borderRadius: '8px', overflow: 'hidden', fontSize: '0.85rem' }}>
            <div style={{ background: '#f5f5f5', padding: '0.5rem 0.75rem', fontWeight: 700, display: 'grid', gridTemplateColumns: '100px 1fr 100px 100px', gap: '0.5rem' }}>
              <div>Тип</div>
              <div>Маршрутизация</div>
              <div>Скорость</div>
              <div>Сложность</div>
            </div>
            <div style={{ color: '#999', padding: '0.75rem', fontSize: '0.85rem' }}>
              TODO: строки таблицы для каждого типа из exchangeTypes
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
