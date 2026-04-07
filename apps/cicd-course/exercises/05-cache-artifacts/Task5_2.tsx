// Task 5.2: Cache — build speed simulation
// Задание 5.2: Cache — ускорение сборки

import { useState } from 'react'
import { useLanguage } from '@courses/platform'

// Status type for pipeline steps
// Тип статуса шага: ожидание / выполняется / выполнено
type StepStatus = 'pending' | 'running' | 'done'

// TODO: Define pipeline steps
// Определи шаги пайплайна: { name, withoutCacheMs, withCacheMs }
// Минимум 4 шага. "Установка зависимостей" — 3000ms без кэша, 400ms с кэшем
const PIPELINE_STEPS: { name: string; withoutCacheMs: number; withCacheMs: number }[] = [
  // TODO: заполни массив
]

// TODO: Define cache key strategies
// { value: string, label: string, yaml: string }[]
// Варианты: статический, по ветке, по lock-файлу
const CACHE_KEY_STRATEGIES: { value: string; label: string; yaml: string }[] = []

// TODO: Define cache path options
// { id: string, label: string }[]
const CACHE_PATHS_OPTIONS: { id: string; label: string }[] = []

// TODO: Implement buildCacheYaml
// Принимает: strategy (string), paths (string[])
// Возвращает: YAML-строку конфига кэша
function buildCacheYaml(_strategy: string, _paths: string[]): string {
  // TODO: вернуть YAML с cache:key (по выбранной стратегии) и cache:paths
  return ''
}

// TODO: Implement StatusDot component
// Отображает цветной кружок в зависимости от статуса:
// pending — серый, running — жёлтый, done — зелёный
function StatusDot({ status }: { status: StepStatus }) {
  // TODO: вернуть <div> с нужным цветом
  return <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#ccc' }}>{status}</div>
}

export function Task5_2() {
  const { t } = useLanguage()
  // TODO: Add state for pipeline statuses
  // withoutCacheStatuses и withCacheStatuses — массивы StepStatus[], изначально все 'pending'
  const [withoutCacheStatuses, setWithoutCacheStatuses] = useState<StepStatus[]>(
    PIPELINE_STEPS.map(() => 'pending')
  )
  const [withCacheStatuses, setWithCacheStatuses] = useState<StepStatus[]>(
    PIPELINE_STEPS.map(() => 'pending')
  )
  const [withoutCacheTime, setWithoutCacheTime] = useState<number | null>(null)
  const [withCacheTime, setWithCacheTime] = useState<number | null>(null)
  const [running, setRunning] = useState(false)
  const [cacheStrategy, setCacheStrategy] = useState('files')
  const [cachePaths, setCachePaths] = useState<string[]>(['node_modules/'])

  // TODO: Implement togglePath
  const togglePath = (_label: string) => {
    // TODO
  }

  // TODO: Implement runSimulation
  // 1. Сбросить все статусы в 'pending'
  // 2. Запустить оба пайплайна параллельно через Promise.all
  // 3. Для каждого шага: поставить 'running', подождать duration мс, поставить 'done'
  // 4. По завершению всех шагов — сохранить итоговое время
  const runSimulation = async () => {
    if (running) return
    setRunning(true)

    // TODO: реализуй симуляцию
    // Подсказка: используй вспомогательную функцию runPipeline(durations, setStatuses, setTime)
    // Подсказка: setTimeout внутри new Promise(r => setTimeout(r, ms))

    setRunning(false)
  }

  // Suppressed unused variable warnings
  void setWithoutCacheStatuses
  void setWithCacheStatuses
  void setWithoutCacheTime
  void setWithCacheTime
  void CACHE_KEY_STRATEGIES
  void CACHE_PATHS_OPTIONS
  void StatusDot

  return (
    <div style={{ padding: '1rem', fontFamily: 'system-ui, sans-serif', maxWidth: '860px' }}>
      <h2 style={{ marginBottom: '0.25rem' }}>{t('task.5.2')}</h2>
      <p style={{ color: '#666', marginTop: 0, marginBottom: '1.5rem' }}>
        {t('task.5.2.subtitle')}
      </p>

      {/* TODO: Two pipeline blocks side by side */}
      {/* Левый — "Без кэша" (красная рамка), правый — "С кэшем" (зелёная рамка) */}
      {/* В каждом — список шагов с StatusDot и названием */}
      {/* После завершения — итоговое время */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', color: '#aaa' }}>
        <div style={{ flex: 1, border: '1px solid #ccc', padding: '1rem', borderRadius: '8px' }}>
          {t('task.5.2.withoutCache')}: {withoutCacheStatuses.join(', ')} | {withoutCacheTime}ms
        </div>
        <div style={{ flex: 1, border: '1px solid #ccc', padding: '1rem', borderRadius: '8px' }}>
          {t('task.5.2.withCache')}: {withCacheStatuses.join(', ')} | {withCacheTime}ms
        </div>
      </div>

      {/* TODO: Run button */}
      {/* Неактивна пока running === true */}
      <button
        onClick={runSimulation}
        disabled={running}
        style={{
          padding: '0.6rem 1.5rem',
          background: running ? '#bdbdbd' : '#1565C0',
          color: '#fff',
          border: 'none',
          borderRadius: '8px',
          cursor: running ? 'not-allowed' : 'pointer',
          fontWeight: 600,
          marginBottom: '1rem',
        }}
      >
        {running ? t('task.5.2.simulating') : t('task.5.2.runSimulation')}
      </button>

      {/* TODO: Savings banner */}
      {/* Показывать после завершения: "Кэш сэкономил X сек (Y%)" */}

      {/* TODO: Cache config section */}
      {/* Кнопки для cache:key стратегии */}
      {/* Чекбоксы для cache:paths */}
      {/* YAML-вывод buildCacheYaml(cacheStrategy, cachePaths) */}
      <div style={{ color: '#aaa', fontSize: '0.85rem' }}>
        Strategy: {cacheStrategy} | Paths: {cachePaths.join(', ')}
        <br />
        {buildCacheYaml(cacheStrategy, cachePaths) || `(${t('task.5.2.cacheConfig')})`}
      </div>
      <div style={{ display: 'none' }}>
        {/* suppress unused warnings */}
        <button onClick={() => setCacheStrategy('x')} />
        <button onClick={() => togglePath('x')} />
      </div>
    </div>
  )
}
