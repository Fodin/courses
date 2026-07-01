import { useState } from 'react'
import { useLanguage } from 'src/hooks'

// ============================================
// Задание 12.3: Transferable Objects
// Task 12.3: Transferable Objects
// ============================================
// Сравните клонирование (postMessage без transfer) и передачу
// (postMessage с Transferable-списком) для ArrayBuffer.
// Покажите: после transfer у отправителя byteLength === 0.
//
// Compare cloning (postMessage without transfer) vs. ownership transfer
// (postMessage with Transferable list) for ArrayBuffer.
// Show: after transfer, the sender's byteLength === 0.

// -----------------------------------------------
// Код воркера / Worker code
// -----------------------------------------------

// TODO: Код воркера, который получает buffer, имитирует обработку и отвечает
// TODO: Worker code that receives buffer, simulates processing and replies
// Воркер отправляет обратно: { byteLength: buffer.byteLength, elapsed }
//
// const TRANSFER_WORKER_CODE = `
//   self.onmessage = function(e) {
//     var buffer = e.data.buffer
//     ...
//     self.postMessage({ byteLength: buffer.byteLength, elapsed: elapsed })
//   }
// `

export function Task12_3() {
  const { t } = useLanguage()

  // TODO: Режим ('clone' | 'transfer')
  // TODO: Mode ('clone' | 'transfer')
  // const [mode, setMode] = useState<'clone' | 'transfer'>('clone')

  // TODO: Размер в MB (слайдер 1–50)
  // TODO: Size in MB (slider 1–50)
  // const [sizeMB, setSizeMB] = useState(10)

  // TODO: Состояния запуска, лога, byteLength до/после, времени, прогресса
  // TODO: Running state, log, byteLength before/after, elapsed, progress
  // const [isRunning, setIsRunning] = useState(false)
  // const [log, setLog] = useState<string[]>([])
  // const [originalByteLength, setOriginalByteLength] = useState<number | null>(null)
  // const [afterByteLength, setAfterByteLength] = useState<number | null>(null)
  // const [elapsed, setElapsed] = useState<number | null>(null)
  // const [progress, setProgress] = useState(0)

  // -----------------------------------------------
  // TODO: Реализуйте handleRun()
  // TODO: Implement handleRun()
  // -----------------------------------------------
  // 1. Создать ArrayBuffer размером sizeMB * 1024 * 1024
  // 2. Запомнить buffer.byteLength до отправки → setOriginalByteLength
  // 3. Создать Inline Worker (Blob → URL → new Worker → revokeObjectURL)
  // 4. Запустить прогресс-бар (setInterval)
  // 5a. Clone режим: worker.postMessage({ buffer })
  //     После: buffer.byteLength всё ещё равен оригиналу → setAfterByteLength
  // 5b. Transfer режим: worker.postMessage({ buffer }, [buffer])
  //     После: buffer.byteLength === 0 → setAfterByteLength(0)
  // 6. worker.onmessage → записать elapsed, остановить прогресс
  // 7. Обработать ошибки выделения памяти через try/catch

  return (
    <div className="exercise-container">
      <h2>{t('task.12.3')}</h2>

      {/* TODO: Вкладки "Копировать (Clone)" | "Передать (Transfer)" */}
      {/* TODO: Tabs "Copy (Clone)" | "Transfer" */}

      {/* TODO: Информационный блок объясняющий режим */}
      {/* TODO: Info block explaining the current mode */}

      {/* TODO: Слайдер размера (1–50 MB) */}
      {/* TODO: Size slider (1–50 MB) */}

      {/* TODO: Визуализация памяти — два блока "Главный поток" и "Worker" */}
      {/* TODO: Memory visualization — two blocks "Main Thread" and "Worker" */}
      {/* Clone: оба блока показывают данные (у каждого своя копия) */}
      {/* Clone: both blocks show data (each has its own copy) */}
      {/* Transfer: у главного — пусто (передан), у Worker — полный блок */}
      {/* Transfer: main has nothing (transferred), Worker has full block */}

      {/* TODO: Прогресс-бар (только во время isRunning) */}
      {/* TODO: Progress bar (only while isRunning) */}

      {/* TODO: Лог сообщений */}
      {/* TODO: Message log */}

      {/* TODO: Метрики: время (мс), byteLength после отправки */}
      {/* TODO: Metrics: elapsed (ms), byteLength after sending */}

      {/* TODO: Кнопки "Скопировать/Передать N MB" и "Сброс" */}
      {/* TODO: Buttons "Copy/Transfer N MB" and "Reset" */}

      <div style={{ color: '#9ca3af', marginTop: '1rem', fontSize: '0.85rem' }}>
        Реализуйте сравнение Clone и Transfer
      </div>
    </div>
  )
}
