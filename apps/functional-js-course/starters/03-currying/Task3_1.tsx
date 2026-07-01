import { useState } from 'react'
import { useLanguage } from 'src/hooks'

// ============================================
// Задание 3.1: Ручное каррирование
// Task 3.1: Manual Currying
// ============================================
// Реализуйте функцию curry(fn), которая принимает функцию произвольной арности
// и возвращает каррированную версию.
// Implement a curry(fn) function that takes a function of any arity
// and returns its curried version.
//
// Каррированная функция:
// A curried function:
//   - если переданы все аргументы — вызывает оригинальную функцию
//     if all arguments are provided — calls the original function
//   - если аргументов не хватает — возвращает новую функцию, ждущую остальные
//     if arguments are missing — returns a new function waiting for the rest
//
// Поддерживаемые способы вызова add3(a, b, c) после curry:
// Supported calling styles for curried add3(a, b, c):
//   add3(1)(2)(3)     — строго по одному / strictly one by one
//   add3(1, 2)(3)     — два потом один / two then one
//   add3(1)(2, 3)     — один потом два / one then two
//   add3(1, 2, 3)     — сразу все / all at once

// TODO: Реализуйте curry
// TODO: Implement curry
// function curry(fn) {
//   const arity = ???
//   return function curried(...args) {
//     if (???) {
//       return fn(...args)
//     }
//     return (...more) => ???
//   }
// }

// TODO: Создайте add3 = curry((a, b, c) => a + b + c)
// TODO: Create add3 = curry((a, b, c) => a + b + c)

export function Task3_1() {
  const { t } = useLanguage()

  // TODO: Добавьте состояние для a, b, c (начальные значения: 1, 2, 3)
  // TODO: Add state for a, b, c (initial values: 1, 2, 3)

  // TODO: Добавьте состояние для лога вызовов (массив объектов { call, result, isFunction })
  // TODO: Add state for call log (array of objects { call, result, isFunction })

  return (
    <div className="exercise-container">
      <h2>{t('task.3.1')}</h2>

      {/* TODO: Отобразите блок с реализацией curry */}
      {/* TODO: Display block with curry implementation */}

      {/* TODO: Добавьте три поля ввода для a, b, c */}
      {/* TODO: Add three number inputs for a, b, c */}

      {/* TODO: Добавьте четыре кнопки с разными способами вызова */}
      {/* TODO: Add four buttons with different calling styles */}
      {/* Каждая кнопка добавляет в лог шаги: промежуточные → function, финальный → число */}
      {/* Each button adds steps to log: intermediate → function, final → number */}

      {/* TODO: Отобразите лог вызовов */}
      {/* TODO: Display the call log */}
      {/* Промежуточные: желтый цвет, пометка "function (ждёт аргументов)" */}
      {/* Intermediate: yellow color, label "function (ждёт аргументов)" */}
      {/* Финальный: зеленый цвет, числовой результат */}
      {/* Final: green color, numeric result */}

      {/* TODO: Добавьте кнопку "Очистить лог" */}
      {/* TODO: Add "Clear log" button */}
    </div>
  )
}
