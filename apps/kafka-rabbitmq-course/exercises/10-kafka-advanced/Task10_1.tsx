import { useState } from 'react'
import { useLanguage } from 'src/hooks'

// ============================================
// Task 10.1: Kafka Streams — Topology
// Задание 10.1: Kafka Streams — топология
// ============================================
//
// Goal: implement an interactive Kafka Streams topology visualizer.
// Цель: реализовать интерактивный визуализатор топологии Kafka Streams.
// Pipeline: Source → Filter → Map → GroupBy → Aggregate → Sink.
// Пайплайн: Source → Filter → Map → GroupBy → Aggregate → Sink.
// Each operator is clickable — shows config and description.
// Каждый оператор кликабелен — показывает конфигурацию и описание.
// "Next Step" button activates nodes one by one.
// Кнопка "Следующий шаг" активирует узлы по одному.

// TODO: Define type NodeType — union type of six values:
// TODO: Определи тип NodeType — union type из шести значений:
// 'source' | 'filter' | 'map' | 'groupby' | 'aggregate' | 'sink'
// type NodeType = ...

// TODO: Define interface TopologyNode:
// TODO: Определи интерфейс TopologyNode:
//   id: string
//   type: NodeType
//   label: string
//   config: Record<string, string>
//   description: string
// interface TopologyNode { ... }

// TODO: Define interface Message:
// TODO: Определи интерфейс Message:
//   key: string
//   value: string
//   passed: boolean    — whether the message passes the filter (amount > 100)
//   passed: boolean    — проходит ли фильтр (amount > 100)
// interface Message { ... }

// TODO: Create dictionary NODE_COLORS: Record<NodeType, string>
// TODO: Создай словарь NODE_COLORS: Record<NodeType, string>
// Each node type gets a unique color (hex or css string).
// Каждому типу узла — уникальный цвет (hex или css-строка).
// const NODE_COLORS: Record<NodeType, string> = { ... }

// TODO: Create array TOPOLOGY_NODES of 6 nodes:
// TODO: Создай массив TOPOLOGY_NODES из 6 узлов:
// 1. Source    — topic: 'orders', bootstrap: 'localhost:9092', auto.offset.reset: 'earliest'
//               description: 'Reads raw events from the input Kafka topic'
//               description: 'Читает сырые события из входного топика Kafka'
// 2. Filter    — predicate: 'amount > 100', null.handling: 'skip'
//               description: 'Passes only orders with amount > 100 rubles'
//               description: 'Пропускает только заказы с суммой > 100 рублей'
// 3. Map       — key.selector: 'order.userId', value.mapper: 'enrichWithUserData()',
//               schema.registry: 'http://registry:8081'
//               description: 'Switches key to userId and enriches with user data'
//               description: 'Переключает ключ на userId и обогащает данными пользователя'
// 4. GroupBy   — key.fn: 'userId', repartition.topic: 'orders-repartitioned-0', partitions: '12'
//               description: 'Redistributes the stream by userId — creates an internal repartition topic'
//               description: 'Перераспределяет поток по userId — создаёт внутренний repartition-топик'
// 5. Aggregate — window.type: 'Tumbling', window.size: '1 hour',
//               state.store: 'RocksDB', changelog.topic: 'orders-agg-changelog'
//               description: 'Sums order volume per user per hour, stores state in RocksDB'
//               description: 'Суммирует объём заказов по пользователю за час, хранит состояние в RocksDB'
// 6. Sink      — topic: 'user-order-stats', acks: 'all', replication.factor: '3'
//               description: 'Writes aggregated results to the output topic'
//               description: 'Записывает агрегированные результаты в выходной топик'
// const TOPOLOGY_NODES: TopologyNode[] = [...]

// TODO: Create array SAMPLE_MESSAGES of 5 messages.
// TODO: Создай массив SAMPLE_MESSAGES из 5 сообщений.
// Format each: { key: string, value: string, passed: boolean }
// Формат каждого: { key: string, value: string, passed: boolean }
// 3 messages should have passed: true (amount > 100),
// 3 сообщения должны иметь passed: true (amount > 100),
// 2 messages — passed: false (amount <= 100).
// 2 сообщения — passed: false (amount <= 100).
// Example value: '{"userId":"u1","amount":250}'
// Пример value: '{"userId":"u1","amount":250}'
// const SAMPLE_MESSAGES: Message[] = [...]

export function Task10_1() {
  const { t } = useLanguage()

  // TODO: State selectedNode — selected node or null
  // TODO: Состояние selectedNode — выбранный узел или null
  const [selectedNode, setSelectedNode] = useState<unknown>(null)

  // TODO: State step — current simulation step, initially 0
  // TODO: Состояние step — текущий шаг симуляции, начально 0
  const [step, setStep] = useState(0)

  // TODO: State processedMessages — Message array, initially empty
  // TODO: Состояние processedMessages — массив Message, начально пустой
  const [processedMessages, setProcessedMessages] = useState<unknown[]>([])

  // TODO: Implement function simulateStep:
  // TODO: Реализуй функцию simulateStep:
  // If step < TOPOLOGY_NODES.length:
  // Если step < TOPOLOGY_NODES.length:
  //   Get current node: TOPOLOGY_NODES[step]
  //   Получи текущий узел: TOPOLOGY_NODES[step]
  //   If node type === 'filter' → filter SAMPLE_MESSAGES by passed: true,
  //   Если тип узла === 'filter' → отфильтруй SAMPLE_MESSAGES по passed: true,
  //     save result to processedMessages
  //     сохрани результат в processedMessages
  //   If step === 0 (Source) → save all SAMPLE_MESSAGES to processedMessages
  //   Если step === 0 (Source) → сохрани все SAMPLE_MESSAGES в processedMessages
  //   Increment step by 1
  //   Увеличь step на 1
  const simulateStep = () => {
    // TODO: implement
    // TODO: реализовать
  }

  // TODO: Implement function reset:
  // TODO: Реализуй функцию reset:
  // Sets step = 0, processedMessages = [], selectedNode = null
  // Устанавливает step = 0, processedMessages = [], selectedNode = null
  const reset = () => {
    // TODO: implement
    // TODO: реализовать
  }

  return (
    <div className="exercise-container">
      <h2>{t('task.10.1')}</h2>

      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
        {/* Left column — topology node list */}
        {/* Левая колонка — список узлов топологии */}
        <div style={{ flex: '1 1 400px' }}>
          <h3 style={{ marginBottom: '0.75rem', fontSize: '0.95rem', color: '#aaa' }}>
            Stream Processing Topology
          </h3>

          {/* TODO: Render TOPOLOGY_NODES list vertically.
              TODO: Отрисуй список TOPOLOGY_NODES вертикально.
              For each node with index i:
              Для каждого узла с индексом i:
              - isActive = step > i (node already passed)
              - isActive = step > i (узел уже пройден)
              - isCurrent = step === i (next in line)
              - isCurrent = step === i (следующий на очереди)
              - isSelected = selectedNode?.id === node.id
              Node button:
              Кнопка узла:
              - background: isActive → NODE_COLORS[node.type], isCurrent → '#444', otherwise '#2a2a2a'
              - background: isActive → NODE_COLORS[node.type], isCurrent → '#444', иначе '#2a2a2a'
              - color: isActive → '#fff', otherwise '#888'
              - color: isActive → '#fff', иначе '#888'
              - border: isSelected → '2px solid #fff', otherwise '1px solid #444'
              - border: isSelected → '2px solid #fff', иначе '1px solid #444'
              - onClick: setSelectedNode(isSelected ? null : node)
              - Inside button: label left, 'ACTIVE'/'IDLE' right
              - Внутри кнопки: label слева, 'ACTIVE'/'IDLE' справа
              Between nodes (except last):
              Между узлами (кроме последнего):
              - Vertical line 2px, height 16px
              - Вертикальная линия 2px, высота 16px
              - background: isActive → '#4ec9b0', otherwise '#333'
              - background: isActive → '#4ec9b0', иначе '#333' */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            {/* TODO: render nodes */}
            {/* TODO: отрисовать узлы */}
          </div>

          {/* TODO: Simulation control buttons:
              TODO: Кнопки управления симуляцией:
              1. "Next Step ({step}/{TOPOLOGY_NODES.length})"
                 1. "Следующий шаг ({step}/{TOPOLOGY_NODES.length})"
                 disabled when step >= TOPOLOGY_NODES.length
                 disabled когда step >= TOPOLOGY_NODES.length
                 onClick → simulateStep
              2. "Reset"
                 2. "Сброс"
                 onClick → reset */}
          <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
            {/* TODO: buttons */}
            {/* TODO: кнопки */}
          </div>
        </div>

        {/* Right column — selected node details + messages */}
        {/* Правая колонка — детали выбранного узла + сообщения */}
        <div style={{ flex: '1 1 300px' }}>
          {/* TODO: If selectedNode is selected — show details panel:
              TODO: Если selectedNode выбран — показать панель деталей:
              - Title: selectedNode.label (color #4ec9b0)
              - Заголовок: selectedNode.label (цвет #4ec9b0)
              - Description: selectedNode.description (color #ccc, size 0.875rem)
              - Описание: selectedNode.description (цвет #ccc, размер 0.875rem)
              - Configuration: for each pair [k, v] from selectedNode.config:
              - Конфигурация: для каждой пары [k, v] из selectedNode.config:
                key — color #9cdcfe, monospace
                ключ — цвет #9cdcfe, monospace
                value — color #ce9178, monospace
                значение — цвет #ce9178, monospace
              If selectedNode not selected — show placeholder:
              Если selectedNode не выбран — показать плейсхолдер:
              "Click an operator to view configuration"
              "Нажмите на оператор для просмотра конфигурации" */}
          {null /* TODO: details panel */}
          {null /* TODO: панель деталей */}

          {/* TODO: If processedMessages.length > 0 — show message list:
              TODO: Если processedMessages.length > 0 — показать список сообщений:
              Title: "Messages after Filter ({processedMessages.length} of {SAMPLE_MESSAGES.length}):"
              Заголовок: "Сообщения после Filter ({processedMessages.length} из {SAMPLE_MESSAGES.length}):"
              For each message:
              Для каждого сообщения:
              - key — color #9cdcfe
              - key — цвет #9cdcfe
              - ' => ' — color #666
              - ' => ' — цвет #666
              - value — color #ce9178
              - value — цвет #ce9178
              Block style: background #0d1117, border #2d6a4f, monospace
              Стиль блока: background #0d1117, border #2d6a4f, monospace */}
          {null /* TODO: message list */}
          {null /* TODO: список сообщений */}
        </div>
      </div>

      {/* TODO: Info block at the bottom (background #0d1117, border #333):
          TODO: Информационный блок внизу (background #0d1117, border #333):
          Text: "How to read the topology: data flows from top to bottom.
          Текст: "Как читать топологию: данные текут сверху вниз.
          Each operator receives a KStream and returns a transformed KStream.
          Каждый оператор получает KStream и возвращает преобразованный KStream.
          GroupBy creates a repartition topic to guarantee that all records with the same key
          GroupBy создаёт repartition-топик для гарантии того, что все записи с одним ключом
          end up in the same task. Aggregate requires a state store (RocksDB)."
          попадут в одну задачу (task). Aggregate требует state store (RocksDB)." */}
      <div
        style={{
          background: '#0d1117',
          border: '1px solid #333',
          borderRadius: '6px',
          padding: '0.75rem',
          fontSize: '0.8rem',
          color: '#888',
        }}
      >
        {/* TODO: text */}
        {/* TODO: текст */}
      </div>
    </div>
  )
}
