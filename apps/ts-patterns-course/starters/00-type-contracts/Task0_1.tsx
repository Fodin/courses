import { useState } from 'react'

// ============================================
// Задание 0.1: Branded Types
// ============================================

// TODO: Создайте утилитарный тип Brand<T, B>
// Подсказка: используйте unique symbol и пересечение типов

// TODO: Создайте branded-типы UserId, Email, OrderId

// TODO: Создайте функцию createUserId(id: string): UserId
// - Проверьте, что id не пустой и длина >= 3
// - Бросьте Error если невалидный
// - Верните значение как UserId

// TODO: Создайте функцию createEmail(value: string): Email
// - Проверьте формат email через regex
// - Бросьте Error если невалидный

// TODO: Создайте функцию createOrderId(id: string): OrderId
// - Проверьте формат ORD-XXXX (цифры)
// - Бросьте Error если невалидный

// TODO: Создайте функции findUser(userId: UserId), sendEmail(email: Email), getOrder(orderId: OrderId)

export function Task0_1() {
  const [results, setResults] = useState<string[]>([])

  const runExample = () => {
    const log: string[] = []

    // TODO: Создайте branded-значения через функции-конструкторы
    // TODO: Оберните в try/catch для демонстрации валидации
    // TODO: Покажите успешные создания и ошибки валидации

    setResults(log)
  }

  return (
    <div className="exercise-container">
      <h2>Задание 0.1: Branded Types</h2>
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
