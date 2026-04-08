import React, { useState } from 'react'
import { useLanguage } from 'src/hooks'

// ============================================
// Задание 11.2: Гранулярные boundaries с retry
// ============================================
// Четыре независимых виджета в сетке 2×2.
// Каждый обёрнут в ErrorBoundary с RetryFallback.
// Глобальная кнопка «Перезагрузить все» сбрасывает все boundaries.

// TODO: Переиспользуйте или реализуйте ErrorBoundary из задания 11.1
// (FallbackProps, ErrorBoundaryProps, ErrorBoundaryState, class ErrorBoundary)

// TODO: Реализуйте RetryFallback
// Принимает: FallbackProps + maxRetries: number + widgetName: string
// - Хранит счётчик retries в useState
// - Показывает «Попытка X из N» и кнопку «Повторить»
// - При retries >= maxRetries показывает «Виджет недоступен» без кнопки
// - При нажатии «Повторить»: увеличивает retries и вызывает resetErrorBoundary
// function RetryFallback({ error, resetErrorBoundary, maxRetries, widgetName }: ...) { ... }

// TODO: Создайте четыре виджета: WeatherWidget, NewsWidget, StockWidget, CalendarWidget
// Каждый виджет:
// - Хранит state broken (useState)
// - Если broken === true — бросает new Error('<Name>: ...')
// - Показывает содержимое виджета (любые данные)
// - Имеет кнопку «Сломать»
//
// Подсказка: симулируйте ошибку через state, не через onClick напрямую:
// const [broken, setBroken] = useState(false)
// if (broken) throw new Error('...')

export function Task11_2() {
  const { t } = useLanguage()

  // TODO: Добавьте state для глобального ключа (для кнопки «Перезагрузить все»)
  // const [globalKey, setGlobalKey] = useState(0)

  return (
    <div className="exercise-container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h2 style={{ margin: 0 }}>{t('task.title')} 11.2</h2>
        {/* TODO: Кнопка «Перезагрузить все» — меняет globalKey */}
        {/* <button onClick={() => setGlobalKey(k => k + 1)}>Перезагрузить все</button> */}
      </div>

      <p style={{ color: '#888', fontStyle: 'italic' }}>
        Сетка 2×2 виджетов с RetryFallback. Каждый виджет — в отдельном ErrorBoundary.
      </p>

      {/* TODO: Разместите четыре виджета в сетке 2×2 */}
      {/* Каждый ErrorBoundary должен иметь key={`<name>-${globalKey}`} */}
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
      </div>
    </div>
  )
}
