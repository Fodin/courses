/**
 * Cheat Sheet: Level 6 — Maybe и Either
 *
 * Используйте этот файл как справочник при выполнении заданий.
 * Не копируйте код напрямую — попробуйте написать самостоятельно.
 */

// ============================================================
// 1. MAYBE — контейнер для опционального значения
// ============================================================

type Maybe<T> = { tag: 'Some'; value: T } | { tag: 'None' }

// Конструкторы
function Some<T>(value: T): Maybe<T> { return { tag: 'Some', value } }
const None: Maybe<never> = { tag: 'None' }

// fromNullable — точка входа
function fromNullable<T>(v: T | null | undefined): Maybe<T> {
  return v == null ? None : Some(v)
}

// map — трансформация содержимого
function maybeMap<T, U>(m: Maybe<T>, fn: (v: T) => U): Maybe<U> {
  return m.tag === 'Some' ? Some(fn(m.value)) : None
}

// flatMap — для функций, возвращающих Maybe (избегаем Maybe<Maybe<T>>)
function maybeFlatMap<T, U>(m: Maybe<T>, fn: (v: T) => Maybe<U>): Maybe<U> {
  return m.tag === 'Some' ? fn(m.value) : None
}

// getOrElse — извлечение с fallback
function getOrElse<T>(m: Maybe<T>, fallback: T): T {
  return m.tag === 'Some' ? m.value : fallback
}

// Пример цепочки:
// getOrElse(
//   maybeFlatMap(fromNullable(user.address), a => fromNullable(a.city)),
//   'N/A'
// )
// => 'Москва' или 'N/A'

// ============================================================
// 2. EITHER — контейнер с двумя состояниями (ошибка / успех)
// ============================================================

type Either<L, R> = { tag: 'Left'; value: L } | { tag: 'Right'; value: R }

// Конструкторы — Left = ошибка, Right = успех (right = "правильный")
function Left<L>(value: L): Either<L, never> { return { tag: 'Left', value } }
function Right<R>(value: R): Either<never, R> { return { tag: 'Right', value } }

// map — работает только с Right, Left проходит насквозь
function eitherMap<L, R, R2>(e: Either<L, R>, fn: (v: R) => R2): Either<L, R2> {
  return e.tag === 'Right' ? Right(fn(e.value)) : e
}

// flatMap — railway-oriented: при Left следующие шаги пропускаются
function eitherFlatMap<L, R, R2>(e: Either<L, R>, fn: (v: R) => Either<L, R2>): Either<L, R2> {
  return e.tag === 'Right' ? fn(e.value) : e
}

// match (fold) — обработка обоих случаев
function match<L, R, T>(
  e: Either<L, R>,
  onLeft: (v: L) => T,
  onRight: (v: R) => T
): T {
  return e.tag === 'Left' ? onLeft(e.value) : onRight(e.value)
}

// ============================================================
// 3. Конвертация Maybe ↔ Either
// ============================================================

// Maybe → Either (добавляем описание ошибки для None)
function maybeToEither<T>(m: Maybe<T>, error: string): Either<string, T> {
  return m.tag === 'Some' ? Right(m.value) : Left(error)
}

// Either → Maybe (теряем информацию об ошибке)
function eitherToMaybe<L, R>(e: Either<L, R>): Maybe<R> {
  return e.tag === 'Right' ? Some(e.value) : None
}

// ============================================================
// 4. Паттерн валидации через Either
// ============================================================

// Каждый валидатор возвращает Either<string, T>
function validateName(name: string): Either<string, string> {
  if (!name.trim()) return Left('Имя не может быть пустым')
  if (name.trim().length < 2) return Left('Минимум 2 символа')
  return Right(name.trim())
}

// Цепочка через flatMap — останавливается на первой ошибке
// const result = eitherFlatMap(
//   validateName(name),
//   validName => eitherFlatMap(
//     validateEmail(email),
//     validEmail => eitherMap(
//       validateAge(age),
//       validAge => ({ name: validName, email: validEmail, age: validAge })
//     )
//   )
// )

// ============================================================
// 5. Правила выбора Maybe vs Either
// ============================================================

// Maybe: отсутствие — нормальная ситуация (поиск в массиве, опциональные поля)
// Either: отсутствие — это ошибка с причиной (валидация, парсинг, HTTP)

// Аналогия: Maybe — пустой конверт (нормально), Either — конверт с пометкой
// "возврат: недостаточно марок"

// Помечаем функции как используемые (для отключения lint-ошибок)
void maybeMap
void eitherMap
void eitherToMaybe
void validateName

export {}  // файл только для чтения, не для импорта
