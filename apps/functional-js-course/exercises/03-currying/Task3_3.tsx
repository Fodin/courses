import { useState } from 'react'
import { useLanguage } from 'src/hooks'

// ============================================
// Задание 3.3: Point-free конвейер
// Task 3.3: Point-free Pipeline
// ============================================
// Реализуйте каррированные утилиты и покажите разницу между
// verbose и point-free стилями на одних данных.
// Implement curried utilities and show the difference between
// verbose and point-free styles on the same data.
//
// Утилиты для реализации / Utilities to implement:
//   prop(key)(obj)     — возвращает obj[key]
//   filterBy(pred)(arr) — возвращает arr.filter(pred)
//   mapWith(fn)(arr)   — возвращает arr.map(fn)
//   pipe(...fns)(x)    — применяет функции слева направо
//
// Задача: фильтровать активных пользователей, взять имена, отсортировать
// Goal: filter active users, get names, sort alphabetically

// TODO: Определите интерфейс User с полями name, age, active, city
// TODO: Define User interface with fields name, age, active, city

// TODO: Объявите массив USERS (минимум 6-8 пользователей, часть active: false)
// TODO: Declare USERS array (at least 6-8 users, some with active: false)

// TODO: Реализуйте prop
// TODO: Implement prop
// function prop<T, K extends keyof T>(key: K): (obj: T) => T[K] {
//   return ???
// }

// TODO: Реализуйте filterBy
// TODO: Implement filterBy
// function filterBy<T>(pred: (item: T) => boolean): (arr: T[]) => T[] {
//   return ???
// }

// TODO: Реализуйте mapWith
// TODO: Implement mapWith
// function mapWith<T, R>(fn: (item: T) => R): (arr: T[]) => R[] {
//   return ???
// }

// TODO: Реализуйте pipe
// TODO: Implement pipe
// function pipe(...fns) {
//   return x => fns.reduce((acc, fn) => fn(acc), x)
// }

export function Task3_3() {
  const { t } = useLanguage()

  // TODO: Добавьте состояние для режима ('verbose' | 'pointfree')
  // TODO: Add state for mode ('verbose' | 'pointfree')

  // TODO: Вычислите verboseResult:
  // TODO: Compute verboseResult:
  //   USERS.filter(u => u.active).map(u => u.name).sort((a, b) => a.localeCompare(b, 'ru'))

  // TODO: Вычислите pointFreeResult через pipe + утилиты:
  // TODO: Compute pointFreeResult via pipe + utilities:
  //   pipe(filterBy(prop('active')), mapWith(prop('name')), sortByStr)(USERS)

  return (
    <div className="exercise-container">
      <h2>{t('task.3.3')}</h2>

      {/* TODO: Переключатель "Verbose / Point-free" */}
      {/* TODO: Toggle "Verbose / Point-free" */}

      {/* TODO: Панель с кодом — verbose или point-free в зависимости от режима */}
      {/* TODO: Code panel — verbose or point-free depending on mode */}
      {/* Verbose код: синий цвет; Point-free код: зелёный цвет */}
      {/* Verbose code: blue color; Point-free code: green color */}

      {/* TODO: Список исходных пользователей */}
      {/* TODO: Source users list */}
      {/* Активные: непрозрачные; неактивные: opacity 0.4 */}
      {/* Active: full opacity; inactive: opacity 0.4 */}

      {/* TODO: Результат — нумерованный список имён */}
      {/* TODO: Result — numbered list of names */}
      {/* Оба режима должны давать одинаковые имена */}
      {/* Both modes must yield identical names */}

      {/* TODO: Текстовое пояснение когда использовать каждый стиль */}
      {/* TODO: Text explanation of when to use each style */}
    </div>
  )
}
