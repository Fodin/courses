import { useState } from 'react'
import { useLanguage } from 'src/hooks'

// ============================================
// Задание 9.3: Offset Management
// ============================================
//
// Цель: симулировать управление offset-ами в Kafka.
// Три типа offset: currentOffset (текущее чтение),
// committedOffset (сохранено в __consumer_offsets),
// logEndOffset (последнее записанное в партицию).
// При краше consumer возвращается к committedOffset.

// TODO: Определи интерфейс PartitionOffsets:
//   id: number
//   logEndOffset: number
//   currentOffset: number
//   committedOffset: number
// interface PartitionOffsets { ... }

export function Task9_3() {
  const { t } = useLanguage()

  // TODO: Начальное состояние partitions — 3 партиции с разными значениями:
  // P0: logEndOffset=20, currentOffset=15, committedOffset=12
  // P1: logEndOffset=18, currentOffset=18, committedOffset=18
  // P2: logEndOffset=25, currentOffset=22, committedOffset=20
  const [partitions, setPartitions] = useState<unknown[]>([])

  // TODO: Состояние log — массив строк событий, начально []
  const [log, setLog] = useState<string[]>([])

  // TODO: Состояние crashed — флаг активного краша, начально false
  const [crashed, setCrashed] = useState(false)

  // TODO: Реализуй функцию produce(partitionId):
  // Увеличивает logEndOffset на 1 для партиции с id === partitionId.
  // Добавляет в log: "[P{id}] Новое сообщение: offset {logEndOffset}"
  const produce = (_partitionId: number) => {
    // TODO: реализовать
  }

  // TODO: Реализуй функцию consume(partitionId):
  // Если currentOffset < logEndOffset — увеличивает currentOffset на 1.
  // Добавляет в log: "[P{id}] Consumed offset {currentOffset}"
  const consume = (_partitionId: number) => {
    // TODO: реализовать
  }

  // TODO: Реализуй функцию commit(partitionId):
  // Устанавливает committedOffset = currentOffset для указанной партиции.
  // Добавляет в log: "[P{id}] Committed offset {currentOffset} -> __consumer_offsets"
  const commit = (_partitionId: number) => {
    // TODO: реализовать
  }

  // TODO: Реализуй функцию crash():
  // - setCrashed(true)
  // - Добавить в log: "[CRASH] Consumer упал! current offset потерян..."
  // - Через 1500ms:
  //   a) для всех партиций: currentOffset = committedOffset
  //   b) setCrashed(false)
  //   c) добавить в log: "[RESTART] Consumer перезапущен — читает с committed offset"
  const crash = () => {
    // TODO: реализовать
  }

  // TODO: Реализуй функцию commitAll():
  // Для всех партиций: committedOffset = currentOffset
  // Добавить в log: "[ALL] Все offset закоммичены"
  const commitAll = () => {
    // TODO: реализовать
  }

  return (
    <div className="exercise-container">
      <h2>{t('task.9.3')}</h2>

      {/* Легенда цветов (уже реализована для ориентации) */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', fontSize: '0.8rem', flexWrap: 'wrap' }}>
        <span style={{ color: '#4fc3f7' }}>current offset — текущая позиция чтения</span>
        <span style={{ color: '#a5d6a7' }}>committed offset — сохранено в __consumer_offsets</span>
        <span style={{ color: '#ffb74d' }}>log-end offset — последнее записанное</span>
        <span style={{ color: '#f48fb1' }}>gap — сообщения для повторной обработки при crash</span>
      </div>

      {/* TODO: Глобальные кнопки:
          - "Закоммитить все" → commitAll(), disabled при crashed
          - "Crash consumer" / "Перезапуск..." → crash(), disabled при crashed
            Кнопка краша: красный фон (#8b2020) когда активна */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        <button onClick={commitAll} disabled={crashed}>
          Закоммитить все
        </button>
        <button onClick={crash} disabled={crashed}>
          {crashed ? 'Перезапуск...' : 'Crash consumer'}
        </button>
      </div>

      {/* TODO: Список партиций.
          Для каждой партиции отрисовать:

          1. Заголовок "Partition N" + кнопки Produce / Consume / Commit
             - Consume disabled: crashed || currentOffset >= logEndOffset
             - Commit disabled: crashed || committedOffset === currentOffset

          2. Прогресс-бар (height: 28px):
             - Зелёная зона: ширина (committedOffset / logEndOffset * 100)%
             - Голубая полупрозрачная зона: ширина (currentOffset / logEndOffset * 100)%
             - Розовая gap-зона: от committedOffset до currentOffset
               left: (committedOffset / logEndOffset * 100)%
               width: ((currentOffset - committedOffset) / logEndOffset * 100)%
             - Текст поверх: "committed=N | current=N | log-end=N"

          3. Метрики под баром:
             - gap: N (будут повторно обработаны после crash) — розовый
             - lag: N — оранжевый если lag > 0, иначе серый

          Вычисли lag = logEndOffset - currentOffset
          Вычисли gap = currentOffset - committedOffset */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1rem' }}>
        {/* TODO: отрисовать партиции */}
      </div>

      {/* TODO: Лог событий — показывать только если log.length > 0.
          Цветовая кодировка строк:
          - содержит 'CRASH' → '#f48fb1'
          - содержит 'RESTART' → '#a5d6a7'
          - содержит 'Committed' → '#4fc3f7'
          - иначе → '#888' */}
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
          {/* TODO: отрисовать log с цветовой кодировкой */}
        </div>
      )}
    </div>
  )
}
