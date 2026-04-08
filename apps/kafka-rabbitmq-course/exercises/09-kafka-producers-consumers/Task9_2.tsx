import { useState } from 'react'
import { useLanguage } from 'src/hooks'

// ============================================
// Задание 9.2: Consumer Groups
// ============================================
//
// Цель: симулировать Consumer Group в Kafka.
// При добавлении/удалении consumer запускается rebalancing (1200ms),
// после чего партиции перераспределяются методом round-robin.

// TODO: Определи интерфейс Consumer:
//   id: string
//   partitions: number[]
//   status: 'active' | 'rebalancing' | 'joining'
//   processed: number
// interface Consumer { ... }

// TODO: Реализуй функцию assignPartitions(consumers, totalPartitions):
// Возвращает новый массив consumers с пустыми partitions,
// затем для p от 0 до totalPartitions-1 добавляет p в consumers[p % length].partitions
// function assignPartitions(consumers: Consumer[], totalPartitions: number): Consumer[] { ... }

// Цвета для consumers
const CONSUMER_COLORS = ['#4fc3f7', '#a5d6a7', '#ffb74d', '#f48fb1', '#ce93d8']

// Общее количество партиций в топике
const TOTAL_PARTITIONS = 6

export function Task9_2() {
  const { t } = useLanguage()

  // TODO: Начальное состояние consumers — 3 consumer-а с равным распределением:
  // consumer-1: partitions [0,1], consumer-2: [2,3], consumer-3: [4,5]
  // status: 'active', processed: 0
  const [consumers, setConsumers] = useState<unknown[]>([])

  // TODO: Состояние rebalancing — флаг активного rebalancing, начально false
  const [rebalancing, setRebalancing] = useState(false)

  // TODO: Состояние log — массив строк событий, начально []
  const [log, setLog] = useState<string[]>([])

  // TODO: Реализуй функцию addConsumer():
  // - Если consumers.length >= 6: ничего не делать (return)
  // - Создать newConsumer: { id: `consumer-${Date.now()}`, partitions: [], status: 'joining', processed: 0 }
  // - Добавить его во временный список tempList = [...consumers, newConsumer]
  // - Установить rebalancing = true
  // - Добавить в log запись с временной меткой: "{id} подключается — начат rebalancing..."
  // - Через 1200ms:
  //   a) вызвать assignPartitions(tempList.map(c => ({...c, status: 'rebalancing'})), TOTAL_PARTITIONS)
  //   b) setConsumers(assigned)
  //   c) добавить в log "Rebalancing завершён — партиции переназначены"
  //   d) setRebalancing(false)
  const addConsumer = () => {
    // TODO: реализовать
  }

  // TODO: Реализуй функцию removeConsumer(id: string):
  // - Если consumers.length <= 1: ничего не делать (return)
  // - Установить rebalancing = true
  // - Добавить в log: "{id} отключился — начат rebalancing..."
  // - Через 1200ms:
  //   a) отфильтровать remaining = consumers.filter(c => c.id !== id)
  //   b) assignPartitions(remaining, TOTAL_PARTITIONS)
  //   c) setConsumers(assigned), добавить в log "Rebalancing завершён", setRebalancing(false)
  const removeConsumer = (_id: string) => {
    // TODO: реализовать
  }

  // TODO: Реализуй функцию simulateMessages():
  // Для каждого consumer: processed += partitions.length * Math.floor(Math.random() * 5 + 3)
  // Добавить в log "Отправлено сообщений во все партиции"
  const simulateMessages = () => {
    // TODO: реализовать
  }

  return (
    <div className="exercise-container">
      <h2>{t('task.9.2')}</h2>

      {/* TODO: Панель статуса:
          "Consumer group: orders-processor | Партиций: 6 | Consumers: N"
          Если consumers.length > TOTAL_PARTITIONS — добавить предупреждение:
          "(N idle — больше consumers чем партиций)" розовым цветом */}
      <div style={{ marginBottom: '1rem', fontSize: '0.85rem', color: '#888' }}>
        Consumer group: <strong style={{ color: '#4fc3f7' }}>orders-processor</strong>
        {/* TODO: добавить счётчики партиций и consumers */}
      </div>

      {/* TODO: Кнопки "+ Добавить consumer" и "Отправить сообщения"
          Обе заблокированы (disabled) при rebalancing.
          "Добавить consumer" также заблокирована при consumers.length >= 6 */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
        <button onClick={addConsumer} disabled={rebalancing}>
          + Добавить consumer
        </button>
        <button onClick={simulateMessages} disabled={rebalancing}>
          Отправить сообщения
        </button>
      </div>

      {/* TODO: Баннер rebalancing — показывать только если rebalancing === true:
          "Rebalancing в процессе... (все consumers временно приостановлены)"
          Оранжевый фон и граница */}

      {/* TODO: Ряд из TOTAL_PARTITIONS цветных квадратов (48x48px).
          Цвет квадрата = CONSUMER_COLORS[idx владельца] или '#333' если нет владельца.
          Внутри текст "P0", "P1", ... Рядом подпись "Партиции (цвет = consumer)" */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
        {/* TODO: отрисовать квадраты партиций */}
      </div>

      {/* TODO: Список consumers.
          Для каждого consumer:
          - Цветной кружок (цвет = CONSUMER_COLORS[idx])
          - id (monospace)
          - Бейджи с номерами партиций (цвет партиции совпадает с consumer)
          - Если partitions.length === 0: текст "нет партиций (idle)"
          - Счётчик "обработано: N"
          - Кнопка удаления "x" (disabled при rebalancing или consumers.length <= 1) */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1rem' }}>
        {/* TODO: отрисовать consumers */}
      </div>

      {/* TODO: Лог событий — показывать только если log.length > 0.
          Тёмный фон, monoespace шрифт, прокрутка, последние 10 записей */}
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
          {/* TODO: отрисовать log */}
        </div>
      )}
    </div>
  )
}
