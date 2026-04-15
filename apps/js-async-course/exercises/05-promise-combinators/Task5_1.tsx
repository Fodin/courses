import { useState, useEffect, useRef } from 'react'
import { useLanguage } from 'src/hooks'

// ============================================
// Задание 5.1: Promise.all — параллельные загрузки
// Task 5.1: Promise.all — parallel loaders
// ============================================
// Реализуйте визуализацию Promise.all с пятью параллельными загрузками.
// Implement a Promise.all visualization with five parallel loaders.
//
// Ключевое поведение / Key behavior:
// - Все загрузки стартуют ОДНОВРЕМЕННО (параллельно)
//   All loaders start SIMULTANEOUSLY (in parallel)
// - При первом сбое → Promise.all сразу rejected (fail-fast)
//   On first failure → Promise.all immediately rejected (fail-fast)
// - Остальные промисы продолжают выполняться, но результаты игнорируются
//   Other promises continue but their results are ignored

// -----------------------------------------------
// Типы / Types
// -----------------------------------------------

interface LoaderState {
  progress: number                              // 0–100
  status: 'idle' | 'running' | 'done' | 'error'
  value: string                                 // fulfilled value
  error: string                                 // rejection message
}

// -----------------------------------------------
// Константы / Constants
// -----------------------------------------------

const LOADER_NAMES = ['Alpha', 'Beta', 'Gamma', 'Delta', 'Epsilon']
const LOADER_COLORS = ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981']

// Длительности загрузок в мс / Loader durations in ms
const LOADER_DURATIONS = [800, 1400, 600, 1100, 900]

function makeLoaderState(): LoaderState {
  return { progress: 0, status: 'idle', value: '', error: '' }
}

export function Task5_1() {
  const { t } = useLanguage()

  // TODO: Состояние пяти загрузок (массив LoaderState)
  // TODO: State for five loaders (array of LoaderState)
  // const [loaders, setLoaders] = useState<LoaderState[]>(...)

  // TODO: Состояние переключателей сбоев (массив boolean, 5 штук)
  // TODO: State for fail toggles (boolean array, 5 items)
  // const [fails, setFails] = useState<boolean[]>([false, false, false, false, false])

  // TODO: Состояние результата (строка или null)
  // TODO: Result state (string or null)
  // const [result, setResult] = useState<string | null>(null)

  // TODO: Флаг успешности результата
  // TODO: Result success flag
  // const [resultOk, setResultOk] = useState(true)

  // TODO: Флаг выполнения
  // TODO: Running flag
  // const [running, setRunning] = useState(false)

  // TODO: Ref для хранения таймеров (для очистки при сбросе)
  // TODO: Ref for storing interval IDs (for cleanup on reset)
  // const timersRef = useRef<ReturnType<typeof setInterval>[]>([])

  // -----------------------------------------------
  // TODO: Реализуйте clearTimers() — очистка всех интервалов
  // TODO: Implement clearTimers() — clear all intervals
  // -----------------------------------------------

  // -----------------------------------------------
  // TODO: Реализуйте handleReset()
  // TODO: Implement handleReset()
  // -----------------------------------------------
  // - Очистите таймеры / Clear timers
  // - Сбросьте loaders в начальное состояние / Reset loaders to initial state
  // - Очистите result / Clear result
  // - Сбросьте running в false / Reset running to false

  // -----------------------------------------------
  // TODO: Реализуйте handleRun()
  // TODO: Implement handleRun()
  // -----------------------------------------------
  // Алгоритм / Algorithm:
  //
  // 1. Вызовите handleReset(), установите running=true
  //    Call handleReset(), set running=true
  //
  // 2. Установите все loaders в status='running'
  //    Set all loaders to status='running'
  //
  // 3. Создайте массив Promise<string> для каждого загрузчика:
  //    Create array of Promise<string> for each loader:
  //    - Каждый промис анимирует progress через setInterval (каждые 30мс)
  //      Each promise animates progress via setInterval (every 30ms)
  //    - Прогресс = Math.min(100, round((elapsed / LOADER_DURATIONS[i]) * 100))
  //      Progress = Math.min(100, round((elapsed / LOADER_DURATIONS[i]) * 100))
  //    - При progress >= 100:
  //      When progress >= 100:
  //      - clearInterval, обновите статус в зависимости от fails[i]
  //        clearInterval, update status depending on fails[i]
  //      - fails[i]=true → status='error', reject(new Error(...))
  //        fails[i]=true → status='error', reject(new Error(...))
  //      - fails[i]=false → status='done', resolve('data_name')
  //        fails[i]=false → status='done', resolve('data_name')
  //    - Сохраните интервал в timersRef.current
  //      Store interval in timersRef.current
  //
  // 4. Запустите Promise.all(promises)
  //    Run Promise.all(promises)
  //    - .then(values) → setResult(JSON.stringify(values)), setResultOk(true), setRunning(false)
  //    - .catch(err) → setResult(err.message), setResultOk(false), setRunning(false)
  //      + пометьте оставшиеся running-загрузки как 'error' с сообщением 'Отменено (fail-fast)'
  //        + mark remaining running loaders as 'error' with 'Отменено (fail-fast)' message

  // -----------------------------------------------
  // TODO: Очищайте таймеры при размонтировании компонента
  // TODO: Clear timers on component unmount
  // -----------------------------------------------
  // useEffect(() => () => clearTimers(), [])

  return (
    <div className="exercise-container">
      <h2>{t('task.5.1')}</h2>

      {/* TODO: Блок переключателей сбоев */}
      {/* TODO: Fail toggles block */}
      {/* Кнопки для каждого из 5 загрузчиков: "Alpha: ОК" / "Alpha: СБОЙ" */}
      {/* Buttons for each of 5 loaders: "Alpha: ОК" / "Alpha: СБОЙ" */}

      {/* TODO: Прогресс-бары для 5 загрузок */}
      {/* TODO: Progress bars for 5 loaders */}
      {/* Для каждого: имя, статус-бейдж, цветная полоска прогресса */}
      {/* For each: name, status badge, colored progress bar */}
      {/* Зелёный при done, красный при error, цвет загрузчика при running */}
      {/* Green when done, red when error, loader color when running */}

      {/* TODO: Блок результата (появляется после завершения) */}
      {/* TODO: Result block (appears after completion) */}
      {/* Зелёный при success: "Promise.all fulfilled: [...]" */}
      {/* Green on success: "Promise.all fulfilled: [...]" */}
      {/* Красный при fail: "Promise.all rejected (fail-fast): <message>" */}
      {/* Red on fail: "Promise.all rejected (fail-fast): <message>" */}

      {/* TODO: Кнопки управления */}
      {/* TODO: Control buttons */}
      {/* "Запустить Promise.all" (disabled при running) и "Сброс" */}
      {/* "Run Promise.all" (disabled when running) and "Reset" */}

      <div style={{ color: '#9ca3af', marginTop: '1rem', fontSize: '0.85rem' }}>
        Реализуйте визуализацию Promise.all
      </div>
    </div>
  )
}
