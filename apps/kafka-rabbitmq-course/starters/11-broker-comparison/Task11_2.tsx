import { useState } from 'react'
import { useLanguage } from 'src/hooks'

// ============================================================
// Task 11.2: Delivery Models
// Задание 11.2: Модели доставки
// ============================================================
//
// Goal: implement an interactive visualization of delivery models
// Цель: реализовать интерактивную визуализацию моделей доставки
// for 5 brokers with message particle animation.
// для 5 брокеров с анимацией движения сообщений (частиц).

// TODO: Define BrokerModel type — union of 5 values:
// TODO: Определи тип BrokerModel — union из 5 значений:
// 'rabbitmq' | 'kafka' | 'nats' | 'redis' | 'pulsar'
// type BrokerModel = ...

// TODO: Define MessageParticle interface:
// TODO: Определи интерфейс MessageParticle:
//   id: number
//   x: number
//   progress: number
//   active: boolean
// interface MessageParticle { ... }

// TODO: Define ModelConfig interface:
// TODO: Определи интерфейс ModelConfig:
//   name: string
//   color: string
//   delivery: string       — delivery model description (Push/Pull)
//   delivery: string       — описание модели доставки (Push/Pull)
//   guarantee: string      — delivery guarantee
//   guarantee: string      — гарантия доставки
//   brokerRole: string     — broker role (Smart/Dumb)
//   brokerRole: string     — роль брокера (Smart/Dumb)
//   consumerRole: string   — consumer role
//   consumerRole: string   — роль потребителя
//   description: string    — detailed model description
//   description: string    — подробное описание модели
//   flow: string[]         — array of 5 message path steps
//   flow: string[]         — массив из 5 шагов пути сообщения
// interface ModelConfig { ... }

// TODO: Fill MODEL_CONFIGS object: Record<BrokerModel, ModelConfig>
// TODO: Заполни объект MODEL_CONFIGS: Record<BrokerModel, ModelConfig>
// for all 5 brokers.
// для всех 5 брокеров.
// RabbitMQ: delivery 'Push (AMQP)', guarantee 'At-least-once',
//           brokerRole 'Smart broker', consumerRole 'Dumb consumer'
// Kafka: delivery 'Pull (Kafka protocol)', guarantee 'At-least-once / Exactly-once',
//        brokerRole 'Dumb broker', consumerRole 'Smart consumer'
// NATS: delivery 'Push (Core) / Pull (JetStream)',
//       guarantee 'At-most-once (Core) / At-least-once (JetStream)'
// Redis: delivery 'Pull (XREADGROUP)', guarantee 'At-least-once (с ACK)'
// Pulsar: delivery 'Push + Pull hybrid', brokerRole 'Stateless broker + BookKeeper'
// const MODEL_CONFIGS: Record<BrokerModel, ModelConfig> = { ... }

// TODO: Declare BROKER_MODELS array: BrokerModel[] = ['rabbitmq', 'kafka', 'nats', 'redis', 'pulsar']
// TODO: Объяви массив BROKER_MODELS: BrokerModel[] = ['rabbitmq', 'kafka', 'nats', 'redis', 'pulsar']

export function Task11_2() {
  const { t } = useLanguage()

  // TODO: State selected: BrokerModel, initial 'rabbitmq'
  // TODO: Состояние selected: BrokerModel, начально 'rabbitmq'
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [selected, setSelected] = useState<any>('rabbitmq')

  // TODO: State particles: MessageParticle[], initial []
  // TODO: Состояние particles: MessageParticle[], начально []
  const [particles, setParticles] = useState<unknown[]>([])

  // TODO: State running: boolean
  // TODO: Состояние running: boolean
  const [running, setRunning] = useState(false)

  // TODO: State msgCount: number, initial 0
  // TODO: Состояние msgCount: number, начально 0
  const [msgCount, setMsgCount] = useState(0)

  // TODO: config = MODEL_CONFIGS[selected]
  // TODO: config = MODEL_CONFIGS[selected]

  // TODO: Implement sendMessage():
  // TODO: Реализуй функцию sendMessage():
  // - create a particle with id = Date.now(), progress = 0, active = true
  // - создаёт частицу с id = Date.now(), progress = 0, active = true
  // - add to particles (slice of last 8)
  // - добавляет в particles (слайс последних 8)
  // - start setInterval with 40ms step:
  // - запускает setInterval с шагом 40ms:
  //   prog += 5, update particle progress via setParticles map
  //   prog += 5, обновляет progress частицы через setParticles map
  //   when prog >= 100 — clearInterval, setTimeout 600ms to remove particle
  //   при prog >= 100 — clearInterval, setTimeout 600ms удалить частицу
  // - increment msgCount
  // - инкрементирует msgCount
  const sendMessage = () => {
    // TODO: implement
    // TODO: реализовать
  }

  // TODO: Implement startAuto():
  // TODO: Реализуй функцию startAuto():
  // - if running === true → setRunning(false), return
  // - если running === true → setRunning(false), return
  // - else setRunning(true), setInterval 350ms:
  // - иначе setRunning(true), setInterval 350ms:
  //   call sendMessage(), count++
  //   вызвать sendMessage(), count++
  //   when count >= 12 → clearInterval, setRunning(false)
  //   при count >= 12 → clearInterval, setRunning(false)
  const startAuto = () => {
    // TODO: implement
    // TODO: реализовать
  }

  // Coordinates for broker and consumer on the diagram
  // Координаты брокера и consumer для схемы
  const brokerX = 42
  const consumerX = 78

  return (
    <div className="exercise-container">
      <h2>{t('task.11.2')}</h2>

      {/* TODO: Broker switch buttons (BROKER_MODELS.map).
          {/* TODO: Кнопки переключения брокеров (BROKER_MODELS.map).
          On click: setSelected, setParticles([]), setMsgCount(0), setRunning(false).
          При клике: setSelected, setParticles([]), setMsgCount(0), setRunning(false).
          Active button: borderBottom with MODEL_CONFIGS[m].color, fontWeight bold.
          Активная кнопка: borderBottom с цветом MODEL_CONFIGS[m].color, fontWeight bold.
      */}
      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
        {/* TODO: broker buttons */}
        {/* TODO: кнопки брокеров */}
      </div>

      {/* TODO: Info block with config.color border:
          {/* TODO: Информационный блок с рамкой config.color:
          - grid 2 columns: delivery, guarantee, brokerRole, consumerRole
          - grid 2 колонки: delivery, guarantee, brokerRole, consumerRole
          - description (fontSize 0.85rem)
          - description (fontSize 0.85rem)
          - Animated diagram (position: relative, height 90):
          - Анимированная схема (position: relative, height 90):
            * "Producer" block on the left (3%)
            * блок "Producer" слева (3%)
            * config.name block in the center (brokerX-5%) with colored border
            * блок config.name по центру (brokerX-5%) с цветной рамкой
            * "Consumer" block on the right (consumerX+8%)
            * блок "Consumer" справа (consumerX+8%)
            * SVG dashed lines between blocks
            * SVG пунктирные линии между блоками
            * particles.map → colored circles with boxShadow glow,
            * particles.map → цветные круги с boxShadow glow,
              left = progress%, opacity fades at progress > 90
              left = progress%, opacity угасает при progress > 90
          - Buttons: "Send message" (sendMessage), auto button (startAuto)
          - Кнопки: "Отправить сообщение" (sendMessage), авто-кнопка (startAuto)
          - Counter "Sent: {msgCount}"
          - Счётчик "Отправлено: {msgCount}"
          - Flow list: config.flow.map with numbering and config.color
          - Список flow: config.flow.map с нумерацией и цветом config.color
      */}
      <div style={{ border: '1px solid #555', borderRadius: 8, padding: '1rem', marginBottom: '1rem' }}>
        {/* TODO: info block */}
        {/* TODO: информационный блок */}

        {/* Animated diagram */}
        {/* Анимированная схема */}
        <div style={{ position: 'relative', height: 90, background: 'rgba(0,0,0,0.3)', borderRadius: 6, marginBottom: '0.75rem', overflow: 'hidden' }}>
          {/* TODO: Producer, Broker, Consumer blocks */}
          {/* TODO: Producer, Broker, Consumer блоки */}
          {/* TODO: SVG lines */}
          {/* TODO: SVG линии */}
          {/* TODO: particles */}
          {/* TODO: частицы */}
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '0.75rem' }}>
          <button onClick={sendMessage} style={{ fontSize: '0.8rem' }}>
            Отправить сообщение
          </button>
          <button onClick={startAuto} style={{ fontSize: '0.8rem' }}>
            {running ? 'Стоп' : 'Авто x12'}
          </button>
          <span style={{ fontSize: '0.8rem', color: '#888' }}>Отправлено: {msgCount}</span>
        </div>

        {/* TODO: Flow steps list */}
        {/* TODO: Список шагов flow */}
        <div style={{ fontSize: '0.8rem' }}>
          <div style={{ color: '#aaa', marginBottom: '0.3rem', fontWeight: 'bold' }}>Поток сообщений:</div>
          {/* TODO: config.flow.map */}
        </div>
      </div>
    </div>
  )
}
