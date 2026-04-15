import { useState } from 'react'
import { useLanguage } from 'src/hooks'

// ============================================
// Задание 8.1: Генератор пошагово — пинг-понг caller ↔ generator
// Task 8.1: Generator step-by-step — ping-pong caller ↔ generator
// ============================================
// Реализуйте компонент, визуализирующий пошаговое взаимодействие между
// caller-кодом и генератором: кто активен, что передаётся через yield,
// как значение возвращается обратно через .next(value).
//
// Implement a component that visualizes step-by-step interaction between
// caller code and a generator: who is active, what is passed via yield,
// how values flow back through .next(value).

// -----------------------------------------------
// Типы / Types
// -----------------------------------------------

// Чья сейчас очередь — caller снаружи или generator внутри
// Whose turn is it — caller outside or generator inside
type Phase = 'caller' | 'generator'

interface GenStep {
  phase: Phase
  label: string          // Описание шага / Step description
  callerCode: number     // Строка кода caller для подсветки / Caller code line to highlight
  genCode: number        // Строка кода генератора для подсветки / Generator code line to highlight
  yieldValue?: unknown   // Что генератор отдаёт через yield / What generator yields
  sendValue?: unknown    // Что caller передаёт в next() / What caller sends via next()
  result?: { value: unknown; done: boolean } // Результат next() / Result of next()
  annotation: string     // Пояснение к шагу / Step annotation
}

// -----------------------------------------------
// Код для отображения / Code to display
// -----------------------------------------------

// Строки кода caller-а (левый столбец)
// Caller code lines (left column)
const CALLER_LINES = [
  'const gen = pingpong()',
  "let r1 = gen.next()",
  "// r1 = { value: 'ping', done: false }",
  "let r2 = gen.next('pong')",
  "// r2 = { value: 'pong', done: false }",
  "let r3 = gen.next('done')",
  "// r3 = { value: undefined, done: true }",
]

// Строки кода генератора (правый столбец)
// Generator code lines (right column)
const GEN_LINES = [
  'function* pingpong() {',
  "  const msg1 = yield 'ping'",
  '  console.log(msg1)',
  "  const msg2 = yield msg1",
  '  console.log(msg2)',
  '  // генератор завершён',
  '}',
]

// TODO: Опишите массив шагов STEPS типа GenStep[]
// TODO: Define a STEPS array of type GenStep[]
//
// Последовательность взаимодействия (минимум 6 шагов):
// Interaction sequence (minimum 6 steps):
//
// 1. phase: 'caller', callerCode: 0 — создание генератора const gen = pingpong()
//    annotation: 'gen.next() ещё не вызван — генератор на паузе перед первой строкой тела'
//
// 2. phase: 'caller', callerCode: 1 — вызов gen.next()
//    annotation: 'Caller вызывает .next() → управление передаётся генератору'
//
// 3. phase: 'generator', callerCode: 1, genCode: 1 — yield 'ping'
//    yieldValue: 'ping'
//    annotation: "Генератор достигает yield — возвращает 'ping' и ставит себя на паузу"
//
// 4. phase: 'caller', callerCode: 2 — получаем { value: 'ping', done: false }
//    result: { value: 'ping', done: false }
//    annotation: 'Caller получает результат, генератор заморожен на строке yield'
//
// 5. phase: 'caller', callerCode: 3 — gen.next('pong')
//    sendValue: 'pong'
//    annotation: "Caller передаёт 'pong' в генератор через аргумент next()"
//
// 6. phase: 'generator', genCode: 3 — msg1 = 'pong', yield msg1
//    yieldValue: 'pong', sendValue: 'pong'
//    annotation: "'pong' становится результатом yield-выражения → msg1 = 'pong'"
//
// ... (добавьте шаги для второго yield и завершения)
//
// const STEPS: GenStep[] = [...]

export function Task8_1() {
  const { t } = useLanguage()

  // TODO: Состояние текущего шага (начинается с 0)
  // TODO: State for current step index (starts at 0)
  // const [stepIndex, setStepIndex] = useState(0)

  // TODO: Лог вызовов — строки с описанием каждого шага
  // TODO: Call log — strings describing each step
  // const [log, setLog] = useState<string[]>([])

  // -----------------------------------------------
  // TODO: Реализуйте handleNext()
  // TODO: Implement handleNext()
  // -----------------------------------------------
  // - Если stepIndex < STEPS.length - 1:
  //   - Формируем строку для лога:
  //     - Если у следующего шага есть result: '.next() → { value: ..., done: ... }'
  //     - Если есть sendValue: '.next(значение) → генератор получает значение'
  //     - Если есть yieldValue: 'yield значение → пауза'
  //     - Иначе: просто label
  //   - setLog добавляем новую строку
  //   - setStepIndex(stepIndex + 1)

  // -----------------------------------------------
  // TODO: Реализуйте handleReset()
  // TODO: Implement handleReset()
  // -----------------------------------------------
  // - setStepIndex(0)
  // - setLog([])

  // -----------------------------------------------
  // TODO: Вычислите переменные из текущего шага
  // TODO: Derive variables from current step
  // -----------------------------------------------
  // const step = STEPS[stepIndex]
  // const isLast = stepIndex >= STEPS.length - 1
  // const phaseColor = step.phase === 'caller' ? '#60a5fa' : '#a78bfa'

  return (
    <div className="exercise-container">
      <h2>{t('task.8.1')}</h2>

      {/* TODO: Бейдж активной фазы */}
      {/* TODO: Active phase badge */}
      {/* Показывает "Активен: CALLER" (синий) или "Активен: GENERATOR" (фиолетовый) */}
      {/* Shows "Активен: CALLER" (blue) or "Активен: GENERATOR" (purple) */}

      {/* TODO: Два столбца — Caller и Generator */}
      {/* TODO: Two columns — Caller and Generator */}
      {/*
        Структура:
        - Левый столбец: "CALLER" + CALLER_LINES с подсветкой step.callerCode
        - Центр: стрелки (sendValue → / ← yieldValue / ← result)
        - Правый столбец: "GENERATOR" + GEN_LINES с подсветкой step.genCode
        - Под правым столбцом: индикатор "ВЫПОЛНЯЕТСЯ" / "НА ПАУЗЕ"

        Structure:
        - Left column: "CALLER" + CALLER_LINES with highlight on step.callerCode
        - Center: arrows (sendValue → / ← yieldValue / ← result)
        - Right column: "GENERATOR" + GEN_LINES with highlight on step.genCode
        - Below right column: indicator "RUNNING" / "PAUSED"
      */}

      {/* TODO: Аннотация текущего шага */}
      {/* TODO: Current step annotation */}
      {/* step.annotation с подписью "Шаг N/M:" */}

      {/* TODO: Лог */}
      {/* TODO: Log */}
      {/* Список строк log[], последняя запись — наиболее яркая */}

      {/* TODO: Кнопки управления */}
      {/* TODO: Controls */}
      {/* "Следующий шаг →" (disabled если isLast) и "Сброс" (disabled если stepIndex === 0) */}

      {/* TODO: Справочный блок о return() и throw() */}
      {/* TODO: Reference block about return() and throw() */}
      {/* gen.return(value) → завершает генератор, gen.throw(err) → бросает ошибку */}

      <div style={{ color: '#9ca3af', marginTop: '1rem', fontSize: '0.85rem' }}>
        Реализуйте визуализацию пинг-понга caller ↔ generator
      </div>
    </div>
  )
}
