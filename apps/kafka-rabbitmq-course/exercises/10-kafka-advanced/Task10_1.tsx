import { useState } from 'react'
import { useLanguage } from 'src/hooks'

// ============================================
// Задание 10.1: Kafka Streams — топология
// ============================================
//
// Цель: реализовать интерактивный визуализатор топологии Kafka Streams.
// Пайплайн: Source → Filter → Map → GroupBy → Aggregate → Sink.
// Каждый оператор кликабелен — показывает конфигурацию и описание.
// Кнопка "Следующий шаг" активирует узлы по одному.

// TODO: Определи тип NodeType — union type из шести значений:
// 'source' | 'filter' | 'map' | 'groupby' | 'aggregate' | 'sink'
// type NodeType = ...

// TODO: Определи интерфейс TopologyNode:
//   id: string
//   type: NodeType
//   label: string
//   config: Record<string, string>
//   description: string
// interface TopologyNode { ... }

// TODO: Определи интерфейс Message:
//   key: string
//   value: string
//   passed: boolean    — проходит ли фильтр (amount > 100)
// interface Message { ... }

// TODO: Создай словарь NODE_COLORS: Record<NodeType, string>
// Каждому типу узла — уникальный цвет (hex или css-строка).
// const NODE_COLORS: Record<NodeType, string> = { ... }

// TODO: Создай массив TOPOLOGY_NODES из 6 узлов:
// 1. Source    — topic: 'orders', bootstrap: 'localhost:9092', auto.offset.reset: 'earliest'
//               description: 'Читает сырые события из входного топика Kafka'
// 2. Filter    — predicate: 'amount > 100', null.handling: 'skip'
//               description: 'Пропускает только заказы с суммой > 100 рублей'
// 3. Map       — key.selector: 'order.userId', value.mapper: 'enrichWithUserData()',
//               schema.registry: 'http://registry:8081'
//               description: 'Переключает ключ на userId и обогащает данными пользователя'
// 4. GroupBy   — key.fn: 'userId', repartition.topic: 'orders-repartitioned-0', partitions: '12'
//               description: 'Перераспределяет поток по userId — создаёт внутренний repartition-топик'
// 5. Aggregate — window.type: 'Tumbling', window.size: '1 hour',
//               state.store: 'RocksDB', changelog.topic: 'orders-agg-changelog'
//               description: 'Суммирует объём заказов по пользователю за час, хранит состояние в RocksDB'
// 6. Sink      — topic: 'user-order-stats', acks: 'all', replication.factor: '3'
//               description: 'Записывает агрегированные результаты в выходной топик'
// const TOPOLOGY_NODES: TopologyNode[] = [...]

// TODO: Создай массив SAMPLE_MESSAGES из 5 сообщений.
// Формат каждого: { key: string, value: string, passed: boolean }
// 3 сообщения должны иметь passed: true (amount > 100),
// 2 сообщения — passed: false (amount <= 100).
// Пример value: '{"userId":"u1","amount":250}'
// const SAMPLE_MESSAGES: Message[] = [...]

export function Task10_1() {
  const { t } = useLanguage()

  // TODO: Состояние selectedNode — выбранный узел или null
  const [selectedNode, setSelectedNode] = useState<unknown>(null)

  // TODO: Состояние step — текущий шаг симуляции, начально 0
  const [step, setStep] = useState(0)

  // TODO: Состояние processedMessages — массив Message, начально пустой
  const [processedMessages, setProcessedMessages] = useState<unknown[]>([])

  // TODO: Реализуй функцию simulateStep:
  // Если step < TOPOLOGY_NODES.length:
  //   Получи текущий узел: TOPOLOGY_NODES[step]
  //   Если тип узла === 'filter' → отфильтруй SAMPLE_MESSAGES по passed: true,
  //     сохрани результат в processedMessages
  //   Если step === 0 (Source) → сохрани все SAMPLE_MESSAGES в processedMessages
  //   Увеличь step на 1
  const simulateStep = () => {
    // TODO: реализовать
  }

  // TODO: Реализуй функцию reset:
  // Устанавливает step = 0, processedMessages = [], selectedNode = null
  const reset = () => {
    // TODO: реализовать
  }

  return (
    <div className="exercise-container">
      <h2>{t('task.10.1')}</h2>

      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
        {/* Левая колонка — список узлов топологии */}
        <div style={{ flex: '1 1 400px' }}>
          <h3 style={{ marginBottom: '0.75rem', fontSize: '0.95rem', color: '#aaa' }}>
            Stream Processing Topology
          </h3>

          {/* TODO: Отрисуй список TOPOLOGY_NODES вертикально.
              Для каждого узла с индексом i:
              - isActive = step > i (узел уже пройден)
              - isCurrent = step === i (следующий на очереди)
              - isSelected = selectedNode?.id === node.id
              Кнопка узла:
              - background: isActive → NODE_COLORS[node.type], isCurrent → '#444', иначе '#2a2a2a'
              - color: isActive → '#fff', иначе '#888'
              - border: isSelected → '2px solid #fff', иначе '1px solid #444'
              - onClick: setSelectedNode(isSelected ? null : node)
              - Внутри кнопки: label слева, 'ACTIVE'/'IDLE' справа
              Между узлами (кроме последнего):
              - Вертикальная линия 2px, высота 16px
              - background: isActive → '#4ec9b0', иначе '#333' */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            {/* TODO: отрисовать узлы */}
          </div>

          {/* TODO: Кнопки управления симуляцией:
              1. "Следующий шаг ({step}/{TOPOLOGY_NODES.length})"
                 disabled когда step >= TOPOLOGY_NODES.length
                 onClick → simulateStep
              2. "Сброс"
                 onClick → reset */}
          <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
            {/* TODO: кнопки */}
          </div>
        </div>

        {/* Правая колонка — детали выбранного узла + сообщения */}
        <div style={{ flex: '1 1 300px' }}>
          {/* TODO: Если selectedNode выбран — показать панель деталей:
              - Заголовок: selectedNode.label (цвет #4ec9b0)
              - Описание: selectedNode.description (цвет #ccc, размер 0.875rem)
              - Конфигурация: для каждой пары [k, v] из selectedNode.config:
                ключ — цвет #9cdcfe, monospace
                значение — цвет #ce9178, monospace
              Если selectedNode не выбран — показать плейсхолдер:
              "Нажмите на оператор для просмотра конфигурации" */}
          {null /* TODO: панель деталей */}

          {/* TODO: Если processedMessages.length > 0 — показать список сообщений:
              Заголовок: "Сообщения после Filter ({processedMessages.length} из {SAMPLE_MESSAGES.length}):"
              Для каждого сообщения:
              - key — цвет #9cdcfe
              - ' => ' — цвет #666
              - value — цвет #ce9178
              Стиль блока: background #0d1117, border #2d6a4f, monospace */}
          {null /* TODO: список сообщений */}
        </div>
      </div>

      {/* TODO: Информационный блок внизу (background #0d1117, border #333):
          Текст: "Как читать топологию: данные текут сверху вниз.
          Каждый оператор получает KStream и возвращает преобразованный KStream.
          GroupBy создаёт repartition-топик для гарантии того, что все записи с одним ключом
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
        {/* TODO: текст */}
      </div>
    </div>
  )
}
