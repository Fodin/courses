import { useState, useEffect } from 'react'
import React from 'react'
import { useLanguage } from 'src/hooks'

// ============================================
// Задание 4.4: Рефакторинг withWindowSize → useWindowSize
// ============================================
//
// Дан HOC withWindowSize — используйте его для ResponsiveLayoutHOC.
// Затем реализуйте хук useWindowSize и сделайте ResponsiveLayoutHook.
// Сравните оба подхода.
//
// Брейкпоинты:
//   < 640px  → mobile
//   640-1024px → tablet
//   > 1024px → desktop

// ---- Часть 1: HOC withWindowSize (дано) ----

interface WithWindowSizeProps {
  windowWidth: number
  windowHeight: number
}

// HOC withWindowSize добавляет windowWidth и windowHeight в пропсы компонента
function withWindowSize<P extends object>(
  Component: React.ComponentType<P & WithWindowSizeProps>
) {
  const WithWindowSize = (props: P) => {
    const [size, setSize] = useState({
      width: typeof window !== 'undefined' ? window.innerWidth : 0,
      height: typeof window !== 'undefined' ? window.innerHeight : 0,
    })

    useEffect(() => {
      const handleResize = () =>
        setSize({ width: window.innerWidth, height: window.innerHeight })
      window.addEventListener('resize', handleResize)
      return () => window.removeEventListener('resize', handleResize)
    }, [])

    return <Component {...props} windowWidth={size.width} windowHeight={size.height} />
  }
  WithWindowSize.displayName = `withWindowSize(${Component.displayName ?? Component.name ?? 'Component'})`
  return WithWindowSize
}

// ---- TODO: Реализуйте ResponsiveLayoutInner (для HOC-версии) ----
//
// Компонент принимает windowWidth и windowHeight через пропсы (от HOC)
// Определяет breakpoint: mobile / tablet / desktop
// Отображает текущий размер и название брейкпоинта
// Меняет цвет фона в зависимости от брейкпоинта

function ResponsiveLayoutInner({ windowWidth, windowHeight }: WithWindowSizeProps) {
  // TODO: определите breakpoint на основе windowWidth
  // const breakpoint = windowWidth < 640 ? 'mobile' : windowWidth < 1024 ? 'tablet' : 'desktop'

  return (
    <div style={{ padding: '1rem', background: '#fef9c3', borderRadius: '8px', border: '1px solid #fbbf24' }}>
      <div style={{ fontWeight: 600, marginBottom: '0.5rem' }}>HOC-версия: withWindowSize</div>
      {/* TODO: отобразите windowWidth × windowHeight и breakpoint */}
      <div style={{ fontSize: '0.9rem', color: '#92400e' }}>
        TODO: {windowWidth} × {windowHeight}
      </div>
    </div>
  )
}

// TODO: Создайте компонент ResponsiveLayoutHOC через withWindowSize ЗДЕСЬ (вне рендера!)
// const ResponsiveLayoutHOC = withWindowSize(ResponsiveLayoutInner)

// ---- Часть 2: TODO — реализуйте хук useWindowSize ----
//
// Возвращает { width: number, height: number }
// Та же логика с addEventListener('resize', ...)
// Не забудьте cleanup — removeEventListener

// function useWindowSize() {
//   const [size, setSize] = useState({ ... })
//   useEffect(() => { ... }, [])
//   return size
// }

// ---- TODO: Реализуйте ResponsiveLayoutHook ----
//
// Функционально идентичен ResponsiveLayoutHOC, но использует useWindowSize()
// Отображает те же данные: размер и breakpoint

function ResponsiveLayoutHook() {
  // TODO: const { width, height } = useWindowSize()

  return (
    <div style={{ padding: '1rem', background: '#fef9c3', borderRadius: '8px', border: '1px solid #fbbf24' }}>
      <div style={{ fontWeight: 600, marginBottom: '0.5rem' }}>Хук-версия: useWindowSize</div>
      {/* TODO: отобразите width × height и breakpoint */}
      <div style={{ fontSize: '0.9rem', color: '#92400e' }}>
        TODO: реализуйте useWindowSize и используйте здесь
      </div>
    </div>
  )
}

// ---- Таблица сравнения (заполните после реализации) ----

const COMPARISON = [
  { label: 'Строк кода', hoc: '?', hook: '?' },
  { label: 'Слой в DevTools', hoc: 'withWindowSize(Component)', hook: '?' },
  { label: 'Тестирование', hoc: '?', hook: '?' },
  { label: 'Переиспользование', hoc: '?', hook: '?' },
]

export function Task4_4() {
  const { t } = useLanguage()

  return (
    <div className="exercise-container">
      <h2>{t('task.title')} 4.4 — withWindowSize → useWindowSize</h2>
      <p style={{ color: '#64748b', marginBottom: '1.25rem', fontSize: '0.9rem' }}>
        Используйте готовый withWindowSize для HOC-версии. Реализуйте хук useWindowSize для хук-версии.
        Измените размер окна — оба компонента должны обновляться синхронно.
      </p>

      <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: 260 }}>
          {/* TODO: замените на <ResponsiveLayoutHOC /> */}
          <div style={{ padding: '1rem', background: '#fef9c3', borderRadius: '8px', color: '#92400e', fontSize: '0.85rem' }}>
            TODO: ResponsiveLayoutHOC (через withWindowSize)
          </div>
        </div>

        <div style={{ flex: 1, minWidth: 260 }}>
          <ResponsiveLayoutHook />
        </div>
      </div>

      {/* Таблица сравнения */}
      <div style={{ padding: '1rem', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
        <div style={{ fontWeight: 600, color: '#1e293b', marginBottom: '0.75rem', fontSize: '0.9rem' }}>
          TODO: Заполните таблицу сравнения после реализации обоих вариантов
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #e2e8f0' }}>
              <th style={{ padding: '0.5rem 0.75rem', textAlign: 'left', color: '#64748b', fontWeight: 600 }}>Критерий</th>
              <th style={{ padding: '0.5rem 0.75rem', textAlign: 'left', color: '#7c3aed', fontWeight: 600 }}>HOC</th>
              <th style={{ padding: '0.5rem 0.75rem', textAlign: 'left', color: '#0284c7', fontWeight: 600 }}>Хук</th>
            </tr>
          </thead>
          <tbody>
            {COMPARISON.map((row, i) => (
              <tr key={i} style={{ borderBottom: '1px solid #f1f5f9' }}>
                <td style={{ padding: '0.5rem 0.75rem', color: '#475569', fontWeight: 500 }}>{row.label}</td>
                <td style={{ padding: '0.5rem 0.75rem', color: '#7c3aed' }}>{row.hoc}</td>
                <td style={{ padding: '0.5rem 0.75rem', color: '#0284c7' }}>{row.hook}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
