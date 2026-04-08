import { useState } from 'react'
import { useLanguage } from 'src/hooks'

// ============================================================
// Задание 11.3: Decision Tree — выбор брокера
// ============================================================
//
// Цель: реализовать пошаговый wizard (дерево решений) для выбора
// брокера сообщений. Вопросы "Да/Нет" ведут к одной из рекомендаций.

// TODO: Определи интерфейс TreeNode:
//   id: string
//   question?: string       — текст вопроса (если не терминальный)
//   yes?: string            — ID следующего узла при ответе "Да"
//   no?: string             — ID следующего узла при ответе "Нет"
//   result?: string         — название брокера (если терминальный)
//   broker?: string         — ключ брокера
//   color?: string          — цвет брокера
//   explanation?: string    — почему этот выбор
//   useCases?: string[]     — примеры использования
// interface TreeNode { ... }

// TODO: Заполни объект TREE_NODES: Record<string, TreeNode>
// Минимум 10 узлов: 4+ вопроса + 6 результатов.
//
// Структура вопросов (не обязательно точная, но логически связная):
//   root → вопрос о гарантированной доставке
//     no → r_nats_core (NATS Core, fire-and-forget)
//     yes → q_replay
//       q_replay → нужен ли replay/повторное чтение
//         yes → q_throughput → вопрос о throughput > 500K
//           yes → q_tiered → tiered storage / geo-replication
//             yes → r_pulsar
//             no  → r_kafka
//           no  → q_ops_kafka → есть опыт Kafka или Redis в стеке
//             yes → r_kafka_small
//             no  → q_nats_js → важна мин. операционная сложность
//               yes → r_nats_js
//               no  → r_kafka_small
//         no  → q_routing → нужна сложная маршрутизация / DLQ / RPC
//           yes → r_rabbitmq
//           no  → q_redis_existing → Redis уже в стеке
//             yes → r_redis_streams
//             no  → q_latency → критична latency < 1ms
//               yes → r_nats_core
//               no  → r_rabbitmq
//
// const TREE_NODES: Record<string, TreeNode> = { ... }

// TODO: Объяви словарь BROKER_COLORS для 5 брокеров
// const BROKER_COLORS: Record<string, string> = { ... }

export function Task11_3() {
  const { t } = useLanguage()

  // TODO: Состояние path: string[] — история пройденных узлов.
  // Начальное значение: ['root']
  const [path, setPath] = useState<string[]>(['root'])

  // TODO: Состояние answers: Record<string, boolean> — ответы на каждый вопрос.
  // Начально пустой объект.
  const [answers, setAnswers] = useState<Record<string, boolean>>({})

  // TODO: currentNodeId = path[path.length - 1]
  // TODO: currentNode = TREE_NODES[currentNodeId]

  // TODO: Функция answer(yes: boolean):
  // - найти следующий узел: yes ? currentNode.yes : currentNode.no
  // - если нет → return
  // - обновить answers: { ...prev, [currentNodeId]: yes }
  // - обновить path: [...prev, next]
  const answer = (_yes: boolean) => {
    // TODO: реализовать
  }

  // TODO: Функция back():
  // - если path.length <= 1 → return
  // - найти предпоследний узел
  // - удалить его ответ из answers
  // - setPath(p => p.slice(0, -1))
  const back = () => {
    // TODO: реализовать
  }

  // TODO: Функция reset():
  // - setPath(['root'])
  // - setAnswers({})
  const reset = () => {
    // TODO: реализовать
  }

  // TODO: isResult = Boolean(currentNode.result)

  return (
    <div className="exercise-container">
      <h2>{t('task.11.3')}</h2>

      {/* TODO: Breadcrumbs — история пути.
          path.map(nodeId, i):
          - Стрелка → между шагами (кроме первого)
          - Текст узла: node.result или "Вопрос N"
          - Для пройденных: показать ответ (Да/Нет) зелёным/красным
          - Текущий шаг: белым
      */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem', marginBottom: '1rem', fontSize: '0.8rem', color: '#888' }}>
        {/* TODO: breadcrumbs */}
      </div>

      {/* TODO: Текущий узел.
          Рамка: цветная если isResult, серая (#555) если вопрос.

          Если isResult:
            - "Рекомендация" (серый заголовок)
            - currentNode.result (крупно, цветом currentNode.color)
            - currentNode.explanation
            - "Use cases:" + currentNode.useCases.map(...)

          Если вопрос:
            - "Шаг N из ~5" (серый)
            - currentNode.question (крупно, полужирно)
            - Кнопки: "Да" (зелёная: background #1a4a1a, border #4caf50, color #4caf50)
                     "Нет" (красная: background #4a1a1a, border #f44336, color #f44336)
      */}
      <div style={{ border: '2px solid #555', borderRadius: 10, padding: '1.25rem', marginBottom: '1rem', minHeight: 140 }}>
        {/* TODO: содержимое узла */}
      </div>

      {/* TODO: Кнопки навигации — показывать только если path.length > 1:
          "Назад" (вызывает back) и "Начать заново" (вызывает reset)
      */}
      <div style={{ display: 'flex', gap: '0.5rem' }}>
        {/* TODO: кнопки навигации */}
      </div>

      {/* TODO: Сетка брокеров внизу — всегда видима.
          Object.entries(BROKER_COLORS).map([key, color]):
          - рамка с цветом
          - название брокера (цветом)
          - краткое описание (kafka → 'High-throughput log', rabbitmq → 'Smart routing',
            nats → 'Low-latency', redis → 'Redis-native', pulsar → 'Geo-distributed')
      */}
      <div style={{ marginTop: '1.5rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '0.5rem' }}>
        {/* TODO: карточки брокеров */}
      </div>
    </div>
  )
}
