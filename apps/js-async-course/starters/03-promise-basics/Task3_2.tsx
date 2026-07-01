import { useState } from 'react'
import { useLanguage } from 'src/hooks'

// ============================================
// Задание 3.2: then/catch/finally — визуализатор цепочки
// Task 3.2: then/catch/finally — Chain Visualizer
// ============================================
// Реализуйте визуальный «конвейер» из 5 блоков промис-цепочки.
// Implement a visual «pipeline» of 5 promise chain blocks.

// -----------------------------------------------
// Типы / Types
// -----------------------------------------------

// Тип блока в цепочке / Block type in the chain
type BlockType = 'then' | 'catch' | 'finally'

// Статус выполнения блока / Block execution status
// idle     — не выполнялся / not executed yet
// active   — выполняется прямо сейчас / currently executing
// pass     — значение прошло через блок / value passed through
// handled  — блок обработал ошибку (.catch) / block handled an error (.catch)
// skipped  — блок пропущен / block was skipped
type BlockStatus = 'idle' | 'active' | 'pass' | 'handled' | 'skipped'

// Описание одного блока цепочки / Description of a single chain block
interface PipelineBlock {
  id: number         // Уникальный ID / Unique ID
  type: BlockType    // Тип блока / Block type
  label: string      // Текст метода / Method label, e.g. '.then(v => v * 2)'
  throwHere: boolean // Выбрасывать ли ошибку в этом блоке / Should this block throw
  status: BlockStatus
}

// -----------------------------------------------
// Фабрика блоков / Block factory
// -----------------------------------------------
// Создаёт начальный массив блоков с нужными типами и метками
// Creates initial array of blocks with correct types and labels
//
// Блоки цепочки:
// Chain blocks:
//   0: then,    '.then(v => v * 2)'
//   1: then,    '.then(v => v + 10)'
//   2: catch,   '.catch(err => 0)'
//   3: then,    '.then(v => `result: ${v}`)'
//   4: finally, '.finally(() => cleanup())'
//
// TODO: Реализуйте makeBlocks(throws: boolean[]): PipelineBlock[]
// TODO: Implement makeBlocks(throws: boolean[]): PipelineBlock[]
// const makeBlocks = (throws: boolean[]): PipelineBlock[] => [...]

// -----------------------------------------------
// Цвета блоков / Block colors
// -----------------------------------------------
const BLOCK_COLORS: Record<BlockType, string> = {
  then: '#3b82f6',    // синий / blue
  catch: '#ef4444',   // красный / red
  finally: '#f59e0b', // жёлтый / yellow
}

// -----------------------------------------------
// TODO: Реализуйте компонент Task3_2
// TODO: Implement the Task3_2 component
// -----------------------------------------------

// Состояния / States:
//   - startValue: string — начальное значение ('5') / initial value
//   - throwFlags: boolean[] — [false, false, false, false] — для каждого блока 0-3
//   - blocks: PipelineBlock[] — makeBlocks(throwFlags) — текущие блоки
//   - isRunning: boolean — идёт ли анимация
//   - finalResult: { value: string; isError: boolean } | null — итог
//   - stepLog: string[] — лог шагов

// -----------------------------------------------
// Логика runPipeline() / runPipeline() logic
// -----------------------------------------------
// 1. Установить isRunning=true, сбросить результаты
//    Set isRunning=true, clear results
// 2. Инициализировать isError=false, val = Number(startValue)
//    Initialize isError=false, val = Number(startValue)
// 3. Добавить в лог начальное сообщение
//    Add initial message to log
// 4. Для каждого блока (i=0..4) с задержкой ~400мс:
//    For each block (i=0..4) with ~400ms delay:
//    a. Установить блок i в статус 'active'
//       Set block i to 'active' status
//    b. Подождать ещё ~400мс
//       Wait another ~400ms
//    c. Логика для типа блока:
//       Block type logic:
//
//    --- BlockType: 'then' ---
//    Если isError → статус 'skipped', лог "пропущен — значение в ошибке"
//    If isError → status 'skipped', log "skipped — value is error"
//    Если throwHere → isError=true, val='Error: throw в блоке N', статус 'handled', лог о броске
//    If throwHere → isError=true, val='Error: throw in block N', status 'handled', log about throw
//    Иначе → применить операцию блока, статус 'pass', лог нового значения:
//    Otherwise → apply block operation, status 'pass', log new value:
//      block 0: val = Number(val) * 2
//      block 1: val = Number(val) + 10
//      block 3: val = `result: ${val}`
//
//    --- BlockType: 'catch' ---
//    Если isError → поймать: isError=false, val=0 (или новая ошибка если throwHere),
//      статус 'handled', лог о перехвате
//    If isError → handle: isError=false, val=0 (or new error if throwHere),
//      status 'handled', log about catch
//    Если !isError → статус 'skipped', лог "пропущен — ошибок нет"
//    If !isError → status 'skipped', log "skipped — no errors"
//
//    --- BlockType: 'finally' ---
//    Всегда: статус 'pass', лог "выполнен всегда (значение не меняет)"
//    Always: status 'pass', log "always executed (doesn't change value)"
//
// 5. По завершении: isRunning=false, setFinalResult({value: String(val), isError})
//    When done: isRunning=false, setFinalResult({value: String(val), isError})

// -----------------------------------------------
// toggleThrow(idx): переключает throwFlags[idx] и пересоздаёт блоки
// toggleThrow(idx): toggles throwFlags[idx] and recreates blocks
//
// handleReset(): сбрасывает блоки, результат, лог
// handleReset(): resets blocks, result, log
// -----------------------------------------------

export function Task3_2() {
  const { t } = useLanguage()

  // TODO: Объявите состояния
  // TODO: Declare state variables

  // TODO: Реализуйте toggleThrow, runPipeline, handleReset
  // TODO: Implement toggleThrow, runPipeline, handleReset

  return (
    <div className="exercise-container">
      <h2>{t('task.3.2')}</h2>

      {/* TODO: Ввод начального значения */}
      {/* TODO: Initial value input */}

      {/* TODO: Конвейерная визуализация (5 блоков с разделителями ↓) */}
      {/* TODO: Pipeline visualization (5 blocks with ↓ dividers) */}
      {/* Для каждого блока: */}
      {/* For each block: */}
      {/*   - Цветная метка типа (then/catch/finally) */}
      {/*   - Colored type badge (then/catch/finally) */}
      {/*   - Текст операции */}
      {/*   - Operation text */}
      {/*   - Кнопка throw ON/OFF (кроме finally) */}
      {/*   - throw ON/OFF toggle (except finally) */}
      {/*   - Визуальный стиль по статусу (idle/active/pass/handled/skipped) */}
      {/*   - Visual style by status */}

      {/* TODO: Итоговый результат (зелёный/красный блок) */}
      {/* TODO: Final result (green/red block) */}

      {/* TODO: Кнопки "Запустить" и "Сброс" */}
      {/* TODO: "Run" and "Reset" buttons */}

      {/* TODO: Лог шагов */}
      {/* TODO: Step log */}

      {/* TODO: Легенда статусов */}
      {/* TODO: Status legend */}

      <div style={{ color: '#9ca3af', marginTop: '1rem', fontSize: '0.85rem' }}>
        Реализуйте визуализатор цепочки then/catch/finally
      </div>
    </div>
  )
}
