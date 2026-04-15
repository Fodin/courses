import { useState, useRef, useCallback } from 'react'
import { useLanguage } from 'src/hooks'

// ============================================
// Задание 9.2: Pipeline из async-генераторов
// Task 9.2: Pipeline of Async Generators
// ============================================
// Реализуйте трёхзвенный конвейер: source → filter → map
// Implement a three-stage pipeline: source → filter → map
//
// Схема / Diagram:
//   source(1..20, 400ms) → filterEven → mapDouble → вывод
//   source(1..20, 400ms) → filterEven → mapDouble → output

// -----------------------------------------------
// Типы / Types
// -----------------------------------------------

interface PipelineItem {
  id: number
  rawValue: number
  filteredIn: boolean    // Прошёл фильтр / Passed filter
  mappedValue: number    // После map / After map
  stage: 'source' | 'filter' | 'output' | 'rejected'
}

// -----------------------------------------------
// Утилиты / Utilities
// -----------------------------------------------

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

// -----------------------------------------------
// TODO: Реализуйте три async-генератора
// TODO: Implement three async generators
// -----------------------------------------------

// 1. source — генерирует числа 1..count с задержкой delayMs
//    source — generates numbers 1..count with delayMs delay
// async function* source(count: number, delayMs: number): AsyncGenerator<number> {
//   for (let i = 1; i <= count; i++) {
//     await delay(delayMs)
//     yield i
//   }
// }

// 2. filterEven — пропускает только чётные числа
//    filterEven — passes only even numbers
// async function* filterEven(upstream: AsyncGenerator<number>): AsyncGenerator<number> {
//   for await (const value of upstream) {
//     if (value % 2 === 0) yield value
//   }
// }

// 3. mapDouble — удваивает каждое значение
//    mapDouble — doubles each value
// async function* mapDouble(upstream: AsyncGenerator<number>): AsyncGenerator<number> {
//   for await (const value of upstream) {
//     yield value * 2
//   }
// }

// -----------------------------------------------
// TODO: Компоновка pipeline
// TODO: Pipeline composition
// -----------------------------------------------
// const pipeline = mapDouble(filterEven(source(20, 400)))
// Вложенный вызов — без промежуточных массивов!
// Nested call — no intermediate arrays!

export function Task9_2() {
  const { t } = useLanguage()

  // TODO: Состояние для элементов конвейера
  // TODO: State for pipeline items
  // const [items, setItems] = useState<PipelineItem[]>([])

  // TODO: Состояние работы: running, paused, done
  // TODO: Running state: running, paused, done
  // const [running, setRunning] = useState(false)
  // const [paused, setPaused] = useState(false)
  // const [done, setDone] = useState(false)

  // TODO: Refs для управления паузой и остановом
  // TODO: Refs for pause and stop control
  // pausedRef.current контролирует ожидание в цикле
  // pausedRef.current controls waiting in the loop
  // const pausedRef = useRef(false)
  // const stopRef = useRef(false)

  // -----------------------------------------------
  // TODO: handleStart() — запускает pipeline
  // TODO: handleStart() — starts pipeline
  // -----------------------------------------------
  // Алгоритм / Algorithm:
  //   1. Сбросить состояние (items, running, done)
  //   2. Для каждого значения из source:
  //      a. Проверить pausedRef — ждать пока пауза
  //      b. Определить filteredIn = value % 2 === 0
  //      c. Добавить item в state со stage: 'source'
  //      d. await delay(200)
  //      e. Обновить stage на 'filter' или 'rejected'
  //      f. Если filteredIn: await delay(200), обновить stage на 'output'
  //   3. setDone(true)

  // -----------------------------------------------
  // TODO: handlePause() — переключает паузу
  // TODO: handlePause() — toggles pause
  // -----------------------------------------------
  // pausedRef.current = !pausedRef.current
  // setPaused(pausedRef.current)

  // -----------------------------------------------
  // TODO: handleStop() — останавливает pipeline
  // TODO: handleStop() — stops pipeline
  // -----------------------------------------------
  // stopRef.current = true
  // pausedRef.current = false

  return (
    <div className="exercise-container">
      <h2>{t('task.9.2')}</h2>

      {/* TODO: Диаграмма pipeline: source → filter → map → результат */}
      {/* TODO: Pipeline diagram: source → filter → map → result */}

      {/* TODO: Визуализация потока элементов */}
      {/* TODO: Items flow visualization */}
      {/* Каждый item — цветной блок: source(синий), filter(жёлтый), output(зелёный), rejected(красный) */}
      {/* Each item is a colored block: source(blue), filter(yellow), output(green), rejected(red) */}

      {/* TODO: Статистика: принято N, отфильтровано M, результат [...] */}
      {/* TODO: Statistics: accepted N, filtered M, result [...] */}

      {/* TODO: Блок backpressure при паузе */}
      {/* TODO: Backpressure notice when paused */}

      {/* TODO: Кнопки "Запустить", "Пауза/Продолжить", "Стоп" */}
      {/* TODO: Buttons "Start", "Pause/Continue", "Stop" */}

      <div style={{ color: '#9ca3af', marginTop: '1rem', fontSize: '0.85rem' }}>
        Реализуйте конвейер из трёх async-генераторов
      </div>
    </div>
  )
}
