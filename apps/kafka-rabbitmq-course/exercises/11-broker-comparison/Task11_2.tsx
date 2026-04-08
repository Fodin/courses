import { useState } from 'react'
import { useLanguage } from 'src/hooks'

// ============================================================
// Задание 11.2: Модели доставки
// ============================================================
//
// Цель: реализовать интерактивную визуализацию моделей доставки
// для 5 брокеров с анимацией движения сообщений (частиц).

// TODO: Определи тип BrokerModel — union из 5 значений:
// 'rabbitmq' | 'kafka' | 'nats' | 'redis' | 'pulsar'
// type BrokerModel = ...

// TODO: Определи интерфейс MessageParticle:
//   id: number
//   x: number
//   progress: number
//   active: boolean
// interface MessageParticle { ... }

// TODO: Определи интерфейс ModelConfig:
//   name: string
//   color: string
//   delivery: string       — описание модели доставки (Push/Pull)
//   guarantee: string      — гарантия доставки
//   brokerRole: string     — роль брокера (Smart/Dumb)
//   consumerRole: string   — роль потребителя
//   description: string    — подробное описание модели
//   flow: string[]         — массив из 5 шагов пути сообщения
// interface ModelConfig { ... }

// TODO: Заполни объект MODEL_CONFIGS: Record<BrokerModel, ModelConfig>
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

// TODO: Объяви массив BROKER_MODELS: BrokerModel[] = ['rabbitmq', 'kafka', 'nats', 'redis', 'pulsar']

export function Task11_2() {
  const { t } = useLanguage()

  // TODO: Состояние selected: BrokerModel, начально 'rabbitmq'
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [selected, setSelected] = useState<any>('rabbitmq')

  // TODO: Состояние particles: MessageParticle[], начально []
  const [particles, setParticles] = useState<unknown[]>([])

  // TODO: Состояние running: boolean
  const [running, setRunning] = useState(false)

  // TODO: Состояние msgCount: number, начально 0
  const [msgCount, setMsgCount] = useState(0)

  // TODO: config = MODEL_CONFIGS[selected]

  // TODO: Реализуй функцию sendMessage():
  // - создаёт частицу с id = Date.now(), progress = 0, active = true
  // - добавляет в particles (слайс последних 8)
  // - запускает setInterval с шагом 40ms:
  //   prog += 5, обновляет progress частицы через setParticles map
  //   при prog >= 100 — clearInterval, setTimeout 600ms удалить частицу
  // - инкрементирует msgCount
  const sendMessage = () => {
    // TODO: реализовать
  }

  // TODO: Реализуй функцию startAuto():
  // - если running === true → setRunning(false), return
  // - иначе setRunning(true), setInterval 350ms:
  //   вызвать sendMessage(), count++
  //   при count >= 12 → clearInterval, setRunning(false)
  const startAuto = () => {
    // TODO: реализовать
  }

  // Координаты брокера и consumer для схемы
  const brokerX = 42
  const consumerX = 78

  return (
    <div className="exercise-container">
      <h2>{t('task.11.2')}</h2>

      {/* TODO: Кнопки переключения брокеров (BROKER_MODELS.map).
          При клике: setSelected, setParticles([]), setMsgCount(0), setRunning(false).
          Активная кнопка: borderBottom с цветом MODEL_CONFIGS[m].color, fontWeight bold.
      */}
      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
        {/* TODO: кнопки брокеров */}
      </div>

      {/* TODO: Информационный блок с рамкой config.color:
          - grid 2 колонки: delivery, guarantee, brokerRole, consumerRole
          - description (fontSize 0.85rem)
          - Анимированная схема (position: relative, height 90):
            * блок "Producer" слева (3%)
            * блок config.name по центру (brokerX-5%) с цветной рамкой
            * блок "Consumer" справа (consumerX+8%)
            * SVG пунктирные линии между блоками
            * particles.map → цветные круги с boxShadow glow,
              left = progress%, opacity угасает при progress > 90
          - Кнопки: "Отправить сообщение" (sendMessage), авто-кнопка (startAuto)
          - Счётчик "Отправлено: {msgCount}"
          - Список flow: config.flow.map с нумерацией и цветом config.color
      */}
      <div style={{ border: '1px solid #555', borderRadius: 8, padding: '1rem', marginBottom: '1rem' }}>
        {/* TODO: информационный блок */}

        {/* Анимированная схема */}
        <div style={{ position: 'relative', height: 90, background: 'rgba(0,0,0,0.3)', borderRadius: 6, marginBottom: '0.75rem', overflow: 'hidden' }}>
          {/* TODO: Producer, Broker, Consumer блоки */}
          {/* TODO: SVG линии */}
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

        {/* TODO: Список шагов flow */}
        <div style={{ fontSize: '0.8rem' }}>
          <div style={{ color: '#aaa', marginBottom: '0.3rem', fontWeight: 'bold' }}>Поток сообщений:</div>
          {/* TODO: config.flow.map */}
        </div>
      </div>
    </div>
  )
}
