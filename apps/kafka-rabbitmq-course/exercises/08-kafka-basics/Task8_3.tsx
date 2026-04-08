import { useState } from 'react'
import { useLanguage } from '@courses/platform'

// ============================================
// Задание 8.3: Topics и Partitions
// ============================================
//
// Цель: реализовать визуализацию партиционирования Kafka.
// Пользователь создаёт topics, отправляет сообщения с ключами
// и наблюдает, как ключ через хэш-функцию определяет партицию.

// TODO: Определи интерфейс TopicConfig:
//   name: string
//   partitions: number
//   replicationFactor: number
//   color: string
//   bgColor: string
// interface TopicConfig { ... }

// TODO: Определи интерфейс Message83:
//   id: number
//   key: string
//   value: string
//   partition: number
//   offset: number
//   color: string
// interface Message83 { ... }

// TODO: Реализуй функцию hashKey(key: string, partitions: number): number:
//   - Murmur2-подобный хэш:
//     let hash = 0
//     for (let i = 0; i < key.length; i++) {
//       hash = ((hash << 5) - hash + key.charCodeAt(i)) | 0
//     }
//   - Возвращает Math.abs(hash) % partitions
// function hashKey(key: string, partitions: number): number { ... }

// TODO: Создай константу TOPIC_COLORS — массив из 3 объектов { color, bgColor }:
//   [0]: { color: '#1565C0', bgColor: '#E3F2FD' }
//   [1]: { color: '#6A1B9A', bgColor: '#F3E5F5' }
//   [2]: { color: '#2E7D32', bgColor: '#E8F5E9' }
// const TOPIC_COLORS = [...]

export function Task8_3() {
  const { t } = useLanguage()

  // TODO: Состояние topics: TopicConfig[] — инициализировать двумя топиками:
  //   { name: 'orders',   partitions: 3, replicationFactor: 2, ...TOPIC_COLORS[0] }
  //   { name: 'payments', partitions: 2, replicationFactor: 2, ...TOPIC_COLORS[1] }
  const [topics, setTopics] = useState<unknown[]>([])

  // TODO: Состояние selectedTopic: string — выбранный topic (по умолчанию 'orders')
  const [selectedTopic, setSelectedTopic] = useState('orders')

  // TODO: Состояние messages: Record<string, Message83[]> — сообщения по топикам
  //   Начальное значение: { orders: [], payments: [] }
  const [messages, setMessages] = useState<Record<string, unknown[]>>({ orders: [], payments: [] })

  // TODO: Состояние newTopicName: string — имя нового создаваемого топика
  const [newTopicName, setNewTopicName] = useState('')

  // TODO: Состояние newTopicPartitions: number — количество партиций (по умолчанию 3)
  const [newTopicPartitions, setNewTopicPartitions] = useState(3)

  // TODO: Состояние msgKey: string — ключ отправляемого сообщения (по умолчанию 'user-1')
  const [msgKey, setMsgKey] = useState('user-1')

  // TODO: Состояние msgValue: string — значение сообщения (по умолчанию '{"amount":100}')
  const [msgValue, setMsgValue] = useState('{"amount":100}')

  // TODO: Состояние msgLog: string[] — лог отправки (последние 16 записей)
  const [msgLog, setMsgLog] = useState<string[]>([])

  // TODO: Состояние nextId: number — счётчик ID сообщений (по умолчанию 1)
  const [nextId, setNextId] = useState(1)

  // TODO: Вычисли currentTopic = topics.find(t => t.name === selectedTopic)
  // const currentTopic = ...

  // TODO: Реализуй функцию sendMessage():
  //   1. Проверяет: currentTopic, msgKey и msgValue не пустые
  //   2. Вычисляет partition = hashKey(msgKey.trim(), currentTopic.partitions)
  //   3. Вычисляет offset = количество уже существующих сообщений в этой партиции
  //   4. Создаёт Message83: { id: nextId, key, value, partition, offset, color: currentTopic.color }
  //   5. Добавляет в messages[currentTopic.name]
  //   6. Увеличивает nextId на 1
  //   7. В msgLog добавляет ДВЕ строки:
  //      `[SEND] topic=NAME key="KEY" → partition=P offset=O`
  //      `  hash("KEY") % N = P`
  //   8. Ограничивает msgLog до 16 записей
  const sendMessage = () => {
    // TODO: реализовать
  }

  // TODO: Реализуй функцию addTopic():
  //   1. Проверяет: newTopicName не пустое И топик с таким именем ещё не существует
  //   2. Выбирает цвет: TOPIC_COLORS[topics.length % TOPIC_COLORS.length]
  //   3. Добавляет новый TopicConfig в topics
  //   4. Инициализирует messages[newTopicName] = []
  //   5. Переключает selectedTopic на новый топик
  //   6. Очищает newTopicName
  const addTopic = () => {
    // TODO: реализовать
  }

  // TODO: Реализуй вспомогательную функцию getPartitionMessages(topicName: string, partition: number): Message83[]:
  //   Возвращает (messages[topicName] || []).filter(m => m.partition === partition)
  // const getPartitionMessages = (topicName: string, partition: number) => { ... }

  // TODO: Вычисли totalMessages = Object.values(messages).flat().length

  return (
    <div style={{ padding: '1rem', fontFamily: 'sans-serif', maxWidth: '1000px' }}>
      <h2 style={{ marginBottom: '0.25rem' }}>{t('task.8.3')}</h2>
      <p style={{ color: '#666', marginBottom: '1rem', fontSize: '0.9rem' }}>
        Создавай topics, отправляй сообщения с ключами и наблюдай за партиционированием.
      </p>

      {/* TODO: Панель статистики (3 карточки: Topics, Всего партиций, Сообщений):
          - topics.length, сумма партиций, totalMessages
          - Цвета: '#1565C0', '#6A1B9A', '#2E7D32' */}

      {/* TODO: Кнопки-таблетки для каждого топика:
          - Активный: border и цвет topic.color, background topic.bgColor, fontWeight 700
          - Неактивный: border '#ddd', background '#fff'
          - Текст: "name (Np)" */}

      {/* TODO: Форма создания топика (background '#f5f5f5', borderRadius '8px'):
          - Input имени топика
          - Select количества партиций: [1, 2, 3, 4, 6, 8]
          - Кнопка "Создать Topic" → addTopic()
          - Кнопка disabled (background '#ccc') если newTopicName пустое */}

      {/* TODO: Визуализация партиций выбранного топика (если currentTopic существует):
          - Заголовок: "Topic: NAME — N партиций, replication factor: RF"
          - Горизонтальный ряд колонок (display flex, gap '0.75rem', overflowX 'auto'):
            * Каждая колонка — одна партиция
            * Заголовок колонки: "Partition N (X msg)" на фоне topic.color, цвет '#fff'
            * Тело колонки: background topic.bgColor, minHeight 120px
            * Карточки сообщений: offset=N, key, value (с truncation)
            * Если сообщений нет — текст "Нет сообщений" серым */}

      {/* TODO: Форма отправки сообщения:
          - Заголовок "Отправить сообщение"
          - Input key (width 160px, monospace) и Input value (flex 1)
          - Кнопка "Отправить" → sendMessage() (цвет currentTopic?.color || '#1565C0') */}

      {/* TODO: Лог отправки (если msgLog.length > 0):
          - Тёмный терминал (background '#0d1117', цвет '#58a6ff', maxHeight 200px)
          - Кнопка "Очистить" → setMsgLog([]) */}

      <div style={{ color: '#aaa', fontSize: '0.85rem', marginTop: '2rem' }}>
        TODO: реализовать интерфейс задания
      </div>
    </div>
  )
}
