import { useState, type ReactNode } from 'react'
import { useLanguage } from 'src/hooks'

// Task 10.1: Suspense Mechanics
//
// Build a simplified Suspense mechanism from scratch using the thrown-promise pattern.
//
// Part 1 — createResource<T>(promise: Promise<T>): Resource<T>
//   Returns an object with a read() method:
//   - if promise is pending   → throw the promise (same object every time)
//   - if promise is fulfilled → return the resolved value
//   - if promise is rejected  → throw the error
//
//   IMPORTANT: the promise must be cached — don't create a new one on each call.
//   Without caching: each render throws a new Promise → infinite Suspense loop.
//
// Part 2 — MiniSuspense component (class-based)
//   Props: fallback (ReactNode), children (ReactNode)
//   - Use getDerivedStateFromError to catch any thrown value
//   - In componentDidCatch: if the caught value is a Promise,
//     subscribe: promise.then(() => this.setState({ caught: null }))
//   - Render: if state.caught is a Promise → show fallback
//             if state.caught is something else → show error message
//             otherwise → show children
//
// Part 3 — Demo
//   Two scenarios: fast load (1000ms) and slow load (3000ms)
//   Each has a "Загрузить" button that creates a new resource
//   A DataDisplay component that calls resource.read() in its body
//   An elapsed timer showing time since load started

// ─── TODO: implement createResource ─────────────────────────────────────────

// function createResource<T>(promise: Promise<T>): { read(): T } { ... }

// ─── TODO: implement MiniSuspense ────────────────────────────────────────────

// class MiniSuspense extends Component<...> { ... }

// ─── TODO: implement DataDisplay ────────────────────────────────────────────

// function DataDisplay({ resource }) { ... }

// ─── TODO: implement Demo ────────────────────────────────────────────────────

// function Demo({ label, delayMs, color }) { ... }

// ─── Main component ───────────────────────────────────────────────────────────

export function Task10_1() {
  const { t } = useLanguage()

  return (
    <div className="exercise-container">
      <h2>{t('task.10.1')}</h2>

      {/* TODO: render two Demo components side by side */}
      {/* <Demo label="Быстрая загрузка" delayMs={1000} color="#3b82f6" /> */}
      {/* <Demo label="Медленная загрузка" delayMs={3000} color="#8b5cf6" /> */}

      <div style={{ padding: 16, background: '#f0fdf4', borderRadius: 10, border: '2px solid #86efac' }}>
        <p>Реализуйте createResource, MiniSuspense и DataDisplay</p>
        <p style={{ fontSize: 13, color: '#6b7280' }}>
          Подсказка: MiniSuspense должен быть class-компонентом с getDerivedStateFromError
        </p>
      </div>
    </div>
  )
}
