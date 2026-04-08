import { useState } from 'react'
import { useLanguage } from '@courses/platform'

// ============================================
// Task 5.2: Fanout Exchange
// ============================================
//
// Goal: implement a Fanout Exchange simulator.
// Fanout Exchange ignores the routing key and broadcasts the message
// to ALL bound (active: true) queues.
//
// Key features:
// - Routing key is accepted but completely ignored during routing
// - Bindings (queues) can be dynamically added and removed
// - A binding can be temporarily disabled (unbind) without deleting the queue

// TODO: Define the FanoutQueue interface:
//   id: string
//   name: string
//   color: string
//   bgColor: string
//   messages: string[]
//   active: boolean   ← if false, the queue does not receive messages
// interface FanoutQueue { ... }

// TODO: Declare the queueColors array of 3 objects { color, bgColor }
// for cyclically assigning colors to new queues:
//   { color: '#E65100', bgColor: '#FFF3E0' }
//   { color: '#00838F', bgColor: '#E0F7FA' }
//   { color: '#AD1457', bgColor: '#FCE4EC' }
// const queueColors = [...]

export function Task5_2() {
  const { t } = useLanguage()

  // TODO: Declare state variables:
  //   queues        — array of FanoutQueue (3 initial queues)
  //   animating     — boolean (send animation)
  //   routingKey    — string (user input, ignored during routing)
  //   messageCount  — number
  //   log           — string[] (broadcast log)
  //   newQueueName  — string (input field for new queue name)
  const [queues, setQueues] = useState<string[]>([])
  const [animating, setAnimating] = useState(false)
  const [routingKey, setRoutingKey] = useState('user.registered')
  const [messageCount, setMessageCount] = useState(0)
  const [log, setLog] = useState<string[]>([])
  const [newQueueName, setNewQueueName] = useState('')

  // TODO: Initialize the initial queues in useState above:
  //   { id: 'q1', name: 'email-notifications', color: '#1565C0', bgColor: '#E3F2FD', messages: [], active: true }
  //   { id: 'q2', name: 'push-notifications',  color: '#2E7D32', bgColor: '#E8F5E9', messages: [], active: true }
  //   { id: 'q3', name: 'analytics-events',    color: '#6A1B9A', bgColor: '#F3E5F5', messages: [], active: true }

  // TODO: Implement the publish() function:
  //   1. Find activeQueues = queues.filter(q => q.active)
  //   2. Set animating = true
  //   3. After 600ms (setTimeout):
  //      - Add a log string `[ts] msg#N routing_key="${routingKey}"` to messages of each active queue
  //      - Add a log string: `[ts] FANOUT msg#N → K queues: name1, name2, ...`
  //      - Reset animating = false
  const publish = () => {
    // TODO: implement
    console.log('TODO: publish()')
  }

  // TODO: Implement the toggleQueue(id: string) function:
  //   Toggles active on the queue with the given id
  const toggleQueue = (_id: string) => {
    // TODO: implement
  }

  // TODO: Implement the addQueue() function:
  //   1. Check that newQueueName.trim() is not empty
  //   2. Determine color: queueColors[queues.length % queueColors.length]
  //   3. Add a new queue with id = `q${Date.now()}`
  //   4. Clear newQueueName
  const addQueue = () => {
    // TODO: implement
  }

  // TODO: Implement the removeQueue(id: string) function:
  //   Removes the queue from the array
  const removeQueue = (_id: string) => {
    // TODO: implement
  }

  // TODO: Implement the clearAll() function:
  //   Resets messages in all queues and clears the log
  const clearAll = () => {
    // TODO: implement
  }

  return (
    <div style={{ padding: '1rem', fontFamily: 'sans-serif', maxWidth: '960px' }}>
      <h2 style={{ marginBottom: '0.25rem' }}>{t('task.5.2')}</h2>
      <p style={{ color: '#666', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
        Fanout Exchange broadcasts every message to ALL bound queues. Routing key is completely ignored.
      </p>

      {/* TODO: Diagram (Producer → Fanout Exchange → list of queues)
          - Exchange highlighted when animating
          - Each queue with opacity 0.35 if active: false
          - For each queue: "unbind"/"bind" buttons and "✕" (delete)
          - Animated arrow → when animating && q.active
          - Show last message and msg counter
      */}
      <div
        style={{
          background: '#f8f9fa',
          borderRadius: '12px',
          padding: '1.5rem',
          marginBottom: '1.5rem',
        }}
      >
        <div style={{ color: '#999', textAlign: 'center', padding: '2rem', fontSize: '0.9rem' }}>
          TODO: Display Fanout Exchange diagram
          <br />
          <small>Producer → Exchange → [{queues.length} queues]</small>
        </div>
      </div>

      {/* TODO: Control panel (2 columns):
          Left:
          - Routing key field with label "(ignored by Fanout)"
          - "Broadcast" and "Clear" buttons
          - Field + "+ Bind" button for adding a new queue

          Right:
          - Broadcast log (dark terminal) or placeholder "Press Broadcast"
      */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
        <div>
          <h3 style={{ marginBottom: '0.75rem', fontSize: '0.95rem' }}>Controls</h3>
          <div style={{ marginBottom: '0.75rem' }}>
            <label style={{ fontSize: '0.85rem', color: '#666', display: 'block', marginBottom: '4px' }}>
              Routing key (ignored by Fanout):
            </label>
            <input
              value={routingKey}
              onChange={e => setRoutingKey(e.target.value)}
              style={{
                width: '100%',
                padding: '0.5rem',
                border: '1px solid #ddd',
                borderRadius: '6px',
                fontFamily: 'monospace',
                fontSize: '0.85rem',
                boxSizing: 'border-box',
              }}
            />
          </div>
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
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
              Broadcast
            </button>
            <button
              onClick={clearAll}
              style={{
                padding: '0.75rem 1rem',
                background: '#f5f5f5',
                border: '1px solid #ddd',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '0.85rem',
              }}
            >
              Очистить
            </button>
          </div>
          {/* TODO: input field for newQueueName + addQueue button */}
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <input
              value={newQueueName}
              onChange={e => setNewQueueName(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && addQueue()}
              placeholder="new queue..."
              style={{
                flex: 1,
                padding: '0.5rem',
                border: '1px solid #ddd',
                borderRadius: '6px',
                fontFamily: 'monospace',
                fontSize: '0.8rem',
              }}
            />
            <button
              onClick={addQueue}
              style={{
                padding: '0.5rem 0.75rem',
                background: '#2E7D32',
                color: '#fff',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '0.85rem',
              }}
            >
              + Bind
            </button>
          </div>
        </div>

        <div>
          <h3 style={{ marginBottom: '0.75rem', fontSize: '0.95rem' }}>Broadcast log</h3>
          {/* TODO: if log is not empty — dark terminal with entries, otherwise — placeholder */}
          <div
            style={{
              padding: '2rem',
              textAlign: 'center',
              color: '#999',
              border: '2px dashed #ddd',
              borderRadius: '8px',
              fontSize: '0.85rem',
            }}
          >
            Press "Broadcast" to send
          </div>
        </div>
      </div>

      {/* TODO: Block with Fanout Exchange use case scenarios (4 items with icons):
          📧 Notifications to users (email + push + SMS)
          📊 Event broadcasting to multiple analytics systems
          🔄 Cache invalidation across all cluster nodes
          📡 Live data broadcast to multiple consumers
      */}
      <div
        style={{
          padding: '1rem',
          background: '#E8F5E9',
          borderRadius: '8px',
          fontSize: '0.85rem',
          border: '1px solid #A5D6A7',
        }}
      >
        <strong>Fanout Exchange use cases:</strong>
        <div style={{ color: '#999', marginTop: '0.5rem' }}>
          TODO: add 4 use case scenarios with icons
        </div>
      </div>
    </div>
  )
}
