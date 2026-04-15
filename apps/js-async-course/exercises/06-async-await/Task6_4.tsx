import { useState } from 'react'
import { useLanguage } from 'src/hooks'

// ============================================
// Задание 6.4: Антипаттерны async/await
// Task 6.4: async/await Anti-patterns
// ============================================
// Реализуйте интерактивный каталог антипаттернов в формате "До/После".
// Implement an interactive anti-pattern catalog in "Before/After" format.

// -----------------------------------------------
// Данные / Data
// -----------------------------------------------

// TODO: Определите интерфейс для антипаттерна
// TODO: Define anti-pattern interface
// interface AntiPattern {
//   title: string     // Название антипаттерна
//   subtitle: string  // Краткое описание проблемы
//   bad: string       // Плохой код
//   good: string      // Хороший код
//   explanation: string // Объяснение
//   badLabel: string  // Подпись над плохим кодом
//   goodLabel: string // Подпись над хорошим кодом
// }

// TODO: Определите массив из 5 антипаттернов
// TODO: Define array of 5 anti-patterns
// const ANTIPATTERNS: AntiPattern[] = [
//
//   1. await в forEach — forEach не ждёт промисы
//      Плохо: ids.forEach(async (id) => { await processId(id) })
//      Хорошо: for (const id of ids) { await processId(id) }
//      или: await Promise.all(ids.map(id => processId(id)))
//
//   2. Забытый await — Promise вместо значения
//      Плохо: const user = getUser(); if (user) {...}  // всегда true!
//      Хорошо: const user = await getUser(); if (user) {...}
//
//   3. Последовательный await вместо параллельного
//      Плохо: const a = await fetch1(); const b = await fetch2()
//      Хорошо: const [a, b] = await Promise.all([fetch1(), fetch2()])
//
//   4. Unnecessary async без await
//      Плохо: async function add(a, b) { return a + b }
//      Хорошо: function add(a, b) { return a + b }
//
//   5. Пустой catch — ошибки глотаются
//      Плохо: try { await save() } catch (err) { /* пусто */ }
//      Хорошо: try { await save() } catch (err) { console.error(err); throw err }
// ]

export function Task6_4() {
  const { t } = useLanguage()

  // TODO: Состояние для индекса активного антипаттерна (0..4)
  // TODO: State for active anti-pattern index (0..4)
  // const [activeIdx, setActiveIdx] = useState(0)

  // TODO: Состояние — показывать хороший или плохой вариант
  // TODO: State — show good or bad variant
  // const [showGood, setShowGood] = useState(false)

  // -----------------------------------------------
  // TODO: При переходе к другому антипаттерну
  // TODO: When navigating to another anti-pattern
  // -----------------------------------------------
  // setActiveIdx(newIdx)
  // setShowGood(false)  // всегда начинаем с "Плохо"

  return (
    <div className="exercise-container">
      <h2>{t('task.6.4')}</h2>

      {/* TODO: Навигационные кнопки-пилюли (1..5) */}
      {/* TODO: Navigation pill buttons (1..5) */}
      {/* ANTIPATTERNS.map((p, i) => <button key={i} onClick={() => navigate(i)}>{i+1}. {p.title}</button>) */}

      {/* TODO: Заголовок текущего антипаттерна */}
      {/* TODO: Current anti-pattern header */}
      {/* pattern.title и pattern.subtitle */}

      {/* TODO: Переключатель "Плохо / Хорошо" */}
      {/* TODO: "Bad / Good" toggle */}
      {/* Два кнопки: красная для "Плохо", зелёная для "Хорошо" */}
      {/* Two buttons: red for "Bad", green for "Good" */}

      {/* TODO: Блок кода */}
      {/* TODO: Code block */}
      {/* Если !showGood: pattern.bad, красная граница */}
      {/* If !showGood: pattern.bad, red border */}
      {/* Если showGood: pattern.good, зелёная граница */}
      {/* If showGood: pattern.good, green border */}
      {/* Подпись над кодом: badLabel или goodLabel */}

      {/* TODO: Блок объяснения */}
      {/* TODO: Explanation block */}
      {/* pattern.explanation */}

      {/* TODO: Кнопки "Предыдущий" и "Следующий" + счётчик */}
      {/* TODO: "Previous" and "Next" buttons + counter */}
      {/* Заблокировать соответствующие кнопки на крайних позициях */}
      {/* Disable corresponding buttons at extreme positions */}

      <div style={{ color: '#9ca3af', marginTop: '1rem', fontSize: '0.85rem' }}>
        Реализуйте каталог из 5 антипаттернов в формате До/После
      </div>
    </div>
  )
}
