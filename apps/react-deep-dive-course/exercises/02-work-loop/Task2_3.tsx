import { useState, useRef, useCallback } from 'react'
import { useLanguage } from 'src/hooks'

// Time Slicing Demo — синхронный рендер vs чанки

type RenderMode = 'sync' | 'chunked'

type RenderResult = {
  mode: RenderMode
  time: number       // время рендера в ms
  frameDrops: number // количество кадров > 33ms
  minFps: number     // минимальный FPS за время рендера
}

const TOTAL_ITEMS = 10000
const CHUNK_SIZE = 100

// TODO: Реализовать функцию для создания "дорогого" элемента
// Возвращает строку вида: "Item #00042: ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■"
function expensiveLabel(i: number): string {
  // TODO: реализовать
  return `Item #${i}`
}

export function Task2_3() {
  const { t } = useLanguage()

  // TODO: Хранить список элементов (string[])
  // const [items, setItems] = useState<string[]>([])

  // TODO: Хранить статус рендера (идёт или нет)
  // const [isRendering, setIsRendering] = useState(false)

  // TODO: Хранить текущий режим рендера
  // const [currentMode, setCurrentMode] = useState<RenderMode | null>(null)

  // TODO: Хранить прогресс (для chunked режима)
  // const [progress, setProgress] = useState(0)

  // TODO: Хранить текущий FPS (обновляется через RAF)
  // const [fps, setFps] = useState<number | null>(null)

  // TODO: Хранить результаты двух режимов
  // const [results, setResults] = useState<RenderResult[]>([])

  // Refs для RAF-измерений
  // const rafRef = useRef<number | null>(null)
  // const frameDropsRef = useRef(0)
  // const minFpsRef = useRef(Infinity)
  // const lastTimeRef = useRef(0)
  // const startTimeRef = useRef(0)
  // const isMeasuringRef = useRef(false)

  // TODO: Реализовать startMeasuring()
  // Запускает RAF-цикл:
  // 1. Сбросить frameDropsRef.current = 0, minFpsRef.current = Infinity
  // 2. Записать startTime = performance.now()
  // 3. В каждом кадре: вычислить elapsed = now - lastTime
  //    - если elapsed > 33: frameDrops++
  //    - обновить fps через setFps
  //    - обновить minFps
  // 4. Продолжать через requestAnimationFrame пока isMeasuringRef.current

  // TODO: Реализовать stopMeasuring()
  // Останавливает RAF, возвращает { time, frameDrops, minFps }

  // TODO: Реализовать runSync()
  // 1. setIsRendering(true), startMeasuring()
  // 2. setTimeout(..., 100) — даём RAF стартовать
  // 3. Внутри: одним Array.from создать все 10000 элементов, setItems(all)
  // 4. requestAnimationFrame → stopMeasuring, сохранить результат, setIsRendering(false)

  // TODO: Реализовать runChunked()
  // 1. setIsRendering(true), startMeasuring()
  // 2. Рекурсивная функция renderNextChunk:
  //    - Добавить CHUNK_SIZE элементов через setItems(prev => [...prev, ...chunk])
  //    - setProgress(rendered)
  //    - Если rendered < TOTAL_ITEMS: setTimeout(renderNextChunk, 0)
  //    - Иначе: stopMeasuring, сохранить результат, setIsRendering(false)

  return (
    <div className="exercise-container">
      <h2>{t('task.2.3')}</h2>

      {/* TODO: Две кнопки: "Синхронный рендер" (красная) и "Chunked рендер" (зелёная) */}
      {/* Обе disabled во время рендера */}
      {/* Рядом: текущий режим и FPS если isRendering */}

      {/* TODO: Прогресс-бар (только для chunked, пока isRendering) */}

      {/* TODO: Карточки с результатами (если есть syncResult или chunkedResult) */}
      {/* Для каждого режима: время рендера, frame drops, min FPS */}

      {/* TODO: Список элементов (ограничить до 200 для отображения) */}
      {/* Высота 200px, overflow-y: auto */}

      <p style={{ color: '#6b7280', fontSize: '13px' }}>
        Реализуй expensiveLabel, startMeasuring, stopMeasuring, runSync, runChunked
      </p>
    </div>
  )
}
