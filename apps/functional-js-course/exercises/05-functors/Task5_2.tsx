import { useState } from 'react'
import { useLanguage } from 'src/hooks'

// ============================================
// Задание 5.2: Законы функторов
// Task 5.2: Functor Laws
// ============================================
// Реализуйте Law Checker — инструмент проверки законов функтора.
// Implement a Law Checker — a tool for verifying functor laws.
//
// Закон 1 — Идентичность / Law 1 — Identity:
//   F.map(x => x) === F
//
// Закон 2 — Композиция / Law 2 — Composition:
//   F.map(f).map(g) === F.map(x => g(f(x)))

// TODO: Используйте Box из задания 5.1 (или реализуйте снова)
// TODO: Use Box from task 5.1 (or re-implement)

// TODO: Реализуйте BadFunctor — намеренно сломанный функтор
// TODO: Implement BadFunctor — an intentionally broken functor
// map(fn) возвращает BadFunctor(fn(this.value) + '!')
// map(fn) returns BadFunctor(fn(this.value) + '!')
// class BadFunctor<T> { ... }

// TODO: Определите предустановленные функции f и g
// TODO: Define preset functions f and g
// x + 1, x * 2, String(x), x.toUpperCase()

// TODO: Реализуйте вспомогательные функции
// TODO: Implement helper functions
// deepEqual(a, b) — сравнение через JSON.stringify
// applyMap(functorName, value, fn) — применить map для нужного функтора

type FunctorName = 'Box' | 'Array' | 'BadFunctor'

export function Task5_2() {
  const { t } = useLanguage()

  // TODO: Состояние: выбранный функтор, начальное значение, f, g
  // TODO: State: selected functor, seed value, f, g
  const [functorName] = useState<FunctorName>('Box')

  // TODO: Вычислите результаты законов
  // TODO: Compute law results
  // law1Left = applyMap(functor, seed, x => x)
  // law1Right = seed
  // law1Pass = deepEqual(law1Left, law1Right)
  //
  // law2Left = applyMap(functor, applyMap(functor, seed, f), g)
  // law2Right = applyMap(functor, seed, x => g(f(x)))
  // law2Pass = deepEqual(law2Left, law2Right)

  return (
    <div className="exercise-container">
      <h2>{t('task.5.2')}</h2>

      {/* TODO: Селектор функтора (Box / Array / BadFunctor) */}
      {/* TODO: Functor selector (Box / Array / BadFunctor) */}

      {/* TODO: Поле для начального числового значения */}
      {/* TODO: Input for initial numeric value */}

      {/* TODO: Селекторы функций f и g */}
      {/* TODO: Selectors for functions f and g */}

      {/* TODO: Предупреждение для BadFunctor — что именно сломано */}
      {/* TODO: Warning for BadFunctor — explain what is broken */}

      {/* TODO: Блок Закона 1 — Identity */}
      {/* TODO: Law 1 block — Identity */}
      {/* Показать: левая часть, правая часть, результат сравнения */}
      {/* Show: left side, right side, comparison result */}

      {/* TODO: Блок Закона 2 — Composition */}
      {/* TODO: Law 2 block — Composition */}
      {/* Показать: левая часть, правая часть, результат сравнения */}
      {/* Show: left side, right side, comparison result */}

      {/* TODO: Итоговый вывод */}
      {/* TODO: Summary verdict */}
      {/* "{functorName} является / НЕ является корректным функтором" */}
      <p style={{ color: '#6b7280', fontSize: '0.85rem' }}>
        Выбранный функтор: {functorName}
      </p>
    </div>
  )
}
