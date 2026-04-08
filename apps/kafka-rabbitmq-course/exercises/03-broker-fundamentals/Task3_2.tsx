import { useState } from 'react'
import { useLanguage } from 'src/hooks'

// Описание задания: task-3.2.md
//
// Создай интерактивный инспектор AMQP-фреймов.
//
// Требования:
// 1. Навигация по 4 командам: basic.publish, basic.consume, basic.ack, connection.start
// 2. При выборе команды — показывать её описание и список фреймов
// 3. Карточки фреймов с бейджами типа (METHOD/HEADER/BODY) и channel-id
// 4. Клик на фрейм — раскрывает таблицу полей (название, размер, значение, описание)
// 5. Байтовая схема AMQP фрейма всегда видна: type|channel|size|payload|frame-end
// 6. Блок заметок для каждой команды
// 7. Переключение команды — сбрасывает выбранный фрейм

// TODO: определи тип FrameType
// type FrameType = 'method' | 'header' | 'body' | 'heartbeat'

// TODO: определи интерфейс AmqpFrame
// interface AmqpFrame {
//   type: FrameType
//   typeCode: number
//   channelId: number
//   label: string
//   color: string
//   bgColor: string
//   fields: { name: string; size: string; value: string; description: string }[]
// }

// TODO: определи интерфейс AmqpCommand
// interface AmqpCommand {
//   id: string
//   label: string
//   description: string
//   icon: string
//   frames: AmqpFrame[]
//   notes: string[]
// }

// TODO: создай массив amqpCommands с 4 командами:
//
// 1. basic.publish (icon: '📤') — 3 фрейма: Method, Header, Body
//    Method Frame (type=1, ch=1): frame-type, channel-id, payload-size, class-id(60/basic),
//      method-id(40/publish), exchange, routing-key, mandatory, frame-end(0xCE)
//    Header Frame (type=2, ch=1): frame-type, channel-id, class-id, body-size,
//      content-type, delivery-mode, priority, message-id, timestamp
//    Body Frame (type=3, ch=1): frame-type, channel-id, payload-size, payload, frame-end
//
// 2. basic.consume (icon: '📥') — 2 фрейма: Method (consume) + Method (consume-ok ← ответ)
//    consume: frame-type, channel-id(2), class-id, method-id(20), queue, consumer-tag,
//      no-local, no-ack, exclusive
//    consume-ok: frame-type, channel-id(2), class-id, method-id(21), consumer-tag
//
// 3. basic.ack (icon: '✅') — 1 фрейм: Method
//    frame-type, channel-id(2), class-id, method-id(80/ack), delivery-tag(8 байт), multiple(1 бит)
//
// 4. connection.start (icon: '🤝') — 1 фрейм: Method (от брокера, channel=0)
//    frame-type, channel-id(0!), version-major(0), version-minor(9), server-properties,
//    mechanisms, locales
//
// const amqpCommands: AmqpCommand[] = [...]

export function Task3_2() {
  const { t } = useLanguage()

  // TODO: состояние для выбранной команды (по умолчанию — первая)
  // const [selectedCommand, setSelectedCommand] = useState<AmqpCommand>(amqpCommands[0])

  // TODO: состояние для выбранного фрейма
  // const [selectedFrame, setSelectedFrame] = useState<AmqpFrame | null>(null)

  // TODO: словарь меток типов фреймов
  // const frameTypeLabels: Record<FrameType, string> = {
  //   method: 'METHOD',
  //   header: 'HEADER',
  //   body: 'BODY',
  //   heartbeat: 'HEARTBEAT',
  // }

  return (
    <div className="exercise-container" style={{ padding: '1.25rem', fontFamily: 'sans-serif', maxWidth: '960px' }}>
      <h2 style={{ marginBottom: '0.25rem' }}>{t('task.3.2')}</h2>
      <p style={{ color: '#666', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
        {/* TODO: добавь подсказку */}
      </p>

      {/* TODO: кнопки переключения команд */}
      {/* amqpCommands.map(...) — для каждой команды кнопка с иконкой и label */}
      {/* Активная кнопка: border и background цвета #1565C0 */}
      {/* При клике: setSelectedCommand(cmd), setSelectedFrame(null) */}

      {/* TODO: описание выбранной команды */}
      {/* Строка: иконка + label + ' — ' + description */}

      {/* TODO: карточки фреймов */}
      {/* Заголовок: "Структура фреймов (N фрейм/а)" */}
      {/* Для каждого фрейма: бейдж типа, channel-id, label, количество полей */}
      {/* Активный фрейм: border и background цвета фрейма */}

      {/* TODO: байтовая схема фрейма */}
      {/* Тёмный фон (#0d1117), 5 блоков: type|channel|size|payload|frame-end */}
      {/* Каждый блок: подпись поля + размер */}

      {/* TODO: таблица полей выбранного фрейма */}
      {/* Показывать только если selectedFrame !== null */}
      {/* 4 столбца: Поле | Размер | Значение | Описание */}
      {/* Поле — моноширинным шрифтом цвета фрейма */}
      {/* Значение — моноширинным шрифтом зелёным цветом */}

      {/* TODO: блок заметок */}
      {/* Жёлтый фон (#FFF9C4), список пунктов selectedCommand.notes */}
    </div>
  )
}
