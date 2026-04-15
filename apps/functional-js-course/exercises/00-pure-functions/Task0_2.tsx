import { useState } from 'react'
import { useLanguage } from 'src/hooks'

// ============================================
// Задание 0.2: Детектор побочных эффектов
// Task 0.2: Side Effect Detector
// ============================================
// Классифицируйте каждую функцию как Pure или Impure.
// Classify each function as Pure or Impure.
// Кликните на карточку, чтобы переключить метку.
// Click a card to toggle its label.

// TODO: Опишите тип карточки
// TODO: Describe the card type
// interface CardDef {
//   id: number
//   code: string
//   isPure: boolean       // правильный ответ / correct answer
//   explanation: string  // объяснение / explanation
// }

// TODO: Создайте массив CARDS с 8 карточками:
// TODO: Create a CARDS array with 8 cards:
// 1. '(x) => x * 2'                          — Pure
// 2. '(x) => { arr.push(x); return x }'      — Impure (мутация / mutation)
// 3. '() => Math.random()'                   — Impure (недетерм. / non-determinism)
// 4. '(x) => console.log(x)'                 — Impure (I/O)
// 5. '(a, b) => a + b'                       — Pure
// 6. '() => new Date().getTime()'            — Impure (время / time)
// 7. '(obj) => ({ ...obj, done: true })'     — Pure
// 8. '(arr) => arr.sort()'                   — Impure (мутация / mutation)
// const CARDS: CardDef[] = [...]

export function Task0_2() {
  const { t } = useLanguage()

  // TODO: Состояние для ответов пользователя: { [id]: boolean } (true = Pure, false = Impure)
  // TODO: State for user guesses: { [id]: boolean } (true = Pure, false = Impure)
  const [guesses, setGuesses] = useState<Record<number, boolean>>({})

  // TODO: Состояние — показывать ли результат проверки
  // TODO: State — whether to show check results
  const [checked, setChecked] = useState(false)

  // TODO: Функция toggle(id) — переключает метку карточки (если checked — ничего не делать)
  // TODO: Function toggle(id) — toggles card label (do nothing if checked)
  const toggle = (_id: number) => {
    // Подсказка: guesses[id] ?? true — по умолчанию Pure
    // Hint: guesses[id] ?? true — defaults to Pure
  }

  // TODO: Функция check() — устанавливает checked = true
  // TODO: Function check() — sets checked = true
  const check = () => setChecked(true)

  // TODO: Функция reset() — сбрасывает guesses и checked
  // TODO: Function reset() — resets guesses and checked
  const reset = () => {
    setGuesses({})
    setChecked(false)
  }

  return (
    <div className="exercise-container">
      <h2>{t('task.0.2')}</h2>
      <p style={{ color: '#6b7280', fontSize: '0.9rem' }}>
        Кликните на карточку, чтобы переключить Pure / Impure. Затем нажмите "Проверить".
      </p>

      {/* TODO: Отрендерите сетку карточек */}
      {/* TODO: Render the card grid */}
      {/* Для каждой карточки: */}
      {/* For each card: */}
      {/* - Код функции в <code> */}
      {/*   Function code in <code> */}
      {/* - Метка Pure / Impure (зависит от guesses[card.id] ?? true) */}
      {/*   Label Pure / Impure (depends on guesses[card.id] ?? true) */}
      {/* - При checked: зелёная/красная рамка + объяснение */}
      {/*   When checked: green/red border + explanation */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '0.75rem', marginBottom: '1rem' }}>
        {/* Временная заглушка / Temporary placeholder */}
        <div style={{ padding: '1rem', background: '#f9fafb', borderRadius: '8px', border: '2px solid #e5e7eb' }}>
          <code style={{ fontSize: '0.85rem' }}>(x) =&gt; x * 2</code>
          <div style={{ marginTop: '0.5rem', color: '#6b7280', fontSize: '0.8rem' }}>
            Реализуйте карточки согласно CARDS
          </div>
        </div>
      </div>

      {/* TODO: Кнопка "Проверить" (скрыть после проверки) */}
      {/* TODO: "Check" button (hide after checking) */}
      {!checked ? (
        <button
          onClick={check}
          style={{ background: '#3b82f6', color: '#fff', border: 'none', borderRadius: '6px', padding: '0.5rem 1.2rem', cursor: 'pointer' }}
        >
          Проверить
        </button>
      ) : (
        <>
          {/* TODO: Показать счётчик "Правильно: X / 8" */}
          {/* TODO: Show counter "Correct: X / 8" */}
          <div style={{ marginBottom: '0.5rem', color: '#15803d' }}>Правильно: ? / 8</div>
          <button
            onClick={reset}
            style={{ background: '#6b7280', color: '#fff', border: 'none', borderRadius: '6px', padding: '0.5rem 1.2rem', cursor: 'pointer' }}
          >
            Попробовать снова
          </button>
        </>
      )}

      {/* Чтобы убрать предупреждение unused variable */}
      {/* To suppress unused variable warning */}
      <span style={{ display: 'none' }}>{JSON.stringify(guesses)}</span>
      <span style={{ display: 'none' }} onClick={() => toggle(0)} />
    </div>
  )
}
