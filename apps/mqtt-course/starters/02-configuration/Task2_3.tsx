import { useState } from 'react'
import { useLanguage } from '@courses/platform'

// ============================================
// Задание 2.3: Настройка логирования
// ============================================

// TODO: Определи интерфейс LogType с полями:
//   id (string) — идентификатор (например 'error')
//   label (string) — отображаемое имя
//   description (string) — что логируется
//   example (string) — пример строки лога (можно многострочный)
//   verbosity (1 | 2 | 3 | 4 | 5) — уровень "шумности"
// interface LogType { ... }

// TODO: Создай массив logTypes из 8 типов:
//   1. error (verbosity: 1) — критические ошибки
//   2. warning (verbosity: 2) — предупреждения
//   3. notice (verbosity: 3) — старт, подключения, отключения
//   4. information (verbosity: 4) — нормальная работа
//   5. subscribe (verbosity: 5) — события подписки
//   6. unsubscribe (verbosity: 5) — события отписки
//   7. websockets (verbosity: 5) — WS отладка
//   8. debug (verbosity: 5) — полная трассировка протокола
//   Добавь реалистичные примеры строк для каждого типа
// const logTypes: LogType[] = [...]

// TODO: Определи интерфейс LogDestOption с полями:
//   id, label, description, recommended? (boolean)
// interface LogDestOption { ... }

// TODO: Создай массив logDestOptions из 6 вариантов:
//   'syslog' — recommended: true
//   'stdout'
//   'stderr'
//   'file' (label: 'file /tmp/mosquitto.log') — recommended: true
//   'topic'
//   'none'
// const logDestOptions: LogDestOption[] = [...]

// TODO: Реализуй функцию generateLoggingConfig(dest, types, timestamp): string
//   Генерирует фрагмент mosquitto.conf:
//   # Logging configuration
//   log_dest {dest.label}
//   log_type {t} (для каждого t в types)
//   log_timestamp {timestamp}
//   Если timestamp — добавить log_timestamp_format %Y-%m-%dT%H:%M:%S
// function generateLoggingConfig(...): string { ... }

export function Task2_3() {
  const { t } = useLanguage()

  // TODO: Создай состояние selectedDest — string (начальное: 'syslog')
  const [selectedDest, setSelectedDest] = useState<string>('syslog')

  // TODO: Создай состояние selectedTypes — Set<string>
  // Начальное значение: Set(['error', 'warning', 'notice'])
  const [selectedTypes, setSelectedTypes] = useState<Set<string>>(
    new Set(['error', 'warning', 'notice']),
  )

  // TODO: Создай состояние showTimestamp — boolean (начальное: true)
  const [showTimestamp, setShowTimestamp] = useState(true)

  // TODO: Создай состояние showConfig — boolean (начальное: false)
  const [showConfig, setShowConfig] = useState(false)

  // TODO: Реализуй функцию toggleType(id: string):
  //   Особые случаи: если id === 'none' или 'all' → setSelectedTypes(new Set([id]))
  //   Иначе:
  //   - Удали 'none' и 'all' из нового Set
  //   - Если id уже есть — удали, если нет — добавь
  //   - НЕ ПОЗВОЛЯЙ снять 'error' — это минимум
  //   - Если после удаления Set пустой — оставь {error}
  const toggleType = (_id: string) => {
    // TODO: реализовать
  }

  return (
    <div style={{ padding: '1rem', fontFamily: 'sans-serif', maxWidth: '960px' }}>
      <h2>{t('task.2.3')}</h2>
      <p style={{ color: '#555', marginBottom: '1.5rem' }}>
        Настрой параметры логирования и посмотри пример вывода. Минимум — тип error.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
        {/* Левая колонка: log_dest + log_timestamp */}
        <div>
          <h3 style={{ marginBottom: '0.75rem' }}>Назначение логов (log_dest)</h3>

          {/* TODO: Отрендери logDestOptions как радиокнопки:
              Для каждого варианта:
              - input type="radio" (name="log_dest")
              - label с monospace code-именем
              - Бейдж "рекомендуется" (зелёный) если recommended
              - description мелким текстом
              Активный элемент: синий бордер, голубой фон
          */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', marginBottom: '1.5rem' }}>
            {/* TODO: отрендерить логдест-опции */}
            <div style={{ padding: '0.5rem', border: '1px solid #ddd', borderRadius: '6px', color: '#aaa', fontSize: '0.85rem' }}>
              TODO: радиокнопки log_dest
            </div>
          </div>

          {/* TODO: Чекбокс log_timestamp:
              Если checked — жёлтый фон, желтый бордер
              Метка: "log_timestamp true" + описание "Добавлять временную метку"
          */}
          <label
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              padding: '0.6rem 0.75rem',
              border: '1px solid #ddd',
              borderRadius: '6px',
              cursor: 'pointer',
              background: showTimestamp ? '#FFF9C4' : '#fff',
            }}
          >
            <input
              type="checkbox"
              checked={showTimestamp}
              onChange={e => setShowTimestamp(e.target.checked)}
              style={{ width: 16, height: 16 }}
            />
            <div>
              <code style={{ fontFamily: 'monospace', fontSize: '0.85rem', fontWeight: 600 }}>
                log_timestamp true
              </code>
              <div style={{ fontSize: '0.78rem', color: '#666' }}>
                Добавлять временную метку к каждой строке
              </div>
            </div>
          </label>
        </div>

        {/* Правая колонка: log_type */}
        <div>
          <h3 style={{ marginBottom: '0.75rem' }}>Типы событий (log_type)</h3>

          {/* TODO: Отрендери logTypes как чекбоксы:
              Цвет зависит от verbosity:
                1-2 → красный (#B71C1C, #FFEBEE)
                3 → оранжевый (#E65100, #FFF3E0)
                4-5 → зелёный (#2E7D32, #E8F5E9)
              Для каждого типа:
              - input type="checkbox" (checked, onChange → toggleType)
              - label (monospace)
              - Индикатор verbosity: повторить символ '▮' verbosity раз
              - description мелким текстом
              Активный элемент: соответствующий цветной фон и бордер
          */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', marginBottom: '1.5rem' }}>
            {/* TODO: отрендерить чекбоксы типов логов */}
            <div style={{ padding: '0.5rem', border: '1px solid #ddd', borderRadius: '6px', color: '#aaa', fontSize: '0.85rem' }}>
              TODO: чекбоксы log_type
            </div>
          </div>
        </div>
      </div>

      {/* Кнопка и конфиг */}
      <div style={{ marginTop: '0.5rem' }}>
        <button
          onClick={() => setShowConfig(!showConfig)}
          style={{
            padding: '0.5rem 1rem',
            background: showConfig ? '#1565C0' : '#f5f5f5',
            color: showConfig ? '#fff' : '#333',
            border: '1px solid #ddd',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '0.85rem',
            marginBottom: '1rem',
          }}
        >
          {showConfig ? 'Скрыть конфиг' : '📋 Показать конфиг'}
        </button>

        {/* TODO: При showConfig — два блока в grid 1fr 1fr:
            1. mosquitto.conf: pre с тёмным фоном, generateLoggingConfig(...)
            2. Пример лог-вывода: div с тёмным фоном, строки из example выбранных типов
               (объединить через .flatMap(t => t.example.split('\n')))
        */}
        {showConfig && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <div style={{ fontSize: '0.8rem', color: '#888', marginBottom: '4px' }}>
                mosquitto.conf:
              </div>
              <pre
                style={{
                  background: '#1a1a2e',
                  color: '#00ff88',
                  fontFamily: 'monospace',
                  fontSize: '0.8rem',
                  padding: '0.75rem',
                  borderRadius: '6px',
                  margin: 0,
                  whiteSpace: 'pre-wrap',
                }}
              >
                {/* TODO: вывести generateLoggingConfig(selectedDest, selectedTypes, showTimestamp) */}
                # TODO: сгенерировать конфиг
                {'\n'}selectedDest: {selectedDest}
                {'\n'}selectedTypes: {Array.from(selectedTypes).join(', ')}
              </pre>
            </div>
            <div>
              <div style={{ fontSize: '0.8rem', color: '#888', marginBottom: '4px' }}>
                Пример лог-вывода:
              </div>
              <div
                style={{
                  background: '#1a1a2e',
                  color: '#aaaaff',
                  fontFamily: 'monospace',
                  fontSize: '0.75rem',
                  padding: '0.75rem',
                  borderRadius: '6px',
                  maxHeight: '200px',
                  overflowY: 'auto',
                }}
              >
                {/* TODO: вывести пример строк из выбранных типов */}
                <span style={{ color: '#666' }}>TODO: строки из example выбранных типов</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
