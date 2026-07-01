import { useState, useRef, useCallback } from 'react'
import { useLanguage } from '../../hooks'

// ============================================
// Task 14.1: Retry with Exponential Backoff
// ============================================

interface RetryAttempt {
  attempt: number
  status: 'pending' | 'running' | 'failed' | 'success' | 'dlq'
  delay: number
  timestamp: number
}

export function Task14_1_Solution() {
  const { t } = useLanguage()
  const [maxRetries, setMaxRetries] = useState(4)
  const [baseDelay, setBaseDelay] = useState(1)
  const [multiplier, setMultiplier] = useState(2)
  const [attempts, setAttempts] = useState<RetryAttempt[]>([])
  const [running, setRunning] = useState(false)
  const [successOnAttempt, setSuccessOnAttempt] = useState<number | 'never'>('never')
  const [dlq, setDlq] = useState(false)
  const [successDelivered, setSuccessDelivered] = useState(false)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const calcDelay = (attempt: number) => {
    // exponential: baseDelay * multiplier^(attempt-1), seconds
    return baseDelay * Math.pow(multiplier, attempt - 1)
  }

  const totalTime = () => {
    let total = 0
    for (let i = 1; i <= maxRetries; i++) total += calcDelay(i)
    return total
  }

  const handleStart = useCallback(() => {
    if (running) return
    setRunning(true)
    setDlq(false)
    setSuccessDelivered(false)

    const initialAttempts: RetryAttempt[] = Array.from({ length: maxRetries + 1 }, (_, i) => ({
      attempt: i + 1,
      status: i === 0 ? 'running' : 'pending',
      delay: i === 0 ? 0 : calcDelay(i + 1),
      timestamp: 0,
    }))
    setAttempts(initialAttempts)

    let currentAttempt = 0
    let elapsed = 0
    const speed = 600 // ms per simulated second

    const runAttempt = (idx: number) => {
      // Mark as running
      setAttempts(prev => prev.map((a, i) => i === idx ? { ...a, status: 'running' } : a))

      const resolveDelay = speed
      timerRef.current = setTimeout(() => {
        const willSucceed = successOnAttempt !== 'never' && idx + 1 >= Number(successOnAttempt)
        if (willSucceed) {
          setAttempts(prev => prev.map((a, i) => i === idx ? { ...a, status: 'success', timestamp: elapsed } : a))
          setSuccessDelivered(true)
          setRunning(false)
        } else {
          setAttempts(prev => prev.map((a, i) => i === idx ? { ...a, status: 'failed', timestamp: elapsed } : a))
          const nextIdx = idx + 1
          if (nextIdx > maxRetries) {
            setDlq(true)
            setRunning(false)
          } else {
            const nextDelay = calcDelay(nextIdx + 1)
            elapsed += nextDelay
            timerRef.current = setTimeout(() => runAttempt(nextIdx), nextDelay * speed)
          }
        }
      }, resolveDelay)
    }

    runAttempt(currentAttempt)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running, maxRetries, baseDelay, multiplier, successOnAttempt])

  const handleReset = () => {
    if (timerRef.current) clearTimeout(timerRef.current)
    setAttempts([])
    setRunning(false)
    setDlq(false)
    setSuccessDelivered(false)
  }

  const statusColor: Record<string, string> = {
    pending: '#aaa',
    running: '#4f86f7',
    failed: '#e53e3e',
    success: '#38a169',
    dlq: '#ed8936',
  }

  const statusLabel: Record<string, string> = {
    pending: 'Ожидает',
    running: 'Отправка...',
    failed: 'Ошибка',
    success: 'Успех',
    dlq: 'DLQ',
  }

  const maxBarDelay = attempts.length > 0 ? Math.max(...attempts.map(a => a.delay), 1) : 1

  return (
    <div className="exercise-container">
      <h2>{t('task.14.1')}</h2>
      <p style={{ color: '#666', marginBottom: '1.5rem' }}>
        Симуляция стратегии Exponential Backoff. Сообщение отправляется, при ошибке делается
        повтор с возрастающей задержкой. После исчерпания попыток — сообщение в DLQ.
      </p>

      {/* Settings */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
        gap: '1rem',
        marginBottom: '1.5rem',
        padding: '1rem',
        background: '#f8f9fa',
        borderRadius: '10px',
        border: '1px solid #e2e8f0',
      }}>
        <label style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
          <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#555' }}>Max Retries: {maxRetries}</span>
          <input type="range" min={1} max={6} value={maxRetries}
            onChange={e => { handleReset(); setMaxRetries(Number(e.target.value)) }}
            disabled={running} style={{ cursor: running ? 'not-allowed' : 'pointer' }} />
        </label>
        <label style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
          <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#555' }}>Base Delay: {baseDelay}s</span>
          <input type="range" min={1} max={5} value={baseDelay}
            onChange={e => { handleReset(); setBaseDelay(Number(e.target.value)) }}
            disabled={running} style={{ cursor: running ? 'not-allowed' : 'pointer' }} />
        </label>
        <label style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
          <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#555' }}>Multiplier: x{multiplier}</span>
          <input type="range" min={1} max={4} value={multiplier}
            onChange={e => { handleReset(); setMultiplier(Number(e.target.value)) }}
            disabled={running} style={{ cursor: running ? 'not-allowed' : 'pointer' }} />
        </label>
        <label style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
          <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#555' }}>
            Успех на попытке: {successOnAttempt === 'never' ? 'никогда' : `#${successOnAttempt}`}
          </span>
          <select
            value={String(successOnAttempt)}
            onChange={e => { handleReset(); setSuccessOnAttempt(e.target.value === 'never' ? 'never' : Number(e.target.value)) }}
            disabled={running}
            style={{ padding: '0.3rem', borderRadius: '4px', border: '1px solid #ddd', fontSize: '0.85rem' }}
          >
            <option value="never">Никогда (→ DLQ)</option>
            {Array.from({ length: maxRetries + 1 }, (_, i) => (
              <option key={i + 1} value={i + 1}>Попытка {i + 1}</option>
            ))}
          </select>
        </label>
      </div>

      {/* Timeline preview */}
      <div style={{
        padding: '1rem',
        background: '#fff',
        border: '1px solid #e2e8f0',
        borderRadius: '10px',
        marginBottom: '1.5rem',
      }}>
        <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#888', marginBottom: '0.75rem', textTransform: 'uppercase' }}>
          Timeline задержек (до запуска)
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {Array.from({ length: maxRetries + 1 }, (_, i) => {
            const delay = i === 0 ? 0 : calcDelay(i + 1)
            const maxD = calcDelay(maxRetries + 1) || 1
            const width = i === 0 ? 4 : Math.round((delay / maxD) * 100)
            return (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <span style={{ fontSize: '0.78rem', color: '#666', minWidth: '70px' }}>
                  Попытка {i + 1}
                </span>
                <div style={{ flex: 1, height: '18px', background: '#f0f0f0', borderRadius: '4px', overflow: 'hidden', position: 'relative' }}>
                  {i === 0 ? (
                    <div style={{ width: '4px', height: '100%', background: '#4f86f7', borderRadius: '4px' }} />
                  ) : (
                    <div style={{
                      width: `${Math.max(width, 4)}%`,
                      height: '100%',
                      background: `hsl(${220 - i * 25}, 70%, 55%)`,
                      borderRadius: '4px',
                      transition: 'width 0.3s ease',
                    }} />
                  )}
                </div>
                <span style={{ fontSize: '0.78rem', color: '#555', minWidth: '50px', textAlign: 'right' }}>
                  {i === 0 ? 'немедленно' : `+${delay}s`}
                </span>
              </div>
            )
          })}
        </div>
        <div style={{ marginTop: '0.75rem', fontSize: '0.78rem', color: '#888' }}>
          Суммарное время всех задержек: <strong>{totalTime()}s</strong>
        </div>
      </div>

      {/* Simulation */}
      {attempts.length > 0 && (
        <div style={{ marginBottom: '1.5rem' }}>
          <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#888', marginBottom: '0.75rem', textTransform: 'uppercase' }}>
            Ход симуляции
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {attempts.map((a) => (
              <div key={a.attempt} style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.6rem 0.75rem',
                borderRadius: '8px',
                background: a.status === 'pending' ? '#fafafa' : `${statusColor[a.status]}12`,
                border: `1px solid ${a.status === 'pending' ? '#e2e8f0' : statusColor[a.status]}`,
                transition: 'all 0.3s ease',
                opacity: a.status === 'pending' ? 0.6 : 1,
              }}>
                <div style={{
                  width: '10px',
                  height: '10px',
                  borderRadius: '50%',
                  background: statusColor[a.status],
                  animation: a.status === 'running' ? 'pulse 0.8s infinite' : 'none',
                }} />
                <span style={{ fontWeight: 600, fontSize: '0.85rem', minWidth: '80px' }}>
                  Попытка {a.attempt}
                </span>
                {a.attempt > 1 && (
                  <span style={{ fontSize: '0.78rem', color: '#888', minWidth: '90px' }}>
                    задержка: {calcDelay(a.attempt)}s
                  </span>
                )}
                {a.attempt === 1 && (
                  <span style={{ fontSize: '0.78rem', color: '#888', minWidth: '90px' }}>
                    сразу
                  </span>
                )}
                <div style={{ flex: 1 }} />
                <span style={{
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  color: statusColor[a.status],
                  padding: '0.2rem 0.5rem',
                  borderRadius: '4px',
                  background: `${statusColor[a.status]}18`,
                }}>
                  {statusLabel[a.status]}
                </span>
                {a.attempt > 1 && a.status !== 'pending' && (
                  <div style={{
                    height: '6px',
                    flex: `0 0 ${Math.min((calcDelay(a.attempt) / maxBarDelay) * 120, 120)}px`,
                    background: `${statusColor[a.status]}40`,
                    borderRadius: '3px',
                  }} />
                )}
              </div>
            ))}
          </div>

          {dlq && (
            <div style={{
              marginTop: '1rem',
              padding: '1rem',
              background: '#fffaf0',
              border: '2px solid #ed8936',
              borderRadius: '10px',
            }}>
              <div style={{ fontWeight: 700, color: '#c05621', marginBottom: '0.25rem' }}>
                Dead Letter Queue (DLQ)
              </div>
              <div style={{ fontSize: '0.85rem', color: '#744210' }}>
                Сообщение исчерпало все {maxRetries + 1} попыток и перемещено в DLQ для ручного
                анализа. Суммарное время ожидания: {totalTime()}s.
              </div>
            </div>
          )}

          {successDelivered && (
            <div style={{
              marginTop: '1rem',
              padding: '1rem',
              background: '#f0fff4',
              border: '2px solid #38a169',
              borderRadius: '10px',
            }}>
              <div style={{ fontWeight: 700, color: '#276749', marginBottom: '0.25rem' }}>
                Сообщение доставлено успешно
              </div>
              <div style={{ fontSize: '0.85rem', color: '#276749' }}>
                Retry с Exponential Backoff сработал — временная ошибка не помешала доставке.
              </div>
            </div>
          )}
        </div>
      )}

      <div style={{ display: 'flex', gap: '0.75rem' }}>
        <button
          onClick={handleStart}
          disabled={running}
          style={{
            padding: '0.6rem 1.5rem',
            background: running ? '#aaa' : '#4f86f7',
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            cursor: running ? 'not-allowed' : 'pointer',
            fontWeight: 600,
            fontSize: '0.9rem',
          }}
        >
          {running ? 'Выполняется...' : 'Запустить симуляцию'}
        </button>
        <button
          onClick={handleReset}
          style={{
            padding: '0.6rem 1.25rem',
            background: '#fff',
            color: '#555',
            border: '1px solid #ddd',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: 600,
            fontSize: '0.9rem',
          }}
        >
          Сбросить
        </button>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.3); }
        }
      `}</style>
    </div>
  )
}

// ============================================
// Task 14.2: Idempotency — deduplication
// ============================================

interface IncomingMessage {
  id: string
  payload: string
  isDuplicate: boolean
}

const INCOMING_MESSAGES: IncomingMessage[] = [
  { id: 'msg-001', payload: 'Order #1001 created', isDuplicate: false },
  { id: 'msg-002', payload: 'Payment $99.00', isDuplicate: false },
  { id: 'msg-001', payload: 'Order #1001 created', isDuplicate: true },
  { id: 'msg-003', payload: 'Shipment dispatched', isDuplicate: false },
  { id: 'msg-002', payload: 'Payment $99.00', isDuplicate: true },
  { id: 'msg-004', payload: 'Invoice generated', isDuplicate: false },
  { id: 'msg-003', payload: 'Shipment dispatched', isDuplicate: true },
  { id: 'msg-005', payload: 'Email notification', isDuplicate: false },
]

type MsgStatus = 'queued' | 'checking' | 'duplicate' | 'processed'

interface TrackedMessage extends IncomingMessage {
  status: MsgStatus
  index: number
}

export function Task14_2_Solution() {
  const { t } = useLanguage()
  const [deduplicationEnabled, setDeduplicationEnabled] = useState(true)
  const [trackedMessages, setTrackedMessages] = useState<TrackedMessage[]>([])
  const [seenIds, setSeenIds] = useState<Set<string>>(new Set())
  const [processedIds, setProcessedIds] = useState<string[]>([])
  const [duplicatesBlocked, setDuplicatesBlocked] = useState(0)
  const [processedCount, setProcessedCount] = useState(0)
  const [running, setRunning] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)

  const handleReset = () => {
    setTrackedMessages([])
    setSeenIds(new Set())
    setProcessedIds([])
    setDuplicatesBlocked(0)
    setProcessedCount(0)
    setRunning(false)
    setCurrentIndex(0)
  }

  const handleStep = () => {
    if (currentIndex >= INCOMING_MESSAGES.length) return

    const msg = INCOMING_MESSAGES[currentIndex]
    const newTracked: TrackedMessage = { ...msg, status: 'checking', index: currentIndex }

    setTrackedMessages(prev => [...prev, newTracked])
    setRunning(true)

    setTimeout(() => {
      const isAlreadySeen = seenIds.has(msg.id)

      if (deduplicationEnabled && isAlreadySeen) {
        setTrackedMessages(prev => prev.map((m, i) =>
          i === currentIndex ? { ...m, status: 'duplicate' } : m
        ))
        setDuplicatesBlocked(prev => prev + 1)
      } else {
        setTrackedMessages(prev => prev.map((m, i) =>
          i === currentIndex ? { ...m, status: 'processed' } : m
        ))
        setSeenIds(prev => new Set([...prev, msg.id]))
        setProcessedIds(prev => [...prev, msg.id])
        setProcessedCount(prev => prev + 1)
      }

      setCurrentIndex(prev => prev + 1)
      setRunning(false)
    }, 600)
  }

  const handleRunAll = () => {
    if (running) return
    let idx = currentIndex
    const seen = new Set(seenIds)
    const newMessages: TrackedMessage[] = [...trackedMessages]
    let blocked = duplicatesBlocked
    let processed = processedCount
    const processed_ids = [...processedIds]

    const step = () => {
      if (idx >= INCOMING_MESSAGES.length) { setRunning(false); return }
      const msg = INCOMING_MESSAGES[idx]
      const tracked: TrackedMessage = { ...msg, status: 'checking', index: idx }
      newMessages.push(tracked)
      setTrackedMessages([...newMessages])
      setRunning(true)

      setTimeout(() => {
        const isAlreadySeen = seen.has(msg.id)
        if (deduplicationEnabled && isAlreadySeen) {
          newMessages[idx] = { ...tracked, status: 'duplicate' }
          blocked++
          setDuplicatesBlocked(blocked)
        } else {
          newMessages[idx] = { ...tracked, status: 'processed' }
          seen.add(msg.id)
          processed_ids.push(msg.id)
          processed++
          setSeenIds(new Set(seen))
          setProcessedIds([...processed_ids])
          setProcessedCount(processed)
        }
        setTrackedMessages([...newMessages])
        idx++
        setCurrentIndex(idx)
        step()
      }, 350)
    }
    step()
  }

  const statusColor: Record<MsgStatus, string> = {
    queued: '#aaa',
    checking: '#4f86f7',
    duplicate: '#e53e3e',
    processed: '#38a169',
  }

  const statusLabel: Record<MsgStatus, string> = {
    queued: 'Ожидает',
    checking: 'Проверка...',
    duplicate: 'Дубликат',
    processed: 'Обработано',
  }

  const isDone = currentIndex >= INCOMING_MESSAGES.length

  return (
    <div className="exercise-container">
      <h2>{t('task.14.2')}</h2>
      <p style={{ color: '#666', marginBottom: '1.5rem' }}>
        Idempotency Layer: система дедупликации сообщений по Message ID. Сравните поведение
        с включённым и выключенным фильтром дедупликации.
      </p>

      {/* Toggle */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
        padding: '1rem',
        background: deduplicationEnabled ? '#f0fff4' : '#fff5f5',
        border: `2px solid ${deduplicationEnabled ? '#38a169' : '#e53e3e'}`,
        borderRadius: '10px',
        marginBottom: '1.5rem',
        transition: 'all 0.3s ease',
      }}>
        <button
          onClick={() => { handleReset(); setDeduplicationEnabled(prev => !prev) }}
          style={{
            padding: '0.5rem 1rem',
            background: deduplicationEnabled ? '#38a169' : '#e53e3e',
            color: '#fff',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontWeight: 700,
            fontSize: '0.85rem',
            transition: 'background 0.3s ease',
          }}
        >
          {deduplicationEnabled ? 'Dedup ON' : 'Dedup OFF'}
        </button>
        <div>
          <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>
            {deduplicationEnabled ? 'Фильтр дедупликации включён' : 'Фильтр дедупликации ВЫКЛЮЧЕН'}
          </div>
          <div style={{ fontSize: '0.8rem', color: '#666' }}>
            {deduplicationEnabled
              ? 'Дубликаты будут обнаружены и отброшены'
              : 'Все сообщения пройдут в обработку, включая дубли'}
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
        {/* Входящий поток */}
        <div>
          <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#888', marginBottom: '0.5rem', textTransform: 'uppercase' }}>
            Входящий поток ({INCOMING_MESSAGES.length} сообщений)
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            {trackedMessages.map((msg, i) => (
              <div key={i} style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.5rem 0.75rem',
                borderRadius: '8px',
                background: `${statusColor[msg.status]}10`,
                border: `1px solid ${statusColor[msg.status]}`,
                transition: 'all 0.3s ease',
              }}>
                <div style={{
                  width: '8px', height: '8px', borderRadius: '50%',
                  background: statusColor[msg.status],
                  animation: msg.status === 'checking' ? 'pulse 0.8s infinite' : 'none',
                }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '0.78rem', fontWeight: 700, fontFamily: 'monospace', color: '#333' }}>
                    {msg.id}
                    {msg.isDuplicate && (
                      <span style={{
                        marginLeft: '0.4rem', fontSize: '0.65rem', color: '#e53e3e',
                        background: '#fff5f5', padding: '0.1rem 0.3rem', borderRadius: '3px', border: '1px solid #e53e3e',
                      }}>
                        дубль
                      </span>
                    )}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: '#666' }}>{msg.payload}</div>
                </div>
                <span style={{
                  fontSize: '0.72rem', fontWeight: 600, color: statusColor[msg.status],
                  minWidth: '80px', textAlign: 'right',
                }}>
                  {statusLabel[msg.status]}
                </span>
              </div>
            ))}
            {trackedMessages.length === 0 && (
              <div style={{ color: '#aaa', fontSize: '0.85rem', padding: '0.5rem' }}>
                Нажмите "Шаг" или "Запустить всё"
              </div>
            )}
          </div>
        </div>

        {/* Dedup filter + обработанные */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {/* Idempotency Store */}
          <div>
            <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#888', marginBottom: '0.5rem', textTransform: 'uppercase' }}>
              Idempotency Store (seen IDs)
            </div>
            <div style={{
              padding: '0.75rem',
              background: '#f8f9fa',
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
              minHeight: '60px',
              fontFamily: 'monospace',
              fontSize: '0.78rem',
            }}>
              {processedIds.length === 0
                ? <span style={{ color: '#aaa' }}>пусто</span>
                : processedIds.map((id, i) => (
                  <span key={i} style={{
                    display: 'inline-block', margin: '0.15rem',
                    padding: '0.15rem 0.4rem',
                    background: '#38a16920',
                    border: '1px solid #38a169',
                    borderRadius: '4px',
                    color: '#276749',
                  }}>
                    {id}
                  </span>
                ))
              }
            </div>
          </div>

          {/* Stats */}
          <div style={{
            padding: '1rem',
            background: '#f8f9fa',
            border: '1px solid #e2e8f0',
            borderRadius: '8px',
          }}>
            <div style={{ fontWeight: 600, marginBottom: '0.75rem', fontSize: '0.85rem' }}>Статистика</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '0.85rem', color: '#555' }}>Обработано уникальных:</span>
                <span style={{ fontWeight: 700, color: '#38a169' }}>{processedCount}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '0.85rem', color: '#555' }}>Заблокировано дублей:</span>
                <span style={{ fontWeight: 700, color: deduplicationEnabled ? '#e53e3e' : '#aaa' }}>
                  {deduplicationEnabled ? duplicatesBlocked : `+${INCOMING_MESSAGES.filter(m => m.isDuplicate).length} пройдут!`}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '0.85rem', color: '#555' }}>Всего входящих:</span>
                <span style={{ fontWeight: 700 }}>{trackedMessages.length} / {INCOMING_MESSAGES.length}</span>
              </div>
            </div>
          </div>

          {isDone && !deduplicationEnabled && (
            <div style={{
              padding: '0.75rem',
              background: '#fff5f5',
              border: '1px solid #e53e3e',
              borderRadius: '8px',
              fontSize: '0.82rem',
              color: '#c53030',
            }}>
              Без дедупликации {INCOMING_MESSAGES.filter(m => m.isDuplicate).length} дублированных
              сообщений обработаны повторно. Возможны двойные списания, двойные уведомления и т.д.
            </div>
          )}

          {isDone && deduplicationEnabled && (
            <div style={{
              padding: '0.75rem',
              background: '#f0fff4',
              border: '1px solid #38a169',
              borderRadius: '8px',
              fontSize: '0.82rem',
              color: '#276749',
            }}>
              Idempotency layer отфильтровал все {duplicatesBlocked} дублей.
              Каждое уникальное сообщение обработано ровно один раз.
            </div>
          )}
        </div>
      </div>

      <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
        <button
          onClick={handleStep}
          disabled={running || isDone}
          style={{
            padding: '0.6rem 1.25rem',
            background: running || isDone ? '#aaa' : '#4f86f7',
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            cursor: running || isDone ? 'not-allowed' : 'pointer',
            fontWeight: 600,
            fontSize: '0.9rem',
          }}
        >
          Шаг (следующее сообщение)
        </button>
        <button
          onClick={handleRunAll}
          disabled={running || isDone}
          style={{
            padding: '0.6rem 1.25rem',
            background: running || isDone ? '#aaa' : '#805ad5',
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            cursor: running || isDone ? 'not-allowed' : 'pointer',
            fontWeight: 600,
            fontSize: '0.9rem',
          }}
        >
          Запустить всё
        </button>
        <button
          onClick={handleReset}
          style={{
            padding: '0.6rem 1.25rem',
            background: '#fff',
            color: '#555',
            border: '1px solid #ddd',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: 600,
            fontSize: '0.9rem',
          }}
        >
          Сбросить
        </button>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.3); }
        }
      `}</style>
    </div>
  )
}

// ============================================
// Task 14.3: Poison Message Detection & Quarantine
// ============================================

type PoisonMsgStatus = 'queue' | 'processing' | 'failed' | 'quarantine' | 'success'

interface PoisonMessage {
  id: string
  payload: string
  deliveryCount: number
  maxDeliveries: number
  status: PoisonMsgStatus
  isPoison: boolean
  error?: string
  history: string[]
}

const INITIAL_POISON_MESSAGES: Omit<PoisonMessage, 'deliveryCount' | 'status' | 'history'>[] = [
  { id: 'msg-A', payload: '{"type":"order","id":42}', maxDeliveries: 3, isPoison: false },
  { id: 'msg-B', payload: '{"type":"payment","amount":null}', maxDeliveries: 3, isPoison: true, error: 'NullPointerException: amount is null' },
  { id: 'msg-C', payload: '{"type":"email","to":"user@example.com"}', maxDeliveries: 3, isPoison: false },
  { id: 'msg-D', payload: 'INVALID_JSON{{{{', maxDeliveries: 3, isPoison: true, error: 'JsonParseException: unexpected character' },
]

export function Task14_3_Solution() {
  const { t } = useLanguage()
  const [maxDeliveries, setMaxDeliveries] = useState(3)
  const [messages, setMessages] = useState<PoisonMessage[]>(
    INITIAL_POISON_MESSAGES.map(m => ({
      ...m,
      maxDeliveries: 3,
      deliveryCount: 0,
      status: 'queue' as PoisonMsgStatus,
      history: [],
    }))
  )
  const [selectedMsg, setSelectedMsg] = useState<string | null>(null)
  const [processing, setProcessing] = useState(false)
  const [autoStep, setAutoStep] = useState(false)
  const autoRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const resetMessages = (md: number = maxDeliveries) => {
    setMessages(INITIAL_POISON_MESSAGES.map(m => ({
      ...m,
      maxDeliveries: md,
      deliveryCount: 0,
      status: 'queue' as PoisonMsgStatus,
      history: [],
    })))
    setSelectedMsg(null)
  }

  const processNext = useCallback(() => {
    setMessages(prev => {
      const queuedIdx = prev.findIndex(m => m.status === 'queue' || m.status === 'failed')
      if (queuedIdx === -1) return prev

      const updated = [...prev]
      const msg = { ...updated[queuedIdx] }

      if (msg.status === 'queue' || msg.status === 'failed') {
        msg.status = 'processing'
        msg.deliveryCount += 1
        msg.history = [...msg.history, `Попытка #${msg.deliveryCount} — обработка...`]
        updated[queuedIdx] = msg
      }
      return updated
    })

    setProcessing(true)
    setTimeout(() => {
      setMessages(prev => {
        const processingIdx = prev.findIndex(m => m.status === 'processing')
        if (processingIdx === -1) { setProcessing(false); return prev }

        const updated = [...prev]
        const msg = { ...updated[processingIdx] }

        if (msg.isPoison) {
          if (msg.deliveryCount >= msg.maxDeliveries) {
            msg.status = 'quarantine'
            msg.history = [...msg.history, `Попытка #${msg.deliveryCount} — ОШИБКА: ${msg.error}`, `Достигнут лимит (${msg.maxDeliveries}). → Карантин`]
          } else {
            msg.status = 'failed'
            msg.history = [...msg.history, `Попытка #${msg.deliveryCount} — ОШИБКА: ${msg.error}`, `Возврат в очередь для повтора...`]
          }
        } else {
          msg.status = 'success'
          msg.history = [...msg.history, `Попытка #${msg.deliveryCount} — успешно обработано`]
        }

        updated[processingIdx] = msg
        setProcessing(false)
        return updated
      })
    }, 700)
  }, [])

  const toggleAuto = () => {
    if (autoStep) {
      if (autoRef.current) clearInterval(autoRef.current)
      setAutoStep(false)
    } else {
      setAutoStep(true)
      autoRef.current = setInterval(() => {
        setMessages(prev => {
          const hasActive = prev.some(m => m.status === 'queue' || m.status === 'failed')
          if (!hasActive) {
            if (autoRef.current) clearInterval(autoRef.current)
            setAutoStep(false)
          }
          return prev
        })
        processNext()
      }, 900)
    }
  }

  const statusColor: Record<PoisonMsgStatus, string> = {
    queue: '#4f86f7',
    processing: '#ed8936',
    failed: '#e53e3e',
    quarantine: '#805ad5',
    success: '#38a169',
  }

  const statusLabel: Record<PoisonMsgStatus, string> = {
    queue: 'Очередь',
    processing: 'Обработка',
    failed: 'Ошибка',
    quarantine: 'Карантин',
    success: 'Успех',
  }

  const quarantined = messages.filter(m => m.status === 'quarantine')
  const succeeded = messages.filter(m => m.status === 'success')
  const active = messages.filter(m => m.status === 'queue' || m.status === 'failed' || m.status === 'processing')
  const isDone = active.length === 0 && !processing

  const selectedMsgObj = selectedMsg ? messages.find(m => m.id === selectedMsg) : null

  return (
    <div className="exercise-container">
      <h2>{t('task.14.3')}</h2>
      <p style={{ color: '#666', marginBottom: '1.5rem' }}>
        Poison Message Detection: сообщения, которые постоянно вызывают ошибку, после N попыток
        автоматически отправляются в карантин. Здоровые сообщения обрабатываются нормально.
      </p>

      {/* Settings */}
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
        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#555' }}>
            Max Deliveries: {maxDeliveries}
          </span>
          <input
            type="range" min={1} max={5} value={maxDeliveries}
            onChange={e => { const v = Number(e.target.value); setMaxDeliveries(v); resetMessages(v) }}
            style={{ cursor: 'pointer' }}
          />
        </label>
        <div style={{ fontSize: '0.8rem', color: '#888' }}>
          После {maxDeliveries} неудачных попыток — карантин
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
        {/* Message list */}
        <div>
          <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#888', marginBottom: '0.5rem', textTransform: 'uppercase' }}>
            Сообщения
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {messages.map(msg => (
              <div
                key={msg.id}
                onClick={() => setSelectedMsg(prev => prev === msg.id ? null : msg.id)}
                style={{
                  padding: '0.75rem',
                  borderRadius: '10px',
                  border: `2px solid ${selectedMsg === msg.id ? statusColor[msg.status] : `${statusColor[msg.status]}60`}`,
                  background: `${statusColor[msg.status]}08`,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.3rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <div style={{
                      width: '10px', height: '10px', borderRadius: '50%',
                      background: statusColor[msg.status],
                      animation: msg.status === 'processing' ? 'pulse 0.8s infinite' : 'none',
                    }} />
                    <span style={{ fontWeight: 700, fontSize: '0.85rem' }}>{msg.id}</span>
                    {msg.isPoison && (
                      <span style={{
                        fontSize: '0.65rem', color: '#c05621',
                        background: '#fffaf0', padding: '0.1rem 0.3rem',
                        borderRadius: '3px', border: '1px solid #ed8936',
                      }}>
                        poison
                      </span>
                    )}
                  </div>
                  <span style={{
                    fontSize: '0.72rem', fontWeight: 600,
                    color: statusColor[msg.status],
                    padding: '0.15rem 0.4rem',
                    borderRadius: '4px',
                    background: `${statusColor[msg.status]}18`,
                  }}>
                    {statusLabel[msg.status]}
                  </span>
                </div>
                <div style={{ fontSize: '0.72rem', fontFamily: 'monospace', color: '#555', marginBottom: '0.3rem' }}>
                  {msg.payload.length > 40 ? msg.payload.slice(0, 40) + '...' : msg.payload}
                </div>
                {/* Delivery counter */}
                <div style={{ display: 'flex', gap: '0.2rem', alignItems: 'center' }}>
                  {Array.from({ length: msg.maxDeliveries }, (_, i) => (
                    <div key={i} style={{
                      width: '16px', height: '6px',
                      borderRadius: '3px',
                      background: i < msg.deliveryCount
                        ? (msg.isPoison ? '#e53e3e' : '#38a169')
                        : '#e2e8f0',
                      transition: 'background 0.3s ease',
                    }} />
                  ))}
                  <span style={{ fontSize: '0.7rem', color: '#888', marginLeft: '0.3rem' }}>
                    {msg.deliveryCount}/{msg.maxDeliveries}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right panel: detail + quarantine */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {/* Message inspector */}
          {selectedMsgObj && (
            <div>
              <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#888', marginBottom: '0.5rem', textTransform: 'uppercase' }}>
                Инспектор: {selectedMsgObj.id}
              </div>
              <div style={{
                padding: '0.75rem',
                background: '#fafafa',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                fontSize: '0.78rem',
              }}>
                <div style={{ marginBottom: '0.4rem' }}>
                  <strong>Payload:</strong>
                  <div style={{ fontFamily: 'monospace', color: '#555', marginTop: '0.2rem', wordBreak: 'break-all' }}>
                    {selectedMsgObj.payload}
                  </div>
                </div>
                {selectedMsgObj.error && (
                  <div style={{ marginBottom: '0.4rem', color: '#c53030' }}>
                    <strong>Ошибка:</strong> {selectedMsgObj.error}
                  </div>
                )}
                <div>
                  <strong>История попыток:</strong>
                  <div style={{ marginTop: '0.3rem', display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                    {selectedMsgObj.history.length === 0
                      ? <span style={{ color: '#aaa' }}>Нет попыток</span>
                      : selectedMsgObj.history.map((h, i) => (
                        <div key={i} style={{
                          padding: '0.2rem 0.4rem',
                          background: h.includes('ОШИБКА') ? '#fff5f5'
                            : h.includes('успешно') ? '#f0fff4'
                            : h.includes('Карантин') ? '#faf5ff'
                            : '#f8f9fa',
                          borderRadius: '4px',
                          color: h.includes('ОШИБКА') ? '#c53030'
                            : h.includes('успешно') ? '#276749'
                            : h.includes('Карантин') ? '#553c9a'
                            : '#555',
                        }}>
                          {h}
                        </div>
                      ))
                    }
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Quarantine zone */}
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
                : quarantined.map(m => (
                  <div key={m.id} style={{
                    padding: '0.4rem 0.6rem',
                    marginBottom: '0.3rem',
                    background: '#fff',
                    border: '1px solid #b794f4',
                    borderRadius: '6px',
                    fontSize: '0.78rem',
                  }}>
                    <div style={{ fontWeight: 700, color: '#553c9a' }}>{m.id}</div>
                    <div style={{ color: '#e53e3e', fontFamily: 'monospace' }}>{m.error}</div>
                    <div style={{ color: '#888' }}>Попыток: {m.deliveryCount}</div>
                  </div>
                ))
              }
            </div>
          </div>

          {/* Success zone */}
          {succeeded.length > 0 && (
            <div>
              <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#888', marginBottom: '0.5rem', textTransform: 'uppercase' }}>
                Успешно обработано ({succeeded.length})
              </div>
              <div style={{
                padding: '0.6rem',
                background: '#f0fff4',
                border: '1px solid #68d391',
                borderRadius: '8px',
                display: 'flex',
                flexWrap: 'wrap',
                gap: '0.3rem',
              }}>
                {succeeded.map(m => (
                  <span key={m.id} style={{
                    padding: '0.2rem 0.5rem',
                    background: '#38a16920',
                    border: '1px solid #38a169',
                    borderRadius: '4px',
                    fontSize: '0.78rem',
                    color: '#276749',
                    fontWeight: 600,
                  }}>
                    {m.id}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

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
          <strong>Итог:</strong> {succeeded.length} сообщений обработано успешно,{' '}
          {quarantined.length} poison messages изолированы в карантин.
          Они доступны для ручного анализа без влияния на основную очередь.
        </div>
      )}

      <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
        <button
          onClick={processNext}
          disabled={processing || isDone}
          style={{
            padding: '0.6rem 1.25rem',
            background: processing || isDone ? '#aaa' : '#4f86f7',
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            cursor: processing || isDone ? 'not-allowed' : 'pointer',
            fontWeight: 600,
            fontSize: '0.9rem',
          }}
        >
          Следующий шаг
        </button>
        <button
          onClick={toggleAuto}
          disabled={isDone}
          style={{
            padding: '0.6rem 1.25rem',
            background: autoStep ? '#e53e3e' : isDone ? '#aaa' : '#38a169',
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            cursor: isDone ? 'not-allowed' : 'pointer',
            fontWeight: 600,
            fontSize: '0.9rem',
          }}
        >
          {autoStep ? 'Стоп' : 'Авто-режим'}
        </button>
        <button
          onClick={() => { if (autoRef.current) clearInterval(autoRef.current); setAutoStep(false); resetMessages() }}
          style={{
            padding: '0.6rem 1.25rem',
            background: '#fff',
            color: '#555',
            border: '1px solid #ddd',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: 600,
            fontSize: '0.9rem',
          }}
        >
          Сбросить
        </button>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.3); }
        }
      `}</style>
    </div>
  )
}
