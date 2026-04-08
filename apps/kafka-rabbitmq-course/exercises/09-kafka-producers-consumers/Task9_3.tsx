import { useState } from 'react'
import { useLanguage } from 'src/hooks'

// ============================================
// Task 9.3: Offset Management
// ============================================
//
// Goal: simulate offset management in Kafka.
// Three offset types: currentOffset (current read position),
// committedOffset (saved in __consumer_offsets),
// logEndOffset (last written to partition).
// On crash, consumer returns to committedOffset.

// TODO: Define PartitionOffsets interface:
// Определи интерфейс PartitionOffsets:
//   id: number
//   logEndOffset: number
//   currentOffset: number
//   committedOffset: number
// interface PartitionOffsets { ... }

export function Task9_3() {
  const { t } = useLanguage()

  // TODO: Initial partitions state — 3 partitions with different values:
  // Начальное состояние partitions — 3 партиции с разными значениями:
  // P0: logEndOffset=20, currentOffset=15, committedOffset=12
  // P1: logEndOffset=18, currentOffset=18, committedOffset=18
  // P2: logEndOffset=25, currentOffset=22, committedOffset=20
  const [partitions, setPartitions] = useState<unknown[]>([])

  // TODO: log state — array of event strings, initially []
  // Состояние log — массив строк событий, начально []
  const [log, setLog] = useState<string[]>([])

  // TODO: crashed state — active crash flag, initially false
  // Состояние crashed — флаг активного краша, начально false
  const [crashed, setCrashed] = useState(false)

  // TODO: Implement produce(partitionId):
  // Реализуй функцию produce(partitionId):
  // Increments logEndOffset by 1 for partition with id === partitionId.
  // Увеличивает logEndOffset на 1 для партиции с id === partitionId.
  // Adds to log: "[P{id}] New message: offset {logEndOffset}"
  // Добавляет в log: "[P{id}] Новое сообщение: offset {logEndOffset}"
  const produce = (_partitionId: number) => {
    // TODO: реализовать / implement
  }

  // TODO: Implement consume(partitionId):
  // Реализуй функцию consume(partitionId):
  // If currentOffset < logEndOffset — increments currentOffset by 1.
  // Если currentOffset < logEndOffset — увеличивает currentOffset на 1.
  // Adds to log: "[P{id}] Consumed offset {currentOffset}"
  // Добавляет в log: "[P{id}] Consumed offset {currentOffset}"
  const consume = (_partitionId: number) => {
    // TODO: реализовать / implement
  }

  // TODO: Implement commit(partitionId):
  // Реализуй функцию commit(partitionId):
  // Sets committedOffset = currentOffset for the given partition.
  // Устанавливает committedOffset = currentOffset для указанной партиции.
  // Adds to log: "[P{id}] Committed offset {currentOffset} -> __consumer_offsets"
  // Добавляет в log: "[P{id}] Committed offset {currentOffset} -> __consumer_offsets"
  const commit = (_partitionId: number) => {
    // TODO: реализовать / implement
  }

  // TODO: Implement crash():
  // Реализуй функцию crash():
  // - setCrashed(true)
  // - Add to log: "[CRASH] Consumer crashed! current offset lost..."
  // - Добавить в log: "[CRASH] Consumer упал! current offset потерян..."
  // - After 1500ms:
  //   a) for all partitions: currentOffset = committedOffset
  //   b) setCrashed(false)
  //   c) add to log: "[RESTART] Consumer restarted — reading from committed offset"
  //      добавить в log: "[RESTART] Consumer перезапущен — читает с committed offset"
  const crash = () => {
    // TODO: реализовать / implement
  }

  // TODO: Implement commitAll():
  // Реализуй функцию commitAll():
  // For all partitions: committedOffset = currentOffset
  // Для всех партиций: committedOffset = currentOffset
  // Add to log: "[ALL] All offsets committed"
  // Добавить в log: "[ALL] Все offset закоммичены"
  const commitAll = () => {
    // TODO: реализовать / implement
  }

  return (
    <div className="exercise-container">
      <h2>{t('task.9.3')}</h2>

      {/* Color legend (already implemented for reference) / Легенда цветов (уже реализована для ориентации) */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', fontSize: '0.8rem', flexWrap: 'wrap' }}>
        <span style={{ color: '#4fc3f7' }}>current offset — текущая позиция чтения / current read position</span>
        <span style={{ color: '#a5d6a7' }}>committed offset — сохранено в __consumer_offsets / saved in __consumer_offsets</span>
        <span style={{ color: '#ffb74d' }}>log-end offset — последнее записанное / last written</span>
        <span style={{ color: '#f48fb1' }}>gap — сообщения для повторной обработки при crash / messages for reprocessing on crash</span>
      </div>

      {/* TODO: Global buttons:
          Глобальные кнопки:
          - "Commit all" → commitAll(), disabled when crashed
          - "Закоммитить все" → commitAll(), disabled при crashed
          - "Crash consumer" / "Restarting..." → crash(), disabled when crashed
          - "Crash consumer" / "Перезапуск..." → crash(), disabled при crashed
            Crash button: red background (#8b2020) when active
            Кнопка краша: красный фон (#8b2020) когда активна */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        <button onClick={commitAll} disabled={crashed}>
          Закоммитить все
        </button>
        <button onClick={crash} disabled={crashed}>
          {crashed ? 'Перезапуск...' : 'Crash consumer'}
        </button>
      </div>

      {/* TODO: Partitions list.
          Список партиций.
          For each partition render:
          Для каждой партиции отрисовать:

          1. Header "Partition N" + Produce / Consume / Commit buttons
          1. Заголовок "Partition N" + кнопки Produce / Consume / Commit
             - Consume disabled: crashed || currentOffset >= logEndOffset
             - Commit disabled: crashed || committedOffset === currentOffset

          2. Progress bar (height: 28px):
          2. Прогресс-бар (height: 28px):
             - Green zone: width (committedOffset / logEndOffset * 100)%
             - Зелёная зона: ширина (committedOffset / logEndOffset * 100)%
             - Blue semi-transparent zone: width (currentOffset / logEndOffset * 100)%
             - Голубая полупрозрачная зона: ширина (currentOffset / logEndOffset * 100)%
             - Pink gap zone: from committedOffset to currentOffset
             - Розовая gap-зона: от committedOffset до currentOffset
               left: (committedOffset / logEndOffset * 100)%
               width: ((currentOffset - committedOffset) / logEndOffset * 100)%
             - Text overlay: "committed=N | current=N | log-end=N"
             - Текст поверх: "committed=N | current=N | log-end=N"

          3. Metrics below bar:
          3. Метрики под баром:
             - gap: N (will be reprocessed after crash) — pink
             - gap: N (будут повторно обработаны после crash) — розовый
             - lag: N — orange if lag > 0, otherwise gray
             - lag: N — оранжевый если lag > 0, иначе серый

          Compute lag = logEndOffset - currentOffset
          Вычисли lag = logEndOffset - currentOffset
          Compute gap = currentOffset - committedOffset
          Вычисли gap = currentOffset - committedOffset */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1rem' }}>
        {/* TODO: render partitions / отрисовать партиции */}
      </div>

      {/* TODO: Event log — show only if log.length > 0.
          Лог событий — показывать только если log.length > 0.
          Color-coded lines:
          Цветовая кодировка строк:
          - contains 'CRASH' → '#f48fb1'
          - contains 'RESTART' → '#a5d6a7'
          - contains 'Committed' → '#4fc3f7'
          - otherwise → '#888' */}
      {log.length > 0 && (
        <div style={{
          background: '#0d1117',
          borderRadius: '6px',
          padding: '0.75rem',
          fontSize: '0.8rem',
          fontFamily: 'monospace',
          maxHeight: '180px',
          overflowY: 'auto',
        }}>
          {/* TODO: render log with color coding / отрисовать log с цветовой кодировкой */}
        </div>
      )}
    </div>
  )
}
