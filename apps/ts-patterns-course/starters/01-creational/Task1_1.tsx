import { useState } from 'react'

// ============================================
// Задание 1.1: Factory Method
// ============================================

// TODO: Create interface Notification with methods:
//   send(message: string): string
//   format(message: string): string

// TODO: Create class EmailNotification implementing Notification
//   - format: wraps message in <html><body>...</body></html>
//   - send: returns "[EMAIL] Sent: <formatted message>"

// TODO: Create class SMSNotification implementing Notification
//   - format: trims message to 160 chars (add "..." if truncated)
//   - send: returns "[SMS] Sent: <formatted message>"

// TODO: Create class PushNotification implementing Notification
//   - format: prepends emoji prefix
//   - send: returns "[PUSH] Sent: <formatted message>"

// TODO: Create union type NotificationType = 'email' | 'sms' | 'push'

// TODO: Create factory function createNotification(type: NotificationType): Notification
//   - Use switch statement to return the correct class instance

export function Task1_1() {
  const [results, setResults] = useState<string[]>([])

  const runExample = () => {
    const log: string[] = []

    // TODO: Create an array of NotificationType values
    // TODO: Iterate over the array, creating notifications via factory
    // TODO: Call send('Hello from Factory!') on each and push to log

    // TODO: Show format examples for each type
    // TODO: Demonstrate type safety — invalid type should cause TS error

    setResults(log)
  }

  return (
    <div className="exercise-container">
      <h2>Задание 1.1: Factory Method</h2>
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
