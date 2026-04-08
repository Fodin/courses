import { useState, useRef } from 'react'
import { useLanguage } from 'src/hooks'

// ============================================================
// Задание 15.3: CDC (Change Data Capture)
// ============================================================
//
// Goal: implement an interactive CDC visualizer in Debezium style.
// Every change to the table (INSERT, UPDATE, DELETE) is captured from
// the WAL (Write-Ahead Log) and published as a structured CDC event to Kafka.
// The event contains fields: op, before, after, ts, topic.

// TODO: Define the CdcOperation type.
// Values: 'INSERT' | 'UPDATE' | 'DELETE'
// type CdcOperation = ...

// TODO: Define the CdcRow interface.
// Fields: id: number, name: string, amount: number
// interface CdcRow { ... }

// TODO: Define the CdcEvent interface.
// Fields: id: number, op: CdcOperation, before: CdcRow | null, after: CdcRow | null,
//         ts: string, topic: string
// interface CdcEvent { ... }

// TODO: Define the CdcWalEntry interface.
// Fields: lsn: string, op: CdcOperation, table: string, payload: string
// interface CdcWalEntry { ... }

// TODO: Declare module-level counters (outside the component):
// let rowIdCounter = 1
// let eventIdCounter = 1

// TODO: Implement opColor(op: CdcOperation): string
// Returns the border/text color per operation:
// INSERT → '#38a169', UPDATE → '#d69e2e', DELETE → '#e53e3e'
// const opColor = (op: CdcOperation) => { ... }

// TODO: Implement opBg(op: CdcOperation): string
// Returns the background color per operation:
// INSERT → '#f0fff4', UPDATE → '#fffff0', DELETE → '#fff5f5'
// const opBg = (op: CdcOperation) => { ... }

export function Task15_3() {
  const { t } = useLanguage()

  // TODO: Declare state:
  // rows: CdcRow[] — table data, initial value: 2 rows
  //   [{ id: rowIdCounter++, name: 'Order #1', amount: 100 },
  //    { id: rowIdCounter++, name: 'Order #2', amount: 250 }]
  // walLog: CdcWalEntry[] — WAL entries (initial: [])
  // cdcEvents: CdcEvent[] — CDC events (initial: [])
  // editId: number | null — id of the row currently being edited (initial: null)
  // editAmount: string — string value of the edited amount (initial: '')
  // lsnRef: React.MutableRefObject<number> via useRef(1000)
  const [rows, setRows] = useState<any[]>([])
  const [walLog, setWalLog] = useState<any[]>([])
  const [cdcEvents, setCdcEvents] = useState<any[]>([])
  const [editId, setEditId] = useState<number | null>(null)
  const [editAmount, setEditAmount] = useState('')
  const lsnRef = useRef(1000)

  // TODO: Implement now(): string
  // Returns current time as HH:MM:SS using new Date().toISOString().slice(11, 19)
  // const now = () => ...

  // TODO: Implement addWalEntry(op: CdcOperation, payload: string): string
  // 1. Build LSN: `0/1${lsnRef.current++}`
  // 2. Add to walLog — keep only last 5 entries via .slice(-4)
  //    { lsn, op, table: 'orders', payload }
  // 3. Return the lsn string
  // const addWalEntry = (op: CdcOperation, payload: string) => { ... }

  // TODO: Implement addCdcEvent(event: Omit<CdcEvent, 'id' | 'ts' | 'topic'>)
  // Appends to cdcEvents — keep last 6 via .slice(-5)
  // Auto-fills: id: eventIdCounter++, ts: now(), topic: 'db.public.orders'
  // const addCdcEvent = (event: ...) => { ... }

  // TODO: Implement handleInsert:
  // 1. Create newRow: { id: rowIdCounter++, name: `Order #${rowIdCounter}`, amount: random 50–550 }
  // 2. Add to rows
  // 3. addWalEntry('INSERT', `id=${newRow.id}, name="${newRow.name}", amount=${newRow.amount}`)
  // 4. addCdcEvent({ op: 'INSERT', before: null, after: newRow })
  const handleInsert = () => {
    // TODO: implement
  }

  // TODO: Implement handleUpdate(row: CdcRow):
  // If editId === row.id (second click — apply changes):
  //   1. Parse newAmount = parseInt(editAmount) || row.amount
  //   2. Build updated = { ...row, amount: newAmount }
  //   3. Update rows (replace matching id)
  //   4. addWalEntry('UPDATE', `id=${row.id}, amount: ${row.amount} -> ${newAmount}`)
  //   5. addCdcEvent({ op: 'UPDATE', before: row, after: updated })
  //   6. setEditId(null), setEditAmount('')
  // Else (first click — start editing):
  //   setEditId(row.id), setEditAmount(String(row.amount))
  const handleUpdate = (row: any) => {
    // TODO: implement
  }

  // TODO: Implement handleDelete(row: CdcRow):
  // 1. Remove row from rows (filter by id)
  // 2. addWalEntry('DELETE', `id=${row.id}, name="${row.name}"`)
  // 3. addCdcEvent({ op: 'DELETE', before: row, after: null })
  const handleDelete = (row: any) => {
    // TODO: implement
  }

  return (
    <div className="exercise-container">
      <h2>{t('task.15.3')}</h2>
      <p style={{ color: '#666', marginBottom: '1.5rem' }}>
        Change Data Capture (CDC) в стиле Debezium: каждое изменение в таблице захватывается из WAL/binlog
        и публикуется как событие в Kafka. Вносите изменения в таблицу — наблюдайте события в реальном времени.
      </p>

      <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
        {/* TODO: Left column — PostgreSQL table */}
        {/* Title "PostgreSQL: orders" in blue (#4f86f7) */}
        {/* HTML <table> with columns: id, name, amount, ops */}
        {/*   Header row with blue styling */}
        {/*   For each row: */}
        {/*     - id cell: grey */}
        {/*     - name cell */}
        {/*     - amount cell: if editId === row.id → show <input type="number"> bound to editAmount */}
        {/*                    else → `$${row.amount}` */}
        {/*     - ops cell: two buttons */}
        {/*       UPD / OK button (yellow theme): text changes when editId === row.id */}
        {/*       DEL button (red theme): calls handleDelete */}
        {/*   Empty state: "Таблица пуста" centered in grey */}
        {/* Button "+ INSERT строку" (green) below the table */}
        {/* WAL log block (dark, monospace) if walLog.length > 0 */}
        {/*   Each entry: {lsn} {op} {table} {payload} */}
        {/*   Colors: lsn → '#718096', INSERT → '#68d391', UPDATE → '#f6e05e', DELETE → '#fc8181' */}
        {/*           table → '#90cdf4', payload → '#a0aec0' */}
        <div style={{ flex: '1 1 300px' }}>
          {/* TODO: implement left column */}
        </div>

        {/* TODO: Right column — CDC events */}
        {/* Title "Kafka: db.public.orders (CDC Events)" in purple (#805ad5) */}
        {/* If cdcEvents is empty: dashed placeholder "Измените таблицу, чтобы увидеть CDC-события" */}
        {/* Else: flex column of event cards in REVERSE order (newest first) */}
        {/*   Each card: */}
        {/*     - left border 3px solid opColor(ev.op) */}
        {/*     - background opBg(ev.op) */}
        {/*     - Header row: op badge (colored pill) + timestamp (grey, right-aligned) */}
        {/*     - topic line (monospace, grey) */}
        {/*     - before line (red, monospace): only if ev.before !== null */}
        {/*       `before: { id:${ev.before.id}, amount:${ev.before.amount} }` */}
        {/*     - after line (green, monospace): only if ev.after !== null */}
        {/*       `after: { id:${ev.after.id}, name:"${ev.after.name}", amount:${ev.after.amount} }` */}
        {/*     - "(запись удалена, after = null)" in red if op === 'DELETE' */}
        <div style={{ flex: '1 1 280px' }}>
          {/* TODO: implement right column */}
        </div>
      </div>
    </div>
  )
}
