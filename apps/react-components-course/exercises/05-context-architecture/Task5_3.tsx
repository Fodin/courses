import { useLanguage } from 'src/hooks'
import { useState, useMemo } from 'react'
import type { ReactNode, ComponentType } from 'react'

// ============================================
// Task 5.3: ComposeProviders
// Задание 5.3: ComposeProviders
// ============================================
//
// Implement ComposeProviders component that accepts an array of providers
// and composes them via reduceRight, eliminating the pyramid of doom.
//
// Реализуйте компонент ComposeProviders, который принимает массив провайдеров
// и компонует их через reduceRight, устраняя pyramid of doom.

// TODO: Define ProviderComponent type
// TODO: Определите тип ProviderComponent
// type ProviderComponent = ComponentType<{ children: ReactNode }>

// TODO: Implement ComposeProviders
// TODO: Реализуйте ComposeProviders
// interface ComposeProvidersProps {
//   providers: ProviderComponent[]
//   children: ReactNode
// }
// function ComposeProviders({ providers, children }: ComposeProvidersProps) {
//   // Use providers.reduceRight
//   // Используйте providers.reduceRight
//   // Hint: initial value — children
//   // Подсказка: начальное значение — children
//   // Hint: cast the result type as React.ReactElement
//   // Подсказка: нужно привести тип результата as React.ReactElement
// }

// TODO: Implement createStrictContext (copy from previous tasks)
// TODO: Реализуйте createStrictContext (копия из предыдущих заданий)
// function createStrictContext<T>(displayName: string) { ... }

// TODO: CounterContext
// interface CounterValue { count: number; increment: () => void; decrement: () => void }
// const [CounterCtx, useCounter] = createStrictContext<CounterValue>('Counter')
// function CounterProvider({ children }: ...) { ... useMemo ... }

// TODO: Connect providers from task 5.2
// TODO: Подключите провайдеры из задания 5.2
// (UserProvider, ThemeProvider, LocaleProvider, NotificationsProvider)
// or implement them from scratch
// или реализуйте их заново

// TODO: Implement MiniApp — uses all 5 contexts
// TODO: Реализуйте MiniApp — использует все 5 контекстов
// Shows data from each: user, mode, locale, notifications, counter
// Показывает данные из каждого: user, mode, locale, уведомления, counter
// Buttons for changing data
// Кнопки для изменения данных

export function Task5_3() {
  const { t } = useLanguage()
  return (
    <div className="exercise-container">
      <h2>{t('task.title')} 5.3</h2>
      <p style={{ color: '#888', fontStyle: 'italic', marginBottom: '1rem' }}>
        Implement ComposeProviders and compare pyramid of doom with the clean variant
      </p>

      {/* TODO: Render two blocks side by side:
          1. Pyramid of doom (5 nested providers manually)
          2. Via ComposeProviders with an array of 5 providers
          Both blocks render the same <MiniApp /> */}
      {/* TODO: Отрендерите два блока рядом:
          1. Pyramid of doom (5 вложенных провайдеров вручную)
          2. Через ComposeProviders с массивом из 5 провайдеров
          Оба блока рендерят одинаковый <MiniApp /> */}

      {/* Pyramid of doom example for comparison:
          Пример pyramid of doom для сравнения:
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

      {/* ComposeProviders example:
          Пример с ComposeProviders:
          <ComposeProviders providers={[UserProvider, ThemeProvider, LocaleProvider, NotificationsProvider, CounterProvider]}>
            <MiniApp />
          </ComposeProviders> */}

      <div style={{ padding: '2rem', background: '#f5f5f5', borderRadius: '8px', textAlign: 'center', color: '#999' }}>
        Here should be two variants: pyramid of doom and ComposeProviders
      </div>
    </div>
  )
}
