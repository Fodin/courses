import { useState } from 'react'

// ============================================
// Задание 1.4: Event Sourcing Basics
// ============================================

// TODO: Определите базовый интерфейс BaseEvent { id: string, timestamp: number, version: number }
// TODO: Define base interface BaseEvent { id: string, timestamp: number, version: number }

// TODO: Определите типы событий для банковского счёта, каждый extends BaseEvent:
//   AccountCreated: type + payload { accountId, owner, initialBalance }
//   MoneyDeposited: type + payload { accountId, amount, source }
//   MoneyWithdrawn: type + payload { accountId, amount, reason }
//   AccountClosed:  type + payload { accountId, closedBy }
//   Объедините в union тип AccountEvent
// TODO: Define event types for a bank account, each extends BaseEvent:
//   AccountCreated, MoneyDeposited, MoneyWithdrawn, AccountClosed
//   Combine into union type AccountEvent

// TODO: Определите AccountState { accountId, owner, balance, status, transactionCount }
//   и тип EventReducer<TState, TEvent> = (state, event) => state
// TODO: Define AccountState and type EventReducer<TState, TEvent>

// TODO: Реализуйте accountReducer — обрабатывает все типы AccountEvent через switch
// TODO: Implement accountReducer — handles all AccountEvent types via switch

// TODO: Реализуйте класс EventStore<TEvent>:
//   - append(event) — добавить событие
//   - getAll() -> TEvent[]
//   - getByType<K>(type) -> Extract<TEvent, { type: K }>[] (сужение типа!)
//   - replay<TState>(reducer, initial) -> TState (воспроизвести все события)
//   - replayUntil(reducer, initial, until: number) -> TState (до timestamp)
// TODO: Implement class EventStore<TEvent>:
//   - append(event), getAll(), getByType<K>(type) with narrowed return type
//   - replay(reducer, initial), replayUntil(reducer, initial, until)

export function Task1_4() {
  const [results, setResults] = useState<string[]>([])

  const runExample = () => {
    const log: string[] = []

    log.push('=== Event Sourcing Basics ===')
    log.push('')

    // TODO: Создайте EventStore, добавьте события жизненного цикла счёта
    // TODO: Create EventStore, append account lifecycle events
    log.push('Events appended:')
    log.push('  ... добавьте AccountCreated, MoneyDeposited, MoneyWithdrawn')
    log.push('')

    // TODO: Воспроизведите текущее состояние через replay
    // TODO: Replay current state
    log.push('Current state (full replay):')
    log.push('  ... покажите balance, status, transactionCount')
    log.push('')

    // TODO: Отфильтруйте по типу через getByType
    // TODO: Filter by type via getByType
    log.push('Deposits only:')
    log.push('  ... getByType("MoneyDeposited") — тип сужается!')
    log.push('')

    // TODO: Покажите time-travel через replayUntil
    // TODO: Show time-travel via replayUntil
    log.push('Time-travel:')
    log.push('  ... воспроизведите состояние на момент 3-го события')

    setResults(log)
  }

  return (
    <div className="exercise-container">
      <h2>Задание 1.4: Event Sourcing Basics</h2>
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
