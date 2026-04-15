import { useState } from 'react'
import { useLanguage } from 'src/hooks'

// ============================================
// Задание 5.1: Box — простейший функтор
// Task 5.1: Box — the simplest functor
// ============================================
// Реализуйте класс Box<T> и визуализатор цепочки трансформаций.
// Implement the Box<T> class and a chain-of-transformations visualizer.

// TODO: Реализуйте класс Box<T>
// TODO: Implement class Box<T>
//
// class Box<T> {
//   private constructor(private readonly value: T) {}
//
//   static of<T>(value: T): Box<T>
//   // Создать Box из значения / Create Box from value
//
//   map<U>(fn: (value: T) => U): Box<U>
//   // Применить fn к содержимому, вернуть новый Box / Apply fn to contents, return new Box
//
//   fold<U>(fn: (value: T) => U): U
//   // Извлечь значение из Box / Extract value from Box
//
//   inspect(): string
//   // Вернуть "Box(value)" / Return "Box(value)"
//
//   getValue(): T
//   // Вернуть значение (для отображения) / Return raw value (for display)
// }

// TODO: Определите список трансформаций (минимум 5)
// TODO: Define a list of transformations (minimum 5)
// Каждая трансформация: { id, label, fn, describe }
// Each transform: { id, label, fn, describe }
// Примеры / Examples:
// toUpperCase: s => s.toUpperCase()
// trim: s => s.trim()
// split(' '): s => s.split(' ')
// length: s => s.length
// x * 2: x => x * 2

export function Task5_1() {
  const { t } = useLanguage()

  // TODO: Состояние: inputVal (строка), steps (массив шагов), folded (boolean)
  // TODO: State: inputVal (string), steps (array of steps), folded (boolean)

  // TODO: Функция addStep(id) — добавляет шаг в цепочку
  // TODO: Function addStep(id) — appends a step to the chain

  // TODO: Функция removeStep(i) — удаляет шаг по индексу
  // TODO: Function removeStep(i) — removes step at index

  // TODO: Вычислите chain — массив узлов цепочки
  // TODO: Compute chain — array of chain nodes
  // Каждый узел: { box: string, mapDesc?: string, value: any }
  // Each node: { box: string, mapDesc?: string, value: any }

  return (
    <div className="exercise-container">
      <h2>{t('task.5.1')}</h2>

      {/* TODO: Поле ввода начального значения */}
      {/* TODO: Input field for initial value */}

      {/* TODO: Кнопки-трансформации — клик добавляет .map(fn) шаг */}
      {/* TODO: Transform buttons — click adds a .map(fn) step */}

      {/* TODO: Визуализация цепочки */}
      {/* TODO: Chain visualization */}
      {/* Box(value) → .map(fn1) → Box(result1) → .map(fn2) → Box(result2) */}
      {/* Кнопка x удаляет шаг / x button removes a step */}

      {/* TODO: Кнопка .fold(x => x) появляется если есть шаги */}
      {/* TODO: .fold(x => x) button appears when there are steps */}

      {/* TODO: Блок с кодом — отображает текущую цепочку */}
      {/* TODO: Code block — displays current chain */}
    </div>
  )
}
