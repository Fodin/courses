import { useState } from 'react'
import { useLanguage } from 'src/hooks'

// ============================================================
// Task 11.3: Decision Tree — Broker Selection
// Задание 11.3: Decision Tree — выбор брокера
// ============================================================
//
// Goal: implement a step-by-step wizard (decision tree) for selecting
// Цель: реализовать пошаговый wizard (дерево решений) для выбора
// a message broker. "Yes/No" questions lead to one of the recommendations.
// брокера сообщений. Вопросы "Да/Нет" ведут к одной из рекомендаций.

// TODO: Define TreeNode interface:
// TODO: Определи интерфейс TreeNode:
//   id: string
//   question?: string       — question text (if not terminal)
//   question?: string       — текст вопроса (если не терминальный)
//   yes?: string            — next node ID on "Yes"
//   yes?: string            — ID следующего узла при ответе "Да"
//   no?: string             — next node ID on "No"
//   no?: string             — ID следующего узла при ответе "Нет"
//   result?: string         — broker name (if terminal)
//   result?: string         — название брокера (если терминальный)
//   broker?: string         — broker key
//   broker?: string         — ключ брокера
//   color?: string          — broker color
//   color?: string          — цвет брокера
//   explanation?: string    — why this choice
//   explanation?: string    — почему этот выбор
//   useCases?: string[]     — usage examples
//   useCases?: string[]     — примеры использования
// interface TreeNode { ... }

// TODO: Fill TREE_NODES object: Record<string, TreeNode>
// TODO: Заполни объект TREE_NODES: Record<string, TreeNode>
// At least 10 nodes: 4+ questions + 6 results.
// Минимум 10 узлов: 4+ вопроса + 6 результатов.
//
// Question structure (not necessarily exact, but logically connected):
// Структура вопросов (не обязательно точная, но логически связная):
//   root → question about guaranteed delivery
//   root → вопрос о гарантированной доставке
//     no → r_nats_core (NATS Core, fire-and-forget)
//     yes → q_replay
//       q_replay → need replay/rereading
//       q_replay → нужен ли replay/повторное чтение
//         yes → q_throughput → question about throughput > 500K
//           yes → q_tiered → tiered storage / geo-replication
//             yes → r_pulsar
//             no  → r_kafka
//           no  → q_ops_kafka → have Kafka or Redis experience
//           no  → q_ops_kafka → есть опыт Kafka или Redis в стеке
//             yes → r_kafka_small
//             no  → q_nats_js → is minimal ops complexity important
//             no  → q_nats_js → важна мин. операционная сложность
//               yes → r_nats_js
//               no  → r_kafka_small
//         no → q_routing → need complex routing / DLQ / RPC
//         no  → q_routing → нужна сложная маршрутизация / DLQ / RPC
//           yes → r_rabbitmq
//           no → q_redis_existing → Redis already in stack
//           no  → q_redis_existing → Redis уже в стеке
//             yes → r_redis_streams
//             no → q_latency → is latency < 1ms critical
//             no  → q_latency → критична latency < 1ms
//               yes → r_nats_core
//               no  → r_rabbitmq
//
// const TREE_NODES: Record<string, TreeNode> = { ... }

// TODO: Declare BROKER_COLORS dictionary for 5 brokers
// TODO: Объяви словарь BROKER_COLORS для 5 брокеров
// const BROKER_COLORS: Record<string, string> = { ... }

export function Task11_3() {
  const { t } = useLanguage()

  // TODO: State path: string[] — history of traversed nodes.
  // TODO: Состояние path: string[] — история пройденных узлов.
  // Initial value: ['root']
  // Начальное значение: ['root']
  const [path, setPath] = useState<string[]>(['root'])

  // TODO: State answers: Record<string, boolean> — answers to each question.
  // TODO: Состояние answers: Record<string, boolean> — ответы на каждый вопрос.
  // Initially empty object.
  // Начально пустой объект.
  const [answers, setAnswers] = useState<Record<string, boolean>>({})

  // TODO: currentNodeId = path[path.length - 1]
  // TODO: currentNode = TREE_NODES[currentNodeId]
  // TODO: currentNodeId = path[path.length - 1]
  // TODO: currentNode = TREE_NODES[currentNodeId]

  // TODO: Function answer(yes: boolean):
  // TODO: Функция answer(yes: boolean):
  // - find next node: yes ? currentNode.yes : currentNode.no
  // - найти следующий узел: yes ? currentNode.yes : currentNode.no
  // - if none → return
  // - если нет → return
  // - update answers: { ...prev, [currentNodeId]: yes }
  // - обновить answers: { ...prev, [currentNodeId]: yes }
  // - update path: [...prev, next]
  // - обновить path: [...prev, next]
  const answer = (_yes: boolean) => {
    // TODO: implement
    // TODO: реализовать
  }

  // TODO: Function back():
  // TODO: Функция back():
  // - if path.length <= 1 → return
  // - если path.length <= 1 → return
  // - find second-to-last node
  // - найти предпоследний узел
  // - remove its answer from answers
  // - удалить его ответ из answers
  // - setPath(p => p.slice(0, -1))
  const back = () => {
    // TODO: implement
    // TODO: реализовать
  }

  // TODO: Function reset():
  // TODO: Функция reset():
  // - setPath(['root'])
  // - setAnswers({})
  const reset = () => {
    // TODO: implement
    // TODO: реализовать
  }

  // TODO: isResult = Boolean(currentNode.result)
  // TODO: isResult = Boolean(currentNode.result)

  return (
    <div className="exercise-container">
      <h2>{t('task.11.3')}</h2>

      {/* TODO: Breadcrumbs — path history.
          {/* TODO: Breadcrumbs — история пути.
          path.map(nodeId, i):
          - Arrow → between steps (except first)
          - Стрелка → между шагами (кроме первого)
          - Node text: node.result or "Question N"
          - Текст узла: node.result или "Вопрос N"
          - For traversed: show answer (Yes/No) in green/red
          - Для пройденных: показать ответ (Да/Нет) зелёным/красным
          - Current step: in white
          - Текущий шаг: белым
      */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem', marginBottom: '1rem', fontSize: '0.8rem', color: '#888' }}>
      {/* TODO: breadcrumbs */}
        {/* TODO: breadcrumbs */}
      </div>

      {/* TODO: Current node.
          {/* TODO: Текущий узел.
          Border: colored if isResult, gray (#555) if question.
          Рамка: цветная если isResult, серая (#555) если вопрос.

          If isResult:
          Если isResult:
            - "Recommendation" (gray header)
            - "Рекомендация" (серый заголовок)
            - currentNode.result (large, in currentNode.color)
            - currentNode.result (крупно, цветом currentNode.color)
            - currentNode.explanation
            - currentNode.explanation
            - "Use cases:" + currentNode.useCases.map(...)
            - "Use cases:" + currentNode.useCases.map(...)

          If question:
          Если вопрос:
            - "Step N of ~5" (gray)
            - "Шаг N из ~5" (серый)
            - currentNode.question (large, bold)
            - currentNode.question (крупно, полужирно)
            - Buttons: "Yes" (green: background #1a4a1a, border #4caf50, color #4caf50)
            - Кнопки: "Да" (зелёная: background #1a4a1a, border #4caf50, color #4caf50)
                     "No" (red: background #4a1a1a, border #f44336, color #f44336)
                     "Нет" (красная: background #4a1a1a, border #f44336, color #f44336)
      */}
      <div style={{ border: '2px solid #555', borderRadius: 10, padding: '1.25rem', marginBottom: '1rem', minHeight: 140 }}>
        {/* TODO: node content */}
        {/* TODO: содержимое узла */}
      </div>

      {/* TODO: Navigation buttons — show only if path.length > 1:
          {/* TODO: Кнопки навигации — показывать только если path.length > 1:
          "Back" (calls back) and "Start over" (calls reset)
          "Назад" (вызывает back) и "Начать заново" (вызывает reset)
      */}
      <div style={{ display: 'flex', gap: '0.5rem' }}>
        {/* TODO: navigation buttons */}
        {/* TODO: кнопки навигации */}
      </div>

      {/* TODO: Broker grid at bottom — always visible.
          {/* TODO: Сетка брокеров внизу — всегда видима.
          Object.entries(BROKER_COLORS).map([key, color]):
          - border with color
          - рамка с цветом
          - broker name (in color)
          - название брокера (цветом)
          - short description (kafka → 'High-throughput log', rabbitmq → 'Smart routing',
            nats → 'Low-latency', redis → 'Redis-native', pulsar → 'Geo-distributed')
      */}
      <div style={{ marginTop: '1.5rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '0.5rem' }}>
        {/* TODO: broker cards */}
        {/* TODO: карточки брокеров */}
      </div>
    </div>
  )
}
