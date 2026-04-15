import { useState, useRef, useCallback } from 'react'
import { useLanguage } from 'src/hooks'

// ============================================
// Задание 7.5: Circuit Breaker
// Task 7.5: Circuit Breaker
// ============================================
// Реализуйте паттерн Circuit Breaker с тремя состояниями.
// Implement the Circuit Breaker pattern with three states.

// -----------------------------------------------
// Типы / Types
// -----------------------------------------------

// Состояния автомата / State machine states
type CircuitState = 'CLOSED' | 'OPEN' | 'HALF_OPEN'

// Режим симулируемого API / Simulated API mode
type ApiMode = 'stable' | 'unstable' | 'down'

interface CBConfig {
  failureThreshold: number  // Число ошибок подряд для перехода CLOSED → OPEN / Failures to trip OPEN
  resetTimeout: number      // Мс в состоянии OPEN перед переходом в HALF_OPEN / Ms in OPEN before HALF_OPEN
}

interface CBLogEntry {
  time: number
  message: string
  type: 'success' | 'error' | 'open' | 'half_open' | 'close' | 'rejected'
}

// -----------------------------------------------
// TODO: Реализуйте логику Circuit Breaker в хуке или компоненте
// TODO: Implement Circuit Breaker logic in a hook or component
// -----------------------------------------------
//
// Алгоритм makeRequest():
// Algorithm for makeRequest():
//
// 1. Если состояние === 'OPEN':
//    - Вычислить прошедшее время = Date.now() - openTime
//    - Если время < resetTimeout: добавить лог 'rejected', выйти
//    - Иначе: перейти в 'HALF_OPEN', добавить лог 'half_open'
//
// 2. Попробовать вызвать API:
//    - Успех + состояние 'HALF_OPEN': перейти в 'CLOSED', сбросить счётчик ошибок, лог 'close'
//    - Успех + состояние 'CLOSED': сбросить счётчик, лог 'success'
//    - Ошибка: увеличить счётчик ошибок
//      - Если счётчик >= failureThreshold или состояние 'HALF_OPEN': перейти в 'OPEN', лог 'open'
//      - Иначе: лог 'error'
//
// Для хранения состояния между вызовами используйте useRef (не useState):
// Use useRef (not useState) to store mutable state between calls:
//   const stateRef = useRef<CircuitState>('CLOSED')
//   const failuresRef = useRef(0)
//   const openTimeRef = useRef(0)
// Для синхронизации UI вызывайте setCbState/setFailureCount после изменения ref

export function Task7_5() {
  const { t } = useLanguage()

  const [apiMode, setApiMode] = useState<ApiMode>('stable')
  const [cbState, setCbState] = useState<CircuitState>('CLOSED')
  const [failureCount, setFailureCount] = useState(0)
  const [config, setConfig] = useState<CBConfig>({
    failureThreshold: 3,
    resetTimeout: 3000,
  })
  const [cbLog, setCbLog] = useState<CBLogEntry[]>([])
  const [running, setRunning] = useState(false)
  const [requestCount, setRequestCount] = useState(0)

  // Refs для мутабельного состояния (не вызывают ре-рендер)
  // Refs for mutable state (don't trigger re-renders)
  const stateRef = useRef<CircuitState>('CLOSED')
  const failuresRef = useRef(0)
  const openTimeRef = useRef<number>(0)

  const addLog = useCallback((message: string, type: CBLogEntry['type']) => {
    const entry: CBLogEntry = { time: Date.now(), message, type }
    setCbLog((prev) => [...prev.slice(-20), entry])
  }, [])

  // TODO: Реализуйте callApi — симулирует нестабильный API
  // TODO: Implement callApi — simulates an unstable API
  // stable: всегда resolve('OK') / always resolve('OK')
  // down: всегда reject(Error('Service down')) / always reject(Error('Service down'))
  // unstable: 70% шанс reject / 70% chance reject
  // const callApi = useCallback(async (): Promise<string> => { ... }, [apiMode])

  // TODO: Реализуйте makeRequest — основная логика Circuit Breaker
  // TODO: Implement makeRequest — core Circuit Breaker logic
  // const makeRequest = useCallback(async () => { ... }, [callApi, config, addLog])

  // TODO: Реализуйте handleAutoTest — 10 запросов с паузой 400ms
  // TODO: Implement handleAutoTest — 10 requests with 400ms pause
  // const handleAutoTest = async () => { ... }

  const handleReset = () => {
    stateRef.current = 'CLOSED'
    failuresRef.current = 0
    setCbState('CLOSED')
    setFailureCount(0)
    setCbLog([])
    setRequestCount(0)
  }

  return (
    <div className="exercise-container">
      <h2>{t('task.7.5')}</h2>

      {/* TODO: Индикатор текущего состояния (CLOSED / OPEN / HALF-OPEN) с цветом */}
      {/* TODO: Current state indicator (CLOSED / OPEN / HALF-OPEN) with color */}

      {/* TODO: Выбор режима API (stable / unstable / down) */}
      {/* TODO: API mode selector (stable / unstable / down) */}

      {/* TODO: Настройки failureThreshold и resetTimeout */}
      {/* TODO: Settings for failureThreshold and resetTimeout */}

      {/* TODO: Визуализация автомата: три блока CLOSED → OPEN → HALF-OPEN */}
      {/* TODO: State machine visualization: three blocks CLOSED → OPEN → HALF-OPEN */}

      {/* TODO: Лог событий с цветовой кодировкой */}
      {/* TODO: Events log with color coding */}

      {/* TODO: Кнопки "Один запрос", "10 запросов (авто)", "Сброс" */}
      {/* TODO: Buttons "Single request", "10 requests (auto)", "Reset" */}

      <div style={{ color: '#9ca3af', marginTop: '1rem', fontSize: '0.85rem' }}>
        Реализуйте Circuit Breaker с тремя состояниями
      </div>
    </div>
  )
}
