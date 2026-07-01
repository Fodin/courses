import { useState, type ReactNode } from 'react'
import { useLanguage } from 'src/hooks'

// ============================================
// Задание 2.1 — MouseTracker с render prop
// Task 2.1 — MouseTracker with render prop
// ============================================

// TODO: Объявите интерфейс для позиции мыши
// TODO: Declare the mouse position interface
// interface MousePosition {
//   x: number
//   y: number
// }

// TODO: Объявите интерфейс пропсов MouseTracker
// TODO: Declare the MouseTracker props interface
// Компонент должен принимать render prop:
// The component should accept a render prop:
//   render: (pos: MousePosition) => ReactNode
// interface MouseTrackerProps { ... }

// TODO: Реализуйте компонент MouseTracker
// TODO: Implement the MouseTracker component
// - Используйте useState для хранения { x, y }
// - Use useState to store { x, y }
// - Повесьте onMouseMove на div-контейнер
// - Attach onMouseMove to the div container
// - Контейнер должен иметь: width: '100%', height: '200px', position: 'relative'
// - Container should have: width: '100%', height: '200px', position: 'relative'
// - Вызовите render(pos) внутри контейнера
// - Call render(pos) inside the container
// function MouseTracker({ render }: MouseTrackerProps) { ... }

export function Task2_1() {
  const { t } = useLanguage()
  return (
    <div className="exercise-container">
      <h2>{t('task.title')} 2.1 — MouseTracker</h2>

      {/* TODO: Пример 1 — Отображение координат */}
      {/* TODO: Example 1 — Display coordinates */}
      {/* Используйте MouseTracker с render prop, который отображает текст "x: ..., y: ..." */}
      {/* Use MouseTracker with a render prop that displays text "x: ..., y: ..." */}
      {/* по центру области */}
      {/* centered in the area */}
      <h3>Пример 1: Отображение координат</h3>
      <p style={{ color: '#9ca3af' }}>Реализуйте MouseTracker выше и раскомментируйте</p>
      {/*
      <MouseTracker
        render={({ x, y }) => (
          <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
            x: {x}, y: {y}
          </div>
        )}
      />
      */}

      {/* TODO: Пример 2 — Tooltip-follower */}
      {/* TODO: Example 2 — Tooltip-follower */}
      {/* Элемент следует за курсором через position: 'fixed', left: x, top: y */}
      {/* Element follows cursor via position: 'fixed', left: x, top: y */}
      <h3 style={{ marginTop: '24px' }}>Пример 2: Tooltip-follower</h3>
      <p style={{ color: '#9ca3af' }}>Реализуйте MouseTracker выше и раскомментируйте</p>
      {/*
      <MouseTracker
        render={({ x, y }) => (
          <div style={{ position: 'fixed', left: x, top: y, transform: 'translate(10px, 10px)', background: '#4338ca', color: '#fff', padding: '4px 10px', borderRadius: '6px', pointerEvents: 'none' }}>
            ({x}, {y})
          </div>
        )}
      />
      */}
    </div>
  )
}
