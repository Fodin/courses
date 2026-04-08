import React, { useState, useCallback } from 'react'
import { useLanguage } from 'src/hooks'

// ============================================
// Задание 11.3: useErrorHandler для async-ошибок
// ============================================
// Реализуйте хук useErrorHandler, который пробрасывает
// async-ошибки и ошибки из event-хендлеров в ближайший Error Boundary.

// TODO: Реализуйте хук useErrorHandler
// - Использует useState<null>(null) — нас интересует только setState
// - Возвращает функцию (error: Error) => void
// - При вызове делает: setState(() => { throw error })
//   Это пробрасывает ошибку в фазу рендеринга, где её поймает boundary
// - Оберните возвращаемую функцию в useCallback для стабильной ссылки
//
// function useErrorHandler() {
//   const [, setState] = useState<null>(null)
//   return useCallback((error: Error) => {
//     setState(() => { throw error })
//   }, [])
// }

// TODO: Реализуйте ErrorBoundary (из задания 11.1 или заново)

// TODO: Создайте AsyncDataWidget
// - Принимает handleError = useErrorHandler() внутри компонента
// - State: loading, data (string | null), mode ('success' | 'error')
// - Кнопка «Загрузить данные» запускает:
//   1. setLoading(true)
//   2. await new Promise(resolve => setTimeout(resolve, 1200))
//   3. Если mode === 'error': вызывает handleError(new Error('...'))
//   4. Если mode === 'success': setData('Данные загружены: ...')
// - Два radio-переключателя: «Режим: успех» / «Режим: ошибка»
// function AsyncDataWidget() { ... }

// TODO: Создайте EventErrorWidget
// - Принимает handleError = useErrorHandler() внутри компонента
// - Кнопка «Выполнить действие»: в onClick вызывает handleError(new Error('...'))
// - Показывает объяснение: «ошибка из onClick пробрасывается через useErrorHandler»
// function EventErrorWidget() { ... }

export function Task11_3() {
  const { t } = useLanguage()

  // TODO: Добавьте keys для сброса каждого boundary
  // const [asyncKey, setAsyncKey] = useState(0)
  // const [eventKey, setEventKey] = useState(0)

  return (
    <div className="exercise-container">
      <h2>{t('task.title')} 11.3</h2>
      <p style={{ color: '#888', fontStyle: 'italic' }}>
        useErrorHandler позволяет пробрасывать async-ошибки и ошибки из event-хендлеров в ближайший Error Boundary.
      </p>

      {/* TODO: Разместите два виджета в сетке 2 колонки, каждый в ErrorBoundary */}
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

      <div style={{ padding: '2rem', background: '#f5f5f5', borderRadius: '8px', textAlign: 'center', color: '#999' }}>
        Здесь должны быть AsyncDataWidget и EventErrorWidget в отдельных ErrorBoundary
      </div>
    </div>
  )
}
