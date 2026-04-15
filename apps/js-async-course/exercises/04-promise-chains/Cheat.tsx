// ============================================
// Подсказки для Level 4: Promise — цепочки и ошибки
// Cheat sheet for Level 4: Promise — chains and errors
// ============================================
// Этот файл НЕ используется платформой — только для самопроверки.
// This file is NOT used by the platform — for self-check only.

// -----------------------------------------------
// 4.1: Анимация конвейера
// 4.1: Pipeline animation
// -----------------------------------------------

// Запуск конвейера с задержкой между шагами:
// Starting pipeline with delay between steps:
//
// const runPipeline = () => {
//   if (running) return
//   setRunning(true)
//   setActiveStage(-1)
//   STAGES.forEach((_, i) => {
//     setTimeout(() => {
//       setActiveStage(i)
//       if (i === STAGES.length - 1) {
//         setTimeout(() => setRunning(false), 700)
//       }
//     }, (i + 1) * 700)
//   })
// }

// Проверка состояния карточки:
// Card state check:
//
// const isActive = activeStage === i    // карточка сейчас активна / card is currently active
// const isDone = activeStage > i        // карточка уже выполнена / card already executed
// const isPending = activeStage < i     // карточка ещё не запущена / card not yet started
//
// Стиль активной карточки / Active card style:
// background: isActive ? `${stage.color}22` : isDone ? '#1e293b' : '#0f172a'
// border: `1px solid ${isActive ? stage.color : isDone ? '#334155' : '#1e293b'}`
// opacity: activeStage === -1 ? 0.7 : (isDone || isActive ? 1 : 0.35)

// -----------------------------------------------
// 4.2: Состояния цепочки при ошибке
// 4.2: Chain states on error
// -----------------------------------------------

// Вычисление состояний для каждого шага:
// Computing states for each step:
//
// function computeStates(
//   brokenAt: number | null,
//   recoveryEnabled: boolean
// ): TrackState[] {
//   return CHAIN_STEPS.map((step, i) => {
//     const stepNum = i + 1  // 1-indexed
//
//     if (step.type === 'catch') {
//       if (brokenAt === null) return 'idle'
//       return recoveryEnabled ? 'recovered' : 'caught'
//     }
//
//     // type === 'then'
//     if (brokenAt === null) return 'fulfilled'
//     if (stepNum < brokenAt) return 'fulfilled'
//     if (stepNum === brokenAt) return 'rejected'
//     return 'skipped'
//   })
// }

// Цвета по состоянию (фон / рамка):
// Colors by state (background / border):
//
// const STATE_COLORS: Record<TrackState, string> = {
//   idle:      '#1e293b',
//   fulfilled: '#052e16',
//   rejected:  '#450a0a',
//   skipped:   '#1e1e2e',
//   caught:    '#451a03',
//   recovered: '#052e16',
// }
// const STATE_BORDER: Record<TrackState, string> = {
//   idle:      '#334155',
//   fulfilled: '#10b981',
//   rejected:  '#ef4444',
//   skipped:   '#334155',
//   caught:    '#f59e0b',
//   recovered: '#10b981',
// }

// useEffect для afterCatchState:
// useEffect for afterCatchState:
//
// useEffect(() => {
//   if (brokenAt !== null && recoveryEnabled) {
//     setAfterCatchState('fulfilled')
//   } else {
//     setAfterCatchState('idle')
//   }
// }, [brokenAt, recoveryEnabled])

// -----------------------------------------------
// 4.3: Пошаговое выполнение
// 4.3: Step-by-step execution
// -----------------------------------------------

// Пример одного шага (шаг 5 — 'E' синхронно):
// Example of one step (step 5 — 'E' synchronously):
//
// {
//   description: 'Синхронно: console.log("E") → выводит "E". Call Stack теперь пуст.',
//   stackItems: ['console.log("E")'],
//   microtasks: [{ id: 'm1', label: 'колбэк1 (→ "B")', type: 'microtask', color: '#8b5cf6' }],
//   macrotasks: [{ id: 't1', label: 'setTimeout cb (→ "D")', type: 'macrotask', color: '#f59e0b' }],
//   output: ['A', 'E'],
//   highlight: 9,  // 0-indexed строка кода / 0-indexed code line
// }

// Навигация по шагам:
// Step navigation:
//
// const handleNext = () => setStepIndex(s => Math.min(s + 1, EXEC_STEPS.length - 1))
// const handleReset = () => setStepIndex(0)

// Симуляция starvation:
// Starvation simulation:
//
// const startStarvation = () => {
//   setStarvationRunning(true)
//   setMacroCount(0)
//   setMicroCount(0)
//   let micro = 0
//   let macro = 0
//   starvRef.current = setInterval(() => {
//     micro += 10
//     if (micro % 50 === 0) macro += 1
//     setMicroCount(micro)
//     setMacroCount(macro)
//   }, 100)
//   setTimeout(() => {
//     if (starvRef.current) clearInterval(starvRef.current)
//     setStarvationRunning(false)
//   }, 3000)
// }

// -----------------------------------------------
// Общие паттерны стилизации / Common styling patterns
// -----------------------------------------------

// Тёмная тема (контейнер):
// Dark theme (container):
//
// const containerStyle: React.CSSProperties = {
//   background: '#0f172a',
//   color: '#e2e8f0',
//   padding: '1.5rem',
//   borderRadius: '12px',
//   fontFamily: "'Fira Code', 'Cascadia Code', monospace",
//   fontSize: '0.9rem',
// }

// Кнопка (заблокированная / активная):
// Button (disabled / active):
//
// const btnStyle = (disabled?: boolean, color?: string): React.CSSProperties => ({
//   padding: '0.45rem 1.1rem',
//   borderRadius: '6px',
//   border: 'none',
//   cursor: disabled ? 'not-allowed' : 'pointer',
//   background: disabled ? '#1e293b' : (color ?? '#3b82f6'),
//   color: disabled ? '#475569' : '#fff',
//   fontFamily: 'inherit',
//   fontSize: '0.82rem',
// })
