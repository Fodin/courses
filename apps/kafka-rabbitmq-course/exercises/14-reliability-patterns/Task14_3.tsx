import { useState, useRef, useCallback } from 'react'
import { useLanguage } from 'src/hooks'

// ============================================================
// Задание 14.3: Poison Message — карантин
// ============================================================
//
// Goal: implement a Poison Message Detection visualizer.
// Queue of 4 messages (2 normal, 2 poison). Each step increments
// the delivery counter. After maxDeliveries failures → quarantine.
// Normal messages succeed on the first attempt.

// TODO: Define type PoisonMsgStatus.
// Values: 'queue' | 'processing' | 'failed' | 'quarantine' | 'success'
// type PoisonMsgStatus = ...

// TODO: Define interface PoisonMessage.
// Fields: id: string, payload: string, deliveryCount: number,
//         maxDeliveries: number, status: PoisonMsgStatus,
//         isPoison: boolean, error?: string, history: string[]
// interface PoisonMessage { ... }

// TODO: Declare INITIAL_POISON_MESSAGES — array of 4 objects
// (without deliveryCount, status, history — those are set at runtime):
// { id: 'msg-A', payload: '{"type":"order","id":42}', maxDeliveries: 3, isPoison: false }
// { id: 'msg-B', payload: '{"type":"payment","amount":null}', maxDeliveries: 3, isPoison: true, error: 'NullPointerException: amount is null' }
// { id: 'msg-C', payload: '{"type":"email","to":"user@example.com"}', maxDeliveries: 3, isPoison: false }
// { id: 'msg-D', payload: 'INVALID_JSON{{{{', maxDeliveries: 3, isPoison: true, error: 'JsonParseException: unexpected character' }
// const INITIAL_POISON_MESSAGES = [...]

// TODO: Declare statusColor: Record<PoisonMsgStatus, string>
// queue → '#4f86f7', processing → '#ed8936', failed → '#e53e3e',
// quarantine → '#805ad5', success → '#38a169'
// const statusColor: Record<PoisonMsgStatus, string> = { ... }

// TODO: Declare statusLabel: Record<PoisonMsgStatus, string>
// queue → 'Очередь', processing → 'Обработка', failed → 'Ошибка',
// quarantine → 'Карантин', success → 'Успех'
// const statusLabel: Record<PoisonMsgStatus, string> = { ... }

export function Task14_3() {
  const { t } = useLanguage()

  // TODO: Declare state:
  // maxDeliveries: number (slider 1–5, default 3)
  // messages: PoisonMessage[] — initialized from INITIAL_POISON_MESSAGES:
  //   each gets deliveryCount: 0, status: 'queue', history: []
  // selectedMsg: string | null
  // processing: boolean
  // autoStep: boolean
  // autoRef: React.MutableRefObject via useRef(null)
  const [maxDeliveries, setMaxDeliveries] = useState(3)
  const [messages, setMessages] = useState<any[]>([])
  const [selectedMsg, setSelectedMsg] = useState<string | null>(null)
  const [processing, setProcessing] = useState(false)
  const [autoStep, setAutoStep] = useState(false)
  const autoRef = useRef<ReturnType<typeof setInterval> | null>(null)

  // TODO: Implement resetMessages(md?: number):
  // Map INITIAL_POISON_MESSAGES to PoisonMessage[] with deliveryCount: 0,
  // status: 'queue', history: [], maxDeliveries: md ?? maxDeliveries
  // Also call setSelectedMsg(null)
  const resetMessages = (_md?: number) => {
    // TODO: implement
  }

  // TODO: Implement processNext (useCallback):
  // 1. Find index of first message with status 'queue' or 'failed'
  // 2. If not found — return (nothing to process)
  // 3. Set that message: status → 'processing', deliveryCount += 1
  //    push 'Попытка #N — обработка...' to history
  // 4. setProcessing(true)
  // 5. After 700ms determine result:
  //    - find message with status 'processing'
  //    - if msg.isPoison:
  //        if deliveryCount >= maxDeliveries:
  //          status → 'quarantine'
  //          push error line + 'Достигнут лимит (N). → Карантин' to history
  //        else:
  //          status → 'failed'
  //          push error line + 'Возврат в очередь для повтора...' to history
  //    - if !isPoison:
  //        status → 'success'
  //        push 'Попытка #N — успешно обработано' to history
  //    - setProcessing(false)
  const processNext = useCallback(() => {
    // TODO: implement
  }, [])

  // TODO: Implement toggleAuto:
  // If autoStep is true — clear autoRef.current, setAutoStep(false)
  // If autoStep is false — setAutoStep(true), start interval (900ms):
  //   Check if any message has status 'queue' or 'failed'
  //   If not — clear interval, setAutoStep(false), return
  //   Call processNext()
  const toggleAuto = () => {
    // TODO: implement
  }

  // TODO: Compute derived values:
  // quarantined: messages with status 'quarantine'
  // succeeded: messages with status 'success'
  // active: messages with status 'queue' | 'failed' | 'processing'
  // isDone = active.length === 0 && !processing
  const quarantined: any[] = []  // TODO: replace
  const succeeded: any[] = []    // TODO: replace
  const isDone = false             // TODO: replace

  // TODO: Find selectedMsgObj from messages by selectedMsg id
  const selectedMsgObj = selectedMsg ? messages.find((m: any) => m.id === selectedMsg) : null

  return (
    <div className="exercise-container">
      <h2>{t('task.14.3')}</h2>
      <p style={{ color: '#666', marginBottom: '1.5rem' }}>
        Poison Message Detection: сообщения, которые постоянно вызывают ошибку, после N попыток
        автоматически отправляются в карантин. Здоровые сообщения обрабатываются нормально.
      </p>

      {/* TODO: Settings row — slider "Max Deliveries: {maxDeliveries}" (min=1, max=5)
          onChange: setMaxDeliveries(v), resetMessages(v)
          Label: "После {maxDeliveries} неудачных попыток — карантин" */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '1.5rem',
        padding: '1rem',
        background: '#f8f9fa',
        border: '1px solid #e2e8f0',
        borderRadius: '10px',
        marginBottom: '1.5rem',
        flexWrap: 'wrap',
      }}>
        {/* TODO: slider control */}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
        {/* Left column: message list */}
        <div>
          <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#888', marginBottom: '0.5rem', textTransform: 'uppercase' }}>
            Сообщения
          </div>
          {/* TODO: Render messages as clickable cards.
              Each card:
              - onClick: setSelectedMsg(prev === id ? null : id) — toggle selection
              - Border: thick (2px) when selected, semi-transparent when not
              - Color from statusColor[msg.status]
              - Pulsing dot when status === 'processing'
              - msg.id + 'poison' badge when isPoison
              - status badge
              - payload (truncated to 40 chars)
              - Delivery counter: row of small bars
                (i < deliveryCount → filled red/green, else → grey)
                Label: "{deliveryCount}/{maxDeliveries}" */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {/* TODO: message cards */}
          </div>
        </div>

        {/* Right column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {/* TODO: Message inspector (show only when selectedMsgObj is not null):
              - Title: "Инспектор: {id}"
              - Payload (full text, word-break: break-all)
              - Error text in red (if error exists)
              - History: list of entries, colored:
                  [ОШИБКА/error] → red background
                  [успешно] → green background
                  [Карантин] → purple background
                  else → grey background */}
          {selectedMsgObj && (
            <div>
              <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#888', marginBottom: '0.5rem', textTransform: 'uppercase' }}>
                Инспектор: {selectedMsgObj?.id}
              </div>
              {/* TODO: inspector content */}
            </div>
          )}

          {/* TODO: Quarantine zone:
              - Purple border (#805ad5), min height 80px
              - Empty state: "Пусто — сюда попадают poison messages"
              - Each quarantined message: id (bold purple), error text (red), attempt count */}
          <div>
            <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#888', marginBottom: '0.5rem', textTransform: 'uppercase' }}>
              Карантин ({quarantined.length})
            </div>
            <div style={{
              padding: '0.75rem',
              background: '#faf5ff',
              border: '2px solid #805ad5',
              borderRadius: '8px',
              minHeight: '80px',
            }}>
              {quarantined.length === 0
                ? <span style={{ fontSize: '0.82rem', color: '#aaa' }}>Пусто — сюда попадают poison messages</span>
                : null /* TODO: quarantine cards */
              }
            </div>
          </div>

          {/* TODO: Success zone (show only when succeeded.length > 0):
              - Green border, flex wrap of id badges */}
          {succeeded.length > 0 && (
            <div>
              <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#888', marginBottom: '0.5rem', textTransform: 'uppercase' }}>
                Успешно обработано ({succeeded.length})
              </div>
              {/* TODO: success badges */}
            </div>
          )}
        </div>
      </div>

      {/* TODO: Final summary (when isDone):
          Purple background, text: "{succeeded.length} сообщений обработано успешно,
          {quarantined.length} poison messages изолированы в карантин." */}
      {isDone && (
        <div style={{
          marginBottom: '1rem',
          padding: '1rem',
          background: '#faf5ff',
          border: '1px solid #805ad5',
          borderRadius: '10px',
          fontSize: '0.85rem',
          color: '#44337a',
        }}>
          {/* TODO: summary text */}
        </div>
      )}

      {/* Buttons */}
      <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
        {/* TODO: "Следующий шаг" — disabled when processing || isDone, calls processNext */}
        {/* TODO: "Авто" / "Стоп" toggle — disabled when isDone, calls toggleAuto */}
        {/* TODO: "Сбросить" — always enabled, stops auto + calls resetMessages() */}
        <button style={{ padding: '0.6rem 1.25rem', background: '#aaa', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'not-allowed', fontWeight: 600, fontSize: '0.9rem' }}>
          Следующий шаг
        </button>
        <button style={{ padding: '0.6rem 1.25rem', background: '#aaa', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'not-allowed', fontWeight: 600, fontSize: '0.9rem' }}>
          Авто
        </button>
        <button style={{ padding: '0.6rem 1.25rem', background: '#fff', color: '#555', border: '1px solid #ddd', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, fontSize: '0.9rem' }}>
          Сбросить
        </button>
      </div>

      {/* TODO: CSS animation */}
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.3); }
        }
      `}</style>
    </div>
  )
}
