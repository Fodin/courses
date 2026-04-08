import { useLanguage } from 'src/hooks'
import { useState, useMemo } from 'react'
import type { ReactNode, ComponentType } from 'react'

// ============================================
// Задание 5.3: ComposeProviders
// ============================================
//
// Реализуйте компонент ComposeProviders, который принимает массив провайдеров
// и компонует их через reduceRight, устраняя pyramid of doom.

// TODO: Определите тип ProviderComponent
// type ProviderComponent = ComponentType<{ children: ReactNode }>

// TODO: Реализуйте ComposeProviders
// interface ComposeProvidersProps {
//   providers: ProviderComponent[]
//   children: ReactNode
// }
// function ComposeProviders({ providers, children }: ComposeProvidersProps) {
//   // Используйте providers.reduceRight
//   // Подсказка: начальное значение — children
//   // Подсказка: нужно привести тип результата as React.ReactElement
// }

// TODO: Реализуйте createStrictContext (копия из предыдущих заданий)
// function createStrictContext<T>(displayName: string) { ... }

// TODO: CounterContext
// interface CounterValue { count: number; increment: () => void; decrement: () => void }
// const [CounterCtx, useCounter] = createStrictContext<CounterValue>('Counter')
// function CounterProvider({ children }: ...) { ... useMemo ... }

// TODO: Подключите провайдеры из задания 5.2
// (UserProvider, ThemeProvider, LocaleProvider, NotificationsProvider)
// или реализуйте их заново

// TODO: Реализуйте MiniApp — использует все 5 контекстов
// Показывает данные из каждого: user, mode, locale, уведомления, counter
// Кнопки для изменения данных

export function Task5_3() {
  const { t } = useLanguage()
  return (
    <div className="exercise-container">
      <h2>{t('task.title')} 5.3</h2>
      <p style={{ color: '#888', fontStyle: 'italic', marginBottom: '1rem' }}>
        Реализуйте ComposeProviders и сравните pyramid of doom с чистым вариантом
      </p>

      {/* TODO: Отрендерите два блока рядом:
          1. Pyramid of doom (5 вложенных провайдеров вручную)
          2. Через ComposeProviders с массивом из 5 провайдеров
          Оба блока рендерят одинаковый <MiniApp /> */}

      {/* Пример pyramid of doom для сравнения:
          <UserProvider>
            <ThemeProvider>
              <LocaleProvider>
                <NotificationsProvider>
                  <CounterProvider>
                    <MiniApp />
                  </CounterProvider>
                </NotificationsProvider>
              </LocaleProvider>
            </ThemeProvider>
          </UserProvider> */}

      {/* Пример с ComposeProviders:
          <ComposeProviders providers={[UserProvider, ThemeProvider, LocaleProvider, NotificationsProvider, CounterProvider]}>
            <MiniApp />
          </ComposeProviders> */}

      <div style={{ padding: '2rem', background: '#f5f5f5', borderRadius: '8px', textAlign: 'center', color: '#999' }}>
        Здесь должны быть два варианта: pyramid of doom и ComposeProviders
      </div>
    </div>
  )
}
