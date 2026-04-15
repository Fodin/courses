/**
 * Cheat Sheet: Level 13 — Реальные проекты
 *
 * Используйте этот файл как справочник при выполнении заданий.
 * Не копируйте код напрямую — попробуйте написать самостоятельно.
 */

// ============================================================
// 1. Either (fail-fast) vs Validation (collect all)
// ============================================================

// --- Either monad ---
type Left<E>  = { tag: 'Left'; value: E }
type Right<A> = { tag: 'Right'; value: A }
type Either<E, A> = Left<E> | Right<A>

const Left  = <E,>(value: E): Left<E>  => ({ tag: 'Left', value })
const Right = <A,>(value: A): Right<A> => ({ tag: 'Right', value })
const isLeft  = <E, A>(e: Either<E, A>): e is Left<E>  => e.tag === 'Left'
const isRight = <E, A>(e: Either<E, A>): e is Right<A> => e.tag === 'Right'

// map: применяет f только к Right, Left пропускает
const mapRight = <E, A, B>(e: Either<E, A>, f: (a: A) => B): Either<E, B> =>
  isRight(e) ? Right(f(e.value)) : e

// flatMap: monadic bind — разворачивает вложенный Either
const flatMap = <E, A, B>(e: Either<E, A>, f: (a: A) => Either<E, B>): Either<E, B> =>
  isRight(e) ? f(e.value) : e

// --- Either (fail-fast): цепочка прерывается на первой ошибке ---
//
// flatMap(validateA(a), resultA =>
//   flatMap(validateB(b), resultB =>
//     map(validateC(c), resultC =>
//       ({ a: resultA, b: resultB, c: resultC })
//     )
//   )
// )
//
// При первой ошибке Left(error) — вся цепочка возвращает его.
// Остальные валидаторы не вызываются (lazy/monadic).

// --- Validation (collect all): все ошибки сразу ---
type Validation<E, A> = Either<E[], A>  // Left содержит МАССИВ ошибок

function validateAll<A>(
  validators: Array<Either<string, unknown>>,
  assembleSuccess: () => A
): Validation<string, A> {
  const errors = validators.filter(isLeft).map(e => (e as Left<string>).value)
  return errors.length > 0 ? Left(errors) : Right(assembleSuccess())
}
// Все валидаторы запускаются независимо — это applicative, не monad.
// Используй когда нужно показать пользователю ВСЕ ошибки формы.

// ============================================================
// 2. Composable API-клиент через каррирование
// ============================================================

interface ApiRequest {
  method: string
  url: string
  headers: Record<string, string>
  body?: unknown
}

// Каррированный builder: каждый аргумент возвращает функцию
const request = (method: string) => (url: string) => (headers: Record<string, string>) => (body?: unknown): ApiRequest =>
  ({ method, url, headers, body })

const get  = request('GET')
const post = request('POST')

// Middleware — pure функции: принимают и возвращают ApiRequest
const withAuth = (token: string) => (req: ApiRequest): ApiRequest => ({
  ...req,
  headers: { ...req.headers, Authorization: `Bearer ${token}` },
})

const withContentType = (req: ApiRequest): ApiRequest => ({
  ...req,
  headers: { ...req.headers, 'Content-Type': 'application/json' },
})

// Сборка запроса (ручной pipe):
// const req = withAuth('token')(get('/api/users/1')({})(undefined))
// Эквивалент pipe(get('/api/users/1')({})(undefined), withAuth('token'))

// Почему middleware pure?
// ❌ req.headers['Auth'] = token  — мутация, нарушает referential transparency
// ✅ return { ...req, headers: { ...req.headers, Authorization: token } }

// ============================================================
// 3. Event processing pipeline
// ============================================================

// Каждый этап — pure функция с единственной обязанностью:
//
// enrich:   RawEvent   → EnrichedEvent  (добавляет данные, не теряет)
// validate: Enriched   → Either<E, Enriched>  (фильтрует невалидные)
// route:    Enriched   → { channel, event }   (маршрутизирует)
// aggregate: results   → stats               (accumulate)
//
// Pipeline:
// rawEvents.map(enrich)
//          .map(validateEvent)
//          .filter(isRight)
//          .map(e => e.value)
//          .map(routeEvent)
//          ...

// Enrich: pure, всегда успешен
function exampleEnrich<T extends { userId: string; timestamp: number }>(event: T) {
  return {
    ...event,
    sessionId: `sess_${event.userId}_${Math.floor(event.timestamp / 60000)}`,
    processed: true,
  }
}

// Validate: Either — может отклонить
function exampleValidate<T extends { id: string }>(event: T): Either<string, T> {
  if (!event.id) return Left('missing id')
  return Right(event)
}

// Route: pure, распределяет по каналам
function exampleRoute<T extends { type: string }>(event: T): { channel: string; event: T } {
  const channel = event.type === 'purchase' ? 'billing'
    : event.type === 'click' ? 'analytics'
    : 'metrics'
  return { channel, event }
}

// ============================================================
// 4. Когда FP — overkill
// ============================================================

// FP ОПРАВДАН когда:
//   - логика трансформации данных сложная (pipe выигрывает у if/else)
//   - нужна композируемость (middleware, validators)
//   - важна тестируемость (pure функции тестируются без моков)
//   - несколько стратегий поведения (Either vs Validation)

// FP — OVERKILL когда:
//   - простой CRUD без бизнес-логики
//   - одноразовый скрипт
//   - команда не знакома с FP-паттернами
//   - overhead абстракций дороже выигрыша

// ============================================================
// 5. Частые ошибки
// ============================================================

// ОШИБКА 1: Either вместо Validation для формы
// ❌ flatMap(validateName(name), n => flatMap(validateEmail(email), e => ...))
//    → пользователь видит только первую ошибку
// ✅ Используй validateAll() или Validation-подход для форм

// ОШИБКА 2: Мутация в middleware
// ❌ const withAuth = (token, req) => { req.headers.Authorization = 'Bearer ' + token; return req }
// ✅ const withAuth = (token) => (req) => ({ ...req, headers: { ...req.headers, Authorization: 'Bearer ' + token } })

// ОШИБКА 3: Staging ошибок без Either в pipeline
// ❌ if (!event.id) { console.error('bad'); return null }
//    → null распространяется в pipeline, падает позже
// ✅ return Left('missing id') — ошибка типизирована и обрабатывается явно

// ОШИБКА 4: Смешивание трансформации и побочных эффектов
// ❌ const enrich = (event) => { db.log(event); return { ...event, sessionId: ... } }
// ✅ const enrich = (event) => ({ ...event, sessionId: ... })
//    (побочные эффекты — отдельно, после pipeline)

export {}
