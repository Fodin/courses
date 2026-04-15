import { useState, useEffect } from 'react'
import { useLanguage } from 'src/hooks'

// ============================================
// Задание 4.2: Error Propagation — визуализатор распространения ошибок
// Task 4.2: Error Propagation — error bubbling visualizer
// ============================================
// Реализуйте интерактивный компонент, показывающий как ошибка
// "пролетает" через цепочку .then() и ловится в .catch().
// Implement an interactive component showing how an error
// "flies through" the .then() chain and is caught by .catch().

// -----------------------------------------------
// Типы / Types
// -----------------------------------------------

// Состояние каждого шага цепочки
// State of each chain step
type TrackState =
  | 'idle'       // Нейтральное / Neutral
  | 'fulfilled'  // Выполнен успешно / Successfully executed
  | 'rejected'   // Выбросил ошибку / Threw an error
  | 'skipped'    // Пропущен (ошибка летит) / Skipped (error flying past)
  | 'caught'     // Поймал ошибку / Caught the error
  | 'recovered'  // Восстановился и продолжил / Recovered and continued

// Шаг цепочки
// Chain step
interface ChainStep {
  id: number
  label: string          // Текст блока: '.then(step1)', '.catch(err)' / Block text
  type: 'then' | 'catch' // Тип шага / Step type
}

// -----------------------------------------------
// Данные / Data
// -----------------------------------------------

// TODO: Объявите массив CHAIN_STEPS из 6 элементов:
// TODO: Declare CHAIN_STEPS array of 6 elements:
// steps 1-5: type 'then', labels '.then(step1)' .. '.then(step5)'
// step 6:    type 'catch', label '.catch(err)'
// const CHAIN_STEPS: ChainStep[] = [...]

// -----------------------------------------------
// TODO: Реализуйте функцию computeStates
// TODO: Implement computeStates function
// -----------------------------------------------
// Принимает brokenAt (номер сломанного шага, 1-5 или null) и recoveryEnabled (bool)
// Accepts brokenAt (broken step number, 1-5 or null) and recoveryEnabled (bool)
// Возвращает массив TrackState[] для каждого шага CHAIN_STEPS
// Returns TrackState[] array for each CHAIN_STEPS element
//
// Логика:
// Logic:
// - Если brokenAt === null:
//   - все then → 'fulfilled', catch → 'idle'
// - Иначе:
//   - then с номером < brokenAt → 'fulfilled'
//   - then с номером === brokenAt → 'rejected'
//   - then с номером > brokenAt → 'skipped'
//   - catch → recoveryEnabled ? 'recovered' : 'caught'
//
// function computeStates(brokenAt: number | null, recoveryEnabled: boolean): TrackState[] { ... }

// Цвета фонов и рамок для каждого состояния
// Background and border colors for each state
// const STATE_COLORS: Record<TrackState, string> = { idle: '#1e293b', fulfilled: '#052e16', ... }
// const STATE_BORDER: Record<TrackState, string> = { idle: '#334155', fulfilled: '#10b981', ... }
// const STATE_LABEL: Record<TrackState, string> = { idle: '', fulfilled: '✓ fulfilled', ... }

export function Task4_2() {
  const { t } = useLanguage()

  // TODO: Состояние — сломанный шаг (1..5 или null)
  // TODO: State — broken step (1..5 or null)
  // const [brokenAt, setBrokenAt] = useState<number | null>(null)

  // TODO: Состояние — режим Recovery включён/выключен
  // TODO: State — Recovery mode on/off
  // const [recoveryEnabled, setRecoveryEnabled] = useState(false)

  // TODO: Состояние — блок .then(afterCatch): 'idle' или 'fulfilled'
  // TODO: State — .then(afterCatch) block: 'idle' or 'fulfilled'
  // const [afterCatchState, setAfterCatchState] = useState<TrackState>('idle')

  // TODO: Используйте useEffect для обновления afterCatchState
  // TODO: Use useEffect to update afterCatchState
  // Если brokenAt !== null && recoveryEnabled → 'fulfilled', иначе → 'idle'

  // TODO: Вычислите states = computeStates(brokenAt, recoveryEnabled)
  // TODO: Compute states = computeStates(brokenAt, recoveryEnabled)

  // TODO: Сгенерируйте codeSnippet на основе brokenAt, recoveryEnabled
  // TODO: Generate codeSnippet based on brokenAt, recoveryEnabled
  // Для каждого шага показывайте ✓ / ✗ throw Error! / — пропущен

  return (
    <div className="exercise-container">
      <h2>{t('task.4.2')}</h2>

      <div style={{ display: 'flex', gap: '1.25rem', flexWrap: 'wrap' }}>
        {/* TODO: Левая колонка — кнопки управления */}
        {/* TODO: Left column — control buttons */}
        {/* Кнопки выбора: 'Нет ошибки', 'Шаг 1', 'Шаг 2', ..., 'Шаг 5' */}
        {/* Selection buttons: 'No error', 'Step 1', 'Step 2', ..., 'Step 5' */}
        {/* Кнопка переключения Recovery: 'Recovery: ВКЛ / ВЫКЛ' */}
        {/* Recovery toggle button: 'Recovery: ON / OFF' */}
        {/* Пояснительный текст, описывающий текущее состояние */}
        {/* Explanatory text describing current state */}

        {/* TODO: Средняя колонка — цепочка блоков */}
        {/* TODO: Middle column — chain of blocks */}
        {/* Для каждого шага из CHAIN_STEPS: */}
        {/* For each step in CHAIN_STEPS: */}
        {/*   - Применяйте STATE_COLORS, STATE_BORDER для стилизации */}
        {/*   - Apply STATE_COLORS, STATE_BORDER for styling */}
        {/*   - Показывайте label и STATE_LABEL[state] */}
        {/*   - Show label and STATE_LABEL[state] */}
        {/*   - Между шагами — стрелка с цветом по состоянию */}
        {/*   - Between steps — colored arrow based on state */}
        {/* Если recoveryEnabled — показывайте дополнительный блок .then(afterCatch) */}
        {/* If recoveryEnabled — show extra .then(afterCatch) block */}

        {/* TODO: Правая колонка — code-сниппет */}
        {/* TODO: Right column — code snippet */}
        {/* Показывайте codeSnippet в <pre> теге */}
        {/* Show codeSnippet in <pre> tag */}
      </div>

      <div style={{ color: '#9ca3af', marginTop: '1rem', fontSize: '0.85rem' }}>
        Реализуйте визуализатор распространения ошибок
      </div>
    </div>
  )
}
