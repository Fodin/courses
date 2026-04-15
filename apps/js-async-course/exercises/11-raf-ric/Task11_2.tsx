import { useState, useEffect, useRef, useCallback } from 'react'
import { useLanguage } from 'src/hooks'

// ============================================
// Задание 11.2: rAF и Event Loop — анатомия кадра
// Task 11.2: rAF and Event Loop — frame anatomy
// ============================================
// Постройте визуализацию фаз браузерного кадра:
// Build a visualization of browser frame phases:
//   JS → rAF → Style → Layout → Paint → Composite → Idle
// Анимируйте переход между фазами и показывайте историю кадров.
// Animate phase transitions and show frame history.

// -----------------------------------------------
// Типы / Types
// -----------------------------------------------

// Фазы кадра / Frame phases
type Phase = 'idle' | 'js' | 'raf' | 'style' | 'layout' | 'paint' | 'composite'

// Запись о кадре / Frame record
interface FrameRecord {
  id: number        // Номер кадра / Frame number
  duration: number  // Длительность в ms / Duration in ms
  rafCount: number  // Количество rAF-колбэков / Number of rAF callbacks
}

// Метаданные фазы / Phase metadata
interface PhaseConfig {
  key: Phase
  label: string
  color: string
  desc: string
}

// -----------------------------------------------
// Данные / Data
// -----------------------------------------------

// Конфигурация фаз в правильном порядке
// Phase configuration in correct order
const PHASES: PhaseConfig[] = [
  { key: 'js',        label: 'JS',     color: '#f59e0b', desc: 'Макро/микрозадачи' },
  { key: 'raf',       label: 'rAF',    color: '#8b5cf6', desc: 'rAF колбэки' },
  { key: 'style',     label: 'Style',  color: '#3b82f6', desc: 'Вычисление стилей' },
  { key: 'layout',    label: 'Layout', color: '#06b6d4', desc: 'Reflow' },
  { key: 'paint',     label: 'Paint',  color: '#10b981', desc: 'Отрисовка' },
  { key: 'composite', label: 'Comp.',  color: '#ec4899', desc: 'Композитинг' },
]

export function Task11_2() {
  const { t } = useLanguage()

  // TODO: Состояние
  // TODO: State
  // - running: boolean
  // - frames: FrameRecord[] — история последних 8 кадров
  // - currentPhase: Phase — текущая активная фаза (начальная: 'idle')
  // - rafCount: number — количество rAF-колбэков в кадре (1, 3 или 5)
  // - heavyRaf: boolean — включена ли тяжёлая нагрузка в rAF

  // TODO: Refs
  // TODO: Refs
  // - runningRef: useRef<boolean>
  // - frameCountRef: useRef<number> — счётчик кадров
  // - rafRef: useRef<number | null> — id requestAnimationFrame
  // - heavyRafRef: useRef<boolean> — синхронный флаг нагрузки

  // -----------------------------------------------
  // TODO: Реализуйте runFrame()
  // TODO: Implement runFrame()
  // -----------------------------------------------
  // Симуляция одного кадра браузера:
  // Simulation of one browser frame:
  //
  // 1. Проверить runningRef.current
  // 2. Увеличить frameCountRef.current, зафиксировать frameStart = performance.now()
  // 3. setCurrentPhase('js')
  // 4. setTimeout(() => {
  //      setCurrentPhase('raf')
  //      // Если heavyRafRef.current — добавить ~8ms нагрузки
  //      setTimeout(() => { setCurrentPhase('style')
  //        setTimeout(() => { setCurrentPhase('layout')
  //          setTimeout(() => { setCurrentPhase('paint')
  //            setTimeout(() => { setCurrentPhase('composite')
  //              // Вычислить duration = Math.round(performance.now() - frameStart)
  //              // Добавить запись в frames (max 8 кадров через slice(-8+1))
  //              setTimeout(() => {
  //                setCurrentPhase('idle')
  //                rafRef.current = requestAnimationFrame(runFrame)
  //              }, 100)
  //            }, 40) // composite
  //          }, 40) // paint
  //        }, 40) // layout
  //      }, 40) // style
  //    }, 60) // js phase

  // -----------------------------------------------
  // TODO: Реализуйте start() и stop()
  // TODO: Implement start() and stop()
  // -----------------------------------------------
  // start: runningRef.current = true, сбросить frames и frameCount, запустить runFrame через rAF
  // stop: runningRef.current = false, cancelAnimationFrame, setCurrentPhase('idle')

  // TODO: useEffect для cleanup при размонтировании
  // TODO: useEffect for cleanup on unmount

  return (
    <div className="exercise-container">
      <h2>{t('task.11.2')}</h2>

      {/* TODO: Легенда фаз */}
      {/* TODO: Phase legend */}
      {/* PHASES.map — для каждой фазы: цветной квадрат + label + desc */}
      {/* PHASES.map — for each phase: colored square + label + desc */}
      {/* Активная фаза (currentPhase === p.key): выделить рамкой и масштабом */}
      {/* Active phase (currentPhase === p.key): highlight with border and scale */}

      {/* TODO: Описание текущей фазы */}
      {/* TODO: Current phase description */}
      {/* Блок, который меняется при смене currentPhase */}
      {/* Block that changes when currentPhase changes */}

      {/* TODO: История кадров */}
      {/* TODO: Frame history */}
      {/* Столбчатая диаграмма: frames.map — высота prop. duration */}
      {/* Bar chart: frames.map — height proportional to duration */}
      {/* Кадры >24ms — красные (потенциальный jank) */}
      {/* Frames >24ms — red (potential jank) */}

      {/* TODO: Настройки */}
      {/* TODO: Settings */}
      {/* Кнопки 1, 3, 5 для выбора количества rAF в кадре */}
      {/* Buttons 1, 3, 5 to select rAF count per frame */}
      {/* Переключатель "Тяжёлый rAF" */}
      {/* "Heavy rAF" toggle */}

      {/* TODO: Кнопки Старт/Стоп */}
      {/* TODO: Start/Stop buttons */}

      <div style={{ color: '#9ca3af', marginTop: '1rem', fontSize: '0.85rem' }}>
        Реализуйте визуализацию анатомии кадра
      </div>
    </div>
  )
}
