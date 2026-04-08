import React, { useState, useCallback } from 'react'
import { useLanguage } from 'src/hooks'

// ============================================
// Задание 11.3: useErrorHandler для async-ошибок
// Task 11.3: useErrorHandler for async errors
// ============================================
// Реализуйте хук useErrorHandler, который пробрасывает
// Implement a useErrorHandler hook that propagates
// async-ошибки и ошибки из event-хендлеров в ближайший Error Boundary.
// async errors and event handler errors to the nearest Error Boundary.

// TODO: Реализуйте хук useErrorHandler
// TODO: Implement useErrorHandler hook
// - Использует useState<null>(null) — нас интересует только setState
// - Uses useState<null>(null) — we only care about setState
// - Возвращает функцию (error: Error) => void
// - Returns a function (error: Error) => void
// - При вызове делает: setState(() => { throw error })
// - On call, does: setState(() => { throw error })
//   Это пробрасывает ошибку в фазу рендеринга, где её поймает boundary
//   This propagates the error to the render phase, where the boundary will catch it
// - Оберните возвращаемую функцию в useCallback для стабильной ссылки
// - Wrap the returned function in useCallback for a stable reference
//
// function useErrorHandler() {
//   const [, setState] = useState<null>(null)
//   return useCallback((error: Error) => {
//     setState(() => { throw error })
//   }, [])
// }

// TODO: Реализуйте ErrorBoundary (из задания 11.1 или заново)
// TODO: Implement ErrorBoundary (from task 11.1 or from scratch)

// TODO: Создайте AsyncDataWidget
// TODO: Create AsyncDataWidget
// - Принимает handleError = useErrorHandler() внутри компонента
// - Uses handleError = useErrorHandler() inside the component
// - State: loading, data (string | null), mode ('success' | 'error')
// - Кнопка «Загрузить данные» запускает:
// - "Load data" button triggers:
//   1. setLoading(true)
//   2. await new Promise(resolve => setTimeout(resolve, 1200))
//   3. Если mode === 'error': вызывает handleError(new Error('...'))
//   3. If mode === 'error': calls handleError(new Error('...'))
//   4. Если mode === 'success': setData('Данные загружены: ...')
//   4. If mode === 'success': setData('Data loaded: ...')
// - Два radio-переключателя: «Режим: успех» / «Режим: ошибка»
// - Two radio buttons: "Mode: success" / "Mode: error"
// function AsyncDataWidget() { ... }

// TODO: Создайте EventErrorWidget
// TODO: Create EventErrorWidget
// - Принимает handleError = useErrorHandler() внутри компонента
// - Uses handleError = useErrorHandler() inside the component
// - Кнопка «Выполнить действие»: в onClick вызывает handleError(new Error('...'))
// - "Execute action" button: calls handleError(new Error('...')) in onClick
// - Показывает объяснение: «ошибка из onClick пробрасывается через useErrorHandler»
// - Shows explanation: "error from onClick propagates via useErrorHandler"
// function EventErrorWidget() { ... }

export function Task11_3() {
  const { t } = useLanguage()

  // TODO: Добавьте keys для сброса каждого boundary
  // TODO: Add keys for resetting each boundary
  // const [asyncKey, setAsyncKey] = useState(0)
  // const [eventKey, setEventKey] = useState(0)

  return (
    <div className="exercise-container">
      <h2>{t('task.title')} 11.3</h2>
      <p style={{ color: '#888', fontStyle: 'italic' }}>
        useErrorHandler позволяет пробрасывать async-ошибки и ошибки из event-хендлеров в ближайший Error Boundary.
        {/* useErrorHandler allows propagating async errors and event handler errors to the nearest Error Boundary. */}
      </p>

      {/* TODO: Разместите два виджета в сетке 2 колонки, каждый в ErrorBoundary */}
      {/* TODO: Place two widgets in a 2-column grid, each in an ErrorBoundary */}
      {/* <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}> */}
      {/*   <ErrorBoundary */}
      {/*     key={asyncKey} */}
      {/*     fallback={({ error, resetErrorBoundary }) => ( */}
      {/*       <SimpleFallback error={error} resetErrorBoundary={() => { */}
      {/*         resetErrorBoundary() */}
      {/*         setAsyncKey(k => k + 1) */}
      {/*       }} /> */}
      {/*     )} */}
      {/*   > */}
      {/*     <AsyncDataWidget /> */}
      {/*   </ErrorBoundary> */}
      {/*   <ErrorBoundary key={eventKey} fallback={...}> */}
      {/*     <EventErrorWidget /> */}
      {/*   </ErrorBoundary> */}
      {/* </div> */}

      {/* TODO: Добавьте блок с объяснением механизма useErrorHandler */}
      {/* TODO: Add a block explaining the useErrorHandler mechanism */}

      <div style={{ padding: '2rem', background: '#f5f5f5', borderRadius: '8px', textAlign: 'center', color: '#999' }}>
        Здесь должны быть AsyncDataWidget и EventErrorWidget в отдельных ErrorBoundary
        {/* AsyncDataWidget and EventErrorWidget in separate ErrorBoundaries should be here */}
      </div>
    </div>
  )
}
