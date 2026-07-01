import { useState } from 'react'
import { useLanguage } from 'src/hooks'

// ============================================
// Task 9.2: Consumer Groups
// ============================================
//
// Goal: simulate a Consumer Group in Kafka.
// Adding/removing a consumer triggers rebalancing (1200ms),
// after which partitions are redistributed using round-robin.

// TODO: Define Consumer interface:
// Определи интерфейс Consumer:
//   id: string
//   partitions: number[]
//   status: 'active' | 'rebalancing' | 'joining'
//   processed: number
// interface Consumer { ... }

// TODO: Implement assignPartitions(consumers, totalPartitions):
// Реализуй функцию assignPartitions(consumers, totalPartitions):
// Returns a new consumers array with empty partitions,
// Возвращает новый массив consumers с пустыми partitions,
// then for p from 0 to totalPartitions-1 adds p to consumers[p % length].partitions
// затем для p от 0 до totalPartitions-1 добавляет p в consumers[p % length].partitions
// function assignPartitions(consumers: Consumer[], totalPartitions: number): Consumer[] { ... }

// Colors for consumers
// Цвета для consumers
const CONSUMER_COLORS = ['#4fc3f7', '#a5d6a7', '#ffb74d', '#f48fb1', '#ce93d8']

// Total number of partitions in the topic
// Общее количество партиций в топике
const TOTAL_PARTITIONS = 6

export function Task9_2() {
  const { t } = useLanguage()

  // TODO: Initial consumers state — 3 consumers with equal distribution:
  // Начальное состояние consumers — 3 consumer-а с равным распределением:
  // consumer-1: partitions [0,1], consumer-2: [2,3], consumer-3: [4,5]
  // status: 'active', processed: 0
  const [consumers, setConsumers] = useState<unknown[]>([])

  // TODO: rebalancing state — active rebalancing flag, initially false
  // Состояние rebalancing — флаг активного rebalancing, начально false
  const [rebalancing, setRebalancing] = useState(false)

  // TODO: log state — array of event strings, initially []
  // Состояние log — массив строк событий, начально []
  const [log, setLog] = useState<string[]>([])

  // TODO: Implement addConsumer():
  // Реализуй функцию addConsumer():
  // - If consumers.length >= 6: do nothing (return)
  // - Если consumers.length >= 6: ничего не делать (return)
  // - Create newConsumer: { id: `consumer-${Date.now()}`, partitions: [], status: 'joining', processed: 0 }
  // - Создать newConsumer: { id: `consumer-${Date.now()}`, partitions: [], status: 'joining', processed: 0 }
  // - Add it to tempList = [...consumers, newConsumer]
  // - Добавить его во временный список tempList = [...consumers, newConsumer]
  // - Set rebalancing = true
  // - Установить rebalancing = true
  // - Add to log a timestamped entry: "{id} connecting — rebalancing started..."
  // - Добавить в log запись с временной меткой: "{id} подключается — начат rebalancing..."
  // - After 1200ms:
  //   a) call assignPartitions(tempList.map(c => ({...c, status: 'rebalancing'})), TOTAL_PARTITIONS)
  //   b) setConsumers(assigned)
  //   c) add to log "Rebalancing completed — partitions reassigned"
  //      добавить в log "Rebalancing завершён — партиции переназначены"
  //   d) setRebalancing(false)
  const addConsumer = () => {
    // TODO: реализовать / implement
  }

  // TODO: Implement removeConsumer(id: string):
  // Реализуй функцию removeConsumer(id: string):
  // - If consumers.length <= 1: do nothing (return)
  // - Если consumers.length <= 1: ничего не делать (return)
  // - Set rebalancing = true
  // - Установить rebalancing = true
  // - Add to log: "{id} disconnected — rebalancing started..."
  // - Добавить в log: "{id} отключился — начат rebalancing..."
  // - After 1200ms:
  //   a) filter remaining = consumers.filter(c => c.id !== id)
  //   b) assignPartitions(remaining, TOTAL_PARTITIONS)
  //   c) setConsumers(assigned), add to log "Rebalancing completed", setRebalancing(false)
  const removeConsumer = (_id: string) => {
    // TODO: реализовать / implement
  }

  // TODO: Implement simulateMessages():
  // Реализуй функцию simulateMessages():
  // For each consumer: processed += partitions.length * Math.floor(Math.random() * 5 + 3)
  // Для каждого consumer: processed += partitions.length * Math.floor(Math.random() * 5 + 3)
  // Add to log "Messages sent to all partitions"
  // Добавить в log "Отправлено сообщений во все партиции"
  const simulateMessages = () => {
    // TODO: реализовать / implement
  }

  return (
    <div className="exercise-container">
      <h2>{t('task.9.2')}</h2>

      {/* TODO: Status panel:
          Панель статуса:
          "Consumer group: orders-processor | Partitions: 6 | Consumers: N"
          "Consumer group: orders-processor | Партиций: 6 | Consumers: N"
          If consumers.length > TOTAL_PARTITIONS — add warning:
          Если consumers.length > TOTAL_PARTITIONS — добавить предупреждение:
          "(N idle — more consumers than partitions)" in pink
          "(N idle — больше consumers чем партиций)" розовым цветом */}
      <div style={{ marginBottom: '1rem', fontSize: '0.85rem', color: '#888' }}>
        Consumer group: <strong style={{ color: '#4fc3f7' }}>orders-processor</strong>
        {/* TODO: add partition and consumer counts / добавить счётчики партиций и consumers */}
      </div>

      {/* TODO: "+ Add consumer" and "Send messages" buttons
          Кнопки "+ Добавить consumer" и "Отправить сообщения"
          Both disabled during rebalancing.
          Обе заблокированы (disabled) при rebalancing.
          "Add consumer" also disabled when consumers.length >= 6
          "Добавить consumer" также заблокирована при consumers.length >= 6 */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
        <button onClick={addConsumer} disabled={rebalancing}>
          + Добавить consumer
        </button>
        <button onClick={simulateMessages} disabled={rebalancing}>
          Отправить сообщения
        </button>
      </div>

      {/* TODO: Rebalancing banner — show only if rebalancing === true:
          Баннер rebalancing — показывать только если rebalancing === true:
          "Rebalancing in progress... (all consumers temporarily paused)"
          "Rebalancing в процессе... (все consumers временно приостановлены)"
          Orange background and border / Оранжевый фон и граница */}

      {/* TODO: Row of TOTAL_PARTITIONS colored squares (48x48px).
          Ряд из TOTAL_PARTITIONS цветных квадратов (48x48px).
          Square color = CONSUMER_COLORS[owner index] or '#333' if no owner.
          Цвет квадрата = CONSUMER_COLORS[idx владельца] или '#333' если нет владельца.
          Inside: text "P0", "P1", ... Next to it: "Partitions (color = consumer)"
          Внутри текст "P0", "P1", ... Рядом подпись "Партиции (цвет = consumer)" */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
        {/* TODO: render partition squares / отрисовать квадраты партиций */}
      </div>

      {/* TODO: Consumers list.
          Список consumers.
          For each consumer:
          Для каждого consumer:
          - Colored circle (color = CONSUMER_COLORS[idx])
          - Цветной кружок (цвет = CONSUMER_COLORS[idx])
          - id (monospace)
          - Бейджи с номерами партиций (цвет партиции совпадает с consumer)
          - Partition badges (partition color matches consumer)
          - If partitions.length === 0: text "no partitions (idle)"
          - Если partitions.length === 0: текст "нет партиций (idle)"
          - Counter "processed: N"
          - Счётчик "обработано: N"
          - Delete button "x" (disabled during rebalancing or consumers.length <= 1)
          - Кнопка удаления "x" (disabled при rebalancing или consumers.length <= 1) */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1rem' }}>
        {/* TODO: render consumers / отрисовать consumers */}
      </div>

      {/* TODO: Event log — show only if log.length > 0.
          Лог событий — показывать только если log.length > 0.
          Dark background, monospace font, scrollable, last 10 entries
          Тёмный фон, monospace шрифт, прокрутка, последние 10 записей */}
      {log.length > 0 && (
        <div style={{
          background: '#0d1117',
          borderRadius: '6px',
          padding: '0.75rem',
          fontSize: '0.8rem',
          fontFamily: 'monospace',
          color: '#888',
          maxHeight: '150px',
          overflowY: 'auto',
        }}>
          {/* TODO: render log / отрисовать log */}
        </div>
      )}
    </div>
  )
}
