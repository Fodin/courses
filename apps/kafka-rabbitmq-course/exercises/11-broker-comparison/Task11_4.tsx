import { useState } from 'react'
import { useLanguage } from 'src/hooks'

// ============================================================
// Task 11.4: Benchmark Dashboard
// Задание 11.4: Benchmark Dashboard
// ============================================================
//
// Goal: implement an interactive dashboard with benchmark data
// Цель: реализовать интерактивный дашборд с бенчмарк-данными
// for five brokers — throughput, latency, and message size impact.
// пяти брокеров — throughput, latency и влияние размера сообщений.

// TODO: Define BenchScenario interface:
// TODO: Определи интерфейс BenchScenario:
//   id: string
//   name: string
//   description: string
// interface BenchScenario { ... }

// TODO: Define BrokerBenchmark interface:
// TODO: Определи интерфейс BrokerBenchmark:
//   broker: string
//   color: string
//   throughput: Record<string, number>      — by scenario id
//   throughput: Record<string, number>      — по id сценария
//   p99Latency: Record<string, number>      — by scenario id
//   p99Latency: Record<string, number>      — по id сценария
//   msgSizeImpact: { size: string; throughput: number; latency: number }[]
// interface BrokerBenchmark { ... }

// TODO: Declare BENCH_SCENARIOS array of 4 scenarios:
// TODO: Объяви массив BENCH_SCENARIOS из 4 сценариев:
//   { id: 'small_persist', name: 'Small + Persistent', description: '1KB, 3x replication, fsync, at-least-once' }
//   { id: 'small_fast', name: 'Small + Fast', description: '1KB, in-memory / no fsync, at-most-once' }
//   { id: 'large_persist', name: 'Large + Persistent', description: '100KB, 3x replication, disk flush' }
//   { id: 'fanout', name: 'Fan-out 10 consumers', description: '1KB, 10 parallel consumers' }
//   { id: 'fanout', name: 'Fan-out 10 consumers', description: '1KB, 10 параллельных потребителей' }
// const BENCH_SCENARIOS: BenchScenario[] = [...]

// TODO: Declare BENCH_DATA array of 5 BrokerBenchmark objects.
// TODO: Объяви массив BENCH_DATA из 5 объектов типа BrokerBenchmark.
// Approximate throughput values (msg/s) for small_persist:
// Ориентировочные значения throughput (msg/s) для small_persist:
//   Kafka ~800K, RabbitMQ ~45K, NATS ~450K, Redis ~120K, Pulsar ~750K
// p99Latency (ms) for small_persist:
// p99Latency (ms) для small_persist:
//   Kafka 12, RabbitMQ 8, NATS 5, Redis 3, Pulsar 10
// For small_fast throughput is significantly higher (Kafka 2M, NATS 8M, etc.)
// Для small_fast throughput значительно выше (Kafka 2M, NATS 8M и т.д.)
// msgSizeImpact — 5 data points: 100B, 1KB, 10KB, 100KB, 1MB (throughput decreases with size)
// msgSizeImpact — 5 точек: 100B, 1KB, 10KB, 100KB, 1MB (throughput падает с ростом размера)
// const BENCH_DATA: BrokerBenchmark[] = [...]

// TODO: Implement formatNum(n: number): string
// TODO: Реализуй функцию formatNum(n: number): string
// Rules: n >= 1_000_000 → (n/1M).toFixed(1) + 'M'
// Правила: n >= 1_000_000 → (n/1M).toFixed(1) + 'M'
//          n >= 1_000     → (n/1K).toFixed(0) + 'K'
//          иначе          → String(n)
//          otherwise      → String(n)
// const formatNum = (n: number): string => ...

// TODO: Define BenchView type = 'throughput' | 'latency' | 'msgsize'
// TODO: Определи тип BenchView = 'throughput' | 'latency' | 'msgsize'

export function Task11_4() {
  const { t } = useLanguage()

  // TODO: State scenario: string, initial 'small_persist'
  // TODO: Состояние scenario: string, начально 'small_persist'
  const [scenario, setScenario] = useState('small_persist')

  // TODO: State view: BenchView, initial 'throughput'
  // TODO: Состояние view: BenchView, начально 'throughput'
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [view, setView] = useState<any>('throughput')

  // TODO: State selectedBrokers: Set<string> — all 5 brokers selected
  // TODO: Состояние selectedBrokers: Set<string> — все 5 брокеров выбраны
  const [selectedBrokers, setSelectedBrokers] = useState<Set<string>>(new Set())

  // TODO: State msgSizeBroker: string, initial 'Apache Kafka'
  // TODO: Состояние msgSizeBroker: string, начально 'Apache Kafka'
  const [msgSizeBroker, setMsgSizeBroker] = useState('Apache Kafka')

  // TODO: Function toggleBroker(broker: string):
  // TODO: Функция toggleBroker(broker: string):
  // - if broker in selectedBrokers and selectedBrokers.size > 1 → remove
  // - если broker в selectedBrokers и selectedBrokers.size > 1 → удалить
  // - if not in selectedBrokers → add
  // - если не в selectedBrokers → добавить
  // - else do nothing (protect from removing last one)
  // - иначе ничего не делать (защита от удаления последнего)
  const toggleBroker = (_broker: string) => {
    setSelectedBrokers((prev) => {
      const next = new Set(prev)
      // TODO: implement logic
      // TODO: реализовать логику
      return next
    })
  }

  // TODO: Compute visibleData — BENCH_DATA.filter(b => selectedBrokers.has(b.broker))
  // TODO: Вычисли visibleData — BENCH_DATA.filter(b => selectedBrokers.has(b.broker))
  // TODO: Compute maxThroughput — max of visibleData by throughput[scenario]
  // TODO: Вычисли maxThroughput — max из visibleData по throughput[scenario]
  // TODO: Compute maxLatency — max of visibleData by p99Latency[scenario]
  // TODO: Вычисли maxLatency — max из visibleData по p99Latency[scenario]
  // TODO: Compute scenarioConfig — BENCH_SCENARIOS.find(s => s.id === scenario)
  // TODO: Вычисли scenarioConfig — BENCH_SCENARIOS.find(s => s.id === scenario)
  // TODO: Compute msgSizeData — BENCH_DATA.find(b => b.broker === msgSizeBroker)?.msgSizeImpact
  // TODO: Вычисли msgSizeData — BENCH_DATA.find(b => b.broker === msgSizeBroker)?.msgSizeImpact
  // TODO: Compute maxMsgThroughput — max of msgSizeData by throughput
  // TODO: Вычисли maxMsgThroughput — max из msgSizeData по throughput

  return (
    <div className="exercise-container">
      <h2>{t('task.11.4')}</h2>

      {/* TODO: Broker filters.
          {/* TODO: Фильтры брокеров.
          BENCH_DATA.map(b → button):
          - opacity: 0.4 if not in selectedBrokers, 1 if selected
          - opacity: 0.4 если не в selectedBrokers, 1 если выбран
          - borderBottom with b.color if selected, transparent if not
          - borderBottom с b.color если выбран, прозрачный если нет
          - onClick → toggleBroker(b.broker)
      */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1rem' }}>
        {/* TODO: filter buttons */}
        {/* TODO: кнопки фильтров */}
      </div>

      {/* TODO: Tabs: ['throughput', 'latency', 'msgsize'].map.
          {/* TODO: Вкладки: ['throughput', 'latency', 'msgsize'].map.
          Names: 'Throughput', 'P99 Latency', 'Msg Size Impact'
          Названия: 'Throughput', 'P99 Latency', 'Msg Size Impact'
          Active: fontWeight bold
      */}
      <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '1rem' }}>
        {/* TODO: tabs */}
        {/* TODO: вкладки */}
      </div>

      {/* TODO: Block for throughput / latency tabs (view !== 'msgsize'):
          {/* TODO: Блок для вкладок throughput / latency (view !== 'msgsize'):
          - Scenario buttons (BENCH_SCENARIOS.map):
          - Кнопки сценариев (BENCH_SCENARIOS.map):
            active: background rgba(255,255,255,0.1), border #888
          - Scenario description (scenarioConfig.description)
          - Описание сценария (scenarioConfig.description)
          - Bar chart: visibleData.map(b →):
          - Bar-chart: visibleData.map(b →):
            * value = view === 'throughput' ? b.throughput[scenario] : b.p99Latency[scenario]
            * pct = (value / maxVal) * 100
            * For latency: bar red (#c0392b) if pct > 60
            * Для latency: бар красный (#c0392b) если pct > 60
            * Otherwise: bar in b.color
            * Иначе: бар цвета b.color
            * transition: 'width 0.4s ease'
            * Label: b.broker (in b.color) + value (formatNum or ms)
            * Подпись: b.broker (цветом b.color) + значение (formatNum или ms)
      */}

      {/* TODO: Block for msgsize tab (view === 'msgsize'):
          {/* TODO: Блок для вкладки msgsize (view === 'msgsize'):
          - Broker switcher (BENCH_DATA.map → buttons)
          - Переключатель брокеров (BENCH_DATA.map → кнопки)
          - Header "Message size impact on throughput (msg/s)"
          - Заголовок "Влияние размера сообщения на throughput (msg/s)"
          - Bar chart: msgSizeData.map(d →):
          - Bar-chart: msgSizeData.map(d →):
            * pct = (d.throughput / maxMsgThroughput) * 100
            * Label: size (monospace) + formatNum(throughput) + p99: latency ms
            * Подпись: size (monospace) + formatNum(throughput) + p99: latency ms
          - Summary note about overall trend
          - Вывод-заметка об общей тенденции
      */}

      {/* TODO: Methodology block (always visible):
          {/* TODO: Блок методологии (всегда виден):
          Data based on public benchmarks (Confluent, NATS.io, CloudAMQP, RedisLabs, DataStax).
          Данные основаны на публичных бенчмарках (Confluent, NATS.io, CloudAMQP, RedisLabs, DataStax).
          Actual results depend on hardware, batch size, replication factor, configuration.
          Реальные результаты зависят от hardware, batch size, replication factor, конфигурации.
          Use these numbers as a guideline, not absolute truth.
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
        {/* TODO: methodology text */}
        {/* TODO: текст методологии */}
      </div>
    </div>
  )
}
