import { useState } from 'react'
import { useLanguage } from 'src/hooks'

// ============================================
// Переиспользуйте Maybe и Either из заданий 6.1 и 6.2
// (здесь продублированы для самодостаточности файла)
// ============================================

type Maybe<T> = { tag: 'Some'; value: T } | { tag: 'None' }
type Either<L, R> = { tag: 'Left'; value: L } | { tag: 'Right'; value: R }

// Конструкторы (реализованы для вас как пример)
function Some<T>(value: T): Maybe<T> { return { tag: 'Some', value } }
const None: Maybe<never> = { tag: 'None' }
function Left<L>(value: L): Either<L, never> { return { tag: 'Left', value } }
function Right<R>(value: R): Either<never, R> { return { tag: 'Right', value } }

function fromNullable<T>(v: T | null | undefined): Maybe<T> {
  return v == null ? None : Some(v)
}

// TODO 1: Реализуйте maybeFlatMap
// function maybeFlatMap<T, U>(m: Maybe<T>, fn: (v: T) => Maybe<U>): Maybe<U> { ... }

// TODO 2: Реализуйте eitherFlatMap
// function eitherFlatMap<L, R, R2>(e: Either<L, R>, fn: (v: R) => Either<L, R2>): Either<L, R2> { ... }

// ============================================
// TODO 3: Реализуйте maybeToEither
// Конвертирует Maybe<T> в Either<string, T>
// None → Left(error), Some(v) → Right(v)
// ============================================
// function maybeToEither<T>(m: Maybe<T>, error: string): Either<string, T> { ... }

// ============================================
// Mock DB (используйте как есть)
// ============================================

interface DbUser {
  id: number
  name: string
  subscriptionId?: number
}

interface DbSubscription {
  id: number
  plan: string
  status: 'active' | 'expired'
}

const MOCK_USERS: DbUser[] = [
  { id: 1, name: 'Алиса', subscriptionId: 101 },
  { id: 2, name: 'Борис' },
  { id: 3, name: 'Галина', subscriptionId: 102 },
]

const MOCK_SUBSCRIPTIONS: DbSubscription[] = [
  { id: 101, plan: 'Pro', status: 'active' },
  { id: 102, plan: 'Basic', status: 'expired' },
]

// ============================================
// TODO 4: Реализуйте функции pipeline
// ============================================

// parseUserId: строку → Either<string, number>
// Проверки: не пусто, isNaN, n > 0
// function parseUserId(input: string): Either<string, number> { ... }

// findUser: number → Maybe<DbUser>
// Ищет в MOCK_USERS через fromNullable(array.find(...))
// function findUser(id: number): Maybe<DbUser> { ... }

// getSubscription: DbUser → Maybe<DbSubscription>
// Если subscriptionId нет → None
// Ищет в MOCK_SUBSCRIPTIONS
// function getSubscription(user: DbUser): Maybe<DbSubscription> { ... }

// formatPlan: DbSubscription → string
// Формат: "Pro (активна)" или "Basic (истекла)"
// function formatPlan(sub: DbSubscription): string { ... }

// ============================================
// TODO 5: Реализуйте runPipeline
// Соедините все 4 шага, используя maybeToEither для конвертации
// Возвращайте объект с состоянием каждого шага: 'ok' | 'fail' | 'skipped'
// ============================================

// type StepState =
//   | { status: 'ok'; value: string }
//   | { status: 'fail'; error: string }
//   | { status: 'skipped' }

// function runPipeline(input: string): { parse: StepState; findUser: StepState; getSub: StepState; format: StepState } { ... }

// Заглушки чтобы TypeScript не жаловался на неиспользуемые импорты
void Some
void None
void Left
void Right
void fromNullable
void MOCK_USERS
void MOCK_SUBSCRIPTIONS

export function Task6_3() {
  const { t } = useLanguage()
  const [input, setInput] = useState('')

  // const steps = input ? runPipeline(input) : null

  return (
    <div className="exercise-container">
      <h2>{t('task.6.3')}</h2>

      {/* TODO 6: Поле ввода userId */}
      {/* Placeholder "Введите ID..." */}
      <input
        value={input}
        onChange={e => setInput(e.target.value)}
        placeholder="Введите ID..."
        style={{ background: '#1f2937', color: '#e5e7eb', border: '1px solid #4b5563', borderRadius: '6px', padding: '0.4rem', fontFamily: 'monospace' }}
      />

      {/* TODO 7: Preset-кнопки
          "abc" → parse error
          "999" → user not found
          "2"   → no subscription
          "1"   → success (Pro)
          "3"   → success (Basic expired) */}

      {/* TODO 8: Визуализация шагов
          4 блока вертикально:
          - parseUserId (string → Either<string, number>)
          - findUser (number → Maybe<User>)
          - getSubscription (User → Maybe<Subscription>)
          - formatPlan (Subscription → string)

          Цвет блока: зелёный (ok), красный (fail), серый (skipped) */}

      {/* TODO 9: Блок mock DB (таблицы Users и Subscriptions) */}
    </div>
  )
}
