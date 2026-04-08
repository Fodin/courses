import React, { useState } from 'react'
import { useLanguage } from 'src/hooks'

// ============================================
// Задание 11.2: Гранулярные boundaries с retry
// Task 11.2: Granular boundaries with retry
// ============================================
// Четыре независимых виджета в сетке 2×2.
// Four independent widgets in a 2×2 grid.
// Каждый обёрнут в ErrorBoundary с RetryFallback.
// Each wrapped in ErrorBoundary with RetryFallback.
// Глобальная кнопка «Перезагрузить все» сбрасывает все boundaries.
// Global "Reload all" button resets all boundaries.

// TODO: Переиспользуйте или реализуйте ErrorBoundary из задания 11.1
// TODO: Reuse or implement ErrorBoundary from task 11.1
// (FallbackProps, ErrorBoundaryProps, ErrorBoundaryState, class ErrorBoundary)

// TODO: Реализуйте RetryFallback
// TODO: Implement RetryFallback
// Принимает: FallbackProps + maxRetries: number + widgetName: string
// Accepts: FallbackProps + maxRetries: number + widgetName: string
// - Хранит счётчик retries в useState
// - Stores retries counter in useState
// - Показывает «Попытка X из N» и кнопку «Повторить»
// - Shows "Attempt X of N" and a "Retry" button
// - При retries >= maxRetries показывает «Виджет недоступен» без кнопки
// - When retries >= maxRetries shows "Widget unavailable" without button
// - При нажатии «Повторить»: увеличивает retries и вызывает resetErrorBoundary
// - On "Retry" click: increments retries and calls resetErrorBoundary
// function RetryFallback({ error, resetErrorBoundary, maxRetries, widgetName }: ...) { ... }

// TODO: Создайте четыре виджета: WeatherWidget, NewsWidget, StockWidget, CalendarWidget
// TODO: Create four widgets: WeatherWidget, NewsWidget, StockWidget, CalendarWidget
// Каждый виджет:
// Each widget:
// - Хранит state broken (useState)
// - Stores broken state (useState)
// - Если broken === true — бросает new Error('<Name>: ...')
// - If broken === true — throws new Error('<Name>: ...')
// - Показывает содержимое виджета (любые данные)
// - Shows widget content (any data)
// - Имеет кнопку «Сломать»
// - Has a "Break" button
//
// Подсказка: симулируйте ошибку через state, не через onClick напрямую:
// Hint: simulate error via state, not directly through onClick:
// const [broken, setBroken] = useState(false)
// if (broken) throw new Error('...')

export function Task11_2() {
  const { t } = useLanguage()

  // TODO: Добавьте state для глобального ключа (для кнопки «Перезагрузить все»)
  // TODO: Add state for global key (for the "Reload all" button)
  // const [globalKey, setGlobalKey] = useState(0)

  return (
    <div className="exercise-container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h2 style={{ margin: 0 }}>{t('task.title')} 11.2</h2>
        {/* TODO: Кнопка «Перезагрузить все» — меняет globalKey */}
        {/* TODO: "Reload all" button — changes globalKey */}
        {/* <button onClick={() => setGlobalKey(k => k + 1)}>Перезагрузить все</button> */}
      </div>

      <p style={{ color: '#888', fontStyle: 'italic' }}>
        Сетка 2×2 виджетов с RetryFallback. Каждый виджет — в отдельном ErrorBoundary.
        {/* 2×2 grid of widgets with RetryFallback. Each widget in its own ErrorBoundary. */}
      </p>

      {/* TODO: Разместите четыре виджета в сетке 2×2 */}
      {/* TODO: Place four widgets in a 2×2 grid */}
      {/* Каждый ErrorBoundary должен иметь key={`<name>-${globalKey}`} */}
      {/* Each ErrorBoundary should have key={`<name>-${globalKey}`} */}
      {/* <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}> */}
      {/*   <ErrorBoundary */}
      {/*     key={`weather-${globalKey}`} */}
      {/*     fallback={(props) => <RetryFallback {...props} maxRetries={3} widgetName="Погода" />} */}
      {/*   > */}
      {/*     <WeatherWidget /> */}
      {/*   </ErrorBoundary> */}
      {/*   ... */}
      {/* </div> */}

      <div style={{ padding: '2rem', background: '#f5f5f5', borderRadius: '8px', textAlign: 'center', color: '#999' }}>
        Здесь должна быть сетка 2×2 с четырьмя виджетами
        {/* A 2×2 grid with four widgets should be here */}
      </div>
    </div>
  )
}
