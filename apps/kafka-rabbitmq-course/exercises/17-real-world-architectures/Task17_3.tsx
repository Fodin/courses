import { useState } from 'react'
import { useLanguage } from 'src/hooks'

// ============================================================
// Задание 17.3: Выбор архитектуры — кейс
// Task 17.3: Architecture Decision — Case Study
// ============================================================
//
// Goal: build an interactive architecture decision trainer.
// The user studies a business scenario, picks a broker and patterns,
// then the component evaluates the answer on a 10-point scale and
// provides detailed feedback.

// TODO: Define the Scenario interface. / Определите интерфейс Scenario.
// Fields: id: string, title: string, description: string,
//         requirements: string[], constraints: string[], scale: string
// interface Scenario { ... }

// TODO: Define the ArchOption interface. / Определите интерфейс ArchOption.
// Fields: id: string, label: string, icon: string, description: string
// interface ArchOption { ... }

// TODO: Define the Pattern interface. / Определите интерфейс Pattern.
// Fields: id: string, label: string, icon: string, description: string
// interface Pattern { ... }

// TODO: Define the ScenarioAnswer interface. / Определите интерфейс ScenarioAnswer.
// Fields: broker: string, patterns: string[]
// interface ScenarioAnswer { ... }

// TODO: Define the EvaluationResult interface. / Определите интерфейс EvaluationResult.
// Fields: score: number, maxScore: number, feedback: string[],
//         verdict: 'excellent' | 'good' | 'partial' | 'poor'
// interface EvaluationResult { ... }

// TODO: Declare SCENARIOS: Scenario[] — 3 scenarios: / Объявите SCENARIOS: Scenario[] — 3 сценария:
// 1. id: 'ecommerce', title: 'E-commerce платформа'
//    description: 'Маркетплейс с 500 продавцами, 100k пользователей в день. Заказы, оплата, склад, уведомления.'
//    requirements: guaranteed command delivery, historical event log, multiple independent consumers, priority routing
//    constraints: 20 developers, Kubernetes already in use, replay not needed more than quarterly
//    scale: '100k заказов/день, пиковая нагрузка ×5'
// 2. id: 'iot', title: 'IoT платформа телеметрии'
//    description: '50,000 датчиков на производстве. Каждый шлёт метрики раз в секунду...'
//    requirements: 50k msg/sec throughput, ML replay, partition by device_id, 30-day retention
//    constraints: sensors do not retry, ML team needs independent access, single-system budget
//    scale: '50,000 устройств × 1 msg/sec = 50k msg/sec'
// 3. id: 'fintech', title: 'Банковские переводы (Fintech)'
//    description: 'Сервис межбанковских переводов. Каждый перевод — Saga из 5 шагов с компенсациями.'
//    requirements: exactly-once, Saga with compensations, priority queue, DLQ
//    constraints: 30k/day strict SLA, full audit log required, p99 < 3s
//    scale: '30k transfers/day, p99 latency < 3s'
// const SCENARIOS: Scenario[] = [...]

// TODO: Declare ARCH_OPTIONS: ArchOption[] — 4 options: / Объявите ARCH_OPTIONS: ArchOption[] — 4 варианта:
// { id: 'kafka-only',    label: 'Только Kafka',                icon: 'K', description: 'Apache Kafka как единственный брокер' }
// { id: 'rabbitmq-only', label: 'Только RabbitMQ',             icon: 'R', description: 'RabbitMQ как единственный брокер' }
// { id: 'hybrid',        label: 'Гибрид (RabbitMQ + Kafka)',   icon: 'H', description: 'RabbitMQ для команд, Kafka для событий' }
// { id: 'pulsar',        label: 'Apache Pulsar',               icon: 'P', description: 'Унифицированный брокер с поддержкой обеих моделей' }
// const ARCH_OPTIONS: ArchOption[] = [...]

// TODO: Declare PATTERNS: Pattern[] — 8 patterns: / Объявите PATTERNS: Pattern[] — 8 паттернов:
// saga, cqrs, outbox (Transactional Outbox), dlq, event-source (Event Sourcing),
// priority (Priority Queue), competing (Competing Consumers), fanout (Fan-out / Pub-Sub)
// const PATTERNS: Pattern[] = [...]

// TODO: Define the ScoringRule interface. / Определите интерфейс ScoringRule.
// Fields: broker: string[], patterns: string[], reason: string
// interface ScoringRule { ... }

// TODO: Declare SCORING: Record<string, ScoringRule> — scoring rules per scenario: / Объявите SCORING: Record<string, ScoringRule> — правила оценки для каждого сценария:
// ecommerce: broker: ['hybrid', 'kafka-only'], patterns: ['saga', 'outbox', 'dlq', 'fanout', 'priority']
//   reason: 'E-commerce: гибрид оптимален — RabbitMQ для routing команд по приоритету, Kafka для аудит-лога событий...'
// iot: broker: ['kafka-only', 'pulsar'], patterns: ['competing', 'fanout', 'event-source']
//   reason: 'IoT: только Kafka / Pulsar — нужны replay, удержание данных, партицирование по device_id...'
// fintech: broker: ['rabbitmq-only', 'hybrid'], patterns: ['saga', 'dlq', 'outbox', 'priority', 'cqrs']
//   reason: 'Fintech: RabbitMQ (или гибрид) с Saga — exactly-once через publisher confirms + ack...'
// const SCORING: Record<string, ScoringRule> = { ... }

// TODO: Declare VERDICT_CONFIG with label, color, bg, border for each verdict: / Объявите VERDICT_CONFIG с label, color, bg, border для каждого вердикта:
// excellent → { label: 'Отлично!', color: '#38a169', bg: '#f0fff4', border: '#68d391' }
// good      → { label: 'Хорошо!', color: '#3182ce', bg: '#ebf8ff', border: '#90cdf4' }
// partial   → { label: 'Частично верно', color: '#d69e2e', bg: '#fffbeb', border: '#f6e05e' }
// poor      → { label: 'Нужно пересмотреть', color: '#e53e3e', bg: '#fff5f5', border: '#fc8181' }
// const VERDICT_CONFIG = { ... }

// TODO: Implement evaluateAnswer(scenarioId: string, answer: ScenarioAnswer): EvaluationResult / Реализуйте evaluateAnswer
// maxScore = 10
// Broker scoring (4 points): / Оценка брокера (4 балла):
//   - if SCORING[scenarioId].broker.includes(answer.broker) → +4 points,
//     push feedback: `Выбор брокера правильный (${label})`
//   - else push feedback: `Брокер не оптимален. Лучше: ${correct options joined}`
// Pattern scoring (up to 6 points): / Оценка паттернов (до 6 баллов):
//   - matchedPatterns = answer.patterns that are in scoring.patterns
//   - wrongPatterns  = answer.patterns not in scoring.patterns
//   - missedPatterns = scoring.patterns not in answer.patterns
//   - score += Math.min(6, matchedPatterns.length * 2)
//   - push feedback for matched / wrong / missed patterns (if any)
// Always push: `Обоснование: ${scoring.reason}` / Всегда добавляйте: `Обоснование: ${scoring.reason}`
// verdict: score >= 9 → 'excellent', >= 7 → 'good', >= 4 → 'partial', else 'poor'
// function evaluateAnswer(scenarioId: string, answer: ScenarioAnswer): EvaluationResult { ... }

export function Task17_3() {
  const { t } = useLanguage()

  // TODO: Declare state: / Объявите состояние:
  // scenarioIdx: number — current scenario index (initial: 0) / индекс текущего сценария
  // selectedBroker: string — chosen broker id (initial: '') / выбранный id брокера
  // selectedPatterns: string[] — chosen pattern ids (initial: []) / выбранные id паттернов
  // result: EvaluationResult | null (initial: null)
  const [scenarioIdx, setScenarioIdx] = useState(0)
  const [selectedBroker, setSelectedBroker] = useState('')
  const [selectedPatterns, setSelectedPatterns] = useState<string[]>([])
  const [result, setResult] = useState<any>(null)

  // TODO: Derive scenario = SCENARIOS[scenarioIdx] / Получите scenario = SCENARIOS[scenarioIdx]

  // TODO: Implement handleScenarioChange(idx: number): / Реализуйте handleScenarioChange
  // setScenarioIdx(idx), reset selectedBroker, selectedPatterns, result.
  // установите scenarioIdx, сбросьте selectedBroker, selectedPatterns, result.
  const handleScenarioChange = (idx: number) => {
    // TODO: implement
  }

  // TODO: Implement togglePattern(id: string): / Реализуйте togglePattern
  // If id is already in selectedPatterns → remove it, else add it. / Если id уже в selectedPatterns → удалить, иначе добавить.
  // Reset result to null. / Сбросьте result в null.
  const togglePattern = (id: string) => {
    // TODO: implement
  }

  // TODO: Implement handleBrokerChange(id: string): / Реализуйте handleBrokerChange
  // Set selectedBroker to id, reset result to null. / Установите selectedBroker в id, сбросьте result в null.
  const handleBrokerChange = (id: string) => {
    // TODO: implement
  }

  // TODO: Implement handleEvaluate: / Реализуйте handleEvaluate:
  // Guard: if !selectedBroker || selectedPatterns.length === 0, return.
  // Защита: если !selectedBroker || selectedPatterns.length === 0, вернуть.
  // Otherwise call evaluateAnswer and set result. / Иначе вызовите evaluateAnswer и установите result.
  const handleEvaluate = () => {
    // TODO: implement
  }

  // TODO: Implement handleReset: / Реализуйте handleReset:
  // Clear selectedBroker, selectedPatterns, result. / Очистите selectedBroker, selectedPatterns, result.
  const handleReset = () => {
    // TODO: implement
  }

  // TODO: Derive verdictCfg = result ? VERDICT_CONFIG[result.verdict] : null / Получите verdictCfg

  return (
    <div className="exercise-container">
      <h2>{t('task.17.3')}</h2>
      <p style={{ color: '#666', marginBottom: '1rem' }}>
        Изучи бизнес-сценарий. Выбери оптимальный брокер и паттерны.
        Компонент оценит твой выбор и объяснит правильный ответ.
      </p>

      {/* TODO: Scenario tabs — three buttons, one per SCENARIO. / Вкладки сценариев — три кнопки, по одной на SCENARIO.
          Active tab: blue background, white text. / Активная вкладка: синий фон, белый текст.
          Clicking a tab calls handleScenarioChange(idx). / Клик по вкладке вызывает handleScenarioChange(idx). */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
        {/* TODO: render scenario tabs */}
      </div>

      {/* TODO: Scenario card — show scenario.title, scenario.description, / Карточка сценария — покажите scenario.title, scenario.description,
          two columns (Requirements / Constraints), and a scale badge. / две колонки (Requirements / Constraints) и бейдж масштаба.
          Requirements in blue header, Constraints in red header. / Requirements с синим заголовком, Constraints с красным. */}
      <div style={{
        padding: '1rem',
        background: '#f8f9fa',
        borderRadius: '10px',
        border: '1px solid #e2e8f0',
        marginBottom: '1.25rem',
      }}>
        {/* TODO: render scenario details */}
      </div>

      {/* TODO: Broker selection — label "Выбери брокер сообщений:", then 4 option cards. / Выбор брокера — метка "Выбери брокер сообщений:", затем 4 карточки.
          Each card shows icon badge, label, and description. / Каждая карточка показывает иконку, метку и описание.
          Selected card: blue border + light blue background. / Выбранная карточка: синяя рамка + светло-голубой фон.
          Clicking a card calls handleBrokerChange(opt.id). / Клик по карточке вызывает handleBrokerChange(opt.id). */}
      <div style={{ marginBottom: '1.25rem' }}>
        <div style={{ fontWeight: 700, fontSize: '0.9rem', marginBottom: '0.6rem', color: '#2d3748' }}>
          Выбери брокер сообщений:
        </div>
        <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
          {/* TODO: render broker options */}
        </div>
      </div>

      {/* TODO: Pattern selection — label "Выбери необходимые паттерны (можно несколько):", then 8 cards. / Выбор паттернов — метка "Выбери необходимые паттерны (можно несколько):", затем 8 карточек.
          Each card shows checkmark (when selected), label, and description. / Каждая карточка показывает галочку (при выборе), метку и описание.
          Selected card: green border + light green background. / Выбранная карточка: зелёная рамка + светло-зелёный фон.
          Clicking toggles via togglePattern(pt.id). / Клик переключает через togglePattern(pt.id). */}
      <div style={{ marginBottom: '1.25rem' }}>
        <div style={{ fontWeight: 700, fontSize: '0.9rem', marginBottom: '0.6rem', color: '#2d3748' }}>
          Выбери необходимые паттерны (можно несколько):
        </div>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {/* TODO: render pattern cards */}
        </div>
      </div>

      {/* TODO: Action buttons: / Кнопки действий:
          - "Оценить архитектуру" (blue): calls handleEvaluate, / вызывает handleEvaluate,
            disabled when !selectedBroker || selectedPatterns.length === 0 / неактивна когда !selectedBroker || selectedPatterns.length === 0
          - "Сбросить" (grey): calls handleReset / вызывает handleReset */}
      <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1rem' }}>
        {/* TODO: render buttons */}
      </div>

      {/* TODO: Result block — only render when result is not null. / Блок результата — рендерить только когда result не null.
          Show score (result.score / result.maxScore), verdict label with / Покажите оценку, метку вердикта с
          styled background from verdictCfg, and each feedback string / стилизованным фоном из verdictCfg и каждую строку feedback
          as a separate paragraph. / как отдельный параграф. */}
      {result && (
        <div style={{
          padding: '1rem',
          borderRadius: '10px',
          border: '1px solid #e2e8f0',
          background: '#f8f9fa',
        }}>
          {/* TODO: render result */}
        </div>
      )}
    </div>
  )
}
