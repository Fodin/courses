import { useState } from 'react'
import { useLanguage } from '@courses/platform'

// ============================================
// Task 8.3: Topics and Partitions
// ============================================
//
// Goal: implement a visualization of Kafka partitioning.
// The user creates topics, sends messages with keys,
// and observes how the key determines the partition via a hash function.

// TODO: Define TopicConfig interface:
//   name: string
//   partitions: number
//   replicationFactor: number
//   color: string
//   bgColor: string
// interface TopicConfig { ... }

// TODO: Define Message83 interface:
//   id: number
//   key: string
//   value: string
//   partition: number
//   offset: number
//   color: string
// interface Message83 { ... }

// TODO: Implement function hashKey(key: string, partitions: number): number:
//   - Murmur2-like hash:
//     let hash = 0
//     for (let i = 0; i < key.length; i++) {
//       hash = ((hash << 5) - hash + key.charCodeAt(i)) | 0
//     }
//   - Returns Math.abs(hash) % partitions
// function hashKey(key: string, partitions: number): number { ... }

// TODO: Create constant TOPIC_COLORS — array of 3 objects { color, bgColor }:
//   [0]: { color: '#1565C0', bgColor: '#E3F2FD' }
//   [1]: { color: '#6A1B9A', bgColor: '#F3E5F5' }
//   [2]: { color: '#2E7D32', bgColor: '#E8F5E9' }
// const TOPIC_COLORS = [...]

export function Task8_3() {
  const { t } = useLanguage()

  // TODO: State topics: TopicConfig[] — initialize with two topics:
  //   { name: 'orders',   partitions: 3, replicationFactor: 2, ...TOPIC_COLORS[0] }
  //   { name: 'payments', partitions: 2, replicationFactor: 2, ...TOPIC_COLORS[1] }
  const [topics, setTopics] = useState<unknown[]>([])

  // TODO: State selectedTopic: string — selected topic (default 'orders')
  const [selectedTopic, setSelectedTopic] = useState('orders')

  // TODO: State messages: Record<string, Message83[]> — messages by topic
  //   Initial value: { orders: [], payments: [] }
  const [messages, setMessages] = useState<Record<string, unknown[]>>({ orders: [], payments: [] })

  // TODO: State newTopicName: string — name of the new topic being created
  const [newTopicName, setNewTopicName] = useState('')

  // TODO: State newTopicPartitions: number — number of partitions (default 3)
  const [newTopicPartitions, setNewTopicPartitions] = useState(3)

  // TODO: State msgKey: string — key of the message being sent (default 'user-1')
  const [msgKey, setMsgKey] = useState('user-1')

  // TODO: State msgValue: string — value of the message (default '{"amount":100}')
  const [msgValue, setMsgValue] = useState('{"amount":100}')

  // TODO: State msgLog: string[] — send log (last 16 entries)
  const [msgLog, setMsgLog] = useState<string[]>([])

  // TODO: State nextId: number — message ID counter (default 1)
  const [nextId, setNextId] = useState(1)

  // TODO: Compute currentTopic = topics.find(t => t.name === selectedTopic)
  // const currentTopic = ...

  // TODO: Implement function sendMessage():
  //   1. Checks: currentTopic, msgKey and msgValue are not empty
  //   2. Computes partition = hashKey(msgKey.trim(), currentTopic.partitions)
  //   3. Computes offset = count of existing messages in that partition
  //   4. Creates Message83: { id: nextId, key, value, partition, offset, color: currentTopic.color }
  //   5. Adds to messages[currentTopic.name]
  //   6. Increments nextId by 1
  //   7. Adds TWO lines to msgLog:
  //      `[SEND] topic=NAME key="KEY" → partition=P offset=O`
  //      `  hash("KEY") % N = P`
  //   8. Limits msgLog to 16 entries
  const sendMessage = () => {
    // TODO: implement
  }

  // TODO: Implement function addTopic():
  //   1. Checks: newTopicName is not empty AND topic with that name does not exist
  //   2. Picks color: TOPIC_COLORS[topics.length % TOPIC_COLORS.length]
  //   3. Adds new TopicConfig to topics
  //   4. Initializes messages[newTopicName] = []
  //   5. Switches selectedTopic to the new topic
  //   6. Clears newTopicName
  const addTopic = () => {
    // TODO: implement
  }

  // TODO: Implement helper function getPartitionMessages(topicName: string, partition: number): Message83[]:
  //   Returns (messages[topicName] || []).filter(m => m.partition === partition)
  // const getPartitionMessages = (topicName: string, partition: number) => { ... }

  // TODO: Compute totalMessages = Object.values(messages).flat().length

  return (
    <div style={{ padding: '1rem', fontFamily: 'sans-serif', maxWidth: '1000px' }}>
      <h2 style={{ marginBottom: '0.25rem' }}>{t('task.8.3')}</h2>
      <p style={{ color: '#666', marginBottom: '1rem', fontSize: '0.9rem' }}>
        Create topics, send messages with keys, and observe partitioning in action.
      </p>

      {/* TODO: Stats panel (3 cards: Topics, Total partitions, Messages):
          - topics.length, sum of partitions, totalMessages
          - Colors: '#1565C0', '#6A1B9A', '#2E7D32' */}

      {/* TODO: Topic pill buttons for each topic:
          - Active: border and color topic.color, background topic.bgColor, fontWeight 700
          - Inactive: border '#ddd', background '#fff'
          - Text: "name (Np)" */}

      {/* TODO: Create topic form (background '#f5f5f5', borderRadius '8px'):
          - Topic name input
          - Partition count select: [1, 2, 3, 4, 6, 8]
          - "Create Topic" button → addTopic()
          - Button disabled (background '#ccc') if newTopicName is empty */}

      {/* TODO: Partition visualization for selected topic (if currentTopic exists):
          - Header: "Topic: NAME — N partitions, replication factor: RF"
          - Horizontal row of columns (display flex, gap '0.75rem', overflowX 'auto'):
            * Each column — one partition
            * Column header: "Partition N (X msg)" on topic.color background, color '#fff'
            * Column body: background topic.bgColor, minHeight 120px
            * Message cards: offset=N, key, value (with truncation)
            * If no messages — "No messages" text in gray */}

      {/* TODO: Send message form:
          - Header "Send message"
          - Input key (width 160px, monospace) and Input value (flex 1)
          - "Send" button → sendMessage() (color currentTopic?.color || '#1565C0') */}

      {/* TODO: Send log (if msgLog.length > 0):
          - Dark terminal (background '#0d1117', color '#58a6ff', maxHeight 200px)
          - "Clear" button → setMsgLog([]) */}

      <div style={{ color: '#aaa', fontSize: '0.85rem', marginTop: '2rem' }}>
        TODO: implement the task UI
      </div>
    </div>
  )
}
