import { useState, useRef } from 'react'
import { useLanguage } from 'src/hooks'

// ============================================
// Задание 2.1: Callback Hell Визуализатор
// Task 2.1: Callback Hell Visualizer
// ============================================
// Реализуйте интерактивный визуализатор pipeline из 5 операций,
// соединённых вложенными error-first колбэками.
// Implement an interactive visualizer for a 5-step pipeline
// connected via nested error-first callbacks.

// -----------------------------------------------
// Типы / Types
// -----------------------------------------------

// Статус каждого шага pipeline / Status of each pipeline step
type StepStatus = 'idle' | 'running' | 'done' | 'error'

// Шаг pipeline / Pipeline step descriptor
interface PipelineStep {
  id: number       // Номер шага (1–5) / Step number (1–5)
  name: string     // Название функции / Function name
  detail: string   // Описание действия / Action description
  color: string    // Цвет подсветки / Highlight color
  delay: number    // Симулируемая задержка в мс / Simulated delay in ms
}

// Запись в timeline / Timeline log entry
interface TimelineEntry {
  time: number   // Миллисекунды с момента старта / Ms since pipeline start
  text: string   // Описание события / Event description
  color: string  // Цвет строки / Row color
}

// -----------------------------------------------
// Данные / Data
// -----------------------------------------------

// TODO: Определите массив шагов PIPELINE_STEPS типа PipelineStep[]
// TODO: Define the PIPELINE_STEPS array of type PipelineStep[]
// Шаги: getUser → getPosts → getComments → filterSpam → sendReport
// Steps: getUser → getPosts → getComments → filterSpam → sendReport
// Каждому шагу — цвет из палитры: #3b82f6, #8b5cf6, #ec4899, #f59e0b, #10b981
// Each step gets a color from the palette: #3b82f6, #8b5cf6, #ec4899, #f59e0b, #10b981
// Задержки (ms): 600, 700, 800, 500, 600
// Delays (ms): 600, 700, 800, 500, 600
// const PIPELINE_STEPS: PipelineStep[] = [...]

// -----------------------------------------------
// Вспомогательная функция / Helper
// -----------------------------------------------

// TODO: Реализуйте функцию simulateCallback
// TODO: Implement the simulateCallback function
// Функция симулирует асинхронную операцию через setTimeout.
// Simulates an async operation via setTimeout.
// Сигнатура error-first колбэка: (err: string | null, result: string) => void
// Error-first callback signature: (err: string | null, result: string) => void
// Если shouldError === true — передать ошибку первым аргументом
// If shouldError === true — pass an error as the first argument
// Если shouldError === false — передать null и строку-результат
// If shouldError === false — pass null and a result string
//
// function simulateCallback(
//   step: PipelineStep,
//   shouldError: boolean,
//   callback: (err: string | null, result: string) => void
// ): ReturnType<typeof setTimeout> { ... }

// -----------------------------------------------
// Основная функция pipeline / Main pipeline function
// -----------------------------------------------

// TODO: Реализуйте функцию runCallbackPipeline
// TODO: Implement the runCallbackPipeline function
// Функция запускает 5 операций через ВЛОЖЕННЫЕ колбэки (не промисы!).
// Runs 5 operations via NESTED callbacks (not promises!).
//
// Для каждого шага:
// For each step:
//   1. Вызовите onStepChange(stepId, 'running', detail) перед стартом
//      Call onStepChange(stepId, 'running', detail) before starting
//   2. Вызовите simulateCallback(step, errorOnStep === stepId, (err, result) => { ... })
//      Call simulateCallback(step, errorOnStep === stepId, (err, result) => { ... })
//   3. В колбэке: если err — onStepChange(stepId, 'error', err), onDone(false), return
//      In callback: if err — onStepChange(stepId, 'error', err), onDone(false), return
//   4. Иначе — onStepChange(stepId, 'done', '...'), и запустить следующий шаг
//      Otherwise — onStepChange(stepId, 'done', '...'), and start next step
//   5. После шага 5: onDone(true)
//      After step 5: onDone(true)
//
// Важно: вложенность! Каждый следующий шаг запускается ВНУТРИ колбэка предыдущего.
// Important: nesting! Each next step starts INSIDE the previous step's callback.
//
// function runCallbackPipeline(
//   errorOnStep: number,           // 0 = нет ошибок / no error
//   onStepChange: (stepId: number, status: StepStatus, message: string) => void,
//   onDone: (success: boolean) => void
// ): void { ... }

export function Task2_1() {
  const { t } = useLanguage()

  // TODO: Состояние для статусов шагов (ключ = stepId)
  // TODO: State for step statuses (key = stepId)
  // const [statuses, setStatuses] = useState<Record<number, StepStatus>>({})

  // TODO: Состояние для сообщений каждого шага (ключ = stepId)
  // TODO: State for messages of each step (key = stepId)
  // const [messages, setMessages] = useState<Record<number, string>>({})

  // TODO: Состояние для timeline (массив событий)
  // TODO: State for the timeline (array of events)
  // const [timeline, setTimeline] = useState<TimelineEntry[]>([])

  // TODO: Состояние: запущен ли pipeline сейчас
  // TODO: State: is the pipeline currently running
  // const [isRunning, setIsRunning] = useState(false)

  // TODO: Состояние: результат выполнения (true/false/null)
  // TODO: State: pipeline result (true/false/null)
  // const [finished, setFinished] = useState<boolean | null>(null)

  // TODO: Состояние: на каком шаге вызвать ошибку (0 = без ошибок)
  // TODO: State: which step should fail (0 = no error)
  // const [errorOnStep, setErrorOnStep] = useState(0)

  // TODO: Ref для времени старта (performance.now())
  // TODO: Ref for start time (performance.now())
  // const startTimeRef = useRef<number>(0)

  // -----------------------------------------------
  // TODO: Реализуйте функцию handleRun()
  // TODO: Implement handleRun()
  // -----------------------------------------------
  // 1. Сбросить все состояния (statuses, messages, timeline, finished)
  //    Reset all state (statuses, messages, timeline, finished)
  // 2. setIsRunning(true)
  // 3. Запомнить время старта в startTimeRef.current = performance.now()
  //    Save start time in startTimeRef.current = performance.now()
  // 4. Вызвать runCallbackPipeline(errorOnStep, onStepChange, onDone)
  //    Call runCallbackPipeline(errorOnStep, onStepChange, onDone)
  //    В onStepChange — обновить statuses и messages, добавить запись в timeline
  //    In onStepChange — update statuses and messages, add a timeline entry
  //    В onDone — setIsRunning(false), setFinished(success)
  //    In onDone — setIsRunning(false), setFinished(success)

  // -----------------------------------------------
  // TODO: Реализуйте функцию handleReset()
  // TODO: Implement handleReset()
  // -----------------------------------------------
  // Сбросить все состояния в начальные значения
  // Reset all state to initial values

  return (
    <div className="exercise-container">
      <h2>{t('task.2.1')}</h2>

      {/* TODO: Визуальная пирамида шагов */}
      {/* TODO: Visual step pyramid */}
      {/* Для каждого шага из PIPELINE_STEPS: */}
      {/* For each step in PIPELINE_STEPS: */}
      {/* - Отступ: index * 14px (создаёт пирамиду) */}
      {/*   Indent: index * 14px (creates the pyramid) */}
      {/* - Цвет фона и рамки берётся из step.color */}
      {/*   Background and border color comes from step.color */}
      {/* - Показать иконку статуса: ○ idle, ● running, ✓ done, ✗ error */}
      {/*   Show status icon: ○ idle, ● running, ✓ done, ✗ error */}
      {/* - Активный шаг (running) — свечение (boxShadow) */}
      {/*   Active step (running) — glow effect (boxShadow) */}

      {/* TODO: Переключатели ошибки */}
      {/* TODO: Error trigger buttons */}
      {/* Кнопки: "OK" (errorOnStep = 0), "#1"–"#5" (errorOnStep = 1..5) */}
      {/* Buttons: "OK" (errorOnStep = 0), "#1"–"#5" (errorOnStep = 1..5) */}
      {/* Активная кнопка выделена цветом */}
      {/* Active button is highlighted */}

      {/* TODO: Timeline */}
      {/* TODO: Timeline */}
      {/* Прокручиваемый список событий с метками "+Xms" слева */}
      {/* Scrollable list of events with "+Xms" timestamps on the left */}

      {/* TODO: Кнопки управления */}
      {/* TODO: Control buttons */}
      {/* "Запустить" — запускает pipeline */}
      {/* "Run" — starts the pipeline */}
      {/* "Сброс" — сбрасывает состояние */}
      {/* "Reset" — resets the state */}

      <div style={{ color: '#9ca3af', marginTop: '1rem', fontSize: '0.85rem' }}>
        Реализуйте визуализатор pipeline с вложенными колбэками
      </div>
    </div>
  )
}
