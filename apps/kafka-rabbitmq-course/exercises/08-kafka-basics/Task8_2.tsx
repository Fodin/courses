import { useState } from 'react'
import { useLanguage } from '@courses/platform'

// ============================================
// Задание 8.2: Append-only лог
// ============================================
//
// Цель: реализовать интерактивную визуализацию append-only лога Kafka.
// Пользователь видит записи с offset/key/size, может добавлять новые записи,
// перемещать consumer offset и просматривать детали конкретной записи.

// TODO: Определи интерфейс LogRecord:
//   offset: number
//   key: string
//   value: string
//   timestamp: string
//   size: number
// interface LogRecord { ... }

// TODO: Реализуй вспомогательную функцию generateTimestamp(base: number, offsetMs: number): string:
//   - Создаёт дату new Date(base + offsetMs)
//   - Возвращает строку формата "YYYY-MM-DD HH:MM:SS"
//   - Подсказка: d.toISOString().replace('T', ' ').substring(0, 19)
// const generateTimestamp = (base: number, offsetMs: number): string => { ... }

// TODO: Создай константу BASE_TS = new Date('2024-01-15T10:00:00').getTime()

// TODO: Создай константу initialRecords: LogRecord[] — массив из 5 записей:
//   offset 0: key 'user-1', value '{"event":"registered","userId":1}', size 52, offsetMs 0
//   offset 1: key 'user-2', value '{"event":"registered","userId":2}', size 52, offsetMs 3200
//   offset 2: key 'user-1', value '{"event":"login","userId":1}',       size 44, offsetMs 8100
//   offset 3: key 'order-1',value '{"event":"created","orderId":1,"userId":1}', size 61, offsetMs 15400
//   offset 4: key 'user-3', value '{"event":"registered","userId":3}', size 52, offsetMs 22000
// const initialRecords: LogRecord[] = [...]

export function Task8_2() {
  const { t } = useLanguage()

  // TODO: Состояние records: LogRecord[] — инициализировать из initialRecords
  const [records, setRecords] = useState<unknown[]>([])

  // TODO: Состояние consumerOffset: number — текущая позиция consumer (по умолчанию 0)
  const [consumerOffset, setConsumerOffset] = useState(0)

  // TODO: Состояние newKey: string — ключ новой записи (по умолчанию 'user-4')
  const [newKey, setNewKey] = useState('user-4')

  // TODO: Состояние newValue: string — значение новой записи
  const [newValue, setNewValue] = useState('{"event":"registered","userId":4}')

  // TODO: Состояние selectedOffset: number | null — выделенная запись в логе
  const [selectedOffset, setSelectedOffset] = useState<number | null>(null)

  // TODO: Состояние readLog: string[] — лог операций (последние 15 записей)
  const [readLog, setReadLog] = useState<string[]>([])

  // TODO: Реализуй функцию appendRecord():
  //   1. Проверяет, что newKey и newValue не пустые
  //   2. Вычисляет nextOffset = records.length
  //   3. Создаёт LogRecord:
  //      offset: nextOffset, key: newKey.trim(), value: newValue.trim(),
  //      timestamp: generateTimestamp(BASE_TS, nextOffset * 7000 + 28000),
  //      size: newKey.length + newValue.length + 10
  //   4. Добавляет запись в конец records
  //   5. В readLog добавляет: `[APPEND] offset=N key="..." → записано в конец лога`
  const appendRecord = () => {
    // TODO: реализовать
  }

  // TODO: Реализуй функцию readFromOffset(startOffset: number):
  //   1. Устанавливает consumerOffset = startOffset
  //   2. Получает срез records.slice(startOffset)
  //   3. Формирует строки [READ] для каждой записи:
  //      `[READ] offset=N key="..." value=...`
  //   4. Добавляет в начало readLog: ...lines, `[SEEK] consumer → offset N`
  //   5. Ограничивает readLog до 15 записей
  const readFromOffset = (_startOffset: number) => {
    // TODO: реализовать
  }

  return (
    <div style={{ padding: '1rem', fontFamily: 'sans-serif', maxWidth: '960px' }}>
      <h2 style={{ marginBottom: '0.25rem' }}>{t('task.8.2')}</h2>
      <p style={{ color: '#666', marginBottom: '1rem', fontSize: '0.9rem' }}>
        Kafka хранит сообщения как append-only лог. Каждое сообщение получает монотонно возрастающий offset.
      </p>

      {/* TODO: Три карточки концептов (display grid, 3 колонки, gap '0.75rem'):
          1. 📝 Append-only — "Записи только добавляются в конец. Никакого изменения или удаления."
          2. 🔢 Offset — "Каждая запись имеет уникальный монотонный номер — offset. Начинается с 0."
          3. ♾️ Immutable — "Написанные данные неизменяемы. Consumer читает любой диапазон офсетов."
          Каждая карточка: border '1px solid #e0e0e0', borderRadius '8px', background '#fafafa' */}

      {/* TODO: Визуализация лога (горизонтальный ряд):
          - Заголовок "Partition Log — N записей"
          - Карточки записей в ряд (display flex, gap 0):
            * Клик → setSelectedOffset(offset) или сбросить если повторный клик
            * Выделенная карточка: border синий '#1565C0', background '#E3F2FD'
            * Прочитанные (i < consumerOffset): border зелёный '#A5D6A7', background '#F1F8E9'
              + метка "✅ прочитано"
            * Текущая позиция (i === consumerOffset): border жёлтый '#FFB300', background '#FFF8E1'
              + метка "👁 позиция"
            * Каждая карточка показывает: offset=N, key, size в байтах
          - После последней карточки стрелка → и блок "след. запись" (dashed border) */}

      {/* TODO: Детальная панель выбранной записи (если selectedOffset !== null):
          background '#E3F2FD', border '1px solid #90CAF9', fontFamily monospace
          Показывает key, value, timestamp, size */}

      {/* TODO: Управление consumer offset:
          - Заголовок "Consumer — чтение с offset"
          - Кнопки "от offset=N" для каждой записи → readFromOffset(N)
          - Активная кнопка: background '#1565C0', цвет '#fff'
          - Текст: "Consumer читает с offset=N. Прочитано: X сообщений." */}

      {/* TODO: Форма добавления записи:
          - Заголовок "Записать сообщение в лог"
          - Input для key (width 120px, fontFamily monospace)
          - Input для value (flex 1, minWidth 200px)
          - Кнопка "Append" → appendRecord() (background '#1565C0')
          - Подсказка: "Новая запись будет добавлена в конец лога с offset=N" */}

      {/* TODO: Лог операций (если readLog.length > 0):
          - Тёмный терминал (background '#0d1117', цвет '#39d353', maxHeight 180px)
          - Кнопка "Очистить" → setReadLog([]) */}

      <div style={{ color: '#aaa', fontSize: '0.85rem', marginTop: '2rem' }}>
        TODO: реализовать интерфейс задания
      </div>
    </div>
  )
}
