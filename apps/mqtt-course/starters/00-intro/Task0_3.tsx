import { useState } from 'react'
import { useLanguage } from '@courses/platform'

// ============================================
// Задание 0.3: MQTT vs HTTP vs WebSocket vs AMQP
// ============================================

// TODO: Определи тип IoTRating для оценки пригодности к IoT
// Допустимые значения: 'excellent', 'good', 'fair', 'poor'
// type IoTRating = ...

// TODO: Определи интерфейс Protocol с полями:
//   name (string) — полное название
//   shortName (string) — краткое (MQTT, HTTP, WS, AMQP)
//   color (string) — hex-цвет для выделения
//   bgColor (string) — hex-цвет фона
//   pattern (string) — паттерн взаимодействия
//   overhead (string) — описание накладных расходов
//   persistent (string) — наличие persistent соединения
//   qos (string) — гарантии доставки
//   broker (string) — нужен ли брокер
//   bidirectional (string) — двунаправленность
//   iot (IoTRating) — оценка для IoT
//   useCases (string[]) — типичные сценарии применения
//   pros (string[]) — преимущества
//   cons (string[]) — недостатки
// interface Protocol { ... }

// TODO: Создай массив protocols из 4 протоколов с технически точными данными:
//   1. MQTT v5 — цвет #6A1B9A, IoT: excellent
//   2. HTTP/REST — цвет #1565C0, IoT: fair
//   3. WebSocket — цвет #E65100, IoT: good
//   4. AMQP 1.0 — цвет #2E7D32, IoT: poor
// const protocols: Protocol[] = [...]

// TODO: Определи массив comparisonRows — строки для таблицы сравнения:
//   Каждый элемент: { label: string, key: keyof Protocol }
//   Минимум 6 строк: pattern, overhead, persistent, qos, broker, bidirectional
// const comparisonRows = [...]

// TODO: Определи объект iotRating для визуального представления рейтинга:
//   ключ: IoTRating, значение: { label: string (звёзды), color: string }
// const iotRating: Record<IoTRating, ...> = { ... }

// TODO: Определи тип ViewMode: 'table' | 'detail'
// type ViewMode = ...

export function Task0_3() {
  const { t } = useLanguage()

  // TODO: Создай состояние activeProtocol — имя активного протокола (string)
  // Начальное значение: 'MQTT v5'
  const [activeProtocol, setActiveProtocol] = useState<string>('MQTT v5')

  // TODO: Создай состояние view — ViewMode
  // Начальное значение: 'table'
  const [view, setView] = useState<string>('table')

  // TODO: Найди active протокол из массива: protocols.find(p => p.name === activeProtocol)
  // const active = ...

  return (
    <div style={{ padding: '1rem', fontFamily: 'sans-serif', maxWidth: '960px' }}>
      <h2>{t('task.0.3')}</h2>
      <p style={{ color: '#555', marginBottom: '1rem' }}>
        Выбор протокола для IoT — критически важное архитектурное решение.
      </p>

      {/* TODO: Переключатель режимов — две кнопки 'table' и 'detail':
          Активная кнопка: фиолетовый фон (#6A1B9A), белый текст
          Неактивная: белый фон, тёмный текст
          Лейблы: 'table' → '📊 Сравнение', 'detail' → '🔍 Детали'
      */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
        {['table', 'detail'].map(v => (
          <button
            key={v}
            onClick={() => setView(v)}
            style={{
              padding: '0.4rem 1rem',
              borderRadius: '6px',
              border: '1px solid #ddd',
              background: view === v ? '#6A1B9A' : '#fff',
              color: view === v ? '#fff' : '#333',
              cursor: 'pointer',
            }}
          >
            {v === 'table' ? '📊 Сравнение' : '🔍 Детали'}
          </button>
        ))}
      </div>

      {/* TODO: Режим 'table' — таблица сравнения:
          - thead: первая ячейка "Критерий", затем по одному столбцу на каждый протокол
          - Заголовки столбцов: цветной фон (bgColor), цветной текст (color), жирный shortName
          - tbody: строки из comparisonRows — label в первой ячейке, p[row.key] в остальных
          - Последняя строка: "Пригодность для IoT" с iotRating[p.iot].label и цветом
      */}
      {view === 'table' && (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
            <thead>
              <tr style={{ background: '#f5f5f5' }}>
                <th style={{ padding: '0.75rem', textAlign: 'left', border: '1px solid #ddd' }}>
                  Критерий
                </th>
                {/* TODO: добавь th для каждого протокола из массива protocols */}
                <th style={{ padding: '0.75rem', border: '1px solid #ddd', color: '#aaa' }}>
                  TODO: протоколы
                </th>
              </tr>
            </thead>
            <tbody>
              {/* TODO: строки из comparisonRows */}
              <tr>
                <td style={{ padding: '0.6rem 0.75rem', border: '1px solid #ddd' }}>
                  TODO: строки таблицы
                </td>
              </tr>
              {/* TODO: строка IoT-рейтинга */}
            </tbody>
          </table>
        </div>
      )}

      {/* TODO: Режим 'detail' — детальный просмотр:
          - Кнопки выбора протокола (по одной на каждый): shortName, цвет и рамка из palette протокола
          - Карточка активного протокола с:
            - Заголовок (name) цветом active.color
            - Два столбца: Плюсы (✅ каждый) и Минусы (❌ каждый)
            - Секция Use Cases: теги в рамке цвета протокола
      */}
      {view === 'detail' && (
        <div>
          {/* TODO: кнопки выбора протокола */}
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
            <button onClick={() => setActiveProtocol('MQTT v5')} style={{ padding: '0.5rem 1rem' }}>
              TODO: кнопки протоколов
            </button>
          </div>

          {/* TODO: карточка активного протокола */}
          <div
            style={{
              border: '2px solid #ddd',
              borderRadius: '12px',
              padding: '1.25rem',
            }}
          >
            <div style={{ color: '#aaa' }}>
              Активный протокол: {activeProtocol} (TODO: реализовать карточку)
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
