import { useState } from 'react'

// ============================================
// Задание 5.4: Event Sourcing (Банковский счёт)
// ============================================

// TODO: Define interface DomainEvent with:
//   type: string
//   timestamp: number
//   aggregateId: string

// TODO: Define event interfaces extending DomainEvent:
//   AccountOpened:  type 'AccountOpened',  ownerName: string
//   MoneyDeposited: type 'MoneyDeposited', amount: number
//   MoneyWithdrawn: type 'MoneyWithdrawn', amount: number
//   AccountClosed:  type 'AccountClosed',  reason: string

// TODO: Define discriminated union type:
//   type AccountEvent = AccountOpened | MoneyDeposited | MoneyWithdrawn | AccountClosed

// TODO: Define interface AccountState:
//   ownerName: string
//   balance: number
//   isOpen: boolean
//   transactions: number

// TODO: Define initialAccountState constant with all fields at zero/empty/false

// TODO: Implement function applyEvent(state: AccountState, event: AccountEvent): AccountState
//   Use switch on event.type:
//   'AccountOpened'  -> set ownerName, balance=0, isOpen=true, transactions=0
//   'MoneyDeposited' -> balance + amount, transactions + 1
//   'MoneyWithdrawn' -> balance - amount, transactions + 1
//   'AccountClosed'  -> isOpen = false
//   IMPORTANT: return new object, do not mutate state

// TODO: Implement function replay(events: AccountEvent[]): AccountState
//   Use events.reduce(applyEvent, initialAccountState)

// TODO: Create class EventStore
//   - private events: AccountEvent[] = []
//   - append(event: AccountEvent): void — push event
//   - getEvents(aggregateId: string): AccountEvent[] — filter by aggregateId
//   - getEventsAfter(aggregateId: string, timestamp: number): AccountEvent[]
//     — filter by aggregateId AND timestamp > given timestamp

// TODO: Create helper function formatEvent(event: AccountEvent): string
//   Return human-readable string for each event type, e.g.:
//   'AccountOpened'  -> "AccountOpened (owner: Alice)"
//   'MoneyDeposited' -> "MoneyDeposited (+1000)"
//   'MoneyWithdrawn' -> "MoneyWithdrawn (-200)"
//   'AccountClosed'  -> "AccountClosed (reason: Customer request)"

export function Task5_4() {
  const [results, setResults] = useState<string[]>([])

  const runExample = () => {
    const log: string[] = []

    // TODO: Create EventStore instance
    // TODO: Define accountId = 'acc-001' and baseTime = Date.now()

    // TODO: Create array of AccountEvent objects:
    //   1. AccountOpened (ownerName: 'Alice')           at baseTime
    //   2. MoneyDeposited (amount: 1000)                at baseTime + 1000
    //   3. MoneyDeposited (amount: 500)                 at baseTime + 2000
    //   4. MoneyWithdrawn (amount: 200)                 at baseTime + 3000
    //   5. MoneyDeposited (amount: 300)                 at baseTime + 4000
    //   6. MoneyWithdrawn (amount: 150)                 at baseTime + 5000

    // TODO: Append all events to store

    // TODO: Log "--- Event Log ---"
    // Get all events from store, log each with formatEvent

    // TODO: Log "--- Full Replay ---"
    // Replay all events, log ownerName, balance, transactions, isOpen

    // TODO: Log "--- Replay after 3 events (time travel) ---"
    // Replay only first 3 events (slice), log balance and transactions

    // TODO: Log "--- Events after 2nd deposit ---"
    // Use getEventsAfter(accountId, baseTime + 2000), log each

    // TODO: Log "--- Close Account ---"
    // Append AccountClosed event, replay all, log final state

    setResults(log)
  }

  return (
    <div className="exercise-container">
      <h2>Задание 5.4: Event Sourcing</h2>
      <button onClick={runExample}>Запустить</button>
      {results.length > 0 && (
        <div style={{ marginTop: '1rem' }}>
          <h3>Результаты:</h3>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {results.map((r, i) => (
              <li key={i} style={{ padding: '0.25rem 0', fontFamily: 'monospace', whiteSpace: 'pre' }}>
                {r}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
