import { useState } from 'react'
import { useLanguage } from 'src/hooks'

// Описание задания: task-3.1.md
//
// Создай интерактивный компонент визуализации внутренней архитектуры AMQP-брокера.
//
// Требования:
// 1. Отобразить 5 компонентов брокера в 3 слоях: Connection Layer (Connection, Channel),
//    Routing Layer (Exchange, Binding), Storage Layer (Queue)
// 2. Клик на компонент — показывать панель с деталями (иконка, название, описание, список из 4 пунктов)
// 3. Повторный клик — скрывать панель
// 4. Кнопка "Запустить симуляцию" — пошагово показывает путь сообщения через 5 шагов
// 5. Прогресс-бар из 5 шагов обновляется в реальном времени (~700 мс на шаг)
// 6. Кнопка заблокирована во время симуляции
// 7. Лог в терминальном стиле (тёмный фон) отображает завершённые шаги

// TODO: определи интерфейс BrokerComponent
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
// const brokerComponents: BrokerComponent[] = [...]

// TODO: создай массив messageFlowSteps — 5 шагов:
// 1. Producer → Exchange (basic.publish с routing_key)
// 2. Exchange → Binding (сопоставление routing_key с binding_key)
// 3. Binding → Queue (сообщение помещается в очередь)
// 4. Queue → Consumer (basic.deliver)
// 5. Consumer → ACK (basic.ack — сообщение удалено)
// const messageFlowSteps: MessageFlow[] = [...]

export function Task3_1() {
  const { t } = useLanguage()

  // TODO: добавь состояние для выбранного компонента
  // const [selectedComponent, setSelectedComponent] = useState<BrokerComponent | null>(null)

  // TODO: добавь состояние для прогресса симуляции
  // const [flowStep, setFlowStep] = useState<number>(0)

  // TODO: добавь состояние для лога симуляции
  // const [flowLog, setFlowLog] = useState<MessageFlow[]>([])

  // TODO: добавь флаг анимации
  // const [animating, setAnimating] = useState(false)

  // TODO: реализуй функцию runFlow
  // - Если уже анимируется — выходить
  // - Обнулить flowLog и flowStep
  // - В цикле для каждого шага: ждать 700 мс, обновить flowStep и flowLog
  // - После завершения снять флаг animating
  // const runFlow = async () => { ... }

  // TODO: определи конфигурацию слоёв для рендера
  // const layers = [
  //   { label: 'Уровень соединения', ids: ['connection', 'channel'], color: '#1565C0' },
  //   { label: 'Уровень маршрутизации', ids: ['exchange', 'binding'], color: '#E65100' },
  //   { label: 'Уровень хранения', ids: ['queue'], color: '#00695C' },
  // ]

  return (
    <div className="exercise-container" style={{ padding: '1.25rem', fontFamily: 'sans-serif', maxWidth: '960px' }}>
      <h2 style={{ marginBottom: '0.25rem' }}>{t('task.3.1')}</h2>
      <p style={{ color: '#666', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
        {/* TODO: добавь подсказку для пользователя */}
      </p>

      {/* TODO: секция архитектуры брокера */}
      {/* Для каждого слоя: заголовок слоя + компоненты в виде карточек */}
      {/* Карточка: иконка, label, краткое описание */}
      {/* Активная карточка: border + boxShadow цвета компонента */}

      {/* TODO: панель деталей выбранного компонента */}
      {/* Показывать только если selectedComponent !== null */}
      {/* Содержит: иконку, название, описание, список details */}

      {/* TODO: секция симуляции */}
      {/* Кнопка "Запустить симуляцию" / "Симуляция..." */}
      {/* Прогресс-бар: 5 кружков, соединённых линиями */}
      {/* Кружок: серый если не пройден, цветной с галочкой если пройден */}

      {/* TODO: терминальный лог */}
      {/* Показывать только если flowLog.length > 0 */}
      {/* Тёмный фон (#0d1117), моноширинный шрифт */}
      {/* Каждая запись: [номер] | название шага | детали */}
    </div>
  )
}
