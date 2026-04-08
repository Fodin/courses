import { useState } from 'react'
import { useLanguage } from '@courses/platform'

// ============================================
// Task 5.1: Direct Exchange
// ============================================
//
// Goal: implement a Direct Exchange simulator.
// Direct Exchange routes a message only to queues
// whose binding key exactly matches the message's routing key.
//
// A single queue can have multiple binding keys.
// One routing key can bind multiple queues.

// TODO: Define the DirectBinding interface:
//   queue: string         — queue name
//   routingKey: string    — binding key (exact match)
//   color: string         — color for visualization
//   bgColor: string       — background color
//   messages: string[]    — recent messages in the queue
// interface DirectBinding { ... }

// TODO: Define the DirectMessage interface:
//   id: number
//   routingKey: string
//   payload: string
//   timestamp: string
// interface DirectMessage { ... }

// TODO: Create the initialDirectBindings array with 4 bindings:
//   1. queue: 'orders.new',       routingKey: 'order.created'
//   2. queue: 'orders.paid',      routingKey: 'order.paid'
//   3. queue: 'orders.cancelled', routingKey: 'order.cancelled'
//   4. queue: 'notifications',    routingKey: 'order.created'  ← same queue as #1!
// const initialDirectBindings: DirectBinding[] = [...]

// TODO: Create the directRoutingKeys array with 5 example keys:
//   'order.created', 'order.paid', 'order.cancelled', 'order.shipped', 'user.registered'
// const directRoutingKeys: string[] = [...]

export function Task5_1() {
  const { t } = useLanguage()

  // TODO: Declare state variables:
  //   bindings       — array of DirectBinding (initialDirectBindings)
  //   selectedKey    — selected routing key (string, default 'order.created')
  //   customKey      — custom routing key (string, default '')
  //   animating      — list of queue names being animated (string[])
  //   log            — message log (DirectMessage[])
  //   messageCount   — counter of sent messages (number, 0)
  const [bindings, setBindings] = useState<string[]>([])
  const [selectedKey, setSelectedKey] = useState('order.created')
  const [customKey, setCustomKey] = useState('')
  const [animating, setAnimating] = useState<string[]>([])
  const [log, setLog] = useState<string[]>([])
  const [messageCount, setMessageCount] = useState(0)

  // TODO: Implement the publish() function:
  //   1. Determine the active key: customKey.trim() if not empty, otherwise selectedKey
  //   2. Get timestamp via new Date().toLocaleTimeString()
  //   3. Find all bindings with routingKey === active key → matched[]
  //   4. Update bindings: add a string like `[ts] routing_key="${key}"` to the start of messages
  //      (only for matched ones, keep at most 5 messages: .slice(0, 4))
  //   5. Set animating = matched.map(b => b.queue)
  //   6. Increment messageCount
  //   7. Create a DirectMessage object and add it to the start of log (at most 10 entries)
  //   8. After 900ms, reset animating to []
  const publish = () => {
    // TODO: implement
    console.log('TODO: publish()')
  }

  // TODO: Implement the clearQueues() function:
  //   - Resets messages to [] for each binding
  //   - Clears the log
  const clearQueues = () => {
    // TODO: implement
  }

  return (
    <div style={{ padding: '1rem', fontFamily: 'sans-serif', maxWidth: '960px' }}>
      <h2 style={{ marginBottom: '0.25rem' }}>{t('task.5.1')}</h2>
      <p style={{ color: '#666', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
        Direct Exchange routes a message only to queues whose routing key exactly matches the message key.
      </p>

      {/* TODO: Architecture diagram (Producer → Exchange → Queues)
          Display a horizontal diagram:
          - Producer block with icon 📤 and current routing key
          - Arrow → labeled PUBLISH
          - Direct Exchange block with icon 🔀
          - For each binding: badge with routingKey → line → queue block

          Visual states:
          - Binding key highlighted if it matches the current key
          - Queue highlighted if isAnimating (animating.includes(b.queue))
          - Inside queue: name, "N msg" counter, last message
      */}
      <div
        style={{
          background: '#f8f9fa',
          borderRadius: '12px',
          padding: '1.25rem',
          marginBottom: '1.5rem',
        }}
      >
        <div style={{ color: '#999', textAlign: 'center', padding: '2rem', fontSize: '0.9rem' }}>
          TODO: Display Direct Exchange diagram
          <br />
          <small>Producer → Exchange → [{bindings.length} queues]</small>
        </div>
      </div>

      {/* TODO: Control panel (2 columns):
          Left:
          - Heading "Select routing key"
          - Buttons for each key from directRoutingKeys
          - Input field for custom key (customKey)

          Right:
          - AMQP pseudocode: channel.basicPublish(exchange, routingKey, body)
          - "Publish" and "Clear" buttons
          - Routing log (dark terminal)
      */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
        <div>
          <h3 style={{ marginBottom: '0.75rem', fontSize: '0.95rem' }}>Select routing key</h3>
          <div style={{ color: '#999', fontSize: '0.85rem' }}>
            TODO: buttons for each key + custom key input
          </div>
        </div>
        <div>
          <h3 style={{ marginBottom: '0.75rem', fontSize: '0.95rem' }}>Publish</h3>
          <div style={{ color: '#999', fontSize: '0.85rem', marginBottom: '0.75rem' }}>
            TODO: pseudocode channel.basicPublish(...)
          </div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              onClick={publish}
              style={{
                flex: 1,
                padding: '0.75rem',
                background: '#E65100',
                color: '#fff',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: 700,
              }}
            >
              Опубликовать
            </button>
            <button
              onClick={clearQueues}
              style={{
                padding: '0.75rem 1rem',
                background: '#f5f5f5',
                border: '1px solid #ddd',
                borderRadius: '8px',
                cursor: 'pointer',
              }}
            >
              Очистить
            </button>
          </div>
          {/* TODO: display log as a dark terminal */}
          {log.length > 0 && (
            <div style={{ marginTop: '1rem', padding: '0.75rem', background: '#1a1a2e', borderRadius: '8px', color: '#00ff88', fontFamily: 'monospace', fontSize: '0.75rem' }}>
              TODO: display routing log
            </div>
          )}
        </div>
      </div>

      {/* TODO: Informational block about Direct Exchange principles */}
      <div
        style={{
          padding: '1rem',
          background: '#E3F2FD',
          borderRadius: '8px',
          fontSize: '0.85rem',
          border: '1px solid #90CAF9',
        }}
      >
        <strong>How Direct Exchange works:</strong>
        <ul style={{ margin: '0.5rem 0 0 1.25rem', lineHeight: '1.7' }}>
          <li>TODO: add Direct Exchange principles</li>
        </ul>
      </div>
    </div>
  )
}
