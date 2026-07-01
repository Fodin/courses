import React, { useState } from 'react'
import { useLanguage } from 'src/hooks'

// ============================================
// Задание 11.1: Базовый ErrorBoundary
// Task 11.1: Basic ErrorBoundary
// ============================================
// Реализуйте ErrorBoundary как class-компонент
// Implement ErrorBoundary as a class component
// и оберните три виджета dashboard в отдельные boundaries.
// and wrap three dashboard widgets in separate boundaries.

// TODO: Определите интерфейс для fallback-пропсов
// TODO: Define interface for fallback props
// interface FallbackProps {
//   error: Error
//   resetErrorBoundary: () => void
// }

// TODO: Определите интерфейс для пропсов ErrorBoundary
// TODO: Define interface for ErrorBoundary props
// interface ErrorBoundaryProps {
//   fallback: (props: FallbackProps) => React.ReactNode
//   children: React.ReactNode
// }

// TODO: Определите интерфейс для state ErrorBoundary
// TODO: Define interface for ErrorBoundary state
// interface ErrorBoundaryState {
//   hasError: boolean
//   error: Error | null
// }

// TODO: Реализуйте ErrorBoundary как class-компонент
// TODO: Implement ErrorBoundary as a class component
// class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
//   constructor(props: ErrorBoundaryProps) { ... }
//
//   // Вызывается в фазе рендеринга при ошибке в поддереве
//   // Called during render phase when there's an error in the subtree
//   static getDerivedStateFromError(error: Error): ErrorBoundaryState { ... }
//
//   // Вызывается после коммита — для логирования
//   // Called after commit — for logging
//   componentDidCatch(error: Error, info: React.ErrorInfo) { ... }
//
//   // Метод сброса ошибки
//   // Error reset method
//   reset = () => { ... }
//
//   render() {
//     if (this.state.hasError) {
//       return this.props.fallback({ error: ..., resetErrorBoundary: this.reset })
//     }
//     return this.props.children
//   }
// }

// TODO: Создайте компонент StatsWidget
// TODO: Create StatsWidget component
// - Хранит state broken (useState)
// - Stores broken state (useState)
// - Если broken === true — бросает new Error('StatsWidget: ...')
// - If broken === true — throws new Error('StatsWidget: ...')
// - Отображает статистику (произвольные числа)
// - Displays statistics (arbitrary numbers)
// - Имеет кнопку «Сломать», которая устанавливает broken = true
// - Has a "Break" button that sets broken = true
// function StatsWidget() { ... }

// TODO: Аналогично создайте ChartWidget и ActivityWidget
// TODO: Similarly create ChartWidget and ActivityWidget

// TODO: Создайте fallback-компонент SimpleFallback
// TODO: Create SimpleFallback component
// - Показывает сообщение об ошибке (error.message)
// - Shows error message (error.message)
// - Имеет кнопку «Восстановить», вызывающую resetErrorBoundary
// - Has a "Restore" button that calls resetErrorBoundary
// function SimpleFallback({ error, resetErrorBoundary }: FallbackProps) { ... }

export function Task11_1() {
  const { t } = useLanguage()
  return (
    <div className="exercise-container">
      <h2>{t('task.title')} 11.1</h2>
      <p style={{ color: '#888', fontStyle: 'italic' }}>
        Реализуйте ErrorBoundary и оберните каждый виджет в отдельный boundary.
        При ломании одного виджета остальные должны работать.
        {/* Implement ErrorBoundary and wrap each widget in a separate boundary.
        When one widget breaks, the others should still work. */}
      </p>

      {/* TODO: Разместите три виджета в сетке, каждый в своём ErrorBoundary */}
      {/* TODO: Place three widgets in a grid, each in its own ErrorBoundary */}
      {/* <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}> */}
      {/*   <ErrorBoundary fallback={(props) => <SimpleFallback {...props} />}> */}
      {/*     <StatsWidget /> */}
      {/*   </ErrorBoundary> */}
      {/*   ... */}
      {/* </div> */}

      <div style={{ padding: '2rem', background: '#f5f5f5', borderRadius: '8px', textAlign: 'center', color: '#999' }}>
        Здесь должны быть три виджета в отдельных Error Boundaries
        {/* Three widgets in separate Error Boundaries should be here */}
      </div>
    </div>
  )
}
