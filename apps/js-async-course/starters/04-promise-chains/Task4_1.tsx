import { useState, useEffect, useRef } from 'react'
import { useLanguage } from 'src/hooks'

// ============================================
// Задание 4.1: Promise Pipeline — цепочка трансформаций
// Task 4.1: Promise Pipeline — chain of transformations
// ============================================
// Реализуйте "конвейер" из 5 станций .then(), который анимирует
// прохождение данных через каждый шаг.
// Implement a "pipeline" of 5 .then() stations that animates
// data passing through each step.

// -----------------------------------------------
// Типы / Types
// -----------------------------------------------

interface PipelineStage {
  id: number
  name: string         // Название функции / Function name, e.g. 'fetchUser'
  icon: string         // Эмодзи / Emoji icon
  input: string        // Описание входных данных / Input description
  output: string       // Описание выходных данных / Output description
  color: string        // Цвет карточки / Card color
  description: string  // Краткое описание шага / Step description
}

// Варианты возврата из .then() для переключателя
// Return mode variants for toggle
type ReturnMode = 'value' | 'promise'

// -----------------------------------------------
// Данные / Data
// -----------------------------------------------

// TODO: Объявите массив STAGES типа PipelineStage[] с 5 элементами:
// TODO: Declare STAGES array of type PipelineStage[] with 5 elements:
// 1. fetchUser   — вход: 'userId: 42',          выход: '{ id: 42, name: "Alice" }',  цвет: '#3b82f6'
// 2. getPosts    — вход: '{ id: 42, ... }',     выход: '[post1, post2, ...post5]',   цвет: '#8b5cf6'
// 3. filterRecent— вход: '[post1..post5]',      выход: '[post3, post4, post5]',      цвет: '#ec4899'
// 4. sortByLikes — вход: '[post3, post4, post5]', выход: '[post5(32), ...]',          цвет: '#f59e0b'
// 5. formatOutput— вход: '[post5(32), ...]',    выход: '"Top posts: ..."',            цвет: '#10b981'
// const STAGES: PipelineStage[] = [...]

export function Task4_1() {
  const { t } = useLanguage()

  // TODO: Состояние для индекса активной карточки (-1 = нет активных)
  // TODO: State for active stage index (-1 = none active)
  // const [activeStage, setActiveStage] = useState<number>(-1)

  // TODO: Состояние для флага "конвейер запущен"
  // TODO: State for "pipeline running" flag
  // const [running, setRunning] = useState(false)

  // TODO: Состояние для режима возврата из шага 3 (0-indexed = шаг 2)
  // TODO: State for return mode of step 3 (0-indexed = step 2)
  // const [returnMode, setReturnMode] = useState<ReturnMode>('value')

  // TODO: Ref для хранения таймера (чтобы очищать при сбросе)
  // TODO: Ref for storing timer (to clear on reset)
  // const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // -----------------------------------------------
  // TODO: Реализуйте runPipeline()
  // TODO: Implement runPipeline()
  // -----------------------------------------------
  // 1. Если running — возвращаем сразу (защита от двойного запуска)
  // 2. setRunning(true), setActiveStage(-1)
  // 3. Для каждого индекса i от 0 до STAGES.length - 1:
  //    - setTimeout(() => setActiveStage(i), (i + 1) * 700)
  // 4. После последнего шага — setTimeout(() => setRunning(false), последний_таймаут + 700)
  // Подсказка: STAGES.forEach((_, i) => { setTimeout(...) })

  // -----------------------------------------------
  // TODO: Реализуйте reset()
  // TODO: Implement reset()
  // -----------------------------------------------
  // Очищает timerRef (если есть), сбрасывает activeStage = -1, running = false

  // -----------------------------------------------
  // TODO: Добавьте useEffect для очистки таймера при размонтировании
  // TODO: Add useEffect for cleanup on unmount
  // -----------------------------------------------
  // useEffect(() => { return () => { if (timerRef.current) clearTimeout(timerRef.current) } }, [])

  // -----------------------------------------------
  // TODO: Объявите codeSnippet зависящий от returnMode
  // TODO: Declare codeSnippet depending on returnMode
  // -----------------------------------------------
  // 'value' → показывает return Promise в каждом шаге
  // 'promise' → на шаге 3 показывает return value (recent.sort(...))

  return (
    <div className="exercise-container">
      <h2>{t('task.4.1')}</h2>

      {/* TODO: Переключатель returnMode */}
      {/* TODO: Return mode toggle */}
      {/* Кнопки: 'return Promise (обычно)' и 'return value (тот же эффект)' */}
      {/* Buttons: 'return Promise (normally)' and 'return value (same effect)' */}

      <div style={{ display: 'flex', gap: '1.25rem', flexWrap: 'wrap' }}>
        {/* TODO: Левая колонка — список карточек STAGES */}
        {/* TODO: Left column — list of STAGES cards */}
        {/* Для каждой карточки показывайте: icon, name, description */}
        {/* For each card show: icon, name, description */}
        {/* Если карточка активная (activeStage === i) — выделите её */}
        {/* If card is active (activeStage === i) — highlight it */}
        {/* Если карточка выполнена (activeStage > i) — показывайте input/output */}
        {/* If card is done (activeStage > i) — show input/output */}
        {/* Между карточками — стрелка ↓ */}
        {/* Between cards — arrow ↓ */}

        {/* TODO: Правая колонка — code-сниппет и пояснение */}
        {/* TODO: Right column — code snippet and explanation */}
        {/* Показывайте codeSnippet в <pre> теге */}
        {/* Show codeSnippet in <pre> tag */}
        {/* Добавьте пояснение о return value vs return Promise */}
        {/* Add explanation about return value vs return Promise */}

        {/* TODO: Кнопки управления */}
        {/* TODO: Control buttons */}
        {/* 'Запустить конвейер' (заблокирована если running) */}
        {/* 'Run pipeline' (disabled if running) */}
        {/* 'Сброс' */}
        {/* 'Reset' */}
      </div>

      <div style={{ color: '#9ca3af', marginTop: '1rem', fontSize: '0.85rem' }}>
        Реализуйте визуализатор конвейера промисов
      </div>
    </div>
  )
}
