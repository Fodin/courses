import { useState, useRef } from 'react'
import { useLanguage } from 'src/hooks'

// ============================================
// Задание 8.2: Ленивые последовательности — бесконечный Фибоначчи
// Task 8.2: Lazy sequences — infinite Fibonacci
// ============================================
// Реализуйте компонент, демонстрирующий ленивые вычисления через генератор.
// Бесконечная последовательность Фибоначчи + pipeline из нескольких генераторов.
//
// Implement a component demonstrating lazy evaluation via generators.
// Infinite Fibonacci sequence + pipeline of multiple generators.

// -----------------------------------------------
// TODO: Реализуйте функцию-генератор fibonacci()
// TODO: Implement the fibonacci() generator function
// -----------------------------------------------
// function* fibonacci(): Generator<number> {
//   let a = 0, b = 1
//   while (true) {
//     yield a
//     ;[a, b] = [b, a + b]
//   }
// }

// -----------------------------------------------
// TODO: Реализуйте вспомогательную функцию take(n, gen)
// TODO: Implement helper function take(n, gen)
// -----------------------------------------------
// Принимает n (количество элементов) и generator, возвращает первые n значений.
// Takes n (count) and a generator, returns first n values as array.
// function take<T>(n: number, gen: Generator<T>): T[] { ... }

// -----------------------------------------------
// Тип стадий pipeline / Pipeline stage type
// -----------------------------------------------
type PipelineStage = 'fibonacci' | 'filter' | 'take' | 'result'

export function Task8_2() {
  const { t } = useLanguage()

  // Генератор хранится в ref — не пересоздаётся при рендере
  // Generator stored in ref — not recreated on render
  // TODO: const genRef = useRef<Generator<number>>(fibonacci())

  // TODO: Состояние для ленты чисел (collected values)
  // TODO: State for the number tape (collected values)
  // const [collected, setCollected] = useState<number[]>([])

  // TODO: Состояние для pipeline demo
  // TODO: State for pipeline demo
  // const [pipelineDemo, setPipelineDemo] = useState<{
  //   fib: number[]
  //   filtered: number[]
  //   taken: number[]
  // } | null>(null)

  // TODO: Текущая активная стадия pipeline
  // TODO: Current active pipeline stage
  // const [activeStage, setActiveStage] = useState<PipelineStage | null>(null)

  // -----------------------------------------------
  // TODO: Реализуйте handleNextValue()
  // TODO: Implement handleNextValue()
  // -----------------------------------------------
  // - Вызвать genRef.current.next()
  // - Если !done — добавить value в collected через setCollected
  // - Call genRef.current.next()
  // - If !done — add value to collected via setCollected

  // -----------------------------------------------
  // TODO: Реализуйте handleReset()
  // TODO: Implement handleReset()
  // -----------------------------------------------
  // - genRef.current = fibonacci() — пересоздать генератор
  // - setCollected([])
  // - setPipelineDemo(null)
  // - setActiveStage(null)

  // -----------------------------------------------
  // TODO: Реализуйте handlePipelineDemo()
  // TODO: Implement handlePipelineDemo()
  // -----------------------------------------------
  // Запускает demo pipeline: fibonacci() → filter(isEven) → take(5)
  // Launches pipeline demo: fibonacci() → filter(isEven) → take(5)
  //
  // - fib = take(20, fibonacci())      — первые 20 чисел для отображения источника
  // - filtered = fib.filter(n => n % 2 === 0)  — только чётные
  // - taken = filtered.slice(0, 5)     — первые 5 чётных
  // - setPipelineDemo({ fib, filtered, taken })
  // - setActiveStage('fibonacci')

  // -----------------------------------------------
  // TODO: Реализуйте nextStage()
  // TODO: Implement nextStage()
  // -----------------------------------------------
  // Переключает activeStage: fibonacci → filter → take → result
  // Cycles activeStage: fibonacci → filter → take → result

  return (
    <div className="exercise-container">
      <h2>{t('task.8.2')}</h2>

      {/* ---- Секция 1: ленивый запрос / Section 1: lazy request ---- */}

      {/* TODO: Отобразите код генератора fibonacci() */}
      {/* TODO: Display fibonacci() generator code */}
      {/*
        function* fibonacci() {
          let a = 0, b = 1
          while (true) {
            yield a     // ← пауза здесь до следующего .next()
            ;[a, b] = [b, a + b]
          }
        }
      */}

      {/* TODO: Лента чисел */}
      {/* TODO: Number tape */}
      {/* collected.map(...) — каждое число в блоке, последнее ярче */}
      {/* Если collected пуст — показать "Нажмите кнопку для первого значения..." */}

      {/* TODO: Счётчик и метка памяти */}
      {/* TODO: Counter and memory label */}
      {/* "Запрошено: N значений" и "O(1) — только текущее значение в памяти" */}

      {/* TODO: Блоки сравнения O(1) vs O(n) */}
      {/* TODO: Memory comparison blocks O(1) vs O(n) */}
      {/* Зелёный: "Генератор O(1)" + текущие a, b */}
      {/* Красный: "Array O(n) — невозможно" + пояснение */}

      {/* TODO: Кнопки управления */}
      {/* TODO: Controls */}
      {/* "Взять следующее значение" и "Сброс" */}

      {/* ---- Секция 2: pipeline / Section 2: pipeline ---- */}

      {/* TODO: Код pipeline */}
      {/* TODO: Pipeline code */}
      {/* take(5, filter(isEven, fibonacci())) */}

      {/* TODO: Визуализация стадий pipeline */}
      {/* TODO: Pipeline stage visualization */}
      {/*
        Если pipelineDemo !== null:
        - fibonacci(): блоки pipelineDemo.fib + "..." (opacity 1 если активна)
        - → (стрелка)
        - filter(isEven): блоки pipelineDemo.filtered (opacity 1 если активна или позже)
        - → (стрелка)
        - take(5): блоки pipelineDemo.taken (opacity 1 если активна или позже)
        - → (стрелка)
        - результат: массив pipelineDemo.taken (opacity 1 если 'result')

        Функция stageActive(stage): возвращает true если stage ≤ activeStage
      */}

      {/* TODO: Кнопка запуска / следующей стадии */}
      {/* TODO: Launch / next stage button */}
      {/* Если !pipelineDemo: "Запустить pipeline" (вызывает handlePipelineDemo) */}
      {/* Если pipelineDemo: "Следующая стадия →" (disabled если activeStage === 'result') */}

      <div style={{ color: '#9ca3af', marginTop: '1rem', fontSize: '0.85rem' }}>
        Реализуйте визуализацию ленивых последовательностей
      </div>
    </div>
  )
}
