import { useState } from 'react'
import { useLanguage } from 'src/hooks'

// ============================================
// Задание 10.2: Compacted Topics
// ============================================
//
// Цель: реализовать интерактивный симулятор Log Compaction.
// Симулятор показывает журнал записей до и после compaction,
// позволяет добавлять записи и tombstone-ы, имитируя работу
// Kafka cleaner thread.

// TODO: Определи интерфейс KafkaRecord:
//   offset: number
//   key: string
//   value: string | null       — null = tombstone
//   timestamp: string
//   isTombstone?: boolean      — опциональный флаг
// interface KafkaRecord { ... }

// TODO: Создай массив INITIAL_RECORDS из 9 записей.
// Ключи: 'user:1', 'user:2', 'user:3', 'user:4'
// user:1 должен появиться 3 раза (города: 'Moscow', 'Kazan', 'Sochi')
// user:2 должен появиться 3 раза (города: 'SPb', 'Novosibirsk', 'Krasnodar')
// user:3 должен появиться 2 раза: обычная запись + tombstone (value: null, isTombstone: true)
// user:4 — 1 запись
// Timestamps в формате 'HH:MM:SS', offsets — последовательно от 0.
// const INITIAL_RECORDS: KafkaRecord[] = [...]

// TODO: Реализуй функцию runCompaction(records: KafkaRecord[]): KafkaRecord[]
// Алгоритм:
// 1. Создай Map<string, KafkaRecord> для хранения последней записи по ключу
// 2. Перебери все records, устанавливая latest.set(r.key, r) для каждой
// 3. Отфильтруй результат: убрать tombstone-записи (isTombstone: true)
// 4. Верни массив, отсортированный по offset по возрастанию
// const runCompaction = (records: KafkaRecord[]): KafkaRecord[] => { ... }

export function Task10_2() {
  const { t } = useLanguage()

  // TODO: Состояние compacted: boolean — показывать ли результат после compaction (начально false)
  const [compacted, setCompacted] = useState(false)

  // TODO: Состояние selectedKey: string | null — выбранный для подсветки ключ (начально null)
  const [selectedKey, setSelectedKey] = useState<string | null>(null)

  // TODO: Состояние addKey: string — значение input для нового ключа (начально 'user:5')
  const [addKey, setAddKey] = useState('user:5')

  // TODO: Состояние addValue: string — значение input для нового value (начально '{"name":"Eve","city":"Omsk"}')
  const [addValue, setAddValue] = useState('{"name":"Eve","city":"Omsk"}')

  // TODO: Состояние records: KafkaRecord[] — начально INITIAL_RECORDS
  const [records, setRecords] = useState<unknown[]>([])

  // TODO: Вычисли currentRecords:
  // Если compacted === true → runCompaction(records)
  // Иначе → records
  // const currentRecords = ...

  // TODO: Вычисли список уникальных ключей из records:
  // const keys = Array.from(new Set(records.map((r) => r.key)))

  // TODO: Реализуй handleAddRecord:
  // Создаёт новую запись:
  //   offset: Math.max(...records.map(r => r.offset)) + 1
  //   key: addKey
  //   value: addValue || null
  //   timestamp: new Date().toLocaleTimeString('ru', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
  //   isTombstone: !addValue (если value пустой — это tombstone)
  // Добавляет запись в конец records через setRecords(prev => [...prev, newRecord])
  const handleAddRecord = () => {
    // TODO: реализовать
  }

  // TODO: Реализуй handleDeleteKey(key: string):
  // Создаёт tombstone-запись:
  //   offset: Math.max(...records.map(r => r.offset)) + 1
  //   key: key
  //   value: null
  //   timestamp: текущее время (аналогично handleAddRecord)
  //   isTombstone: true
  // Добавляет tombstone в конец records
  const handleDeleteKey = (key: string) => {
    // TODO: реализовать
    console.log(key)
  }

  return (
    <div className="exercise-container">
      <h2>{t('task.10.2')}</h2>

      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
        {/* Левая колонка — список записей */}
        <div style={{ flex: '1 1 340px' }}>
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem', alignItems: 'center' }}>
            {/* TODO: Заголовок: "{compacted ? 'После compaction' : 'До compaction'} ({currentRecords.length} записей)" */}
            <h3 style={{ margin: 0, fontSize: '0.95rem', color: '#aaa' }}>
              {/* TODO */}
            </h3>

            {/* TODO: Кнопка переключения compaction:
                Текст: compacted ? 'Показать всё' : 'Запустить Compaction'
                background: compacted ? '#2d6a4f' : '#6b1a1a'
                onClick: setCompacted(v => !v) */}
            <button>
              {/* TODO */}
            </button>
          </div>

          {/* TODO: Список currentRecords.
              Для каждой записи r с offset как key:
              Вычисли:
              - isDuplicate = !compacted && records.filter(x => x.key === r.key).some(x => x.offset > r.offset)
                (есть ли более новая запись с тем же ключом)
              - isHighlighted = selectedKey === r.key

              Стиль строки:
              - background: tombstone → '#2a1a1a', highlighted → '#1a2d1a',
                isDuplicate → '#2a2a1a', иначе '#1a1a1a'
              - border: tombstone → '#6b1a1a', highlighted → '#2d6a4f',
                isDuplicate → '#7a4f00', иначе '#333'
              - opacity: isDuplicate && !compacted → 0.6, иначе 1
              - onClick: setSelectedKey(isHighlighted ? null : r.key)

              Содержимое строки (monospace, 0.78rem):
              - '#r.offset' — цвет #666, ширина 28px
              - r.key — цвет #9cdcfe, ширина 80px
              - r.isTombstone ? 'TOMBSTONE (null)' : r.value — цвет: tombstone → красный (#f44), иначе #ce9178
              - r.timestamp — цвет #555 */}
          <div style={{ overflowY: 'auto', maxHeight: '360px' }}>
            {/* TODO: отрисовать записи */}
          </div>
        </div>

        {/* Правая колонка — форма добавления + кнопки Delete + легенда */}
        <div style={{ flex: '1 1 240px', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {/* TODO: Форма добавления записи (блок с background '#1a1a2e', border '#333'):
              Заголовок "Добавить запись:"
              Input для ключа (value=addKey, placeholder="Ключ (key)")
              Input для значения (value=addValue, placeholder='Value (пусто = tombstone)')
              Кнопка "Добавить" → handleAddRecord
              Кнопка "Сброс" → setRecords(INITIAL_RECORDS) */}
          <div style={{ background: '#1a1a2e', border: '1px solid #333', borderRadius: '8px', padding: '0.75rem' }}>
            {/* TODO */}
          </div>

          {/* TODO: Список ключей с кнопками Delete (блок с background '#1a1a2e', border '#333'):
              Заголовок "Удалить ключ (Tombstone):"
              Для каждого ключа из keys:
              - Строка: ключ (цвет #9cdcfe) + кнопка "Delete" (background '#6b1a1a')
              - onClick кнопки → handleDeleteKey(key) */}
          <div style={{ background: '#1a1a2e', border: '1px solid #333', borderRadius: '8px', padding: '0.75rem' }}>
            {/* TODO */}
          </div>

          {/* TODO: Легенда цветов (background '#0d1117', border '#333'):
              - жёлтый фон с текстом: 'дублированная запись (старая версия)'
              - красный фон с текстом: 'tombstone — маркер удаления'
              - синий фон с текстом: 'после compaction — только последние версии' */}
          <div style={{ background: '#0d1117', border: '1px solid #333', borderRadius: '6px', padding: '0.6rem', fontSize: '0.78rem', color: '#888' }}>
            {/* TODO */}
          </div>
        </div>
      </div>

      {/* TODO: Информационный блок (background '#0d1117', border '#333'):
          "Log Compaction: cleaner thread Kafka периодически сканирует сегменты лога
          и оставляет только последнюю запись для каждого ключа.
          Tombstone (null value) сигнализирует удаление — после compaction запись исчезает полностью.
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
