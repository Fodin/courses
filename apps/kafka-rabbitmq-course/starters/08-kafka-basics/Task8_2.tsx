import { useState } from 'react'
import { useLanguage } from '@courses/platform'

// ============================================
// Task 8.2: Append-only Log
// ============================================
//
// Goal: implement an interactive visualization of Kafka's append-only log.
// The user sees records with offset/key/size, can add new records,
// move the consumer offset, and view details of a specific record.

// TODO: Define LogRecord interface:
//   offset: number
//   key: string
//   value: string
//   timestamp: string
//   size: number
// interface LogRecord { ... }

// TODO: Implement helper function generateTimestamp(base: number, offsetMs: number): string:
//   - Creates a date new Date(base + offsetMs)
//   - Returns string in format "YYYY-MM-DD HH:MM:SS"
//   - Hint: d.toISOString().replace('T', ' ').substring(0, 19)
// const generateTimestamp = (base: number, offsetMs: number): string => { ... }

// TODO: Create constant BASE_TS = new Date('2024-01-15T10:00:00').getTime()

// TODO: Create constant initialRecords: LogRecord[] — array of 5 records:
//   offset 0: key 'user-1', value '{"event":"registered","userId":1}', size 52, offsetMs 0
//   offset 1: key 'user-2', value '{"event":"registered","userId":2}', size 52, offsetMs 3200
//   offset 2: key 'user-1', value '{"event":"login","userId":1}',       size 44, offsetMs 8100
//   offset 3: key 'order-1',value '{"event":"created","orderId":1,"userId":1}', size 61, offsetMs 15400
//   offset 4: key 'user-3', value '{"event":"registered","userId":3}', size 52, offsetMs 22000
// const initialRecords: LogRecord[] = [...]

export function Task8_2() {
  const { t } = useLanguage()

  // TODO: State records: LogRecord[] — initialize from initialRecords
  const [records, setRecords] = useState<unknown[]>([])

  // TODO: State consumerOffset: number — current consumer position (default 0)
  const [consumerOffset, setConsumerOffset] = useState(0)

  // TODO: State newKey: string — key of the new record (default 'user-4')
  const [newKey, setNewKey] = useState('user-4')

  // TODO: State newValue: string — value of the new record
  const [newValue, setNewValue] = useState('{"event":"registered","userId":4}')

  // TODO: State selectedOffset: number | null — selected record in the log
  const [selectedOffset, setSelectedOffset] = useState<number | null>(null)

  // TODO: State readLog: string[] — operation log (last 15 entries)
  const [readLog, setReadLog] = useState<string[]>([])

  // TODO: Implement function appendRecord():
  //   1. Checks that newKey and newValue are not empty
  //   2. Computes nextOffset = records.length
  //   3. Creates LogRecord:
  //      offset: nextOffset, key: newKey.trim(), value: newValue.trim(),
  //      timestamp: generateTimestamp(BASE_TS, nextOffset * 7000 + 28000),
  //      size: newKey.length + newValue.length + 10
  //   4. Appends record to end of records
  //   5. Adds to readLog: `[APPEND] offset=N key="..." → written to end of log`
  const appendRecord = () => {
    // TODO: implement
  }

  // TODO: Implement function readFromOffset(startOffset: number):
  //   1. Sets consumerOffset = startOffset
  //   2. Gets slice records.slice(startOffset)
  //   3. Forms [READ] strings for each record:
  //      `[READ] offset=N key="..." value=...`
  //   4. Prepends to readLog: ...lines, `[SEEK] consumer → offset N`
  //   5. Limits readLog to 15 entries
  const readFromOffset = (_startOffset: number) => {
    // TODO: implement
  }

  return (
    <div style={{ padding: '1rem', fontFamily: 'sans-serif', maxWidth: '960px' }}>
      <h2 style={{ marginBottom: '0.25rem' }}>{t('task.8.2')}</h2>
      <p style={{ color: '#666', marginBottom: '1rem', fontSize: '0.9rem' }}>
        Kafka stores messages as an append-only log. Each message receives a monotonically increasing offset.
      </p>

      {/* TODO: Three concept cards (display grid, 3 columns, gap '0.75rem'):
          1. 📝 Append-only — "Records are only appended to the end. No modification or deletion."
          2. 🔢 Offset — "Each record has a unique monotonically increasing number — offset. Starts from 0."
          3. ♾️ Immutable — "Written data is immutable. Consumer reads any range of offsets."
          Each card: border '1px solid #e0e0e0', borderRadius '8px', background '#fafafa' */}

      {/* TODO: Log visualization (horizontal row):
          - Header "Partition Log — N records"
          - Record cards in a row (display flex, gap 0):
            * Click → setSelectedOffset(offset) or reset if same card clicked
            * Selected card: border blue '#1565C0', background '#E3F2FD'
            * Read records (i < consumerOffset): border green '#A5D6A7', background '#F1F8E9'
              + label "✅ read"
            * Current position (i === consumerOffset): border yellow '#FFB300', background '#FFF8E1'
              + label "👁 position"
            * Each card shows: offset=N, key, size in bytes
          - After last card: arrow → and "next record" block (dashed border) */}

      {/* TODO: Detail panel for selected record (if selectedOffset !== null):
          background '#E3F2FD', border '1px solid #90CAF9', fontFamily monospace
          Shows key, value, timestamp, size */}

      {/* TODO: Consumer offset controls:
          - Header "Consumer — read from offset"
          - Buttons "from offset=N" for each record → readFromOffset(N)
          - Active button: background '#1565C0', color '#fff'
          - Text: "Consumer reads from offset=N. Read: X messages." */}

      {/* TODO: Add record form:
          - Header "Write message to log"
          - Input for key (width 120px, fontFamily monospace)
          - Input for value (flex 1, minWidth 200px)
          - "Append" button → appendRecord() (background '#1565C0')
          - Hint: "New record will be appended to the log with offset=N" */}

      {/* TODO: Operation log (if readLog.length > 0):
          - Dark terminal (background '#0d1117', color '#39d353', maxHeight 180px)
          - "Clear" button → setReadLog([]) */}

      <div style={{ color: '#aaa', fontSize: '0.85rem', marginTop: '2rem' }}>
        TODO: implement the task UI
      </div>
    </div>
  )
}
