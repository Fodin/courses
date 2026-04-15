import { useState } from 'react'
import { useLanguage } from 'src/hooks'
import * as O from 'fp-ts/Option'
import * as E from 'fp-ts/Either'
// TODO: импортировать { pipe } from 'fp-ts/function'
// Подсказка: все три импорта уже подключены, остался pipe!
// import { pipe } from 'fp-ts/function'

// Данные пользователей
interface User {
  id: number
  name: string
  email?: string
}

const USERS: Record<number, User> = {
  1: { id: 1, name: 'Alice', email: 'alice@example.com' },
  2: { id: 2, name: 'Bob' },
  3: { id: 3, name: 'Carol', email: 'carol@example.com' },
}

// TODO: реализовать через pipe + O.fromNullable + O.flatMap + O.map + O.getOrElse
// ПОДСКАЗКА: O.getOrElse принимает thunk () => string, не строку!
function getUserEmail(userId: number): string {
  // TODO: найти пользователя → получить email → сделать uppercase → getOrElse 'N/A'
  // Пример структуры:
  // return pipe(
  //   O.fromNullable(USERS[userId]),
  //   O.flatMap(u => O.fromNullable(u.email)),
  //   O.map(e => e.toUpperCase()),
  //   O.getOrElse(() => 'N/A')
  // )
  return 'N/A'
}

// TODO: реализовать через E.left / E.right + pipe + E.flatMap
function parseAndValidate(input: string): E.Either<string, number> {
  // TODO: parseFloat(input)
  // TODO: если NaN → E.left('Не число')
  // TODO: если <= 0 → E.left('Должно быть > 0')
  // TODO: иначе → E.right(n)
  return E.left('not implemented')
}

export function Task10_1() {
  const { t } = useLanguage()
  const [userId, setUserId] = useState('1')
  const [numInput, setNumInput] = useState('42')

  // TODO: использовать getUserEmail(parseInt(userId))
  const emailResult = 'TODO'

  // TODO: использовать parseAndValidate(numInput)
  const numResult = 'TODO'

  return (
    <div className="exercise-container">
      <h2>{t('task.10.1')}</h2>

      <div style={{ marginBottom: '1.5rem' }}>
        <h3>Option: поиск email пользователя</h3>
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '0.5rem' }}>
          <label>userId:</label>
          <input
            value={userId}
            onChange={e => setUserId(e.target.value)}
            placeholder="1, 2, 3, 99..."
            style={{ padding: '0.3rem 0.6rem', background: '#1f2937', border: '1px solid #374151', color: '#e5e7eb', borderRadius: '4px', fontFamily: 'monospace' }}
          />
        </div>
        {/* TODO: отобразить emailResult */}
        <p>Результат: <strong>{emailResult}</strong></p>
      </div>

      <div>
        <h3>Either: валидация числа</h3>
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '0.5rem' }}>
          <label>число:</label>
          <input
            value={numInput}
            onChange={e => setNumInput(e.target.value)}
            placeholder="42, -1, abc..."
            style={{ padding: '0.3rem 0.6rem', background: '#1f2937', border: '1px solid #374151', color: '#e5e7eb', borderRadius: '4px', fontFamily: 'monospace' }}
          />
        </div>
        {/* TODO: отобразить numResult — показывать Left/Right разными цветами */}
        <p>Результат: <strong>{numResult}</strong></p>
      </div>
    </div>
  )
}
