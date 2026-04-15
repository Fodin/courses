import { useState } from 'react'
import { useLanguage } from 'src/hooks'

// ============================================================
// Задание 13.1: FP-валидация формы (Either vs Validation)
//
// Цель: реализовать две стратегии валидации:
//   1. Either (fail-fast) — цепочка прерывается на первой ошибке
//   2. Validation (collect all) — собирает ВСЕ ошибки сразу
// ============================================================

// --- Either monad ---

type Left<E> = { tag: 'Left'; value: E }
type Right<A> = { tag: 'Right'; value: A }
type Either<E, A> = Left<E> | Right<A>

function Left<E>(value: E): Left<E> { return { tag: 'Left', value } }
function Right<A>(value: A): Right<A> { return { tag: 'Right', value } }
function isLeft<E, A>(e: Either<E, A>): e is Left<E> { return e.tag === 'Left' }
function isRight<E, A>(e: Either<E, A>): e is Right<A> { return e.tag === 'Right' }

// ============================================================
// TODO 1: Реализуй вспомогательные функции Either
//
// mapRight(e, f) — применяет f к значению Right, Left пропускает
// flatMap(e, f)  — применяет f к значению Right и возвращает Either,
//                  Left пропускает (monadic chain / flatMap)
// ============================================================

function mapRight<E, A, B>(e: Either<E, A>, f: (a: A) => B): Either<E, B> {
  // TODO: если isRight(e) — вернуть Right(f(e.value)), иначе e
  return e as unknown as Either<E, B> // заглушка
}

function flatMap<E, A, B>(e: Either<E, A>, f: (a: A) => Either<E, B>): Either<E, B> {
  // TODO: если isRight(e) — вернуть f(e.value), иначе e
  return e as unknown as Either<E, B> // заглушка
}

// --- Types ---

interface FormData {
  name: string
  email: string
  age: string
  password: string
}

interface ValidData {
  name: string
  email: string
  age: number
  password: string
}

// ============================================================
// TODO 2: Реализуй валидаторы полей
//
// Каждый возвращает Either<string, T>:
// Left(сообщение об ошибке) или Right(корректное значение)
//
// Правила:
//   validateName   — не пустое, 2-50 символов
//   validateEmail  — содержит '@' и '.'
//   validateAge    — число от 18 до 120
//   validatePassword — минимум 8 символов, хотя бы 1 цифра (\d),
//                      хотя бы 1 заглавная буква ([A-Z])
// ============================================================

function validateName(name: string): Either<string, string> {
  // TODO
  return Right(name) // заглушка
}

function validateEmail(email: string): Either<string, string> {
  // TODO
  return Right(email) // заглушка
}

function validateAge(ageStr: string): Either<string, number> {
  // TODO
  return Right(0) // заглушка
}

function validatePassword(password: string): Either<string, string> {
  // TODO
  return Right(password) // заглушка
}

// ============================================================
// TODO 3: Реализуй validateEither — fail-fast стратегию
//
// Используй flatMap для построения цепочки:
//   1. validateName → если Right(name), идём дальше
//   2. validateEmail → если Right(email), собираем { name, email }
//   3. validateAge → добавляем age
//   4. validatePassword → финальный Right<ValidData> или первый Left
//
// При первой ошибке вся цепочка возвращает Left и прерывается.
// ============================================================

function validateEither(data: FormData): Either<string, ValidData> {
  // TODO: flatMap(validateName(data.name), name =>
  //         flatMap(validateEmail(data.email), email =>
  //           ...
  //         )
  //       )
  return Left('не реализовано')
}

// ============================================================
// TODO 4: Реализуй validateCollect — collect all стратегию
//
// type Validation<E, A> = Either<E[], A>
//
// Запусти ВСЕ валидаторы независимо.
// Собери все Left-значения в массив ошибок.
// Если ошибок нет — верни Right({ name, email, age, password }).
// Если есть ошибки — верни Left(errors) где errors: string[].
// ============================================================

type Validation<E, A> = Either<E[], A>

function validateCollect(data: FormData): Validation<string, ValidData> {
  // TODO:
  // const nameR = validateName(data.name)
  // const emailR = validateEmail(data.email)
  // ...
  // const errors = [...].filter(isLeft).map(e => e.value)
  // if (errors.length > 0) return Left(errors)
  // return Right({ ... })
  return Left(['не реализовано'])
}

// ============================================================
// Компонент задания — завершите TODO выше, UI готов
// ============================================================

export function Task13_1() {
  const { t } = useLanguage()
  const [mode, setMode] = useState<'failfast' | 'collect'>('failfast')
  const [form, setForm] = useState<FormData>({ name: '', email: '', age: '', password: '' })
  const [submitted, setSubmitted] = useState(false)
  const [result, setResult] = useState<Either<string | string[], ValidData> | null>(null)

  const handleSubmit = () => {
    setSubmitted(true)
    if (mode === 'failfast') {
      setResult(validateEither(form))
    } else {
      setResult(validateCollect(form))
    }
  }

  const handleReset = () => {
    setForm({ name: '', email: '', age: '', password: '' })
    setSubmitted(false)
    setResult(null)
  }

  const fields: Array<{ key: keyof FormData; label: string; placeholder: string }> = [
    { key: 'name', label: 'Имя', placeholder: 'Иван Иванов' },
    { key: 'email', label: 'Email', placeholder: 'user@example.com' },
    { key: 'age', label: 'Возраст', placeholder: '25' },
    { key: 'password', label: 'Пароль', placeholder: 'Secret1Pass' },
  ]

  const inputStyle: React.CSSProperties = {
    background: '#0f172a',
    border: '1px solid #374151',
    color: '#e5e7eb',
    borderRadius: '4px',
    padding: '0.4rem 0.6rem',
    fontFamily: 'monospace',
    fontSize: '0.82rem',
    width: '100%',
    boxSizing: 'border-box',
  }

  const btnStyle = (active?: boolean): React.CSSProperties => ({
    background: active ? '#1e3a5f' : '#374151',
    color: active ? '#93c5fd' : '#e5e7eb',
    border: `1px solid ${active ? '#3b82f6' : '#4b5563'}`,
    borderRadius: '6px',
    padding: '0.35rem 0.9rem',
    cursor: 'pointer',
    fontSize: '0.82rem',
    fontFamily: 'monospace',
    marginRight: '0.5rem',
  })

  return (
    <div className="exercise-container">
      <h2>{t('task.13.1')}</h2>

      {/* Mode switcher */}
      <div style={{ marginBottom: '1rem' }}>
        <button style={btnStyle(mode === 'failfast')} onClick={() => { setMode('failfast'); handleReset() }}>
          Either (fail-fast)
        </button>
        <button style={btnStyle(mode === 'collect')} onClick={() => { setMode('collect'); handleReset() }}>
          Validation (collect all)
        </button>
      </div>

      {/* Form */}
      <div style={{ background: '#1f2937', borderRadius: '8px', padding: '1rem', marginBottom: '1rem' }}>
        {fields.map(f => (
          <div key={f.key} style={{ marginBottom: '0.75rem' }}>
            <label style={{ display: 'block', color: '#9ca3af', marginBottom: '0.25rem', fontSize: '0.82rem' }}>
              {f.label}
            </label>
            <input
              value={form[f.key]}
              onChange={e => { setForm(prev => ({ ...prev, [f.key]: e.target.value })); setSubmitted(false); setResult(null) }}
              placeholder={f.placeholder}
              style={inputStyle}
            />
          </div>
        ))}
        <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
          <button
            onClick={handleSubmit}
            style={{ ...btnStyle(), background: '#14532d', color: '#86efac', border: '1px solid #22c55e' }}
          >
            Отправить
          </button>
          <button onClick={handleReset} style={btnStyle()}>Сбросить</button>
        </div>
      </div>

      {/* Result */}
      {submitted && result && (
        <div style={{ background: '#1f2937', borderRadius: '8px', padding: '1rem' }}>
          <div style={{ color: '#9ca3af', fontSize: '0.82rem', marginBottom: '0.5rem' }}>Результат:</div>
          {isLeft(result) ? (
            <div style={{ color: '#fca5a5' }}>
              {Array.isArray(result.value)
                ? (result.value as string[]).map((e, i) => <div key={i}>- {e}</div>)
                : String(result.value)
              }
            </div>
          ) : (
            <pre style={{ color: '#86efac', fontSize: '0.82rem', margin: 0 }}>
              {JSON.stringify(result.value, null, 2)}
            </pre>
          )}
        </div>
      )}

      <p style={{ color: '#6b7280', fontSize: '0.82rem', marginTop: '1rem' }}>
        Ожидается: Either — останавливается на первой ошибке. Validation — собирает все ошибки сразу.
      </p>
    </div>
  )
}
