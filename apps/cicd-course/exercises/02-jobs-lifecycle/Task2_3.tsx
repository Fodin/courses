// ============================================
// Задание 2.3: retry и timeout
// Task 2.3: retry and timeout
// ============================================
//
// RU: Реализуй конфигуратор retry-стратегий с симуляцией нестабильного (flaky) джоба.
//     Пользователь настраивает retry.max, retry.when и timeout, затем запускает симуляцию.
//     Каждая попытка случайно успешна или нет (по заданной вероятности).
//     При неудаче — автоматически перезапустить если тип ошибки входит в retry.when.
//
// EN: Implement a retry strategy configurator with flaky job simulation.
//     User configures retry.max, retry.when and timeout, then runs simulation.
//     Each attempt randomly succeeds or fails (based on configured probability).
//     On failure — auto-retry if error type matches retry.when.
// ============================================

import { useState } from 'react'
import { useLanguage } from '@courses/platform'

// TODO (RU): Определи тип RetryWhen — возможные типы ошибок для retry:
//            'runner_system_failure' | 'script_failure' | 'stuck_or_timeout_failure' | 'api_failure'
// TODO (EN): Define RetryWhen type — possible error types for retry
// type RetryWhen = ...

// TODO (RU): Определи интерфейс AttemptRecord — запись об одной попытке:
//            { attempt: number, result: 'success' | 'failed', errorType: RetryWhen | null,
//              retried: boolean, durationMs: number }
// TODO (EN): Define AttemptRecord interface — record of a single attempt
// interface AttemptRecord { ... }

// TODO (RU): Создай массив RETRY_WHEN_OPTIONS с описанием каждого типа ошибки:
//            [{ value: RetryWhen, label: string, description: string }]
// TODO (EN): Create RETRY_WHEN_OPTIONS array with descriptions for each error type
// const RETRY_WHEN_OPTIONS = [...]

// TODO (RU): Реализуй вспомогательную функцию delay(ms): Promise<void>
//            через new Promise(resolve => setTimeout(resolve, ms))
// TODO (EN): Implement helper delay(ms): Promise<void>
// function delay(ms: number): Promise<void> { ... }

export function Task2_3() {
  const { t } = useLanguage()
  // TODO (RU): Добавь состояния конфигурации:
  //            - retryMax: number (начальное: 2)
  //            - retryWhen: RetryWhen[] (начальное: ['runner_system_failure', 'script_failure'])
  //            - timeoutSec: number (начальное: 10)
  //            - successProb: number (начальное: 60 — вероятность успеха в %)
  // TODO (EN): Add configuration state:
  //            - retryMax, retryWhen, timeoutSec, successProb

  // TODO (RU): Добавь состояния симуляции:
  //            - isRunning: boolean
  //            - attempts: AttemptRecord[]
  //            - currentAttempt: number (номер текущей попытки)
  //            - progress: number (0-100, прогресс таймаута)
  //            - finalResult: 'success' | 'failed' | null
  //            - totalRetries: number (сколько раз сработал retry)
  // TODO (EN): Add simulation state:
  //            - isRunning, attempts, currentAttempt, progress, finalResult, totalRetries

  // TODO (RU): Реализуй функцию toggleRetryWhen(value) — добавляет/убирает тип из retryWhen
  // TODO (EN): Implement toggleRetryWhen(value) — adds/removes type from retryWhen

  // TODO (RU): Реализуй функцию pickRandomErrorType() — случайно выбирает тип ошибки из всех RetryWhen
  // TODO (EN): Implement pickRandomErrorType() — randomly picks error type from all RetryWhen values

  // TODO (RU): Реализуй функцию shouldRetry(errorType) — проверяет, входит ли тип ошибки в retryWhen
  // TODO (EN): Implement shouldRetry(errorType) — checks if error type is in retryWhen

  // TODO (RU): Реализуй async функцию runSimulation():
  //            Цикл от attempt=1 до retryMax+1:
  //            1. Анимировать прогресс-шкалу через setInterval (от 0 до 100% за timeoutSec секунд)
  //            2. После завершения прогресса: случайно определить результат (Math.random < successProb/100)
  //            3. Если success → финальный результат success, выход из цикла
  //            4. Если failed → выбрать случайный тип ошибки
  //            5. Если shouldRetry(errorType) && есть ещё попытки → retry (увеличить totalRetries)
  //            6. Если нет больше попыток или errorType не в retryWhen → финальный результат failed
  //            Записывать каждую попытку в AttemptRecord
  // TODO (EN): Implement async runSimulation():
  //            Loop from attempt=1 to retryMax+1:
  //            1. Animate progress bar via setInterval (0 to 100% over timeoutSec seconds)
  //            2. After progress: randomly determine result
  //            3. success → set final result, break
  //            4. failed → pick random error type
  //            5. shouldRetry && more attempts remain → retry
  //            6. No more attempts or type not in retryWhen → final failed

  // TODO (RU): Сгенерируй YAML-превью конфига на основе текущих настроек retryMax, retryWhen, timeoutSec
  //            Обновляется автоматически при каждом изменении параметров
  // TODO (EN): Generate YAML config preview from current retryMax, retryWhen, timeoutSec settings.
  //            Updates automatically when any parameter changes.
  const yamlPreview = `flaky-job:
  script:
    - ./run-tests.sh
  # TODO: добавь timeout и retry`

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', maxWidth: 760, margin: '0 auto', padding: '1.5rem' }}>
      <h2 style={{ marginTop: 0 }}>{t('task.2.3')}</h2>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
        {/* Left: configurator */}
        <div>
          <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 10 }}>{t('task.2.3.configuration')}</div>

          {/* TODO (RU): Слайдер retry.max (0-5). Показывать "итого попыток: N+1" */}
          {/* TODO (EN): Slider for retry.max (0-5). Show "total attempts: N+1" */}
          <div style={{ marginBottom: 14 }}>
            <label style={{ fontSize: 12, color: '#555' }}>retry.max: TODO</label>
            <input type='range' min={0} max={5} defaultValue={2} style={{ width: '100%' }} />
          </div>

          {/* TODO (RU): Чекбоксы для retry.when — по одному для каждого RETRY_WHEN_OPTIONS
                        Показывать label и description для каждого */}
          {/* TODO (EN): Checkboxes for retry.when — one per RETRY_WHEN_OPTIONS entry
                        Show label and description for each */}
          <div style={{ marginBottom: 14 }}>
            <div style={{ fontSize: 12, color: '#555', marginBottom: 4 }}>retry.when:</div>
            <div style={{ color: '#999', fontSize: 12 }}>{t('task.2.3.retryWhenPlaceholder')}</div>
          </div>

          {/* TODO (RU): Слайдер timeout (3-20 секунд) */}
          {/* TODO (EN): Slider for timeout (3-20 seconds) */}
          <div style={{ marginBottom: 14 }}>
            <label style={{ fontSize: 12, color: '#555' }}>timeout: TODO</label>
            <input type='range' min={3} max={20} defaultValue={10} style={{ width: '100%' }} />
          </div>

          {/* TODO (RU): Слайдер "вероятность успеха" (0-100%) */}
          {/* TODO (EN): Slider for "success probability" (0-100%) */}
          <div>
            <label style={{ fontSize: 12, color: '#555' }}>{t('task.2.3.successProbability')}: 60%</label>
            <input type='range' min={0} max={100} defaultValue={60} style={{ width: '100%' }} />
          </div>
        </div>

        {/* Right: YAML preview */}
        <div>
          <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 10 }}>{t('task.2.3.yamlConfig')}</div>
          <pre style={{
            backgroundColor: '#1e1e2e',
            color: '#cdd6f4',
            padding: '12px',
            borderRadius: 8,
            fontSize: 12,
            lineHeight: 1.6,
            margin: 0,
            whiteSpace: 'pre-wrap',
          }}>
            {yamlPreview}
          </pre>
        </div>
      </div>

      {/* TODO (RU): Кнопки "Запустить симуляцию" и "Reset"
                    После завершения показать итог: SUCCESS или FAILED */}
      {/* TODO (EN): "Run simulation" and "Reset" buttons.
                    After completion show result: SUCCESS or FAILED */}
      <div style={{ display: 'flex', gap: 10, marginBottom: '1.5rem' }}>
        <button>{t('task.2.3.runSimulation')}</button>
        <button>Reset</button>
      </div>

      {/* TODO (RU): Прогресс-шкала для текущей попытки:
                    - Текст: "Попытка X / N — выполнение..."
                    - Горизонтальная шкала: ширина = progress% от timeoutSec
                    - Показывать только во время isRunning */}
      {/* TODO (EN): Progress bar for current attempt:
                    - Text: "Attempt X / N — running..."
                    - Horizontal bar: width = progress% of timeoutSec
                    - Show only while isRunning */}

      {/* TODO (RU): Лог попыток — для каждой AttemptRecord показать:
                    - Номер попытки, результат (success/failed), тип ошибки
                    - Был ли retry или нет (и почему нет, если errorType не в retryWhen)
                    - Время выполнения в секундах */}
      {/* TODO (EN): Attempt log — for each AttemptRecord show:
                    - Attempt number, result (success/failed), error type
                    - Was there a retry or not (and why not if errorType not in retryWhen)
                    - Duration in seconds */}
      <div style={{ border: '1px dashed #ccc', borderRadius: 8, padding: '12px', color: '#999', textAlign: 'center', fontSize: 13 }}>
        {t('task.2.3.attemptsLogPlaceholder')}
      </div>

      {/* TODO (RU): Блок статистики после завершения:
                    "Попыток: X | Retry: Y | Итог: SUCCESS / FAILED после N попыток" */}
      {/* TODO (EN): Statistics block after completion:
                    "Attempts: X | Retries: Y | Result: SUCCESS / FAILED after N attempts" */}
    </div>
  )
}
