import { useState, useCallback } from 'react'

// ============================================
// Задание 12.1: Справочная карточка — Chat System
// ============================================

export function Task12_1_Solution() {
  return (
    <div style={{ padding: '1rem' }}>
      <h2>Chat System (WhatsApp-like) — краткая справка</h2>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <div style={{ padding: '1rem', background: '#e3f2fd', borderRadius: '8px' }}>
          <h4 style={{ margin: '0 0 0.5rem' }}>WebSocket Gateway</h4>
          <p style={{ margin: 0, fontSize: '0.9rem' }}>
            <strong>WebSocket</strong> — persistent bidirectional connection. Клиент и сервер обмениваются данными в реальном времени без overhead HTTP-заголовков.
            <br /><br />
            <strong>WS Gateway</strong> — stateful сервис, который держит миллионы соединений. Отделён от бизнес-логики (Chat Service) для независимого масштабирования.
            <br /><br />
            <strong>Session mapping</strong> — Redis хранит userId → gatewayId. Chat Service знает, куда маршрутизировать сообщение.
            <br /><br />
            <strong>L4 Load Balancer</strong> с sticky sessions для WebSocket (один клиент → один Gateway).
          </p>
        </div>
        <div style={{ padding: '1rem', background: '#e8f5e9', borderRadius: '8px' }}>
          <h4 style={{ margin: '0 0 0.5rem' }}>Delivery Statuses</h4>
          <p style={{ margin: 0, fontSize: '0.9rem' }}>
            <strong>SENT (✓)</strong> — сервер сохранил сообщение в БД и отправил ack отправителю.
            <br /><br />
            <strong>DELIVERED (✓✓)</strong> — устройство получателя получило сообщение и отправило ack серверу. Сервер уведомляет отправителя.
            <br /><br />
            <strong>READ (✓✓ синие)</strong> — получатель открыл чат. Batch ack для всех непрочитанных.
            <br /><br />
            Если получатель офлайн → SENT. При reconnect → DELIVERED. При открытии чата → READ.
          </p>
        </div>
        <div style={{ padding: '1rem', background: '#fff3e0', borderRadius: '8px' }}>
          <h4 style={{ margin: '0 0 0.5rem' }}>Presence & Heartbeat</h4>
          <p style={{ margin: 0, fontSize: '0.9rem' }}>
            <strong>Heartbeat</strong> — клиент отправляет ping каждые 30 сек. Redis key с TTL 60 сек.
            <br /><br />
            <strong>Subscription model</strong> — клиент подписывается на presence только тех, кто виден на экране (5-15 человек, а не все 500 контактов).
            <br /><br />
            <strong>Last seen</strong> — при disconnect записывается timestamp. «Был в сети 5 минут назад».
            <br /><br />
            Redis PubSub: канал per user → уведомление подписчикам.
          </p>
        </div>
        <div style={{ padding: '1rem', background: '#fce4ec', borderRadius: '8px' }}>
          <h4 style={{ margin: '0 0 0.5rem' }}>Fan-out & Groups</h4>
          <p style={{ margin: 0, fontSize: '0.9rem' }}>
            <strong>Fan-out on Write</strong> — при отправке создать копию для каждого участника. Быстрое чтение, дорогая запись.
            <br /><br />
            <strong>Fan-out on Read</strong> — одна копия, все читают из общего хранилища. Экономия storage, медленное чтение.
            <br /><br />
            <strong>WhatsApp</strong>: write для 1-to-1 и групп до 256. Read для каналов 1000+.
            <br /><br />
            Шардирование по chatId — все сообщения чата на одном шарде.
          </p>
        </div>
        <div style={{ padding: '1rem', background: '#f3e5f5', borderRadius: '8px' }}>
          <h4 style={{ margin: '0 0 0.5rem' }}>Storage & Sync</h4>
          <p style={{ margin: 0, fontSize: '0.9rem' }}>
            <strong>Cassandra/ScyllaDB</strong> — write-heavy, шардирование по chatId, ordering по messageId.
            <br /><br />
            <strong>Sync</strong> — клиент хранит lastSyncTimestamp. При reconnect: «дай все после timestamp X». Пагинация по 100-200.
            <br /><br />
            <strong>Индексы</strong>: (chatId, createdAt DESC) для пагинации, (userId, lastMessageAt DESC) для списка чатов.
          </p>
        </div>
        <div style={{ padding: '1rem', background: '#e0f2f1', borderRadius: '8px' }}>
          <h4 style={{ margin: '0 0 0.5rem' }}>Media & Offline</h4>
          <p style={{ margin: 0, fontSize: '0.9rem' }}>
            <strong>Media upload</strong> — pre-signed URL → клиент загружает напрямую в S3. Не через WebSocket (5 MB заблокирует соединение).
            <br /><br />
            <strong>Thumbnails</strong> — Lambda при загрузке: S3 event → resize → save.
            <br /><br />
            <strong>Offline queue</strong> — Redis list per user. При reconnect — отдать накопленное + sync из БД.
            <br /><br />
            <strong>Push</strong> — FCM/APNs для уведомления офлайн-получателей.
          </p>
        </div>
      </div>
    </div>
  )
}

// ============================================
// Задание 12.2: Симулятор доставки сообщений
// ============================================

type MessageStatus = 'SENDING' | 'SENT' | 'DELIVERED' | 'READ'

interface ChatMessage {
  id: string
  senderId: string
  recipientId: string
  text: string
  status: MessageStatus
  timestamp: number
}

interface ClientState {
  id: string
  name: string
  online: boolean
  inputText: string
}

function StatusIcon({ status }: { status: MessageStatus }) {
  switch (status) {
    case 'SENDING':
      return <span style={{ color: '#999', fontSize: '0.8rem' }}>...</span>
    case 'SENT':
      return <span style={{ color: '#999', fontSize: '0.8rem' }}>✓</span>
    case 'DELIVERED':
      return <span style={{ color: '#666', fontSize: '0.8rem' }}>✓✓</span>
    case 'READ':
      return <span style={{ color: '#4fc3f7', fontSize: '0.8rem' }}>✓✓</span>
  }
}

export function Task12_2_Solution() {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [offlineQueue, setOfflineQueue] = useState<ChatMessage[]>([])
  const [clients, setClients] = useState<Record<string, ClientState>>({
    alice: { id: 'alice', name: 'Alice', online: true, inputText: '' },
    bob: { id: 'bob', name: 'Bob', online: true, inputText: '' },
  })
  const [log, setLog] = useState<string[]>([])

  const addLog = useCallback((entry: string) => {
    setLog(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${entry}`])
  }, [])

  const sendMessage = useCallback((senderId: string, recipientId: string) => {
    const client = clients[senderId]
    if (!client.inputText.trim()) return

    const msg: ChatMessage = {
      id: `msg_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      senderId,
      recipientId,
      text: client.inputText.trim(),
      status: 'SENT',
      timestamp: Date.now(),
    }

    addLog(`${clients[senderId].name} отправил(а): "${msg.text}" → статус SENT ✓`)

    if (clients[recipientId].online) {
      msg.status = 'DELIVERED'
      addLog(`${clients[recipientId].name} онлайн → статус DELIVERED ✓✓`)
      setMessages(prev => [...prev, msg])
    } else {
      msg.status = 'SENT'
      addLog(`${clients[recipientId].name} офлайн → сообщение в offline-очередь`)
      setMessages(prev => [...prev, msg])
      setOfflineQueue(prev => [...prev, msg])
    }

    setClients(prev => ({
      ...prev,
      [senderId]: { ...prev[senderId], inputText: '' },
    }))
  }, [clients, addLog])

  const toggleOnline = useCallback((clientId: string) => {
    const client = clients[clientId]
    const newOnline = !client.online

    setClients(prev => ({
      ...prev,
      [clientId]: { ...prev[clientId], online: newOnline },
    }))

    if (newOnline) {
      addLog(`${client.name} вернулся(ась) онлайн`)
      const pendingMessages = offlineQueue.filter(m => m.recipientId === clientId)
      if (pendingMessages.length > 0) {
        addLog(`Доставляем ${pendingMessages.length} сообщений из offline-очереди → DELIVERED ✓✓`)
        setMessages(prev =>
          prev.map(m => {
            if (pendingMessages.some(pm => pm.id === m.id)) {
              return { ...m, status: 'DELIVERED' as MessageStatus }
            }
            return m
          })
        )
        setOfflineQueue(prev => prev.filter(m => m.recipientId !== clientId))
      }
    } else {
      addLog(`${client.name} ушёл(ла) офлайн`)
    }
  }, [clients, offlineQueue, addLog])

  const markAsRead = useCallback((readerId: string) => {
    const unreadCount = messages.filter(
      m => m.recipientId === readerId && m.status === 'DELIVERED'
    ).length

    if (unreadCount === 0) {
      addLog(`${clients[readerId].name}: нет непрочитанных сообщений`)
      return
    }

    addLog(`${clients[readerId].name} прочитал(а) ${unreadCount} сообщений → READ ✓✓ (синие)`)
    setMessages(prev =>
      prev.map(m => {
        if (m.recipientId === readerId && m.status === 'DELIVERED') {
          return { ...m, status: 'READ' as MessageStatus }
        }
        return m
      })
    )
  }, [messages, clients, addLog])

  const handleInputChange = useCallback((clientId: string, value: string) => {
    setClients(prev => ({
      ...prev,
      [clientId]: { ...prev[clientId], inputText: value },
    }))
  }, [])

  const offlineForAlice = offlineQueue.filter(m => m.recipientId === 'alice').length
  const offlineForBob = offlineQueue.filter(m => m.recipientId === 'bob').length

  const renderClient = (clientId: string, otherClientId: string) => {
    const client = clients[clientId]
    const otherClient = clients[otherClientId]
    const clientMessages = messages.filter(
      m => (m.senderId === clientId && m.recipientId === otherClientId) ||
           (m.senderId === otherClientId && m.recipientId === clientId)
    )
    const offlineCount = offlineQueue.filter(m => m.recipientId === clientId).length

    return (
      <div style={{
        flex: 1,
        border: '2px solid',
        borderColor: client.online ? '#4caf50' : '#f44336',
        borderRadius: '12px',
        overflow: 'hidden',
      }}>
        {/* Header */}
        <div style={{
          padding: '0.75rem 1rem',
          background: client.online ? '#e8f5e9' : '#ffebee',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <div>
            <strong>{client.name}</strong>
            <span style={{
              marginLeft: '0.5rem',
              padding: '2px 8px',
              borderRadius: '12px',
              fontSize: '0.75rem',
              background: client.online ? '#4caf50' : '#f44336',
              color: 'white',
            }}>
              {client.online ? 'Online' : 'Offline'}
            </span>
            {offlineCount > 0 && (
              <span style={{
                marginLeft: '0.5rem',
                padding: '2px 8px',
                borderRadius: '12px',
                fontSize: '0.75rem',
                background: '#ff9800',
                color: 'white',
              }}>
                {offlineCount} в очереди
              </span>
            )}
          </div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              onClick={() => toggleOnline(clientId)}
              style={{
                padding: '4px 12px',
                borderRadius: '6px',
                border: 'none',
                background: client.online ? '#f44336' : '#4caf50',
                color: 'white',
                cursor: 'pointer',
                fontSize: '0.8rem',
              }}
            >
              {client.online ? 'Go Offline' : 'Go Online'}
            </button>
            <button
              onClick={() => markAsRead(clientId)}
              style={{
                padding: '4px 12px',
                borderRadius: '6px',
                border: 'none',
                background: '#2196f3',
                color: 'white',
                cursor: 'pointer',
                fontSize: '0.8rem',
              }}
            >
              Прочитать
            </button>
          </div>
        </div>

        {/* Chat area */}
        <div style={{
          padding: '0.75rem',
          minHeight: '200px',
          maxHeight: '300px',
          overflowY: 'auto',
          background: '#fafafa',
        }}>
          <div style={{ fontSize: '0.75rem', color: '#999', textAlign: 'center', marginBottom: '0.5rem' }}>
            Чат с {otherClient.name} {otherClient.online ? '(онлайн)' : '(офлайн)'}
          </div>
          {clientMessages.length === 0 && (
            <div style={{ textAlign: 'center', color: '#ccc', padding: '2rem' }}>
              Нет сообщений
            </div>
          )}
          {clientMessages.map(msg => {
            const isMine = msg.senderId === clientId
            return (
              <div
                key={msg.id}
                style={{
                  display: 'flex',
                  justifyContent: isMine ? 'flex-end' : 'flex-start',
                  marginBottom: '0.5rem',
                }}
              >
                <div style={{
                  maxWidth: '70%',
                  padding: '0.5rem 0.75rem',
                  borderRadius: '12px',
                  background: isMine ? '#dcf8c6' : 'white',
                  border: isMine ? 'none' : '1px solid #e0e0e0',
                  boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
                }}>
                  <div style={{ fontSize: '0.9rem' }}>{msg.text}</div>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                    alignItems: 'center',
                    gap: '0.25rem',
                    marginTop: '0.25rem',
                  }}>
                    <span style={{ fontSize: '0.7rem', color: '#999' }}>
                      {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    {isMine && <StatusIcon status={msg.status} />}
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Input area */}
        <div style={{
          padding: '0.5rem 0.75rem',
          borderTop: '1px solid #e0e0e0',
          display: 'flex',
          gap: '0.5rem',
        }}>
          <input
            type="text"
            value={client.inputText}
            onChange={e => handleInputChange(clientId, e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter') sendMessage(clientId, otherClientId)
            }}
            placeholder={`Сообщение от ${client.name}...`}
            style={{
              flex: 1,
              padding: '0.5rem',
              borderRadius: '8px',
              border: '1px solid #ddd',
              fontSize: '0.9rem',
            }}
          />
          <button
            onClick={() => sendMessage(clientId, otherClientId)}
            style={{
              padding: '0.5rem 1rem',
              borderRadius: '8px',
              border: 'none',
              background: '#4caf50',
              color: 'white',
              cursor: 'pointer',
              fontSize: '0.9rem',
            }}
          >
            Отправить
          </button>
        </div>
      </div>
    )
  }

  return (
    <div style={{ padding: '1rem' }}>
      <h2>Симулятор доставки сообщений</h2>
      <p style={{ color: '#666', margin: '0 0 1rem' }}>
        Два клиента обмениваются сообщениями. Переключайте Online/Offline, отправляйте сообщения и наблюдайте за статусами доставки.
      </p>

      {/* Summary */}
      <div style={{
        display: 'flex',
        gap: '1rem',
        marginBottom: '1rem',
        padding: '0.75rem',
        background: '#f5f5f5',
        borderRadius: '8px',
        fontSize: '0.85rem',
      }}>
        <span>Всего сообщений: <strong>{messages.length}</strong></span>
        <span>Offline-очередь Alice: <strong>{offlineForAlice}</strong></span>
        <span>Offline-очередь Bob: <strong>{offlineForBob}</strong></span>
        <span>SENT: <strong>{messages.filter(m => m.status === 'SENT').length}</strong></span>
        <span>DELIVERED: <strong>{messages.filter(m => m.status === 'DELIVERED').length}</strong></span>
        <span>READ: <strong>{messages.filter(m => m.status === 'READ').length}</strong></span>
      </div>

      {/* Two clients side by side */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
        {renderClient('alice', 'bob')}
        {renderClient('bob', 'alice')}
      </div>

      {/* Event log */}
      <div style={{
        border: '1px solid #e0e0e0',
        borderRadius: '8px',
        overflow: 'hidden',
      }}>
        <div style={{
          padding: '0.5rem 1rem',
          background: '#263238',
          color: '#fff',
          fontSize: '0.85rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <span>Event Log (сервер)</span>
          <button
            onClick={() => setLog([])}
            style={{
              padding: '2px 8px',
              borderRadius: '4px',
              border: '1px solid #546e7a',
              background: 'transparent',
              color: '#90a4ae',
              cursor: 'pointer',
              fontSize: '0.75rem',
            }}
          >
            Очистить
          </button>
        </div>
        <div style={{
          padding: '0.5rem 1rem',
          background: '#37474f',
          color: '#b0bec5',
          fontSize: '0.8rem',
          fontFamily: 'monospace',
          maxHeight: '150px',
          overflowY: 'auto',
        }}>
          {log.length === 0 && (
            <div style={{ color: '#546e7a' }}>Отправьте первое сообщение...</div>
          )}
          {log.map((entry, i) => (
            <div key={i} style={{ padding: '2px 0' }}>{entry}</div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ============================================
// Задание 12.3: Проектирование хранения сообщений
// ============================================

interface TableField {
  name: string
  type: string
  description: string
  isPrimaryKey?: boolean
  isPartitionKey?: boolean
  isIndex?: boolean
}

interface TableDef {
  name: string
  description: string
  shardingKey: string
  shardingReason: string
  fields: TableField[]
  indexes: string[]
  queries: string[]
}

const TABLES: TableDef[] = [
  {
    name: 'messages',
    description: 'Основное хранилище сообщений. Write-heavy: миллионы записей в секунду.',
    shardingKey: 'chatId',
    shardingReason: 'Все сообщения одного чата на одном шарде → чтение чата = один запрос к одному шарду. Без scatter-gather.',
    fields: [
      { name: 'messageId', type: 'string (Snowflake)', description: 'Глобально уникальный ID, содержит timestamp для ordering', isPrimaryKey: true },
      { name: 'chatId', type: 'string (UUID)', description: 'ID чата (1-to-1 или группа). Partition key для шардирования', isPartitionKey: true },
      { name: 'senderId', type: 'string (UUID)', description: 'ID отправителя' },
      { name: 'content', type: 'text', description: 'Текст сообщения (зашифрованный для E2EE)' },
      { name: 'contentType', type: 'enum', description: 'text | image | video | file | audio' },
      { name: 'mediaUrl', type: 'string?', description: 'URL медиа в S3 (для image/video/file)' },
      { name: 'status', type: 'enum', description: 'SENT | DELIVERED | READ (per recipient в группах)' },
      { name: 'createdAt', type: 'timestamp', description: 'Unix timestamp создания' },
    ],
    indexes: [
      'PRIMARY KEY (chatId, messageId) — сообщения чата в порядке Snowflake ID',
      'INDEX (chatId, createdAt DESC) — пагинация: последние N сообщений чата',
    ],
    queries: [
      'SELECT * FROM messages WHERE chatId = ? ORDER BY messageId DESC LIMIT 50',
      'SELECT * FROM messages WHERE chatId = ? AND createdAt > ? ORDER BY createdAt ASC',
    ],
  },
  {
    name: 'chats',
    description: 'Метаданные чатов: тип, название, время последнего сообщения.',
    shardingKey: 'chatId',
    shardingReason: 'Часто читается вместе с messages. Один шард для metadata и сообщений чата.',
    fields: [
      { name: 'chatId', type: 'string (UUID)', description: 'Уникальный ID чата', isPrimaryKey: true },
      { name: 'type', type: 'enum', description: 'direct | group' },
      { name: 'name', type: 'string?', description: 'Название группы (null для direct)' },
      { name: 'createdBy', type: 'string (UUID)', description: 'Создатель чата' },
      { name: 'createdAt', type: 'timestamp', description: 'Дата создания' },
      { name: 'lastMessageAt', type: 'timestamp', description: 'Время последнего сообщения (для сортировки списка чатов)' },
      { name: 'lastMessagePreview', type: 'string', description: 'Превью последнего сообщения (первые 100 символов)' },
    ],
    indexes: [
      'PRIMARY KEY (chatId)',
      'INDEX (lastMessageAt DESC) — для сортировки списка чатов (используется через chat_participants)',
    ],
    queries: [
      'SELECT * FROM chats WHERE chatId IN (?)',
    ],
  },
  {
    name: 'chat_participants',
    description: 'Участники чатов: роли, время прочтения, mute. Связь users ↔ chats.',
    shardingKey: 'userId',
    shardingReason: 'Основной запрос: «список чатов пользователя». Шардирование по userId = один запрос к одному шарду.',
    fields: [
      { name: 'userId', type: 'string (UUID)', description: 'ID пользователя', isPrimaryKey: true, isPartitionKey: true },
      { name: 'chatId', type: 'string (UUID)', description: 'ID чата', isPrimaryKey: true },
      { name: 'role', type: 'enum', description: 'owner | admin | member' },
      { name: 'joinedAt', type: 'timestamp', description: 'Когда вступил в чат' },
      { name: 'lastReadMessageId', type: 'string?', description: 'ID последнего прочитанного сообщения (для подсчёта unread)' },
      { name: 'lastReadAt', type: 'timestamp?', description: 'Когда последний раз читал чат' },
      { name: 'mutedUntil', type: 'timestamp?', description: 'Mute уведомлений до указанного времени' },
      { name: 'lastMessageAt', type: 'timestamp', description: 'Денормализованное время последнего сообщения (для сортировки)' },
    ],
    indexes: [
      'PRIMARY KEY (userId, chatId)',
      'INDEX (userId, lastMessageAt DESC) — список чатов пользователя, отсортированный по активности',
      'INDEX (chatId) — получить всех участников чата (для fan-out)',
    ],
    queries: [
      'SELECT * FROM chat_participants WHERE userId = ? ORDER BY lastMessageAt DESC LIMIT 20',
      'SELECT userId FROM chat_participants WHERE chatId = ?',
      'Unread count: сравнить lastReadMessageId с последним messageId в чате',
    ],
  },
]

export function Task12_3_Solution() {
  const [activeTable, setActiveTable] = useState(0)
  const [showDetails, setShowDetails] = useState<Record<string, boolean>>({})

  const toggleDetail = useCallback((key: string) => {
    setShowDetails(prev => ({ ...prev, [key]: !prev[key] }))
  }, [])

  const table = TABLES[activeTable]

  return (
    <div style={{ padding: '1rem' }}>
      <h2>Data Model мессенджера</h2>
      <p style={{ color: '#666', margin: '0 0 1rem' }}>
        Три основные таблицы: messages (сообщения), chats (метаданные), chat_participants (участники). Выберите таблицу для детального просмотра.
      </p>

      {/* Table tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
        {TABLES.map((t, i) => (
          <button
            key={t.name}
            onClick={() => setActiveTable(i)}
            style={{
              padding: '0.5rem 1rem',
              borderRadius: '8px',
              border: '2px solid',
              borderColor: i === activeTable ? '#1976d2' : '#e0e0e0',
              background: i === activeTable ? '#e3f2fd' : 'white',
              color: i === activeTable ? '#1976d2' : '#666',
              cursor: 'pointer',
              fontWeight: i === activeTable ? 'bold' : 'normal',
              fontSize: '0.9rem',
            }}
          >
            {t.name}
          </button>
        ))}
      </div>

      {/* Table description */}
      <div style={{
        padding: '1rem',
        background: '#f5f5f5',
        borderRadius: '8px',
        marginBottom: '1rem',
      }}>
        <div style={{ fontSize: '0.9rem', color: '#333' }}>{table.description}</div>
        <div style={{ marginTop: '0.5rem', fontSize: '0.85rem' }}>
          <strong>Sharding key:</strong>{' '}
          <span style={{ background: '#fff3e0', padding: '2px 8px', borderRadius: '4px', fontFamily: 'monospace' }}>
            {table.shardingKey}
          </span>
        </div>
        <div style={{ marginTop: '0.25rem', fontSize: '0.85rem', color: '#666' }}>
          {table.shardingReason}
        </div>
      </div>

      {/* Fields */}
      <div style={{ marginBottom: '1rem' }}>
        <h4 style={{ margin: '0 0 0.5rem' }}>Поля</h4>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
          <thead>
            <tr style={{ background: '#f5f5f5' }}>
              <th style={{ padding: '0.5rem', textAlign: 'left', borderBottom: '2px solid #e0e0e0' }}>Поле</th>
              <th style={{ padding: '0.5rem', textAlign: 'left', borderBottom: '2px solid #e0e0e0' }}>Тип</th>
              <th style={{ padding: '0.5rem', textAlign: 'left', borderBottom: '2px solid #e0e0e0' }}>Описание</th>
              <th style={{ padding: '0.5rem', textAlign: 'center', borderBottom: '2px solid #e0e0e0' }}>Ключи</th>
            </tr>
          </thead>
          <tbody>
            {table.fields.map(field => (
              <tr key={field.name} style={{ borderBottom: '1px solid #f0f0f0' }}>
                <td style={{ padding: '0.5rem', fontFamily: 'monospace', fontWeight: 'bold' }}>
                  {field.name}
                </td>
                <td style={{ padding: '0.5rem', fontFamily: 'monospace', color: '#1976d2' }}>
                  {field.type}
                </td>
                <td style={{ padding: '0.5rem', color: '#666' }}>
                  {field.description}
                </td>
                <td style={{ padding: '0.5rem', textAlign: 'center' }}>
                  {field.isPrimaryKey && (
                    <span style={{
                      display: 'inline-block',
                      padding: '1px 6px',
                      borderRadius: '4px',
                      background: '#e8f5e9',
                      color: '#2e7d32',
                      fontSize: '0.75rem',
                      marginRight: '4px',
                    }}>PK</span>
                  )}
                  {field.isPartitionKey && (
                    <span style={{
                      display: 'inline-block',
                      padding: '1px 6px',
                      borderRadius: '4px',
                      background: '#fff3e0',
                      color: '#e65100',
                      fontSize: '0.75rem',
                    }}>Shard</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Indexes */}
      <div style={{ marginBottom: '1rem' }}>
        <button
          onClick={() => toggleDetail('indexes')}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            fontSize: '1rem',
            fontWeight: 'bold',
            padding: '0.5rem 0',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
          }}
        >
          <span>{showDetails['indexes'] ? '▼' : '▶'}</span>
          Индексы ({table.indexes.length})
        </button>
        {showDetails['indexes'] && (
          <div style={{ padding: '0 0 0 1.5rem' }}>
            {table.indexes.map((idx, i) => (
              <div key={i} style={{
                padding: '0.5rem',
                background: '#f5f5f5',
                borderRadius: '4px',
                marginBottom: '0.5rem',
                fontFamily: 'monospace',
                fontSize: '0.85rem',
              }}>
                {idx}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Queries */}
      <div style={{ marginBottom: '1rem' }}>
        <button
          onClick={() => toggleDetail('queries')}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            fontSize: '1rem',
            fontWeight: 'bold',
            padding: '0.5rem 0',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
          }}
        >
          <span>{showDetails['queries'] ? '▼' : '▶'}</span>
          Основные запросы ({table.queries.length})
        </button>
        {showDetails['queries'] && (
          <div style={{ padding: '0 0 0 1.5rem' }}>
            {table.queries.map((q, i) => (
              <div key={i} style={{
                padding: '0.5rem',
                background: '#263238',
                color: '#b0bec5',
                borderRadius: '4px',
                marginBottom: '0.5rem',
                fontFamily: 'monospace',
                fontSize: '0.85rem',
              }}>
                {q}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Sync protocol */}
      <div style={{
        padding: '1rem',
        background: '#e8f5e9',
        borderRadius: '8px',
        marginTop: '1rem',
      }}>
        <h4 style={{ margin: '0 0 0.5rem' }}>Sync-протокол</h4>
        <div style={{ fontSize: '0.9rem' }}>
          <p style={{ margin: '0 0 0.5rem' }}>
            <strong>1.</strong> Клиент хранит <code>lastSyncTimestamp</code> локально
          </p>
          <p style={{ margin: '0 0 0.5rem' }}>
            <strong>2.</strong> При reconnect: <code>GET /sync?since=lastSyncTimestamp&limit=200</code>
          </p>
          <p style={{ margin: '0 0 0.5rem' }}>
            <strong>3.</strong> Сервер возвращает новые сообщения + <code>hasMore</code> флаг
          </p>
          <p style={{ margin: '0 0 0.5rem' }}>
            <strong>4.</strong> Если <code>hasMore=true</code> — клиент запрашивает следующую порцию
          </p>
          <p style={{ margin: '0' }}>
            <strong>5.</strong> Обновить <code>lastSyncTimestamp</code> на timestamp последнего полученного сообщения
          </p>
        </div>
      </div>
    </div>
  )
}

// ============================================
// Задание 12.4: Полный дизайн мессенджера
// ============================================

interface DesignSection {
  title: string
  icon: string
  color: string
  content: Array<{
    subtitle: string
    points: string[]
  }>
}

const DESIGN_SECTIONS: DesignSection[] = [
  {
    title: 'Requirements',
    icon: '📋',
    color: '#e3f2fd',
    content: [
      {
        subtitle: 'Functional Requirements',
        points: [
          '1-to-1 real-time чат через WebSocket',
          'Групповые чаты до 256 участников',
          'Статусы доставки: SENT (✓), DELIVERED (✓✓), READ (✓✓ синие)',
          'Online/Offline presence: «был в сети X минут назад»',
          'Отправка медиа: фото, видео, файлы',
          'Offline-режим: доставка при reconnect',
          'Sync истории между устройствами',
        ],
      },
      {
        subtitle: 'Non-Functional Requirements',
        points: [
          'Задержка доставки < 200 мс (онлайн → онлайн)',
          'Миллионы одновременных WebSocket-соединений',
          'Сообщения не теряются (at-least-once delivery)',
          'Порядок сообщений в рамках чата гарантирован',
          'Consistency: оба собеседника видят одну историю',
        ],
      },
      {
        subtitle: 'Масштаб',
        points: [
          '500M DAU, 50M одновременных соединений',
          '100B сообщений в день',
          'Средний пользователь в 10-50 чатах',
          '5% сообщений содержат медиа',
        ],
      },
    ],
  },
  {
    title: 'WebSocket & Connection Management',
    icon: '🌐',
    color: '#e8f5e9',
    content: [
      {
        subtitle: 'Почему WebSocket',
        points: [
          'Persistent bidirectional connection — минимальный overhead',
          'Сервер push без polling — данные только когда есть',
          '50M соединений vs 50M × 30 req/min = 1.5B req/min при polling',
          'Fallback: Long Polling для корпоративных прокси',
        ],
      },
      {
        subtitle: 'WS Gateway Architecture',
        points: [
          'WS Gateway — stateful сервис, только держит соединения и проксирует',
          'Бизнес-логика в Chat Service (stateless, легко масштабировать)',
          'Redis: маппинг userId → gatewayId для маршрутизации',
          'L4 Load Balancer с sticky sessions (IP hash / cookie)',
          'При сбое Gateway — клиент переподключается к другому, Redis обновляется',
        ],
      },
    ],
  },
  {
    title: 'Message Delivery Protocol',
    icon: '✉️',
    color: '#fff3e0',
    content: [
      {
        subtitle: 'Три статуса',
        points: [
          'SENT (✓) — сервер сохранил в БД, отправил ack отправителю',
          'DELIVERED (✓✓) — устройство получателя получило, отправило ack серверу → ack отправителю',
          'READ (✓✓ синие) — получатель открыл чат, batch ack для всех DELIVERED',
        ],
      },
      {
        subtitle: 'Offline Handling',
        points: [
          'Получатель офлайн → сообщение в БД (SENT), в offline queue (Redis list)',
          'Push-уведомление через FCM/APNs',
          'При reconnect: отдать offline queue + sync из БД по lastSyncTimestamp',
          'Delivery ack при получении → обновить статус → уведомить отправителя',
        ],
      },
    ],
  },
  {
    title: 'Presence Service',
    icon: '👁',
    color: '#f3e5f5',
    content: [
      {
        subtitle: 'Heartbeat Mechanism',
        points: [
          'Клиент отправляет heartbeat каждые 30 сек через WebSocket',
          'Redis: SET presence:{userId} EX 60 — TTL 60 сек',
          'Нет heartbeat 60 сек → ключ истекает → пользователь офлайн',
          'При disconnect: записать lastSeen timestamp',
        ],
      },
      {
        subtitle: 'Fan-out Presence Updates',
        points: [
          'Subscription model: клиент подписывается на presence видимых на экране (5-15 человек)',
          'Redis PubSub: канал presence:{userId}',
          'Открыл чат с Alice → subscribe presence:alice',
          'Закрыл чат → unsubscribe',
          'НЕ уведомлять всех 500 контактов при каждом heartbeat',
        ],
      },
    ],
  },
  {
    title: 'Group Chats & Fan-out',
    icon: '👥',
    color: '#fce4ec',
    content: [
      {
        subtitle: 'Fan-out on Write (WhatsApp)',
        points: [
          '1 сообщение → N записей (по числу участников)',
          'Быстрое чтение: у каждого свой inbox',
          'Подходит для 1-to-1 и групп до 256 человек',
          'Trade-off: storage × N, write amplification',
        ],
      },
      {
        subtitle: 'Fan-out on Read (для больших каналов)',
        points: [
          '1 сообщение = 1 запись в хранилище группы',
          'При открытии канала — запрос к общему хранилищу',
          'Подходит для каналов с 1000+ подписчиков',
          'Trade-off: медленнее чтение, сложнее unread count',
        ],
      },
      {
        subtitle: 'Гибридный подход',
        points: [
          'Direct и малые группы (до 256) → fan-out on write',
          'Публичные каналы (1000+) → fan-out on read',
          'Граница определяется числом участников при создании/росте',
        ],
      },
    ],
  },
  {
    title: 'Storage & Data Model',
    icon: '💾',
    color: '#e0f2f1',
    content: [
      {
        subtitle: 'Таблицы',
        points: [
          'messages: messageId (Snowflake), chatId, senderId, content, contentType, mediaUrl, createdAt',
          'chats: chatId, type, name, lastMessageAt, lastMessagePreview',
          'chat_participants: userId, chatId, role, lastReadMessageId, mutedUntil, lastMessageAt',
        ],
      },
      {
        subtitle: 'Sharding',
        points: [
          'messages → шардирование по chatId (все сообщения чата на одном шарде)',
          'chat_participants → шардирование по userId (список чатов пользователя)',
          'Cassandra/ScyllaDB: write-heavy, LSM-tree, горизонтальное масштабирование',
        ],
      },
      {
        subtitle: 'Sync Protocol',
        points: [
          'Клиент хранит lastSyncTimestamp локально',
          'При reconnect: GET /sync?since=T&limit=200',
          'Пагинация: hasMore=true → запросить следующую порцию',
          'Snowflake ID: timestamp + machine + sequence → ordering + uniqueness',
        ],
      },
    ],
  },
  {
    title: 'Media & Infrastructure',
    icon: '☁️',
    color: '#efebe9',
    content: [
      {
        subtitle: 'Media Upload',
        points: [
          'Pre-signed URL: клиент → API → получить URL → загрузить напрямую в S3',
          'НЕ через WebSocket (блокирует соединение) и НЕ через Chat Service (не file server)',
          'Thumbnails: S3 event → Lambda → resize → save thumbnail',
          'CDN для раздачи медиа (CloudFront / Cloudflare)',
        ],
      },
      {
        subtitle: 'Message Queue',
        points: [
          'Kafka: partition по chatId → ordering гарантирован в рамках чата',
          'Consumers: message store writer, notification sender, analytics',
          'At-least-once delivery + idempotent consumers',
        ],
      },
      {
        subtitle: 'Push Notifications',
        points: [
          'FCM (Android/Web) + APNs (iOS) для офлайн-пользователей',
          'Notification payload: sender name, message preview (первые 100 символов)',
          'Suppress push если пользователь онлайн (уже получит через WebSocket)',
        ],
      },
    ],
  },
]

export function Task12_4_Solution() {
  const [openSections, setOpenSections] = useState<Record<number, boolean>>({ 0: true })

  const toggleSection = useCallback((idx: number) => {
    setOpenSections(prev => ({ ...prev, [idx]: !prev[idx] }))
  }, [])

  return (
    <div style={{ padding: '1rem' }}>
      <h2>Полный System Design: Мессенджер (WhatsApp-like)</h2>
      <p style={{ color: '#666', margin: '0 0 1rem' }}>
        Раскройте каждую секцию, чтобы увидеть детальное проектное решение. Используйте как эталон для сравнения с собственным дизайном.
      </p>

      {DESIGN_SECTIONS.map((section, idx) => (
        <div key={idx} style={{
          marginBottom: '0.75rem',
          border: '1px solid #e0e0e0',
          borderRadius: '8px',
          overflow: 'hidden',
        }}>
          <button
            onClick={() => toggleSection(idx)}
            style={{
              width: '100%',
              padding: '0.75rem 1rem',
              background: openSections[idx] ? section.color : '#fafafa',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              fontSize: '1rem',
              textAlign: 'left',
            }}
          >
            <span style={{ fontSize: '1.25rem' }}>{section.icon}</span>
            <strong>{section.title}</strong>
            <span style={{ marginLeft: 'auto', color: '#999' }}>
              {openSections[idx] ? '▼' : '▶'}
            </span>
          </button>

          {openSections[idx] && (
            <div style={{ padding: '1rem' }}>
              {section.content.map((block, bIdx) => (
                <div key={bIdx} style={{ marginBottom: bIdx < section.content.length - 1 ? '1rem' : 0 }}>
                  <h4 style={{ margin: '0 0 0.5rem', color: '#333' }}>{block.subtitle}</h4>
                  <ul style={{ margin: 0, paddingLeft: '1.5rem' }}>
                    {block.points.map((point, pIdx) => (
                      <li key={pIdx} style={{ marginBottom: '0.25rem', fontSize: '0.9rem', color: '#555' }}>
                        {point}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}

      {/* Architecture summary table */}
      <div style={{
        marginTop: '1rem',
        padding: '1rem',
        background: '#f5f5f5',
        borderRadius: '8px',
      }}>
        <h4 style={{ margin: '0 0 0.75rem' }}>Выбор технологий</h4>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
          <thead>
            <tr style={{ background: '#e0e0e0' }}>
              <th style={{ padding: '0.5rem', textAlign: 'left' }}>Компонент</th>
              <th style={{ padding: '0.5rem', textAlign: 'left' }}>Технология</th>
              <th style={{ padding: '0.5rem', textAlign: 'left' }}>Обоснование</th>
            </tr>
          </thead>
          <tbody>
            {[
              ['WS Gateway', 'Go / Erlang', 'Миллионы concurrent connections, low memory per goroutine/process'],
              ['Session Store', 'Redis Cluster', 'O(1) lookup userId → gatewayId, TTL для auto-cleanup'],
              ['Message Store', 'Cassandra / ScyllaDB', 'Write-heavy, шардирование по chatId, LSM-tree'],
              ['Message Queue', 'Kafka', 'Ordering per partition (key = chatId), at-least-once'],
              ['Media Storage', 'S3 + CDN', 'Pre-signed URL upload, CloudFront для раздачи'],
              ['Presence', 'Redis + PubSub', 'TTL для heartbeat, PubSub для subscription model'],
              ['Push', 'FCM + APNs', 'Уведомления для офлайн-пользователей'],
            ].map(([component, tech, reason], i) => (
              <tr key={i} style={{ borderBottom: '1px solid #e0e0e0' }}>
                <td style={{ padding: '0.5rem', fontWeight: 'bold' }}>{component}</td>
                <td style={{ padding: '0.5rem', fontFamily: 'monospace', color: '#1976d2' }}>{tech}</td>
                <td style={{ padding: '0.5rem', color: '#666' }}>{reason}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
