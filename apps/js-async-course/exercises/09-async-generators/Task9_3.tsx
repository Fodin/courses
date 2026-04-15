import { useState, useRef, useEffect, useCallback } from 'react'
import { useLanguage } from 'src/hooks'

// ============================================
// Задание 9.3: Real-time event stream
// Task 9.3: Real-time Event Stream
// ============================================
// Реализуйте симулятор потока биржевых котировок через async-генератор.
// Implement a stock quote stream simulator via async generator.
//
// Архитектура / Architecture:
//   Producer (setInterval 300ms) → Queue → Consumer (async loop, 200ms/event)
//   Backpressure: при паузе Consumer спит, Producer пропускает события

// -----------------------------------------------
// Типы / Types
// -----------------------------------------------

interface StockEvent {
  id: number
  symbol: string
  price: number
  change: number  // % change
  timestamp: string
}

// -----------------------------------------------
// Данные / Data
// -----------------------------------------------

const SYMBOLS = ['AAPL', 'GOOG', 'MSFT', 'AMZN', 'TSLA']
const BASE_PRICES: Record<string, number> = {
  AAPL: 185, GOOG: 140, MSFT: 420, AMZN: 185, TSLA: 175,
}

// -----------------------------------------------
// Утилиты / Utilities
// -----------------------------------------------

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

// TODO: Реализуйте generateTick(id) — генерирует случайный тик котировки
// TODO: Implement generateTick(id) — generates a random quote tick
// Алгоритм / Algorithm:
//   - symbol = случайный из SYMBOLS / random from SYMBOLS
//   - base = BASE_PRICES[symbol]
//   - change = (Math.random() - 0.48) * 4  // небольшой дрейф вверх / slight upward drift
//   - price = +(base + change).toFixed(2)
//   - pct = +((change / base) * 100).toFixed(2)
//   - timestamp = текущее время HH:MM:SS / current time HH:MM:SS
// function generateTick(id: number): StockEvent { ... }

export function Task9_3() {
  const { t } = useLanguage()

  // TODO: Состояние для ленты событий (последние 30)
  // TODO: State for event feed (last 30)
  // const [events, setEvents] = useState<StockEvent[]>([])

  // TODO: Состояние для данных графика (последние 20 значений)
  // TODO: State for chart data (last 20 values)
  // const [chartData, setChartData] = useState<number[]>([])

  // TODO: Статус: 'idle' | 'running' | 'paused' | 'stopped'
  // TODO: Status: 'idle' | 'running' | 'paused' | 'stopped'
  // const [status, setStatus] = useState<'idle' | 'running' | 'paused' | 'stopped'>('idle')

  // TODO: Счётчики обработанных и пропущенных событий
  // TODO: Processed and skipped event counters
  // const [processedCount, setProcessedCount] = useState(0)
  // const [skippedCount, setSkippedCount] = useState(0)

  // TODO: Refs для управления состоянием без стейта
  // TODO: Refs for state control without React state
  // statusRef — для проверки в async-цикле (без closure-проблем)
  // statusRef — for checking in async loop (avoids stale closure issues)
  // const statusRef = useRef<'idle' | 'running' | 'paused' | 'stopped'>('idle')
  // const counterRef = useRef(0)
  // const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  // const queueRef = useRef<StockEvent[]>([])

  // -----------------------------------------------
  // TODO: handleStart() — запускает Producer и Consumer
  // TODO: handleStart() — starts Producer and Consumer
  // -----------------------------------------------
  // Producer: setInterval 300ms → pushает тики в queueRef
  //   - если paused → пропускает (skippedCount++)
  //   - если stopped → clearInterval
  //
  // Consumer: async loop
  //   - while (statusRef.current !== 'stopped'):
  //     - if paused: await delay(100); continue
  //     - if queueRef.current.length === 0: await delay(50); continue
  //     - event = queueRef.current.shift()
  //     - обновить events, chartData, processedCount
  //     - await delay(200)  // имитация обработки / processing simulation

  // -----------------------------------------------
  // TODO: handlePause() — переключает паузу
  // TODO: handlePause() — toggles pause
  // -----------------------------------------------

  // -----------------------------------------------
  // TODO: handleStop() — останавливает поток
  // TODO: handleStop() — stops the stream
  // -----------------------------------------------

  // TODO: useEffect для очистки при размонтировании
  // TODO: useEffect for cleanup on unmount

  // -----------------------------------------------
  // TODO: renderChart() — SVG sparkline для chartData
  // TODO: renderChart() — SVG sparkline for chartData
  // -----------------------------------------------
  // Используйте <polyline points={...} /> с viewBox="0 0 300 60"
  // Use <polyline points={...} /> with viewBox="0 0 300 60"
  // Нормализуйте значения: y = H - ((v - min) / range) * H
  // Normalize values: y = H - ((v - min) / range) * H

  return (
    <div className="exercise-container">
      <h2>{t('task.9.3')}</h2>

      {/* TODO: Статус и счётчики (Обработано N, Пропущено M) */}
      {/* TODO: Status and counters (Processed N, Skipped M) */}

      {/* TODO: SVG sparkline график (chartData) */}
      {/* TODO: SVG sparkline chart (chartData) */}

      {/* TODO: Лента событий (events.map(...)) */}
      {/* TODO: Event feed (events.map(...)) */}
      {/* Формат строки: timestamp | SYMBOL | $price | +/-pct% */}
      {/* Row format: timestamp | SYMBOL | $price | +/-pct% */}
      {/* Положительное изменение — зелёный, отрицательное — красный */}
      {/* Positive change — green, negative — red */}

      {/* TODO: Блок backpressure при статусе 'paused' */}
      {/* TODO: Backpressure notice when status === 'paused' */}

      {/* TODO: Кнопки "Старт", "Пауза/Продолжить", "Стоп" */}
      {/* TODO: Buttons "Start", "Pause/Resume", "Stop" */}
      {/* "Старт" заблокирована если running или paused */}
      {/* "Start" disabled when running or paused */}

      <div style={{ color: '#9ca3af', marginTop: '1rem', fontSize: '0.85rem' }}>
        Реализуйте симулятор потока котировок
      </div>
    </div>
  )
}
