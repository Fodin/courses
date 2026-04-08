import { useState } from 'react'
import { useLanguage } from 'src/hooks'

// Описание задания: task-3.1.md
// Task description: task-3.1.md
//
// Создай интерактивный компонент визуализации внутренней архитектуры AMQP-брокера.
// Create an interactive component visualizing the internal architecture of an AMQP broker.
//
// Требования:
// Requirements:
// 1. Отобразить 5 компонентов брокера в 3 слоях: Connection Layer (Connection, Channel),
//    Routing Layer (Exchange, Binding), Storage Layer (Queue)
// 1. Display 5 broker components in 3 layers: Connection Layer (Connection, Channel),
//    Routing Layer (Exchange, Binding), Storage Layer (Queue)
// 2. Клик на компонент — показывать панель с деталями (иконка, название, описание, список из 4 пунктов)
// 2. Click on a component — show a details panel (icon, name, description, list of 4 items)
// 3. Повторный клик — скрывать панель
// 3. Click again — hide the panel
// 4. Кнопка "Запустить симуляцию" — пошагово показывает путь сообщения через 5 шагов
// 4. "Run Simulation" button — step-by-step shows the message path through 5 steps
// 5. Прогресс-бар из 5 шагов обновляется в реальном времени (~700 мс на шаг)
// 5. Progress bar of 5 steps updates in real time (~700 ms per step)
// 6. Кнопка заблокирована во время симуляции
// 6. Button is disabled during simulation
// 7. Лог в терминальном стиле (тёмный фон) отображает завершённые шаги
// 7. Terminal-style log (dark background) displays completed steps

// TODO: определи интерфейс BrokerComponent
// TODO: define the BrokerComponent interface
// interface BrokerComponent {
//   id: string
//   label: string
//   icon: string
//   color: string
//   bgColor: string
//   borderColor: string
//   description: string
//   details: string[]
//   layer: 'connection' | 'routing' | 'storage'
// }

// TODO: определи интерфейс MessageFlow
// TODO: define the MessageFlow interface
// interface MessageFlow {
//   id: number
//   step: string
//   from: string
//   to: string
//   detail: string
//   color: string
// }

// TODO: создай массив brokerComponents — 5 компонентов:
// connection, channel (layer: 'connection')
// exchange, binding (layer: 'routing')
// queue (layer: 'storage')
// TODO: create the brokerComponents array — 5 components:
// connection, channel (layer: 'connection')
// exchange, binding (layer: 'routing')
// queue (layer: 'storage')
// const brokerComponents: BrokerComponent[] = [...]

// TODO: создай массив messageFlowSteps — 5 шагов:
// 1. Producer → Exchange (basic.publish с routing_key)
// 2. Exchange → Binding (сопоставление routing_key с binding_key)
// 3. Binding → Queue (сообщение помещается в очередь)
// 4. Queue → Consumer (basic.deliver)
// 5. Consumer → ACK (basic.ack — сообщение удалено)
// TODO: create the messageFlowSteps array — 5 steps:
// 1. Producer → Exchange (basic.publish with routing_key)
// 2. Exchange → Binding (matching routing_key with binding_key)
// 3. Binding → Queue (message is placed in the queue)
// 4. Queue → Consumer (basic.deliver)
// 5. Consumer → ACK (basic.ack — message removed)
// const messageFlowSteps: MessageFlow[] = [...]

export function Task3_1() {
  const { t } = useLanguage()

  // TODO: добавь состояние для выбранного компонента
  // TODO: add state for the selected component
  // const [selectedComponent, setSelectedComponent] = useState<BrokerComponent | null>(null)

  // TODO: добавь состояние для прогресса симуляции
  // TODO: add state for simulation progress
  // const [flowStep, setFlowStep] = useState<number>(0)

  // TODO: добавь состояние для лога симуляции
  // TODO: add state for simulation log
  // const [flowLog, setFlowLog] = useState<MessageFlow[]>([])

  // TODO: добавь флаг анимации
  // TODO: add animation flag
  // const [animating, setAnimating] = useState(false)

  // TODO: реализуй функцию runFlow
  // - Если уже анимируется — выходить
  // - Обнулить flowLog и flowStep
  // - В цикле для каждого шага: ждать 700 мс, обновить flowStep и flowLog
  // - После завершения снять флаг animating
  // TODO: implement the runFlow function
  // - If already animating — exit early
  // - Reset flowLog and flowStep
  // - In a loop for each step: wait 700 ms, update flowStep and flowLog
  // - After completion, clear the animating flag
  // const runFlow = async () => { ... }

  // TODO: определи конфигурацию слоёв для рендера
  // TODO: define layer configuration for rendering
  // const layers = [
  //   { label: 'Уровень соединения / Connection Layer', ids: ['connection', 'channel'], color: '#1565C0' },
  //   { label: 'Уровень маршрутизации / Routing Layer', ids: ['exchange', 'binding'], color: '#E65100' },
  //   { label: 'Уровень хранения / Storage Layer', ids: ['queue'], color: '#00695C' },
  // ]

  return (
    <div className="exercise-container" style={{ padding: '1.25rem', fontFamily: 'sans-serif', maxWidth: '960px' }}>
      <h2 style={{ marginBottom: '0.25rem' }}>{t('task.3.1')}</h2>
      <p style={{ color: '#666', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
        {/* TODO: добавь подсказку для пользователя */}
        {/* TODO: add a hint for the user */}
      </p>

      {/* TODO: секция архитектуры брокера */}
      {/* TODO: broker architecture section */}
      {/* Для каждого слоя: заголовок слоя + компоненты в виде карточек */}
      {/* For each layer: layer header + components as cards */}
      {/* Карточка: иконка, label, краткое описание */}
      {/* Card: icon, label, short description */}
      {/* Активная карточка: border + boxShadow цвета компонента */}
      {/* Active card: border + boxShadow in component color */}

      {/* TODO: панель деталей выбранного компонента */}
      {/* TODO: details panel for the selected component */}
      {/* Показывать только если selectedComponent !== null */}
      {/* Show only if selectedComponent !== null */}
      {/* Содержит: иконку, название, описание, список details */}
      {/* Contains: icon, name, description, details list */}

      {/* TODO: секция симуляции */}
      {/* TODO: simulation section */}
      {/* Кнопка "Запустить симуляцию" / "Симуляция..." */}
      {/* "Run Simulation" / "Simulating..." button */}
      {/* Прогресс-бар: 5 кружков, соединённых линиями */}
      {/* Progress bar: 5 circles connected by lines */}
      {/* Кружок: серый если не пройден, цветной с галочкой если пройден */}
      {/* Circle: gray if not completed, colored with checkmark if completed */}

      {/* TODO: терминальный лог */}
      {/* TODO: terminal log */}
      {/* Показывать только если flowLog.length > 0 */}
      {/* Show only if flowLog.length > 0 */}
      {/* Тёмный фон (#0d1117), моноширинный шрифт */}
      {/* Dark background (#0d1117), monospace font */}
      {/* Каждая запись: [номер] | название шага | детали */}
      {/* Each entry: [number] | step name | details */}
    </div>
  )
}
