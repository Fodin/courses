import { useState, useCallback } from 'react'
import { useLanguage } from 'src/hooks'

// ============================================
// Task 9.1: Partitioning Strategies
// ============================================
//
// Goal: implement a Kafka partitioning strategy visualizer.
// On "Send Messages", each message should land in the
// correct partition according to the selected strategy.

// TODO: Define PartitionStrategy type — union type of three values:
// 'round-robin' | 'key-based' | 'custom'
// type PartitionStrategy = ...

// TODO: Define KafkaMessage interface:
//   id: number
//   key: string | null
//   value: string
//   partition: number
//   strategy: PartitionStrategy
//   color: string
// interface KafkaMessage { ... }

// Colors for three partitions
const PARTITION_COLORS = ['#4fc3f7', '#a5d6a7', '#ffb74d']

// TODO: Implement getPartitionRoundRobin(msgId, total):
// Возвращает msgId % total / Returns msgId % total
// const getPartitionRoundRobin = (msgId: number, total: number): number => ...

// TODO: Implement getPartitionByKey(key, total):
// Если key === null — возвращает 0. / If key === null, return 0.
// Иначе: hash = 0, для каждого символа: hash = (hash * 31 + charCode) % total
// Otherwise: hash = 0, for each character: hash = (hash * 31 + charCode) % total
// Возвращает Math.abs(hash) % total / Returns Math.abs(hash) % total
// const getPartitionByKey = (key: string | null, total: number): number => ...

// TODO: Implement getPartitionCustom(value, total):
// value содержит 'CRITICAL' или 'HIGH' → партиция 0
// value contains 'CRITICAL' or 'HIGH' → partition 0
// value содержит 'ERROR' или 'WARN' → партиция 1
// value contains 'ERROR' or 'WARN' → partition 1
// иначе → последняя партиция (total > 2 ? total - 1 : 1)
// otherwise → last partition (total > 2 ? total - 1 : 1)
// const getPartitionCustom = (value: string, total: number): number => ...

// TODO: Create SAMPLE_MESSAGES array of 10 messages.
// Создай массив SAMPLE_MESSAGES из 10 сообщений. / Create SAMPLE_MESSAGES array of 10 messages.
// Каждый элемент: { key: string | null, value: string }
// Each element: { key: string | null, value: string }
// Включи сообщения с ключами (user-101, user-202, user-303, user-404),
// Include messages with keys (user-101, user-202, user-303, user-404),
// сообщения с key: null, значения с 'CRITICAL', 'HIGH', 'ERROR', 'WARN'.
// messages with key: null, values containing 'CRITICAL', 'HIGH', 'ERROR', 'WARN'.
// const SAMPLE_MESSAGES = [...]

export function Task9_1() {
  const { t } = useLanguage()

  // TODO: strategy state of type PartitionStrategy, initial value 'round-robin'
  // Состояние strategy типа PartitionStrategy, начальное значение 'round-robin'
  const [strategy, setStrategy] = useState<string>('round-robin')

  // TODO: messages state — array of KafkaMessage, initially empty
  // Состояние messages — массив KafkaMessage, начально пустой
  const [messages, setMessages] = useState<unknown[]>([])

  // TODO: partitionCount = 3 (number of partitions)
  // Состояние partitionCount = 3 (количество партиций)
  const [partitionCount] = useState(3)

  // TODO: counter state — send attempt counter, initially 0
  // Состояние counter — счётчик попыток отправки, начально 0
  const [counter, setCounter] = useState(0)

  // TODO: Implement sendAll function (via useCallback with deps [strategy, partitionCount]):
  // Реализуй функцию sendAll (через useCallback с зависимостями [strategy, partitionCount]):
  // For each message in SAMPLE_MESSAGES, compute partition according to strategy:
  // Для каждого сообщения из SAMPLE_MESSAGES вычисли партицию согласно strategy:
  //   'round-robin' → getPartitionRoundRobin(idx, partitionCount)
  //   'key-based'   → getPartitionByKey(m.key, partitionCount)
  //   'custom'      → getPartitionCustom(m.value, partitionCount)
  // Create KafkaMessage with color = PARTITION_COLORS[partition] ?? '#aaa'
  // Создай KafkaMessage с полем color = PARTITION_COLORS[partition] ?? '#aaa'
  // Save result to messages, increment counter
  // Сохрани результат в messages, увеличь counter
  const sendAll = useCallback(() => {
    // TODO: реализовать / implement
  }, [strategy, partitionCount])

  // TODO: Compute partitions array from partitionCount elements.
  // Вычисли массив partitions из partitionCount элементов.
  // Each element: { id: number, messages: KafkaMessage[] }
  // Каждый элемент: { id: number, messages: KafkaMessage[] }
  // messages are filtered from the full list by partition === id
  // messages фильтруются из общего списка по partition === id
  // const partitions = ...

  // TODO: Strategy descriptions dictionary (strategyDesc):
  // Словарь описаний стратегий (strategyDesc):
  // 'round-robin': 'Messages without key are distributed in order: P0, P1, P2, P0, P1...'
  // 'Сообщения без ключа распределяются по очереди: P0, P1, P2, P0, P1...'
  // 'key-based': 'hash(key) % numPartitions — same key always goes to one partition'
  // 'hash(key) % numPartitions — одинаковый ключ всегда в одну партицию'
  // 'custom': 'Custom partitioner: CRITICAL/HIGH → P0, ERROR/WARN → P1, rest → P2'
  // 'Кастомный партиционер: CRITICAL/HIGH → P0, ERROR/WARN → P1, остальное → P2'

  return (
    <div className="exercise-container">
      <h2>{t('task.9.1')}</h2>

      {/* TODO: Strategy switcher buttons (round-robin, key-based, custom).
          Кнопки переключения стратегии (round-robin, key-based, custom).
          On strategy change: setStrategy(s), setMessages([])
          При смене стратегии: setStrategy(s), setMessages([])
          Active button should be visually highlighted (fontWeight: bold, different background)
          Активная кнопка должна быть визуально выделена (fontWeight: bold, другой фон) */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
        {/* TODO: render 3 buttons / отрисовать 3 кнопки */}
      </div>

      {/* TODO: Current strategy description block from strategyDesc[strategy]
          Блок с описанием текущей стратегии из strategyDesc[strategy] */}
      <div style={{
        background: '#1e2d3d',
        border: '1px solid #2d5a8e',
        borderRadius: '6px',
        padding: '0.75rem',
        marginBottom: '1rem',
        fontSize: '0.9rem',
        color: '#7ec8e3',
      }}>
        {/* TODO: show description / показать описание */}
      </div>

      {/* TODO: "Send N messages (attempt M)" button — calls sendAll
          Кнопка "Отправить N сообщений (попытка M)" — вызывает sendAll */}
      <button onClick={sendAll} style={{ marginBottom: '1.5rem' }}>
        Отправить сообщения
      </button>

      {/* TODO: Grid of partitionCount columns.
          Сетка из partitionCount колонок.
          For each partition:
          Для каждой партиции:
          - Header "Partition N" with color and message count
          - Заголовок "Partition N" с цветом и счётчиком сообщений
          - List of messages that landed: key (if present), value
          - Список попавших сообщений: key (если есть), value
          - If no messages — placeholder "no messages"
          - Если сообщений нет — плейсхолдер "нет сообщений" */}
      <div style={{ display: 'grid', gridTemplateColumns: `repeat(${partitionCount}, 1fr)`, gap: '1rem' }}>
        {/* TODO: render partitions / отрисовать партиции */}
      </div>

      {/* TODO: Hint — show only if messages.length > 0 && strategy === 'key-based':
          Подсказка — показывать только если messages.length > 0 && strategy === 'key-based':
          "Notice: user-101 and user-303 always land in the same partition —
           this guarantees order of events for one user."
          "Заметьте: user-101 и user-303 всегда попадают в одну партицию —
           это гарантирует порядок событий для одного пользователя." */}
    </div>
  )
}
