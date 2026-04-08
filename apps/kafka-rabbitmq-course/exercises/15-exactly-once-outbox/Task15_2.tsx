import { useState, useRef } from 'react'
import { useLanguage } from 'src/hooks'

// ============================================================
// Задание 15.2: Transactional Outbox
// ============================================================
//
// Goal: implement a Transactional Outbox pattern visualizer.
// The event is saved in the same DB transaction as the main data.
// A separate Relay process reads the outbox table and publishes to Kafka,
// guaranteeing at-least-once delivery.

// TODO: Reuse or redeclare the LogEntry interface from task 15.1.
// Fields: id: number, text: string, type: 'info' | 'success' | 'error' | 'warn'
// interface LogEntry { ... }

// TODO: Define the OutboxStep type.
// Values: 'idle' | 'tx-start' | 'db-write' | 'outbox-write' | 'tx-commit'
//         | 'relay-poll' | 'relay-publish' | 'relay-delete' | 'done'
// type OutboxStep = ...

// TODO: Define the OutboxRow interface.
// Fields: id: string, event: string, status: 'pending' | 'published'
// interface OutboxRow { ... }

export function Task15_2() {
  const { t } = useLanguage()

  // TODO: Declare state:
  // step: OutboxStep — current pipeline step (initial: 'idle')
  // logs: LogEntry[] — event log (initial: [])
  // dbOrders: { id: string }[] — rows in the orders table (initial: [])
  // outboxRows: OutboxRow[] — rows in the outbox table (initial: [])
  // brokerEvents: string[] — events published to Kafka (initial: [])
  // logIdRef: React.MutableRefObject<number> via useRef(0)
  const [step, setStep] = useState<any>('idle')
  const [logs, setLogs] = useState<any[]>([])
  const [dbOrders, setDbOrders] = useState<any[]>([])
  const [outboxRows, setOutboxRows] = useState<any[]>([])
  const [brokerEvents, setBrokerEvents] = useState<string[]>([])
  const logIdRef = useRef(0)

  // TODO: Implement addLog(text, type) — same as task 15.1
  // const addLog = (text: string, type: LogEntry['type'] = 'info') => { ... }

  // TODO: Implement delay(ms) — same as task 15.1
  // const delay = (ms: number) => new Promise(res => setTimeout(res, ms))

  // TODO: Implement runOutbox:
  // 1. Generate orderId = `order-${Date.now().toString().slice(-4)}`
  //    and outboxId = `evt-${Date.now().toString().slice(-4)}`
  //    Reset logs.
  // 2. Step 'tx-start': addLog('[Service] BEGIN TRANSACTION'), await delay(400)
  // 3. Step 'db-write':
  //    addLog(`[DB] INSERT INTO orders (id) VALUES ('${orderId}')`)
  //    await delay(500), add { id: orderId } to dbOrders
  //    addLog('[DB] Запись создана', 'success')
  // 4. Step 'outbox-write': await delay(400)
  //    addLog(`[DB] INSERT INTO outbox (id, event, status) VALUES ('${outboxId}', 'OrderCreated:${orderId}', 'pending')`)
  //    add { id: outboxId, event: `OrderCreated:${orderId}`, status: 'pending' } to outboxRows
  //    addLog('[DB] Outbox запись создана в той же транзакции', 'success')
  // 5. Step 'tx-commit': await delay(400)
  //    addLog('[DB] COMMIT — обе записи атомарно сохранены', 'success')
  // 6. Step 'relay-poll': await delay(600)
  //    addLog("[Relay] SELECT * FROM outbox WHERE status='pending'")
  //    addLog('[Relay] Найдено событий: 1', 'success')
  // 7. Step 'relay-publish': await delay(500)
  //    addLog(`[Relay] Публикация OrderCreated:${orderId} в Kafka...`)
  //    add `OrderCreated:${orderId}` to brokerEvents
  //    addLog('[Kafka] Событие опубликовано', 'success')
  // 8. Step 'relay-delete': await delay(400)
  //    addLog(`[Relay] UPDATE outbox SET status='published' WHERE id='${outboxId}'`)
  //    update outboxRows: change status to 'published' for the matching id
  //    addLog('[Relay] Outbox помечен как опубликованный', 'success')
  // 9. setStep('done')
  const runOutbox = async () => {
    // TODO: implement
  }

  // TODO: Implement reset:
  // setStep('idle'), setLogs([]), setDbOrders([]), setOutboxRows([]), setBrokerEvents([])
  const reset = () => {
    // TODO: implement
  }

  // TODO: Declare pipelineSteps — array of 7 objects { id: OutboxStep; label: string; color: string }:
  // 'tx-start' → 'BEGIN TX' → '#4f86f7'
  // 'db-write' → 'Write orders' → '#38a169'
  // 'outbox-write' → 'Write outbox' → '#38a169'
  // 'tx-commit' → 'COMMIT' → '#4f86f7'
  // 'relay-poll' → 'Relay poll' → '#ed8936'
  // 'relay-publish' → 'Publish event' → '#805ad5'
  // 'relay-delete' → 'Mark sent' → '#38a169'
  // const pipelineSteps = [...]

  // TODO: Declare stepsOrder — array of all OutboxStep values in order:
  // ['idle', 'tx-start', 'db-write', 'outbox-write', 'tx-commit', 'relay-poll', 'relay-publish', 'relay-delete', 'done']
  // const stepsOrder: OutboxStep[] = [...]

  // TODO: Compute currentIdx = stepsOrder.indexOf(step)
  // Use it in the pipeline rendering to determine isDone and isActive for each step
  // const currentIdx = stepsOrder.indexOf(step)

  return (
    <div className="exercise-container">
      <h2>{t('task.15.2')}</h2>
      <p style={{ color: '#666', marginBottom: '1.5rem' }}>
        Transactional Outbox решает проблему двойной записи: событие сохраняется в той же DB-транзакции
        что и основные данные. Отдельный Relay-процесс читает outbox и публикует в брокер.
      </p>

      {/* TODO: Pipeline section */}
      {/* Title "Этапы выполнения" */}
      {/* Horizontal flex row of pipeline steps: */}
      {/*   Each step is a pill with label */}
      {/*   isActive → full color bg, white text */}
      {/*   isDone   → faded color bg (`${color}30`), colored text, ✓ prefix */}
      {/*   default  → grey '#f0f0f0', text '#aaa' */}
      {/*   Between steps — small grey arrow → */}
      {/* Below the pipeline, two annotation badges: */}
      {/*   "DB Transaction" covering steps 1–4 (blue badge) */}
      {/*   "Relay Process" covering steps 5–7 (orange badge) */}
      <div style={{ marginBottom: '1.5rem' }}>
        {/* TODO: pipeline steps row */}
        {/* TODO: annotation row */}
      </div>

      {/* TODO: Three storage panels in a flex row */}
      {/* Panel 1: "orders (основная таблица)" — green theme */}
      {/*   Lists dbOrders items or shows placeholder "пусто" */}
      {/* Panel 2: "outbox (вспомогательная таблица)" — orange theme */}
      {/*   Lists outboxRows, status 'pending' → orange, 'published' → green */}
      {/* Panel 3: "Kafka (order-events)" — purple theme */}
      {/*   Lists brokerEvents or shows placeholder "нет событий" */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
        {/* TODO: panels */}
      </div>

      {/* TODO: Buttons row */}
      {/* Button "Создать заказ (Outbox)" — calls runOutbox, disabled when step not 'idle' or 'done' */}
      {/* Button "Сбросить" — calls reset */}
      <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1rem' }}>
        {/* TODO: buttons */}
      </div>

      {/* TODO: Event log — dark block */}
      {/* Only render if logs.length > 0 */}
      {/* Log line colors: error → '#fc8181', success → '#68d391', warn → '#f6ad55', info → '#a0aec0' */}
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
          {/* TODO: render logs */}
        </div>
      )}

      {/* TODO: Success block when step === 'done' */}
      {/* Green block with text: */}
      {/* "Гарантия доставки: даже если Relay упадёт между шагами 5 и 7, */}
      {/*  при перезапуске он снова прочитает pending-записи и опубликует их. */}
      {/*  Событие будет доставлено at-least-once." */}
    </div>
  )
}
