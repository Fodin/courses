import { useState } from 'react'

// ============================================
// Задание 4.2: Variant Types
// ============================================

// TODO: Создайте обобщённый тип Variant<Tag, Data = undefined>:
//   Если Data === undefined: { readonly _tag: Tag }
//   Иначе: { readonly _tag: Tag, readonly data: Data }
// TODO: Create generic type Variant<Tag, Data = undefined>

// TODO: Создайте функцию-конструктор variant с перегрузками:
//   variant(tag) -> Variant<Tag>
//   variant(tag, data) -> Variant<Tag, Data>
// TODO: Create constructor function variant with overloads

// TODO: Определите тип RemoteData<E, A> как union из четырёх вариантов:
//   NotAsked, Loading, Failure(E), Success(A)
//   Создайте конструкторы: NotAsked(), Loading(), Failure(e), Success(a)
// TODO: Define RemoteData<E, A> as union of four variants

// TODO: Определите PaymentResult с вариантами:
//   Approved { transactionId, amount }, Declined { reason, code },
//   Pending { estimatedTime }, Refunded { originalId, refundAmount }
// TODO: Define PaymentResult with Approved, Declined, Pending, Refunded

// TODO: Реализуйте matchVariant для exhaustive matching по _tag
// TODO: Implement matchVariant for exhaustive matching on _tag

export function Task4_2() {
  const [results, setResults] = useState<string[]>([])

  const runExample = () => {
    const log: string[] = []

    log.push('=== Variant Types ===')
    log.push('')

    // TODO: Покажите RemoteData через все состояния
    log.push('RemoteData states:')
    log.push('  ... NotAsked, Loading, Failure, Success')
    log.push('')

    // TODO: Покажите PaymentResult через matchVariant
    log.push('PaymentResult matching:')
    log.push('  ... matchVariant для каждого варианта')

    setResults(log)
  }

  return (
    <div className="exercise-container">
      <h2>Задание 4.2: Variant Types</h2>
      <button onClick={runExample}>Запустить</button>
      {results.length > 0 && (
        <div style={{ marginTop: '1rem' }}>
          <h3>Результаты:</h3>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {results.map((r, i) => (
              <li key={i} style={{ padding: '0.25rem 0', fontFamily: 'monospace', whiteSpace: 'pre' }}>{r}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
