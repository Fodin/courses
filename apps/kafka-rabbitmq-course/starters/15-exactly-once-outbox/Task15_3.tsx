import { useState, useRef } from 'react'
import { useLanguage } from 'src/hooks'

// ============================================================
// Задание 15.3: CDC (Change Data Capture)
// Assignment 15.3: CDC (Change Data Capture)
// ============================================================
//
// Goal: implement an interactive CDC visualizer in Debezium style.
// Every change to the table (INSERT, UPDATE, DELETE) is captured from
// the WAL (Write-Ahead Log) and published as a structured CDC event to Kafka.
// The event contains fields: op, before, after, ts, topic.

// TODO: Define the CdcOperation type. // Значения: 'INSERT' | 'UPDATE' | 'DELETE'
// type CdcOperation = ...

// TODO: Define the CdcRow interface. // Поля: id: number, name: string, amount: number
// interface CdcRow { ... }

// TODO: Define the CdcEvent interface. // Поля: id: number, op: CdcOperation, before: CdcRow | null, after: CdcRow | null,
//         ts: string, topic: string
// interface CdcEvent { ... }

// TODO: Define the CdcWalEntry interface. // Поля: lsn: string, op: CdcOperation, table: string, payload: string
// interface CdcWalEntry { ... }

// TODO: Declare module-level counters (outside the component): // Счётчики на уровне модуля (вне компонента):
// let rowIdCounter = 1
// let eventIdCounter = 1

// TODO: Implement opColor(op: CdcOperation): string
// Возвращает цвет границы/текста для операции:
// INSERT → '#38a169', UPDATE → '#d69e2e', DELETE → '#e53e3e'
// const opColor = (op: CdcOperation) => { ... }

// TODO: Implement opBg(op: CdcOperation): string
// Возвращает цвет фона для операции:
// INSERT → '#f0fff4', UPDATE → '#fffff0', DELETE → '#fff5f5'
// const opBg = (op: CdcOperation) => { ... }

export function Task15_3() {
  const { t } = useLanguage()

  // TODO: Declare state: // rows: CdcRow[] — данные таблицы, начальное значение: 2 строки
  //   [{ id: rowIdCounter++, name: 'Order #1', amount: 100 },
  //    { id: rowIdCounter++, name: 'Order #2', amount: 250 }]
  // walLog: CdcWalEntry[] — записи WAL (начально: [])
  // cdcEvents: CdcEvent[] — CDC события (начально: [])
  // editId: number | null — id строки, которая сейчас редактируется (начально: null)
  // editAmount: string — строковое значение редактируемой суммы (начально: '')
  // lsnRef: React.MutableRefObject<number> via useRef(1000)
  const [rows, setRows] = useState<any[]>([])
  const [walLog, setWalLog] = useState<any[]>([])
  const [cdcEvents, setCdcEvents] = useState<any[]>([])
  const [editId, setEditId] = useState<number | null>(null)
  const [editAmount, setEditAmount] = useState('')
  const lsnRef = useRef(1000)

  // TODO: Implement now(): string
  // Возвращает текущее время в формате HH:MM:SS через new Date().toISOString().slice(11, 19)
  // const now = () => ...

  // TODO: Implement addWalEntry(op: CdcOperation, payload: string): string
  // 1. Построить LSN: `0/1${lsnRef.current++}`
  // 2. Добавить в walLog — хранить только последние 5 записей через .slice(-4)
  //    { lsn, op, table: 'orders', payload }
  // 3. Вернуть строку lsn
  // const addWalEntry = (op: CdcOperation, payload: string) => { ... }

  // TODO: Implement addCdcEvent(event: Omit<CdcEvent, 'id' | 'ts' | 'topic'>)
  // Добавляет в cdcEvents — хранить последние 6 через .slice(-5)
  // Автозаполнение: id: eventIdCounter++, ts: now(), topic: 'db.public.orders'
  // const addCdcEvent = (event: ...) => { ... }

  // TODO: Implement handleInsert:
  // 1. Создать newRow: { id: rowIdCounter++, name: `Order #${rowIdCounter}`, amount: random 50–550 }
  // 2. Добавить в rows
  // 3. addWalEntry('INSERT', `id=${newRow.id}, name="${newRow.name}", amount=${newRow.amount}`)
  // 4. addCdcEvent({ op: 'INSERT', before: null, after: newRow })
  const handleInsert = () => {
    // TODO: implement
  }

  // TODO: Implement handleUpdate(row: CdcRow):
  // Если editId === row.id (второй клик — применить изменения):
  //   1. Разобрать newAmount = parseInt(editAmount) || row.amount
  //   2. Построить updated = { ...row, amount: newAmount }
  //   3. Обновить rows (заменить строку по id)
  //   4. addWalEntry('UPDATE', `id=${row.id}, amount: ${row.amount} -> ${newAmount}`)
  //   5. addCdcEvent({ op: 'UPDATE', before: row, after: updated })
  //   6. setEditId(null), setEditAmount('')
  // Иначе (первый клик — начать редактирование):
  //   setEditId(row.id), setEditAmount(String(row.amount))
  const handleUpdate = (row: any) => {
    // TODO: implement
  }

  // TODO: Implement handleDelete(row: CdcRow):
  // 1. Удалить строку из rows (фильтр по id)
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
        {/* Левая колонка — таблица PostgreSQL */}
        {/* Title "PostgreSQL: orders" in blue (#4f86f7) */}
        {/* Заголовок "PostgreSQL: orders" синим (#4f86f7) */}
        {/* HTML <table> with columns: id, name, amount, ops */}
        {/* HTML <table> с колонками: id, name, amount, ops */}
        {/*   Header row with blue styling */}
        {/*   Строка заголовка со стилизацией синим */}
        {/*   For each row: */}
        {/*   Для каждой строки: */}
        {/*     - id cell: grey */}
        {/*     - ячейка id: серая */}
        {/*     - name cell */}
        {/*     - ячейка name */}
        {/*     - amount cell: if editId === row.id → show <input type="number"> bound to editAmount */}
        {/*     - ячейка amount: если editId === row.id → показать <input type="number"> привязанный к editAmount */}
        {/*                    else → `$${row.amount}` */}
        {/*                    иначе → `$${row.amount}` */}
        {/*     - ops cell: two buttons */}
        {/*     - ячейка ops: две кнопки */}
        {/*       UPD / OK button (yellow theme): text changes when editId === row.id */}
        {/*       Кнопка UPD / OK (жёлтая тема): текст меняется когда editId === row.id */}
        {/*       DEL button (red theme): calls handleDelete */}
        {/*       Кнопка DEL (красная тема): вызывает handleDelete */}
        {/*   Empty state: "Таблица пуста" centered in grey */}
        {/*   Пустое состояние: "Таблица пуста" по центру серым */}
        {/* Button "+ INSERT строку" (green) below the table */}
        {/* Кнопка "+ INSERT строку" (зелёная) под таблицей */}
        {/* WAL log block (dark, monospace) if walLog.length > 0 */}
        {/* Блок журнала WAL (тёмный, моноширинный) если walLog.length > 0 */}
        {/*   Each entry: {lsn} {op} {table} {payload} */}
        {/*   Каждая запись: {lsn} {op} {table} {payload} */}
        {/*   Colors: lsn → '#718096', INSERT → '#68d391', UPDATE → '#f6e05e', DELETE → '#fc8181' */}
        {/*   Цвета: lsn → '#718096', INSERT → '#68d391', UPDATE → '#f6e05e', DELETE → '#fc8181' */}
        {/*           table → '#90cdf4', payload → '#a0aec0' */}
        {/*           table → '#90cdf4', payload → '#a0aec0' */}
        <div style={{ flex: '1 1 300px' }}>
          {/* TODO: implement left column */}
        </div>

        {/* TODO: Right column — CDC events */}
        {/* Правая колонка — CDC события */}
        {/* Title "Kafka: db.public.orders (CDC Events)" in purple (#805ad5) */}
        {/* Заголовок "Kafka: db.public.orders (CDC Events)" фиолетовым (#805ad5) */}
        {/* If cdcEvents is empty: dashed placeholder "Измените таблицу, чтобы увидеть CDC-события" */}
        {/* Если cdcEvents пуст: пунктирная заглушка "Измените таблицу, чтобы увидеть CDC-события" */}
        {/* Else: flex column of event cards in REVERSE order (newest first) */}
        {/* Иначе: flex-колонка карточек событий в ОБРАТНОМ порядке (новые первыми) */}
        {/*   Each card: */}
        {/*   Каждая карточка: */}
        {/*     - left border 3px solid opColor(ev.op) */}
        {/*     - левая граница 3px solid opColor(ev.op) */}
        {/*     - background opBg(ev.op) */}
        {/*     - фон opBg(ev.op) */}
        {/*     - Header row: op badge (colored pill) + timestamp (grey, right-aligned) */}
        {/*     - Строка заголовка: бейдж op (цветная таблетка) + временная метка (серая, справа) */}
        {/*     - topic line (monospace, grey) */}
        {/*     - Строка topic (моноширинная, серая) */}
        {/*     - before line (red, monospace): only if ev.before !== null */}
        {/*     - Строка before (красная, моноширинная): только если ev.before !== null */}
        {/*       `before: { id:${ev.before.id}, amount:${ev.before.amount} }` */}
        {/*     - after line (green, monospace): only if ev.after !== null */}
        {/*     - Строка after (зелёная, моноширинная): только если ev.after !== null */}
        {/*       `after: { id:${ev.after.id}, name:"${ev.after.name}", amount:${ev.after.amount} }` */}
        {/*     - "(запись удалена, after = null)" in red if op === 'DELETE' */}
        {/*     - "(запись удалена, after = null)" красным если op === 'DELETE' */}
        <div style={{ flex: '1 1 280px' }}>
          {/* TODO: implement right column */}
        </div>
      </div>
    </div>
  )
}
