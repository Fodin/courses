import { useState } from 'react'
import { useLanguage } from 'src/hooks'

// ============================================
// Task 10.2: Compacted Topics
// Задание 10.2: Compacted Topics
// ============================================
//
// Goal: implement an interactive Log Compaction simulator.
// Цель: реализовать интерактивный симулятор Log Compaction.
// The simulator shows the log before and after compaction,
// Симулятор показывает журнал записей до и после compaction,
// allows adding records and tombstones, simulating
// позволяет добавлять записи и tombstone-ы, имитируя работу
// the Kafka cleaner thread.
// Kafka cleaner thread.

// TODO: Define interface KafkaRecord:
// TODO: Определи интерфейс KafkaRecord:
//   offset: number
//   key: string
//   value: string | null       — null = tombstone
//   timestamp: string
//   isTombstone?: boolean      — optional flag
//   isTombstone?: boolean      — опциональный флаг
// interface KafkaRecord { ... }

// TODO: Create array INITIAL_RECORDS of 9 records.
// TODO: Создай массив INITIAL_RECORDS из 9 записей.
// Keys: 'user:1', 'user:2', 'user:3', 'user:4'
// Ключи: 'user:1', 'user:2', 'user:3', 'user:4'
// user:1 should appear 3 times (cities: 'Moscow', 'Kazan', 'Sochi')
// user:1 должен появиться 3 раза (города: 'Moscow', 'Kazan', 'Sochi')
// user:2 should appear 3 times (cities: 'SPb', 'Novosibirsk', 'Krasnodar')
// user:2 должен появиться 3 раза (города: 'SPb', 'Novosibirsk', 'Krasnodar')
// user:3 should appear 2 times: normal record + tombstone (value: null, isTombstone: true)
// user:3 должен появиться 2 раза: обычная запись + tombstone (value: null, isTombstone: true)
// user:4 — 1 record
// user:4 — 1 запись
// Timestamps in 'HH:MM:SS' format, offsets — sequential from 0.
// Timestamps в формате 'HH:MM:SS', offsets — последовательно от 0.
// const INITIAL_RECORDS: KafkaRecord[] = [...]

// TODO: Implement function runCompaction(records: KafkaRecord[]): KafkaRecord[]
// TODO: Реализуй функцию runCompaction(records: KafkaRecord[]): KafkaRecord[]
// Algorithm:
// Алгоритм:
// 1. Create Map<string, KafkaRecord> to store the latest record per key
// 1. Создай Map<string, KafkaRecord> для хранения последней записи по ключу
// 2. Iterate all records, setting latest.set(r.key, r) for each
// 2. Перебери все records, устанавливая latest.set(r.key, r) для каждой
// 3. Filter result: remove tombstone records (isTombstone: true)
// 3. Отфильтруй результат: убрать tombstone-записи (isTombstone: true)
// 4. Return array sorted by offset ascending
// 4. Верни массив, отсортированный по offset по возрастанию
// const runCompaction = (records: KafkaRecord[]): KafkaRecord[] => { ... }

export function Task10_2() {
  const { t } = useLanguage()

  // TODO: State compact: boolean — whether to show result after compaction (initially false)
  // TODO: Состояние compacted: boolean — показывать ли результат после compaction (начально false)
  const [compacted, setCompacted] = useState(false)

  // TODO: State selectedKey: string | null — key to highlight (initially null)
  // TODO: Состояние selectedKey: string | null — выбранный для подсветки ключ (начально null)
  const [selectedKey, setSelectedKey] = useState<string | null>(null)

  // TODO: State addKey: string — input value for new key (initially 'user:5')
  // TODO: Состояние addKey: string — значение input для нового ключа (начально 'user:5')
  const [addKey, setAddKey] = useState('user:5')

  // TODO: State addValue: string — input value for new value (initially '{"name":"Eve","city":"Omsk"}')
  // TODO: Состояние addValue: string — значение input для нового value (начально '{"name":"Eve","city":"Omsk"}')
  const [addValue, setAddValue] = useState('{"name":"Eve","city":"Omsk"}')

  // TODO: State records: KafkaRecord[] — initially INITIAL_RECORDS
  // TODO: Состояние records: KafkaRecord[] — начально INITIAL_RECORDS
  const [records, setRecords] = useState<unknown[]>([])

  // TODO: Compute currentRecords:
  // TODO: Вычисли currentRecords:
  // If compacted === true → runCompaction(records)
  // Если compacted === true → runCompaction(records)
  // Otherwise → records
  // Иначе → records
  // const currentRecords = ...

  // TODO: Compute list of unique keys from records:
  // TODO: Вычисли список уникальных ключей из records:
  // const keys = Array.from(new Set(records.map((r) => r.key)))

  // TODO: Implement handleAddRecord:
  // TODO: Реализуй handleAddRecord:
  // Creates a new record:
  // Создаёт новую запись:
  //   offset: Math.max(...records.map(r => r.offset)) + 1
  //   key: addKey
  //   value: addValue || null
  //   timestamp: new Date().toLocaleTimeString('en', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
  //   timestamp: new Date().toLocaleTimeString('ru', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
  //   isTombstone: !addValue (if value is empty — this is a tombstone)
  //   isTombstone: !addValue (если value пустой — это tombstone)
  // Adds record to the end of records via setRecords(prev => [...prev, newRecord])
  // Добавляет запись в конец records через setRecords(prev => [...prev, newRecord])
  const handleAddRecord = () => {
    // TODO: implement
    // TODO: реализовать
  }

  // TODO: Implement handleDeleteKey(key: string):
  // TODO: Реализуй handleDeleteKey(key: string):
  // Creates a tombstone record:
  // Создаёт tombstone-запись:
  //   offset: Math.max(...records.map(r => r.offset)) + 1
  //   key: key
  //   value: null
  //   timestamp: current time (similar to handleAddRecord)
  //   timestamp: текущее время (аналогично handleAddRecord)
  //   isTombstone: true
  // Adds tombstone to the end of records
  // Добавляет tombstone в конец records
  const handleDeleteKey = (key: string) => {
    // TODO: implement
    // TODO: реализовать
    console.log(key)
  }

  return (
    <div className="exercise-container">
      <h2>{t('task.10.2')}</h2>

      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
        {/* Left column — record list */}
        {/* Левая колонка — список записей */}
        <div style={{ flex: '1 1 340px' }}>
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem', alignItems: 'center' }}>
            {/* TODO: Header: "{compacted ? 'After compaction' : 'Before compaction'} ({currentRecords.length} records)" */}
            {/* TODO: Заголовок: "{compacted ? 'После compaction' : 'До compaction'} ({currentRecords.length} записей)" */}
            <h3 style={{ margin: 0, fontSize: '0.95rem', color: '#aaa' }}>
              {/* TODO */}
            </h3>

            {/* TODO: Compaction toggle button:
                TODO: Кнопка переключения compaction:
                Text: compacted ? 'Show All' : 'Run Compaction'
                Текст: compacted ? 'Показать всё' : 'Запустить Compaction'
                background: compacted ? '#2d6a4f' : '#6b1a1a'
                onClick: setCompacted(v => !v) */}
            <button>
              {/* TODO */}
            </button>
          </div>

          {/* TODO: currentRecords list.
              TODO: Список currentRecords.
              For each record r with offset as key:
              Для каждой записи r с offset как key:
              Compute:
              Вычисли:
              - isDuplicate = !compacted && records.filter(x => x.key === r.key).some(x => x.offset > r.offset)
                (is there a newer record with the same key)
                (есть ли более новая запись с тем же ключом)
              - isHighlighted = selectedKey === r.key

              Row style:
              Стиль строки:
              - background: tombstone → '#2a1a1a', highlighted → '#1a2d1a',
                isDuplicate → '#2a2a1a', otherwise '#1a1a1a'
              - background: tombstone → '#2a1a1a', highlighted → '#1a2d1a',
                isDuplicate → '#2a2a1a', иначе '#1a1a1a'
              - border: tombstone → '#6b1a1a', highlighted → '#2d6a4f',
                isDuplicate → '#7a4f00', otherwise '#333'
              - border: tombstone → '#6b1a1a', highlighted → '#2d6a4f',
                isDuplicate → '#7a4f00', иначе '#333'
              - opacity: isDuplicate && !compacted → 0.6, otherwise 1
              - opacity: isDuplicate && !compacted → 0.6, иначе 1
              - onClick: setSelectedKey(isHighlighted ? null : r.key)

              Content (monospace, 0.78rem):
              Содержимое строки (monospace, 0.78rem):
              - '#r.offset' — color #666, width 28px
              - '#r.offset' — цвет #666, ширина 28px
              - r.key — color #9cdcfe, width 80px
              - r.key — цвет #9cdcfe, ширина 80px
              - r.isTombstone ? 'TOMBSTONE (null)' : r.value — color: tombstone → red (#f44), otherwise #ce9178
              - r.isTombstone ? 'TOMBSTONE (null)' : r.value — цвет: tombstone → красный (#f44), иначе #ce9178
              - r.timestamp — color #555
              - r.timestamp — цвет #555 */}
          <div style={{ overflowY: 'auto', maxHeight: '360px' }}>
            {/* TODO: render records */}
            {/* TODO: отрисовать записи */}
          </div>
        </div>

        {/* Right column — add form + Delete buttons + legend */}
        {/* Правая колонка — форма добавления + кнопки Delete + легенда */}
        <div style={{ flex: '1 1 240px', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {/* TODO: Add record form (block with background '#1a1a2e', border '#333'):
              TODO: Форма добавления записи (блок с background '#1a1a2e', border '#333'):
              Header "Add record:"
              Заголовок "Добавить запись:"
              Input for key (value=addKey, placeholder="Key")
              Input для ключа (value=addKey, placeholder="Ключ (key)")
              Input for value (value=addValue, placeholder='Value (empty = tombstone)')
              Input для значения (value=addValue, placeholder='Value (пусто = tombstone)')
              Button "Add" → handleAddRecord
              Кнопка "Добавить" → handleAddRecord
              Button "Reset" → setRecords(INITIAL_RECORDS)
              Кнопка "Сброс" → setRecords(INITIAL_RECORDS) */}
          <div style={{ background: '#1a1a2e', border: '1px solid #333', borderRadius: '8px', padding: '0.75rem' }}>
            {/* TODO */}
          </div>

          {/* TODO: Key list with Delete buttons (block with background '#1a1a2e', border '#333'):
              TODO: Список ключей с кнопками Delete (блок с background '#1a1a2e', border '#333'):
              Header "Delete key (Tombstone):"
              Заголовок "Удалить ключ (Tombstone):"
              For each key from keys:
              Для каждого ключа из keys:
              - Row: key (color #9cdcfe) + "Delete" button (background '#6b1a1a')
              - Строка: ключ (цвет #9cdcfe) + кнопка "Delete" (background '#6b1a1a')
              - Button onClick → handleDeleteKey(key)
              - onClick кнопки → handleDeleteKey(key) */}
          <div style={{ background: '#1a1a2e', border: '1px solid #333', borderRadius: '8px', padding: '0.75rem' }}>
            {/* TODO */}
          </div>

          {/* TODO: Color legend (background '#0d1117', border '#333'):
              TODO: Легенда цветов (background '#0d1117', border '#333'):
              - yellow bg with text: 'duplicated record (old version)'
              - жёлтый фон с текстом: 'дублированная запись (старая версия)'
              - red bg with text: 'tombstone — deletion marker'
              - красный фон с текстом: 'tombstone — маркер удаления'
              - blue bg with text: 'after compaction — latest versions only'
              - синий фон с текстом: 'после compaction — только последние версии' */}
          <div style={{ background: '#0d1117', border: '1px solid #333', borderRadius: '6px', padding: '0.6rem', fontSize: '0.78rem', color: '#888' }}>
            {/* TODO */}
          </div>
        </div>
      </div>

      {/* TODO: Info block (background '#0d1117', border '#333'):
          TODO: Информационный блок (background '#0d1117', border '#333'):
          "Log Compaction: Kafka's cleaner thread periodically scans log segments
          "Log Compaction: cleaner thread Kafka периодически сканирует сегменты лога
          and keeps only the latest record for each key.
          и оставляет только последнюю запись для каждого ключа.
          Tombstone (null value) signals deletion — after compaction the record disappears completely.
          Tombstone (null value) сигнализирует удаление — после compaction запись исчезает полностью.
          Use cases: user profiles, product catalog, configuration store, materialized views for Kafka Streams."
          Use cases: user profiles, product catalog, configuration store, materialized views для Kafka Streams." */}
      <div
        style={{
          background: '#0d1117',
          border: '1px solid #333',
          borderRadius: '6px',
          padding: '0.75rem',
          fontSize: '0.8rem',
          color: '#888',
        }}
      >
        {/* TODO: текст */}
      </div>
    </div>
  )
}
