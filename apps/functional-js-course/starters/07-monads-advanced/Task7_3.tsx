import { useState } from 'react'
import { useLanguage } from 'src/hooks'

// ============================================
// Either<L, R> — из предыдущего уровня (используется здесь)
// ============================================

type Either<L, R> = { tag: 'Left'; value: L } | { tag: 'Right'; value: R }

function Left<L>(value: L): Either<L, never> { return { tag: 'Left', value } }
function Right<R>(value: R): Either<never, R> { return { tag: 'Right', value } }

function eitherFlatMap<L, R, R2>(e: Either<L, R>, fn: (v: R) => Either<L, R2>): Either<L, R2> {
  return e.tag === 'Right' ? fn(e.value) : e
}

// ============================================
// TODO 1: Реализуйте функцию Do<L, R>
//
// Do принимает фабрику генератора и возвращает Either.
// Механика:
// 1. Создать итератор через gen()
// 2. Вызвать iterator.next() — генератор дойдёт до первого yield
// 3. Проверить result.value (Either):
//    - Если Left → вернуть его немедленно (short-circuit)
//    - Если Right → вызвать iterator.next(either.value) — передаёт распакованное значение
// 4. Повторять до result.done === true
// 5. Обернуть result.value в Right и вернуть
// ============================================

// function Do<L, R>(gen: () => Generator<Either<L, any>, R, any>): Either<L, R> {
//   const iterator = gen()
//   let result = iterator.next()
//   while (!result.done) {
//     const either = result.value as Either<L, unknown>
//     if (either.tag === 'Left') return either as Either<L, R>
//     result = iterator.next(either.value)
//   }
//   return Right(result.value)
// }

// ============================================
// TODO 2: Реализуйте 4 валидатора → Either<string, T>
//
// Каждый должен возвращать Left(сообщение) при ошибке, Right(значение) при успехе.
// ============================================

// function parseHost(host: string): Either<string, string> {
//   if (!host.trim()) return Left('host не может быть пустым')
//   if (!/^[\w.-]+$/.test(host.trim())) return Left('host содержит недопустимые символы')
//   return Right(host.trim())
// }

// function parsePort(port: string): Either<string, number> {
//   const n = parseInt(port, 10)
//   if (isNaN(n)) return Left(`port "${port}" не является числом`)
//   if (n < 1 || n > 65535) return Left(`port ${n} вне допустимого диапазона (1-65535)`)
//   return Right(n)
// }

// function parseDbName(name: string): Either<string, string> {
//   if (!name.trim()) return Left('dbName не может быть пустым')
//   if (!/^[a-z_][a-z0-9_]*$/i.test(name.trim())) return Left('dbName должен быть валидным идентификатором')
//   return Right(name.trim())
// }

// function parseTimeout(timeout: string): Either<string, number> {
//   const n = parseInt(timeout, 10)
//   if (isNaN(n) || n <= 0) return Left(`timeout "${timeout}" должен быть положительным числом`)
//   if (n > 30000) return Left('timeout не может превышать 30000ms')
//   return Right(n)
// }

// ============================================
// TODO 3: Реализуйте parseConfigFlatMap
//
// Используйте вложенный eitherFlatMap (4 уровня).
// Финальный результат: Right({ host, port, dbName, timeout, connectionString })
// где connectionString = `postgres://${host}:${port}/${dbName}?timeout=${timeout}`
// ============================================

// interface ParsedConfig { host: string; port: number; dbName: string; timeout: number; connectionString: string }
// interface ConfigInput { host: string; port: string; dbName: string; timeout: string }

// function parseConfigFlatMap(input: ConfigInput): Either<string, ParsedConfig> {
//   return eitherFlatMap(parseHost(input.host), host =>
//     eitherFlatMap(parsePort(input.port), port =>
//       eitherFlatMap(parseDbName(input.dbName), dbName =>
//         eitherFlatMap(parseTimeout(input.timeout), timeout =>
//           Right({ host, port, dbName, timeout,
//             connectionString: `postgres://${host}:${port}/${dbName}?timeout=${timeout}` })
//         )
//       )
//     )
//   )
// }

// ============================================
// TODO 4: Реализуйте parseConfigDo через Do-нотацию
//
// Используйте Do(function* () { ... }) с yield для каждого шага.
// Результат должен быть идентичен parseConfigFlatMap.
// ============================================

// function parseConfigDo(input: ConfigInput): Either<string, ParsedConfig> {
//   return Do(function* () {
//     const host    = yield parseHost(input.host)
//     const port    = yield parsePort(input.port)
//     const dbName  = yield parseDbName(input.dbName)
//     const timeout = yield parseTimeout(input.timeout)
//     return { host, port, dbName, timeout,
//       connectionString: `postgres://${host}:${port}/${dbName}?timeout=${timeout}` }
//   })
// }

// Подавляем lint — функции используются в TODO-компоненте
void Left
void Right
void eitherFlatMap

export function Task7_3() {
  const { t } = useLanguage()
  const [input, setInput] = useState({ host: 'localhost', port: '5432', dbName: 'mydb', timeout: '3000' })
  const [executed, setExecuted] = useState(false)
  void input
  void setInput
  void executed
  void setExecuted

  return (
    <div className="exercise-container">
      <h2>{t('task.7.3')}</h2>

      {/* TODO 5: Добавьте 4 поля ввода: host, port, dbName, timeout */}

      {/* TODO 6: Добавьте кнопки:
          "Выполнить оба подхода" — запускает parseConfigFlatMap и parseConfigDo
          "Невалидные данные" — устанавливает заведомо ошибочные значения
          "Сбросить" — возвращает исходные значения */}

      {/* TODO 7: Добавьте два столбца:
          Левый — "flatMap цепочка" с кодом и результатом parseConfigFlatMap
          Правый — "Do-нотация" с кодом и результатом parseConfigDo */}

      {/* TODO 8: Добавьте индикатор внизу:
          Зелёный — "Результаты идентичны. Do-нотация — синтаксический сахар над flatMap."
          Красный — "Результаты различаются — это баг в реализации Do." */}
    </div>
  )
}
