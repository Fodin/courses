import { useState, useEffect, useRef } from 'react'
import { useLanguage } from 'src/hooks'

// ============================================================
// Задание 16.1: Consumer Lag дашборд / Task 16.1: Consumer Lag Dashboard
// ============================================================
//
// Goal: build a real-time Consumer Lag dashboard that simulates
// Kafka producers and consumers, shows lag per partition,
// and visualises critical/growing/ok states with colour coding.

// TODO: Declare the PartitionStats interface. / Объявите интерфейс PartitionStats.
// Fields: partition: number, logEndOffset: number,
//         committedOffset: number, lag: number
// interface PartitionStats { ... }

// TODO: Declare the ConsumerGroup interface. / Объявите интерфейс ConsumerGroup.
// Fields: id: string, topic: string, partitions: PartitionStats[]
// interface ConsumerGroup { ... }

// TODO: Implement getLagColor(lag, threshold): string / Реализуйте функцию getLagColor
// Returns '#e53e3e' if lag >= threshold.red,
//         '#ed8936' if lag >= threshold.yellow,
//         '#38a169' otherwise
// function getLagColor(lag: number, threshold: { yellow: number; red: number }): string { ... }

// TODO: Implement getLagLabel(lag, threshold): string / Реализуйте функцию getLagLabel
// Returns 'CRITICAL' / 'GROWING' / 'OK'
// function getLagLabel(lag: number, threshold: { yellow: number; red: number }): string { ... }

// TODO: Declare THRESHOLDS = { yellow: 500, red: 2000 } / Объявите THRESHOLDS

// TODO: Declare INITIAL_GROUPS: ConsumerGroup[] — two consumer groups: / Объявите INITIAL_GROUPS — две группы консьюмеров:
// 1. id: 'orders-consumer', topic: 'orders', 3 partitions with small lag (2, 5, 1)
//    logEndOffset: ~10420/10380/10510, committedOffset: lag behind
// 2. id: 'analytics-consumer', topic: 'events', 3 partitions with varying lag:
//    partition 0 lag 700 (GROWING), partition 1 lag 1200 (GROWING), partition 2 lag 2200 (CRITICAL)

export function Task16_1() {
  const { t } = useLanguage()

  // TODO: Declare state: / Объявите состояние:
  // groups: ConsumerGroup[] (initial: INITIAL_GROUPS)
  // slowdown: boolean (initial: false) — simulates a slow consumer / симулирует медленный консьюмер
  const [groups, setGroups] = useState<any[]>([])
  const [slowdown, setSlowdown] = useState(false)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  // TODO: Implement useEffect with setInterval (1200ms): / Реализуйте useEffect с setInterval (1200мс):
  // Each tick — update every group's partitions: / Каждый тик — обновить все партиции всех групп:
  //   produce = random(40..159)  ← new messages arriving / новые сообщения прибывают
  //   consume = slowdown
  //     ? random(5..24)          ← consumer is slow / консьюмер медленный
  //     : random(40..149)        ← normal speed / нормальная скорость
  //   newLeo = p.logEndOffset + produce
  //   newCommitted = Math.min(p.committedOffset + consume, newLeo)
  //   lag = newLeo - newCommitted
  // Return cleanup: clearInterval(intervalRef.current) / Верните очистку: clearInterval
  useEffect(() => {
    // TODO: implement
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [slowdown])

  // TODO: Compute totalLag as the sum of lag across all partitions of all groups / Вычислите totalLag как сумму lag по всем партициям всех групп

  return (
    <div className="exercise-container">
      <h2>{t('task.16.1')}</h2>
      <p style={{ color: '#666', marginBottom: '1rem' }}>
        Consumer Lag показывает, насколько consumer отстаёт от producer. / Consumer lag shows how far behind the consumer is from the producer.
        Зелёный — норма, / Green = OK,
        жёлтый — lag растёт, / Yellow = lag growing,
        красный — критическое отставание. / Red = critical lag.
      </p>

      {/* TODO: Controls row — flex, gap 1rem, marginBottom 1.5rem / Строка элементов управления */}
      {/* Button: toggles slowdown, text changes based on state / Кнопка переключения замедления */}
      {/*   slowdown=true  → 'Consumer замедлен (симуляция инцидента)', background '#e53e3e' */}
      {/*   slowdown=false → 'Consumer работает нормально', background '#38a169' */}
      {/* Summary badge: "Суммарный lag: {totalLag}" — totalLag colored via getLagColor / Бейдж с суммарным lag */}
      {/* Small label: "Обновление каждые 1.2 сек" / Метка "Обновление каждые 1.2 сек" / "Updates every 1.2s" */}
      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        {/* TODO: button and badges */}
      </div>

      {/* TODO: Legend row — three coloured dots with labels / Легенда — три цветные точки с метками: */}
      {/* OK (< 500) green, GROWING (500-2000) orange, CRITICAL (> 2000) red */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
        {/* TODO: legend items */}
      </div>

      {/* TODO: Consumer groups list / Список групп консьюмеров */}
      {/* For each group: / Для каждой группы:
          - Card with border color = getLagColor(groupLag, { yellow: 1000, red: 4000 })
          - Header: group.id (monospace), topic badge, status badge (getLagLabel + lag total)
          - Partition table with header: Partition | Log-End Offset | Committed Offset | Lag (визуально) | Статус
          - Each partition row: P{n} | logEndOffset | committedOffset | progress bar + lag number | status badge
          - Progress bar: width = Math.min((lag / (logEndOffset * 0.05 + 1)) * 100, 100)%
          - All colors via getLagColor(p.lag, THRESHOLDS), transitions 0.4s ease
      */}
      {groups.map(group => (
        <div key={group.id}>
          {/* TODO: group card */}
        </div>
      ))}

      <div style={{ marginTop: '0.5rem', fontSize: '0.8rem', color: '#999' }}>
        Нажми кнопку выше, чтобы симулировать замедление consumer и наблюдать рост lag в реальном времени / Click the button above to simulate consumer slowdown and watch lag grow in real time
      </div>
    </div>
  )
}
