import { useState } from 'react'
import { useLanguage } from '@courses/platform'

// ============================================
// Task 5.3: Topic Exchange
// ============================================
//
// Goal: implement a Topic Exchange simulator with wildcard pattern support.
//
// Topic Exchange rules:
//   * (asterisk) — replaces exactly one word (segment between dots)
//   # (hash)     — replaces zero or more words
//
// Examples:
//   order.*     matches order.created, but NOT order.created.eu
//   order.#     matches order, order.created, order.created.eu
//   *.paid.*    matches order.paid.eu, invoice.paid.us
//   #.error     matches system.error, order.process.error

// TODO: Define the TopicBinding interface:
//   id: string
//   pattern: string   — binding wildcard pattern
//   queue: string     — queue name
//   color: string
//   bgColor: string
// interface TopicBinding { ... }

// TODO: Implement the matchTopicPattern(pattern: string, key: string): boolean function
//   Algorithm: split pattern and key into segments by dot.
//   Iterate simultaneously over pp (pattern segments) and kp (key segments):
//     - pp[pi] === '#': if last segment — return true
//                       else — recursively try pp.slice(pi+1) against kp.slice(j..N)
//     - pp[pi] === '*': pp++, kp++
//     - pp[pi] === kp[ki]: pp++, kp++
//     - otherwise: return false
//   After the loop: skip remaining '#' in the pattern.
//   Return true only if both iterators reached the end.
// function matchTopicPattern(pattern: string, key: string): boolean { ... }

// TODO: Implement the highlightPattern(pattern: string, key: string): React.ReactNode[] function
//   Returns an array of <span> elements for each pattern segment:
//     - Segments separated by dots (displayed in grey)
//     - Wildcard (*,#): color '#E65100' (orange), fontWeight: 700
//     - Matching: color '#2E7D32' (green), fontWeight: 700
//     - Non-matching: color '#C62828' (red)
// function highlightPattern(pattern: string, key: string): React.ReactNode[] { ... }

// TODO: Create the initialTopicBindings array with 5 bindings:
//   { id: 'b1', pattern: 'order.#',         queue: 'all-orders',   color: '#1565C0', bgColor: '#E3F2FD' }
//   { id: 'b2', pattern: 'order.created.*', queue: 'new-orders',   color: '#2E7D32', bgColor: '#E8F5E9' }
//   { id: 'b3', pattern: '*.paid.*',        queue: 'payments',     color: '#6A1B9A', bgColor: '#F3E5F5' }
//   { id: 'b4', pattern: 'user.#',          queue: 'user-events',  color: '#E65100', bgColor: '#FFF3E0' }
//   { id: 'b5', pattern: '#.error',         queue: 'error-handler',color: '#C62828', bgColor: '#FFEBEE' }
// const initialTopicBindings: TopicBinding[] = [...]

// TODO: Create the topicExamples array with 8 routing key examples:
//   'order.created.eu', 'order.paid.us', 'order.cancelled.eu', 'order.error',
//   'user.registered', 'user.login.mobile', 'payment.processed.us', 'system.error'
// const topicExamples: string[] = [...]

export function Task5_3() {
  const { t } = useLanguage()

  // TODO: Declare state variables:
  //   bindings   — array of TopicBinding (initialTopicBindings)
  //   routingKey — string (current key, default 'order.created.eu')
  //   newPattern — string (new pattern input)
  //   newQueue   — string (new queue name input)
  //   log        — array of { key: string, matched: string[], ts: string }
  const [bindings, setBindings] = useState<string[]>([])
  const [routingKey, setRoutingKey] = useState('order.created.eu')
  const [newPattern, setNewPattern] = useState('')
  const [newQueue, setNewQueue] = useState('')
  const [log, setLog] = useState<Array<{ key: string; matched: string[]; ts: string }>>([])

  // TODO: Compute matchedBindings as a derived value:
  //   const matchedBindings = bindings.filter(b => matchTopicPattern(b.pattern, routingKey))
  const matchedBindings: string[] = []

  // TODO: Implement the publish() function:
  //   1. Get timestamp
  //   2. Find matched queues via matchTopicPattern
  //   3. Add an entry to log (at most 10)
  const publish = () => {
    // TODO: implement
    console.log('TODO: publish()')
  }

  // TODO: Implement the addBinding() function:
  //   1. Check that newPattern.trim() and newQueue.trim() are not empty
  //   2. Add a new binding, assigning a color by index (3 options):
  //      { color: '#00838F', bgColor: '#E0F7FA' }
  //      { color: '#AD1457', bgColor: '#FCE4EC' }
  //      { color: '#558B2F', bgColor: '#F1F8E9' }
  //   3. Clear newPattern and newQueue
  const addBinding = () => {
    // TODO: implement
  }

  // TODO: Implement the removeBinding(id: string) function:
  //   Filters bindings, keeping only those where id !== the given one
  const removeBinding = (_id: string) => {
    // TODO: implement
  }

  return (
    <div style={{ padding: '1rem', fontFamily: 'sans-serif', maxWidth: '960px' }}>
      <h2 style={{ marginBottom: '0.25rem' }}>{t('task.5.3')}</h2>
      <p style={{ color: '#666', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
        Topic Exchange routes by patterns.{' '}
        <code style={{ background: '#f5f5f5', padding: '1px 4px' }}>*</code> — exactly one word,{' '}
        <code style={{ background: '#f5f5f5', padding: '1px 4px' }}>#</code> — zero or more words.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
        {/* Left column: routing key input + examples + add binding form */}
        <div>
          <h3 style={{ marginBottom: '0.75rem', fontSize: '0.95rem' }}>Routing Key to send</h3>
          <input
            value={routingKey}
            onChange={e => setRoutingKey(e.target.value)}
            style={{
              width: '100%',
              padding: '0.6rem',
              border: '2px solid #E65100',
              borderRadius: '8px',
              fontFamily: 'monospace',
              fontSize: '1rem',
              boxSizing: 'border-box',
              marginBottom: '0.75rem',
            }}
          />

          {/* TODO: Example buttons from topicExamples
              - On click, set the routingKey
              - Active button (routingKey === ex) has a different style
          */}
          <div style={{ fontSize: '0.8rem', color: '#888', marginBottom: '0.5rem' }}>Examples (click):</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
            <div style={{ color: '#999', fontSize: '0.8rem' }}>TODO: example buttons</div>
          </div>

          {/* TODO: Add new binding form
              - Pattern input field (placeholder "pattern: order.*.eu")
              - Queue name input (placeholder "queue name: eu-orders")
              - "+ Add binding" button
          */}
          <div style={{ marginTop: '1.25rem' }}>
            <h3 style={{ marginBottom: '0.75rem', fontSize: '0.95rem' }}>Add binding</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <input
                value={newPattern}
                onChange={e => setNewPattern(e.target.value)}
                placeholder="pattern: order.*.eu"
                style={{
                  padding: '0.5rem',
                  border: '1px solid #ddd',
                  borderRadius: '6px',
                  fontFamily: 'monospace',
                  fontSize: '0.85rem',
                }}
              />
              <input
                value={newQueue}
                onChange={e => setNewQueue(e.target.value)}
                placeholder="queue name: eu-orders"
                style={{
                  padding: '0.5rem',
                  border: '1px solid #ddd',
                  borderRadius: '6px',
                  fontFamily: 'monospace',
                  fontSize: '0.85rem',
                }}
              />
              <button
                onClick={addBinding}
                style={{
                  padding: '0.5rem',
                  background: '#6A1B9A',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '0.85rem',
                }}
              >
                + Add binding
              </button>
            </div>
          </div>
        </div>

        {/* TODO: Right column: list of bindings
            Heading: "Bindings (N matches out of M)"
            For each binding — a card:
              - Colored border if isMatch (matchTopicPattern)
              - Pattern with highlighting: if match — highlightPattern(b.pattern, routingKey)
                                        otherwise — grey text
              - Queue name → queue
              - ✅ or ❌ icon
              - "✕" button for removeBinding
        */}
        <div>
          <h3 style={{ marginBottom: '0.75rem', fontSize: '0.95rem' }}>
            Bindings ({matchedBindings.length} matches out of {bindings.length})
          </h3>
          <div style={{ color: '#999', fontSize: '0.85rem' }}>
            TODO: display list of bindings with match highlighting
          </div>
        </div>
      </div>

      {/* TODO: "Publish" button + line about current matches
          If matchedBindings.length > 0: "→ Will go to: queue1, queue2"
          Otherwise: "→ No matches — message will be lost"
      */}
      <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
        <button
          onClick={publish}
          style={{
            padding: '0.75rem 2rem',
            background: '#E65100',
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: 700,
            fontSize: '0.95rem',
          }}
        >
          Опубликовать
        </button>
        <div style={{ fontSize: '0.85rem', color: '#999', paddingTop: '0.75rem' }}>
          TODO: show where the message will go
        </div>
      </div>

      {/* TODO: Log (dark terminal), if log is not empty */}
      {log.length > 0 && (
        <div
          style={{
            background: '#1a1a2e',
            color: '#00ff88',
            fontFamily: 'monospace',
            fontSize: '0.75rem',
            padding: '0.75rem',
            borderRadius: '8px',
            maxHeight: '180px',
            overflowY: 'auto',
            marginBottom: '1.5rem',
          }}
        >
          TODO: display log
        </div>
      )}

      {/* TODO: Wildcard symbols reference block (2 columns):
          * (asterisk): description + 3 examples with ✅/❌
          # (hash):     description + 3 examples with ✅/❌
      */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <div style={{ padding: '1rem', background: '#FFF3E0', borderRadius: '8px', border: '1px solid #FFCC80', fontSize: '0.85rem' }}>
          <strong style={{ color: '#E65100' }}>* (asterisk)</strong>
          <ul style={{ margin: '0.5rem 0 0 1.25rem', lineHeight: '1.7', color: '#999' }}>
            <li>TODO: description and examples</li>
          </ul>
        </div>
        <div style={{ padding: '1rem', background: '#E8F5E9', borderRadius: '8px', border: '1px solid #A5D6A7', fontSize: '0.85rem' }}>
          <strong style={{ color: '#2E7D32' }}># (hash)</strong>
          <ul style={{ margin: '0.5rem 0 0 1.25rem', lineHeight: '1.7', color: '#999' }}>
            <li>TODO: description and examples</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
