import { useState } from 'react'

// ============================================
// Задание 11.2: XOR Type
// ============================================

// TODO: Проблема: union A | B разрешает объект, содержащий свойства и A, и B одновременно
//   type PayByCard = { cardNumber: string; cvv: string }
//   type PayByCash = { amount: number; currency: string }
//   type Payment = PayByCard | PayByCash
//   const p: Payment = { cardNumber: '...', cvv: '...', amount: 100, currency: 'USD' } // OK! Но не должно быть

// TODO: Создайте тип Without<T, U> — из T убирает ключи, которые есть в U (делает их never):
//   { [K in Exclude<keyof T, keyof U>]?: never }

// TODO: Создайте тип XOR<T, U> — эксклюзивное "или":
//   (T & Without<U, T>) | (U & Without<T, U>)
//   Можно передать T или U, но НЕ оба одновременно

// TODO: Создайте тип OneOf<T extends unknown[]> — расширение XOR для N типов:
//   OneOf<[A, B, C]> — ровно один из A, B, C

// TODO: Примените XOR к практическому примеру:
//   Компонент принимает либо { onClick } либо { href }, но не оба

export function Task11_2() {
  const [results, setResults] = useState<string[]>([])

  const runExample = () => {
    const log: string[] = []

    // TODO: Покажите проблему с обычным union:
    // log.push('=== Проблема с union ===')
    // log.push('PayByCard | PayByCash разрешает оба набора свойств одновременно')

    // TODO: Покажите решение через XOR:
    // type Payment = XOR<PayByCard, PayByCash>
    // const card: Payment = { cardNumber: '1234', cvv: '123' } // OK
    // const cash: Payment = { amount: 100, currency: 'USD' } // OK
    // // const both: Payment = { cardNumber: '1234', cvv: '123', amount: 100, currency: 'USD' } // Ошибка!
    // log.push('XOR<PayByCard, PayByCash>:')
    // log.push(`  card only → OK: ${JSON.stringify(card)}`)
    // log.push(`  cash only → OK: ${JSON.stringify(cash)}`)
    // log.push('  both → Ошибка компиляции!')

    // TODO: Покажите OneOf:
    // type Transport = OneOf<[
    //   { type: 'car'; plate: string },
    //   { type: 'bike'; gears: number },
    //   { type: 'bus'; route: string }
    // ]>

    // TODO: Практический пример — Button/Link компонент:
    // type ButtonProps = XOR<{ onClick: () => void }, { href: string }>
    // log.push('ButtonProps: onClick XOR href')

    setResults(log)
  }

  return (
    <div className="exercise-container">
      <h2>Задание 11.2: XOR Type</h2>
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
