import { useState } from 'react'
import { useLanguage } from 'src/hooks'

// ============================================
// Задание 1.3: Предскажи порядок выполнения
// Task 1.3: Predict Execution Order
// ============================================
// Реализуйте тренажёр-пазл: видим код, расставляем
// строки вывода в правильном порядке.
// Implement a puzzle trainer: see code, arrange
// output lines in the correct order.

// -----------------------------------------------
// Типы / Types
// -----------------------------------------------

// Один пазл / One puzzle
interface Puzzle {
  title: string                         // Название для вкладки / Tab title
  code: string                          // Код для отображения / Code to display
  correctOrder: string[]                // Правильный порядок вывода / Correct output order
  explanations: Record<string, string>  // Объяснение для каждой строки / Explanation per output line
}

// -----------------------------------------------
// Данные — три пазла / Data — three puzzles
// -----------------------------------------------

// TODO: Определите массив PUZZLES типа Puzzle[]
// TODO: Define PUZZLES array of type Puzzle[]
//
// Пазл 1 (базовый):
// Puzzle 1 (basic):
//   code: console.log('A'), setTimeout(log 'B', 0), Promise.resolve().then(log 'C'), console.log('D')
//   correctOrder: ['A', 'D', 'C', 'B']
//   explanations: объяснение для каждого из A, D, C, B
//
// Пазл 2 (средний):
// Puzzle 2 (medium):
//   code: start, setTimeout, Promise.then(() => { log 'then 1'; return 'x' }).then(log 'then 2'), end
//   correctOrder: ['start', 'end', 'then 1', 'then 2', 'timeout']
//   explanations: объяснение для каждого
//
// Пазл 3 (сложный):
// Puzzle 3 (complex):
//   code: log '1', queueMicrotask(log '2'), Promise.then(log '3'), setTimeout(log '4'),
//         queueMicrotask(() => { log '5'; Promise.then(log '6') }), log '7'
//   correctOrder: ['1', '7', '2', '3', '5', '6', '4']
//   explanations: объяснение для каждого
//
// const PUZZLES: Puzzle[] = [...]

// -----------------------------------------------
// Компонент / Component
// -----------------------------------------------

export function Task1_3() {
  const { t } = useLanguage()

  // TODO: Состояние текущего пазла (0, 1, 2)
  // TODO: Current puzzle index state
  // const [puzzleIdx, setPuzzleIdx] = useState(0)

  // TODO: Порядок ответа пользователя (массив строк)
  // TODO: User's answer order (array of strings)
  // const [userOrder, setUserOrder] = useState<string[]>([])

  // TODO: Флаг — была ли нажата "Проверить"
  // TODO: Flag — was "Check" pressed
  // const [checked, setChecked] = useState(false)

  // Текущий пазл / Current puzzle
  // const puzzle = PUZZLES[puzzleIdx]

  // TODO: Вычислите доступные варианты (те которые ещё не выбраны)
  // TODO: Compute available options (those not yet selected)
  // const available = puzzle.correctOrder.filter(o => !userOrder.includes(o))

  // TODO: Функция handleSelect(val) — добавляет val в userOrder
  // TODO: handleSelect(val) — adds val to userOrder
  //   (не добавлять если checked === true)

  // TODO: Функция handleUndo — убирает последний элемент из userOrder
  // TODO: handleUndo — removes last element from userOrder
  //   (не работает если checked === true)

  // TODO: Функция handleCheck — устанавливает checked = true
  // TODO: handleCheck — sets checked = true
  //   (доступна только когда userOrder.length === puzzle.correctOrder.length)

  // TODO: Функция handleReset — очищает userOrder и checked
  // TODO: handleReset — clears userOrder and checked

  // TODO: Функция handlePuzzle(idx) — переключает пазл + сброс
  // TODO: handlePuzzle(idx) — switches puzzle + reset

  // TODO: Вычислите isCorrect(idx) — правильна ли позиция idx
  // TODO: Compute isCorrect(idx) — is position idx correct
  // const isCorrect = (idx: number) => userOrder[idx] === puzzle.correctOrder[idx]

  // TODO: Вычислите allCorrect — все позиции правильные
  // TODO: Compute allCorrect — all positions are correct
  // const allCorrect = checked && puzzle.correctOrder.every((v, i) => userOrder[i] === v)

  return (
    <div className="exercise-container">
      <h2>{t('task.1.3')}</h2>

      {/* TODO: Вкладки для трёх пазлов */}
      {/* TODO: Tabs for three puzzles */}
      {/* При переключении — вызывать handlePuzzle(idx) */}
      {/* On switch — call handlePuzzle(idx) */}

      {/* TODO: Двухколоночный layout: слева код, справа задание */}
      {/* TODO: Two-column layout: code on left, puzzle on right */}

      {/* Левая колонка: код пазла в <pre> */}
      {/* Left column: puzzle code in <pre> */}

      {/* Правая колонка: */}
      {/* Right column: */}
      {/* 1. Заголовок "РАССТАВЬ ВЫВОД В ПРАВИЛЬНОМ ПОРЯДКЕ" */}
      {/* 1. Header "ARRANGE OUTPUT IN CORRECT ORDER" */}
      {/* 2. Кнопки с доступными вариантами (available.map) */}
      {/* 2. Buttons with available options (available.map) */}
      {/*    При клике вызывать handleSelect(val) */}
      {/*    On click call handleSelect(val) */}
      {/* 3. Область ответа — userOrder отображается с нумерацией */}
      {/* 3. Answer area — userOrder displayed with numbering */}
      {/*    После проверки: зелёный (isCorrect) или красный (!isCorrect) */}
      {/*    After check: green (isCorrect) or red (!isCorrect) */}

      {/* TODO: Объяснения после проверки (checked === true) */}
      {/* TODO: Explanations after check (checked === true) */}
      {/* Для каждой строки correctOrder показать puzzle.explanations[val] */}
      {/* For each correctOrder line show puzzle.explanations[val] */}

      {/* TODO: Сообщение "Отлично!" если allCorrect */}
      {/* TODO: "Excellent!" message if allCorrect */}

      {/* TODO: Кнопки: "Проверить", "Отмена последнего", "Сброс" */}
      {/* TODO: Buttons: "Check", "Undo last", "Reset" */}
      {/* "Проверить" заблокирована если userOrder.length !== puzzle.correctOrder.length */}
      {/* "Check" disabled if userOrder.length !== puzzle.correctOrder.length */}

      <div style={{ color: '#9ca3af', marginTop: '1rem', fontSize: '0.85rem' }}>
        Реализуйте тренажёр для предсказания порядка вывода
      </div>
    </div>
  )
}
