import { useState } from 'react'
import { useLanguage } from 'src/hooks'

// ============================================================
// Задание 11.4: Benchmark Dashboard
// ============================================================
//
// Цель: реализовать интерактивный дашборд с бенчмарк-данными
// пяти брокеров — throughput, latency и влияние размера сообщений.

// TODO: Определи интерфейс BenchScenario:
//   id: string
//   name: string
//   description: string
// interface BenchScenario { ... }

// TODO: Определи интерфейс BrokerBenchmark:
//   broker: string
//   color: string
//   throughput: Record<string, number>      — по id сценария
//   p99Latency: Record<string, number>      — по id сценария
//   msgSizeImpact: { size: string; throughput: number; latency: number }[]
// interface BrokerBenchmark { ... }

// TODO: Объяви массив BENCH_SCENARIOS из 4 сценариев:
//   { id: 'small_persist', name: 'Small + Persistent', description: '1KB, 3x replication, fsync, at-least-once' }
//   { id: 'small_fast', name: 'Small + Fast', description: '1KB, in-memory / no fsync, at-most-once' }
//   { id: 'large_persist', name: 'Large + Persistent', description: '100KB, 3x replication, disk flush' }
//   { id: 'fanout', name: 'Fan-out 10 consumers', description: '1KB, 10 параллельных потребителей' }
// const BENCH_SCENARIOS: BenchScenario[] = [...]

// TODO: Объяви массив BENCH_DATA из 5 объектов типа BrokerBenchmark.
// Ориентировочные значения throughput (msg/s) для small_persist:
//   Kafka ~800K, RabbitMQ ~45K, NATS ~450K, Redis ~120K, Pulsar ~750K
// p99Latency (ms) для small_persist:
//   Kafka 12, RabbitMQ 8, NATS 5, Redis 3, Pulsar 10
// Для small_fast throughput значительно выше (Kafka 2M, NATS 8M и т.д.)
// msgSizeImpact — 5 точек: 100B, 1KB, 10KB, 100KB, 1MB (throughput падает с ростом размера)
// const BENCH_DATA: BrokerBenchmark[] = [...]

// TODO: Реализуй функцию formatNum(n: number): string
// Правила: n >= 1_000_000 → (n/1M).toFixed(1) + 'M'
//          n >= 1_000     → (n/1K).toFixed(0) + 'K'
//          иначе          → String(n)
// const formatNum = (n: number): string => ...

// TODO: Определи тип BenchView = 'throughput' | 'latency' | 'msgsize'

export function Task11_4() {
  const { t } = useLanguage()

  // TODO: Состояние scenario: string, начально 'small_persist'
  const [scenario, setScenario] = useState('small_persist')

  // TODO: Состояние view: BenchView, начально 'throughput'
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [view, setView] = useState<any>('throughput')

  // TODO: Состояние selectedBrokers: Set<string> — все 5 брокеров выбраны
  const [selectedBrokers, setSelectedBrokers] = useState<Set<string>>(new Set())

  // TODO: Состояние msgSizeBroker: string, начально 'Apache Kafka'
  const [msgSizeBroker, setMsgSizeBroker] = useState('Apache Kafka')

  // TODO: Функция toggleBroker(broker: string):
  // - если broker в selectedBrokers и selectedBrokers.size > 1 → удалить
  // - если не в selectedBrokers → добавить
  // - иначе ничего не делать (защита от удаления последнего)
  const toggleBroker = (_broker: string) => {
    setSelectedBrokers((prev) => {
      const next = new Set(prev)
      // TODO: реализовать логику
      return next
    })
  }

  // TODO: Вычисли visibleData — BENCH_DATA.filter(b => selectedBrokers.has(b.broker))
  // TODO: Вычисли maxThroughput — max из visibleData по throughput[scenario]
  // TODO: Вычисли maxLatency — max из visibleData по p99Latency[scenario]
  // TODO: Вычисли scenarioConfig — BENCH_SCENARIOS.find(s => s.id === scenario)
  // TODO: Вычисли msgSizeData — BENCH_DATA.find(b => b.broker === msgSizeBroker)?.msgSizeImpact
  // TODO: Вычисли maxMsgThroughput — max из msgSizeData по throughput

  return (
    <div className="exercise-container">
      <h2>{t('task.11.4')}</h2>

      {/* TODO: Фильтры брокеров.
          BENCH_DATA.map(b → кнопка):
          - opacity: 0.4 если не в selectedBrokers, 1 если выбран
          - borderBottom с b.color если выбран, прозрачный если нет
          - onClick → toggleBroker(b.broker)
      */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1rem' }}>
        {/* TODO: кнопки фильтров */}
      </div>

      {/* TODO: Вкладки: ['throughput', 'latency', 'msgsize'].map.
          Названия: 'Throughput', 'P99 Latency', 'Msg Size Impact'
          Активная: fontWeight bold
      */}
      <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '1rem' }}>
        {/* TODO: вкладки */}
      </div>

      {/* TODO: Блок для вкладок throughput / latency (view !== 'msgsize'):
          - Кнопки сценариев (BENCH_SCENARIOS.map):
            активная: background rgba(255,255,255,0.1), border #888
          - Описание сценария (scenarioConfig.description)
          - Bar-chart: visibleData.map(b →):
            * value = view === 'throughput' ? b.throughput[scenario] : b.p99Latency[scenario]
            * pct = (value / maxVal) * 100
            * Для latency: бар красный (#c0392b) если pct > 60
            * Иначе: бар цвета b.color
            * transition: 'width 0.4s ease'
            * Подпись: b.broker (цветом b.color) + значение (formatNum или ms)
      */}

      {/* TODO: Блок для вкладки msgsize (view === 'msgsize'):
          - Переключатель брокеров (BENCH_DATA.map → кнопки)
          - Заголовок "Влияние размера сообщения на throughput (msg/s)"
          - Bar-chart: msgSizeData.map(d →):
            * pct = (d.throughput / maxMsgThroughput) * 100
            * Подпись: size (monospace) + formatNum(throughput) + p99: latency ms
          - Вывод-заметка об общей тенденции
      */}

      {/* TODO: Блок методологии (всегда виден):
          Данные основаны на публичных бенчмарках (Confluent, NATS.io, CloudAMQP, RedisLabs, DataStax).
          Реальные результаты зависят от hardware, batch size, replication factor, конфигурации.
          Используй эти цифры как ориентир, а не абсолютную истину.
      */}
      <div style={{
        padding: '0.75rem',
        background: 'rgba(255,165,0,0.08)',
        border: '1px solid rgba(255,165,0,0.3)',
        borderRadius: 6,
        fontSize: '0.78rem',
        color: '#888',
        lineHeight: 1.5,
        marginTop: '1rem',
      }}>
        {/* TODO: текст методологии */}
      </div>
    </div>
  )
}
