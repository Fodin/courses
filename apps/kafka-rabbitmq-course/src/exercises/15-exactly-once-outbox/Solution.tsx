import { useState, useRef } from 'react'
import { useLanguage } from '../../hooks'

// ============================================
// Задание 15.1: Проблема двойной записи
// ============================================

type WriteStep =
  | 'idle'
  | 'db-writing'
  | 'db-success'
  | 'broker-writing'
  | 'broker-success'
  | 'broker-fail'
  | 'done-ok'
  | 'done-fail'

interface LogEntry {
  id: number
  text: string
  type: 'info' | 'success' | 'error' | 'warn'
}

export function Task15_1_Solution() {
  const { t } = useLanguage()
  const [step, setStep] = useState<WriteStep>('idle')
  const [logs, setLogs] = useState<LogEntry[]>([])
  const [dbRecords, setDbRecords] = useState<{ id: string; status: string }[]>([])
  const [brokerMessages, setBrokerMessages] = useState<string[]>([])
  const [failMode, setFailMode] = useState(false)
  const logIdRef = useRef(0)

  const addLog = (text: string, type: LogEntry['type'] = 'info') => {
    setLogs(prev => [...prev, { id: ++logIdRef.current, text, type }])
  }

  const delay = (ms: number) => new Promise(res => setTimeout(res, ms))

  const runScenario = async () => {
    setStep('db-writing')
    setLogs([])
    const orderId = `order-${Date.now().toString().slice(-4)}`

    addLog(`[Service] Получен запрос: создать заказ ${orderId}`, 'info')
    addLog(`[DB] Начало записи в orders...`, 'info')
    await delay(700)

    setStep('db-success')
    setDbRecords(prev => [...prev, { id: orderId, status: 'created' }])
    addLog(`[DB] Запись ${orderId} сохранена успешно`, 'success')
    await delay(500)

    if (failMode) {
      setStep('broker-fail')
      addLog(`[Broker] Попытка опубликовать OrderCreated...`, 'info')
      await delay(600)
      addLog(`[Broker] ОШИБКА: Connection timeout! Сообщение не отправлено`, 'error')
      addLog(`[!] Данные рассинхронизированы: в DB есть ${orderId}, в broker — нет`, 'error')
      addLog(`[!] Downstream сервисы (email, inventory) не узнают о заказе`, 'warn')
      setStep('done-fail')
    } else {
      setStep('broker-writing')
      addLog(`[Broker] Публикация события OrderCreated...`, 'info')
      await delay(600)
      setStep('broker-success')
      setBrokerMessages(prev => [...prev, `OrderCreated: ${orderId}`])
      addLog(`[Broker] Событие опубликовано успешно`, 'success')
      addLog(`[!] Всё хорошо, но атомарности нет — это два разных операции`, 'warn')
      setStep('done-ok')
    }
  }

  const reset = () => {
    setStep('idle')
    setLogs([])
    setDbRecords([])
    setBrokerMessages([])
  }

  const logColors: Record<LogEntry['type'], string> = {
    info: '#555',
    success: '#276749',
    error: '#c53030',
    warn: '#744210',
  }

  const logBg: Record<LogEntry['type'], string> = {
    info: 'transparent',
    success: '#f0fff4',
    error: '#fff5f5',
    warn: '#fffaf0',
  }

  const stepColors: Record<WriteStep, string> = {
    idle: '#e2e8f0',
    'db-writing': '#ebf8ff',
    'db-success': '#f0fff4',
    'broker-writing': '#ebf8ff',
    'broker-success': '#f0fff4',
    'broker-fail': '#fff5f5',
    'done-ok': '#f0fff4',
    'done-fail': '#fff5f5',
  }

  return (
    <div className="exercise-container">
      <h2>{t('task.15.1')}</h2>
      <p style={{ color: '#666', marginBottom: '1.5rem' }}>
        Dual Write Problem — сервис делает две независимые записи: в базу данных и в брокер.
        Включи режим ошибки, чтобы увидеть, что происходит при сбое брокера.
      </p>

      {/* Схема */}
      <div style={{
        background: stepColors[step],
        border: '1px solid #e2e8f0',
        borderRadius: '12px',
        padding: '1.25rem',
        marginBottom: '1.25rem',
        transition: 'background 0.4s ease',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          {/* Сервис */}
          <div style={{
            padding: '0.75rem 1rem',
            background: '#4f86f7',
            borderRadius: '8px',
            color: '#fff',
            fontWeight: 700,
            fontSize: '0.85rem',
            minWidth: '100px',
            textAlign: 'center',
          }}>
            Order Service
          </div>

          <div style={{ fontSize: '1.2rem', color: '#888' }}>&#8594;</div>

          {/* Две стрелки: вверх к DB, вниз к Broker */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {/* DB */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{ fontSize: '0.75rem', color: '#888' }}>Write 1</div>
              <div style={{ fontSize: '1rem', color: '#888' }}>&#8594;</div>
              <div style={{
                padding: '0.5rem 0.9rem',
                background: step === 'db-success' || step === 'broker-writing' || step === 'broker-success' || step === 'done-ok' || step === 'broker-fail' || step === 'done-fail'
                  ? '#48bb78'
                  : step === 'db-writing' ? '#90cdf4' : '#e2e8f0',
                borderRadius: '8px',
                color: '#fff',
                fontWeight: 600,
                fontSize: '0.8rem',
                transition: 'background 0.4s ease',
                minWidth: '80px',
                textAlign: 'center',
              }}>
                PostgreSQL
              </div>
              {(step === 'db-success' || step === 'done-ok' || step === 'done-fail' || step === 'broker-writing' || step === 'broker-success' || step === 'broker-fail') && (
                <div style={{ color: '#38a169', fontSize: '1rem' }}>&#10003;</div>
              )}
            </div>

            {/* Broker */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{ fontSize: '0.75rem', color: '#888' }}>Write 2</div>
              <div style={{ fontSize: '1rem', color: '#888' }}>&#8594;</div>
              <div style={{
                padding: '0.5rem 0.9rem',
                background: step === 'broker-success' || step === 'done-ok'
                  ? '#48bb78'
                  : step === 'broker-fail' || step === 'done-fail' ? '#fc8181'
                  : step === 'broker-writing' ? '#90cdf4'
                  : '#e2e8f0',
                borderRadius: '8px',
                color: step === 'idle' ? '#888' : '#fff',
                fontWeight: 600,
                fontSize: '0.8rem',
                transition: 'background 0.4s ease',
                minWidth: '80px',
                textAlign: 'center',
              }}>
                Kafka
              </div>
              {step === 'done-ok' && <div style={{ color: '#38a169', fontSize: '1rem' }}>&#10003;</div>}
              {(step === 'broker-fail' || step === 'done-fail') && (
                <div style={{ color: '#e53e3e', fontSize: '1rem' }}>&#10007;</div>
              )}
            </div>
          </div>
        </div>

        {step === 'done-fail' && (
          <div style={{
            marginTop: '1rem',
            padding: '0.75rem 1rem',
            background: '#fff5f5',
            borderRadius: '8px',
            border: '1px solid #fc8181',
            color: '#c53030',
            fontSize: '0.85rem',
            fontWeight: 600,
          }}>
            Data Inconsistency: DB содержит запись, но broker не знает о событии!
          </div>
        )}
      </div>

      {/* Контролы */}
      <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap', marginBottom: '1rem' }}>
        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.9rem' }}>
          <input
            type="checkbox"
            checked={failMode}
            onChange={e => setFailMode(e.target.checked)}
            style={{ width: '16px', height: '16px' }}
          />
          Симулировать сбой брокера
        </label>

        <button
          onClick={runScenario}
          disabled={step !== 'idle' && step !== 'done-ok' && step !== 'done-fail'}
          style={{
            padding: '0.5rem 1.25rem',
            background: '#4f86f7',
            color: '#fff',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontWeight: 600,
            opacity: step !== 'idle' && step !== 'done-ok' && step !== 'done-fail' ? 0.5 : 1,
          }}
        >
          Создать заказ
        </button>

        <button
          onClick={reset}
          style={{
            padding: '0.5rem 1.25rem',
            background: '#718096',
            color: '#fff',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontWeight: 600,
          }}
        >
          Сбросить
        </button>
      </div>

      {/* Состояние хранилищ */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: '200px' }}>
          <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#4f86f7', marginBottom: '0.5rem' }}>
            PostgreSQL (orders)
          </div>
          <div style={{
            border: '1px solid #bee3f8',
            borderRadius: '8px',
            minHeight: '60px',
            padding: '0.5rem',
            background: '#ebf8ff',
            fontSize: '0.8rem',
            fontFamily: 'monospace',
          }}>
            {dbRecords.length === 0
              ? <span style={{ color: '#a0aec0' }}>нет записей</span>
              : dbRecords.map(r => (
                <div key={r.id} style={{ color: '#276749' }}>{r.id}: {r.status}</div>
              ))
            }
          </div>
        </div>

        <div style={{ flex: 1, minWidth: '200px' }}>
          <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#805ad5', marginBottom: '0.5rem' }}>
            Kafka (order-events)
          </div>
          <div style={{
            border: '1px solid #e9d8fd',
            borderRadius: '8px',
            minHeight: '60px',
            padding: '0.5rem',
            background: '#faf5ff',
            fontSize: '0.8rem',
            fontFamily: 'monospace',
          }}>
            {brokerMessages.length === 0
              ? <span style={{ color: '#a0aec0' }}>нет сообщений</span>
              : brokerMessages.map((m, i) => (
                <div key={i} style={{ color: '#553c9a' }}>{m}</div>
              ))
            }
          </div>
        </div>
      </div>

      {/* Лог */}
      {logs.length > 0 && (
        <div style={{
          background: '#1a202c',
          borderRadius: '8px',
          padding: '0.75rem 1rem',
          fontSize: '0.8rem',
          fontFamily: 'monospace',
          maxHeight: '200px',
          overflowY: 'auto',
        }}>
          {logs.map(entry => (
            <div
              key={entry.id}
              style={{
                color: logColors[entry.type],
                background: entry.type !== 'info' ? logBg[entry.type] : 'transparent',
                padding: '0.1rem 0.3rem',
                borderRadius: '3px',
                marginBottom: '0.15rem',
              }}
            >
              {entry.text}
            </div>
          ))}
        </div>
      )}

      {step === 'done-fail' && (
        <div style={{
          marginTop: '1rem',
          padding: '1rem',
          background: '#fffaf0',
          borderRadius: '8px',
          border: '1px solid #f6ad55',
          fontSize: '0.85rem',
        }}>
          <strong>Проблема:</strong> без атомарности между DB и broker мы получаем data inconsistency.
          Email-сервис не отправит подтверждение, inventory не обновится.
          Решение — Transactional Outbox (задание 15.2).
        </div>
      )}
    </div>
  )
}

// ============================================
// Задание 15.2: Transactional Outbox
// ============================================

type OutboxStep =
  | 'idle'
  | 'tx-start'
  | 'db-write'
  | 'outbox-write'
  | 'tx-commit'
  | 'relay-poll'
  | 'relay-publish'
  | 'relay-delete'
  | 'done'

interface OutboxRow {
  id: string
  event: string
  status: 'pending' | 'published'
}

export function Task15_2_Solution() {
  const { t } = useLanguage()
  const [step, setStep] = useState<OutboxStep>('idle')
  const [logs, setLogs] = useState<LogEntry[]>([])
  const [dbOrders, setDbOrders] = useState<{ id: string }[]>([])
  const [outboxRows, setOutboxRows] = useState<OutboxRow[]>([])
  const [brokerEvents, setBrokerEvents] = useState<string[]>([])
  const logIdRef = useRef(0)

  const addLog = (text: string, type: LogEntry['type'] = 'info') => {
    setLogs(prev => [...prev, { id: ++logIdRef.current, text, type }])
  }

  const delay = (ms: number) => new Promise(res => setTimeout(res, ms))

  const runOutbox = async () => {
    const orderId = `order-${Date.now().toString().slice(-4)}`
    const outboxId = `evt-${Date.now().toString().slice(-4)}`
    setLogs([])

    setStep('tx-start')
    addLog(`[Service] BEGIN TRANSACTION`, 'info')
    await delay(400)

    setStep('db-write')
    addLog(`[DB] INSERT INTO orders (id) VALUES ('${orderId}')`, 'info')
    await delay(500)
    setDbOrders(prev => [...prev, { id: orderId }])
    addLog(`[DB] Запись создана`, 'success')

    setStep('outbox-write')
    await delay(400)
    addLog(`[DB] INSERT INTO outbox (id, event, status) VALUES ('${outboxId}', 'OrderCreated:${orderId}', 'pending')`, 'info')
    setOutboxRows(prev => [...prev, { id: outboxId, event: `OrderCreated:${orderId}`, status: 'pending' }])
    addLog(`[DB] Outbox запись создана в той же транзакции`, 'success')

    setStep('tx-commit')
    await delay(400)
    addLog(`[DB] COMMIT — обе записи атомарно сохранены`, 'success')

    setStep('relay-poll')
    await delay(600)
    addLog(`[Relay] SELECT * FROM outbox WHERE status='pending'`, 'info')
    addLog(`[Relay] Найдено событий: 1`, 'success')

    setStep('relay-publish')
    await delay(500)
    addLog(`[Relay] Публикация OrderCreated:${orderId} в Kafka...`, 'info')
    setBrokerEvents(prev => [...prev, `OrderCreated:${orderId}`])
    addLog(`[Kafka] Событие опубликовано`, 'success')

    setStep('relay-delete')
    await delay(400)
    addLog(`[Relay] UPDATE outbox SET status='published' WHERE id='${outboxId}'`, 'info')
    setOutboxRows(prev => prev.map(r => r.id === outboxId ? { ...r, status: 'published' } : r))
    addLog(`[Relay] Outbox помечен как опубликованный`, 'success')

    setStep('done')
  }

  const reset = () => {
    setStep('idle')
    setLogs([])
    setDbOrders([])
    setOutboxRows([])
    setBrokerEvents([])
  }

  // Pipeline шаги
  const pipelineSteps: { id: OutboxStep; label: string; color: string }[] = [
    { id: 'tx-start', label: 'BEGIN TX', color: '#4f86f7' },
    { id: 'db-write', label: 'Write orders', color: '#38a169' },
    { id: 'outbox-write', label: 'Write outbox', color: '#38a169' },
    { id: 'tx-commit', label: 'COMMIT', color: '#4f86f7' },
    { id: 'relay-poll', label: 'Relay poll', color: '#ed8936' },
    { id: 'relay-publish', label: 'Publish event', color: '#805ad5' },
    { id: 'relay-delete', label: 'Mark sent', color: '#38a169' },
  ]

  const stepsOrder: OutboxStep[] = [
    'idle', 'tx-start', 'db-write', 'outbox-write', 'tx-commit',
    'relay-poll', 'relay-publish', 'relay-delete', 'done',
  ]

  const currentIdx = stepsOrder.indexOf(step)

  return (
    <div className="exercise-container">
      <h2>{t('task.15.2')}</h2>
      <p style={{ color: '#666', marginBottom: '1.5rem' }}>
        Transactional Outbox решает проблему двойной записи: событие сохраняется в той же DB-транзакции
        что и основные данные. Отдельный Relay-процесс читает outbox и публикует в брокер.
      </p>

      {/* Pipeline */}
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#888', marginBottom: '0.75rem', textTransform: 'uppercase' }}>
          Этапы выполнения
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
          {pipelineSteps.map((ps, idx) => {
            const psIdx = stepsOrder.indexOf(ps.id)
            const isDone = currentIdx > psIdx
            const isActive = currentIdx === psIdx
            return (
              <div
                key={ps.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.3rem',
                }}
              >
                <div style={{
                  padding: '0.35rem 0.7rem',
                  borderRadius: '20px',
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  background: isActive ? ps.color : isDone ? `${ps.color}30` : '#f0f0f0',
                  color: isActive ? '#fff' : isDone ? ps.color : '#aaa',
                  border: `1px solid ${isActive || isDone ? ps.color : '#e2e8f0'}`,
                  transition: 'all 0.3s ease',
                }}>
                  {isDone && !isActive && <span style={{ marginRight: '0.25rem' }}>&#10003;</span>}
                  {ps.label}
                </div>
                {idx < pipelineSteps.length - 1 && (
                  <div style={{ color: '#ccc', fontSize: '0.8rem' }}>&#8594;</div>
                )}
              </div>
            )
          })}
        </div>

        {/* Граница транзакции */}
        <div style={{ marginTop: '0.5rem', fontSize: '0.78rem', color: '#888' }}>
          <span style={{ background: '#ebf8ff', border: '1px solid #bee3f8', borderRadius: '4px', padding: '0.1rem 0.4rem', color: '#4f86f7' }}>
            DB Transaction
          </span>
          {' '}охватывает шаги 1-4.{' '}
          <span style={{ background: '#fff5f0', border: '1px solid #fbd38d', borderRadius: '4px', padding: '0.1rem 0.4rem', color: '#ed8936' }}>
            Relay Process
          </span>
          {' '}работает независимо (шаги 5-7).
        </div>
      </div>

      {/* Хранилища */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: '180px' }}>
          <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#38a169', marginBottom: '0.4rem' }}>
            orders (основная таблица)
          </div>
          <div style={{
            border: '1px solid #c6f6d5',
            borderRadius: '8px',
            minHeight: '50px',
            padding: '0.5rem',
            background: '#f0fff4',
            fontSize: '0.78rem',
            fontFamily: 'monospace',
          }}>
            {dbOrders.length === 0
              ? <span style={{ color: '#a0aec0' }}>пусто</span>
              : dbOrders.map(r => <div key={r.id} style={{ color: '#276749' }}>{r.id}</div>)
            }
          </div>
        </div>

        <div style={{ flex: 1, minWidth: '180px' }}>
          <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#ed8936', marginBottom: '0.4rem' }}>
            outbox (вспомогательная таблица)
          </div>
          <div style={{
            border: '1px solid #fbd38d',
            borderRadius: '8px',
            minHeight: '50px',
            padding: '0.5rem',
            background: '#fffaf0',
            fontSize: '0.78rem',
            fontFamily: 'monospace',
          }}>
            {outboxRows.length === 0
              ? <span style={{ color: '#a0aec0' }}>пусто</span>
              : outboxRows.map(r => (
                <div key={r.id} style={{ color: r.status === 'published' ? '#276749' : '#c05621' }}>
                  {r.event} [{r.status}]
                </div>
              ))
            }
          </div>
        </div>

        <div style={{ flex: 1, minWidth: '180px' }}>
          <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#805ad5', marginBottom: '0.4rem' }}>
            Kafka (order-events)
          </div>
          <div style={{
            border: '1px solid #e9d8fd',
            borderRadius: '8px',
            minHeight: '50px',
            padding: '0.5rem',
            background: '#faf5ff',
            fontSize: '0.78rem',
            fontFamily: 'monospace',
          }}>
            {brokerEvents.length === 0
              ? <span style={{ color: '#a0aec0' }}>нет событий</span>
              : brokerEvents.map((e, i) => (
                <div key={i} style={{ color: '#553c9a' }}>{e}</div>
              ))
            }
          </div>
        </div>
      </div>

      {/* Кнопки */}
      <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1rem' }}>
        <button
          onClick={runOutbox}
          disabled={step !== 'idle' && step !== 'done'}
          style={{
            padding: '0.5rem 1.25rem',
            background: '#38a169',
            color: '#fff',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontWeight: 600,
            opacity: step !== 'idle' && step !== 'done' ? 0.5 : 1,
          }}
        >
          Создать заказ (Outbox)
        </button>
        <button
          onClick={reset}
          style={{
            padding: '0.5rem 1.25rem',
            background: '#718096',
            color: '#fff',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontWeight: 600,
          }}
        >
          Сбросить
        </button>
      </div>

      {/* Лог */}
      {logs.length > 0 && (
        <div style={{
          background: '#1a202c',
          borderRadius: '8px',
          padding: '0.75rem 1rem',
          fontSize: '0.78rem',
          fontFamily: 'monospace',
          maxHeight: '220px',
          overflowY: 'auto',
        }}>
          {logs.map(entry => (
            <div key={entry.id} style={{
              color: entry.type === 'error' ? '#fc8181' : entry.type === 'success' ? '#68d391' : entry.type === 'warn' ? '#f6ad55' : '#a0aec0',
              marginBottom: '0.15rem',
            }}>
              {entry.text}
            </div>
          ))}
        </div>
      )}

      {step === 'done' && (
        <div style={{
          marginTop: '1rem',
          padding: '1rem',
          background: '#f0fff4',
          borderRadius: '8px',
          border: '1px solid #68d391',
          fontSize: '0.85rem',
        }}>
          <strong style={{ color: '#276749' }}>Гарантия доставки:</strong> даже если Relay упадёт между шагами 5 и 7,
          при перезапуске он снова прочитает pending-записи и опубликует их. Событие будет доставлено at-least-once.
        </div>
      )}
    </div>
  )
}

// ============================================
// Задание 15.3: CDC (Change Data Capture)
// ============================================

type CdcOperation = 'INSERT' | 'UPDATE' | 'DELETE'

interface CdcRow {
  id: number
  name: string
  amount: number
}

interface CdcEvent {
  id: number
  op: CdcOperation
  before: CdcRow | null
  after: CdcRow | null
  ts: string
  topic: string
}

interface CdcWalEntry {
  lsn: string
  op: CdcOperation
  table: string
  payload: string
}

let rowIdCounter = 1
let eventIdCounter = 1

const opColor = (op: CdcOperation) => {
  if (op === 'INSERT') return '#38a169'
  if (op === 'UPDATE') return '#d69e2e'
  return '#e53e3e'
}

const opBg = (op: CdcOperation) => {
  if (op === 'INSERT') return '#f0fff4'
  if (op === 'UPDATE') return '#fffff0'
  return '#fff5f5'
}

export function Task15_3_Solution() {
  const { t } = useLanguage()
  const [rows, setRows] = useState<CdcRow[]>([
    { id: rowIdCounter++, name: 'Order #1', amount: 100 },
    { id: rowIdCounter++, name: 'Order #2', amount: 250 },
  ])
  const [walLog, setWalLog] = useState<CdcWalEntry[]>([])
  const [cdcEvents, setCdcEvents] = useState<CdcEvent[]>([])
  const [editId, setEditId] = useState<number | null>(null)
  const [editAmount, setEditAmount] = useState('')
  const lsnRef = useRef(1000)

  const now = () => new Date().toISOString().slice(11, 19)

  const addWalEntry = (op: CdcOperation, payload: string) => {
    const lsn = `0/1${lsnRef.current++}`
    setWalLog(prev => [...prev.slice(-4), { lsn, op, table: 'orders', payload }])
    return lsn
  }

  const addCdcEvent = (event: Omit<CdcEvent, 'id' | 'ts' | 'topic'>) => {
    setCdcEvents(prev => [...prev.slice(-5), {
      ...event,
      id: eventIdCounter++,
      ts: now(),
      topic: 'db.public.orders',
    }])
  }

  const handleInsert = () => {
    const newRow: CdcRow = { id: rowIdCounter++, name: `Order #${rowIdCounter}`, amount: Math.floor(Math.random() * 500 + 50) }
    setRows(prev => [...prev, newRow])
    addWalEntry('INSERT', `id=${newRow.id}, name="${newRow.name}", amount=${newRow.amount}`)
    addCdcEvent({ op: 'INSERT', before: null, after: newRow })
  }

  const handleUpdate = (row: CdcRow) => {
    if (editId === row.id) {
      const newAmount = parseInt(editAmount) || row.amount
      const updated = { ...row, amount: newAmount }
      setRows(prev => prev.map(r => r.id === row.id ? updated : r))
      addWalEntry('UPDATE', `id=${row.id}, amount: ${row.amount} -> ${newAmount}`)
      addCdcEvent({ op: 'UPDATE', before: row, after: updated })
      setEditId(null)
      setEditAmount('')
    } else {
      setEditId(row.id)
      setEditAmount(String(row.amount))
    }
  }

  const handleDelete = (row: CdcRow) => {
    setRows(prev => prev.filter(r => r.id !== row.id))
    addWalEntry('DELETE', `id=${row.id}, name="${row.name}"`)
    addCdcEvent({ op: 'DELETE', before: row, after: null })
  }

  return (
    <div className="exercise-container">
      <h2>{t('task.15.3')}</h2>
      <p style={{ color: '#666', marginBottom: '1.5rem' }}>
        Change Data Capture (CDC) в стиле Debezium: каждое изменение в таблице захватывается из WAL/binlog
        и публикуется как событие в Kafka. Вносите изменения в таблицу — наблюдайте события в реальном времени.
      </p>

      <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
        {/* Левая колонка: таблица */}
        <div style={{ flex: '1 1 300px' }}>
          <div style={{ fontWeight: 700, fontSize: '0.85rem', color: '#4f86f7', marginBottom: '0.5rem' }}>
            PostgreSQL: orders
          </div>
          <div style={{
            border: '1px solid #bee3f8',
            borderRadius: '8px',
            overflow: 'hidden',
            marginBottom: '0.75rem',
          }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem' }}>
              <thead>
                <tr style={{ background: '#ebf8ff' }}>
                  <th style={{ padding: '0.4rem 0.5rem', textAlign: 'left', borderBottom: '1px solid #bee3f8', color: '#4f86f7' }}>id</th>
                  <th style={{ padding: '0.4rem 0.5rem', textAlign: 'left', borderBottom: '1px solid #bee3f8', color: '#4f86f7' }}>name</th>
                  <th style={{ padding: '0.4rem 0.5rem', textAlign: 'right', borderBottom: '1px solid #bee3f8', color: '#4f86f7' }}>amount</th>
                  <th style={{ padding: '0.4rem 0.5rem', textAlign: 'center', borderBottom: '1px solid #bee3f8', color: '#4f86f7' }}>ops</th>
                </tr>
              </thead>
              <tbody>
                {rows.map(row => (
                  <tr key={row.id} style={{ borderBottom: '1px solid #f0f4f8' }}>
                    <td style={{ padding: '0.4rem 0.5rem', color: '#666' }}>{row.id}</td>
                    <td style={{ padding: '0.4rem 0.5rem', color: '#333' }}>{row.name}</td>
                    <td style={{ padding: '0.4rem 0.5rem', textAlign: 'right' }}>
                      {editId === row.id
                        ? <input
                            type="number"
                            value={editAmount}
                            onChange={e => setEditAmount(e.target.value)}
                            style={{ width: '70px', padding: '0.2rem', fontSize: '0.8rem', border: '1px solid #4f86f7', borderRadius: '4px' }}
                          />
                        : `$${row.amount}`
                      }
                    </td>
                    <td style={{ padding: '0.4rem 0.5rem', textAlign: 'center', display: 'flex', gap: '0.3rem', justifyContent: 'center' }}>
                      <button
                        onClick={() => handleUpdate(row)}
                        style={{
                          padding: '0.2rem 0.4rem',
                          fontSize: '0.72rem',
                          border: '1px solid #d69e2e',
                          borderRadius: '4px',
                          background: editId === row.id ? '#d69e2e' : '#fffff0',
                          color: editId === row.id ? '#fff' : '#d69e2e',
                          cursor: 'pointer',
                        }}
                      >
                        {editId === row.id ? 'OK' : 'UPD'}
                      </button>
                      <button
                        onClick={() => handleDelete(row)}
                        style={{
                          padding: '0.2rem 0.4rem',
                          fontSize: '0.72rem',
                          border: '1px solid #e53e3e',
                          borderRadius: '4px',
                          background: '#fff5f5',
                          color: '#e53e3e',
                          cursor: 'pointer',
                        }}
                      >
                        DEL
                      </button>
                    </td>
                  </tr>
                ))}
                {rows.length === 0 && (
                  <tr>
                    <td colSpan={4} style={{ padding: '1rem', textAlign: 'center', color: '#a0aec0', fontSize: '0.8rem' }}>
                      Таблица пуста
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <button
            onClick={handleInsert}
            style={{
              padding: '0.45rem 1rem',
              background: '#38a169',
              color: '#fff',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: '0.82rem',
            }}
          >
            + INSERT строку
          </button>

          {/* WAL лог */}
          {walLog.length > 0 && (
            <div style={{ marginTop: '1rem' }}>
              <div style={{ fontWeight: 700, fontSize: '0.8rem', color: '#888', marginBottom: '0.4rem' }}>
                WAL (Write-Ahead Log)
              </div>
              <div style={{
                background: '#1a202c',
                borderRadius: '6px',
                padding: '0.5rem 0.75rem',
                fontSize: '0.72rem',
                fontFamily: 'monospace',
              }}>
                {walLog.map((w, i) => (
                  <div key={i} style={{ marginBottom: '0.2rem' }}>
                    <span style={{ color: '#718096' }}>{w.lsn}</span>
                    {' '}
                    <span style={{
                      color: w.op === 'INSERT' ? '#68d391' : w.op === 'UPDATE' ? '#f6e05e' : '#fc8181',
                      fontWeight: 700,
                    }}>{w.op}</span>
                    {' '}
                    <span style={{ color: '#90cdf4' }}>{w.table}</span>
                    {' '}
                    <span style={{ color: '#a0aec0' }}>{w.payload}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Правая колонка: CDC события */}
        <div style={{ flex: '1 1 280px' }}>
          <div style={{ fontWeight: 700, fontSize: '0.85rem', color: '#805ad5', marginBottom: '0.5rem' }}>
            Kafka: db.public.orders (CDC Events)
          </div>
          {cdcEvents.length === 0 ? (
            <div style={{
              border: '1px dashed #e9d8fd',
              borderRadius: '8px',
              padding: '2rem',
              textAlign: 'center',
              color: '#a0aec0',
              fontSize: '0.85rem',
            }}>
              Измените таблицу, чтобы увидеть CDC-события
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              {[...cdcEvents].reverse().map(ev => (
                <div
                  key={ev.id}
                  style={{
                    border: `1px solid ${opColor(ev.op)}40`,
                    borderLeft: `3px solid ${opColor(ev.op)}`,
                    borderRadius: '6px',
                    padding: '0.6rem 0.75rem',
                    background: opBg(ev.op),
                    fontSize: '0.78rem',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
                    <span style={{
                      fontWeight: 700,
                      color: opColor(ev.op),
                      padding: '0.1rem 0.4rem',
                      background: `${opColor(ev.op)}15`,
                      borderRadius: '4px',
                    }}>
                      {ev.op}
                    </span>
                    <span style={{ color: '#a0aec0', fontSize: '0.72rem' }}>{ev.ts}</span>
                  </div>
                  <div style={{ color: '#666', fontSize: '0.72rem', marginBottom: '0.3rem', fontFamily: 'monospace' }}>
                    topic: {ev.topic}
                  </div>
                  {ev.before && (
                    <div style={{ fontFamily: 'monospace', color: '#e53e3e', fontSize: '0.72rem' }}>
                      before: {'{'} id:{ev.before.id}, amount:{ev.before.amount} {'}'}
                    </div>
                  )}
                  {ev.after && (
                    <div style={{ fontFamily: 'monospace', color: '#38a169', fontSize: '0.72rem' }}>
                      after: {'{'} id:{ev.after.id}, name:"{ev.after.name}", amount:{ev.after.amount} {'}'}
                    </div>
                  )}
                  {ev.op === 'DELETE' && (
                    <div style={{ color: '#e53e3e', fontSize: '0.72rem' }}>
                      (запись удалена, after = null)
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Легенда */}
          <div style={{ marginTop: '1rem', padding: '0.75rem', background: '#faf5ff', borderRadius: '8px', border: '1px solid #e9d8fd' }}>
            <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#805ad5', marginBottom: '0.5rem' }}>
              Debezium event envelope
            </div>
            <div style={{ fontSize: '0.72rem', fontFamily: 'monospace', color: '#555', lineHeight: 1.6 }}>
              <div>op: "c" | "u" | "d" | "r"</div>
              <div>before: {'{'} ...row_state {'}'} | null</div>
              <div>after: {'{'} ...row_state {'}'} | null</div>
              <div>source: {'{'} lsn, ts_ms, table {'}'}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
