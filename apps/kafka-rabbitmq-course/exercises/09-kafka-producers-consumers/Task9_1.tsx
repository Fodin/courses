import { useState, useCallback } from 'react'
import { useLanguage } from 'src/hooks'

// ============================================
// Задание 9.1: Стратегии партиционирования
// ============================================
//
// Цель: реализовать визуализатор стратегий партиционирования Kafka.
// При нажатии "Отправить сообщения" каждое сообщение должно попасть
// в нужную партицию согласно выбранной стратегии.

// TODO: Определи тип PartitionStrategy — union type из трёх значений:
// 'round-robin' | 'key-based' | 'custom'
// type PartitionStrategy = ...

// TODO: Определи интерфейс KafkaMessage:
//   id: number
//   key: string | null
//   value: string
//   partition: number
//   strategy: PartitionStrategy
//   color: string
// interface KafkaMessage { ... }

// Цвета для трёх партиций
const PARTITION_COLORS = ['#4fc3f7', '#a5d6a7', '#ffb74d']

// TODO: Реализуй функцию getPartitionRoundRobin(msgId, total):
// Возвращает msgId % total
// const getPartitionRoundRobin = (msgId: number, total: number): number => ...

// TODO: Реализуй функцию getPartitionByKey(key, total):
// Если key === null — возвращает 0.
// Иначе: hash = 0, для каждого символа: hash = (hash * 31 + charCode) % total
// Возвращает Math.abs(hash) % total
// const getPartitionByKey = (key: string | null, total: number): number => ...

// TODO: Реализуй функцию getPartitionCustom(value, total):
// value содержит 'CRITICAL' или 'HIGH' → партиция 0
// value содержит 'ERROR' или 'WARN' → партиция 1
// иначе → последняя партиция (total > 2 ? total - 1 : 1)
// const getPartitionCustom = (value: string, total: number): number => ...

// TODO: Создай массив SAMPLE_MESSAGES из 10 сообщений.
// Каждый элемент: { key: string | null, value: string }
// Включи сообщения с ключами (user-101, user-202, user-303, user-404),
// сообщения с key: null, значения с 'CRITICAL', 'HIGH', 'ERROR', 'WARN'.
// const SAMPLE_MESSAGES = [...]

export function Task9_1() {
  const { t } = useLanguage()

  // TODO: Состояние strategy типа PartitionStrategy, начальное значение 'round-robin'
  const [strategy, setStrategy] = useState<string>('round-robin')

  // TODO: Состояние messages — массив KafkaMessage, начально пустой
  const [messages, setMessages] = useState<unknown[]>([])

  // TODO: Состояние partitionCount = 3 (количество партиций)
  const [partitionCount] = useState(3)

  // TODO: Состояние counter — счётчик попыток отправки, начально 0
  const [counter, setCounter] = useState(0)

  // TODO: Реализуй функцию sendAll (через useCallback с зависимостями [strategy, partitionCount]):
  // Для каждого сообщения из SAMPLE_MESSAGES вычисли партицию согласно strategy:
  //   'round-robin' → getPartitionRoundRobin(idx, partitionCount)
  //   'key-based'   → getPartitionByKey(m.key, partitionCount)
  //   'custom'      → getPartitionCustom(m.value, partitionCount)
  // Создай KafkaMessage с полем color = PARTITION_COLORS[partition] ?? '#aaa'
  // Сохрани результат в messages, увеличь counter
  const sendAll = useCallback(() => {
    // TODO: реализовать
  }, [strategy, partitionCount])

  // TODO: Вычисли массив partitions из partitionCount элементов.
  // Каждый элемент: { id: number, messages: KafkaMessage[] }
  // messages фильтруются из общего списка по partition === id
  // const partitions = ...

  // TODO: Словарь описаний стратегий (strategyDesc):
  // 'round-robin': 'Сообщения без ключа распределяются по очереди: P0, P1, P2, P0, P1...'
  // 'key-based': 'hash(key) % numPartitions — одинаковый ключ всегда в одну партицию'
  // 'custom': 'Кастомный партиционер: CRITICAL/HIGH → P0, ERROR/WARN → P1, остальное → P2'

  return (
    <div className="exercise-container">
      <h2>{t('task.9.1')}</h2>

      {/* TODO: Кнопки переключения стратегии (round-robin, key-based, custom).
          При смене стратегии: setStrategy(s), setMessages([])
          Активная кнопка должна быть визуально выделена (fontWeight: bold, другой фон) */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
        {/* TODO: отрисовать 3 кнопки */}
      </div>

      {/* TODO: Блок с описанием текущей стратегии из strategyDesc[strategy] */}
      <div style={{
        background: '#1e2d3d',
        border: '1px solid #2d5a8e',
        borderRadius: '6px',
        padding: '0.75rem',
        marginBottom: '1rem',
        fontSize: '0.9rem',
        color: '#7ec8e3',
      }}>
        {/* TODO: показать описание */}
      </div>

      {/* TODO: Кнопка "Отправить N сообщений (попытка M)" — вызывает sendAll */}
      <button onClick={sendAll} style={{ marginBottom: '1.5rem' }}>
        Отправить сообщения
      </button>

      {/* TODO: Сетка из partitionCount колонок.
          Для каждой партиции:
          - Заголовок "Partition N" с цветом и счётчиком сообщений
          - Список попавших сообщений: key (если есть), value
          - Если сообщений нет — плейсхолдер "нет сообщений" */}
      <div style={{ display: 'grid', gridTemplateColumns: `repeat(${partitionCount}, 1fr)`, gap: '1rem' }}>
        {/* TODO: отрисовать партиции */}
      </div>

      {/* TODO: Подсказка — показывать только если messages.length > 0 && strategy === 'key-based':
          "Заметьте: user-101 и user-303 всегда попадают в одну партицию —
           это гарантирует порядок событий для одного пользователя." */}
    </div>
  )
}
