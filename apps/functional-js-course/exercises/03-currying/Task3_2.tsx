import { useState } from 'react'
import { useLanguage } from 'src/hooks'

// ============================================
// Задание 3.2: Частичное применение
// Task 3.2: Partial Application
// ============================================
// Реализуйте функцию partial(fn, ...presetArgs).
// Implement the partial(fn, ...presetArgs) function.
//
// partial фиксирует первые аргументы и возвращает функцию,
// которая принимает оставшиеся.
// partial fixes the first arguments and returns a function
// that accepts the remaining ones.
//
// Примеры / Examples:
//   const double = partial(multiply, 2)
//   double(5)         // 10
//
//   const greetUser = partial(greet, 'Привет')
//   greetUser('Иван') // 'Привет, Иван!'

// TODO: Реализуйте partial с типами (без any)
// TODO: Implement partial with types (no any)
// function partial<T extends unknown[], R>(
//   fn: (...args: T) => R,
//   ...presetArgs: ???
// ): (...remainingArgs: ???) => R {
//   return (...remainingArgs) => fn(??? as T)
// }

// Исходные функции / Source functions
function multiply(a: number, b: number): number {
  return a * b
}

function greet(greeting: string, name: string): string {
  return `${greeting}, ${name}!`
}

function formatDate(locale: string, date: string): string {
  const d = new Date(date)
  if (isNaN(d.getTime())) return 'Неверная дата'
  return d.toLocaleDateString(locale, { day: 'numeric', month: 'long', year: 'numeric' })
}

// TODO: Создайте частично применённые функции
// TODO: Create partially applied functions
// const double        = partial(multiply, 2)
// const addTax        = partial(multiply, 1.2)
// const greetUser     = partial(greet, 'Привет')
// const formatRuDate  = partial(formatDate, 'ru-RU')

export function Task3_2() {
  const { t } = useLanguage()

  // TODO: Добавьте состояние для значений в каждой карточке
  // TODO: Add state for input values in each card
  // Пример: const [numValue, setNumValue] = useState('5')

  // TODO: Добавьте состояние для режима отображения ('partial' | 'curry')
  // TODO: Add state for display mode ('partial' | 'curry')

  return (
    <div className="exercise-container">
      <h2>{t('task.3.2')}</h2>

      {/* TODO: Добавьте переключатель "partial / curry" */}
      {/* TODO: Add "partial / curry" toggle */}
      {/* Режим partial: показывает реализацию partial */}
      {/* partial mode: shows partial implementation */}
      {/* Режим curry: показывает как то же делается через curry + объясняет разницу */}
      {/* curry mode: shows curry alternative + explains the difference */}

      {/* TODO: Карточка 1 — double */}
      {/* TODO: Card 1 — double */}
      {/* Заголовок: double = partial(multiply, 2) */}
      {/* Поле: число, результат: double(число) */}
      {/* Header: double = partial(multiply, 2) */}
      {/* Input: number, result: double(number) */}

      {/* TODO: Карточка 2 — addTax */}
      {/* TODO: Card 2 — addTax */}
      {/* Заголовок: addTax = partial(multiply, 1.2) */}
      {/* Поле: цена, результат: addTax(цена) с округлением */}
      {/* Header: addTax = partial(multiply, 1.2) */}
      {/* Input: price, result: addTax(price) with rounding */}

      {/* TODO: Карточка 3 — greetUser */}
      {/* TODO: Card 3 — greetUser */}
      {/* Заголовок: greetUser = partial(greet, 'Привет') */}
      {/* Поле: имя (строка), результат: greetUser(имя) */}
      {/* Header: greetUser = partial(greet, 'Привет') */}
      {/* Input: name (string), result: greetUser(name) */}

      {/* TODO: Карточка 4 — formatRuDate */}
      {/* TODO: Card 4 — formatRuDate */}
      {/* Заголовок: formatRuDate = partial(formatDate, 'ru-RU') */}
      {/* Поле: дата YYYY-MM-DD, результат: formatRuDate(дата) */}
      {/* Header: formatRuDate = partial(formatDate, 'ru-RU') */}
      {/* Input: date YYYY-MM-DD, result: formatRuDate(date) */}
    </div>
  )
}
