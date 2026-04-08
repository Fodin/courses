import React, { useState } from 'react'
import { useLanguage } from 'src/hooks'

// ============================================
// Задание 11.1: Базовый ErrorBoundary
// ============================================
// Реализуйте ErrorBoundary как class-компонент
// и оберните три виджета dashboard в отдельные boundaries.

// TODO: Определите интерфейс для fallback-пропсов
// interface FallbackProps {
//   error: Error
//   resetErrorBoundary: () => void
// }

// TODO: Определите интерфейс для пропсов ErrorBoundary
// interface ErrorBoundaryProps {
//   fallback: (props: FallbackProps) => React.ReactNode
//   children: React.ReactNode
// }

// TODO: Определите интерфейс для state ErrorBoundary
// interface ErrorBoundaryState {
//   hasError: boolean
//   error: Error | null
// }

// TODO: Реализуйте ErrorBoundary как class-компонент
// class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
//   constructor(props: ErrorBoundaryProps) { ... }
//
//   // Вызывается в фазе рендеринга при ошибке в поддереве
//   static getDerivedStateFromError(error: Error): ErrorBoundaryState { ... }
//
//   // Вызывается после коммита — для логирования
//   componentDidCatch(error: Error, info: React.ErrorInfo) { ... }
//
//   // Метод сброса ошибки
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
// - Хранит state broken (useState)
// - Если broken === true — бросает new Error('StatsWidget: ...')
// - Отображает статистику (произвольные числа)
// - Имеет кнопку «Сломать», которая устанавливает broken = true
// function StatsWidget() { ... }

// TODO: Аналогично создайте ChartWidget и ActivityWidget

// TODO: Создайте fallback-компонент SimpleFallback
// - Показывает сообщение об ошибке (error.message)
// - Имеет кнопку «Восстановить», вызывающую resetErrorBoundary
// function SimpleFallback({ error, resetErrorBoundary }: FallbackProps) { ... }

export function Task11_1() {
  const { t } = useLanguage()
  return (
    <div className="exercise-container">
      <h2>{t('task.title')} 11.1</h2>
      <p style={{ color: '#888', fontStyle: 'italic' }}>
        Реализуйте ErrorBoundary и оберните каждый виджет в отдельный boundary.
        При ломании одного виджета остальные должны работать.
      </p>

      {/* TODO: Разместите три виджета в сетке, каждый в своём ErrorBoundary */}
      {/* <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}> */}
      {/*   <ErrorBoundary fallback={(props) => <SimpleFallback {...props} />}> */}
      {/*     <StatsWidget /> */}
      {/*   </ErrorBoundary> */}
      {/*   ... */}
      {/* </div> */}

      <div style={{ padding: '2rem', background: '#f5f5f5', borderRadius: '8px', textAlign: 'center', color: '#999' }}>
        Здесь должны быть три виджета в отдельных Error Boundaries
      </div>
    </div>
  )
}
