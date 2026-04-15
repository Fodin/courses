import { useState } from 'react'
import { useLanguage } from 'src/hooks'

// ============================================
// Задание 4.1: Реализация pipe и compose
// Task 4.1: Implementing pipe and compose
// ============================================
// Реализуйте pipe и compose, постройте интерактивный визуализатор пайплайна.
// Implement pipe and compose, build an interactive pipeline visualizer.
//
// pipe(f, g, h)(x)    = h(g(f(x)))  — слева направо / left to right
// compose(f, g, h)(x) = f(g(h(x)))  — справа налево / right to left

// TODO: Реализуйте pipe
// TODO: Implement pipe
// const pipe = (...fns) => x => ???

// TODO: Реализуйте compose
// TODO: Implement compose
// const compose = (...fns) => x => ???

// TODO: Создайте палитру строковых функций (минимум 6):
// TODO: Create a palette of string functions (at least 6):
// trim, toLower, toUpper, capitalize, addExclaim, getLength
// Каждая функция: { id: string, label: string, fn: (s: string) => string }
// Each function: { id: string, label: string, fn: (s: string) => string }

export function Task4_1() {
  const { t } = useLanguage()

  // TODO: Состояние: input (строка), pipeline (массив id функций),
  //       mode ('pipe' | 'compose'), steps (массив { fnLabel, output }), ran (boolean)
  // TODO: State: input (string), pipeline (array of fn ids),
  //       mode ('pipe' | 'compose'), steps (array { fnLabel, output }), ran (boolean)

  return (
    <div className="exercise-container">
      <h2>{t('task.4.1')}</h2>

      {/* TODO: Переключатель pipe/compose */}
      {/* TODO: pipe/compose toggle */}

      {/* TODO: Показать реализации pipe и compose в блоке кода */}
      {/* TODO: Display pipe and compose implementations in a code block */}

      {/* TODO: Палитра кнопок — клик добавляет функцию в pipeline */}
      {/* TODO: Palette buttons — click adds function to pipeline */}

      {/* TODO: Визуализация pipeline: функции со стрелками, кнопка удаления каждой */}
      {/* TODO: Pipeline visualization: functions with arrows, remove button for each */}
      {/* Порядок отображения зависит от режима (pipe = порядок добавления, compose = обратный) */}
      {/* Display order depends on mode (pipe = add order, compose = reversed) */}

      {/* TODO: Поле ввода строки */}
      {/* TODO: String input field */}

      {/* TODO: Кнопка "Выполнить" (disabled если pipeline пуст) */}
      {/* TODO: "Run" button (disabled if pipeline is empty) */}

      {/* TODO: Блок с кодом — pipe(fn1, fn2, ...)(input) или compose(...) */}
      {/* TODO: Code block — pipe(fn1, fn2, ...)(input) or compose(...) */}

      {/* TODO: Пошаговая таблица после выполнения: шаг 0 = ввод, шаг N = результат после fnN */}
      {/* TODO: Step-by-step table after run: step 0 = input, step N = result after fnN */}
      {/* Последняя строка подсвечивается как итог */}
      {/* Last row highlighted as final result */}
    </div>
  )
}
