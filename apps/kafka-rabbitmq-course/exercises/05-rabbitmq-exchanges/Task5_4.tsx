import { useState } from 'react'
import { useLanguage } from '@courses/platform'

// ============================================
// Task 5.4: Headers Exchange and type comparison
// ============================================
//
// Goal: implement a Headers Exchange simulator and an interactive comparison
// of all 4 Exchange types (Direct, Fanout, Topic, Headers).
//
// Headers Exchange routes by AMQP message headers (not by routing key).
// Each binding has a set of expected headers and an x-match mode:
//   x-match: all — ALL binding headers must match the message headers
//   x-match: any — AT LEAST ONE header must match

// TODO: Define the HeadersBinding interface:
//   id: string
//   queue: string
//   headers: Record<string, string>   — expected binding headers
//   xMatch: 'all' | 'any'
//   color: string
//   bgColor: string
// interface HeadersBinding { ... }

// TODO: Define the ExchangeType interface:
//   name: string          — 'Direct' | 'Fanout' | 'Topic' | 'Headers'
//   icon: string          — emoji
//   color: string
//   bgColor: string
//   routing: string       — routing algorithm description
//   speed: string         — performance
//   complexity: string    — configuration complexity
//   useCases: string[]    — use cases
//   when: string          — when to choose this type
//   example: string       — usage example
// interface ExchangeType { ... }

// TODO: Create the headersBindings array with 4 fixed bindings:
//   {
//     id: 'h1', queue: 'eu-mobile-orders',
//     headers: { region: 'eu', platform: 'mobile' }, xMatch: 'all',
//     color: '#1565C0', bgColor: '#E3F2FD'
//   }
//   {
//     id: 'h2', queue: 'premium-orders',
//     headers: { tier: 'premium' }, xMatch: 'any',
//     color: '#6A1B9A', bgColor: '#F3E5F5'
//   }
//   {
//     id: 'h3', queue: 'mobile-or-tablet',
//     headers: { platform: 'mobile', platform2: 'tablet' }, xMatch: 'any',
//     color: '#E65100', bgColor: '#FFF3E0'
//   }
//   {
//     id: 'h4', queue: 'us-all-platforms',
//     headers: { region: 'us' }, xMatch: 'all',
//     color: '#2E7D32', bgColor: '#E8F5E9'
//   }
// const headersBindings: HeadersBinding[] = [...]

// TODO: Create the exchangeTypes array with data for all 4 types:
//   Direct:  icon '🎯', routing 'Exact routing key match', speed 'High', complexity 'Simple'
//   Fanout:  icon '📢', routing 'Routing key ignored — broadcasts to all', speed 'Very high', complexity 'Simplest'
//   Topic:   icon '🌿', routing 'Wildcard patterns (* and #)', speed 'High', complexity 'Medium'
//   Headers: icon '🏷️', routing 'AMQP header match (x-match: all/any)', speed 'Low', complexity 'Complex'
// const exchangeTypes: ExchangeType[] = [...]

export function Task5_4() {
  const { t } = useLanguage()

  // TODO: Declare state variables:
  //   messageHeaders — Record<string, string>: initial headers { region: 'eu', platform: 'mobile', tier: 'standard' }
  //   headerInput    — { key: string, value: string } — fields for adding a header
  //   view           — 'headers' | 'comparison' (tab switching)
  //   activeExchange — string (active type in comparison mode, default 'Direct')
  //   log            — string[] (publication log)
  const [messageHeaders, setMessageHeaders] = useState<Record<string, string>>({
    region: 'eu',
    platform: 'mobile',
    tier: 'standard',
  })
  const [headerInput, setHeaderInput] = useState({ key: '', value: '' })
  const [view, setView] = useState<'headers' | 'comparison'>('headers')
  const [activeExchange, setActiveExchange] = useState('Direct')
  const [log, setLog] = useState<string[]>([])

  // TODO: Implement the matchHeaders(binding: HeadersBinding): boolean function
  //   For each binding header check: messageHeaders[k] === v
  //   If xMatch === 'all': checks.every(Boolean)
  //   If xMatch === 'any': checks.some(Boolean)
  const matchHeaders = (_binding: unknown): boolean => {
    // TODO: implement
    return false
  }

  // TODO: Compute matchedBindings as a derived value:
  //   const matchedBindings = headersBindings.filter(matchHeaders)
  const matchedBindings: unknown[] = []

  // TODO: Implement the publish() function:
  //   1. Get timestamp
  //   2. Build a header string: `key1=val1, key2=val2`
  //   3. Write to log: `[ts] HEADERS {headers} → queue1, queue2` or `→ UNROUTABLE`
  const publish = () => {
    // TODO: implement
    console.log('TODO: publish()')
  }

  // TODO: Implement the addHeader() function:
  //   1. Check that headerInput.key.trim() is not empty
  //   2. Add { [key]: value } to messageHeaders
  //   3. Clear headerInput
  const addHeader = () => {
    // TODO: implement
  }

  // TODO: Implement the removeHeader(key: string) function:
  //   Create a copy of messageHeaders without the given key and set it
  const removeHeader = (_key: string) => {
    // TODO: implement
  }

  return (
    <div style={{ padding: '1rem', fontFamily: 'sans-serif', maxWidth: '960px' }}>
      <h2 style={{ marginBottom: '0.25rem' }}>{t('task.5.4')}</h2>
      <p style={{ color: '#666', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
        Headers Exchange routes by AMQP headers. Then — comparison of all 4 Exchange types.
      </p>

      {/* TODO: Tab switcher ("🏷️ Headers Exchange" | "📊 Type comparison")
          Active tab: border and background '#6A1B9A', color '#fff'
          Inactive tab: border '#ddd', background '#fff'
      */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
        {(['headers', 'comparison'] as const).map(v => (
          <button
            key={v}
            onClick={() => setView(v)}
            style={{
              padding: '0.5rem 1.25rem',
              borderRadius: '8px',
              border: `2px solid ${view === v ? '#6A1B9A' : '#ddd'}`,
              background: view === v ? '#6A1B9A' : '#fff',
              color: view === v ? '#fff' : '#333',
              cursor: 'pointer',
              fontWeight: view === v ? 700 : 400,
              fontSize: '0.9rem',
            }}
          >
            {v === 'headers' ? '🏷️ Headers Exchange' : '📊 Type comparison'}
          </button>
        ))}
      </div>

      {view === 'headers' ? (
        /* ---- Headers Exchange tab ---- */
        <div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>

            {/* Left: header editor + publish button */}
            <div>
              <h3 style={{ marginBottom: '0.75rem', fontSize: '0.95rem' }}>Message headers</h3>

              {/* TODO: Current headers block:
                  - Header "AMQP message headers" on grey background
                  - For each [key, value] pair: show key (purple) + value (green) + ✕ button
                  - removeHeader on ✕ click
              */}
              <div style={{ border: '1px solid #ddd', borderRadius: '8px', overflow: 'hidden', marginBottom: '0.75rem' }}>
                <div style={{ background: '#f5f5f5', padding: '0.5rem 0.75rem', fontSize: '0.75rem', color: '#888', fontFamily: 'monospace' }}>
                  AMQP message headers
                </div>
                {Object.entries(messageHeaders).map(([k, v]) => (
                  <div
                    key={k}
                    style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.5rem 0.75rem', borderTop: '1px solid #f0f0f0' }}
                  >
                    <div style={{ fontFamily: 'monospace', fontSize: '0.85rem' }}>
                      <span style={{ color: '#6A1B9A', fontWeight: 700 }}>{k}</span>
                      <span style={{ color: '#888' }}>: </span>
                      <span style={{ color: '#2E7D32' }}>"{v}"</span>
                    </div>
                    <button
                      onClick={() => removeHeader(k)}
                      style={{ padding: '2px 6px', border: '1px solid #ddd', borderRadius: '4px', background: '#fff', cursor: 'pointer', fontSize: '0.7rem', color: '#C62828' }}
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>

              {/* TODO: Add header form: key field + value field + "+" button */}
              <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <input
                  value={headerInput.key}
                  onChange={e => setHeaderInput(prev => ({ ...prev, key: e.target.value }))}
                  placeholder="key"
                  style={{ flex: 1, padding: '0.4rem', border: '1px solid #ddd', borderRadius: '6px', fontFamily: 'monospace', fontSize: '0.8rem' }}
                />
                <input
                  value={headerInput.value}
                  onChange={e => setHeaderInput(prev => ({ ...prev, value: e.target.value }))}
                  placeholder="value"
                  style={{ flex: 1, padding: '0.4rem', border: '1px solid #ddd', borderRadius: '6px', fontFamily: 'monospace', fontSize: '0.8rem' }}
                />
                <button
                  onClick={addHeader}
                  style={{ padding: '0.4rem 0.75rem', background: '#6A1B9A', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '0.8rem' }}
                >
                  +
                </button>
              </div>

              <button
                onClick={publish}
                style={{ width: '100%', padding: '0.75rem', background: '#E65100', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 700, fontSize: '0.9rem' }}
              >
                Опубликовать с этими заголовками
              </button>
            </div>

            {/* TODO: Right: list of bindings with detailed header checks
                Heading: "Bindings (N matches)"
                For each binding — a card:
                  - Highlighted (colored border + bgColor) if matchHeaders(b)
                  - Queue name (colored)
                  - Badge "x-match: all" or "x-match: any" (blue/orange)
                  - ✅ or ❌ icon
                  - Detailed header check: each binding header displayed
                    as a badge with color: green if messageHeaders[k] === v, red if not
                    Shows expected value and actual (got: actual)
            */}
            <div>
              <h3 style={{ marginBottom: '0.75rem', fontSize: '0.95rem' }}>
                Bindings ({matchedBindings.length} matches)
              </h3>
              <div style={{ color: '#999', fontSize: '0.85rem' }}>
                TODO: display bindings with detailed header checks
              </div>
            </div>
          </div>

          {/* TODO: Publication log (dark terminal), if log is not empty */}
          {log.length > 0 && (
            <div style={{ background: '#1a1a2e', color: '#00ff88', fontFamily: 'monospace', fontSize: '0.75rem', padding: '0.75rem', borderRadius: '8px', maxHeight: '130px', overflowY: 'auto' }}>
              {log.map((line, i) => <div key={i}>{line}</div>)}
            </div>
          )}
        </div>
      ) : (
        /* ---- Type Comparison tab ---- */
        <div>
          {/* TODO: Switcher buttons for 4 Exchange types
              For each type from exchangeTypes:
                - Active button: border and bgColor of the type
                - Shows icon + name
          */}
          <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
            <div style={{ color: '#999', fontSize: '0.85rem' }}>
              TODO: Exchange type selection buttons (Direct, Fanout, Topic, Headers)
            </div>
          </div>

          {/* TODO: Active Exchange type card
              Shows 2 columns:
              Left: routing algorithm, performance, complexity, example
              Right: list of use cases, when to choose
          */}
          <div style={{ border: '2px solid #ddd', borderRadius: '12px', padding: '1.25rem', background: '#f9f9f9', marginBottom: '1.5rem' }}>
            <div style={{ color: '#999', fontSize: '0.85rem' }}>
              TODO: card with characteristics of the active Exchange type ({activeExchange})
            </div>
          </div>

          {/* TODO: Comparison table of all 4 types
              Rows: Exchange type | routing | speed | complexity
              Active row highlighted
          */}
          <div style={{ border: '1px solid #ddd', borderRadius: '8px', overflow: 'hidden', fontSize: '0.85rem' }}>
            <div style={{ background: '#f5f5f5', padding: '0.5rem 0.75rem', fontWeight: 700, display: 'grid', gridTemplateColumns: '100px 1fr 100px 100px', gap: '0.5rem' }}>
              <div>Type</div>
              <div>Routing</div>
              <div>Speed</div>
              <div>Complexity</div>
            </div>
            <div style={{ color: '#999', padding: '0.75rem', fontSize: '0.85rem' }}>
              TODO: table rows for each type from exchangeTypes
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
