import { useState } from 'react'
import { useLanguage } from 'src/hooks'

// Описание задания: task-3.2.md
// Task description: task-3.2.md
//
// Создай интерактивный инспектор AMQP-фреймов.
// Create an interactive AMQP frame inspector.
//
// Требования:
// Requirements:
// 1. Навигация по 4 командам: basic.publish, basic.consume, basic.ack, connection.start
// 1. Navigation across 4 commands: basic.publish, basic.consume, basic.ack, connection.start
// 2. При выборе команды — показывать её описание и список фреймов
// 2. When a command is selected — show its description and list of frames
// 3. Карточки фреймов с бейджами типа (METHOD/HEADER/BODY) и channel-id
// 3. Frame cards with type badges (METHOD/HEADER/BODY) and channel-id
// 4. Клик на фрейм — раскрывает таблицу полей (название, размер, значение, описание)
// 4. Click on a frame — expands a field table (name, size, value, description)
// 5. Байтовая схема AMQP фрейма всегда видна: type|channel|size|payload|frame-end
// 5. AMQP frame byte diagram always visible: type|channel|size|payload|frame-end
// 6. Блок заметок для каждой команды
// 6. Notes block for each command
// 7. Переключение команды — сбрасывает выбранный фрейм
// 7. Switching command resets the selected frame

// TODO: определи тип FrameType
// TODO: define the FrameType type
// type FrameType = 'method' | 'header' | 'body' | 'heartbeat'

// TODO: определи интерфейс AmqpFrame
// TODO: define the AmqpFrame interface
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
// TODO: define the AmqpCommand interface
// interface AmqpCommand {
//   id: string
//   label: string
//   description: string
//   icon: string
//   frames: AmqpFrame[]
//   notes: string[]
// }

// TODO: создай массив amqpCommands с 4 командами:
// TODO: create the amqpCommands array with 4 commands:
//
// 1. basic.publish (icon: '📤') — 3 фрейма: Method, Header, Body
// 1. basic.publish (icon: '📤') — 3 frames: Method, Header, Body
//    Method Frame (type=1, ch=1): frame-type, channel-id, payload-size, class-id(60/basic),
//      method-id(40/publish), exchange, routing-key, mandatory, frame-end(0xCE)
//    Header Frame (type=2, ch=1): frame-type, channel-id, class-id, body-size,
//      content-type, delivery-mode, priority, message-id, timestamp
//    Body Frame (type=3, ch=1): frame-type, channel-id, payload-size, payload, frame-end
//
// 2. basic.consume (icon: '📥') — 2 фрейма: Method (consume) + Method (consume-ok ← ответ)
// 2. basic.consume (icon: '📥') — 2 frames: Method (consume) + Method (consume-ok ← response)
//    consume: frame-type, channel-id(2), class-id, method-id(20), queue, consumer-tag,
//      no-local, no-ack, exclusive
//    consume-ok: frame-type, channel-id(2), class-id, method-id(21), consumer-tag
//
// 3. basic.ack (icon: '✅') — 1 фрейм: Method
// 3. basic.ack (icon: '✅') — 1 frame: Method
//    frame-type, channel-id(2), class-id, method-id(80/ack), delivery-tag(8 байт), multiple(1 бит)
//    frame-type, channel-id(2), class-id, method-id(80/ack), delivery-tag(8 bytes), multiple(1 bit)
//
// 4. connection.start (icon: '🤝') — 1 фрейм: Method (от брокера, channel=0)
// 4. connection.start (icon: '🤝') — 1 frame: Method (from broker, channel=0)
//    frame-type, channel-id(0!), version-major(0), version-minor(9), server-properties,
//    mechanisms, locales
//
// const amqpCommands: AmqpCommand[] = [...]

export function Task3_2() {
  const { t } = useLanguage()

  // TODO: состояние для выбранной команды (по умолчанию — первая)
  // TODO: state for selected command (default — first one)
  // const [selectedCommand, setSelectedCommand] = useState<AmqpCommand>(amqpCommands[0])

  // TODO: состояние для выбранного фрейма
  // TODO: state for selected frame
  // const [selectedFrame, setSelectedFrame] = useState<AmqpFrame | null>(null)

  // TODO: словарь меток типов фреймов
  // TODO: dictionary of frame type labels
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
        {/* TODO: add a hint */}
      </p>

      {/* TODO: кнопки переключения команд */}
      {/* TODO: command switch buttons */}
      {/* amqpCommands.map(...) — для каждой команды кнопка с иконкой и label */}
      {/* amqpCommands.map(...) — for each command a button with icon and label */}
      {/* Активная кнопка: border и background цвета #1565C0 */}
      {/* Active button: border and background color #1565C0 */}
      {/* При клике: setSelectedCommand(cmd), setSelectedFrame(null) */}
      {/* On click: setSelectedCommand(cmd), setSelectedFrame(null) */}

      {/* TODO: описание выбранной команды */}
      {/* TODO: description of the selected command */}
      {/* Строка: иконка + label + ' — ' + description */}
      {/* Line: icon + label + ' — ' + description */}

      {/* TODO: карточки фреймов */}
      {/* TODO: frame cards */}
      {/* Заголовок: "Структура фреймов (N фрейм/а)" */}
      {/* Header: "Frame Structure (N frame(s))" */}
      {/* Для каждого фрейма: бейдж типа, channel-id, label, количество полей */}
      {/* For each frame: type badge, channel-id, label, field count */}
      {/* Активный фрейм: border и background цвета фрейма */}
      {/* Active frame: border and background in frame color */}

      {/* TODO: байтовая схема фрейма */}
      {/* TODO: frame byte diagram */}
      {/* Тёмный фон (#0d1117), 5 блоков: type|channel|size|payload|frame-end */}
      {/* Dark background (#0d1117), 5 blocks: type|channel|size|payload|frame-end */}
      {/* Каждый блок: подпись поля + размер */}
      {/* Each block: field label + size */}

      {/* TODO: таблица полей выбранного фрейма */}
      {/* TODO: field table for the selected frame */}
      {/* Показывать только если selectedFrame !== null */}
      {/* Show only if selectedFrame !== null */}
      {/* 4 столбца: Поле | Размер | Значение | Описание */}
      {/* 4 columns: Field | Size | Value | Description */}
      {/* Поле — моноширинным шрифтом цвета фрейма */}
      {/* Field — monospace font in frame color */}
      {/* Значение — моноширинным шрифтом зелёным цветом */}
      {/* Value — monospace font in green color */}

      {/* TODO: блок заметок */}
      {/* TODO: notes block */}
      {/* Жёлтый фон (#FFF9C4), список пунктов selectedCommand.notes */}
      {/* Yellow background (#FFF9C4), list of selectedCommand.notes items */}
    </div>
  )
}
