import { useState, useEffect, useRef, useCallback } from 'react'
import { useLanguage } from 'src/hooks'

// ============================================
// Задание 11.1: rAF vs setTimeout — сравнение плавности
// Task 11.1: rAF vs setTimeout — smoothness comparison
// ============================================
// Реализуйте два анимированных шарика:
// Implement two animated balls:
//   - Синий: requestAnimationFrame (плавно)
//   - Blue: requestAnimationFrame (smooth)
//   - Оранжевый: setTimeout(fn, 16) (рывки под нагрузкой)
//   - Orange: setTimeout(fn, 16) (jerky under load)
// Добавьте FPS-счётчики и переключатель нагрузки.
// Add FPS counters and a load toggle.

// -----------------------------------------------
// Типы / Types
// -----------------------------------------------

// Ширина трека для шариков / Track width for balls
const TRACK_WIDTH = 360

// -----------------------------------------------
// TODO: Реализуйте компонент Task11_1
// TODO: Implement Task11_1 component
// -----------------------------------------------
// Состояние / State:
//   - running: boolean — запущена ли анимация
//   - heavyLoad: boolean — включена ли нагрузка
//   - rafPos: number — позиция rAF-шарика (0..TRACK_WIDTH)
//   - setPos: number — позиция setTimeout-шарика (0..TRACK_WIDTH)
//   - rafFps: number — текущий FPS rAF-шарика
//   - setFps: number — текущий FPS setTimeout-шарика
//
// Refs (не вызывают ре-рендер при изменении):
//   - rafRef: useRef<number | null> — id последнего requestAnimationFrame
//   - setRef: useRef<ReturnType<typeof setTimeout> | null> — id последнего setTimeout
//   - runningRef: useRef<boolean> — синхронный флаг работы (для замыканий)
//   - heavyLoadRef: useRef<boolean> — синхронный флаг нагрузки
//   - rafPosRef, setPosRef: useRef<number> — позиции без ре-рендера
//   - rafFrameTimesRef, setFrameTimesRef: useRef<number[]> — массив интервалов кадров
//   - fpsIntervalRef: useRef<...> — id интервала обновления FPS

export function Task11_1() {
  const { t } = useLanguage()

  // TODO: Объявите useState для running, heavyLoad, rafPos, setPos, rafFps, setFps
  // TODO: Declare useState for running, heavyLoad, rafPos, setPos, rafFps, setFps

  // TODO: Объявите useRef для управления анимацией без ре-рендеров
  // TODO: Declare useRef for controlling animation without re-renders

  // -----------------------------------------------
  // TODO: Реализуйте doHeavyWork()
  // TODO: Implement doHeavyWork()
  // -----------------------------------------------
  // Если heavyLoadRef.current — выполнять ~2ms синхронной работы:
  // If heavyLoadRef.current — do ~2ms of synchronous work:
  //   const end = performance.now() + 2
  //   while (performance.now() < end) Math.sqrt(Math.random())

  // -----------------------------------------------
  // TODO: Реализуйте startRaf()
  // TODO: Implement startRaf()
  // -----------------------------------------------
  // Анимационный цикл через requestAnimationFrame:
  // Animation loop via requestAnimationFrame:
  //   1. Проверить runningRef.current — если false, выйти
  //   2. Вычислить delta от прошлого кадра, добавить в rafFrameTimesRef (max 30)
  //   3. Вызвать doHeavyWork()
  //   4. Сдвинуть rafPosRef на 2px по кругу (% TRACK_WIDTH)
  //   5. Обновить state setRafPos(rafPosRef.current)
  //   6. rafRef.current = requestAnimationFrame(loop)

  // -----------------------------------------------
  // TODO: Реализуйте startSet()
  // TODO: Implement startSet()
  // -----------------------------------------------
  // Аналогично startRaf(), но через setTimeout(loop, 16):
  // Same as startRaf(), but via setTimeout(loop, 16):
  //   - Измерять время вручную через performance.now()
  //   - В конце: setRef.current = setTimeout(loop, 16)

  // -----------------------------------------------
  // TODO: Реализуйте start()
  // TODO: Implement start()
  // -----------------------------------------------
  // 1. Установить runningRef.current = true, setRunning(true)
  // 2. Сбросить позиции и массивы времён
  // 3. Запустить startRaf() и startSet()
  // 4. Запустить setInterval для обновления FPS каждые 500ms:
  //    avg = sum(frameTimes) / frameTimes.length
  //    fps = Math.round(1000 / avg)

  // -----------------------------------------------
  // TODO: Реализуйте stop() и reset()
  // TODO: Implement stop() and reset()
  // -----------------------------------------------
  // stop: runningRef.current = false, cancelAnimationFrame, clearTimeout, clearInterval
  // reset: stop() + сбросить все state в начальные значения

  // -----------------------------------------------
  // TODO: Добавьте useEffect для cleanup при размонтировании
  // TODO: Add useEffect for cleanup on unmount
  // -----------------------------------------------

  // -----------------------------------------------
  // TODO: Реализуйте toggleLoad()
  // TODO: Implement toggleLoad()
  // -----------------------------------------------
  // Переключить heavyLoadRef.current и state heavyLoad

  return (
    <div className="exercise-container">
      <h2>{t('task.11.1')}</h2>

      {/* TODO: Трек rAF-шарика */}
      {/* TODO: rAF ball track */}
      {/* Подпись "requestAnimationFrame — синхронизация с монитором" */}
      {/* Label "requestAnimationFrame — synced with monitor" */}
      {/* Шарик: div с position:absolute, left=rafPos, borderRadius:50% */}
      {/* Ball: div with position:absolute, left=rafPos, borderRadius:50% */}
      {/* FPS счётчик под треком */}
      {/* FPS counter below track */}

      {/* TODO: Трек setTimeout-шарика */}
      {/* TODO: setTimeout ball track */}
      {/* Аналогично, но left=setPos и другой цвет */}
      {/* Same but left=setPos and different color */}

      {/* TODO: Кнопки управления */}
      {/* TODO: Control buttons */}
      {/* Старт / Стоп — переключаются */}
      {/* Start / Stop — toggle */}
      {/* Сброс — disabled во время анимации */}
      {/* Reset — disabled during animation */}
      {/* Нагрузка ВКЛ/ВЫКЛ */}
      {/* Load ON/OFF */}

      {/* TODO: Пояснение о причине разницы */}
      {/* TODO: Explanation about the difference */}

      <div style={{ color: '#9ca3af', marginTop: '1rem', fontSize: '0.85rem' }}>
        Реализуйте сравнение rAF vs setTimeout
      </div>
    </div>
  )
}
