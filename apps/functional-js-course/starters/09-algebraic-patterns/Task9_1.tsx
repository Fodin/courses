import { useState, useMemo } from 'react'
import { useLanguage } from 'src/hooks'

// ============================================
// TODO 1: Объявите интерфейсы Semigroup и Monoid
//
// Semigroup<T> — тип с бинарной операцией concat:
//   concat принимает два значения типа T и возвращает T
//
// Monoid<T> extends Semigroup<T> и добавляет поле:
//   empty: T — нейтральный элемент
// ============================================

// interface Semigroup<T> { ... }
// interface Monoid<T> extends Semigroup<T> { ... }

// ============================================
// TODO 2: Реализуйте инстансы Monoid
//
// Sum     — числа, concat = +,          empty = 0
// Product — числа, concat = *,          empty = 1
// All     — boolean, concat = &&,       empty = true
// Any     — boolean, concat = ||,       empty = false
// Min     — числа, concat = Math.min,   empty = Infinity
// Max     — числа, concat = Math.max,   empty = -Infinity
//
// Подсказка: явно указывайте тип, например:
//   const Sum: Monoid<number> = { concat: (a, b) => a + b, empty: 0 }
// ============================================

// const Sum: Monoid<number> = ...
// const Product: Monoid<number> = ...
// const All: Monoid<boolean> = ...
// const Any: Monoid<boolean> = ...
// const Min: Monoid<number> = ...
// const Max: Monoid<number> = ...

// ============================================
// TODO 3: Реализуйте First как Semigroup (не Monoid!)
//
// First<T> — всегда возвращает первый аргумент
// concat: (a, b) => a
//
// Попробуйте придумать, почему для него нельзя определить empty
// (какое значение типа T является "пустым"?)
// ============================================

// interface FirstSemigroup<T> extends Semigroup<T | null> {}
// const First: FirstSemigroup<string> = { concat: (a, _b) => a }

// ============================================
// TODO 4: Реализуйте функции fold и foldMap
//
// fold(M, xs) — свернуть массив xs через Monoid M
//   Подсказка: используйте xs.reduce с начальным значением M.empty
//
// foldMap(monoid, f, xs) — сначала трансформировать xs через f,
//   затем свернуть результат через fold
//   Подсказка: fold(monoid, xs.map(f))
// ============================================

// const fold = <T,>(M: Monoid<T>, xs: T[]): T => ...
// const foldMap = <A, M,>(monoid: Monoid<M>, f: (a: A) => M, xs: A[]): M => ...

// ============================================
// TODO 5: Реализуйте parseValues
//
// Функция принимает строку вида "3, 5, 2" или "true, false, true"
// и возвращает массив значений.
//
// Если key === 'All' или key === 'Any' — парсить как boolean (trim === 'true')
// Иначе — как number (parseFloat, при NaN заменять на 0)
// ============================================

type MonoidKey = 'Sum' | 'Product' | 'All' | 'Any' | 'Min' | 'Max'

// function parseValues(input: string, key: MonoidKey): (number | boolean)[] { ... }

// ============================================
// TODO 6: Соберите описание моноидов для UI
//
// Создайте объект MONOIDS типа Record<MonoidKey, { monoid, label, exampleInput }>.
// Пример:
//   Sum: { monoid: Sum, label: 'Sum (сложение)', exampleInput: '3, 5, 2' }
//
// Это позволит динамически подставлять моноид при выборе из списка.
// ============================================

// const MONOIDS: Record<MonoidKey, { ... }> = { ... }

export function Task9_1() {
  const { t } = useLanguage()
  const [monoidKey, setMonoidKey] = useState<MonoidKey>('Sum')
  const [inputText, setInputText] = useState('3, 5, 2')

  // TODO 7: Используйте parseValues для получения массива значений
  // const values = useMemo(() => parseValues(inputText, monoidKey), [inputText, monoidKey])
  void monoidKey
  void inputText

  // TODO 8: Вычислите пошаговую редукцию
  //
  // Создайте массив steps: { step: string; acc: number | boolean }[]
  // Начните с { step: `empty = ${M.empty}`, acc: M.empty }
  // Для каждого значения из values добавьте:
  //   { step: `concat(${prev}, ${v}) = ${newAcc}`, acc: newAcc }
  //
  // Подсказка: используйте useMemo и обычный for...of цикл
  const steps: { step: string; acc: number | boolean }[] = []
  void useMemo

  // TODO 9: Вычислите проверку ассоциативности
  //
  // Если values.length >= 3:
  //   const [a, b, c] = values
  //   left  = concat(concat(a, b), c)
  //   right = concat(a, concat(b, c))
  //   equal = String(left) === String(right)
  //
  // Вернуть null если элементов меньше трёх
  const assocCheck: { left: number | boolean; right: number | boolean; equal: boolean } | null = null

  return (
    <div className="exercise-container">
      <h2>{t('task.9.1')}</h2>

      {/* TODO 10: Добавьте кнопки выбора моноида
          Для каждого ключа из Object.keys(MONOIDS) отобразите кнопку.
          При клике: обновить monoidKey и inputText (exampleInput из MONOIDS).
          Активная кнопка должна визуально выделяться. */}

      {/* TODO 11: Добавьте поле ввода значений
          <input value={inputText} onChange={...} />
          Под полем показывайте: выбранный моноид, empty */}

      {/* TODO 12: Отобразите пошаговую редукцию
          Пройдитесь по steps и отобразите каждый шаг.
          Последний шаг выделите цветом — это финальный результат. */}

      {/* TODO 13: Отобразите проверку ассоциативности
          Если assocCheck !== null:
            (a ∘ b) ∘ c = {left}
            a ∘ (b ∘ c) = {right}
            Равны: да/нет
          Если равны — покажите сообщение о параллелизуемости fold. */}

      {steps.length === 0 && (
        <p style={{ color: '#6b7280' }}>Реализуйте моноиды и fold, чтобы увидеть демонстрацию</p>
      )}
      {assocCheck === null && (
        <p style={{ color: '#6b7280' }}>Введите не менее 3 значений для проверки ассоциативности</p>
      )}
      <p style={{ color: '#6b7280' }}>
        Введите значения через запятую: {inputText}
      </p>
      <p style={{ color: '#6b7280' }}>
        Выбранный моноид: {monoidKey}
      </p>
      <button onClick={() => setMonoidKey(monoidKey)}>Сменить моноид</button>
    </div>
  )
}
