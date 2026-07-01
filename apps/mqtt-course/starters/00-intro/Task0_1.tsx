import { useState } from 'react'
import { useLanguage } from '@courses/platform'

// ============================================
// Задание 0.1: Протокол MQTT и модель pub/sub
// ============================================

// TODO: Определи тип для ролей узлов в MQTT-системе
// Возможные значения: 'publisher', 'broker', 'subscriber'
// type NodeType = ...

// TODO: Определи интерфейс PubSubNode с полями:
//   id (string), type (NodeType), label (string),
//   description (string), color (string), bgColor (string)
// interface PubSubNode { ... }

// TODO: Определи тип для уровней QoS
// Подсказка: только значения 0, 1 или 2
// type QoSLevel = ...

// TODO: Определи интерфейс Message с полями:
//   id (number), topic (string), payload (string),
//   qos (QoSLevel), from (string), to (string[])
// interface Message { ... }

// TODO: Создай массив nodes из 6 узлов:
//   - 2 publisher: датчик температуры (topic: home/sensor/temperature)
//                  и датчик двери (topic: home/door/status)
//   - 1 broker: Mosquitto Broker
//   - 3 subscriber: Веб-дашборд (sub: home/#),
//                   Автоматизация (sub: home/sensor/+),
//                   Логгер (sub: home/+/status)
// const nodes: PubSubNode[] = [...]

// TODO: Создай массив exampleMessages из 2 сообщений для симуляции:
//   1. topic: "home/sensor/temperature", payload: JSON, qos: 0
//   2. topic: "home/door/status", payload: JSON, qos: 1
// const exampleMessages: Message[] = [...]

export function Task0_1() {
  const { t } = useLanguage()

  // TODO: Создай состояние activeNode — id выбранного узла или null
  const [activeNode, setActiveNode] = useState<string | null>(null)

  // TODO: Создай состояние selectedMessage — Message или null
  const [selectedMessage, setSelectedMessage] = useState<null>(null)

  // TODO: Создай состояние log — массив строк для лога событий
  const [log, setLog] = useState<string[]>([])

  // TODO: Реализуй функцию publishMessage(msg: Message):
  //   1. Установи selectedMessage = msg
  //   2. Добавь в log строки:
  //      - "PUBLISH → topic: {msg.topic} | QoS: {msg.qos}"
  //      - "BROKER ← получил от {msg.from}"
  //      - Для каждого получателя: "DELIVER → {subscriber}"
  //   3. Новые строки должны быть В НАЧАЛЕ массива (prepend)
  const publishMessage = (_msg: unknown) => {
    // TODO: реализовать
  }

  // TODO: Отдели узлы по типам (publishers, broker, subscribers)
  // const publishers = nodes.filter(...)
  // const subscribers = nodes.filter(...)
  // const broker = nodes.find(...)

  return (
    <div style={{ padding: '1rem', fontFamily: 'sans-serif', maxWidth: '900px' }}>
      <h2>{t('task.0.1')}</h2>

      <p style={{ color: '#555', marginBottom: '1.5rem' }}>
        MQTT — это брокерный протокол. Отправители (publishers) не знают о получателях (subscribers).
        Нажми на кнопку симуляции, чтобы увидеть путь сообщения.
      </p>

      {/* TODO: Реализуй трёхколонную схему pub/sub:
          Колонка 1: "PUBLISHERS" — карточки publishers
          Разделитель: стрелка → с подписью "PUBLISH"
          Колонка 2: Карточка broker (по центру)
          Разделитель: стрелка → с подписью "DELIVER"
          Колонка 3: "SUBSCRIBERS" — карточки subscribers

          Каждая карточка:
          - иконка (📡 для publisher, 🔀 для broker, 💻 для subscriber)
          - label жирным шрифтом цвета карточки
          - description мелким текстом
          - при клике toggleSelectedNode (выделение бордером)
      */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
          marginBottom: '1.5rem',
          padding: '1rem',
          background: '#f8f9fa',
          borderRadius: '12px',
        }}
      >
        <div style={{ padding: '1rem', border: '2px dashed #ddd', borderRadius: '8px' }}>
          Publishers (TODO)
        </div>
        <div>→ PUBLISH →</div>
        <div style={{ padding: '1rem', border: '2px dashed #ddd', borderRadius: '8px' }}>
          Broker (TODO)
        </div>
        <div>→ DELIVER →</div>
        <div style={{ padding: '1rem', border: '2px dashed #ddd', borderRadius: '8px' }}>
          Subscribers (TODO)
        </div>
      </div>

      {/* TODO: Реализуй секцию "Симуляция публикации":
          - Заголовок "Симуляция публикации"
          - Кнопка для каждого publisher (📤 {publisher.label})
          - При клике — вызов publishMessage с нужным сообщением
          - Если selectedMessage !== null: показать блок с деталями:
            Topic, Payload, QoS, Получатели (в стиле карточки)
      */}
      <div style={{ marginBottom: '1.5rem' }}>
        <h3>Симуляция публикации</h3>
        <p style={{ color: '#aaa', fontSize: '0.85rem' }}>
          TODO: добавь кнопки для каждого publisher из массива exampleMessages
        </p>
      </div>

      {/* TODO: Реализуй лог событий:
          - Показывай только если log.length > 0
          - Заголовок "Лог событий" + кнопка "Очистить"
          - Блок в стиле терминала: тёмный фон (#1a1a2e), зелёный текст (#00ff88)
          - Моноширинный шрифт, прокрутка, maxHeight: 180px
          - Кнопка "Очистить" сбрасывает log = []
      */}
      {log.length > 0 && (
        <div>
          <h3>Лог событий</h3>
          <div
            style={{
              background: '#1a1a2e',
              color: '#00ff88',
              fontFamily: 'monospace',
              fontSize: '0.8rem',
              padding: '0.75rem',
              borderRadius: '8px',
            }}
          >
            {log.map((line, i) => (
              <div key={i}>{line}</div>
            ))}
          </div>
        </div>
      )}

      {/* Временная заглушка — удали после реализации */}
      <div style={{ color: '#aaa', fontStyle: 'italic', fontSize: '0.85rem' }}>
        activeNode: {activeNode || 'none'} | selectedMessage: {selectedMessage ? 'yes' : 'none'}
      </div>
    </div>
  )
}
