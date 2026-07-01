import { useState, useRef, useCallback, useEffect } from 'react'
import { useLanguage } from 'src/hooks'

// ============================================
// Задание 14.3: Real-time Dashboard
// Task 14.3: Real-time Dashboard
// ============================================
// Полный async pipeline для мониторинга метрик сервера.
// Источник: async generator → Worker: агрегация →
// requestAnimationFrame: SVG sparklines
//
// Full async pipeline for server metric monitoring.
// Source: async generator → Worker: aggregation →
// requestAnimationFrame: SVG sparklines

// -----------------------------------------------
// Типы / Types
// -----------------------------------------------

interface Metric {
  cpu: number       // % загрузки CPU / CPU load %
  memory: number    // % использования памяти / Memory usage %
  rps: number       // Запросов в секунду / Requests per second
  timestamp: number
}

interface AggregatedMetric {
  current: number
  min: number
  max: number
  avg: number
  history: number[]   // последние 60 значений / last 60 values
}

// -----------------------------------------------
// Web Worker / Web Worker
// -----------------------------------------------

// TODO: Определите WORKER_CODE — строку кода Worker'а
// TODO: Define WORKER_CODE — Worker code string
// Worker получает: { metrics: Metric[], key: 'cpu' | 'memory' | 'rps' }
// Worker отвечает: { key, min, max, avg, history: number[] (slice -60) }
// Worker receives: { metrics: Metric[], key: 'cpu' | 'memory' | 'rps' }
// Worker responds: { key, min, max, avg, history: number[] (slice -60) }
//
// Используйте только var и function (не ES6+) в строке Worker'а
// Use only var and function (not ES6+) in Worker code string

// TODO: Реализуйте createWorker(): Worker
// TODO: Implement createWorker(): Worker
// new Blob([WORKER_CODE], { type: 'application/javascript' })
// URL.createObjectURL(blob) → new Worker(url) → URL.revokeObjectURL(url)

// -----------------------------------------------
// Async Generator / Async Generator
// -----------------------------------------------

// TODO: Реализуйте async function* metricStream(signal: AbortSignal)
// TODO: Implement async function* metricStream(signal: AbortSignal)
// Плавное случайное блуждание:
// Smooth random walk:
//   cpu: 40..95, изменение ±4 за шаг / change ±4 per step
//   memory: 20..90, изменение ±2
//   rps: 10..200, изменение ±10
// yield metric каждые 200ms пока !signal.aborted
// yield metric every 200ms while !signal.aborted
// При aborted — reject внутреннего Promise и завершить генератор

// -----------------------------------------------
// SVG Sparkline компонент / SVG Sparkline component
// -----------------------------------------------

// TODO: Реализуйте SparklineSVG({ history, color, label, current, min, max, avg })
// TODO: Implement SparklineSVG({ history, color, label, current, min, max, avg })
// SVG ширина 200, высота 50
// Нормализовать history в координаты (x, y)
// polyline по последним 60 значениям
// Пунктирная линия по avg значению
// Под графиком: min / avg / max

export function Task14_3() {
  const { t } = useLanguage()

  // TODO: useState isRunning, isPaused
  // TODO: useState isRunning, isPaused

  // TODO: useState stats: { cpu, memory, rps } — AggregatedMetric для каждой
  // TODO: useState stats: { cpu, memory, rps } — AggregatedMetric for each

  // TODO: useState fps — текущий FPS
  // TODO: useState fps — current FPS

  // TODO: ref для AbortController
  // TODO: ref for AbortController
  // const abortRef = useRef<AbortController | null>(null)

  // TODO: ref для Worker
  // TODO: ref for Worker
  // const workerRef = useRef<Worker | null>(null)

  // TODO: ref для requestAnimationFrame ID
  // TODO: ref for requestAnimationFrame ID
  // const rafRef = useRef<number>(0)

  // TODO: ref для накопления метрик между кадрами
  // TODO: ref for accumulating metrics between frames
  // const pendingMetricsRef = useRef<Metric[]>([])

  // TODO: ref для паузы (не useState чтобы избежать stale closure)
  // TODO: ref for pause state (not useState to avoid stale closure)
  // const pausedRef = useRef(false)

  // TODO: ref для счётчика FPS
  // TODO: ref for FPS counter
  // const fpsCounterRef = useRef({ frames: 0, lastTime: performance.now() })

  // TODO: Реализуйте rafLoop — функцию для requestAnimationFrame
  // TODO: Implement rafLoop — function for requestAnimationFrame
  // В каждом кадре:
  // In each frame:
  //   1. Измерить FPS: fpsCounterRef.frames++, каждые 1000ms → setFps(frames), сбросить счётчик
  //      Measure FPS: fpsCounterRef.frames++, every 1000ms → setFps(frames), reset counter
  //   2. Если !pausedRef и pendingMetricsRef.length > 0:
  //      If !pausedRef and pendingMetricsRef.length > 0:
  //      взять последние метрики, обновить stats
  //      take latest metrics, update stats
  //   3. rafRef.current = requestAnimationFrame(rafLoop)
  //      rafRef.current = requestAnimationFrame(rafLoop)

  const start = useCallback(() => {
    // TODO:
    // 1. Создать AbortController, Worker
    // 2. Настроить worker.onmessage → обновить statsRef по key
    // 3. Запустить rafLoop
    // 4. Запустить async IIFE с for-await-of по metricStream:
    //    - обновить current значения в statsRef
    //    - добавить metric в pendingMetricsRef
    //    - каждые 5 метрик → worker.postMessage({ metrics: batch, key })
  }, [])

  const pause = () => {
    // TODO: Переключить pausedRef.current и setIsPaused
  }

  const stop = useCallback(() => {
    // TODO: abortRef.current?.abort(), worker.terminate(), cancelAnimationFrame
  }, [])

  useEffect(() => {
    return () => stop()
  }, [stop])

  // TODO: Реализуйте полный рендер:
  // TODO: Implement full render:
  // - Pipeline hint: async generator → main thread → Worker → rAF → SVG
  // - Кнопки: "Старт" / "Пауза" / "Стоп"
  // - FPS индикатор (зелёный ≥55, жёлтый ≥30, красный <30)
  // - Индикатор статуса потока (активен / пауза)
  // - Три SparklineSVG для cpu, memory, rps
  // - Placeholder текст когда isRunning=false

  return (
    <div className="exercise-container">
      <h2>{t('task.14.3')}</h2>
      <div style={{ color: '#9ca3af', marginTop: '1rem', fontSize: '0.85rem' }}>
        Реализуйте real-time dashboard: async generator + Web Worker + rAF
      </div>
    </div>
  )
}
